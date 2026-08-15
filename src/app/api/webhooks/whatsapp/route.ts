import { NextResponse } from "next/server";
import { z } from "zod";
import {
  dentroDoTetoGlobal,
  identificarChamador,
  verificarLimiteDuravel,
} from "@/lib/rate-limit";
import { comparaSegredo } from "@/lib/token";
import { assinaturaConfere } from "@/lib/whatsapp";
import {
  processarMensagemRecebida,
  type MensagemRecebida,
  type ResultadoProcessamento,
} from "@/lib/whatsapp-mensagem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Recepção do WhatsApp Cloud API — o acionamento direto.
 *
 * Até esta rodada, o modo confirmação exigia o Willian no meio: ele ouvia o
 * áudio, transcrevia com a ferramenta local e escrevia lead + confirmation_token
 * direto no banco por SQL. `store.ts` já sabia gravar o token, mas nenhum
 * código o chamava. Agora a mensagem dela faz o percurso inteiro sozinha.
 *
 * SEGURANÇA — este endpoint é público e CRIA lead e token de confirmação:
 *  - Sem `WHATSAPP_APP_SECRET`, o POST responde 503 e não processa nada. Aberto,
 *    qualquer um forjaria uma confissão em nome de qualquer número.
 *  - A assinatura é HMAC-SHA256 do CORPO CRU, conferida em tempo constante. A
 *    Meta assina o payload com unicode escapado: calcular sobre um JSON
 *    reserializado dá outra assinatura, e todo lead brasileiro manda acento. Por
 *    isso `req.text()` vem antes de qualquer parse, e o parse usa a mesma string.
 *  - Sem `WHATSAPP_VERIFY_TOKEN`, o GET de verificação responde 503.
 *  - `metadata.phone_number_id` é conferido contra `WHATSAPP_PHONE_NUMBER_ID` quando
 *    essa env existe: payload de outro número é reconhecido com 200 e ignorado.
 *    Sem a env configurada o filtro fica desligado — degradação graciosa, igual
 *    ao resto da integração, não uma checagem que falha aberta por descuido.
 *  - Nada do corpo decide algo sensível. O nome do perfil é rótulo; o número é
 *    normalizado por nós; o token é gerado por `randomBytes`, nunca recebido.
 *
 * IDEMPOTÊNCIA — a Meta reentrega até receber 200. Cada `messages[].id` (wamid)
 * é reservado em `mensagens_whatsapp` antes do trabalho caro; reentrega bate na
 * primary key e vira no-op sem segunda transcrição nem segundo lead.
 */

export async function GET(req: Request) {
  const esperado = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!esperado) {
    console.error("[tailor] verificação de webhook sem WHATSAPP_VERIFY_TOKEN — recusada");
    return NextResponse.json({ erro: "webhook_nao_configurado" }, { status: 503 });
  }

  const url = new URL(req.url);
  const modo = url.searchParams.get("hub.mode");
  const recebido = url.searchParams.get("hub.verify_token");
  const desafio = url.searchParams.get("hub.challenge") ?? "";

  if (modo !== "subscribe" || !recebido || !comparaSegredo(recebido, esperado)) {
    return NextResponse.json({ erro: "nao_autorizado" }, { status: 403 });
  }

  // A doc descreve o challenge como um int. Validar o formato evita que este
  // endereço vire um refletor de conteúdo arbitrário para quem já saiba o token.
  if (!/^[0-9]{1,32}$/.test(desafio)) {
    return NextResponse.json({ erro: "desafio_invalido" }, { status: 400 });
  }

  // Texto puro, só o valor — sem JSON, sem aspas. É o que a Meta espera.
  return new NextResponse(desafio, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

const Midia = z.object({
  id: z.string().max(200),
  mime_type: z.string().max(120).optional(),
  sha256: z.string().max(200).optional(),
  voice: z.boolean().optional(),
  url: z.string().max(2000).optional(),
});

const Mensagem = z.object({
  id: z.string().max(300),
  from: z.string().max(30),
  timestamp: z.string().max(20),
  type: z.string().max(40),
  text: z.object({ body: z.string().max(8000) }).optional(),
  audio: Midia.optional(),
});

const Contato = z.object({
  wa_id: z.string().max(30),
  profile: z.object({ name: z.string().max(200).optional() }).optional(),
});

const Mudanca = z.object({
  field: z.string().max(60),
  value: z.object({
    messaging_product: z.string().max(40).optional(),
    metadata: z.object({ phone_number_id: z.string().max(60).optional() }).optional(),
    contacts: z.array(Contato).max(50).optional(),
    messages: z.array(Mensagem).max(50).optional(),
    statuses: z.array(z.unknown()).max(100).optional(),
  }),
});

const Corpo = z.object({
  object: z.string().max(80),
  entry: z
    .array(z.object({ id: z.string().max(80).optional(), changes: z.array(Mudanca).max(20) }))
    .max(20),
});

/**
 * 3 MB é o teto declarado do payload da Meta. Isto é conferência de bom senso
 * sobre o texto já decodificado — `req.text()` já bufferizou tudo antes desta
 * checagem, e `.length` conta unidades UTF-16, não bytes — não é um guarda de
 * memória de verdade. Um guarda real inspecionaria `Content-Length` antes de
 * ler o corpo; não vale o esforço aqui: o runtime da função já impõe um teto
 * de corpo bem menor do que isto antes da requisição chegar ao handler.
 */
const TAMANHO_MAXIMO_CORPO = 3 * 1024 * 1024;

export async function POST(req: Request) {
  // Alto de propósito (revisão de 14/08/2026): quem chama esta rota é sempre a
  // borda da Meta, não a lead — `identificarChamador` aqui identifica o
  // entregador, não o remetente. Um teto apertado por IP arrisca 429 num pico
  // de reentrega da própria Meta, e reentrega falhando repetidas vezes é o que
  // faz a Meta desativar a assinatura do webhook. A assinatura HMAC já
  // autentica o chamador; quem de fato precisa de teto apertado é o número que
  // manda a mensagem (`LIMITE_POR_REMETENTE` em whatsapp-mensagem.ts) e o custo
  // agregado (`dentroDoTetoGlobal` abaixo). Este aqui só existe contra tráfego
  // patológico vindo de fora da Meta.
  const limite = await verificarLimiteDuravel(
    `whatsapp:${identificarChamador(req)}`,
    3000,
    60
  );
  if (!limite.permitido) {
    return NextResponse.json(
      { erro: "muitas_requisicoes" },
      { status: 429, headers: { "Retry-After": String(limite.reiniciaEmSegundos) } }
    );
  }

  if (!process.env.WHATSAPP_APP_SECRET) {
    console.error("[tailor] webhook do WhatsApp chamado sem WHATSAPP_APP_SECRET — recusado");
    return NextResponse.json({ erro: "webhook_nao_configurado" }, { status: 503 });
  }

  // O corpo CRU, antes de qualquer parse — a assinatura depende byte a byte.
  let corpoCru: string;
  try {
    corpoCru = await req.text();
  } catch {
    return NextResponse.json({ erro: "corpo_ilegivel" }, { status: 400 });
  }
  if (corpoCru.length > TAMANHO_MAXIMO_CORPO) {
    return NextResponse.json({ erro: "corpo_grande_demais" }, { status: 413 });
  }

  if (!assinaturaConfere(corpoCru, req.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ erro: "nao_autorizado" }, { status: 401 });
  }

  let bruto: unknown;
  try {
    bruto = JSON.parse(corpoCru);
  } catch {
    return NextResponse.json({ erro: "json_invalido" }, { status: 400 });
  }

  const analise = Corpo.safeParse(bruto);
  if (!analise.success) {
    return NextResponse.json({ erro: "corpo_invalido" }, { status: 400 });
  }

  if (analise.data.object !== "whatsapp_business_account") {
    return NextResponse.json({ ok: true, ignorado: analise.data.object });
  }

  const nosso = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recebidas: MensagemRecebida[] = [];
  let naoSuportadas = 0;
  let deOutroNumero = 0;

  // `entry` e `changes` são arrays e vêm com mais de um item — iterar, nunca [0].
  for (const entrada of analise.data.entry) {
    for (const mudanca of entrada.changes) {
      // `statuses` (entrega/leitura das NOSSAS mensagens) chega no mesmo campo.
      if (mudanca.field !== "messages") continue;
      const valor = mudanca.value;
      if (!valor.messages?.length) continue;

      const numero = valor.metadata?.phone_number_id;
      if (nosso && numero && numero !== nosso) {
        deOutroNumero += 1;
        continue;
      }

      const perfis = new Map(
        (valor.contacts ?? []).map((c) => [c.wa_id, c.profile?.name ?? null])
      );

      for (const msg of valor.messages) {
        if (msg.type !== "text" && msg.type !== "audio") {
          naoSuportadas += 1;
          continue;
        }
        const timestamp = Number(msg.timestamp);
        recebidas.push({
          wamid: msg.id,
          de: msg.from,
          nomePerfil: perfis.get(msg.from) ?? null,
          timestamp: Number.isFinite(timestamp) ? timestamp : Math.floor(Date.now() / 1000),
          tipo: msg.type,
          texto: msg.text?.body ?? null,
          audioId: msg.audio?.id ?? null,
          audioMime: msg.audio?.mime_type ?? null,
        });
      }
    }
  }

  if (recebidas.length === 0) {
    return NextResponse.json({ ok: true, naoSuportadas, deOutroNumero });
  }

  // Cada mensagem pode custar transcrição + análise. O teto global é a única
  // proteção que não depende de cabeçalho. 503 (e não 200) porque a Meta
  // reentrega: melhor atrasar a resposta do que perder o que ela contou.
  if (!(await dentroDoTetoGlobal("whatsapp"))) {
    return NextResponse.json({ erro: "temporariamente_indisponivel" }, { status: 503 });
  }

  try {
    // Sequencial, não Promise.all: duas mensagens do mesmo número no mesmo POST
    // criariam dois leads em paralelo.
    const resultados: ResultadoProcessamento[] = [];
    for (const mensagem of recebidas) {
      resultados.push(await processarMensagemRecebida(mensagem));
    }
    return NextResponse.json({ ok: true, resultados, naoSuportadas });
  } catch (erro) {
    // 500 faz a Meta reentregar — e a reserva do wamid já foi liberada pelo
    // fluxo, então a reentrega realmente reprocessa.
    console.error("[tailor] falha ao processar webhook do WhatsApp", erro);
    return NextResponse.json({ erro: "falha_ao_processar" }, { status: 500 });
  }
}
