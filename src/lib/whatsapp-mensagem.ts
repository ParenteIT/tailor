import "server-only";
import { analisarRespostas } from "@/lib/analise";
import { variantesDeWhatsapp } from "@/lib/quiz-state";
import { verificarLimiteDuravel } from "@/lib/rate-limit";
import { TokenEmUso, getStore, type DadosRespostas, type Store } from "@/lib/store";
import { gerarTokenProposta } from "@/lib/token";
import { transcrever, transcricaoDisponivel } from "@/lib/transcricao";
import {
  baixarMidia,
  enviarTemplate,
  enviarTexto,
  templateConfigurado,
  type ResultadoEnvio,
} from "@/lib/whatsapp";

/**
 * O que uma mensagem de WhatsApp vira dentro do Tailor.
 *
 * Ela manda texto ou áudio para o número comercial. Ao fim desta função existe
 * um lead com `confirmation_token`, o verbatim gravado no mesmo lugar de onde
 * `confirmacao-server.ts` sempre leu (`respostas_raw.ouvido`), e um link no
 * WhatsApp dela. Era o que o Willian fazia à mão com SQL.
 *
 * REGRA DE confirmacao.ts: verbatim sem resposta real por trás é descartado em
 * silêncio na tela. Por isso só a etapa `q3` é pré-respondida — é a única das
 * três (`espelho`, `q3`, `gap`) que uma frase solta sustenta. `espelho` exige
 * persona + situação e `gap` exige três números; inventá-los a partir de um
 * áudio seria pôr palavra na boca dela.
 */

const JANELA_ATENDIMENTO_MS = 24 * 60 * 60 * 1000 - 5 * 60 * 1000;
const LIMITE_POR_REMETENTE = 5;

export interface MensagemRecebida {
  wamid: string;
  de: string;
  nomePerfil: string | null;
  /** epoch em segundos, como a Meta manda (string no payload). */
  timestamp: number;
  tipo: string;
  texto: string | null;
  audioId: string | null;
  audioMime: string | null;
}

export type StatusProcessamento =
  | "processada"
  | "duplicada"
  | "sem_transcricao"
  | "tipo_nao_suportado"
  | "limite_do_remetente";

export interface ResultadoProcessamento {
  status: StatusProcessamento;
  leadId?: string;
  respondido?: boolean;
  motivo?: string;
}

export async function processarMensagemRecebida(
  m: MensagemRecebida
): Promise<ResultadoProcessamento> {
  // Checar o teto ANTES de reservar o wamid é só ordem barata: reservar grava
  // no banco, e não vale gastar essa escrita numa mensagem que vai ser
  // descartada por limite de qualquer forma. Não é proteção do wamid em si —
  // a rota devolve 200 para `limite_do_remetente` (route.ts), então a Meta não
  // reentrega esse caso de qualquer maneira.
  //
  // A chave usa a MESMA variante canônica que a busca de lead usa (`numeros[0]`
  // abaixo) — não `m.de` cru. Sem isso, a mesma mulher mandando com e sem o
  // nono dígito ganharia dois baldes separados, driblando o próprio teto que
  // esta linha existe para impor.
  const chaveRemetente = variantesDeWhatsapp(m.de)[0];
  const limite = await verificarLimiteDuravel(
    `whatsapp-remetente:${chaveRemetente}`,
    LIMITE_POR_REMETENTE,
    60
  );
  if (!limite.permitido) {
    console.error(`[tailor] remetente ${m.de} acima do limite — mensagem ignorada`);
    return { status: "limite_do_remetente" };
  }

  const store = getStore();

  // A Meta reentrega até receber 200; sem isto, cada reentrega seria outra
  // transcrição paga e outro lead.
  if (!(await store.reservarMensagemWhatsapp(m.wamid, null))) {
    return { status: "duplicada" };
  }

  try {
    const numeros = variantesDeWhatsapp(m.de);
    // RISCO ACEITO, registrado na revisão de 14/08/2026: a busca casa por
    // número em QUALQUER origem, inclusive lead criado pelo quiz. Se alguém
    // digitar o WhatsApp de outra pessoa no quiz (nada impede — o número não é
    // verificado ali), e essa outra pessoa mais tarde mandar mensagem de
    // verdade para o número comercial, esta consulta "adota" o lead do quiz: a
    // dona real do número recebe um link de confirmação sobre respostas que
    // nunca deu. Vazamento estreito (quem vê é a dona do próprio número, não
    // um terceiro) e a cadeia de ataque é convoluta (saber o número de alguém
    // + fazer essa pessoa escrever pro WhatsApp da Renilza), mas é real e a
    // pergunta é sensível o bastante (confissão pessoal) para registrar em vez
    // de deixar implícito. Mitigação não implementada nesta rodada: exigiria
    // ou não adotar lead sem confirmationToken prévio (nasce um lead novo em
    // vez de herdar respostas alheias), ou verificar o número no quiz antes de
    // aceitá-lo — as duas são decisão de produto, não bug de código.
    const existente = await store.buscarLeadPorWhatsapp(numeros);
    const recebidaEm = new Date(m.timestamp * 1000);

    const { texto, via } = await extrairTexto(m);

    const nome = existente?.nome ?? nomeSeguro(m.nomePerfil);
    let leadId: string;
    let token: string;

    if (existente) {
      leadId = existente.id;
      // Trocar o token invalidaria o link que ela recebeu ontem e ainda pode
      // estar aberto no celular dela.
      if (existente.confirmationToken) {
        token = existente.confirmationToken;
        await store.registrarContatoWhatsapp(leadId, { recebidaEm });
      } else {
        token = await gravarTokenNovo(store, leadId, recebidaEm);
      }
    } else {
      token = gerarTokenProposta();
      leadId = await store.upsertLead(null, {
        nome,
        whatsapp: numeros[0],
        persona: null,
        origem: "confirmacao",
        idioma: "pt",
        confirmationToken: token,
      });
      await store.registrarContatoWhatsapp(leadId, { recebidaEm });
    }

    let comVerbatim = false;
    if (texto && texto.trim().length > 2) {
      await gravarOuvido(store, leadId, texto.trim(), via, recebidaEm);
      comVerbatim = true;
    }

    const envio = await responder({
      para: m.de,
      nome: primeiroNome(nome),
      token,
      recebidaEm,
      comVerbatim,
    });

    return {
      status: comVerbatim ? "processada" : "sem_transcricao",
      leadId,
      respondido: envio.enviado,
      motivo: envio.motivo,
    };
  } catch (erro) {
    // Sem liberar a reserva, a reentrega da Meta não repararia nada.
    await store.liberarMensagemWhatsapp(m.wamid);
    throw erro;
  }
}

async function extrairTexto(
  m: MensagemRecebida
): Promise<{ texto: string | null; via: "texto" | "audio" }> {
  if (m.tipo === "text") return { texto: m.texto, via: "texto" };
  if (m.tipo !== "audio" || !m.audioId) return { texto: null, via: "texto" };

  // Sem provedor de transcrição a mensagem não se perde: o lead e o link
  // continuam existindo, ela só responde a q3 no quiz como qualquer outra.
  if (!transcricaoDisponivel()) {
    console.error("[tailor] áudio de WhatsApp recebido sem provedor de transcrição");
    return { texto: null, via: "audio" };
  }

  const midia = await baixarMidia(m.audioId);
  if (!midia) return { texto: null, via: "audio" };

  try {
    // A Meta entrega audio/ogg; codecs=opus. A Groq recebe multipart e usa o
    // nome do arquivo para inferir formato — daí o .ogg explícito; a Deepgram
    // ignora o nome e usa `blob.type`, que já veio certo de `baixarMidia`.
    const { texto } = await transcrever(midia.blob, "audio.ogg");
    return { texto: texto || null, via: "audio" };
  } catch (erro) {
    console.error("[tailor] falha ao transcrever áudio de WhatsApp", erro);
    return { texto: null, via: "audio" };
  }
}

async function gravarOuvido(
  store: Store,
  leadId: string,
  texto: string,
  via: "texto" | "audio",
  recebidaEm: Date
): Promise<void> {
  // `salvarRespostas` no Supabase é upsert de linha inteira: campo não
  // informado vira null. Sem reler antes, gravar a q3 apagaria a situação e os
  // números que ela já tinha respondido no quiz.
  const existentes = (await store.buscarRespostas(leadId)) ?? {};
  const raw = (existentes.raw ?? {}) as Record<string, unknown>;
  const ouvidoAtual = (raw.ouvido as Record<string, unknown> | undefined) ?? {};

  const q3 = texto.slice(0, 4000); // mesmo teto do Zod de /api/leads
  const { verbatimQ3 } = await analisarRespostas({ q3 });

  const dados: DadosRespostas = {
    ...existentes,
    q3,
    q3Via: via,
    // `buscarRespostas` não remapeia situacaoVia; o valor sobrevive porque o
    // quiz o guarda em raw, igual /api/leads.
    situacaoVia:
      (raw.situacaoVia as DadosRespostas["situacaoVia"]) ??
      (existentes.situacao ? "opcao" : null),
    // Ela apertou o microfone e mandou por vontade própria, para o número
    // comercial: é consentimento com carimbo de tempo, o mesmo que a coluna
    // `consentimento_audio_em` guarda no modo padrão.
    consentimentoAudioEm:
      via === "audio"
        ? existentes.consentimentoAudioEm ?? recebidaEm.toISOString()
        : existentes.consentimentoAudioEm ?? null,
    raw: {
      ...raw,
      ouvido: { ...ouvidoAtual, q3: verbatimQ3 || recortar(q3, 22) },
    },
  };

  await store.salvarRespostas(leadId, dados);
}

function linkDeConfirmacao(token: string): string {
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
  // localePrefix é "always": sem o /pt o middleware redirecionaria, gastando um
  // salto no navegador dela.
  return `${base}/pt/diagnostico/c/${token}`;
}

async function responder(dados: {
  para: string;
  nome: string;
  token: string;
  recebidaEm: Date;
  comVerbatim: boolean;
}): Promise<ResultadoEnvio> {
  const link = linkDeConfirmacao(dados.token);
  const saudacao = dados.nome ? `Oi, ${dados.nome}. ` : "Oi. ";
  const corpo = dados.comVerbatim
    ? `${saudacao}Recebi. Separei o que você me contou e preparei o resto do caminho — leva três minutos: ${link}`
    : `${saudacao}Recebi sua mensagem. Para eu te responder com precisão, me conta aqui em três minutos: ${link}`;

  // A mensagem dela abriu (ou renovou) a janela de atendimento. Só quando o
  // processamento sai muito depois — reentrega atrasada, reprocessamento — é
  // que a janela já pode ter fechado, e aí só template passa.
  const dentroDaJanela = Date.now() - dados.recebidaEm.getTime() < JANELA_ATENDIMENTO_MS;

  if (dentroDaJanela) return enviarTexto(dados.para, corpo);

  if (!templateConfigurado()) {
    console.error(
      `[tailor] fora da janela de 24h e sem WHATSAPP_TEMPLATE_CONFIRMACAO — ` +
        `link não enviado para ${dados.para}: ${link}`
    );
    return { enviado: false, motivo: "fora_da_janela_sem_template" };
  }
  return enviarTemplate(dados.para, [dados.nome || "tudo bem", link]);
}

async function gravarTokenNovo(
  store: Store,
  leadId: string,
  recebidaEm: Date
): Promise<string> {
  // 192 bits de entropia: colisão é ficção. A tentativa dupla existe para o
  // caso de o unique bater por corrida, não por sorte.
  for (let tentativa = 0; tentativa < 2; tentativa += 1) {
    const token = gerarTokenProposta();
    try {
      await store.registrarContatoWhatsapp(leadId, {
        confirmationToken: token,
        recebidaEm,
      });
      return token;
    } catch (erro) {
      if (!(erro instanceof TokenEmUso) || tentativa === 1) throw erro;
    }
  }
  throw new Error("não foi possível gerar confirmation_token");
}

/** O nome do perfil é escrito por ela e não decide nada — é só rótulo. */
function nomeSeguro(bruto: string | null): string | null {
  if (!bruto) return null;
  const limpo = bruto.replace(/[\p{C}]/gu, " ").trim().slice(0, 120);
  return limpo || null;
}

function primeiroNome(nome: string | null): string {
  return (nome ?? "").trim().split(/\s+/)[0] ?? "";
}

function recortar(texto: string, maxPalavras: number): string {
  const p = texto.split(/\s+/).filter(Boolean);
  return p.length <= maxPalavras ? texto : `${p.slice(0, maxPalavras).join(" ")}…`;
}
