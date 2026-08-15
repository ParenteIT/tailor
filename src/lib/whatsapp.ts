import "server-only";
import { createHmac } from "node:crypto";
import { comparaSegredo } from "@/lib/token";

/**
 * Cliente da WhatsApp Cloud API (Meta).
 *
 * ⚠️ NÃO VERIFICADO CONTRA A API REAL — mesmo aviso do asaas.ts. Escrito contra
 * a doc de 14/08/2026, sem WABA disponível. A primeira mensagem real é o teste
 * de integração.
 *
 * Sem credencial nada aqui lança: `enviarTexto` devolve
 * `{ enviado: false, motivo: "nao_configurado" }` e o webhook segue 200. Perder
 * a resposta automática é ruim; perder a confissão dela porque a env não estava
 * configurada seria pior.
 */

const GRAPH = "https://graph.facebook.com";
const UA = "tailor/1.0 (+https://github.com/parenteit/tailor)";

export function versaoGraph(): string {
  const env = process.env.WHATSAPP_GRAPH_VERSAO?.trim();
  return /^v\d+\.\d+$/.test(env ?? "") ? (env as string) : "v26.0";
}

/**
 * Nada nesta rodada chama isto — `baixarMidia` e `postarMensagem` checam a
 * própria env inline, então nada quebra sem ele. Existe pelo mesmo motivo de
 * `asaasConfigurado`/`transcricaoDisponivel`: cada integração expõe um "está
 * pronta?" próprio, e é daqui que um painel de saúde ou uma tela de admin
 * futura pergunta, em vez de espalhar `process.env.WHATSAPP_TOKEN` pelo
 * código de UI. Revisão de 14/08/2026 sinalizou como código morto; decisão
 * foi manter pela consistência do formato, não esquecimento.
 */
export function whatsappConfigurado(): boolean {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

export interface ResultadoEnvio {
  enviado: boolean;
  /** `accepted` | `held_for_quality_assessment` | `paused` — 200 não é entrega. */
  situacao?: string;
  motivo?: string;
}

/**
 * A Meta assina o corpo CRU, com unicode escapado. Calcular sobre
 * `JSON.stringify(JSON.parse(corpo))` produz outra assinatura — e todo lead
 * brasileiro manda acento. Por isso esta função recebe a string exata que veio
 * do socket, e a rota chama `req.text()` ANTES de qualquer parse.
 */
export function assinaturaConfere(corpoCru: string, cabecalho: string | null): boolean {
  const segredo = process.env.WHATSAPP_APP_SECRET;
  if (!segredo || !cabecalho) return false;
  if (!cabecalho.startsWith("sha256=")) return false;
  const esperada = createHmac("sha256", segredo)
    .update(Buffer.from(corpoCru, "utf8"))
    .digest("hex");
  return comparaSegredo(cabecalho.slice("sha256=".length).toLowerCase(), esperada);
}

export interface MidiaBaixada {
  blob: Blob;
  mimeType: string;
}

/** 16 MB é o teto da própria plataforma para áudio. */
const TAMANHO_MAXIMO_MIDIA = 16 * 1024 * 1024;

/**
 * Fluxo de dois passos, sempre. O exemplo oficial do webhook de áudio traz um
 * `url` dentro do objeto `audio`, mas sem contrato documentado nem validade
 * declarada — não se constrói em cima disso. A URL do passo 1 vale 5 minutos,
 * então o download acontece dentro do processamento do webhook, nunca em fila.
 */
export async function baixarMidia(mediaId: string): Promise<MidiaBaixada | null> {
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) return null;

  const busca = new URLSearchParams();
  const numero = process.env.WHATSAPP_PHONE_NUMBER_ID;
  // Defesa contra media id de outro número: a Meta valida a posse por nós.
  if (numero) busca.set("phone_number_id", numero);

  const meta = await fetch(`${GRAPH}/${versaoGraph()}/${mediaId}?${busca}`, {
    // A doc lista User-Agent como opcional no download; o edge historicamente
    // devolvia 403 sem ele. Mandar custa nada.
    headers: { Authorization: `Bearer ${token}`, "User-Agent": UA },
    cache: "no-store",
  });
  if (!meta.ok) {
    console.error(`[tailor] media meta ${meta.status} para ${mediaId}`);
    return null;
  }

  const dados = (await meta.json()) as {
    url?: string;
    mime_type?: string;
    file_size?: number;
  };
  if (!dados.url) return null;
  if (typeof dados.file_size === "number" && dados.file_size > TAMANHO_MAXIMO_MIDIA) {
    console.error(`[tailor] mídia ${mediaId} acima do teto (${dados.file_size} bytes)`);
    return null;
  }
  // A URL é do lookaside da Meta e não é montada por nós — não aceite host
  // arbitrário vindo da resposta.
  if (!/^https:\/\/[a-z0-9.-]*\.fbsbx\.com\//i.test(dados.url)) {
    console.error("[tailor] URL de mídia fora do domínio esperado — recusada");
    return null;
  }

  const bytes = await fetch(dados.url, {
    headers: { Authorization: `Bearer ${token}`, "User-Agent": UA },
    cache: "no-store",
  });
  if (!bytes.ok) {
    console.error(`[tailor] download de mídia ${bytes.status}`);
    return null;
  }

  const mimeType = dados.mime_type ?? bytes.headers.get("content-type") ?? "audio/ogg";
  const bruto = await bytes.arrayBuffer();
  if (bruto.byteLength > TAMANHO_MAXIMO_MIDIA) return null;
  return { blob: new Blob([bruto], { type: mimeType }), mimeType };
}

async function postarMensagem(corpo: Record<string, unknown>): Promise<ResultadoEnvio> {
  const token = process.env.WHATSAPP_TOKEN;
  const numero = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !numero) return { enviado: false, motivo: "nao_configurado" };

  try {
    const r = await fetch(`${GRAPH}/${versaoGraph()}/${numero}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "User-Agent": UA,
      },
      body: JSON.stringify(corpo),
      cache: "no-store",
    });

    if (!r.ok) {
      // O detalhe da Meta pode conter dado da conta — só log de servidor.
      const detalhe = await r.text().catch(() => "");
      console.error(`[tailor] whatsapp ${r.status}: ${detalhe.slice(0, 400)}`);
      return { enviado: false, motivo: `http_${r.status}` };
    }

    const dados = (await r.json()) as { messages?: Array<{ message_status?: string }> };
    const situacao = dados.messages?.[0]?.message_status;
    if (situacao && situacao !== "accepted") {
      // held_for_quality_assessment / paused = degradação de qualidade da conta.
      console.error(`[tailor] whatsapp aceitou com situação "${situacao}"`);
    }
    return { enviado: true, situacao };
  } catch (erro) {
    console.error("[tailor] falha ao enviar mensagem de WhatsApp", erro);
    return { enviado: false, motivo: "falha_de_rede" };
  }
}

/** Só é válido dentro da janela de 24h aberta pela mensagem dela. */
export async function enviarTexto(para: string, texto: string): Promise<ResultadoEnvio> {
  return postarMensagem({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: para,
    type: "text",
    // preview_url falso: o link é um documento privado e um preview faria o
    // crawler da Meta abrir a página de confirmação dela.
    text: { preview_url: false, body: texto },
  });
}

export function templateConfigurado(): boolean {
  return Boolean(process.env.WHATSAPP_TEMPLATE_CONFIRMACAO);
}

/** Fora da janela, é o único tipo que a Meta entrega. */
export async function enviarTemplate(
  para: string,
  parametros: string[]
): Promise<ResultadoEnvio> {
  const nome = process.env.WHATSAPP_TEMPLATE_CONFIRMACAO;
  if (!nome) return { enviado: false, motivo: "template_nao_configurado" };
  return postarMensagem({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: para,
    type: "template",
    template: {
      name: nome,
      language: { code: process.env.WHATSAPP_TEMPLATE_IDIOMA?.trim() || "pt_BR" },
      components: [
        { type: "body", parameters: parametros.map((text) => ({ type: "text", text })) },
      ],
    },
  });
}
