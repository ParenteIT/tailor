"use client";

import { SEGMENTOS_ARMARIO, segmentosArmario } from "@/lib/cenas";
import { CenaContainer, segmentoEstilo } from "./base";

/**
 * O armário — Etapa 3 (guarda-roupa), Q4-P. Dez peças fixas na cabideira;
 * a fração acesa (traço sólido, cor de acento) é o que muda com `pctUsado`.
 * NUNCA aumenta a quantidade total — o número exato mora no texto ao lado
 * (`ReguaMedida`), isto é só a leitura esquemática.
 *
 * `latente`: ela ainda não tocou a régua. Todas as peças ficam na notação de
 * "linha de costura" (tracejada, apagada) — nem uma acesa, porque acender
 * qualquer coisa aqui seria tratar o valor padrão do slider como declaração
 * dela, o que o pedido original proíbe explicitamente.
 */
export default function CenaArmario({
  pct,
  latente,
}: {
  pct: number | null;
  latente: boolean;
}) {
  const acesos = latente ? 0 : segmentosArmario(pct);
  const espaco = 200 / (SEGMENTOS_ARMARIO + 1);

  return (
    <CenaContainer>
      <svg
        viewBox="0 0 200 72"
        width="100%"
        height="100%"
        fill="none"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        {/* A cabideira. */}
        <line x1="6" y1="12" x2="194" y2="12" stroke="var(--rule-2)" strokeWidth="1" />
        {Array.from({ length: SEGMENTOS_ARMARIO }, (_, i) => {
          const x = espaco * (i + 1);
          const aceso = i < acesos;
          const estilo = segmentoEstilo(aceso, latente);
          return (
            <g key={i} style={{ transition: estilo.transition }}>
              {/* O gancho. */}
              <circle cx={x} cy="12" r="1.6" style={estilo} strokeWidth="1" fill="none" />
              {/* A peça pendurada. */}
              <line x1={x} y1="14" x2={x} y2="52" style={estilo} strokeWidth="1" />
              {/* A barra — só a peça acesa "cai" mais larga; a apagada é um traço fino. */}
              <line
                x1={x - (aceso && !latente ? 7 : 3)}
                y1="52"
                x2={x + (aceso && !latente ? 7 : 3)}
                y2="52"
                style={estilo}
                strokeWidth="1"
              />
            </g>
          );
        })}
      </svg>
    </CenaContainer>
  );
}
