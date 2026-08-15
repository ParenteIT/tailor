import Anthropic from "@anthropic-ai/sdk";

/**
 * Cliente da Claude API.
 *
 * Os modelos vêm de env com default econômico, como o brief pediu, e seguem a
 * divisão do tailor-spec.md §3: um modelo barato lê e estrutura o que ela
 * escreveu; um modelo mais forte escreve o único parágrafo que ela vai ler como
 * se fosse a Renilza falando. O alvo é US$ 0,01–0,03 por lead só-texto.
 */

export const MODELO_ANALISE = process.env.CLAUDE_MODEL_ANALISE ?? "claude-haiku-4-5";
export const MODELO_GERACAO = process.env.CLAUDE_MODEL_GERACAO ?? "claude-sonnet-5";

let cliente: Anthropic | null = null;

export function getClaude(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY não está definida.");
  }
  cliente ??= new Anthropic();
  return cliente;
}

export function claudeDisponivel(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Concatena os blocos de texto da resposta, ignorando thinking e afins. */
export function textoDe(mensagem: Anthropic.Message): string {
  return mensagem.content
    .filter((bloco): bloco is Anthropic.TextBlock => bloco.type === "text")
    .map((bloco) => bloco.text)
    .join("")
    .trim();
}

/**
 * Guarda comum às duas rotas: um `refusal` chega como HTTP 200, então quem lê
 * `content[0]` direto quebra. Aqui a recusa vira ausência de texto, e a rota
 * decide o fallback.
 */
export function recusou(mensagem: Anthropic.Message): boolean {
  return mensagem.stop_reason === "refusal";
}
