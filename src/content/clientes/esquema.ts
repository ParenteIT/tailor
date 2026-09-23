import { z } from "zod";
import { routing } from "@/i18n/routing";

/**
 * A fronteira white label do Tailor: tudo o que é de um cliente — marca,
 * vertentes, perguntas, faixas, produtos, preços e textos — é dado validado
 * aqui, nunca JSX. A Renilza é o primeiro cliente; um segundo cliente é um
 * segundo arquivo que passa por este mesmo esquema.
 *
 * O que NÃO mora aqui é o catálogo de peças que o código sabe desenhar
 * (ícones, figuras, gestos, contas). A configuração escolhe dentro dele pelo
 * nome, e o Zod recusa nome desconhecido na carga — erro de digitação num
 * arquivo de cliente derruba o build, não a tela dela.
 */

export const IDIOMAS = routing.locales;
export type Idioma = (typeof IDIOMAS)[number];

export const MOEDAS = ["BRL", "USD"] as const;
export type Moeda = (typeof MOEDAS)[number];

export const ICONES = [
  "agulha",
  "templo",
  "maca",
  "pontos",
  "linha",
  "alfinete",
  "carretel",
  "prumo",
  "cota",
  "toque",
  "aspas",
  "doc",
  "alvo",
  "interroga",
  "chat",
  "envelope",
  "tela",
] as const;
export type NomeIcone = (typeof ICONES)[number];

/** A figura que anda no topo de cada mundo, conforme ela avança. */
export const FIGURAS = ["agulha", "templo", "toque"] as const;
export type NomeFigura = (typeof FIGURAS)[number];

/** O gesto da opção escolhida. `contorno` é o da casa (telas comuns). */
export const GESTOS = ["contorno", "fio", "preenchimento", "onda"] as const;
export type NomeGesto = (typeof GESTOS)[number];

/**
 * Contas que o produto sabe fazer com as medidas dela. Cada conta declara os
 * papéis que precisa; a pergunta de medida tem de cobrir todos (conferido no
 * refine abaixo). É isto que permite trocar o texto e as faixas das réguas
 * sem tocar em código.
 */
export const CONTAS = {
  armario: ["pctUsado", "valorParado"],
  preco: ["precoAtual", "precoDesejado", "volumeMensal"],
} as const;
export type NomeConta = keyof typeof CONTAS;
export type PapelMedida = (typeof CONTAS)[NomeConta][number];
const PAPEIS = ["pctUsado", "valorParado", "precoAtual", "precoDesejado", "volumeMensal"] as const;

/** C1 — no máximo 9 telas do início ao gate, em cada ramo. */
export const MAXIMO_TELAS_ATE_O_GATE = 9;
/** Nome + cena + gate: as telas de todo ramo que não são pergunta do ramo. */
export const TELAS_COMUNS_ATE_O_GATE = 3;

const texto = z.string().trim().min(1);

/** Um texto em todos os idiomas do produto. Idioma faltando é erro de carga. */
export const Texto = z.object(
  Object.fromEntries(IDIOMAS.map((idioma) => [idioma, texto])) as Record<
    Idioma,
    typeof texto
  >
);
export type Texto = z.infer<typeof Texto>;

const id = z.string().regex(/^[a-z][a-zA-Z0-9]*$/, "id em camelCase, sem espaço");

/* Cores entram em CSS gerado no servidor: o formato é estreito de propósito,
   para que nenhum valor de configuração consiga fechar a regra e injetar
   outra. */
const cor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "cor em #rrggbb");
const corTranslucida = z
  .string()
  .regex(/^rgba\(\d{1,3},\s?\d{1,3},\s?\d{1,3},\s?(0|1|0?\.\d+)\)$/, "cor em rgba()");
const pintura = z.union([
  cor,
  z
    .string()
    .regex(
      /^linear-gradient\(\d{1,3}deg(,\s?#[0-9a-fA-F]{6}\s\d{1,3}%){2,6}\)$/,
      "degradê em linear-gradient(Ndeg, #rrggbb N%, …)"
    ),
]);

export const Mundo = z.object({
  esquema: z.enum(["escuro", "claro"]),
  fundo: cor,
  cartao: cor,
  tinta: cor,
  apoio: cor,
  linha: cor,
  /** Parte ainda não percorrida da figura (linha tracejada, planta do templo). */
  trilho: cor,
  acento: cor,
  acentoSuave: corTranslucida,
  ouro: cor,
  botaoFundo: pintura,
  botaoTinta: cor,
  /** Em px. 999 vira pílula. */
  raioBotao: z.number().int().min(0).max(999),
  /** A cor que preenche a opção escolhida, no gesto `preenchimento`. */
  preenchimento: pintura,
  tintaSobrePreenchimento: cor,
  painel: cor,
  painelTinta: cor,
  painelApoio: corTranslucida,
  painelAcento: cor,
  gesto: z.enum(GESTOS),
  /** Opções com ícone (casa, Posicionamento) ou com marcador (os outros). */
  iconesNasOpcoes: z.boolean(),
});
export type Mundo = z.infer<typeof Mundo>;

const Opcao = z.object({
  id,
  texto: Texto,
  icone: z.enum(ICONES).optional(),
});
export type Opcao = z.infer<typeof Opcao>;

const Faixa = z
  .object({
    min: z.number(),
    max: z.number(),
    step: z.number().positive(),
    padrao: z.number(),
  })
  .refine((f) => f.min < f.max && f.padrao >= f.min && f.padrao <= f.max, {
    message: "faixa com min < max e padrão dentro dela",
  });
export type FaixaRegua = z.infer<typeof Faixa>;

const CampoMedida = z.discriminatedUnion("formato", [
  z.object({
    id,
    papel: z.enum(PAPEIS),
    rotulo: Texto,
    formato: z.literal("pct"),
    faixa: Faixa,
  }),
  z.object({
    id,
    papel: z.enum(PAPEIS),
    rotulo: Texto,
    formato: z.literal("numero"),
    faixa: Faixa,
  }),
  z.object({
    id,
    papel: z.enum(PAPEIS),
    rotulo: Texto,
    formato: z.literal("moeda"),
    /** null = ainda sem régua nesta moeda; o ramo não abre nela. */
    faixaPorMoeda: z.record(z.enum(MOEDAS), Faixa.nullable()),
  }),
]);
export type CampoMedida = z.infer<typeof CampoMedida>;

const cabecalho = {
  id,
  kicker: Texto,
  titulo: Texto,
  apoio: Texto.optional(),
};

const OpcaoFaixa = Opcao.extend({
  /**
   * O piso da faixa, na moeda dela. A regra de oferta só considera produto
   * cujo preço caiba aqui. Em "Até X" o piso é X; null é "prefiro não dizer",
   * que não escolhe produto nenhum.
   */
  piso: z.number().nonnegative().nullable(),
});

export const Pergunta = z.discriminatedUnion("tipo", [
  z.object({
    ...cabecalho,
    tipo: z.literal("escolha"),
    opcoes: z.array(Opcao).min(2).max(6),
  }),
  z.object({
    ...cabecalho,
    tipo: z.literal("aberta"),
    placeholder: Texto,
    audio: z.boolean(),
  }),
  z.object({
    ...cabecalho,
    tipo: z.literal("medida"),
    conta: z.enum(Object.keys(CONTAS) as [NomeConta, ...NomeConta[]]),
    campos: z.array(CampoMedida).min(1).max(4),
    /** Texto da conta, com {marcadores} e **negrito**. */
    textoConta: Texto,
    /** Quando a meta declarada fica igual ao que ela já cobra (conta de preço). */
    textoContaIgual: Texto.optional(),
  }),
  z.object({
    ...cabecalho,
    tipo: z.literal("palavras"),
    min: z.number().int().min(1),
    max: z.number().int().min(1),
    opcoes: z.array(Opcao).min(3).max(12),
  }),
  z.object({
    ...cabecalho,
    tipo: z.literal("faixa"),
    /** null = sem faixas nesta moeda; o ramo não abre nela. */
    opcoesPorMoeda: z.record(z.enum(MOEDAS), z.array(OpcaoFaixa).min(2).nullable()),
  }),
]);
export type Pergunta = z.infer<typeof Pergunta>;
export type TipoPergunta = Pergunta["tipo"];

export const Vertente = z.object({
  id,
  cena: z.object({
    texto: Texto,
    icone: z.enum(ICONES),
    /** Como a cena volta citada no fim (padrão: o texto inteiro). */
    citacao: Texto.optional(),
  }),
  mundo: Mundo,
  figura: z.enum(FIGURAS),
  perguntas: z.array(Pergunta).min(1),
  /** Nomes de nível — só na proposta, nunca no quiz. */
  niveis: z.array(Texto).min(1),
});
export type Vertente = z.infer<typeof Vertente>;

export const Produto = z.object({
  id,
  vertente: id,
  /** Índice em `vertente.niveis`. */
  nivel: z.number().int().nonnegative(),
  nome: Texto,
  /**
   * Preço de referência da regra de oferta, por moeda. null = ainda sem
   * preço decidido nesta moeda: o produto existe no catálogo mas nunca é
   * ofertado nela.
   */
  preco: z.record(z.enum(MOEDAS), z.number().positive().nullable()),
  /**
   * O preço é o que cobra — não existe mais uma env separada para isso.
   * `publicado: false` é o freio: o produto fica fora da regra de oferta
   * (nunca escolhido) mesmo com preço preenchido, para o caso comum de "o
   * número já está decidido, mas ainda não é para vender" (decisão de
   * 23/09/2026, ao tirar `PRECO_*_CENTAVOS` do Netlify).
   */
  publicado: z.boolean(),
  recorrencia: z.enum(["unica", "mensal"]),
});
export type Produto = z.infer<typeof Produto>;

const Recibos = z.object({
  cena: z.array(Texto).min(1),
  escolha: z.array(Texto).min(1),
  aberta: z.array(Texto).min(1),
  medida: z.array(Texto).min(1),
  palavras: z.array(Texto).min(1),
  faixa: z.array(Texto).min(1),
});

const Textos = z.object({
  comum: z.object({
    avancar: Texto,
    ultimaPergunta: Texto,
    voltar: Texto,
    progresso: Texto,
    dotado: Texto,
    faltamDuas: Texto,
    ultima: Texto,
  }),
  recibos: Recibos,
  abertura: z.object({
    titulo: Texto,
    apoio: Texto,
    rotuloNome: Texto,
    placeholderNome: Texto,
    nota: Texto,
    cta: Texto,
  }),
  cena: z.object({
    kicker: Texto,
    titulo: Texto,
    tituloSemNome: Texto,
    rotuloLivre: Texto,
    placeholderLivre: Texto,
  }),
  aberta: z.object({
    rotulo: Texto,
    audio: z.object({
      convite: Texto,
      consentimento: Texto,
      consentir: Texto,
      recusar: Texto,
      gravando: Texto,
      parar: Texto,
      transcrevendo: Texto,
      erro: Texto,
    }),
  }),
  palavras: z.object({ minimo: Texto, maisUma: Texto, completas: Texto }),
  medida: z.object({ convite: Texto }),
  gate: z.object({
    kicker: Texto,
    titulo: Texto,
    tituloSemNome: Texto,
    apoio: Texto,
    whatsapp: Texto,
    whatsappPlaceholder: Texto,
    email: Texto,
    emailPlaceholder: Texto,
    privacidade: Texto,
    cta: Texto,
    enviando: Texto,
    erroWhatsapp: Texto,
    erroEmail: Texto,
    erroGeral: Texto,
  }),
  prazo: z.object({
    kicker: Texto,
    titulo: Texto,
    apoio: Texto,
    cta: Texto,
    pular: Texto,
    opcoes: z.array(Opcao).min(2),
  }),
  montando: z.object({ kicker: Texto, linhas: z.array(Texto).min(1) }),
  fim: z.object({
    kicker: Texto,
    titulo: Texto,
    cena: Texto,
    frase: Texto,
    cta: Texto,
    apoio: Texto,
    /** Mensagem pré-preenchida no WhatsApp, com {nome} e {link}. */
    mensagemWhatsapp: Texto,
  }),
  painel: z.object({
    passos: z.object({ nome: Texto, cena: Texto, ramo: Texto, contato: Texto }),
    rodape: Texto,
  }),
  indisponivel: z.object({ titulo: Texto, corpo: Texto, cta: Texto }),
  idioma: Texto,
  meta: z.object({ titulo: Texto, descricao: Texto }),
  /** Diagnóstico sem modelo disponível: devolve as palavras dela, sem inventar. */
  reserva: z.object({ frase: Texto, guardei: Texto, palavras: Texto }),
  proposta: z.object({
    /** O nível do produto ofertado, como "para quem é" — nunca "você vai virar" (C2). */
    nivel: Texto,
    semOferta: Texto,
    semOfertaCta: Texto,
    mensagemWhatsapp: Texto,
  }),
});

export const Cliente = z
  .object({
    id,
    /**
     * O domínio pelo qual este cliente é resolvido em runtime (`src/lib/tenants.ts`),
     * um por deploy multi-tenant. Sem porta, minúsculo — "sobmedida.renilzamiranda.com",
     * nunca uma URL inteira.
     */
    dominio: z.string().min(1),
    /** Domínios extras que resolvem para o mesmo cliente (preview, staging). */
    dominiosExtra: z.array(z.string().min(1)).default([]),
    /**
     * Versão do roteiro. Muda quando perguntas ou opções mudam: um molde
     * guardado no aparelho com outra versão é descartado em vez de ser lido
     * como resposta a perguntas que ela nunca viu.
     */
    versaoFluxo: z.string().min(1),
    idiomaPadrao: z.enum(IDIOMAS),
    moedaPorIdioma: z.record(z.enum(IDIOMAS), z.enum(MOEDAS)),
    marca: z.object({
      nome: texto,
      fraseMestra: Texto,
      logo: z.object({
        degrade: z.array(cor).min(2).max(6),
        filete: cor,
        sub: cor,
      }),
    }),
    contato: z.object({ whatsapp: z.string().regex(/^\d{10,15}$/) }),
    casa: Mundo,
    cenaLivre: z.object({
      texto: Texto,
      icone: z.enum(ICONES),
      /** Vertente cujas perguntas ela segue. O lead fica marcado para leitura manual. */
      segue: id,
    }),
    vertentes: z.array(Vertente).min(1),
    produtos: z.array(Produto),
    textos: Textos,
  })
  .superRefine((c, ctx) => {
    const ids = c.vertentes.map((v) => v.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: "custom", message: "vertentes com id repetido" });
    }
    if (ids.includes("casa") || ids.includes("livre")) {
      ctx.addIssue({ code: "custom", message: "'casa' e 'livre' são ids reservados" });
    }
    if (!ids.includes(c.cenaLivre.segue)) {
      ctx.addIssue({ code: "custom", message: "cenaLivre.segue aponta para vertente inexistente" });
    }

    for (const v of c.vertentes) {
      // C1 na carga: um cliente com ramo longo demais nem sobe.
      if (v.perguntas.length + TELAS_COMUNS_ATE_O_GATE > MAXIMO_TELAS_ATE_O_GATE) {
        ctx.addIssue({
          code: "custom",
          message: `C1: o ramo '${v.id}' passa de ${MAXIMO_TELAS_ATE_O_GATE} telas até o gate`,
        });
      }
      const pids = v.perguntas.map((p) => p.id);
      if (new Set(pids).size !== pids.length) {
        ctx.addIssue({ code: "custom", message: `perguntas com id repetido em '${v.id}'` });
      }
      for (const p of v.perguntas) validarPergunta(p, v.id, ctx);
    }

    const pids = c.produtos.map((p) => p.id);
    if (new Set(pids).size !== pids.length) {
      ctx.addIssue({ code: "custom", message: "produtos com id repetido" });
    }
    for (const p of c.produtos) {
      const v = c.vertentes.find((x) => x.id === p.vertente);
      if (!v) {
        ctx.addIssue({ code: "custom", message: `produto '${p.id}' em vertente inexistente` });
      } else if (p.nivel >= v.niveis.length) {
        ctx.addIssue({ code: "custom", message: `produto '${p.id}' em nível inexistente` });
      }
    }
  });
export type Cliente = z.infer<typeof Cliente>;

function validarPergunta(p: Pergunta, vertente: string, ctx: z.RefinementCtx) {
  const onde = `${vertente}.${p.id}`;
  if (p.tipo === "medida") {
    const papeis = p.campos.map((c) => c.papel);
    for (const papel of CONTAS[p.conta]) {
      if (!papeis.includes(papel)) {
        ctx.addIssue({ code: "custom", message: `${onde}: a conta '${p.conta}' precisa de '${papel}'` });
      }
    }
  }
  if (p.tipo === "palavras" && (p.min > p.max || p.max > p.opcoes.length)) {
    ctx.addIssue({ code: "custom", message: `${onde}: min/max de palavras incoerente` });
  }
  const opcoes =
    p.tipo === "escolha" || p.tipo === "palavras"
      ? p.opcoes
      : p.tipo === "faixa"
        ? Object.values(p.opcoesPorMoeda).flatMap((o) => o ?? [])
        : [];
  if (p.tipo !== "faixa") {
    const oids = opcoes.map((o) => o.id);
    if (new Set(oids).size !== oids.length) {
      ctx.addIssue({ code: "custom", message: `${onde}: opções com id repetido` });
    }
  }
}
