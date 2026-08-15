import { afterEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/webhooks/asaas/route";

/**
 * O webhook do Asaas é a única rota pública que move um lead para "fechado".
 * O que importa travar por teste é o portão: sem token configurado recusa,
 * com token errado recusa, e evento que não interessa é reconhecido sem
 * mexer no banco.
 *
 * O caminho feliz (pagamento confirmado → status fechado) depende de store
 * com banco e é verificado em sandbox, não aqui — a suíte testa lib pura.
 */

const TOKEN_ORIGINAL = process.env.ASAAS_WEBHOOK_TOKEN;

afterEach(() => {
  if (TOKEN_ORIGINAL === undefined) delete process.env.ASAAS_WEBHOOK_TOKEN;
  else process.env.ASAAS_WEBHOOK_TOKEN = TOKEN_ORIGINAL;
});

// A rota lê `process.env` dentro do handler, não na carga do módulo — então
// um import estático basta e cada teste pode mexer na env à vontade.
function chamar(corpo: unknown, token?: string) {
  return POST(
    new Request("https://exemplo.test/api/webhooks/asaas", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { "asaas-access-token": token } : {}),
      },
      body: JSON.stringify(corpo),
    })
  );
}

const PAGAMENTO_CONFIRMADO = {
  event: "PAYMENT_CONFIRMED",
  payment: {
    id: "pay_123",
    externalReference: "3f2504e0-4f89-41d3-9a0c-0305e82c3301",
  },
};

describe("webhook do Asaas — falha fechado", () => {
  it("recusa com 503 quando ASAAS_WEBHOOK_TOKEN não existe", async () => {
    delete process.env.ASAAS_WEBHOOK_TOKEN;
    const r = await chamar(PAGAMENTO_CONFIRMADO, "qualquer");
    expect(r.status).toBe(503);
  });

  it("recusa com 401 sem o cabeçalho de token", async () => {
    process.env.ASAAS_WEBHOOK_TOKEN = "segredo-longo-de-teste";
    const r = await chamar(PAGAMENTO_CONFIRMADO);
    expect(r.status).toBe(401);
  });

  it("recusa com 401 quando o token não bate", async () => {
    process.env.ASAAS_WEBHOOK_TOKEN = "segredo-longo-de-teste";
    const r = await chamar(PAGAMENTO_CONFIRMADO, "segredo-errado-de-teste");
    expect(r.status).toBe(401);
  });

  it("token de tamanho diferente não passa pela comparação", async () => {
    process.env.ASAAS_WEBHOOK_TOKEN = "segredo-longo-de-teste";
    const r = await chamar(PAGAMENTO_CONFIRMADO, "curto");
    expect(r.status).toBe(401);
  });
});

describe("webhook do Asaas — autenticado", () => {
  it("reconhece com 200 um evento que não move o funil, sem tocar no banco", async () => {
    process.env.ASAAS_WEBHOOK_TOKEN = "segredo-longo-de-teste";
    const r = await chamar(
      { event: "PAYMENT_CREATED", payment: { id: "pay_1" } },
      "segredo-longo-de-teste"
    );
    expect(r.status).toBe(200);
    await expect(r.json()).resolves.toMatchObject({ ignorado: "PAYMENT_CREATED" });
  });

  it("evento relevante sem externalReference válido não vira consulta ao banco", async () => {
    process.env.ASAAS_WEBHOOK_TOKEN = "segredo-longo-de-teste";
    const r = await chamar(
      { event: "PAYMENT_CONFIRMED", payment: { id: "pay_1", externalReference: "nao-e-uuid" } },
      "segredo-longo-de-teste"
    );
    expect(r.status).toBe(200);
    await expect(r.json()).resolves.toMatchObject({ semReferencia: true });
  });

  it("corpo sem o campo event é recusado", async () => {
    process.env.ASAAS_WEBHOOK_TOKEN = "segredo-longo-de-teste";
    const r = await chamar({ payment: { id: "pay_1" } }, "segredo-longo-de-teste");
    expect(r.status).toBe(400);
  });
});
