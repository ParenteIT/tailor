import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { POST } from "@/app/api/webhooks/asaas/route";
import { getStore } from "@/lib/store";

/**
 * O caminho feliz do webhook, ponta a ponta contra o store real (backend de
 * arquivo, porque não há credencial de Supabase em teste).
 *
 * `webhook-asaas.test.ts` cobre o portão — quem NÃO entra. Este cobre o que
 * acontece com quem entra: o pagamento vira status, e reentrega não duplica.
 * É a parte que não dá para verificar contra produção enquanto a branch não
 * for publicada, e a que mais importa: se ela quebrar, uma venda confirmada
 * some do funil em silêncio.
 */

const TOKEN = "token-de-teste-do-fluxo-asaas";
const TOKEN_ORIGINAL = process.env.ASAAS_WEBHOOK_TOKEN;

beforeAll(() => {
  process.env.ASAAS_WEBHOOK_TOKEN = TOKEN;
});

afterAll(() => {
  if (TOKEN_ORIGINAL === undefined) delete process.env.ASAAS_WEBHOOK_TOKEN;
  else process.env.ASAAS_WEBHOOK_TOKEN = TOKEN_ORIGINAL;
});

/**
 * Lê o status direto do arquivo. Usar `atualizarStatusLead` para verificar
 * seria enganoso: ela também ESCREVE, então o teste de reentrega passaria
 * mesmo com o webhook sem fazer nada.
 */
async function statusDoLead(leadId: string): Promise<string | undefined> {
  const arquivo = path.join(process.cwd(), ".tailor-dev", "banco.json");
  const banco = JSON.parse(await readFile(arquivo, "utf8")) as {
    leads: Record<string, { status?: string }>;
  };
  return banco.leads[leadId]?.status;
}

function avisar(event: string, leadId: string) {
  return POST(
    new Request("https://exemplo.test/api/webhooks/asaas", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "asaas-access-token": TOKEN,
      },
      body: JSON.stringify({
        event,
        payment: { id: `pay_${event}`, externalReference: leadId },
      }),
    })
  );
}

describe("webhook do Asaas — o pagamento vira status", () => {
  it("PAYMENT_CONFIRMED fecha o lead, e a reentrega não muda nada", async () => {
    const store = getStore();
    const leadId = await store.upsertLead(null, {
      nome: "Teste do Fluxo",
      persona: "camila",
      origem: "quiz_frio",
    });

    // O lead nasce em "novo" — se já nascesse fechado, o teste não provaria nada.
    expect(await statusDoLead(leadId)).toBe("novo");

    const primeira = await avisar("PAYMENT_CONFIRMED", leadId);
    expect(primeira.status).toBe(200);
    expect(await statusDoLead(leadId)).toBe("fechado");

    // Reentrega: o Asaas reenvia até receber 200. Não pode quebrar nem
    // reverter nada.
    const segunda = await avisar("PAYMENT_CONFIRMED", leadId);
    expect(segunda.status).toBe(200);
    expect(await statusDoLead(leadId)).toBe("fechado");
  });

  it("PAYMENT_REFUNDED marca como perdido", async () => {
    const store = getStore();
    const leadId = await store.upsertLead(null, {
      nome: "Teste do Estorno",
      persona: "carla",
      origem: "quiz_frio",
    });

    expect(await statusDoLead(leadId)).toBe("novo");

    const resposta = await avisar("PAYMENT_REFUNDED", leadId);
    expect(resposta.status).toBe(200);
    expect(await statusDoLead(leadId)).toBe("perdido");
  });

  it("lead que não existe é reconhecido com 200, não com erro", async () => {
    // 500 aqui faria o Asaas reentregar para sempre um evento que nunca vai
    // resolver — o lead pode ter sido apagado por pedido de LGPD.
    const resposta = await avisar(
      "PAYMENT_CONFIRMED",
      "00000000-0000-4000-8000-000000000000"
    );
    expect(resposta.status).toBe(200);
    await expect(resposta.json()).resolves.toMatchObject({
      leadDesconhecido: true,
    });
  });
});
