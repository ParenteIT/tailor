import { describe, expect, it } from "vitest";
import { emailValido, variantesDeWhatsapp } from "@/lib/quiz-state";

describe("emailValido — e-mail é opcional (decisão do Willian, 14/08/2026)", () => {
  it("vazio é válido — ninguém é obrigado a preencher", () => {
    expect(emailValido("")).toBe(true);
    expect(emailValido("   ")).toBe(true);
  });

  it("aceita o que parece um e-mail de verdade", () => {
    expect(emailValido("renilza@renilzamiranda.com.br")).toBe(true);
    expect(emailValido("  nome@dominio.com  ")).toBe(true);
  });

  it("reprova o que ela digitou e está claramente incompleto", () => {
    expect(emailValido("nome@")).toBe(false);
    expect(emailValido("nome sem arroba")).toBe(false);
    expect(emailValido("@dominio.com")).toBe(false);
  });
});

describe("variantesDeWhatsapp — o nono dígito que a Meta às vezes omite", () => {
  it("tira o nono dígito do celular completo — é o 9 da frente, não o último", () => {
    expect(variantesDeWhatsapp("5511950291364")).toEqual([
      "5511950291364",
      "551150291364",
    ]);
  });

  it("põe o nono dígito de volta quando a Meta manda o número curto", () => {
    expect(variantesDeWhatsapp("551150291364")).toEqual([
      "551150291364",
      "5511950291364",
    ]);
  });

  it("normaliza antes de variar — número sem DDI vira 55 na primeira posição", () => {
    expect(variantesDeWhatsapp("11950291364")[0]).toBe("5511950291364");
  });

  it("número de fora do Brasil devolve uma variante só", () => {
    expect(variantesDeWhatsapp("351912345678")).toEqual(["351912345678"]);
  });

  it("a primeira posição é sempre a canônica — é ela que vai para o banco", () => {
    expect(variantesDeWhatsapp("(11) 95029-1364")[0]).toBe("5511950291364");
    expect(variantesDeWhatsapp("551150291364")[0]).toBe("551150291364");
  });
});
