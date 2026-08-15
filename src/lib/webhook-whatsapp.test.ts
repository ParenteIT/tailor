import { createHmac, randomInt, randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/webhooks/whatsapp/route";

/**
 * O portão do acionamento direto: quem entra e quem não entra.
 *
 * Esta rota é pública e CRIA lead e confirmation_token — o que ela recusa
 * importa mais do que o que ela aceita. O caminho feliz (lead, token, verbatim,
 * resposta) está em `webhook-whatsapp-fluxo.test.ts`.
 */

const ENVS = [
  "WHATSAPP_VERIFY_TOKEN",
  "WHATSAPP_APP_SECRET",
  "WHATSAPP_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "ANTHROPIC_API_KEY",
  "GROQ_API_KEY",
  "DEEPGRAM_API_KEY",
] as const;
const ORIGINAIS = Object.fromEntries(ENVS.map((e) => [e, process.env[e]]));

afterEach(() => {
  for (const env of ENVS) {
    const valor = ORIGINAIS[env];
    if (valor === undefined) delete process.env[env];
    else process.env[env] = valor;
  }
});

const SEGREDO = "app-secret-de-teste-bem-longo";
const NOSSO_NUMERO = "109876543210987";

function assinar(corpo: string) {
  return `sha256=${createHmac("sha256", SEGREDO).update(Buffer.from(corpo, "utf8")).digest("hex")}`;
}

function chamar(corpoCru: string, assinatura?: string) {
  return POST(
    new Request("https://exemplo.test/api/webhooks/whatsapp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(assinatura ? { "x-hub-signature-256": assinatura } : {}),
      },
      body: corpoCru,
    })
  );
}

function verificar(parametros: Record<string, string>) {
  const url = new URL("https://exemplo.test/api/webhooks/whatsapp");
  for (const [chave, valor] of Object.entries(parametros)) {
    url.searchParams.set(chave, valor);
  }
  return GET(new Request(url, { method: "GET" }));
}

/**
 * Reproduz o que a Meta faz com o corpo: todo caractere fora do ASCII sai
 * escapado. É essa diferença — invisível depois de um `JSON.parse` — que o
 * teste da assinatura precisa exercitar.
 */
function escaparNaoAscii(texto: string): string {
  return [...texto]
    .map((c) =>
      (c.codePointAt(0) ?? 0) > 127
        ? `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`
        : c
    )
    .join("");
}

/** Número novo a cada chamada: o banco de arquivo sobrevive entre execuções. */
function numeroDeTeste() {
  return `55119${randomInt(10_000_000, 100_000_000)}`;
}

function envelope(valor: Record<string, unknown>, field = "messages") {
  return {
    object: "whatsapp_business_account",
    entry: [{ id: "0", changes: [{ field, value: valor }] }],
  };
}

function payloadTexto(texto: string, de = numeroDeTeste(), numeroDoNegocio = NOSSO_NUMERO) {
  return envelope({
    messaging_product: "whatsapp",
    metadata: { phone_number_id: numeroDoNegocio },
    contacts: [{ wa_id: de, profile: { name: "Teste" } }],
    messages: [
      {
        id: `wamid.${randomUUID()}`,
        from: de,
        timestamp: String(Math.floor(Date.now() / 1000)),
        type: "text",
        text: { body: texto },
      },
    ],
  });
}

describe("verificação do webhook — o handshake", () => {
  it("recusa com 503 sem WHATSAPP_VERIFY_TOKEN", async () => {
    delete process.env.WHATSAPP_VERIFY_TOKEN;
    const r = await verificar({
      "hub.mode": "subscribe",
      "hub.verify_token": "qualquer",
      "hub.challenge": "12345",
    });
    expect(r.status).toBe(503);
  });

  it("recusa com 403 quando o verify token não bate", async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = "verify-token-de-teste";
    const r = await verificar({
      "hub.mode": "subscribe",
      "hub.verify_token": "verify-token-errado",
      "hub.challenge": "12345",
    });
    expect(r.status).toBe(403);
  });

  it("token de tamanho diferente não passa pela comparação", async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = "verify-token-de-teste";
    const r = await verificar({
      "hub.mode": "subscribe",
      "hub.verify_token": "curto",
      "hub.challenge": "12345",
    });
    expect(r.status).toBe(403);
  });

  it("recusa com 403 quando hub.mode não é subscribe", async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = "verify-token-de-teste";
    const r = await verificar({
      "hub.mode": "unsubscribe",
      "hub.verify_token": "verify-token-de-teste",
      "hub.challenge": "12345",
    });
    expect(r.status).toBe(403);
  });

  it("devolve o challenge cru em text/plain com o token certo", async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = "verify-token-de-teste";
    const r = await verificar({
      "hub.mode": "subscribe",
      "hub.verify_token": "verify-token-de-teste",
      "hub.challenge": "1158201444",
    });
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toMatch(/^text\/plain/);
    await expect(r.text()).resolves.toBe("1158201444");
  });

  it("recusa challenge que não é numérico — nada de refletir conteúdo arbitrário", async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = "verify-token-de-teste";
    const r = await verificar({
      "hub.mode": "subscribe",
      "hub.verify_token": "verify-token-de-teste",
      "hub.challenge": "<script>alert(1)</script>",
    });
    expect(r.status).toBe(400);
  });
});

describe("webhook do WhatsApp — falha fechado", () => {
  it("recusa com 503 sem WHATSAPP_APP_SECRET", async () => {
    delete process.env.WHATSAPP_APP_SECRET;
    const cru = JSON.stringify(payloadTexto("oi"));
    const r = await chamar(cru, assinar(cru));
    expect(r.status).toBe(503);
  });

  it("recusa com 401 sem o cabeçalho x-hub-signature-256", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    const r = await chamar(JSON.stringify(payloadTexto("oi")));
    expect(r.status).toBe(401);
  });

  it("recusa com 401 quando a assinatura não bate", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    const cru = JSON.stringify(payloadTexto("oi"));
    const outra = createHmac("sha256", "outro-segredo")
      .update(Buffer.from(cru, "utf8"))
      .digest("hex");
    const r = await chamar(cru, `sha256=${outra}`);
    expect(r.status).toBe(401);
  });

  it("assinatura de tamanho diferente não passa", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    const r = await chamar(JSON.stringify(payloadTexto("oi")), "sha256=abcd");
    expect(r.status).toBe(401);
  });

  it("assinatura calculada sobre o corpo reserializado não passa", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    // Como a Meta manda de verdade: unicode escapado.
    const cru = escaparNaoAscii(
      JSON.stringify(payloadTexto("Não tenho coragem de subir o preço"))
    );
    const reserializado = JSON.stringify(JSON.parse(cru));
    expect(reserializado).not.toBe(cru);
    expect((await chamar(cru, assinar(reserializado))).status).toBe(401);
    expect((await chamar(cru, assinar(cru))).status).not.toBe(401);
  });
});

describe("webhook do WhatsApp — autenticado", () => {
  it("statuses sem messages é reconhecido sem tocar no banco", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    const cru = JSON.stringify(
      envelope({
        messaging_product: "whatsapp",
        metadata: { phone_number_id: NOSSO_NUMERO },
        statuses: [{ id: "wamid.x", status: "delivered" }],
      })
    );
    const r = await chamar(cru, assinar(cru));
    expect(r.status).toBe(200);
    await expect(r.json()).resolves.toMatchObject({ ok: true });
  });

  it("campo que não é messages é ignorado com 200", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    const cru = JSON.stringify(
      envelope({ metadata: { phone_number_id: NOSSO_NUMERO } }, "message_template_status_update")
    );
    const r = await chamar(cru, assinar(cru));
    expect(r.status).toBe(200);
  });

  it("object diferente de whatsapp_business_account é reconhecido e ignorado", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    const cru = JSON.stringify({ ...payloadTexto("oi"), object: "page" });
    const r = await chamar(cru, assinar(cru));
    expect(r.status).toBe(200);
    await expect(r.json()).resolves.toMatchObject({ ignorado: "page" });
  });

  it("payload de outro phone_number_id não cria lead", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    process.env.WHATSAPP_PHONE_NUMBER_ID = NOSSO_NUMERO;
    const cru = JSON.stringify(payloadTexto("oi", numeroDeTeste(), "999999999999999"));
    const r = await chamar(cru, assinar(cru));
    expect(r.status).toBe(200);
    await expect(r.json()).resolves.toMatchObject({ deOutroNumero: 1 });
  });

  it("tipo de mensagem não suportado é contado, não processado", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    process.env.WHATSAPP_PHONE_NUMBER_ID = NOSSO_NUMERO;
    const de = numeroDeTeste();
    const cru = JSON.stringify(
      envelope({
        messaging_product: "whatsapp",
        metadata: { phone_number_id: NOSSO_NUMERO },
        contacts: [{ wa_id: de, profile: { name: "Teste" } }],
        messages: [
          {
            id: `wamid.${randomUUID()}`,
            from: de,
            timestamp: String(Math.floor(Date.now() / 1000)),
            type: "image",
            image: { id: "midia-1" },
          },
        ],
      })
    );
    const r = await chamar(cru, assinar(cru));
    expect(r.status).toBe(200);
    await expect(r.json()).resolves.toMatchObject({ naoSuportadas: 1 });
  });

  it("corpo sem entry é recusado", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    const cru = JSON.stringify({ object: "whatsapp_business_account" });
    const r = await chamar(cru, assinar(cru));
    expect(r.status).toBe(400);
  });

  it("JSON inválido é recusado depois da assinatura", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    const cru = "{isto não é json";
    const r = await chamar(cru, assinar(cru));
    expect(r.status).toBe(400);
  });

  it("sem credencial de envio a rota não cai — só deixa de responder", async () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    delete process.env.WHATSAPP_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GROQ_API_KEY;

    const cru = JSON.stringify(payloadTexto("Cobro barato demais e tenho vergonha de dizer"));
    const r = await chamar(cru, assinar(cru));
    expect(r.status).toBe(200);
    const corpo = (await r.json()) as {
      resultados: Array<{ status: string; respondido: boolean; motivo?: string }>;
    };
    expect(corpo.resultados[0]).toMatchObject({
      status: "processada",
      respondido: false,
      motivo: "nao_configurado",
    });
  });
});
