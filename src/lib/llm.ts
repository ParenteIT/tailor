import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Modelo de texto, atrás de uma porta única — mesmo desenho de
 * `transcricao.ts`, aplicado ao par que gera a proposta: extração
 * estruturada (Bloco 1) e o diagnóstico em prosa (Bloco 2).
 *
 * Existe porque a API paga da Anthropic é conta separada da assinatura
 * Max do Willian (Console ≠ claude.ai/Claude Code — produtos e billing
 * diferentes), e o Console ficou sem crédito. Gemini tem tier grátis
 * indefinido (Flash/Flash-Lite, sem cartão) — decisão do Willian,
 * 15/08/2026, para ter caminho gratuito enquanto o crédito da Anthropic
 * não entra. Anthropic segue sendo o padrão: `LLM_PROVEDOR` muda isso sem
 * deploy, igual à transcrição.
 *
 * Fallback automático entre os dois: se o principal (`LLM_PROVEDOR`) falhar
 * — sem crédito, fora do ar, erro de rede — o outro entra sozinho antes de
 * cair no texto de reserva. Ver `comFallback` mais abaixo.
 *
 * ⚠️ Gemini NÃO VERIFICADO CONTRA A API REAL — mesmo aviso de sempre
 * (asaas.ts, whatsapp.ts): escrito contra a doc oficial, sem chave
 * disponível nesta sessão. A primeira chamada real é o teste de integração.
 */

export type ProvedorLLM = "anthropic" | "gemini";

export interface RespostaLLM {
  texto: string;
  /** Recusa por segurança/classificador — tratada igual a "sem texto". */
  recusado: boolean;
}

interface PedidoEstruturado {
  sistema: string;
  /** JSON Schema — mesmo objeto para os dois provedores; ver ressalva no Gemini. */
  schema: Record<string, unknown>;
  entrada: string;
  maxTokens: number;
}

interface PedidoTexto {
  sistema: string;
  entrada: string;
  maxTokens: number;
}

interface Provedor {
  nome: ProvedorLLM;
  envDaChave: string;
  disponivel(): boolean;
  extrairEstruturado(pedido: PedidoEstruturado): Promise<RespostaLLM>;
  escreverTexto(pedido: PedidoTexto): Promise<RespostaLLM>;
}

/* ==========================================================================
   Anthropic — o padrão. Mesma chamada que já existia em analise.ts/proposta.ts,
   só realocada para trás desta porta.
   ========================================================================= */

const MODELO_ANTHROPIC_ANALISE = process.env.CLAUDE_MODEL_ANALISE ?? "claude-haiku-4-5";
const MODELO_ANTHROPIC_GERACAO = process.env.CLAUDE_MODEL_GERACAO ?? "claude-sonnet-5";

let clienteAnthropic: Anthropic | null = null;

function textoDeAnthropic(mensagem: Anthropic.Message): string {
  return mensagem.content
    .filter((bloco): bloco is Anthropic.TextBlock => bloco.type === "text")
    .map((bloco) => bloco.text)
    .join("")
    .trim();
}

const anthropic: Provedor = {
  nome: "anthropic",
  envDaChave: "ANTHROPIC_API_KEY",

  disponivel() {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  },

  async extrairEstruturado({ sistema, schema, entrada, maxTokens }) {
    clienteAnthropic ??= new Anthropic();
    const resposta = await clienteAnthropic.messages.create({
      model: MODELO_ANTHROPIC_ANALISE,
      max_tokens: maxTokens,
      system: [{ type: "text", text: sistema, cache_control: { type: "ephemeral" } }],
      output_config: { format: { type: "json_schema", schema } },
      messages: [{ role: "user", content: entrada }],
    });
    return {
      texto: textoDeAnthropic(resposta),
      recusado: resposta.stop_reason === "refusal",
    };
  },

  async escreverTexto({ sistema, entrada, maxTokens }) {
    clienteAnthropic ??= new Anthropic();
    const resposta = await clienteAnthropic.messages.create({
      model: MODELO_ANTHROPIC_GERACAO,
      max_tokens: maxTokens,
      system: [{ type: "text", text: sistema, cache_control: { type: "ephemeral" } }],
      // Escrever quatro frases ancoradas no que ela disse é tarefa curta e
      // escopada — o esforço baixo é a diferença entre centavos e dezenas de
      // centavos por lead, sem custo de qualidade aqui.
      output_config: { effort: "low" },
      messages: [{ role: "user", content: entrada }],
    });
    return {
      texto: textoDeAnthropic(resposta),
      recusado: resposta.stop_reason === "refusal",
    };
  },
};

/* ==========================================================================
   Gemini — o caminho gratuito. REST cru, sem SDK (mesmo padrão do resto do
   projeto: uma integração, uma chamada, sem dependência nova por rota).
   ========================================================================= */

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODELO_GEMINI_ANALISE = process.env.GEMINI_MODEL_ANALISE ?? "gemini-flash-lite-latest";
const MODELO_GEMINI_GERACAO = process.env.GEMINI_MODEL_GERACAO ?? "gemini-flash-latest";

interface RespostaGenerateContent {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
}

async function chamarGemini(
  modelo: string,
  corpo: Record<string, unknown>
): Promise<RespostaLLM> {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) return { texto: "", recusado: false };

  const resposta = await fetch(`${GEMINI_BASE}/${modelo}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": chave },
    body: JSON.stringify(corpo),
    cache: "no-store",
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => "");
    throw new Error(`gemini ${resposta.status}: ${detalhe.slice(0, 400)}`);
  }

  const dados = (await resposta.json()) as RespostaGenerateContent;
  const candidato = dados.candidates?.[0];
  const texto = candidato?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  // STOP é o único desfecho de sucesso; qualquer outro (SAFETY,
  // PROHIBITED_CONTENT, RECITATION, MAX_TOKENS…) é tratado como recusa — o
  // chamador cai no texto de reserva em vez de arriscar um texto cortado.
  const recusado = candidato?.finishReason !== undefined && candidato.finishReason !== "STOP";
  return { texto: texto.trim(), recusado };
}

const gemini: Provedor = {
  nome: "gemini",
  envDaChave: "GEMINI_API_KEY",

  disponivel() {
    return Boolean(process.env.GEMINI_API_KEY);
  },

  async extrairEstruturado({ sistema, schema, entrada, maxTokens }) {
    return chamarGemini(MODELO_GEMINI_ANALISE, {
      contents: [{ role: "user", parts: [{ text: entrada }] }],
      systemInstruction: { parts: [{ text: sistema }] },
      generationConfig: {
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
        // O SCHEMA_ANALISE do projeto usa `additionalProperties: false`, que a
        // doc do Gemini lista como suportado — mas não verificado contra a API
        // real. Se um dia o Gemini rejeitar por causa disso, a correção é
        // remover essa chave só na cópia enviada a ele, não no schema fonte.
        responseSchema: schema,
      },
    });
  },

  async escreverTexto({ sistema, entrada, maxTokens }) {
    return chamarGemini(MODELO_GEMINI_GERACAO, {
      contents: [{ role: "user", parts: [{ text: entrada }] }],
      systemInstruction: { parts: [{ text: sistema }] },
      generationConfig: { maxOutputTokens: maxTokens },
    });
  },
};

/* ========================================================================== */

const PROVEDORES: Record<ProvedorLLM, Provedor> = { anthropic, gemini };

/** Env inválida cai na Anthropic com log, em vez de derrubar a geração de proposta. */
export function provedorLLMEscolhido(): Provedor {
  const pedido = process.env.LLM_PROVEDOR?.trim().toLowerCase();
  if (pedido && pedido in PROVEDORES) {
    return PROVEDORES[pedido as ProvedorLLM];
  }
  if (pedido) {
    console.error(
      `[tailor] LLM_PROVEDOR="${pedido}" não existe; usando anthropic. ` +
        `Válidos: ${Object.keys(PROVEDORES).join(", ")}`
    );
  }
  return anthropic;
}

/**
 * O outro provedor, se ele tiver chave. Com só dois provedores, "o outro" é
 * suficiente — não precisa de uma ordem configurável para isto virar uma
 * lista de fallback de verdade.
 */
function provedorReserva(primario: Provedor): Provedor | null {
  const outro = Object.values(PROVEDORES).find((p) => p.nome !== primario.nome);
  return outro && outro.disponivel() ? outro : null;
}

/**
 * O sistema está disponível se QUALQUER um dos dois tiver chave — é
 * `analise.ts`/`proposta.ts` decidindo entre tentar o modelo ou já cair na
 * reserva; qual dos dois provedores realmente atende é decidido dentro do
 * fallback abaixo, não aqui.
 */
export function llmDisponivel(): boolean {
  return Object.values(PROVEDORES).some((p) => p.disponivel());
}

/**
 * Fallback automático (decisão do Willian, 15/08/2026): se o provedor
 * principal (`LLM_PROVEDOR`, Anthropic por padrão) falhar — sem crédito,
 * fora do ar, erro de rede — tenta o outro antes de devolver a mão pro
 * chamador, que aí sim cai no texto de reserva honesto de sempre.
 *
 * O que NÃO ativa o fallback: recusa por segurança/classificador
 * (`recusado: true`). Isso é sinal sobre o conteúdo, não sobre o provedor —
 * tentar o outro modelo com o mesmo texto recusado não muda o resultado e só
 * gasta uma chamada a mais.
 */
async function comFallback<T extends RespostaLLM>(
  chamar: (provedor: Provedor) => Promise<T>
): Promise<T> {
  const primario = provedorLLMEscolhido();

  if (!primario.disponivel()) {
    const reserva = provedorReserva(primario);
    if (!reserva) throw new Error(`${primario.envDaChave} não está definida.`);
    return chamar(reserva);
  }

  try {
    return await chamar(primario);
  } catch (erro) {
    const reserva = provedorReserva(primario);
    if (!reserva) throw erro;
    console.error(
      `[tailor] ${primario.nome} falhou, tentando ${reserva.nome} como reserva`,
      erro
    );
    return chamar(reserva);
  }
}

export async function extrairEstruturado(pedido: PedidoEstruturado): Promise<RespostaLLM> {
  return comFallback((provedor) => provedor.extrairEstruturado(pedido));
}

export async function escreverTexto(pedido: PedidoTexto): Promise<RespostaLLM> {
  return comFallback((provedor) => provedor.escreverTexto(pedido));
}
