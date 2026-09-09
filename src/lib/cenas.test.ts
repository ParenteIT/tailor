import { describe, expect, it } from "vitest";
import {
  AGENDA_CAPACIDADE,
  ETIQUETAS_TOTAL,
  SEGMENTOS_ARMARIO,
  agendaTransbordou,
  etiquetasAcesas,
  fracaoNaEscala,
  indiceOpcao,
  marcadoresAgenda,
  segmentosArmario,
} from "@/lib/cenas";

describe("segmentosArmario — null não equivale a zero", () => {
  it("null não acende nenhum segmento, mas não é o mesmo dado que 0%", () => {
    expect(segmentosArmario(null)).toBe(0);
  });

  it("os extremos reais também não acendem tudo nem nada por engano", () => {
    expect(segmentosArmario(5)).toBe(1); // mínimo real da faixa (FAIXAS.pctUsado.min)
    expect(segmentosArmario(100)).toBe(SEGMENTOS_ARMARIO);
  });

  it("valor intermediário arredonda para o segmento mais próximo", () => {
    expect(segmentosArmario(30)).toBe(3);
    expect(segmentosArmario(34)).toBe(3);
    expect(segmentosArmario(36)).toBe(4);
  });

  it("nunca escapa da contagem fixa de peças, mesmo fora de faixa", () => {
    expect(segmentosArmario(-10)).toBe(0);
    expect(segmentosArmario(150)).toBe(SEGMENTOS_ARMARIO);
  });
});

describe("etiquetasAcesas — cresce dentro dos limites reais do campo", () => {
  it("null não acende etiqueta", () => {
    expect(etiquetasAcesas(null, 500, 40000)).toBe(0);
  });

  it("o mínimo do campo não acende etiqueta, o meio da faixa acende algumas", () => {
    expect(etiquetasAcesas(500, 500, 40000)).toBe(0);
    expect(etiquetasAcesas(20000, 500, 40000)).toBeGreaterThan(0);
  });

  it("o máximo do campo acende todas as etiquetas", () => {
    expect(etiquetasAcesas(40000, 500, 40000)).toBe(ETIQUETAS_TOTAL);
  });

  it("nunca ultrapassa o total fixo mesmo com valor acima do max", () => {
    expect(etiquetasAcesas(999999, 500, 40000)).toBe(ETIQUETAS_TOTAL);
  });

  it("faixa degenerada (max <= min) não quebra, devolve zero", () => {
    expect(etiquetasAcesas(100, 500, 500)).toBe(0);
  });
});

describe("fracaoNaEscala — escala comum para Hoje/Meta, nunca normalização própria", () => {
  it("null fica em 0, nunca inventa posição", () => {
    expect(fracaoNaEscala(null, 20000)).toBe(0);
  });

  it("dois valores na MESMA escala mantêm a proporção real entre eles", () => {
    const escalaMax = 20000;
    const atual = fracaoNaEscala(1000, escalaMax);
    const desejado = fracaoNaEscala(3000, escalaMax);
    expect(desejado / atual).toBeCloseTo(3, 5);
  });

  it("nunca passa de 1 nem fica negativo", () => {
    expect(fracaoNaEscala(50000, 20000)).toBe(1);
    expect(fracaoNaEscala(-10, 20000)).toBe(0);
  });

  it("escala inválida não quebra", () => {
    expect(fracaoNaEscala(100, 0)).toBe(0);
  });
});

describe("marcadoresAgenda — limitado, número exato fica no texto", () => {
  it("null não marca nada", () => {
    expect(marcadoresAgenda(null)).toBe(0);
  });

  it("valor mínimo e intermediário passam direto", () => {
    expect(marcadoresAgenda(1)).toBe(1);
    expect(marcadoresAgenda(8)).toBe(8);
  });

  it("capa no teto visual sem inventar mais marcadores que o cap", () => {
    expect(marcadoresAgenda(60)).toBe(AGENDA_CAPACIDADE);
    expect(marcadoresAgenda(AGENDA_CAPACIDADE)).toBe(AGENDA_CAPACIDADE);
  });

  it("sinaliza transbordo só quando passa mesmo do cap", () => {
    expect(agendaTransbordou(null)).toBe(false);
    expect(agendaTransbordou(AGENDA_CAPACIDADE)).toBe(false);
    expect(agendaTransbordou(AGENDA_CAPACIDADE + 1)).toBe(true);
  });
});

describe("indiceOpcao — posição real na lista, nunca inventada", () => {
  const opcoes = ["semana", "mes", "trimestre", "sem-pressa"] as const;

  it("null não tem posição", () => {
    expect(indiceOpcao(opcoes, null)).toBeNull();
  });

  it("acha a posição real de cada opção", () => {
    expect(indiceOpcao(opcoes, "semana")).toBe(0);
    expect(indiceOpcao(opcoes, "sem-pressa")).toBe(3);
  });

  it("valor fora da lista não inventa índice", () => {
    expect(indiceOpcao(opcoes, "outra-coisa")).toBeNull();
  });
});
