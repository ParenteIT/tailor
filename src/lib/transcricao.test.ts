import { afterEach, describe, expect, it } from "vitest";
import {
  provedorEscolhido,
  transcricaoDisponivel,
  transcrever,
} from "@/lib/transcricao";

/**
 * F6 — só o que é testável sem gravar áudio de verdade: a escolha de provedor,
 * a guarda de env e a recusa antecipada sem chave. O `MediaRecorder` /
 * `getUserMedia` do `useGravador` são API de navegador; este projeto testa lib
 * pura, não componente, e a suíte não tem jsdom (ver vitest.config.mts) —
 * coerência com o resto, não lacuna.
 */

const ENVS = [
  "TRANSCRICAO_PROVEDOR",
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

describe("provedorEscolhido — trocar de fornecedor é env, não deploy", () => {
  it("usa groq por padrão, sem env nenhuma", () => {
    delete process.env.TRANSCRICAO_PROVEDOR;
    expect(provedorEscolhido().nome).toBe("groq");
  });

  it("respeita deepgram quando declarado", () => {
    process.env.TRANSCRICAO_PROVEDOR = "deepgram";
    expect(provedorEscolhido().nome).toBe("deepgram");
  });

  it("aceita maiúsculas e espaço em volta", () => {
    process.env.TRANSCRICAO_PROVEDOR = "  DeepGram  ";
    expect(provedorEscolhido().nome).toBe("deepgram");
  });

  it("erro de digitação cai na groq em vez de derrubar o modo áudio", () => {
    process.env.TRANSCRICAO_PROVEDOR = "deepgrma";
    expect(provedorEscolhido().nome).toBe("groq");
  });
});

describe("transcricaoDisponivel — a guarda que /api/transcribe usa pra decidir 503", () => {
  it("olha a chave do provedor escolhido, não uma chave qualquer", () => {
    process.env.TRANSCRICAO_PROVEDOR = "deepgram";
    delete process.env.DEEPGRAM_API_KEY;
    process.env.GROQ_API_KEY = "gsk_teste";
    // Chave da Groq presente não torna a Deepgram disponível.
    expect(transcricaoDisponivel()).toBe(false);

    process.env.DEEPGRAM_API_KEY = "dg_teste";
    expect(transcricaoDisponivel()).toBe(true);
  });

  it("falso sem chave nenhuma", () => {
    delete process.env.TRANSCRICAO_PROVEDOR;
    delete process.env.GROQ_API_KEY;
    expect(transcricaoDisponivel()).toBe(false);
  });
});

describe("transcrever — recusa antes de qualquer chamada de rede sem chave", () => {
  it("nomeia a env que falta, do provedor certo", async () => {
    process.env.TRANSCRICAO_PROVEDOR = "deepgram";
    delete process.env.DEEPGRAM_API_KEY;
    const audioFalso = new Blob(["nao importa"], { type: "audio/webm" });
    await expect(transcrever(audioFalso)).rejects.toThrow("DEEPGRAM_API_KEY");
  });

  it("na groq, nomeia a env da groq", async () => {
    delete process.env.TRANSCRICAO_PROVEDOR;
    delete process.env.GROQ_API_KEY;
    const audioFalso = new Blob(["nao importa"], { type: "audio/webm" });
    await expect(transcrever(audioFalso)).rejects.toThrow("GROQ_API_KEY");
  });
});
