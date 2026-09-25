import { z } from "zod";
import {
  MAXIMO_TELAS_ATE_O_GATE,
  type CampoMedida,
  type Cliente,
  type FaixaRegua,
  type Moeda,
  type Mundo,
  type NomeConta,
  type Pergunta,
  type Produto,
  type Vertente,
} from "@/content/clientes/esquema";
import { calcularGap, type EntradaGap, type Gap } from "@/lib/gap";

/**
 * O fluxo do diagnóstico da holding, lido da configuração do cliente.
 *
 *   1 nome · 2 cena (define a vertente) · 3..8 perguntas do ramo · 9 gate
 *   depois do gate, fora da conta de C1: prazo · montando · fim
 *
 * Entrada direta por campanha (`/v/<vertente>`) pula a cena: nome e as
 * perguntas do ramo, 8 telas até o gate.
 *
 * Nada aqui conhece "Imagem" ou "armário": a vertente, as perguntas e as
 * faixas são dados. O mesmo módulo roda no navegador (liberar o avanço) e no
 * servidor (refazer a validação antes de gravar).
 */

export const CENA_LIVRE = "livre";

export type Entrada = "cena" | "direta";

/** Escolha e faixa guardam o id da opção; palavras, a lista de ids; medida,
    só os campos que ela de fato mexeu. */
export type ValorResposta = string | string[] | Record<string, number>;

/** Como o texto de um campo aberto chegou: "misto" é digitado + transcrito. */
export type Via = "texto" | "audio" | "misto";
const VIAS = ["texto", "audio", "misto"] as const;

export interface RespostasHolding {
  nome: string;
  entrada: Entrada;
  /** Id da vertente escolhida na cena, ou "livre". */
  cena: string | null;
  /** Texto de "Nenhuma dessas". */
  livre: string;
  viaLivre: Via | null;
  /** Respostas do ramo atual, por id de pergunta. Trocar de vertente zera. */
  ramo: Record<string, ValorResposta>;
  viaAberta: Via | null;
  /**
   * Timestamp do primeiro "Pode gravar" — a evidência de consentimento de
   * áudio. Vale para todos os campos deste diagnóstico e nunca é regravado;
   * só um diagnóstico novo (respostas vazias) pede de novo.
   */
  consentimentoAudioEm: string | null;
  prazo: string | null;
  whatsapp: string;
  email: string;
}

export const RESPOSTAS_VAZIAS: RespostasHolding = {
  nome: "",
  entrada: "cena",
  cena: null,
  livre: "",
  viaLivre: null,
  ramo: {},
  viaAberta: null,
  consentimentoAudioEm: null,
  prazo: null,
  whatsapp: "",
  email: "",
};

export type Tela =
  | { tipo: "nome" }
  | { tipo: "cena" }
  | { tipo: "pergunta"; pergunta: Pergunta }
  | { tipo: "gate" }
  | { tipo: "prazo" }
  | { tipo: "montando" }
  | { tipo: "fim" };

export type TipoTela = Tela["tipo"];

/* ==========================================================================
   Vertentes
   ========================================================================= */

export function vertentePorId(cliente: Cliente, id: string | null | undefined): Vertente | null {
  return cliente.vertentes.find((v) => v.id === id) ?? null;
}

/** "Nenhuma dessas" segue pelo ramo que a configuração indicar. */
export function vertenteDaCena(cliente: Cliente, cena: string | null): Vertente | null {
  if (cena === CENA_LIVRE) return vertentePorId(cliente, cliente.cenaLivre.segue);
  return vertentePorId(cliente, cena);
}

export function leituraManual(r: RespostasHolding): boolean {
  return r.cena === CENA_LIVRE;
}

/**
 * Um ramo só abre numa moeda quando todas as réguas e faixas dela existem
 * nessa moeda. Sem isso, a tela mostraria número que ninguém declarou.
 */
export function vertenteDisponivel(v: Vertente, moeda: Moeda): boolean {
  return v.perguntas.every((p) => {
    if (p.tipo === "faixa") return p.opcoesPorMoeda[moeda] !== null;
    if (p.tipo === "medida") return p.campos.every((c) => faixaDoCampo(c, moeda) !== null);
    return true;
  });
}

export function vertentesDisponiveis(cliente: Cliente, moeda: Moeda): Vertente[] {
  return cliente.vertentes.filter((v) => vertenteDisponivel(v, moeda));
}

/** A cena livre só aparece se o ramo que ela segue estiver aberto. */
export function cenaLivreDisponivel(cliente: Cliente, moeda: Moeda): boolean {
  const v = vertentePorId(cliente, cliente.cenaLivre.segue);
  return v !== null && vertenteDisponivel(v, moeda);
}

export function mundoDaTela(cliente: Cliente, tela: Tela, r: RespostasHolding): Mundo {
  if (tela.tipo === "nome" || tela.tipo === "cena") return cliente.casa;
  return vertenteDaCena(cliente, r.cena)?.mundo ?? cliente.casa;
}

/* ==========================================================================
   Telas
   ========================================================================= */

export function telasDoRamo(v: Vertente | null, entrada: Entrada): Tela[] {
  const inicio: Tela[] = entrada === "direta" ? [{ tipo: "nome" }] : [{ tipo: "nome" }, { tipo: "cena" }];
  if (!v) return inicio;
  return [
    ...inicio,
    ...v.perguntas.map((pergunta): Tela => ({ tipo: "pergunta", pergunta })),
    { tipo: "gate" },
    { tipo: "prazo" },
    { tipo: "montando" },
    { tipo: "fim" },
  ];
}

export function telasDe(cliente: Cliente, r: RespostasHolding): Tela[] {
  return telasDoRamo(vertenteDaCena(cliente, r.cena), r.entrada);
}

/** C1 — telas do início ao gate, inclusive, num ramo. */
export function telasAteOGate(v: Vertente, entrada: Entrada): number {
  return telasDoRamo(v, entrada).findIndex((t) => t.tipo === "gate") + 1;
}

/**
 * O total que o contador mostra ("2 de 9"). Antes da escolha não existe ramo,
 * então vale o maior entre os ramos abertos — com a Renilza, 9 em todos.
 */
export function totalDePecas(cliente: Cliente, r: RespostasHolding, moeda: Moeda): number {
  const v = vertenteDaCena(cliente, r.cena);
  if (v) return telasAteOGate(v, r.entrada);
  const abertos = vertentesDisponiveis(cliente, moeda);
  const lista = abertos.length ? abertos : cliente.vertentes;
  return Math.min(
    MAXIMO_TELAS_ATE_O_GATE,
    Math.max(...lista.map((x) => telasAteOGate(x, r.entrada)))
  );
}

/* ==========================================================================
   Validação — a mesma régua no navegador e no servidor
   ========================================================================= */

export function faixaDoCampo(campo: CampoMedida, moeda: Moeda): FaixaRegua | null {
  return campo.formato === "moeda" ? campo.faixaPorMoeda[moeda] : campo.faixa;
}

export function opcoesDaFaixa(p: Pergunta & { tipo: "faixa" }, moeda: Moeda) {
  return p.opcoesPorMoeda[moeda] ?? [];
}

function registro(valor: ValorResposta | undefined): Record<string, number> | null {
  return valor && typeof valor === "object" && !Array.isArray(valor) ? valor : null;
}

/** O valor tem a forma certa para a pergunta? (completo ou não) */
export function valorValido(p: Pergunta, valor: unknown, moeda: Moeda): boolean {
  switch (p.tipo) {
    case "escolha":
      return typeof valor === "string" && p.opcoes.some((o) => o.id === valor);
    case "faixa":
      return typeof valor === "string" && opcoesDaFaixa(p, moeda).some((o) => o.id === valor);
    case "aberta":
      return typeof valor === "string" && valor.length <= LIMITE_ABERTA;
    case "palavras":
      return (
        Array.isArray(valor) &&
        valor.length <= p.max &&
        new Set(valor).size === valor.length &&
        valor.every((w) => typeof w === "string" && p.opcoes.some((o) => o.id === w))
      );
    case "medida": {
      if (!valor || typeof valor !== "object" || Array.isArray(valor)) return false;
      return Object.entries(valor).every(([id, n]) => {
        const campo = p.campos.find((c) => c.id === id);
        const faixa = campo ? faixaDoCampo(campo, moeda) : null;
        return (
          faixa !== null &&
          typeof n === "number" &&
          Number.isFinite(n) &&
          n >= faixa.min &&
          n <= faixa.max
        );
      });
    }
  }
}

export function perguntaCompleta(p: Pergunta, valor: ValorResposta | undefined, moeda: Moeda): boolean {
  if (valor === undefined || !valorValido(p, valor, moeda)) return false;
  switch (p.tipo) {
    case "escolha":
    case "faixa":
      return true;
    case "aberta":
      return (valor as string).trim().length > 2;
    case "palavras":
      return (valor as string[]).length >= p.min;
    case "medida": {
      const r = registro(valor);
      return r !== null && p.campos.every((c) => typeof r[c.id] === "number");
    }
  }
}

export function nomeValido(nome: string): boolean {
  return nome.trim().length >= 2;
}

export function whatsappValido(valor: string): boolean {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length >= 10 && digitos.length <= 15;
}

export function emailValido(valor: string): boolean {
  const v = valor.trim();
  return v.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function telaCompleta(cliente: Cliente, tela: Tela, r: RespostasHolding, moeda: Moeda): boolean {
  switch (tela.tipo) {
    case "nome":
      return nomeValido(r.nome);
    case "cena": {
      const v = vertenteDaCena(cliente, r.cena);
      if (!v || !vertenteDisponivel(v, moeda)) return false;
      return r.cena !== CENA_LIVRE || r.livre.trim().length > 1;
    }
    case "pergunta":
      return perguntaCompleta(tela.pergunta, r.ramo[tela.pergunta.id], moeda);
    case "gate":
      return whatsappValido(r.whatsapp) && emailValido(r.email);
    case "prazo":
    case "montando":
    case "fim":
      return true;
  }
}

/** Tudo antes do gate respondido — o que o servidor exige para gerar a proposta. */
export function ramoCompleto(cliente: Cliente, r: RespostasHolding, moeda: Moeda): boolean {
  const telas = telasDe(cliente, r);
  const gate = telas.findIndex((t) => t.tipo === "gate");
  return gate > 0 && telas.slice(0, gate).every((t) => telaCompleta(cliente, t, r, moeda));
}

/**
 * Trocar a cena troca o ramo; as respostas do ramo anterior não podem ser
 * lidas como respostas das perguntas do novo (ids iguais, como "frase" e
 * "medida", significam perguntas diferentes em cada mundo).
 */
export function escolherCena(cliente: Cliente, r: RespostasHolding, cena: string): RespostasHolding {
  const antes = vertenteDaCena(cliente, r.cena)?.id ?? null;
  const depois = vertenteDaCena(cliente, cena)?.id ?? null;
  return {
    ...r,
    cena,
    livre: cena === CENA_LIVRE ? r.livre : "",
    viaLivre: cena === CENA_LIVRE ? r.viaLivre : null,
    ramo: antes === depois ? r.ramo : {},
    viaAberta: antes === depois ? r.viaAberta : null,
  };
}

/**
 * Atualiza uma régua. Na conta de preço, a meta nunca fica abaixo do que ela
 * já cobra — a mesma trava que `calcularGap` refaz no servidor.
 */
export function ajustarMedida(
  p: Pergunta & { tipo: "medida" },
  atual: Record<string, number>,
  campoId: string,
  valor: number
): Record<string, number> {
  const novo = { ...atual, [campoId]: valor };
  if (p.conta === "preco") {
    const a = p.campos.find((c) => c.papel === "precoAtual")?.id;
    const d = p.campos.find((c) => c.papel === "precoDesejado")?.id;
    if (a && d && typeof novo[a] === "number" && typeof novo[d] === "number" && novo[d] < novo[a]) {
      novo[d] = novo[a];
    }
  }
  return novo;
}

/** As medidas dela, pelos papéis que a aritmética conhece. */
export function entradaDaMedida(p: Pergunta & { tipo: "medida" }, valor: ValorResposta | undefined): EntradaGap {
  const r = registro(valor) ?? {};
  const entrada: EntradaGap = {};
  for (const campo of p.campos) {
    if (typeof r[campo.id] === "number") entrada[campo.papel] = r[campo.id];
  }
  return entrada;
}

const TRILHA_DA_CONTA: Record<NomeConta, "guarda_roupa" | "precificacao"> = {
  armario: "guarda_roupa",
  preco: "precificacao",
};

/** A conta dela — sempre `calcularGap`, a mesma aritmética da proposta. */
export function contaDaMedida(p: Pergunta & { tipo: "medida" }, valor: ValorResposta | undefined): Gap | null {
  return calcularGap(entradaDaMedida(p, valor), TRILHA_DA_CONTA[p.conta]);
}

/* ==========================================================================
   Esquema das respostas — refeito no servidor, reaproveitado na retomada
   ========================================================================= */

const ValorBruto = z.union([
  z.string().max(4000),
  z.array(z.string().max(40)).max(12),
  z.record(z.string().max(40), z.number()),
]);

export function esquemaRespostas(cliente: Cliente, moeda: Moeda) {
  return z
    .object({
      nome: z.string().max(120),
      entrada: z.enum(["cena", "direta"]),
      cena: z.string().max(40).nullable(),
      livre: z.string().max(LIMITE_LIVRE),
      viaLivre: z.enum(VIAS).nullable().default(null),
      ramo: z.record(z.string().max(40), ValorBruto),
      viaAberta: z.enum(VIAS).nullable(),
      consentimentoAudioEm: z.iso.datetime().nullable(),
      prazo: z.string().max(40).nullable(),
    })
    .superRefine((r, ctx) => {
      // Áudio só passa pela transcrição depois do "Pode gravar": via de áudio
      // sem o carimbo é resposta que não pode existir (LGPD, A24).
      const usouAudio = [r.viaAberta, r.viaLivre].some((v) => v === "audio" || v === "misto");
      if (usouAudio && !r.consentimentoAudioEm) {
        ctx.addIssue({ code: "custom", path: ["consentimentoAudioEm"], message: "áudio sem consentimento" });
      }
      if (r.cena !== null && !vertenteDaCena(cliente, r.cena)) {
        ctx.addIssue({ code: "custom", path: ["cena"], message: "cena desconhecida" });
        return;
      }
      if (r.entrada === "direta" && r.cena === CENA_LIVRE) {
        ctx.addIssue({ code: "custom", path: ["cena"], message: "entrada direta não tem cena livre" });
      }
      const v = vertenteDaCena(cliente, r.cena);
      for (const [id, valor] of Object.entries(r.ramo)) {
        const p = v?.perguntas.find((x) => x.id === id);
        if (!p || !valorValido(p, valor, moeda)) {
          ctx.addIssue({ code: "custom", path: ["ramo", id], message: "resposta inválida" });
        }
      }
      if (r.prazo !== null && !cliente.textos.prazo.opcoes.some((o) => o.id === r.prazo)) {
        ctx.addIssue({ code: "custom", path: ["prazo"], message: "prazo desconhecido" });
      }
    });
}

export type RespostasEnviadas = Omit<RespostasHolding, "whatsapp" | "email">;

function viaOuNulo(v: unknown): Via | null {
  return (VIAS as readonly unknown[]).includes(v) ? (v as Via) : null;
}

/* ==========================================================================
   Áudio num campo aberto
   ========================================================================= */

export const LIMITE_ABERTA = 4000;
export const LIMITE_LIVRE = 2000;

/**
 * A transcrição se soma ao que ela já tinha digitado, nunca o substitui (A25).
 * Passando do limite do campo, corta o fim da transcrição, não o texto dela.
 */
export function juntarTranscricao(atual: string, transcrito: string, limite: number): string {
  const antes = atual.trimEnd();
  const junto = antes ? `${antes} ${transcrito.trim()}` : transcrito.trim();
  return junto.slice(0, limite);
}

/** A via depois de uma transcrição: com texto antes, vira "misto". */
export function viaDepoisDoAudio(atual: string, via: Via | null): Via {
  if (via === "misto") return "misto";
  if (!atual.trim()) return "audio";
  return via === "audio" ? "audio" : "misto";
}

/** A via depois de ela digitar: quem já gravou continua marcado. */
export function viaDepoisDoTexto(via: Via | null): Via {
  return via ?? "texto";
}

/** A coluna `*_via` do banco só conhece texto e áudio: misto passou por áudio. */
export function viaDaColuna(via: Via | null): "texto" | "audio" | null {
  if (via === null) return null;
  return via === "texto" ? "texto" : "audio";
}

/**
 * Leitura tolerante para o que veio do aparelho dela: o que não passa volta
 * ao vazio, campo a campo — nunca a molde inteira recusada por um detalhe.
 */
export function sanearRespostas(cliente: Cliente, bruto: unknown, moeda: Moeda): RespostasHolding {
  if (typeof bruto !== "object" || bruto === null) return RESPOSTAS_VAZIAS;
  const b = bruto as Record<string, unknown>;
  const texto = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
  const entrada: Entrada = b.entrada === "direta" ? "direta" : "cena";
  const cenaBruta = typeof b.cena === "string" ? b.cena : null;
  const cena =
    cenaBruta && vertenteDaCena(cliente, cenaBruta) && !(entrada === "direta" && cenaBruta === CENA_LIVRE)
      ? cenaBruta
      : null;
  const v = vertenteDaCena(cliente, cena);
  const ramo: Record<string, ValorResposta> = {};
  if (v && typeof b.ramo === "object" && b.ramo !== null) {
    for (const [id, valor] of Object.entries(b.ramo as Record<string, unknown>)) {
      const p = v.perguntas.find((x) => x.id === id);
      if (p && valorValido(p, valor, moeda)) ramo[id] = valor as ValorResposta;
    }
  }
  const prazo =
    typeof b.prazo === "string" && cliente.textos.prazo.opcoes.some((o) => o.id === b.prazo)
      ? b.prazo
      : null;
  return {
    nome: texto(b.nome, 120),
    entrada,
    cena,
    livre: cena === CENA_LIVRE ? texto(b.livre, LIMITE_LIVRE) : "",
    viaLivre: cena === CENA_LIVRE ? viaOuNulo(b.viaLivre) : null,
    ramo,
    viaAberta: viaOuNulo(b.viaAberta),
    consentimentoAudioEm:
      typeof b.consentimentoAudioEm === "string" && z.iso.datetime().safeParse(b.consentimentoAudioEm).success
        ? b.consentimentoAudioEm
        : null,
    prazo,
    whatsapp: texto(b.whatsapp, 40),
    email: texto(b.email, 200),
  };
}

/* ==========================================================================
   Oferta — pela faixa que ela marcou
   ========================================================================= */

export function perguntaDeFaixa(v: Vertente) {
  return v.perguntas.find((p): p is Pergunta & { tipo: "faixa" } => p.tipo === "faixa") ?? null;
}

/**
 * A faixa é teto de abertura, não orçamento a preencher. Só entra produto da
 * vertente cujo preço caiba no PISO da faixa marcada (em "Até X", o piso é X,
 * o único número que ela deu); entre os que cabem, o mais alto da escada.
 * "Prefiro não dizer" não escolhe produto: presumir seria inventar. Produto
 * sem preço decidido nesta moeda nunca é ofertado, e produto com gate ou por
 * convite nunca é a oferta principal (HANDOFF §7.2).
 */
export function escolherOferta(
  cliente: Cliente,
  vertenteId: string,
  faixaId: string | null | undefined,
  moeda: Moeda
): Produto | null {
  const v = vertentePorId(cliente, vertenteId);
  const pergunta = v ? perguntaDeFaixa(v) : null;
  const opcao = pergunta ? opcoesDaFaixa(pergunta, moeda).find((o) => o.id === faixaId) : undefined;
  if (!opcao || opcao.piso === null) return null;
  const piso = opcao.piso;
  const cabem = cliente.produtos.filter((p) => {
    const preco = p.preco[moeda];
    return (
      p.publicado &&
      !p.gate &&
      p.canal !== "convite" &&
      p.vertente === vertenteId &&
      preco !== null &&
      preco <= piso
    );
  });
  if (!cabem.length) return null;
  return cabem.reduce((maior, p) => ((p.preco[moeda] ?? 0) > (maior.preco[moeda] ?? 0) ? p : maior));
}

/* ==========================================================================
   Link da proposta
   ========================================================================= */

/**
 * O `host` vem da requisição e quem chama pode escrevê-lo: só vale se for um
 * domínio do próprio cliente; fora disso, o domínio principal. Sem isso, um
 * Host forjado poria um link de outro site na mensagem ou no aviso à dona.
 */
export function linkDaProposta(cliente: Cliente, host: string | null, token: string): string {
  const pedido = host?.trim().toLowerCase() ?? "";
  const semPorta = pedido.replace(/:\d+$/, "");
  const conhecido = [cliente.dominio, ...cliente.dominiosExtra].includes(semPorta);
  const alvo = conhecido ? pedido : cliente.dominio;
  const protocolo = conhecido && semPorta === "localhost" ? "http" : "https";
  return `${protocolo}://${alvo}/p/${token}`;
}

/* ==========================================================================
   Progresso
   ========================================================================= */

/** Posição da tela no contador ("n de total"). Depois do gate, fica no total. */
export function posicaoNoContador(telas: Tela[], indice: number, total: number): number {
  const gate = telas.findIndex((t) => t.tipo === "gate");
  if (gate >= 0 && indice >= gate) return total;
  return Math.min(indice + 1, total);
}
