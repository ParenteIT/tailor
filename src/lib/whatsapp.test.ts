import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import {
  assinaturaConfere,
  enviarTexto,
  versaoGraph,
  whatsappConfigurado,
} from "@/lib/whatsapp";

/**
 * O que dá para provar sem WABA: a versão fixada, a guarda de env, a recusa
 * antecipada sem credencial e — o que mais importa — a conferência da
 * assinatura. O caminho de sucesso do envio não tem cobertura nenhuma e não
 * tem como ter: exige conta real da Meta.
 */

const ENVS = [
  "WHATSAPP_APP_SECRET",
  "WHATSAPP_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_GRAPH_VERSAO",
  "WHATSAPP_TEMPLATE_CONFIRMACAO",
] as const;
const ORIGINAIS = Object.fromEntries(ENVS.map((e) => [e, process.env[e]]));
const FETCH_ORIGINAL = globalThis.fetch;

afterEach(() => {
  for (const env of ENVS) {
    const valor = ORIGINAIS[env];
    if (valor === undefined) delete process.env[env];
    else process.env[env] = valor;
  }
  globalThis.fetch = FETCH_ORIGINAL;
});

describe("versaoGraph — nunca chamar a Graph sem versão", () => {
  it("usa v26.0 sem env", () => {
    delete process.env.WHATSAPP_GRAPH_VERSAO;
    expect(versaoGraph()).toBe("v26.0");
  });

  it("respeita uma versão declarada", () => {
    process.env.WHATSAPP_GRAPH_VERSAO = "v25.0";
    expect(versaoGraph()).toBe("v25.0");
  });

  it("ignora valor fora do formato vXX.Y", () => {
    process.env.WHATSAPP_GRAPH_VERSAO = "latest";
    expect(versaoGraph()).toBe("v26.0");
  });
});

describe("whatsappConfigurado — as duas envs, não uma", () => {
  it("falso faltando o token", () => {
    delete process.env.WHATSAPP_TOKEN;
    process.env.WHATSAPP_PHONE_NUMBER_ID = "1234567890";
    expect(whatsappConfigurado()).toBe(false);
  });

  it("falso faltando o phone number id", () => {
    process.env.WHATSAPP_TOKEN = "EAAG-teste";
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    expect(whatsappConfigurado()).toBe(false);
  });

  it("verdadeiro com as duas", () => {
    process.env.WHATSAPP_TOKEN = "EAAG-teste";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "1234567890";
    expect(whatsappConfigurado()).toBe(true);
  });
});

describe("enviarTexto — degrada sem credencial, sem tocar na rede", () => {
  it("devolve nao_configurado antes de qualquer fetch", async () => {
    delete process.env.WHATSAPP_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    globalThis.fetch = (() => {
      throw new Error("fetch não deveria ter sido chamado sem credencial");
    }) as typeof fetch;

    await expect(enviarTexto("5511988887777", "oi")).resolves.toEqual({
      enviado: false,
      motivo: "nao_configurado",
    });
  });
});

describe("assinaturaConfere — o portão do webhook", () => {
  const SEGREDO = "app-secret-de-teste-bem-longo";
  const CORPO = '{"object":"whatsapp_business_account"}';
  const hmac = (corpo: string, segredo = SEGREDO) =>
    createHmac("sha256", segredo).update(Buffer.from(corpo, "utf8")).digest("hex");

  it("falso sem WHATSAPP_APP_SECRET — falha fechado", () => {
    delete process.env.WHATSAPP_APP_SECRET;
    expect(assinaturaConfere(CORPO, `sha256=${hmac(CORPO)}`)).toBe(false);
  });

  it("falso sem cabeçalho", () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    expect(assinaturaConfere(CORPO, null)).toBe(false);
  });

  it("falso sem o prefixo sha256=", () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    expect(assinaturaConfere(CORPO, hmac(CORPO))).toBe(false);
  });

  it("verdadeiro para o HMAC correto", () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    expect(assinaturaConfere(CORPO, `sha256=${hmac(CORPO)}`)).toBe(true);
  });

  it("falso para HMAC de outro segredo", () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    expect(assinaturaConfere(CORPO, `sha256=${hmac(CORPO, "outro-segredo")}`)).toBe(false);
  });

  it("hex de tamanho diferente não passa pela comparação", () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    expect(assinaturaConfere(CORPO, "sha256=abc123")).toBe(false);
  });

  it("aceita o hex em maiúsculas — a doc promete minúsculas, mas as duas servem", () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    expect(assinaturaConfere(CORPO, `sha256=${hmac(CORPO).toUpperCase()}`)).toBe(true);
  });

  it("um byte diferente no corpo invalida", () => {
    process.env.WHATSAPP_APP_SECRET = SEGREDO;
    const assinatura = `sha256=${hmac(CORPO)}`;
    expect(assinaturaConfere(`${CORPO} `, assinatura)).toBe(false);
  });
});
