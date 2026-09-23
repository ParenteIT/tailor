import type { Moeda } from "@/content/config";
import { isPersonaKey, PALAVRAS_IDENTIDADE } from "@/content/personas";
import {
  ETAPAS,
  INDICE_DO_GATE,
  RESPOSTAS_VAZIAS,
  etapaCompleta,
  type Respostas,
} from "@/lib/quiz-state";
import type { Cliente } from "@/content/clientes/esquema";
import {
  ramoCompleto,
  sanearRespostas as sanearRespostasHolding,
  telaCompleta,
  telasDe,
  type RespostasHolding,
} from "@/lib/fluxo";

/**
 * Retomada do molde — o estado do quiz guardado no aparelho dela.
 *
 * O autosave de servidor protege a Renilza (o lead parcial chega); isto aqui
 * protege a lead: o webview do Instagram/WhatsApp descarta a aba na primeira
 * troca de app, e quem volta para a tela 1 zerada não recomeça. O dado fica
 * em localStorage — no aparelho dela, nunca em trânsito (LGPD: minimização
 * mantida) — e é apagado no pico, quando o molde está entregue.
 */

const CHAVE = "tailor:molde:v1";

/**
 * Cópia do molde na ABA (sessionStorage), gravada a cada mudança. Existe por
 * causa da troca de idioma: o quiz remonta e, sem isto, quem estava no
 * diagnóstico final (onde o rascunho de aparelho já foi apagado) ou ainda na
 * abertura recomeçava do zero. Morre com a aba — não é retomada entre visitas,
 * essa continua sendo do `localStorage` acima.
 */
const CHAVE_SESSAO = "tailor:sessao:v1";

export interface MoldeGuardado {
  indice: number;
  respostas: Respostas;
  leadId: string | null;
  /** Moeda em que os valores foram declarados. Sem ela, um valor dado em R$
      apareceria como US$ depois de trocar o idioma. */
  moeda?: Moeda;
  /** Só existe no diagnóstico final: o link da proposta já gerada. */
  urlProposta?: string | null;
}

function armazenamento(): Storage | null {
  // Safari em navegação privada e webviews restritos lançam ao tocar em
  // localStorage; retomada é melhor-esforço, nunca um erro dela.
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Reconstrói um `Respostas` seguro a partir do que veio do disco: cada campo
 * é validado por tipo e o que não passa volta ao vazio. Nada aqui confia no
 * JSON — outra aba, outra versão do app ou uma extensão podem ter escrito.
 */
function sanearRespostas(bruto: unknown): Respostas {
  if (typeof bruto !== "object" || bruto === null) return RESPOSTAS_VAZIAS;
  const r = bruto as Record<string, unknown>;

  const texto = (v: unknown): string => (typeof v === "string" ? v : "");
  const textoOuNulo = (v: unknown): string | null =>
    typeof v === "string" ? v : null;
  const numeroOuNulo = (v: unknown): number | null =>
    typeof v === "number" && Number.isFinite(v) ? v : null;

  const palavras = Array.isArray(r.palavras)
    ? r.palavras.filter(
        (p): p is (typeof PALAVRAS_IDENTIDADE)[number] =>
          typeof p === "string" &&
          (PALAVRAS_IDENTIDADE as readonly string[]).includes(p)
      )
    : [];

  return {
    persona: isPersonaKey(r.persona) ? r.persona : null,
    situacao: textoOuNulo(r.situacao),
    situacaoOutro: texto(r.situacaoOutro),
    q3: texto(r.q3),
    q3Via: r.q3Via === "texto" || r.q3Via === "audio" ? r.q3Via : null,
    consentimentoAudioEm: textoOuNulo(r.consentimentoAudioEm),
    precoAtual: numeroOuNulo(r.precoAtual),
    precoDesejado: numeroOuNulo(r.precoDesejado),
    volumeMensal: numeroOuNulo(r.volumeMensal),
    pctUsado: numeroOuNulo(r.pctUsado),
    valorParado: numeroOuNulo(r.valorParado),
    palavras,
    q7: textoOuNulo(r.q7),
    q7Outro: texto(r.q7Outro),
    q8: textoOuNulo(r.q8),
    q9: textoOuNulo(r.q9),
    nome: texto(r.nome),
    whatsapp: texto(r.whatsapp),
    email: texto(r.email),
  };
}

/**
 * O índice restaurado nunca passa da primeira etapa incompleta: restaurar a
 * Q3 sem persona seria um estado que a UI não sabe montar. `etapaCompleta` é
 * a mesma régua que libera o avanço ao vivo — uma regra só, sem cópia.
 */
function indiceSeguro(pedido: number, respostas: Respostas): number {
  const primeiraIncompleta = ETAPAS.findIndex(
    (etapa) => !etapaCompleta(etapa, respostas)
  );
  const alcancavel =
    primeiraIncompleta === -1 ? INDICE_DO_GATE : primeiraIncompleta;
  return Math.max(0, Math.min(pedido, alcancavel, INDICE_DO_GATE));
}

function interpretar(cru: string, daAba: boolean): MoldeGuardado | null {
  const dados = JSON.parse(cru) as Record<string, unknown>;
  const respostas = sanearRespostas(dados.respostas);
  const pedido = typeof dados.indice === "number" ? Math.trunc(dados.indice) : 0;
  const url =
    typeof dados.urlProposta === "string" && dados.urlProposta.startsWith("/p/")
      ? dados.urlProposta
      : null;

  // O diagnóstico final só é restaurável se a proposta existe e tudo antes
  // dele está respondido — a mesma régua do avanço ao vivo.
  const pico = ETAPAS.indexOf("pico");
  const noPico =
    daAba &&
    pedido === pico &&
    url !== null &&
    ETAPAS.slice(0, pico).every((etapa) => etapaCompleta(etapa, respostas));

  const indice = noPico ? pico : indiceSeguro(pedido, respostas);
  if (!daAba && indice < 1) return null;
  return {
    indice,
    respostas,
    leadId: typeof dados.leadId === "string" ? dados.leadId : null,
    moeda: dados.moeda === "BRL" || dados.moeda === "USD" ? dados.moeda : undefined,
    urlProposta: noPico ? url : null,
  };
}

export function lerMolde(): MoldeGuardado | null {
  const store = armazenamento();
  if (!store) return null;
  try {
    const cru = store.getItem(CHAVE);
    return cru ? interpretar(cru, false) : null;
  } catch {
    return null;
  }
}

function armazenamentoDaAba(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

export function lerSessao(): MoldeGuardado | null {
  const store = armazenamentoDaAba();
  if (!store) return null;
  try {
    const cru = store.getItem(CHAVE_SESSAO);
    return cru ? interpretar(cru, true) : null;
  } catch {
    return null;
  }
}

export function guardarSessao(molde: MoldeGuardado): void {
  const store = armazenamentoDaAba();
  if (!store) return;
  try {
    store.setItem(CHAVE_SESSAO, JSON.stringify(molde));
  } catch {
    /* melhor-esforço */
  }
}

export function guardarMolde(molde: MoldeGuardado): void {
  const store = armazenamento();
  if (!store) return;
  try {
    store.setItem(CHAVE, JSON.stringify(molde));
  } catch {
    /* quota cheia ou storage bloqueado: seguir sem retomada */
  }
}

export function limparMolde(): void {
  const store = armazenamento();
  if (!store) return;
  try {
    store.removeItem(CHAVE);
  } catch {
    /* melhor-esforço */
  }
}

/* ==========================================================================
   Retomada do diagnóstico da holding
   ==========================================================================
   Chaves próprias, com a versão do roteiro e o cliente dentro: um molde do
   quiz de personas (`tailor:molde:v1`) nunca é lido aqui, e um molde de outra
   versão do roteiro é descartado inteiro — respostas a perguntas que ela
   nunca viu não podem virar escolhas da cena nova.
   ========================================================================= */

const CHAVE_HOLDING = "tailor:holding:v2";
const CHAVE_HOLDING_SESSAO = "tailor:holding:sessao:v2";

export interface MoldeHolding {
  cliente: string;
  versaoFluxo: string;
  indice: number;
  respostas: RespostasHolding;
  leadId: string | null;
  moeda: Moeda;
  /** Só depois do gate: o link da proposta já gerada. */
  urlProposta: string | null;
}

function indiceHoldingSeguro(
  cliente: Cliente,
  r: RespostasHolding,
  pedido: number,
  moeda: Moeda,
  urlProposta: string | null
): number {
  const telas = telasDe(cliente, r);
  const gate = telas.findIndex((t) => t.tipo === "gate");
  // Depois do gate só volta quem tem a proposta na mão e o ramo inteiro
  // respondido; "montando" é passagem, reabre direto no fim.
  if (gate > 0 && pedido > gate && urlProposta && ramoCompleto(cliente, r, moeda)) {
    const tipo = telas[Math.min(pedido, telas.length - 1)]?.tipo;
    return tipo === "montando" ? telas.length - 1 : Math.min(pedido, telas.length - 1);
  }
  const primeiraIncompleta = telas.findIndex((t) => !telaCompleta(cliente, t, r, moeda));
  const teto = gate > 0 ? gate : telas.length - 1;
  const alcancavel = primeiraIncompleta === -1 ? teto : primeiraIncompleta;
  return Math.max(0, Math.min(pedido, alcancavel, teto));
}

export function interpretarMoldeHolding(
  cru: string,
  cliente: Cliente,
  moeda: Moeda,
  daAba: boolean
): MoldeHolding | null {
  let dados: Record<string, unknown>;
  try {
    dados = JSON.parse(cru) as Record<string, unknown>;
  } catch {
    return null;
  }
  if (typeof dados !== "object" || dados === null) return null;
  if (dados.cliente !== cliente.id || dados.versaoFluxo !== cliente.versaoFluxo) return null;
  // Valores foram declarados numa moeda: noutra, as réguas mudam de sentido.
  if (dados.moeda !== moeda) return null;

  const respostas = sanearRespostasHolding(cliente, dados.respostas, moeda);
  const url =
    daAba && typeof dados.urlProposta === "string" && dados.urlProposta.startsWith("/p/")
      ? dados.urlProposta
      : null;
  const pedido = typeof dados.indice === "number" ? Math.trunc(dados.indice) : 0;
  const indice = indiceHoldingSeguro(cliente, respostas, pedido, moeda, url);
  if (!daAba && indice < 1) return null;

  return {
    cliente: cliente.id,
    versaoFluxo: cliente.versaoFluxo,
    indice,
    respostas,
    leadId: typeof dados.leadId === "string" ? dados.leadId : null,
    moeda,
    urlProposta: indice > telasDe(cliente, respostas).findIndex((t) => t.tipo === "gate") ? url : null,
  };
}

export function lerMoldeHolding(cliente: Cliente, moeda: Moeda): MoldeHolding | null {
  for (const [store, chave, daAba] of [
    [armazenamentoDaAba(), CHAVE_HOLDING_SESSAO, true],
    [armazenamento(), CHAVE_HOLDING, false],
  ] as const) {
    if (!store) continue;
    try {
      const cru = store.getItem(chave);
      const molde = cru ? interpretarMoldeHolding(cru, cliente, moeda, daAba) : null;
      if (molde) return molde;
    } catch {
      /* melhor-esforço */
    }
  }
  return null;
}

/**
 * Aparelho (entre visitas) só até o gate; a aba guarda também o pós-gate,
 * para a troca de idioma não jogá-la de volta à tela 1. WhatsApp e e-mail
 * nunca vão para o disco.
 */
export function guardarMoldeHolding(molde: MoldeHolding): void {
  const semContato = {
    ...molde,
    respostas: { ...molde.respostas, whatsapp: "", email: "" },
  };
  try {
    armazenamentoDaAba()?.setItem(CHAVE_HOLDING_SESSAO, JSON.stringify(semContato));
  } catch {
    /* melhor-esforço */
  }
  try {
    const store = armazenamento();
    if (!store) return;
    if (molde.urlProposta) store.removeItem(CHAVE_HOLDING);
    else store.setItem(CHAVE_HOLDING, JSON.stringify({ ...semContato, urlProposta: null }));
  } catch {
    /* quota cheia ou storage bloqueado */
  }
}

export function limparMoldeHolding(): void {
  for (const [store, chave] of [
    [armazenamento(), CHAVE_HOLDING],
    [armazenamentoDaAba(), CHAVE_HOLDING_SESSAO],
  ] as const) {
    try {
      store?.removeItem(chave);
    } catch {
      /* melhor-esforço */
    }
  }
}
