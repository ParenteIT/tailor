import { afterEach, describe, expect, it } from "vitest";
import {
  escreverTexto,
  extrairEstruturado,
  llmDisponivel,
  provedorLLMEscolhido,
} from "@/lib/llm";

/**
 * F3/F4 estendido — mesmo recorte de sempre: o que dá pra provar sem chamar a
 * API de verdade é a escolha de provedor, a guarda de env e a recusa
 * antecipada. O caminho de sucesso (Anthropic ou Gemini respondendo) não tem
 * cobertura e não tem como ter aqui — exige credencial real.
 */

const ENVS = [
  "LLM_PROVEDOR",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
] as const;
const ORIGINAIS = Object.fromEntries(ENVS.map((e) => [e, process.env[e]]));

afterEach(() => {
  for (const env of ENVS) {
    const valor = ORIGINAIS[env];
    if (valor === undefined) delete process.env[env];
    else process.env[env] = valor;
  }
});

describe("provedorLLMEscolhido — trocar de fornecedor é env, não deploy", () => {
  it("usa anthropic por padrão, sem env nenhuma", () => {
    delete process.env.LLM_PROVEDOR;
    expect(provedorLLMEscolhido().nome).toBe("anthropic");
  });

  it("respeita gemini quando declarado", () => {
    process.env.LLM_PROVEDOR = "gemini";
    expect(provedorLLMEscolhido().nome).toBe("gemini");
  });

  it("aceita maiúsculas e espaço em volta", () => {
    process.env.LLM_PROVEDOR = "  Gemini  ";
    expect(provedorLLMEscolhido().nome).toBe("gemini");
  });

  it("erro de digitação cai na anthropic em vez de derrubar a geração", () => {
    process.env.LLM_PROVEDOR = "gemeni";
    expect(provedorLLMEscolhido().nome).toBe("anthropic");
  });
});

describe("llmDisponivel — o sistema está pronto se QUALQUER um dos dois tiver chave", () => {
  it("verdadeiro com só a chave do provedor não-escolhido — é o fallback quem decide, não esta guarda", () => {
    process.env.LLM_PROVEDOR = "gemini";
    delete process.env.GEMINI_API_KEY;
    process.env.ANTHROPIC_API_KEY = "sk-ant-teste";
    // Antes do fallback existir, isto seria falso — agora é o cenário exato
    // que o fallback resolve: Gemini é o principal e falha, Anthropic assume.
    expect(llmDisponivel()).toBe(true);
  });

  it("falso sem chave nenhuma, em nenhum dos dois", () => {
    delete process.env.LLM_PROVEDOR;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GEMINI_API_KEY;
    expect(llmDisponivel()).toBe(false);
  });
});

describe("fallback automático — se o principal falha, o outro assume sozinho", () => {
  const PEDIDO_ESTRUTURADO = {
    sistema: "sistema de teste",
    schema: { type: "object", properties: {} },
    entrada: "entrada de teste",
    maxTokens: 100,
  };
  const PEDIDO_TEXTO = {
    sistema: "sistema de teste",
    entrada: "entrada de teste",
    maxTokens: 100,
  };

  // O caminho de "principal falha, o outro assume e responde" exige uma
  // chamada de rede de verdade (Anthropic SDK ou fetch pro Gemini) — mesma
  // razão pela qual nenhum provedor deste projeto testa o caminho de sucesso
  // sem credencial real (ver transcricao.test.ts, whatsapp.test.ts). O que dá
  // pra provar sem rede é a guarda: com nenhum dos dois configurado, nomeia
  // a env do principal — é o comportamento coberto abaixo.

  it("nomeia a env que falta quando NENHUM dos dois está configurado", async () => {
    delete process.env.LLM_PROVEDOR;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GEMINI_API_KEY;
    await expect(extrairEstruturado(PEDIDO_ESTRUTURADO)).rejects.toThrow("ANTHROPIC_API_KEY");
    await expect(escreverTexto(PEDIDO_TEXTO)).rejects.toThrow("ANTHROPIC_API_KEY");
  });
});
