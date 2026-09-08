"use client";

import { SEGMENTOS_ARMARIO, segmentosArmario } from "@/lib/cenas";
import { CenaContainer } from "./base";

/* ==========================================================================
   PROTÓTIPO — pedido do Willian (07/09/2026): "tirar o marrom", ilustração
   tipo cartoon de guarda-roupa com roupas, mais presença/cor. Isto é uma
   proposta concreta pra avaliação, não substituição silenciosa do sistema
   documentado — se aprovada, entra pelo protocolo §10 do BRAND-VISUAL antes
   de virar padrão nas outras 5 cenas.

   Ainda assim, três disciplinas do sistema se mantêm de propósito:
   - O traço/contorno usa os tokens de tinta existentes (--ink-2/--ink-3),
     nunca uma cor nova de linha — só o PREENCHIMENTO das peças ganha cor.
   - A contagem de peças continua fixa (SEGMENTOS_ARMARIO) e a fração acesa
     continua vindo só do dado real — nenhuma ilustração "mais bonita" pode
     virar fonte de verdade.
   - `latente` (ela não tocou a régua) continua um estado visual PRÓPRIO:
     nenhuma peça colorida até ela responder.

   Paleta "pôr do sol" — confirmada pelo Willian em 07/09/2026 depois de ver
   4 opções lado a lado (a original rosa/ouro/sálvia, esta, uma de joia fria e
   um monocromático de ouro). Cada peça que acende ganha um pop curto — a
   régua completa, o giz assenta. `prefers-reduced-motion` zera isso, como
   zera todo o resto (regra global em globals.css).
   ========================================================================= */

const PALETA_ACESO = ["#E8935B", "#F0C24A", "#D9707A"];

export default function CenaArmarioCartoon({
  pct,
  latente,
}: {
  pct: number | null;
  latente: boolean;
}) {
  const acesos = latente ? 0 : segmentosArmario(pct);

  return (
    <CenaContainer altura={168}>
      <svg
        viewBox="0 0 240 168"
        width="100%"
        height="100%"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        {/* O móvel — só linha, como o resto do sistema. Cantos arredondados
            de propósito (o resto do produto usa 2px; aqui, 10, porque é
            ilustração de personagem/objeto, não um cartão de interface). */}
        <rect
          x="14"
          y="14"
          width="212"
          height="142"
          rx="14"
          fill="none"
          stroke="var(--ink-2)"
          strokeWidth="2"
        />
        {/* A cornija. */}
        <path
          d="M10 26 L120 10 L230 26"
          fill="none"
          stroke="var(--ink-2)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* A prateleira de baixo, com duas peças dobradas — textura extra
            sem inventar mais segmentos de dado. */}
        <line x1="14" y1="126" x2="226" y2="126" stroke="var(--ink-3)" strokeWidth="1.5" />
        <rect x="34" y="132" width="26" height="14" rx="4" fill="var(--ink-3)" opacity="0.5" />
        <rect x="68" y="134" width="24" height="12" rx="4" fill="var(--ink-3)" opacity="0.35" />

        {/* A cabideira. */}
        <line x1="30" y1="44" x2="210" y2="44" stroke="var(--ink-2)" strokeWidth="2" />

        {Array.from({ length: SEGMENTOS_ARMARIO }, (_, i) => {
          const x = 40 + i * 18;
          const aceso = i < acesos;
          const cor = PALETA_ACESO[i % PALETA_ACESO.length];
          // Alterna vestido/camisa só pela silhueta, pra não ficar uma fileira
          // repetitiva — nenhuma das duas formas carrega dado extra.
          const vestido = i % 2 === 0;
          return (
            <g key={i} className={aceso ? "cena-pop" : undefined}>
              {/* O gancho. */}
              <path
                d={`M${x} 44 q0 -8 6 -8`}
                fill="none"
                stroke={aceso ? cor : "var(--ink-3)"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {vestido ? (
                <path
                  d={`M${x - 6} 48 L${x + 6} 48 L${x + 9} 96 Q${x} 104 ${x - 9} 96 Z`}
                  fill={aceso ? cor : "none"}
                  stroke={aceso ? cor : "var(--ink-3)"}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  opacity={aceso ? 1 : 0.6}
                />
              ) : (
                <path
                  d={`M${x - 7} 50 L${x - 7} 44 L${x - 2} 48 L${x + 2} 48 L${x + 7} 44 L${x + 7} 50 L${x + 7} 88 L${x - 7} 88 Z`}
                  fill={aceso ? cor : "none"}
                  stroke={aceso ? cor : "var(--ink-3)"}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  opacity={aceso ? 1 : 0.6}
                />
              )}
            </g>
          );
        })}
      </svg>
    </CenaContainer>
  );
}
