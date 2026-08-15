import {
  FAIXAS_INVESTIMENTO,
  OFERTA_POR_FAIXA,
  PRODUTOS,
  VALIDADE_PROPOSTA_HORAS,
  moedaDoIdioma,
  type FaixaInvestimento,
  type Moeda,
  type ProdutoKey,
} from "@/content/config";
import { PERSONAS, type PersonaKey } from "@/content/personas";
import { analisarRespostas, type Analise } from "@/lib/analise";
import { nomeExibido, precoExibido } from "@/lib/checkout";
import {
  MODELO_GERACAO,
  claudeDisponivel,
  getClaude,
  recusou,
  textoDe,
} from "@/lib/claude";
import {
  calcularGap,
  escalaDaFita,
  posicoesDasEstacoes,
  type EscalaFita,
  type Gap,
} from "@/lib/gap";
import { PROMPT_DIAGNOSTICO, VERSAO_PROMPT } from "../../prompts/v1";
import mensagensPt from "../../messages/pt.json";

/**
 * As palavras da Q6 são gravadas como CHAVE ("memoravel"); o exibível, com
 * acento, mora nas messages — a mesma fonte da UI, sem texto duplicado. Todo
 * lugar onde a palavra vira frase lida por ela (diagnóstico de reserva, prompt
 * do modelo) passa por aqui; chave desconhecida cai no texto cru.
 */
const PALAVRA_LEGIVEL: Record<string, string> = mensagensPt.futuro.palavras;

function palavrasLegiveis(palavras: string[]): string[] {
  return palavras.map((p) => PALAVRA_LEGIVEL[p] ?? p);
}

export interface RespostasProposta {
  persona: PersonaKey;
  situacao: string | null;
  situacaoOutro?: string;
  q3: string;
  precoAtual?: number | null;
  precoDesejado?: number | null;
  volumeMensal?: number | null;
  pctUsado?: number | null;
  valorParado?: number | null;
  palavras: string[];
  q7?: string | null;
  q8?: string | null;
  q9?: string | null;
  nome: string;
  /** Idioma em que ela respondeu. Decide a moeda da régua. */
  idioma?: string;
}

export interface ConteudoProposta {
  versaoPrompt: string;
  persona: PersonaKey;
  nome: string;
  /** Bloco 2 — a única parte escrita por modelo. */
  diagnostico: string;
  /** Marcado quando o diagnóstico saiu do fallback, não do modelo. */
  diagnosticoDegradado: boolean;
  analise: Analise;
  gap: Gap | null;
  fita: {
    escala: EscalaFita;
    estacoes: Record<string, number>;
  } | null;
  palavras: string[];
  q9: string | null;
  /**
   * O que o Bloco 7 oferta, escolhido pela faixa que ela marcou na Q9.
   * Gravado junto com a proposta para que reabrir o link não mude a oferta.
   */
  oferta: { produto: ProdutoKey; nome: string; preco: string };
  /** Moeda em que ela declarou — a proposta reabre sempre igual. */
  moeda: Moeda;
  geradoEm: string;
}

export function calcularExpiracao(de: Date = new Date()): Date {
  return new Date(de.getTime() + VALIDADE_PROPOSTA_HORAS * 60 * 60 * 1000);
}

/**
 * C5 — quem decide se a proposta ainda vale é o servidor lendo a coluna, nunca
 * o relógio do browser. O §8 do BRAND-VISUAL veta cronômetro, então a data
 * existe como fato verificado aqui e como frase sóbria na página.
 */
export function expirou(expiraEm: string | Date): boolean {
  const limite = typeof expiraEm === "string" ? new Date(expiraEm) : expiraEm;
  return Number.isFinite(limite.getTime()) && limite.getTime() <= Date.now();
}

export async function montarProposta(
  respostas: RespostasProposta
): Promise<ConteudoProposta> {
  const persona = PERSONAS[respostas.persona];
  const moeda = moedaDoIdioma(respostas.idioma);
  const gap = calcularGap(respostas, persona.trilha);
  const analise = await analisarRespostas({
    persona: respostas.persona,
    situacao: respostas.situacaoOutro?.trim() || respostas.situacao,
    q3: respostas.q3,
    palavras: respostas.palavras,
  });

  const { texto: diagnostico, degradado } = await escreverDiagnostico(
    respostas,
    analise,
    gap
  );

  return {
    versaoPrompt: VERSAO_PROMPT,
    persona: respostas.persona,
    nome: respostas.nome.trim(),
    diagnostico,
    diagnosticoDegradado: degradado,
    analise,
    gap,
    moeda,
    fita: gap
      ? (() => {
          const escala = escalaDaFita(gap, moeda);
          return { escala, estacoes: posicoesDasEstacoes(escala) };
        })()
      : null,
    palavras: respostas.palavras,
    q9: respostas.q9 ?? null,
    oferta: escolherOferta(respostas.q9, moeda),
    geradoEm: new Date().toISOString(),
  };
}

/**
 * A oferta sai do teto de abertura que ela mesma marcou — é o que torna a
 * proposta sob medida também no preço. Faixa desconhecida ou ausente cai no
 * degrau do meio: presumir o topo de quem não declarou seria inventar.
 */
function faixaConhecida(valor: string | null | undefined): valor is FaixaInvestimento {
  return (FAIXAS_INVESTIMENTO as readonly string[]).includes(valor ?? "");
}

function escolherOferta(faixa: string | null | undefined, moeda: Moeda) {
  // O cast direto de antes (`as FaixaInvestimento`) só existia em tempo de
  // compilação: uma q9 valendo "toString" alcançava `Object.prototype` e
  // devolvia uma função, que o `??` não considera nula e o `checkout.ts`
  // quebrava com TypeError. Auditoria de 14/08/2026.
  const chave = faixaConhecida(faixa) ? faixa : "naoDizer";
  const produto = OFERTA_POR_FAIXA[chave];
  // Nome e preço saem da mesma env que alimenta o link de pagamento
  // (`PRECO_*_CENTAVOS` / `PRODUTO_*_NOME`): a tela e a cobrança não têm como
  // divergir. Sem env, o catálogo estático segue valendo e o preço fica ◆.
  return {
    produto,
    nome: nomeExibido(produto),
    preco: precoExibido(produto, moeda) ?? PRODUTOS[produto].preco,
  };
}

async function escreverDiagnostico(
  respostas: RespostasProposta,
  analise: Analise,
  gap: Gap | null
): Promise<{ texto: string; degradado: boolean }> {
  if (!claudeDisponivel()) {
    return { texto: diagnosticoDeReserva(respostas, analise), degradado: true };
  }

  const entrada = [
    `Primeiro nome: ${respostas.nome.trim()}`,
    `Frase-espelho escolhida: ${respostas.persona}`,
    `Situação marcada: ${respostas.situacaoOutro?.trim() || respostas.situacao || "(não informada)"}`,
    `O que ela escreveu sobre a única coisa que mudaria tudo: "${respostas.q3.trim()}"`,
    `Palavras de identidade escolhidas: ${palavrasLegiveis(respostas.palavras).join(", ") || "(nenhuma)"}`,
    gap ? `Números que ela declarou: ${JSON.stringify(gap)}` : "Ela não declarou números.",
  ].join("\n");

  try {
    const resposta = await getClaude().messages.create({
      model: MODELO_GERACAO,
      max_tokens: 700,
      system: [
        {
          type: "text",
          text: PROMPT_DIAGNOSTICO,
          cache_control: { type: "ephemeral" },
        },
      ],
      // Escrever quatro frases ancoradas no que ela disse é tarefa curta e
      // escopada — o esforço baixo é a diferença entre centavos e dezenas de
      // centavos por lead, sem custo de qualidade aqui.
      output_config: { effort: "low" },
      messages: [{ role: "user", content: entrada }],
    });

    if (recusou(resposta)) {
      console.warn("[tailor] diagnóstico recusado pelos classificadores");
      return { texto: diagnosticoDeReserva(respostas, analise), degradado: true };
    }

    const texto = textoDe(resposta);
    if (!texto) {
      return { texto: diagnosticoDeReserva(respostas, analise), degradado: true };
    }
    return { texto, degradado: false };
  } catch (erro) {
    console.error("[tailor] falha ao gerar diagnóstico", erro);
    return { texto: diagnosticoDeReserva(respostas, analise), degradado: true };
  }
}

/**
 * Reserva sem modelo. Devolve as palavras dela e não afirma nada que ela não
 * tenha dito — é curto de propósito: melhor um parágrafo honesto e visivelmente
 * simples do que um texto inventado com cara de diagnóstico.
 */
function diagnosticoDeReserva(
  respostas: RespostasProposta,
  analise: Analise
): string {
  const trecho = analise.verbatimQ3 || respostas.q3.trim();
  const nome = respostas.nome.trim();
  const partes = [
    `${nome}, você me disse que a coisa que mudaria tudo é isto: "${trecho}".`,
    "Guardei essa frase porque ela é o começo do trabalho, não o fim.",
  ];
  if (respostas.palavras.length) {
    partes.push(
      `E escolheu ser lida como ${palavrasLegiveis(respostas.palavras).join(", ")} — é dali que a gente parte.`
    );
  }
  return partes.join(" ");
}
