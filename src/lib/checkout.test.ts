import { afterEach, describe, expect, it, vi } from "vitest";
import { PRODUTOS } from "@/content/config";
import {
  abrirCheckout,
  crossSellHotmart,
  maxParcelas,
  precoEmCentavos,
} from "@/lib/checkout";

/**
 * O checkout tem uma regra que não pode quebrar em silêncio: **sem preço
 * configurado, nada é cobrado e nada é inventado**. O produto continua ◆ e a
 * página assume o aviso de demonstração.
 */

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("preço vem do ambiente, em centavos", () => {
  it("ausente, inválido ou zero ⇒ o produto segue ◆", () => {
    expect(precoEmCentavos("dossie")).toBeNull();
    vi.stubEnv("PRECO_DOSSIE_CENTAVOS", "");
    expect(precoEmCentavos("dossie")).toBeNull();
    vi.stubEnv("PRECO_DOSSIE_CENTAVOS", "0");
    expect(precoEmCentavos("dossie")).toBeNull();
    vi.stubEnv("PRECO_DOSSIE_CENTAVOS", "2500,00");
    expect(precoEmCentavos("dossie")).toBeNull();
    vi.stubEnv("PRECO_DOSSIE_CENTAVOS", "2500.50");
    expect(precoEmCentavos("dossie")).toBeNull();
  });

  it("inteiro positivo é aceito como centavos", () => {
    vi.stubEnv("PRECO_PRISMA_COMPLETO_CENTAVOS", "999700");
    expect(precoEmCentavos("prismaCompleto")).toBe(999700);
  });

  it("o catálogo continua sem preço real embutido", () => {
    for (const produto of Object.values(PRODUTOS)) {
      expect(produto.preco).toBe("◆");
    }
  });
});

describe("abrirCheckout não cobra sem preço nem sem gateway", () => {
  const pedido = {
    produto: "dossie" as const,
    leadId: "lead-1",
    primeiroNome: "Marina",
    expiraEm: new Date("2026-08-16T00:00:00Z"),
  };

  it("sem preço ⇒ mock, e o Asaas nem é chamado", async () => {
    vi.stubEnv("ASAAS_API_KEY", "chave-de-teste");
    const espia = vi.spyOn(globalThis, "fetch");
    await expect(abrirCheckout(pedido)).resolves.toEqual({
      estado: "mock",
      motivo: "sem_preco",
    });
    expect(espia).not.toHaveBeenCalled();
    espia.mockRestore();
  });

  it("com preço e sem gateway ⇒ mock, e o Asaas nem é chamado", async () => {
    vi.stubEnv("PRECO_DOSSIE_CENTAVOS", "250000");
    const espia = vi.spyOn(globalThis, "fetch");
    await expect(abrirCheckout(pedido)).resolves.toEqual({
      estado: "mock",
      motivo: "sem_gateway",
    });
    expect(espia).not.toHaveBeenCalled();
    espia.mockRestore();
  });
});

describe("parcelamento e cross-sell", () => {
  it("o padrão é 12x e valores absurdos caem no padrão", () => {
    expect(maxParcelas()).toBe(12);
    vi.stubEnv("CHECKOUT_MAX_PARCELAS", "99");
    expect(maxParcelas()).toBe(12);
    vi.stubEnv("CHECKOUT_MAX_PARCELAS", "1");
    expect(maxParcelas()).toBe(1);
  });

  it("o bloco da Hotmart só existe quando há link", () => {
    expect(crossSellHotmart()).toEqual([]);
    vi.stubEnv("HOTMART_LINK_CIRCULO", "https://pay.hotmart.com/x");
    expect(crossSellHotmart()).toEqual([
      { chave: "circulo", url: "https://pay.hotmart.com/x" },
    ]);
  });
});
