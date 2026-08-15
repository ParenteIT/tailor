import { FATOR_TETO_FITA, type Moeda } from "@/content/config";
import type { Trilha } from "@/content/personas";

/**
 * A aritmética do Gap.
 *
 * Princípio 2 do produto: nenhum número exibido pode ser promessa, projeção ou
 * exemplo. Tudo aqui é operação sobre valores que ela mesma arrastou. Se um
 * input está ausente, o resultado é ausente — nunca um padrão que ela não
 * escolheu.
 */

export interface EntradaGap {
  precoAtual?: number | null;
  precoDesejado?: number | null;
  volumeMensal?: number | null;
  pctUsado?: number | null;
  valorParado?: number | null;
}

export interface GapPrecificacao {
  trilha: "precificacao";
  precoAtual: number;
  precoDesejado: number;
  volumeMensal: number;
  /** preço desejado − preço atual */
  unidade: number;
  /** unidade × volume mensal */
  mes: number;
  /** mês × 12 */
  ano: number;
}

export interface GapGuardaRoupa {
  trilha: "guarda_roupa";
  pctUsado: number;
  /** 100 − pctUsado. O que está adormecido, não o que foi desperdiçado (C3). */
  pctAdormecido: number;
  valorParado: number;
}

export type Gap = GapPrecificacao | GapGuardaRoupa;

function numero(valor: unknown): number | null {
  const n = typeof valor === "string" ? Number(valor) : valor;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

export function calcularGap(entrada: EntradaGap, trilha: Trilha): Gap | null {
  if (trilha === "guarda_roupa") {
    const pctUsado = numero(entrada.pctUsado);
    const valorParado = numero(entrada.valorParado);
    if (pctUsado === null || valorParado === null) return null;

    const pct = Math.min(100, Math.max(0, Math.round(pctUsado)));
    return {
      trilha: "guarda_roupa",
      pctUsado: pct,
      pctAdormecido: 100 - pct,
      valorParado: Math.max(0, Math.round(valorParado)),
    };
  }

  const precoAtual = numero(entrada.precoAtual);
  const precoDesejadoBruto = numero(entrada.precoDesejado);
  const volumeMensal = numero(entrada.volumeMensal);
  if (precoAtual === null || precoDesejadoBruto === null || volumeMensal === null) {
    return null;
  }

  const atual = Math.max(0, Math.round(precoAtual));
  // O slider de destino trava no mínimo em precoAtual (copy deck §5.1); o
  // clamp aqui é a mesma regra, defendida no servidor.
  const desejado = Math.max(atual, Math.round(precoDesejadoBruto));
  const volume = Math.max(0, Math.round(volumeMensal));

  const unidade = desejado - atual;
  const mes = unidade * volume;

  return {
    trilha: "precificacao",
    precoAtual: atual,
    precoDesejado: desejado,
    volumeMensal: volume,
    unidade,
    mes,
    ano: mes * 12,
  };
}

/* ==========================================================================
   A FITA MÉTRICA DA VIRADA — C4
   ==========================================================================
   A fita é uma RÉGUA, não uma projeção. Suas graduações vêm dos números que
   ela declarou; o teto é ≈2,5× o preço atual e nunca abaixo da meta dela.
   As três estações são nomeadas por identidade e NÃO carregam valor: colocar
   um preço na estação final seria prometer que ela chega lá, o que C2 proíbe.
   Nenhum exemplo fixo ("5k→15k") existe neste arquivo por construção.
   ========================================================================= */

export interface MarcaFita {
  /** Posição na fita, 0–1. */
  posicao: number;
  valor: number;
}

export interface EscalaFita {
  minimo: number;
  teto: number;
  /** Graduações desenhadas na fita, em valor absoluto. */
  graduacoes: number[];
  hoje: MarcaFita;
  meta: MarcaFita;
  unidade: "dinheiro" | "pct";
  /** Em qual moeda ela declarou. Guardado junto para a proposta reabrir igual. */
  moeda: Moeda;
}

function arredondarBonito(valor: number): number {
  if (valor <= 0) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(valor)));
  const normalizado = valor / magnitude;
  const passo = normalizado <= 1 ? 1 : normalizado <= 2 ? 2 : normalizado <= 5 ? 5 : 10;
  return passo * magnitude;
}

export function escalaDaFita(gap: Gap, moeda: Moeda = "BRL"): EscalaFita {
  if (gap.trilha === "guarda_roupa") {
    // A fita da Patrícia mede o que ela já tem: quanto do armário trabalha
    // por ela hoje. O teto é 100% porque é o limite real do próprio armário —
    // não é uma meta que alguém prometeu.
    const posicao = gap.pctUsado / 100;
    return {
      minimo: 0,
      teto: 100,
      graduacoes: [0, 25, 50, 75, 100],
      hoje: { posicao, valor: gap.pctUsado },
      meta: { posicao: 1, valor: 100 },
      unidade: "pct",
      moeda,
    };
  }

  // C4 — teto ≈ 2–3× o preço atual, e nunca abaixo da meta declarada.
  // O arredondamento "bonito" sozinho estoura o limite (1.200 × 2,5 = 3.000
  // arredonda para 5.000, que é 4,17×), então ele é limitado a 3× antes de a
  // meta dela entrar. A meta vence o teto: se ela declarou mais que 3×, é o
  // número dela que manda — a régua nunca pode ficar abaixo do que ela quer.
  const alvo = arredondarBonito(gap.precoAtual * FATOR_TETO_FITA);
  const tetoDaFaixa = Math.min(alvo, gap.precoAtual * 3);
  const teto = Math.max(gap.precoDesejado, Math.round(tetoDaFaixa)) || 1;
  const amplitude = teto;

  // Graduações em quartos: uma régua se divide igualmente, e assim nenhuma
  // marca passa do teto nem sai fora de ordem.
  const graduacoes = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(teto * f));

  return {
    minimo: 0,
    teto,
    graduacoes,
    hoje: { posicao: gap.precoAtual / amplitude, valor: gap.precoAtual },
    meta: { posicao: gap.precoDesejado / amplitude, valor: gap.precoDesejado },
    unidade: "dinheiro",
    moeda,
  };
}

export const ESTACOES_FITA = ["percebida", "referencia", "inevitavel"] as const;
export type EstacaoFita = (typeof ESTACOES_FITA)[number];

/**
 * Posição de cada estação ao longo da fita. São pontos de leitura da régua —
 * onde a jornada de identidade cruza a escala dela — e por isso ficam
 * ancoradas nas marcas que ela declarou, não em valores inventados.
 */
export function posicoesDasEstacoes(escala: EscalaFita): Record<EstacaoFita, number> {
  const hoje = Math.min(Math.max(escala.hoje.posicao, 0), 1);
  const meta = Math.min(Math.max(escala.meta.posicao, hoje), 1);
  return {
    percebida: hoje + (meta - hoje) * 0.34,
    referencia: meta,
    inevitavel: meta + (1 - meta) * 0.72,
  };
}

/* ==========================================================================
   FORMATAÇÃO
   ========================================================================= */

const LOCALE_DA_MOEDA: Record<Moeda, string> = {
  BRL: "pt-BR",
  USD: "en-US",
};

/**
 * Formata um valor declarado por ela. Sem casas decimais de propósito: ela
 * arrastou um slider, não digitou centavos, e a régua não deve fingir precisão
 * que não existe.
 */
export function dinheiro(valor: number, moeda: Moeda = "BRL"): string {
  return new Intl.NumberFormat(LOCALE_DA_MOEDA[moeda], {
    style: "currency",
    currency: moeda,
    maximumFractionDigits: 0,
  }).format(Math.round(valor));
}
