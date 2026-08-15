import { describe, expect, it } from "vitest";
import { verificarLimiteDuravel } from "@/lib/rate-limit";

/**
 * Sem UPSTASH_REDIS_REST_URL/TOKEN neste ambiente de teste,
 * verificarLimiteDuravel cai no balde local — é exatamente o caminho que
 * roda em qualquer deploy sem as env coladas, e o que este teste cobre.
 */
describe("verificarLimiteDuravel — sem Upstash, cai no balde local", () => {
  it("permite dentro do teto e bloqueia acima dele", async () => {
    const chave = `teste-rate-limit:${Math.random()}`;
    const a = await verificarLimiteDuravel(chave, 2, 60);
    const b = await verificarLimiteDuravel(chave, 2, 60);
    const c = await verificarLimiteDuravel(chave, 2, 60);
    expect(a.permitido).toBe(true);
    expect(b.permitido).toBe(true);
    expect(c.permitido).toBe(false);
  });

  it("chaves diferentes têm baldes independentes", async () => {
    const a = await verificarLimiteDuravel(`isolado-a:${Math.random()}`, 1, 60);
    const b = await verificarLimiteDuravel(`isolado-b:${Math.random()}`, 1, 60);
    expect(a.permitido).toBe(true);
    expect(b.permitido).toBe(true);
  });
});
