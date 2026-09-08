"use client";

import { fracaoNaEscala } from "@/lib/cenas";
import { CenaContainer } from "./base";

const GRADUACOES = [0, 0.25, 0.5, 0.75, 1];

/**
 * Escala comum — Etapa 3 (precificação), Q4/Q5 (`precoAtual`/`precoDesejado`).
 * As duas marcas vivem na MESMA régua (mesmo `escalaMax`), nunca em pilhas
 * normalizadas cada uma pro seu próprio 100% — senão um preço pequeno e um
 * grande pareceriam do mesmo tamanho, que é exatamente a comparação errada.
 *
 * "Hoje" e "Sua meta" usam formas diferentes (círculo × losango), não só cor:
 * ficam em raias separadas da régua para não se sobreporem quando os dois
 * valores estão perto um do outro, mas a posição horizontal — o dado — segue
 * a mesma escala para os dois.
 */
export default function CenaEscalaPreco({
  atual,
  desejado,
  escalaMax,
  latenteAtual,
  latenteDesejado,
}: {
  atual: number | null;
  desejado: number | null;
  escalaMax: number;
  latenteAtual: boolean;
  latenteDesejado: boolean;
}) {
  const xDe = (fracao: number) => 10 + fracao * 180;
  const fAtual = latenteAtual ? null : fracaoNaEscala(atual, escalaMax);
  const fDesejado = latenteDesejado ? null : fracaoNaEscala(desejado, escalaMax);

  return (
    <CenaContainer altura={72}>
      <svg
        viewBox="0 0 200 72"
        width="100%"
        height="100%"
        fill="none"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        {/* A régua comum, com graduações — a mesma gramática da fita métrica
            da proposta (lib/gap.ts, escalaDaFita). */}
        <line x1="10" y1="56" x2="190" y2="56" stroke="var(--rule-2)" strokeWidth="1" />
        {GRADUACOES.map((g) => (
          <line
            key={g}
            x1={xDe(g)}
            y1="53"
            x2={xDe(g)}
            y2="59"
            stroke="var(--rule-2)"
            strokeWidth="1"
          />
        ))}

        {/* Raia "Hoje": círculo, sempre na linha de base. */}
        {fAtual !== null ? (
          <g
            className="cena-pop"
            style={{ transition: "transform 380ms cubic-bezier(0.16,1,0.3,1)" }}
          >
            <line
              x1={xDe(fAtual)}
              y1="44"
              x2={xDe(fAtual)}
              y2="56"
              stroke="var(--ink-2)"
              strokeWidth="1"
            />
            <circle cx={xDe(fAtual)} cy="40" r="4" stroke="var(--ink-2)" strokeWidth="1.25" />
          </g>
        ) : null}

        {/* Raia "Sua meta": losango, numa raia acima para nunca colidir com a
            de "Hoje" quando os valores estão perto. */}
        {fDesejado !== null ? (
          // O `transform` de posição vive num <g> próprio, separado do que
          // recebe `.cena-pop` — CSS transform (a animação) sobrescreve
          // atributo `transform` de SVG no MESMO elemento, então a escala
          // tinha que morar num filho, senão a marca pulava pra origem
          // (0,0) toda vez que a animação disparava.
          <g
            style={{ transition: "transform 380ms cubic-bezier(0.16,1,0.3,1)" }}
            transform={`translate(${xDe(fDesejado)}, 20)`}
          >
            <g className="cena-pop">
              <line x1="0" y1="4" x2="0" y2="34" stroke="var(--accent)" strokeWidth="1" />
              <rect
                x="-4.2"
                y="-4.2"
                width="8.4"
                height="8.4"
                transform="rotate(45)"
                stroke="var(--accent)"
                strokeWidth="1.25"
              />
            </g>
          </g>
        ) : null}
      </svg>
    </CenaContainer>
  );
}
