import { isPersonaKey, PALAVRAS_IDENTIDADE } from "@/content/personas";
import {
  ETAPAS,
  INDICE_DO_GATE,
  RESPOSTAS_VAZIAS,
  etapaCompleta,
  type Respostas,
} from "@/lib/quiz-state";

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

export interface MoldeGuardado {
  indice: number;
  respostas: Respostas;
  leadId: string | null;
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

export function lerMolde(): MoldeGuardado | null {
  const store = armazenamento();
  if (!store) return null;
  try {
    const cru = store.getItem(CHAVE);
    if (!cru) return null;
    const dados = JSON.parse(cru) as Record<string, unknown>;
    const respostas = sanearRespostas(dados.respostas);
    const indice = indiceSeguro(
      typeof dados.indice === "number" ? Math.trunc(dados.indice) : 0,
      respostas
    );
    if (indice < 1) return null;
    return {
      indice,
      respostas,
      leadId: typeof dados.leadId === "string" ? dados.leadId : null,
    };
  } catch {
    return null;
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
