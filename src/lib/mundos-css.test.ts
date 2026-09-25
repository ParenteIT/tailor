import { describe, expect, it } from "vitest";
import { carregarCliente, type Mundo } from "@/content/clientes";
import { renilza } from "@/content/clientes/renilza";
import { ID_CASA, cssDosMundos } from "@/lib/mundos-css";

const cliente = carregarCliente(renilza);

/** WCAG 2.x: luminância relativa de um #rrggbb. */
function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

const mundos: [string, Mundo][] = [
  [ID_CASA, cliente.casa],
  ...cliente.vertentes.map((v): [string, Mundo] => [v.id, v.mundo]),
];

describe("alerta por mundo (D10)", () => {
  it("confere a fórmula com um par conhecido", () => {
    expect(contraste("#FFFFFF", "#000000")).toBeCloseTo(21, 5);
  });

  it.each(mundos)("%s: alerta ≥ 4,5:1 sobre o fundo e o cartão", (_, m) => {
    expect(contraste(m.alerta, m.fundo)).toBeGreaterThanOrEqual(4.5);
    expect(contraste(m.alerta, m.cartao)).toBeGreaterThanOrEqual(4.5);
  });

  it("cada mundo expõe o seu alerta em --v-alerta", () => {
    const css = cssDosMundos(cliente);
    for (const [id, m] of mundos) {
      const regra = css.split("\n").find((l) => l.startsWith(`[data-vertente="${id}"]`));
      expect(regra).toContain(`--v-alerta:${m.alerta}`);
    }
  });
});
