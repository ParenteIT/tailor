"use client";

import { ETIQUETAS_TOTAL, etiquetasAcesas } from "@/lib/cenas";
import { CenaContainer } from "./base";

const PALETA = ["#E8935B", "#F0C24A", "#D9707A"];

/**
 * O valor adormecido — Etapa 3 (guarda-roupa), Q5-P (`valorParado`).
 *
 * Cédulas empilhadas que vão APARECENDO conforme o valor declarado sobe:
 * nada some, nada queima, nada é "desperdício". C3 do Conselho é explícita —
 * a trilha da Patrícia fala de valor ADORMECIDO (esperança), nunca de dinheiro
 * jogado fora (vergonha). Uma nota parada continua sendo dinheiro dela.
 *
 * O símbolo da moeda vem por prop porque a moeda vem do idioma (BRL no pt-BR,
 * USD no internacional — `moedaDoIdioma` em content/config.ts). Nada de "R$"
 * cravado aqui dentro.
 */
export default function CenaEtiquetas({
  valor,
  min,
  max,
  latente,
  simbolo = "R$",
}: {
  valor: number | null;
  min: number;
  max: number;
  latente: boolean;
  simbolo?: string;
}) {
  const acesas = latente ? 0 : etiquetasAcesas(valor, min, max);

  return (
    <CenaContainer altura={112}>
      <svg
        viewBox="0 0 220 112"
        width="100%"
        height="100%"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        {Array.from({ length: ETIQUETAS_TOTAL }, (_, i) => i)
          // Desenhadas de trás pra frente: em SVG quem é desenhado depois fica
          // por cima, então sem inverter as notas AINDA APAGADAS cobriam as
          // acesas — o maço parecia vazio mesmo com valor declarado.
          .reverse()
          .map((i) => {
          // Empilhadas com sobreposição, como maço na mão: cada nota sobe um
          // degrau curto. A da frente é a primeira a acender.
          const x = 40 + i * 17;
          const y = 62 - i * 9;
          const acesa = i < acesas;
          const cor = PALETA[i % PALETA.length];
          return (
            <g key={i} className={acesa ? "cena-pop" : undefined}>
              <rect
                x={x}
                y={y}
                width="76"
                height="34"
                rx="3"
                // A nota apagada é preenchida com a própria superfície, não
                // transparente: sem isso o maço vira um emaranhado de
                // contornos sobrepostos em vez de camadas de papel.
                fill={acesa ? cor : "var(--surface)"}
                stroke={acesa ? cor : "var(--ink-3)"}
                strokeWidth="1.5"
                strokeDasharray={acesa ? "none" : "3 3"}
                opacity={acesa ? 1 : 0.65}
              />
              {/* A cifra só existe na nota acesa — nota apagada é o contorno
                  do que ainda não foi declarado, não um valor de zero. */}
              {acesa ? (
                <text
                  x={x + 38}
                  y={y + 22}
                  textAnchor="middle"
                  fill="var(--color-cta-ink)"
                  style={{
                    fontFamily: "var(--font-rigor)",
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                  }}
                >
                  {simbolo}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </CenaContainer>
  );
}
