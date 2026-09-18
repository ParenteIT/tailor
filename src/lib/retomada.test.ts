import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ETAPAS, RESPOSTAS_VAZIAS, type Respostas } from "@/lib/quiz-state";
import {
  guardarMolde,
  guardarSessao,
  lerMolde,
  lerSessao,
} from "@/lib/retomada";

function storageFalso() {
  const dados = new Map<string, string>();
  return {
    getItem: (k: string) => dados.get(k) ?? null,
    setItem: (k: string, v: string) => void dados.set(k, v),
    removeItem: (k: string) => void dados.delete(k),
  };
}

const COMPLETAS: Respostas = {
  ...RESPOSTAS_VAZIAS,
  persona: "camila",
  situacao: "uma situação",
  q3: "Eu pararia de me esconder",
  precoAtual: 900,
  precoDesejado: 1800,
  volumeMensal: 10,
  palavras: ["elegante", "autoridade"],
  q7: "a",
  q8: "b",
  q9: "ate3500",
  nome: "Marina",
  whatsapp: "11999990000",
};

const PICO = ETAPAS.indexOf("pico");

beforeEach(() => {
  vi.stubGlobal("window", {
    localStorage: storageFalso(),
    sessionStorage: storageFalso(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("retomada — cópia da aba (troca de idioma)", () => {
  it("restaura a abertura com o nome digitado, que o rascunho do aparelho ignora", () => {
    const molde = {
      indice: 0,
      respostas: { ...RESPOSTAS_VAZIAS, nome: "Marina" },
      leadId: null,
    };
    guardarSessao(molde);
    guardarMolde(molde);
    expect(lerSessao()?.respostas.nome).toBe("Marina");
    expect(lerMolde()).toBeNull();
  });

  it("restaura o diagnóstico final quando a proposta existe e tudo antes está respondido", () => {
    guardarSessao({
      indice: PICO,
      respostas: COMPLETAS,
      leadId: null,
      moeda: "BRL",
      urlProposta: "/p/abc123",
    });
    const lido = lerSessao();
    expect(lido?.indice).toBe(PICO);
    expect(lido?.urlProposta).toBe("/p/abc123");
    expect(lido?.moeda).toBe("BRL");
  });

  it("não restaura o diagnóstico sem link de proposta válido", () => {
    for (const urlProposta of [null, "", "https://outro.site/p/x", "/x/abc"]) {
      guardarSessao({
        indice: PICO,
        respostas: COMPLETAS,
        leadId: null,
        urlProposta,
      });
      const lido = lerSessao();
      expect(lido?.indice).toBeLessThan(PICO);
      expect(lido?.urlProposta).toBeNull();
    }
  });

  it("não restaura o diagnóstico se alguma etapa anterior ficou incompleta", () => {
    guardarSessao({
      indice: PICO,
      respostas: { ...COMPLETAS, q9: null },
      leadId: null,
      urlProposta: "/p/abc123",
    });
    expect(lerSessao()?.indice).toBeLessThan(PICO);
  });

  it("o rascunho do aparelho nunca traz o diagnóstico final de volta", () => {
    guardarMolde({
      indice: PICO,
      respostas: COMPLETAS,
      leadId: null,
      urlProposta: "/p/abc123",
    });
    const lido = lerMolde();
    expect(lido?.urlProposta).toBeNull();
    expect(lido?.indice).toBeLessThan(PICO);
  });

  it("ignora moeda desconhecida vinda do disco", () => {
    (
      window as unknown as { sessionStorage: { setItem: (k: string, v: string) => void } }
    ).sessionStorage.setItem(
      "tailor:sessao:v1",
      JSON.stringify({ indice: 1, respostas: COMPLETAS, moeda: "EUR" })
    );
    expect(lerSessao()?.moeda).toBeUndefined();
  });
});
