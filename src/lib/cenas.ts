/**
 * Lógica pura de mapeamento para as ilustrações reativas do quiz
 * (`src/components/cenas/`). Cada função aqui traduz um valor declarado — ou
 * `null`, quando ela ainda não tocou a régua — num índice ou fração
 * ESQUEMÁTICA para desenho. O texto ao lado da ilustração sempre mostra o
 * valor exato (`formatar(valor)` já existe em `ReguaMedida`); o desenho nunca
 * é a fonte da verdade, só a leitura visual dela.
 *
 * `null` nunca vira `0` aqui por acaso: as funções devolvem `0` elementos
 * acesos para `null` (nada foi declarado, nada se ilumina), mas o componente
 * que consome isto SEMPRE recebe também `latente: boolean` — o mesmo padrão
 * de `ReguaMedida` — porque "zero aceso" e "ela declarou o mínimo" precisam
 * ler diferente na tela, não só no dado.
 */

/** Peças fixas do armário — nunca cresce. A proporção acesa é o que muda. */
export const SEGMENTOS_ARMARIO = 10;

export function segmentosArmario(pct: number | null): number {
  if (pct === null) return 0;
  const clamped = Math.min(100, Math.max(0, pct));
  return Math.round((clamped / 100) * SEGMENTOS_ARMARIO);
}

/** Etiquetas fixas — a mesma disciplina do armário, para valorParado. */
export const ETIQUETAS_TOTAL = 5;

export function etiquetasAcesas(
  valor: number | null,
  min: number,
  max: number
): number {
  if (valor === null || max <= min) return 0;
  const fracao = Math.min(1, Math.max(0, (valor - min) / (max - min)));
  return Math.round(fracao * ETIQUETAS_TOTAL);
}

/**
 * Fração de 0 a 1 de um valor numa escala comum — a mesma escala serve para
 * "hoje" e "sua meta", nunca duas normalizações independentes (regra do
 * Comparador Hoje/Meta da Etapa 3).
 */
export function fracaoNaEscala(valor: number | null, escalaMax: number): number {
  if (valor === null || escalaMax <= 0) return 0;
  return Math.min(1, Math.max(0, valor / escalaMax));
}

/** Marcadores da agenda — capados para não virar campo de bolinhas. */
export const AGENDA_CAPACIDADE = 12;

export function marcadoresAgenda(volume: number | null): number {
  if (volume === null) return 0;
  return Math.min(AGENDA_CAPACIDADE, Math.max(0, Math.round(volume)));
}

/** `true` só quando o volume real passa da capacidade visual — mostra "+". */
export function agendaTransbordou(volume: number | null): boolean {
  return volume !== null && volume > AGENDA_CAPACIDADE;
}

/**
 * Posição de um valor já escolhido dentro de uma lista de opções ordenada —
 * usado pelo marco de prazo (Q8) e reaproveitável em qualquer pergunta de
 * lista fixa. `null` quando nada foi marcado ou o valor não está na lista
 * (nunca inventa posição).
 */
export function indiceOpcao<T>(opcoes: readonly T[], valor: T | null): number | null {
  if (valor === null) return null;
  const i = opcoes.indexOf(valor);
  return i === -1 ? null : i;
}
