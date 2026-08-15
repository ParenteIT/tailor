import { PERSONA_KEYS, type PersonaKey } from "@/content/personas";
import {
  RESPOSTAS_VAZIAS,
  etapaCompleta,
  type Respostas,
} from "@/lib/quiz-state";

/**
 * F5 — modo confirmação.
 *
 * Ela já mandou um áudio no WhatsApp. A Renilza transcreve **localmente** (o
 * áudio nunca sobe pra Groq — ver §3 do tailor-spec) e a extração estruturada
 * devolve trechos verbatim. O quiz então deixa de perguntar e passa a
 * confirmar: "foi isso que eu ouvi… confirma?".
 *
 * Só três etapas se deixam pré-responder por fala. As outras — as palavras de
 * identidade, o que já tentou, o prazo, a faixa — são escolha em lista ou
 * decisão que ninguém dita num áudio, e aparecem normalmente.
 */
export const ETAPAS_CONFIRMAVEIS = ["espelho", "q3", "gap"] as const;
export type EtapaConfirmavel = (typeof ETAPAS_CONFIRMAVEIS)[number];

export interface Preenchimento {
  leadId: string;
  /** Primeiro nome, para o "Oi, {nome}. Recebi seu áudio." */
  nome: string;
  respostas: Partial<Respostas>;
  /**
   * O trecho literal do áudio que sustenta cada etapa pré-respondida. Etapa
   * ausente aqui = pergunta normal, sem o padrão do §9 do copy deck.
   */
  ouvido: Partial<Record<EtapaConfirmavel, string>>;
}

/**
 * Constrói o preenchimento a partir do que está gravado, e **descarta todo
 * verbatim que não tenha resposta real por trás**.
 *
 * Sem essa regra o padrão "foi isso que eu ouvi" apareceria sobre o vazio: ela
 * confirmaria uma frase e o quiz avançaria sem ter guardado nada. A checagem
 * reusa `etapaCompleta`, o mesmo portão que o quiz frio usa para liberar o
 * avanço — assim as duas telas nunca divergem sobre o que conta como resposta.
 */
export function normalizarPreenchimento(bruto: {
  leadId: string;
  nome?: string | null;
  persona?: string | null;
  respostas?: Partial<Respostas> | null;
  ouvido?: Record<string, unknown> | null;
}): Preenchimento {
  const respostas = sanear(bruto.respostas ?? {}, bruto.persona ?? null);
  const completas: Respostas = { ...RESPOSTAS_VAZIAS, ...respostas };

  const ouvido: Partial<Record<EtapaConfirmavel, string>> = {};
  for (const etapa of ETAPAS_CONFIRMAVEIS) {
    const verbatim = String(bruto.ouvido?.[etapa] ?? "").trim();
    if (!verbatim) continue;
    if (!etapaCompleta(etapa, completas)) continue;
    ouvido[etapa] = verbatim;
  }

  const nome = (bruto.nome ?? "").trim();

  return {
    leadId: bruto.leadId,
    nome: nome.split(/\s+/)[0] ?? "",
    respostas,
    ouvido,
  };
}

/**
 * O payload vem de `respostas_raw`, que é jsonb livre. Nada dele entra na tela
 * sem passar por aqui: tipo errado vira ausência, não vira `NaN` na régua nem
 * persona inventada no acento da página.
 */
function sanear(
  bruto: Partial<Respostas>,
  persona: string | null
): Partial<Respostas> {
  const saneadas: Partial<Respostas> = {};

  if (persona && (PERSONA_KEYS as readonly string[]).includes(persona)) {
    saneadas.persona = persona as PersonaKey;
  }

  const texto = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);
  const numero = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;

  const situacao = texto(bruto.situacao);
  if (situacao) saneadas.situacao = situacao;
  if (typeof bruto.situacaoOutro === "string") {
    saneadas.situacaoOutro = bruto.situacaoOutro;
  }

  const q3 = texto(bruto.q3);
  if (q3) saneadas.q3 = q3;

  for (const campo of [
    "precoAtual",
    "precoDesejado",
    "volumeMensal",
    "pctUsado",
    "valorParado",
  ] as const) {
    const valor = numero(bruto[campo]);
    if (valor !== null) saneadas[campo] = valor;
  }

  return saneadas;
}
