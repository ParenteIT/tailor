import { PERSONAS, type PalavraIdentidade, type PersonaKey } from "@/content/personas";

/**
 * C1 — máximo de 9 telas do início ao gate.
 *
 * O fluxo original tinha o gate na décima. O corte aplicado é exatamente o que
 * o Conselho prescreveu: a Q2 (situação) deixou de ser tela própria e virou
 * sub-opção revelada dentro da Q1, no mesmo cartão-espelho. Isso também troca
 * digitação por toque logo no começo, onde o abandono é maior.
 *
 *   1 abertura · 2 espelho+situação · 3 q3 · 4 gap · 5 futuro
 *   6 q7 · 7 q8 · 8 q9 · 9 gate
 *
 * `pico` vem depois do gate e por isso não conta para o teto de C1.
 */
export const ETAPAS = [
  "abertura",
  "espelho",
  "q3",
  "gap",
  "futuro",
  "q7",
  "q8",
  "q9",
  "gate",
  "pico",
] as const;

export type Etapa = (typeof ETAPAS)[number];

export const INDICE_DO_GATE = ETAPAS.indexOf("gate");

/** Telas do início ao gate, inclusive. Travado por teste — C1. */
export const TELAS_ATE_O_GATE = INDICE_DO_GATE + 1;

/**
 * Endowed progress: a barra nasce em 15% antes da primeira resposta. Não é
 * urgência (que o §8 do BRAND-VISUAL veta) — é orientação: quantas peças do
 * molde já foram traçadas.
 *
 * Os incrementos nunca encolhem (9,9,9,10,10,10,11,11): goal-gradient pede que
 * o traçado acelere perto do fim, e a sequência anterior desacelerava
 * exatamente nas últimas peças (…10, 8, 9, 8). Kivetz/Urminsky/Zheng, JMR 2006.
 */
export const PROGRESSO: Record<Etapa, number> = {
  abertura: 15,
  espelho: 24,
  q3: 33,
  gap: 42,
  futuro: 52,
  q7: 62,
  q8: 72,
  q9: 83,
  gate: 94,
  pico: 100,
};

export interface Respostas {
  persona: PersonaKey | null;
  situacao: string | null;
  situacaoOutro: string;
  q3: string;
  /** Como a q3 chegou — molda o Bloco 1 da proposta e a análise. */
  q3Via: "texto" | "audio" | null;
  /** Timestamp do clique em "Pode gravar", primeira vez que ela consente
      áudio nesta sessão — a evidência que o LGPD by design do produto exige. */
  consentimentoAudioEm: string | null;
  precoAtual: number | null;
  precoDesejado: number | null;
  volumeMensal: number | null;
  pctUsado: number | null;
  valorParado: number | null;
  palavras: PalavraIdentidade[];
  q7: string | null;
  q7Outro: string;
  q8: string | null;
  q9: string | null;
  nome: string;
  whatsapp: string;
  email: string;
}

export const RESPOSTAS_VAZIAS: Respostas = {
  persona: null,
  situacao: null,
  situacaoOutro: "",
  q3: "",
  q3Via: null,
  consentimentoAudioEm: null,
  precoAtual: null,
  precoDesejado: null,
  volumeMensal: null,
  pctUsado: null,
  valorParado: null,
  palavras: [],
  q7: null,
  q7Outro: "",
  q8: null,
  q9: null,
  nome: "",
  whatsapp: "",
  email: "",
};

export function trilhaDe(respostas: Respostas) {
  return respostas.persona ? PERSONAS[respostas.persona].trilha : null;
}

/**
 * Uma etapa só libera o avanço quando tem o que ela precisa. O gate é o único
 * lugar onde a validação vira mensagem de erro — antes disso, o botão apenas
 * não se oferece, sem repreender ninguém.
 */
export function etapaCompleta(etapa: Etapa, r: Respostas): boolean {
  switch (etapa) {
    case "abertura":
      return true;
    case "espelho":
      if (!r.persona || !r.situacao) return false;
      return r.situacao !== "outro" || r.situacaoOutro.trim().length > 1;
    case "q3":
      return r.q3.trim().length > 2;
    case "gap": {
      const trilha = trilhaDe(r);
      if (trilha === "guarda_roupa") {
        return r.pctUsado !== null && r.valorParado !== null;
      }
      return (
        r.precoAtual !== null && r.precoDesejado !== null && r.volumeMensal !== null
      );
    }
    case "futuro":
      return r.palavras.length >= 2;
    case "q7":
      return r.q7 !== null && (r.q7 !== "outro" || r.q7Outro.trim().length > 1);
    case "q8":
      return r.q8 !== null;
    case "q9":
      return r.q9 !== null;
    case "gate":
      return nomeValido(r.nome) && whatsappValido(r.whatsapp);
    case "pico":
      return true;
  }
}

export function nomeValido(nome: string): boolean {
  return nome.trim().length >= 2;
}

/**
 * Aceita o que uma brasileira digita de verdade: com ou sem DDI, com ou sem
 * parênteses, ponto, hífen ou espaço. Valida a quantidade de dígitos, não o
 * formato — o formato é problema nosso, não dela.
 */
export function whatsappValido(valor: string): boolean {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length >= 10 && digitos.length <= 15;
}

export function normalizarWhatsapp(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length <= 11) return `55${digitos}`;
  return digitos;
}

/**
 * O `wa_id` da Meta chega em E.164 sem '+', o que quase coincide com o que
 * `normalizarWhatsapp` grava — a divergência é o nono dígito de celular
 * brasileiro, que a Meta às vezes omite. Sem tratar isso, a mesma mulher vira
 * dois leads e o link de confirmação aponta para o cadastro vazio.
 *
 * A primeira variante é sempre a canônica: o que ela mandou, normalizado. As
 * outras existem só para a busca — nada aqui inventa número para gravar.
 */
export function variantesDeWhatsapp(valor: string): string[] {
  const base = normalizarWhatsapp(valor);
  const variantes = new Set([base]);
  const brasileiro = /^55(\d{2})(\d{8,9})$/.exec(base);
  if (brasileiro) {
    const [, ddd, assinante] = brasileiro;
    if (assinante.length === 9 && assinante.startsWith("9")) {
      variantes.add(`55${ddd}${assinante.slice(1)}`);
    }
    if (assinante.length === 8) variantes.add(`55${ddd}9${assinante}`);
  }
  return [...variantes];
}

/**
 * E-mail é opcional (decisão do Willian, 14/08/2026) — vazio é válido. Só
 * reprova o que ela efetivamente digitou e está claramente incompleto, para
 * não travar o gate por um campo que ninguém é obrigado a preencher.
 */
export function emailValido(valor: string): boolean {
  const v = valor.trim();
  if (v.length === 0) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
