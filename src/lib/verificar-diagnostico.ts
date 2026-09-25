import type { Idioma } from "@/content/clientes/esquema";

/**
 * O prompt pede; este gate confere. Tudo o que dá para verificar sem modelo
 * é verificado aqui, no texto que o modelo devolveu E no texto de reserva:
 * se falhar, a proposta tenta de novo uma vez e depois cai na reserva
 * (auditoria da voz, 24/09/2026, risco 4). Lista lexical não substitui a
 * regra semântica do prompt — só pega o que escapou dela em palavra.
 */

export interface ContextoDaVerificacao {
  idioma: Idioma;
  /** Sai do texto antes das checagens: "Conceição" não é português num texto em inglês. */
  primeiroNome: string;
  /** Os textos que ela digitou: única fonte legítima de citação. */
  escritoPorEla: string[];
  /** Texto das opções que ela marcou: nunca citação, pode ser paráfrase. */
  opcoesMarcadas: string[];
  /** Termos da vertente (já no idioma da proposta), além dos de produto. */
  proibidosDaVertente: string[];
  /** "Nenhuma dessas": nenhuma lente de vertente, nenhum estado emocional. */
  leituraNeutra: boolean;
  /** Nomes de produto e de nível, que nunca entram na leitura. */
  nomesProibidos: string[];
  /** A reserva não é prosa do modelo: não precisa ter 3 a 4 frases. */
  contarFrases: boolean;
}

/** Promessa, resultado e o que o HANDOFF §11 veta nas três vertentes. */
const PROIBIDOS_DE_PRODUTO: Record<Idioma, string[]> = {
  pt: [
    "faturar", "faturamento", "fature", "lucro", "lucrar", "mais clientes", "agenda cheia",
    "visibilidade", "promoção", "reconhecimento", "sucesso", "convite", "convidada",
    "indicação", "referência", "ser lembrada", "desperdício", "desperdiçado", "desperdiçada",
    "fracasso", "laudo", "certificado", "certificação", "metodologia francesa", "urgente",
    "última chance", "garantia", "garantido", "garantida", "sua melhor versão",
  ],
  en: [
    "revenue", "profit", "earn more", "more clients", "full schedule", "visibility",
    "promotion", "recognition", "success", "invitation", "invited", "referral", "go-to",
    "be remembered", "waste", "wasted", "failure", "certificate", "certification",
    "french method", "urgent", "last chance", "guarantee", "guaranteed", "best version",
  ],
};

/** Construções que preveem resultado (ajuste 16). */
const PREDITIVOS: Record<Idioma, string[]> = {
  pt: [
    "fará", "farão", "fará com que", "passará a", "passará", "começará a",
    "pode te levar", "abre caminho", "é o que falta", "finalmente",
  ],
  en: ["will", "going to", "finally", "lead you to", "open the door", "is what's missing", "you'll", "it'll"],
};

/**
 * Futuro com auxiliar só conta seguido de infinitivo: "vai fazer" prevê,
 * "a mão vai direto" e "você vai até a casa" não (rodada de 24/09, F01/F07/F12).
 */
const AUXILIAR_DE_FUTURO: Partial<Record<Idioma, RegExp>> = {
  pt: /(?<!\p{L})(vai|vão|irá|irão)\s+\p{L}+(?:ar|er|ir|or|ôr)(?!\p{L})/giu,
};

const CREDENCIAIS: Record<Idioma, string[]> = {
  pt: ["formação", "formada", "escola", "certificada", "anos de experiência", "relooking", "especialista"],
  en: ["trained", "training", "school", "certified", "years of experience", "relooking", "specialist"],
};

/** Só na leitura neutra: lente de vertente e rótulo emocional (ajuste 15). */
const NEUTRA: Record<Idioma, string[]> = {
  pt: [
    "imagem", "roupa", "armário", "aparência", "estilo", "posicionamento", "atendimento",
    "fragilizada", "frágil", "perdida", "em reconstrução", "vulnerável", "triste", "ansiosa",
    "deprimida", "sofrendo", "oportunidade",
  ],
  en: [
    "image", "clothes", "wardrobe", "appearance", "style", "positioning", "client care",
    "fragile", "lost", "rebuilding", "vulnerable", "sad", "anxious", "depressed", "hurting",
    "opportunity",
  ],
};

/** Marcadores da outra língua, fora de citação (ajuste 7). */
const OUTRA_LINGUA: Record<Idioma, { marcadores: RegExp; limite: number }> = {
  pt: { marcadores: /(?<!\p{L})(the|and|you|your|is|with|of|to|what)(?!\p{L})/giu, limite: 3 },
  en: { marcadores: /(?<!\p{L})(você|não|que|com|para|uma|isso|seu|sua|está)(?!\p{L})|[çãõ]/giu, limite: 1 },
};

const CITACAO = /“([^”]*)”|"([^"]*)"|«([^»]*)»/g;

/**
 * "Você escreveu que queria ser lembrada como…": desejo dela relatado como
 * desejo presente (auditoria, ajuste 12). Um termo proibido que ela mesma
 * escreveu passa dentro desta oração; previsão e número continuam barrados.
 */
const RELATO: Record<Idioma, RegExp> = {
  pt: /(?<!\p{L})(?:escreveu|disse|contou)\s+que\s+([^.;:—–!?]+)/giu,
  en: /(?<!\p{L})(?:wrote|said|told me)\s+(?:that\s+)?([^.;:—–!?]+)/giu,
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFC")
    .toLowerCase()
    .replace(/^[\s.…,;:!?'"“”«»-]+|[\s.…,;:!?'"“”«»-]+$/g, "")
    .replace(/\s+/g, " ");
}

function escapar(termo: string): string {
  return termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function contem(texto: string, termo: string, sensivel = false): boolean {
  const flags = sensivel ? "u" : "iu";
  return new RegExp(`(?<!\\p{L})${escapar(termo)}(?!\\p{L})`, flags).test(texto);
}

/**
 * O modelo insiste em pôr entre aspas a opção que descreve o que os outros
 * dizem ("muito competente"; 6 de 36 na rodada 2 de 24/09). Trecho entre
 * aspas que não é dela mas sai de uma opção marcada perde só as aspas: vira
 * paráfrase, e o gate confere o resto normalmente.
 */
export function tirarAspasDeOpcao(texto: string, ctx: ContextoDaVerificacao): string {
  const dela = ctx.escritoPorEla.map(normalizar).filter(Boolean);
  const opcoes = ctx.opcoesMarcadas.map(normalizar).filter(Boolean);
  return texto.replace(CITACAO, (inteiro, a?: string, b?: string, c?: string) => {
    const alvo = normalizar(a ?? b ?? c ?? "");
    if (!alvo || dela.some((d) => d.includes(alvo))) return inteiro;
    return opcoes.some((o) => o.includes(alvo)) ? (a ?? b ?? c ?? "") : inteiro;
  });
}

/** Toda ocorrência do termo está dentro de um relato, e o termo é dela. */
function relatadoPorEla(fora: string, termo: string, ctx: ContextoDaVerificacao): boolean {
  if (!ctx.escritoPorEla.some((d) => contem(d, termo))) return false;
  const semRelato = fora.replace(RELATO[ctx.idioma], (inteiro, oracao: string) => inteiro.replace(oracao, " "));
  return !contem(semRelato, termo);
}

export function verificarDiagnostico(texto: string, ctx: ContextoDaVerificacao): string[] {
  const problemas: string[] = [];
  const limpo = texto.trim();
  if (!limpo) return ["vazio"];

  const dela = ctx.escritoPorEla.map(normalizar).filter(Boolean);
  const citacoes = [...limpo.matchAll(CITACAO)].map((m) => m[1] ?? m[2] ?? m[3] ?? "");
  for (const c of citacoes) {
    const alvo = normalizar(c);
    if (alvo && !dela.some((d) => d.includes(alvo))) problemas.push(`citação que não é texto dela: "${c}"`);
  }
  // Fora das citações literais: o que é voz da autora.
  const semNome = ctx.primeiroNome.trim()
    ? limpo.replace(new RegExp(`(?<!\\p{L})${escapar(ctx.primeiroNome.trim())}(?!\\p{L})`, "gu"), "Nome")
    : limpo;
  const fora = semNome.replace(CITACAO, " «» ");

  if (/(^|\n)\s*([-*•#]|\d+[.)])\s/.test(limpo) || /\*\*|__|^#/m.test(limpo)) problemas.push("markdown ou lista");
  if (fora.includes("!")) problemas.push("exclamação");
  if (/\p{N}/u.test(fora)) problemas.push("número fora de citação");

  if (ctx.contarFrases) {
    const frases = fora.split(/(?<=[.!?…])\s+/).filter((f) => /\p{L}/u.test(f));
    if (frases.length < 3 || frases.length > 4) problemas.push(`${frases.length} frases`);
  }

  const listas: [string, string[]][] = [
    ["proibido", [...PROIBIDOS_DE_PRODUTO[ctx.idioma], ...ctx.proibidosDaVertente]],
    ["previsão", PREDITIVOS[ctx.idioma]],
    ["credencial", CREDENCIAIS[ctx.idioma]],
    ...(ctx.leituraNeutra ? ([["leitura neutra", NEUTRA[ctx.idioma]]] as [string, string[]][]) : []),
  ];
  for (const [tipo, termos] of listas) {
    for (const termo of termos) {
      if (!contem(fora, termo)) continue;
      if (tipo === "proibido" && relatadoPorEla(fora, termo, ctx)) continue;
      problemas.push(`${tipo}: ${termo}`);
    }
  }
  const auxiliar = AUXILIAR_DE_FUTURO[ctx.idioma];
  if (auxiliar) for (const m of fora.matchAll(auxiliar)) problemas.push(`previsão: ${m[1].toLowerCase()}`);
  for (const nome of ctx.nomesProibidos) if (contem(fora, nome, true)) problemas.push(`produto ou nível: ${nome}`);

  const { marcadores, limite } = OUTRA_LINGUA[ctx.idioma];
  const achados = fora.match(marcadores)?.length ?? 0;
  if (achados > limite) problemas.push("outra língua fora de citação");

  return [...new Set(problemas)];
}
