/**
 * Estrutura das 3 personas. Aqui NÃO mora copy — só o que a lógica precisa
 * para decidir trilha, acento e ordem. Todo texto vive em messages/<locale>.json.
 *
 * Fonte das personas: skill `roteirista-reels-renilza`, citada como oficial no
 * kickoff de 13/08/2026.
 */

export const PERSONA_KEYS = ["patricia", "camila", "carla"] as const;
export type PersonaKey = (typeof PERSONA_KEYS)[number];

/**
 * A trilha decide a variante da Etapa 3 (O Gap):
 * - `precificacao` → Q4 preço atual · Q5 preço desejado · Q5b volume mensal
 * - `guarda_roupa` → Q4-P % usado · Q5-P valor parado em 12 meses
 *
 * C3 do Conselho: a variante do guarda-roupa usa o frame "valor adormecido",
 * nunca "dinheiro desperdiçado". A copy em messages/ já obedece — a trilha só
 * escolhe qual bloco renderizar.
 */
export type Trilha = "precificacao" | "guarda_roupa";

export interface Persona {
  key: PersonaKey;
  trilha: Trilha;
  /** Token CSS do acento. Aplicado como --accent quando ela escolhe o espelho. */
  acento: string;
  /** Quantas sub-opções de situação (Q2) esta persona oferece na tela 2. */
  situacoes: number;
}

export const PERSONAS: Record<PersonaKey, Persona> = {
  patricia: {
    key: "patricia",
    trilha: "guarda_roupa",
    acento: "var(--color-patricia)",
    situacoes: 4,
  },
  camila: {
    key: "camila",
    trilha: "precificacao",
    acento: "var(--color-camila)",
    situacoes: 4,
  },
  carla: {
    key: "carla",
    trilha: "precificacao",
    acento: "var(--color-carla)",
    situacoes: 4,
  },
};

export function isPersonaKey(value: unknown): value is PersonaKey {
  return (
    typeof value === "string" && (PERSONA_KEYS as readonly string[]).includes(value)
  );
}

/** Banco de palavras-identidade (Q6). Único para as 3 personas — copy deck §6. */
export const PALAVRAS_IDENTIDADE = [
  "elegante",
  "autoridade",
  "memoravel",
  "cara",
  "inevitavel",
  "referencia",
  "confiavel",
  "desejada",
  "admirada",
  "segura",
] as const;

export type PalavraIdentidade = (typeof PALAVRAS_IDENTIDADE)[number];

export const MAX_PALAVRAS = 3;
