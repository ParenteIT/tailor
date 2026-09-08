"use client";

import { CenaContainer, segmentoEstilo } from "./base";

/**
 * O marco de prazo — Etapa 7 (Q8). Uma régua com um piquete por opção; a
 * marcada ganha traço sólido no acento dela. Nenhuma semântica de tempo real
 * (sem data, sem contagem, sem urgência) — é só "você marcou esta casa",
 * igual a qualquer outra `LinhaOpcao` do sistema, num traço a mais.
 */
export default function CenaMarcoPrazo({
  total,
  indice,
}: {
  total: number;
  indice: number | null;
}) {
  const espaco = 180 / (total + 1);

  return (
    <CenaContainer altura={56}>
      <svg
        viewBox="0 0 200 56"
        width="100%"
        height="100%"
        fill="none"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        <line x1="10" y1="28" x2="190" y2="28" stroke="var(--rule-2)" strokeWidth="1" />
        {Array.from({ length: total }, (_, i) => {
          const x = 10 + espaco * (i + 1);
          const marcado = indice === i;
          const estilo = segmentoEstilo(marcado, false);
          return (
            <line
              key={i}
              x1={x}
              y1={marcado ? "14" : "20"}
              x2={x}
              y2={marcado ? "42" : "36"}
              style={estilo}
              strokeWidth={marcado ? 1.5 : 1}
              className={marcado ? "cena-pop" : undefined}
            />
          );
        })}
      </svg>
    </CenaContainer>
  );
}
