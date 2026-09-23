"use client";

import { useEffect, useRef, useState } from "react";
import type { NomeFigura } from "@/content/clientes/esquema";
import { Icone } from "./icones";

/**
 * O catálogo de figuras que andam a cada resposta. Uma vertente escolhe a sua
 * pelo nome; a figura só conhece "posição p de um total" — nunca a pergunta.
 *
 * Movimento só por transform e opacity (a costura é scaleX, a agulha e o
 * ponto são translateX, as partes do templo sobem por translateY+opacity).
 * `prefers-reduced-motion` zera as transições no CSS global; a onda do toque,
 * que é Web Animations, confere a preferência antes de tocar.
 */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function prefereMenosMovimento(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Ao montar num mundo novo, a figura nasce uma casa atrás e anda até a
 * posição certa — é a figura que avança, não a tela que já chega pronta.
 */
function usePosicaoAnimada(posicao: number): number {
  const [exibida, setExibida] = useState(() => Math.max(1, posicao - 1));
  useEffect(() => {
    let segundo = 0;
    const primeiro = requestAnimationFrame(() => {
      segundo = requestAnimationFrame(() => setExibida(posicao));
    });
    return () => {
      cancelAnimationFrame(primeiro);
      cancelAnimationFrame(segundo);
    };
  }, [posicao]);
  return exibida;
}

/** x da casa p num trilho de 4 a 116, com `total` casas. */
function xDaCasa(p: number, total: number): number {
  const passos = Math.max(1, total - 1);
  return 4 + ((Math.min(Math.max(p, 1), total) - 1) * 112) / passos;
}

function Agulha({ posicao, total }: { posicao: number; total: number }) {
  const p = usePosicaoAnimada(posicao);
  const x = xDaCasa(p, total);
  return (
    <svg viewBox="0 0 120 24" className="h-fig" aria-hidden="true" style={{ overflow: "visible" }}>
      <line x1="4" y1="14" x2="116" y2="14" stroke="var(--v-trilho)" strokeDasharray="3 3" />
      <line
        x1="4"
        y1="14"
        x2="116"
        y2="14"
        stroke="var(--v-acento)"
        strokeWidth="1.25"
        style={{
          transformOrigin: "4px 14px",
          transform: `scaleX(${(x - 4) / 112})`,
          transition: `transform 700ms ${EASE}`,
        }}
      />
      <g style={{ transform: `translateX(${x - 4}px)`, transition: `transform 700ms ${EASE}` }}>
        <circle cx="4" cy="14" r="4.5" fill="none" stroke="var(--v-acento)" />
        <path d="M-3 21 11 5" stroke="var(--v-tinta)" strokeWidth="1.1" strokeLinecap="round" />
        <ellipse
          cx="11.6"
          cy="4.4"
          rx="1.4"
          ry=".8"
          transform="rotate(-48 11.6 4.4)"
          fill="none"
          stroke="var(--v-tinta)"
          strokeWidth=".9"
        />
      </g>
    </svg>
  );
}

const PARTES_TEMPLO = [
  <rect key="1" x="4" y="44" width="52" height="4" />,
  <rect key="2" x="8" y="40" width="44" height="4" />,
  <rect key="3" x="12" y="19" width="4" height="21" />,
  <rect key="4" x="22" y="19" width="4" height="21" />,
  <rect key="5" x="34" y="19" width="4" height="21" />,
  <rect key="6" x="44" y="19" width="4" height="21" />,
  <rect key="7" x="8" y="14" width="44" height="5" />,
  <path key="8" d="M8 14 30 4 52 14z" />,
];

/** Partes erguidas: a base na primeira resposta, o frontão no gate. */
function partesDeTemplo(p: number, total: number): number {
  const passos = Math.max(1, total - 1);
  return Math.round(((Math.min(Math.max(p, 1), total) - 1) * PARTES_TEMPLO.length) / passos);
}

export function Templo({
  posicao,
  total,
  grande = false,
}: {
  posicao: number;
  total: number;
  grande?: boolean;
}) {
  const p = usePosicaoAnimada(posicao);
  const erguidas = partesDeTemplo(p, total);
  return (
    <svg
      viewBox="0 0 60 50"
      className={grande ? "h-templo h-templo-grande" : "h-templo"}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <g fill="none" stroke="var(--v-trilho)" strokeWidth=".7" strokeDasharray="2 2">
        {PARTES_TEMPLO}
      </g>
      <g fill="none" stroke="var(--v-acento)" strokeWidth="1.1" strokeLinejoin="round">
        {PARTES_TEMPLO.map((parte, i) => (
          <g
            key={i}
            style={{
              opacity: i < erguidas ? 1 : 0,
              transform: i < erguidas ? "none" : "translateY(4px)",
              transition: `opacity 520ms ${EASE}, transform 520ms ${EASE}`,
            }}
          >
            {parte}
          </g>
        ))}
      </g>
    </svg>
  );
}

/** A barra do templo: o preenchimento da vertente, em scaleX. */
function BarraDoTemplo({ posicao, total }: { posicao: number; total: number }) {
  const p = usePosicaoAnimada(posicao);
  return (
    <div className="h-barra" aria-hidden="true">
      <i style={{ transform: `scaleX(${Math.min(p, total) / total})`, transition: `transform 700ms ${EASE}` }} />
    </div>
  );
}

function Toque({ posicao, total }: { posicao: number; total: number }) {
  const p = usePosicaoAnimada(posicao);
  const x = xDaCasa(p, total);
  const onda = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const alvo = onda.current;
    if (!alvo || prefereMenosMovimento() || typeof alvo.animate !== "function") return;
    const animacao = alvo.animate(
      [
        { transform: "scale(1)", opacity: 0.6 },
        { transform: "scale(3.2)", opacity: 0 },
      ],
      { duration: 620, delay: 420, easing: EASE }
    );
    return () => animacao.cancel();
  }, [p]);

  return (
    <svg viewBox="0 0 120 24" className="h-fig" aria-hidden="true" style={{ overflow: "visible" }}>
      {Array.from({ length: total }, (_, k) => {
        const i = k + 1;
        const feita = i < p;
        return (
          <circle
            key={i}
            cx={xDaCasa(i, total)}
            cy="12"
            r="2.4"
            fill={feita ? "var(--v-acento)" : "none"}
            stroke={feita ? "none" : "var(--v-linha)"}
            strokeWidth=".8"
            style={{ opacity: i === p ? 0 : 1, transition: "opacity 300ms ease" }}
          />
        );
      })}
      <g style={{ transform: `translateX(${x - 4}px)`, transition: `transform 700ms ${EASE}` }}>
        <circle cx="4" cy="12" r="3" fill="var(--v-acento)" />
        <circle
          ref={onda}
          cx="4"
          cy="12"
          r="3"
          fill="none"
          stroke="var(--v-acento)"
          style={{ transformOrigin: "4px 12px", transformBox: "view-box", opacity: 0 }}
        />
      </g>
    </svg>
  );
}

/** A casa (tela 2): pontos, sem cor de vertente — antes da escolha não há mundo. */
function PontosDaCasa({ posicao, total }: { posicao: number; total: number }) {
  return (
    <svg viewBox="0 0 110 10" className="h-fig h-fig-casa" aria-hidden="true">
      {Array.from({ length: total }, (_, k) => {
        const feita = k + 1 <= posicao - 1;
        return (
          <circle
            key={k}
            cx={3 + (k * 104) / Math.max(1, total - 1)}
            cy="5"
            r={feita ? 2 : 1}
            fill={feita ? "var(--v-tinta)" : "var(--v-linha)"}
          />
        );
      })}
    </svg>
  );
}

/**
 * A figura da faixa do topo. No templo, a faixa leva a barra; o templo em si
 * mora no corpo da tela (`Templo`), como no protótipo.
 */
export function FiguraDaFaixa({
  figura,
  posicao,
  total,
}: {
  figura: NomeFigura | null;
  posicao: number;
  total: number;
}) {
  if (figura === "agulha") return <Agulha posicao={posicao} total={total} />;
  if (figura === "toque") return <Toque posicao={posicao} total={total} />;
  if (figura === "templo") return null;
  return <PontosDaCasa posicao={posicao} total={total} />;
}

export function BarraDaFaixa({
  figura,
  posicao,
  total,
}: {
  figura: NomeFigura | null;
  posicao: number;
  total: number;
}) {
  return figura === "templo" ? <BarraDoTemplo posicao={posicao} total={total} /> : null;
}

/** A figura grande do painel de desktop. */
export function FiguraDoPainel({
  figura,
  icone,
  posicao,
  total,
}: {
  figura: NomeFigura | null;
  icone: React.ComponentProps<typeof Icone>["nome"] | null;
  posicao: number;
  total: number;
}) {
  if (figura === "templo") return <Templo posicao={posicao} total={total} grande />;
  // O toque ganha o ícone da cena por cima (a maca, no protótipo); a agulha
  // já é o próprio desenho.
  return (
    <div className="h-painel-figura">
      {icone && figura === "toque" ? <Icone nome={icone} tamanho={72} className="h-painel-icone" /> : null}
      <FiguraDaFaixa figura={figura} posicao={posicao} total={total} />
    </div>
  );
}
