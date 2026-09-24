import { afterEach, describe, expect, it, vi } from "vitest";
import { CLIENTE, carregarCliente } from "@/content/clientes";
import { renilza } from "@/content/clientes/renilza";
import { PRODUTOS } from "@/content/config";
import {
  abrirCheckout,
  crossSellHotmart,
  maxParcelas,
  precoEmCentavos,
} from "@/lib/checkout";
import { precoDeProduto } from "@/lib/gap";
import { cobrancaDaOferta, type ConteudoProposta } from "@/lib/proposta";

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

describe("holding: cobra o preço congelado na proposta, não a env", () => {
  const pedido = {
    produto: "jornada",
    leadId: "lead-1",
    primeiroNome: "Marina",
    expiraEm: new Date("2026-09-27T00:00:00Z"),
  };

  it("o valor e o nome do link são os da proposta, mesmo com a env antiga definida", async () => {
    vi.stubEnv("ASAAS_API_KEY", "chave-de-teste");
    vi.stubEnv("PRECO_JORNADA_CENTAVOS", "19700");
    const espia = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ id: "pl_1", url: "https://asaas/x" })));
    await expect(
      abrirCheckout({ ...pedido, preco: { centavos: 49700, nome: "Da Maca ao Alto Padrão" } })
    ).resolves.toEqual({ estado: "pronto", url: "https://asaas/x" });
    const corpo = JSON.parse(String(espia.mock.calls[0][1]?.body));
    expect(corpo.value).toBe(497);
    expect(corpo.name).toBe("Da Maca ao Alto Padrão");
    espia.mockRestore();
  });

  it("preço congelado inválido não cobra nem cai na env", async () => {
    vi.stubEnv("ASAAS_API_KEY", "chave-de-teste");
    vi.stubEnv("PRECO_JORNADA_CENTAVOS", "19700");
    const espia = vi.spyOn(globalThis, "fetch");
    await expect(
      abrirCheckout({ ...pedido, preco: { centavos: 0, nome: "x" } })
    ).resolves.toEqual({ estado: "mock", motivo: "sem_preco" });
    expect(espia).not.toHaveBeenCalled();
    espia.mockRestore();
  });
});

describe("preço de produto mostra os centavos que o checkout cobra", () => {
  it("R$ 97,90 não vira R$ 98; preço inteiro continua sem vírgula", () => {
    expect(precoDeProduto(97.9)).toMatch(/97,90$/);
    expect(precoDeProduto(497)).toMatch(/497$/);
  });
});

describe("cobrancaDaOferta: o botão de pagar só existe para o que tem como cobrar", () => {
  function proposta(oferta: Partial<NonNullable<ConteudoProposta["oferta"]>>, moeda: "BRL" | "USD" = "BRL") {
    return {
      vertente: "estetica",
      moeda,
      oferta: {
        produto: "daMaca",
        nome: "Da Maca ao Alto Padrão",
        preco: "R$ 497,00",
        centavos: 49700,
        canal: "checkout",
        recorrencia: "unica",
        ...oferta,
      },
    } as unknown as ConteudoProposta;
  }

  function comLinkHotmart(id: string, link: string | null) {
    return { ...CLIENTE, produtos: CLIENTE.produtos.map((p) => (p.id === id ? { ...p, linkHotmart: link } : p)) };
  }
  const jornada = { produto: "jornada", recorrencia: "mensal" as const, centavos: 9790 };

  it("checkout, pagamento único, em real, ainda publicado ⇒ Asaas", () => {
    expect(cobrancaDaOferta(proposta({}), CLIENTE)).toEqual({ via: "asaas" });
  });

  it("assinatura com link da Hotmart ⇒ o link de hoje; sem link ⇒ conversa", () => {
    const link = "https://pay.hotmart.com/J000";
    expect(cobrancaDaOferta(proposta(jornada), comLinkHotmart("jornada", link))).toEqual({ via: "hotmart", url: link });
    expect(cobrancaDaOferta(proposta(jornada), comLinkHotmart("jornada", null))).toBeNull();
  });

  it("conversa, dólar ou proposta sem preço congelado ⇒ conversa", () => {
    expect(cobrancaDaOferta(proposta({ produto: "dossieImagem", canal: "conversa" }), CLIENTE)).toBeNull();
    expect(cobrancaDaOferta(proposta({}, "USD"), CLIENTE)).toBeNull();
    expect(cobrancaDaOferta(proposta({ preco: "◆", centavos: undefined }), CLIENTE)).toBeNull();
  });

  it("a configuração de hoje manda: despublicado ou com gate ⇒ conversa", () => {
    const despublicado = {
      ...CLIENTE,
      produtos: CLIENTE.produtos.map((p) => (p.id === "daMaca" ? { ...p, publicado: false } : p)),
    };
    expect(cobrancaDaOferta(proposta({}), despublicado)).toBeNull();
    expect(cobrancaDaOferta(proposta({ produto: "turmaEstetica" }), CLIENTE)).toBeNull();
  });
});

describe("a configuração só aceita link de checkout seguro", () => {
  it("linkHotmart sem https reprova", () => {
    const bruto = { ...renilza, produtos: renilza.produtos.map((p) => (p.id === "jornada" ? { ...p, linkHotmart: "http://pay.hotmart.com/x" } : p)) };
    expect(() => carregarCliente(bruto)).toThrow();
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
