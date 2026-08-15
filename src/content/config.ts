/**
 * ◆ — todo valor de oferta da Renilza que ainda NÃO existe vive aqui, num
 * lugar só. Copy deck §13 lista o conjunto exaustivo. Nenhum número real pode
 * ser inventado em nenhum outro arquivo: se aparecer um preço fora deste
 * módulo, é bug.
 */
export const PRECOS = {
  precoJornada: "◆",
  precoConsultoria: "◆",
  precoCirculo: "◆",
  investimentoFinal: "◆",
  bonusPix: "◆",
  /** Bloco 6 — "antes de você, outras ◆ mulheres já atravessaram isso". */
  numeroDepoimentos: "◆",
} as const;

/**
 * Produtos vigentes da esteira (rebranding de 06/08/2026). Os nomes são reais;
 * os preços continuam ◆ porque a tabela ainda não fechou.
 */
export const PRODUTOS = {
  jornada: { nome: "Jornada Valor Percebido", preco: PRECOS.precoJornada },
  dossie: { nome: "Dossiê de Imagem", preco: "◆" },
  prismaEssencial: { nome: "Método Prisma Essencial", preco: "◆" },
  prismaCompleto: { nome: "Método Prisma Completo", preco: "◆" },
} as const;

export type ProdutoKey = keyof typeof PRODUTOS;

/** Faixas da Q9 como chaves — o texto vive em messages/<locale>.json. */
export const FAIXAS_INVESTIMENTO = [
  "ate3500",
  "de3500a7k",
  "de7a10k",
  "acima10k",
  "naoDizer",
] as const;

export type FaixaInvestimento = (typeof FAIXAS_INVESTIMENTO)[number];

/**
 * Qual produto o Bloco 7 oferta, decidido pelo teto de abertura que ela mesma
 * marcou na Q9 (decisão do Willian, 13/08/2026). É o que torna a proposta
 * "sob medida" também no preço, usando um dado que já está no quiz.
 *
 * A faixa de entrada é "até R$ 3.500" (decisão do Willian, 14/08/2026, esteira
 * v4): o Dossiê subiu de R$ 2.500 para R$ 3.500 e o degrau de entrada sobe
 * junto — a mesma regra de sempre. Nenhum degrau da Q9 pode prometer um teto
 * que a esteira não atende; quem marca o degrau de entrada recebe uma oferta
 * que cabe nele.
 */
export const OFERTA_POR_FAIXA: Record<FaixaInvestimento, ProdutoKey> = {
  ate3500: "dossie",
  de3500a7k: "prismaEssencial",
  de7a10k: "prismaCompleto",
  acima10k: "prismaCompleto",
  // Com três produtos reais na esteira, o degrau do meio agora é o Prisma
  // Essencial, não mais o Dossiê (que virou o degrau de entrada). Quem não
  // quis dizer costuma estar em cima, não embaixo — mas ofertar o topo para
  // quem se recusou a declarar é presumir. Fica no degrau do meio.
  naoDizer: "prismaEssencial",
};

export const CONTATO = {
  /**
   * WhatsApp Business da Renilza em E.164 sem o "+". Fonte: 🧠 Renilza —
   * Estratégia Central (Notion), que registra este como o canal de fechamento.
   * A env sobrepõe para ambiente de teste, sem precisar tocar no código.
   */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "5511950291364",
} as const;

/**
 * C5 — a validade expira de verdade, verificada no servidor. Sem renovação
 * automática de "última chance". O §8 do BRAND-VISUAL veta countdown e
 * cronômetro, então isto nunca é exibido como relógio regressivo: só como data.
 */
export const VALIDADE_PROPOSTA_HORAS = 72;

/**
 * Moeda por idioma (decisão do Willian, 13/08/2026).
 *
 * BRL no pt-BR e USD no internacional. A conversão automática foi descartada
 * de propósito: ela introduziria uma taxa de câmbio que ninguém declarou e que
 * muda todo dia — e o princípio do produto é que nenhum número exibido venha
 * de fora do que a pessoa digitou. O idioma traduz o texto, não o dinheiro.
 *
 * FR segue USD junto do EN por ser o mesmo público internacional. Se a Renilza
 * abrir a França especificamente, virar EUR é esta linha.
 */
export type Moeda = "BRL" | "USD";

export const MOEDA_POR_IDIOMA: Record<string, Moeda> = {
  pt: "BRL",
  en: "USD",
  fr: "USD",
};

export function moedaDoIdioma(idioma: string | undefined): Moeda {
  return MOEDA_POR_IDIOMA[idioma ?? "pt"] ?? "BRL";
}

/**
 * Faixas dos sliders, por moeda. São limites de interface, não afirmações
 * sobre o mercado dela — por isso ficam largos e a copy nunca sugere um
 * "certo". As faixas em USD não são conversão das faixas em BRL: são degraus
 * próprios de quem cobra em dólar, escolhidos como limite de tela.
 */
export interface Faixa {
  min: number;
  max: number;
  step: number;
  padrao: number;
}

export type Faixas = Record<
  "precoAtual" | "precoDesejado" | "volumeMensal" | "pctUsado" | "valorParado",
  Faixa
>;

export const FAIXAS_POR_MOEDA: Record<Moeda, Faixas> = {
  BRL: {
    precoAtual: { min: 100, max: 5000, step: 50, padrao: 500 },
    precoDesejado: { min: 100, max: 20000, step: 50, padrao: 1200 },
    volumeMensal: { min: 1, max: 60, step: 1, padrao: 8 },
    pctUsado: { min: 5, max: 100, step: 5, padrao: 30 },
    valorParado: { min: 500, max: 40000, step: 250, padrao: 4000 },
  },
  USD: {
    precoAtual: { min: 25, max: 1000, step: 25, padrao: 150 },
    precoDesejado: { min: 25, max: 4000, step: 25, padrao: 350 },
    volumeMensal: { min: 1, max: 60, step: 1, padrao: 8 },
    pctUsado: { min: 5, max: 100, step: 5, padrao: 30 },
    valorParado: { min: 100, max: 8000, step: 50, padrao: 800 },
  },
};

/** Atalho para o caminho canônico (pt-BR). */
export const FAIXAS = FAIXAS_POR_MOEDA.BRL;

/** C4 — teto da fita ≈ 2–3× o preço atual. 2,5 é o meio da faixa aprovada. */
export const FATOR_TETO_FITA = 2.5;
