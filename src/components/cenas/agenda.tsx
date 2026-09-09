"use client";

import { AGENDA_CAPACIDADE, agendaTransbordou, marcadoresAgenda } from "@/lib/cenas";
import { CenaContainer } from "./base";

const PALETA = ["#E8935B", "#F0C24A", "#D9707A"];

const COLUNAS = 4;

/**
 * A agenda do mês — Etapa 3 (precificação), Q5b (`volumeMensal`).
 *
 * Uma folha de agenda com espiral: cada horário marcado preenche um bloco.
 * Doze blocos fixos (o teto VISUAL, não o teto do campo, que vai a 60) — o
 * número exato mora no texto ao lado, e o "+" avisa quando ela declarou mais
 * atendimentos do que a folha comporta desenhar. Nenhum atendimento fictício:
 * a folha só mostra o que ela arrastou.
 */
export default function CenaAgenda({
  volume,
  latente,
}: {
  volume: number | null;
  latente: boolean;
}) {
  const marcados = latente ? 0 : marcadoresAgenda(volume);
  const transbordou = !latente && agendaTransbordou(volume);

  const larguraBloco = 32;
  const alturaBloco = 14;

  return (
    <CenaContainer altura={112}>
      <svg
        viewBox="0 0 220 112"
        width="100%"
        height="100%"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        {/* A folha. */}
        <rect
          x="28"
          y="18"
          width="164"
          height="84"
          rx="6"
          fill="none"
          stroke="var(--ink-2)"
          strokeWidth="1.5"
        />
        {/* A espiral. */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${52 + i * 30} 12 a5 5 0 0 1 0 12`}
            fill="none"
            stroke="var(--ink-2)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        {/* O cabeçalho da folha. */}
        <line
          x1="38"
          y1="34"
          x2="106"
          y2="34"
          stroke="var(--ink-3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Os blocos de horário. */}
        {Array.from({ length: AGENDA_CAPACIDADE }, (_, i) => {
          const coluna = i % COLUNAS;
          const linha = Math.floor(i / COLUNAS);
          const x = 38 + coluna * (larguraBloco + 5);
          const y = 44 + linha * (alturaBloco + 6);
          const marcado = i < marcados;
          const cor = PALETA[i % PALETA.length];
          return (
            <rect
              key={i}
              className={marcado ? "cena-pop" : undefined}
              x={x}
              y={y}
              width={larguraBloco}
              height={alturaBloco}
              rx="3"
              fill={marcado ? cor : "none"}
              stroke={marcado ? cor : "var(--ink-3)"}
              strokeWidth="1.25"
              strokeDasharray={marcado ? "none" : "3 3"}
              opacity={marcado ? 1 : 0.5}
            />
          );
        })}

        {transbordou ? (
          <g stroke={PALETA[0]} strokeWidth="1.75" strokeLinecap="round">
            <line x1="200" y1="60" x2="210" y2="60" />
            <line x1="205" y1="55" x2="205" y2="65" />
          </g>
        ) : null}
      </svg>
    </CenaContainer>
  );
}
