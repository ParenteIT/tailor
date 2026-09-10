import { extrairEstruturado, llmDisponivel } from "@/lib/llm";
import {
  PROMPT_ANALISE,
  SCHEMA_ANALISE,
  montarEntradaAnalise,
} from "../../prompts/v1";

export interface Analise {
  verbatimQ3: string;
  temaCentral: string;
  palavrasDela: string[];
}

/**
 * Extração estruturada do que ela escreveu.
 *
 * Structured outputs em vez de "devolva JSON e reza": o schema é aplicado pela
 * API, então não existe caminho de parse quebrado nem retry de JSON inválido.
 * Sem thinking e com teto curto porque a tarefa é recortar texto, não raciocinar
 * — é o que segura o custo em centavos por lead.
 */
export async function analisarRespostas(
  dados: Record<string, unknown>
): Promise<Analise> {
  if (!llmDisponivel()) return degradar(dados);

  try {
    const { texto, recusado } = await extrairEstruturado({
      sistema: PROMPT_ANALISE,
      schema: SCHEMA_ANALISE,
      entrada: montarEntradaAnalise(dados),
      maxTokens: 800,
    });

    if (recusado) {
      console.warn("[tailor] análise recusada pelos classificadores");
      return degradar(dados);
    }
    if (!texto) return degradar(dados);

    const bruto = JSON.parse(texto) as Partial<Analise>;
    return {
      verbatimQ3: (bruto.verbatimQ3 ?? "").trim(),
      temaCentral: (bruto.temaCentral ?? "").trim(),
      palavrasDela: Array.isArray(bruto.palavrasDela) ? bruto.palavrasDela : [],
    };
  } catch (erro) {
    console.error("[tailor] falha na análise", erro);
    return degradar(dados);
  }
}

/**
 * Sem modelo disponível — ou com ele recusando — a proposta ainda sai. O
 * verbatim vira o texto dela mesma, cru, o que é honesto: é literalmente o que
 * o modelo faria de melhor aqui.
 */
function degradar(dados: Record<string, unknown>): Analise {
  const q3 = typeof dados.q3 === "string" ? dados.q3.trim() : "";
  return {
    verbatimQ3: recortar(q3, 22),
    temaCentral: "",
    palavrasDela: [],
  };
}

function recortar(texto: string, maxPalavras: number): string {
  const palavras = texto.split(/\s+/).filter(Boolean);
  if (palavras.length <= maxPalavras) return texto;
  return `${palavras.slice(0, maxPalavras).join(" ")}…`;
}
