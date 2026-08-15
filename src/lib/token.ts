import { randomBytes, timingSafeEqual } from "node:crypto";

/**
 * C6 — o token da proposta é a única credencial que protege um documento com
 * o nome, o WhatsApp e os números declarados de uma pessoa. Por isso:
 *
 * - 24 bytes de `randomBytes` (CSPRNG). Nada de Date.now, Math.random ou uuid
 *   v1, que são previsíveis a partir do tempo.
 * - base64url, então cabe numa URL sem escape e continua legível num WhatsApp.
 * - 192 bits de entropia: enumerar é inviável mesmo com rate limit generoso.
 */
export function gerarTokenProposta(): string {
  return randomBytes(24).toString("base64url");
}

/** Formato aceito na rota pública, antes de qualquer ida ao banco. */
export function tokenPlausivel(valor: unknown): valor is string {
  return typeof valor === "string" && /^[A-Za-z0-9_-]{22,64}$/.test(valor);
}

/** Comparação em tempo constante, para quando houver segredo a conferir. */
export function comparaSegredo(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
