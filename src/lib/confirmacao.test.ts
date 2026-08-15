import { describe, expect, it } from "vitest";
import {
  ETAPAS_CONFIRMAVEIS,
  normalizarPreenchimento,
} from "@/lib/confirmacao";
import { ETAPAS } from "@/lib/quiz-state";

/**
 * F5 — modo confirmação.
 *
 * A regra que estes testes existem para segurar: **nunca mostrar "foi isso que
 * eu ouvi" sobre o vazio**. Se o verbatim aparecer sem resposta gravada por
 * trás, ela confirma uma frase, o quiz avança e o campo segue nulo — e a
 * proposta sai sem o número que ela acha que deu. É uma quebra silenciosa,
 * exatamente o tipo que some numa refatoração.
 */

const AUDIO_COMPLETO = {
  leadId: "lead-1",
  nome: "Renilza Miranda",
  persona: "camila",
  respostas: {
    situacao: "cobro pouco",
    q3: "queria parar de me sentir amadora quando falo de preço",
    precoAtual: 1200,
    precoDesejado: 2400,
    volumeMensal: 6,
  },
  ouvido: {
    espelho: "eu cobro muito pouco pelo que entrego",
    q3: "queria parar de me sentir amadora quando falo de preço",
    gap: "hoje eu cobro mil e duzentos, queria dobrar",
  },
};

describe("o verbatim só sobrevive com resposta real por trás", () => {
  it("mantém as três etapas quando o áudio respondeu tudo", () => {
    const p = normalizarPreenchimento(AUDIO_COMPLETO);
    expect(Object.keys(p.ouvido).sort()).toEqual(["espelho", "gap", "q3"]);
  });

  it("descarta o verbatim do gap quando falta um dos números", () => {
    const p = normalizarPreenchimento({
      ...AUDIO_COMPLETO,
      respostas: { ...AUDIO_COMPLETO.respostas, volumeMensal: undefined },
    });
    expect(p.ouvido.gap).toBeUndefined();
    // As outras duas não são punidas pelo buraco da terceira.
    expect(p.ouvido.q3).toBeDefined();
    expect(p.ouvido.espelho).toBeDefined();
  });

  it("descarta o verbatim do espelho quando a persona não veio", () => {
    const p = normalizarPreenchimento({ ...AUDIO_COMPLETO, persona: null });
    expect(p.ouvido.espelho).toBeUndefined();
  });

  it("descarta o verbatim do q3 quando a resposta é vazia", () => {
    const p = normalizarPreenchimento({
      ...AUDIO_COMPLETO,
      respostas: { ...AUDIO_COMPLETO.respostas, q3: "   " },
    });
    expect(p.ouvido.q3).toBeUndefined();
  });

  it("verbatim em branco não vira cartão", () => {
    const p = normalizarPreenchimento({
      ...AUDIO_COMPLETO,
      ouvido: { ...AUDIO_COMPLETO.ouvido, q3: "  " },
    });
    expect(p.ouvido.q3).toBeUndefined();
  });

  it("sem áudio nenhum, o quiz é o frio inteiro", () => {
    const p = normalizarPreenchimento({ leadId: "lead-2" });
    expect(p.ouvido).toEqual({});
    expect(p.respostas).toEqual({});
  });
});

describe("só três etapas se deixam pré-responder por fala", () => {
  it("as confirmáveis são etapas de verdade do quiz", () => {
    for (const etapa of ETAPAS_CONFIRMAVEIS) {
      expect(ETAPAS).toContain(etapa);
    }
  });

  it("gate, futuro, q7, q8 e q9 nunca entram por áudio", () => {
    const p = normalizarPreenchimento({
      ...AUDIO_COMPLETO,
      ouvido: {
        ...AUDIO_COMPLETO.ouvido,
        gate: "meu whatsapp é 11 99999 0000",
        futuro: "queria me sentir elegante",
        q9: "posso investir uns cinco mil",
      } as Record<string, unknown>,
    });
    expect(Object.keys(p.ouvido).sort()).toEqual(["espelho", "gap", "q3"]);
  });
});

describe("o payload vem de jsonb livre e é saneado", () => {
  it("tipo errado vira ausência, não vira NaN na régua", () => {
    const p = normalizarPreenchimento({
      leadId: "lead-3",
      persona: "camila",
      respostas: {
        precoAtual: "mil e duzentos",
        precoDesejado: Number.NaN,
        volumeMensal: -3,
      } as never,
      ouvido: { gap: "hoje eu cobro mil e duzentos" },
    });
    expect(p.respostas.precoAtual).toBeUndefined();
    expect(p.respostas.precoDesejado).toBeUndefined();
    expect(p.respostas.volumeMensal).toBeUndefined();
    expect(p.ouvido.gap).toBeUndefined();
  });

  it("persona desconhecida não vira acento inventado na página", () => {
    const p = normalizarPreenchimento({
      leadId: "lead-4",
      persona: "renilza",
      respostas: { situacao: "cobro pouco" },
      ouvido: { espelho: "eu cobro pouco" },
    });
    expect(p.respostas.persona).toBeUndefined();
    expect(p.ouvido.espelho).toBeUndefined();
  });

  it("guarda só o primeiro nome, que é o que a tela usa", () => {
    const p = normalizarPreenchimento({
      leadId: "lead-5",
      nome: "  Renilza Miranda  ",
    });
    expect(p.nome).toBe("Renilza");
  });
});

describe("C1 continua valendo no modo confirmação", () => {
  it("confirmar não cria tela nova — são as mesmas nove até o gate", () => {
    // O modo confirmação reusa ETAPAS. Se alguém acrescentar uma tela só para
    // a confirmação, C1 quebra aqui antes de quebrar na frente da Renilza.
    expect(ETAPAS.indexOf("gate") + 1).toBe(9);
  });
});
