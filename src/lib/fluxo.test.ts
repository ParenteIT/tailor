import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CLIENTE, carregarCliente } from "@/content/clientes";
import { renilza } from "@/content/clientes/renilza";
import {
  CENA_LIVRE,
  RESPOSTAS_VAZIAS,
  ajustarMedida,
  escolherCena,
  escolherOferta,
  esquemaRespostas,
  perguntaCompleta,
  ramoCompleto,
  telasDe,
  totalDePecas,
  vertenteDisponivel,
  vertentePorId,
  type RespostasHolding,
} from "@/lib/fluxo";
import { cssDosMundos } from "@/lib/mundos-css";
import { interpretarMoldeHolding } from "@/lib/retomada";

function vertente(id: string) {
  const v = vertentePorId(CLIENTE, id);
  if (!v) throw new Error(`vertente ${id} ausente`);
  return v;
}

/** Um ramo inteiro respondido, com a primeira opção válida de cada pergunta. */
function respondido(id: string): RespostasHolding {
  const v = vertente(id);
  const ramo: RespostasHolding["ramo"] = {};
  for (const p of v.perguntas) {
    if (p.tipo === "escolha") ramo[p.id] = p.opcoes[0].id;
    if (p.tipo === "faixa") ramo[p.id] = p.opcoesPorMoeda.BRL![0].id;
    if (p.tipo === "aberta") ramo[p.id] = "uma frase inteira dela";
    if (p.tipo === "palavras") ramo[p.id] = p.opcoes.slice(0, p.min).map((o) => o.id);
    if (p.tipo === "medida") {
      ramo[p.id] = Object.fromEntries(
        p.campos.map((c) => [c.id, c.formato === "moeda" ? c.faixaPorMoeda.BRL!.padrao : c.faixa.padrao])
      );
    }
  }
  return { ...RESPOSTAS_VAZIAS, nome: "Juliana", cena: id, ramo, whatsapp: "11987654321" };
}

describe("configuração de cliente", () => {
  it("a Renilza carrega e valida", () => {
    expect(() => carregarCliente(renilza)).not.toThrow();
    expect(CLIENTE.vertentes.map((v) => v.id)).toEqual(["imagem", "posicionamento", "estetica"]);
  });

  it("cor fora do formato não carrega (vira CSS gerado no servidor)", () => {
    const [primeira, ...resto] = renilza.vertentes;
    const ruim = { ...primeira, mundo: { ...primeira.mundo, fundo: "red;}body{display:none" } };
    expect(() => carregarCliente({ ...renilza, vertentes: [ruim, ...resto] })).toThrow(/fundo/);
  });

  it("texto sem um dos idiomas não carrega", () => {
    expect(() =>
      carregarCliente({ ...renilza, marca: { ...renilza.marca, fraseMestra: { pt: "só pt" } } })
    ).toThrow(/fraseMestra/);
  });

  it("medida que não cobre os papéis da conta não carrega", () => {
    const [primeira, ...resto] = renilza.vertentes;
    const perguntas = primeira.perguntas.map((p) =>
      p.tipo === "medida" ? { ...p, campos: p.campos.slice(0, 1) } : p
    );
    expect(() =>
      carregarCliente({ ...renilza, vertentes: [{ ...primeira, perguntas }, ...resto] })
    ).toThrow(/precisa de/);
  });

  it("o CSS dos mundos sai por [data-vertente], um bloco por mundo", () => {
    const css = cssDosMundos(CLIENTE);
    expect(css).toContain('[data-vertente="casa"]');
    for (const v of CLIENTE.vertentes) expect(css).toContain(`[data-vertente="${v.id}"]`);
    expect(css.split("\n")).toHaveLength(CLIENTE.vertentes.length + 1);
  });
});

describe("troca de vertente não contamina as respostas", () => {
  it("mudar de cena zera o ramo — 'frase' e 'medida' existem nos três mundos", () => {
    const img = respondido("imagem");
    const trocado = escolherCena(CLIENTE, img, "posicionamento");
    expect(trocado.ramo).toEqual({});
    expect(trocado.viaAberta).toBeNull();
  });

  it("reescolher a mesma vertente mantém o que ela já respondeu", () => {
    const img = respondido("imagem");
    expect(escolherCena(CLIENTE, img, "imagem").ramo).toEqual(img.ramo);
  });

  it("'Nenhuma dessas' segue o ramo configurado sem perder respostas dele", () => {
    const img = respondido("imagem");
    const livre = escolherCena(CLIENTE, img, CENA_LIVRE);
    expect(livre.ramo).toEqual(img.ramo);
    expect(telasDe(CLIENTE, livre).filter((t) => t.tipo === "pergunta")).toHaveLength(
      vertente(CLIENTE.cenaLivre.segue).perguntas.length
    );
  });

  it("o servidor recusa resposta de uma pergunta de outro ramo", () => {
    const esquema = esquemaRespostas(CLIENTE, "BRL");
    const { whatsapp: _w, email: _e, ...base } = respondido("imagem");
    void _w;
    void _e;
    const intruso = { ...base, ramo: { ...base.ramo, trava: "gabando" } };
    expect(esquema.safeParse(intruso).success).toBe(false);
    expect(esquema.safeParse(base).success).toBe(true);
  });
});

describe("regras de cada tipo de pergunta", () => {
  it("medida só completa com todas as réguas mexidas", () => {
    const p = vertente("posicionamento").perguntas.find((x) => x.tipo === "medida")!;
    expect(perguntaCompleta(p, { atual: 400 }, "BRL")).toBe(false);
    expect(perguntaCompleta(p, { atual: 400, desejado: 700, volume: 10 }, "BRL")).toBe(true);
    expect(perguntaCompleta(p, { atual: 400, desejado: 700, volume: 10 }, "USD")).toBe(false);
  });

  it("a meta nunca fica abaixo do que ela já cobra", () => {
    const p = vertente("estetica").perguntas.find((x) => x.tipo === "medida");
    if (p?.tipo !== "medida") throw new Error();
    expect(ajustarMedida(p, { desejado: 200 }, "atual", 300)).toEqual({ atual: 300, desejado: 300 });
  });

  it("palavras: mínimo para avançar, máximo respeitado", () => {
    const p = vertente("imagem").perguntas.find((x) => x.tipo === "palavras");
    if (p?.tipo !== "palavras") throw new Error();
    const ids = p.opcoes.map((o) => o.id);
    expect(perguntaCompleta(p, ids.slice(0, 1), "BRL")).toBe(false);
    expect(perguntaCompleta(p, ids.slice(0, 2), "BRL")).toBe(true);
    expect(perguntaCompleta(p, ids.slice(0, 4), "BRL")).toBe(false);
  });

  it("ramo completo é o que o servidor exige no gate", () => {
    for (const v of CLIENTE.vertentes) {
      expect(ramoCompleto(CLIENTE, respondido(v.id), "BRL")).toBe(true);
    }
    const falta = respondido("imagem");
    delete falta.ramo.frase;
    expect(ramoCompleto(CLIENTE, falta, "BRL")).toBe(false);
  });
});

describe("faixa → oferta (teto de abertura, piso da faixa)", () => {
  const casos: [string, string, string | null][] = [
    ["imagem", "ate500", "saiPronta"],
    ["imagem", "de500a3500", "saiPronta"],
    ["imagem", "de3500a7000", "dossieImagem"],
    // Alta-Costura ainda sem preço: nunca ofertada, mesmo cabendo.
    ["imagem", "acima7000", "dossieImagem"],
    ["posicionamento", "ate200mes", "jornada"],
    ["posicionamento", "de5000a12000", "jornada"],
    // 1:1 de Posicionamento, Turma e Signature têm gate: cabem na faixa, mas a
    // oferta principal é sempre um produto sem gate (HANDOFF §7.2).
    ["posicionamento", "acima12000", "jornada"],
    ["estetica", "ate1000", "daMaca"],
    ["estetica", "de5000a10000", "daMaca"],
    ["estetica", "acima10000", "daMaca"],
  ];
  for (const [v, faixa, esperado] of casos) {
    it(`${v} · ${faixa} → ${esperado}`, () => {
      expect(escolherOferta(CLIENTE, v, faixa, "BRL")?.id ?? null).toBe(esperado);
    });
  }

  it("nenhum produto ofertado custa mais que o piso da faixa marcada", () => {
    for (const v of CLIENTE.vertentes) {
      const p = v.perguntas.find((x) => x.tipo === "faixa");
      if (p?.tipo !== "faixa") continue;
      for (const o of p.opcoesPorMoeda.BRL ?? []) {
        const produto = escolherOferta(CLIENTE, v.id, o.id, "BRL");
        if (produto) expect(produto.preco.BRL!).toBeLessThanOrEqual(o.piso!);
      }
    }
  });

  it("produto com gate ou por convite nunca é a oferta principal", () => {
    for (const v of CLIENTE.vertentes) {
      const p = v.perguntas.find((x) => x.tipo === "faixa");
      if (p?.tipo !== "faixa") continue;
      for (const o of p.opcoesPorMoeda.BRL ?? []) {
        const produto = escolherOferta(CLIENTE, v.id, o.id, "BRL");
        if (produto) {
          expect(produto.gate).toBe(false);
          expect(produto.canal).not.toBe("convite");
        }
      }
    }
  });

  it("nenhum produto com gate tem canal checkout", () => {
    for (const p of CLIENTE.produtos) {
      if (p.gate) expect(p.canal).not.toBe("checkout");
    }
  });
});

describe("ausência de orçamento", () => {
  it("'Prefiro não dizer' não escolhe produto em nenhuma vertente", () => {
    for (const v of CLIENTE.vertentes) {
      expect(escolherOferta(CLIENTE, v.id, "naoDizer", "BRL")).toBeNull();
    }
  });

  it("faixa desconhecida, ausente ou herdada do protótipo antigo não vira oferta", () => {
    expect(escolherOferta(CLIENTE, "imagem", "toString", "BRL")).toBeNull();
    expect(escolherOferta(CLIENTE, "imagem", null, "BRL")).toBeNull();
    expect(escolherOferta(CLIENTE, "imagem", "ate3500", "BRL")).toBeNull();
  });

  it("sem faixa em dólar, nenhum ramo abre em USD (nenhum número inventado)", () => {
    for (const v of CLIENTE.vertentes) expect(vertenteDisponivel(v, "USD")).toBe(false);
    for (const v of CLIENTE.vertentes) expect(vertenteDisponivel(v, "BRL")).toBe(true);
  });
});

describe("retomada do diagnóstico da holding", () => {
  const molde = (extra: Record<string, unknown> = {}) =>
    JSON.stringify({
      cliente: CLIENTE.id,
      versaoFluxo: CLIENTE.versaoFluxo,
      moeda: "BRL",
      indice: 5,
      leadId: null,
      respostas: respondido("imagem"),
      ...extra,
    });

  it("volta ao ponto em que ela estava", () => {
    expect(interpretarMoldeHolding(molde(), CLIENTE, "BRL", false)?.indice).toBe(5);
  });

  it("o molde do quiz de personas nunca é lido como cena nova", () => {
    const antigo = JSON.stringify({
      indice: 4,
      respostas: { persona: "patricia", situacao: "s1", q3: "texto", palavras: ["elegante"] },
    });
    expect(interpretarMoldeHolding(antigo, CLIENTE, "BRL", false)).toBeNull();
  });

  it("outra versão do roteiro é descartada inteira", () => {
    expect(interpretarMoldeHolding(molde({ versaoFluxo: "velha" }), CLIENTE, "BRL", false)).toBeNull();
  });

  it("valores declarados em outra moeda são descartados", () => {
    expect(interpretarMoldeHolding(molde(), CLIENTE, "USD", false)).toBeNull();
  });

  it("resposta com id desconhecido some; o índice não passa da primeira lacuna", () => {
    const r = respondido("imagem");
    const sujo = { ...r, ramo: { ...r.ramo, armario: "naoExiste" } };
    const lido = interpretarMoldeHolding(molde({ respostas: sujo, indice: 7 }), CLIENTE, "BRL", false);
    expect(lido?.respostas.ramo.armario).toBeUndefined();
    expect(lido?.indice).toBe(2);
  });

  it("depois do gate só volta pela aba e com a proposta na mão", () => {
    const gate = telasDe(CLIENTE, respondido("imagem")).findIndex((t) => t.tipo === "gate");
    const pos = molde({ indice: gate + 3, urlProposta: "/p/abc" });
    expect(interpretarMoldeHolding(pos, CLIENTE, "BRL", true)?.indice).toBe(gate + 3);
    expect(interpretarMoldeHolding(pos, CLIENTE, "BRL", false)?.indice).toBe(gate);
    expect(
      interpretarMoldeHolding(molde({ indice: gate + 3 }), CLIENTE, "BRL", true)?.indice
    ).toBe(gate);
  });

  it("entrada direta conta uma tela a menos no contador", () => {
    const direta = { ...respondido("estetica"), entrada: "direta" as const };
    expect(totalDePecas(CLIENTE, direta, "BRL")).toBe(8);
    expect(totalDePecas(CLIENTE, respondido("estetica"), "BRL")).toBe(9);
  });
});

describe("prefers-reduced-motion", () => {
  const raiz = path.resolve(__dirname, "../..");
  const globais = readFileSync(path.join(raiz, "src/app/globals.css"), "utf8");
  const holding = readFileSync(path.join(raiz, "src/app/holding.css"), "utf8");

  it("a regra global zera duração, atraso e transição de tudo", () => {
    const bloco = globais.slice(globais.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(bloco).toMatch(/animation-duration:\s*0\.01ms !important/);
    expect(bloco).toMatch(/animation-delay:\s*0s !important/);
    expect(bloco).toMatch(/transition-duration:\s*0\.01ms !important/);
  });

  it("o CSS da holding anima só transform e opacity", () => {
    const transicoes = [...holding.matchAll(/transition:\s*([^;]+);/g)].map((m) => m[1]);
    for (const t of transicoes) {
      for (const parte of t.split(",")) {
        expect(parte.trim().split(/\s+/)[0]).toMatch(/^(transform|opacity)$/);
      }
    }
    const quadros = holding.slice(holding.indexOf("@keyframes"));
    const propriedades = [...quadros.matchAll(/^\s+([a-z-]+):/gm)].map((m) => m[1]);
    expect(new Set(propriedades)).toEqual(new Set(["opacity", "transform"]));
  });
});
