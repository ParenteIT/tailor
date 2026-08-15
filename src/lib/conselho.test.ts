import { describe, expect, it } from "vitest";
import {
  FAIXAS_INVESTIMENTO,
  FAIXAS_POR_MOEDA,
  FATOR_TETO_FITA,
  OFERTA_POR_FAIXA,
  PRODUTOS,
  moedaDoIdioma,
} from "@/content/config";
import { PERSONAS } from "@/content/personas";
import { calcularGap, dinheiro, escalaDaFita } from "@/lib/gap";
import { ETAPAS, TELAS_ATE_O_GATE, etapaCompleta, RESPOSTAS_VAZIAS } from "@/lib/quiz-state";

/**
 * As condições do Conselho de 13/08/2026 são restrição de produto, não
 * sugestão — e são o tipo de coisa que quebra em silêncio numa refatoração.
 * Estes testes existem para que a quebra faça barulho.
 *
 * C4 já foi violada uma vez aqui: o arredondamento "bonito" do teto levou
 * 1.200 a uma régua de 5.000 (4,17×), acima do limite de 2–3×.
 */

describe("C1 — no máximo 9 telas do início ao gate", () => {
  it("o gate é a nona tela", () => {
    expect(TELAS_ATE_O_GATE).toBe(9);
    expect(TELAS_ATE_O_GATE).toBeLessThanOrEqual(9);
  });

  it("o pico vem depois do gate e não conta para o teto", () => {
    expect(ETAPAS.indexOf("pico")).toBeGreaterThan(ETAPAS.indexOf("gate"));
  });

  it("a situação (Q2) é sub-opção da Q1, não tela própria", () => {
    expect(ETAPAS).not.toContain("q2");
    const semSituacao = { ...RESPOSTAS_VAZIAS, persona: "camila" as const };
    expect(etapaCompleta("espelho", semSituacao)).toBe(false);
    expect(
      etapaCompleta("espelho", { ...semSituacao, situacao: "qualquer" })
    ).toBe(true);
  });
});

describe("C4 — teto da fita entre 2× e 3× o preço atual", () => {
  const casos = [
    { atual: 500, desejado: 800, volume: 4 },
    { atual: 1200, desejado: 3000, volume: 8 },
    { atual: 2000, desejado: 2000, volume: 1 },
    { atual: 350, desejado: 900, volume: 12 },
    { atual: 4800, desejado: 5200, volume: 3 },
  ];

  for (const caso of casos) {
    it(`respeita a faixa para ${caso.atual} → ${caso.desejado}`, () => {
      const gap = calcularGap(
        {
          precoAtual: caso.atual,
          precoDesejado: caso.desejado,
          volumeMensal: caso.volume,
        },
        "precificacao"
      );
      expect(gap).not.toBeNull();
      const escala = escalaDaFita(gap!);

      expect(escala.teto).toBeGreaterThanOrEqual(caso.atual * 2);
      expect(escala.teto).toBeLessThanOrEqual(caso.atual * 3);
      // Nunca abaixo da meta declarada.
      expect(escala.teto).toBeGreaterThanOrEqual(caso.desejado);
    });
  }

  it("a meta vence o teto quando ela declara mais que 3×", () => {
    const gap = calcularGap(
      { precoAtual: 1000, precoDesejado: 9000, volumeMensal: 5 },
      "precificacao"
    );
    const escala = escalaDaFita(gap!);
    expect(escala.teto).toBe(9000);
  });

  it("as graduações ficam ordenadas e dentro do teto", () => {
    const gap = calcularGap(
      { precoAtual: 1200, precoDesejado: 3000, volumeMensal: 8 },
      "precificacao"
    );
    const escala = escalaDaFita(gap!);
    expect(escala.graduacoes[0]).toBe(0);
    expect(escala.graduacoes.at(-1)).toBe(escala.teto);
    for (let i = 1; i < escala.graduacoes.length; i++) {
      expect(escala.graduacoes[i]).toBeGreaterThan(escala.graduacoes[i - 1]);
      expect(escala.graduacoes[i]).toBeLessThanOrEqual(escala.teto);
    }
  });

  it("o fator configurado permanece dentro da faixa aprovada", () => {
    expect(FATOR_TETO_FITA).toBeGreaterThanOrEqual(2);
    expect(FATOR_TETO_FITA).toBeLessThanOrEqual(3);
  });
});

describe("aritmética do gap — só o que ela declarou", () => {
  it("não inventa resultado quando falta uma medida", () => {
    expect(
      calcularGap({ precoAtual: 1000, precoDesejado: 2000 }, "precificacao")
    ).toBeNull();
    expect(calcularGap({ pctUsado: 30 }, "guarda_roupa")).toBeNull();
  });

  it("multiplica pela agenda dela, e por doze", () => {
    const gap = calcularGap(
      { precoAtual: 1000, precoDesejado: 2500, volumeMensal: 6 },
      "precificacao"
    );
    expect(gap).toMatchObject({ unidade: 1500, mes: 9000, ano: 108000 });
  });

  it("trava o desejado no mínimo do atual, defendido no servidor", () => {
    const gap = calcularGap(
      { precoAtual: 2000, precoDesejado: 500, volumeMensal: 3 },
      "precificacao"
    );
    expect(gap).toMatchObject({ precoDesejado: 2000, unidade: 0 });
  });

  it("C3 — a trilha da Patrícia mede o que está adormecido, não o desperdício", () => {
    const gap = calcularGap({ pctUsado: 28, valorParado: 4200 }, "guarda_roupa");
    expect(gap).toMatchObject({ pctUsado: 28, pctAdormecido: 72 });
    expect(PERSONAS.patricia.trilha).toBe("guarda_roupa");
  });
});

describe("moeda por idioma — BRL no pt-BR, USD no internacional", () => {
  it("mapeia os três locales e cai em BRL no desconhecido", () => {
    expect(moedaDoIdioma("pt")).toBe("BRL");
    expect(moedaDoIdioma("en")).toBe("USD");
    expect(moedaDoIdioma("fr")).toBe("USD");
    expect(moedaDoIdioma(undefined)).toBe("BRL");
    expect(moedaDoIdioma("de")).toBe("BRL");
  });

  it("não converte: cada moeda tem faixa própria de slider", () => {
    expect(FAIXAS_POR_MOEDA.BRL.precoAtual.max).toBe(5000);
    expect(FAIXAS_POR_MOEDA.USD.precoAtual.max).toBe(1000);
    // Se um dia alguém trocar as faixas por conversão, a razão vira uma taxa
    // de câmbio — que é exatamente o que a decisão de 13/08 recusou.
    const razao =
      FAIXAS_POR_MOEDA.BRL.precoAtual.max / FAIXAS_POR_MOEDA.USD.precoAtual.max;
    expect(razao).not.toBeCloseTo(5.4, 1);
  });

  it("formata sem centavos, na moeda declarada", () => {
    expect(dinheiro(1200, "BRL")).toContain("1.200");
    expect(dinheiro(1200, "USD")).toContain("1,200");
    expect(dinheiro(1200, "BRL")).not.toContain(",00");
  });

  it("a escala da fita carrega a moeda para a proposta reabrir igual", () => {
    const gap = calcularGap(
      { precoAtual: 150, precoDesejado: 350, volumeMensal: 6 },
      "precificacao"
    );
    expect(escalaDaFita(gap!, "USD").moeda).toBe("USD");
    expect(escalaDaFita(gap!).moeda).toBe("BRL");
  });
});

describe("oferta por faixa declarada na Q9", () => {
  it("cobre todas as faixas e nunca oferta vazio", () => {
    for (const faixa of FAIXAS_INVESTIMENTO) {
      const chave = OFERTA_POR_FAIXA[faixa];
      expect(chave).toBeTruthy();
      expect(PRODUTOS[chave].nome.length).toBeGreaterThan(3);
    }
  });

  it("sobe de produto conforme ela declara mais", () => {
    expect(OFERTA_POR_FAIXA.ate3500).toBe("dossie");
    expect(OFERTA_POR_FAIXA.de3500a7k).toBe("prismaEssencial");
    expect(OFERTA_POR_FAIXA.de7a10k).toBe("prismaCompleto");
    expect(OFERTA_POR_FAIXA.acima10k).toBe("prismaCompleto");
  });

  it("quem não declarou não recebe o topo — presumir seria inventar", () => {
    expect(OFERTA_POR_FAIXA.naoDizer).not.toBe("prismaCompleto");
    // Fica no degrau do meio, não no de entrada — dossie virou o de entrada
    // quando a faixa subiu para casar com o preço real do Dossiê (14/08/2026).
    expect(OFERTA_POR_FAIXA.naoDizer).toBe("prismaEssencial");
  });

  it("nenhum preço real vazou para o catálogo", () => {
    for (const produto of Object.values(PRODUTOS)) {
      expect(produto.preco).toBe("◆");
    }
  });
});
