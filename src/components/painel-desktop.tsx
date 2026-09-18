"use client";

/**
 * O painel de desktop — mecanismo F (P2), 18/09/2026. Em telas ≥1024px o
 * conteúdo do quiz fica centralizado numa coluna de ~680px com metade da
 * tela vazia dos dois lados; a auditoria de 17/09 apontou isso como
 * oportunidade desperdiçada. A resposta: um painel à direita (o espelho da
 * coluna de costura, que fica à esquerda) com peças de molde entrando
 * conforme o progresso avança — na última peça, as seis formas já compõem o
 * contorno de uma peça de roupa simples.
 *
 * SVG puro, não Three.js — o próprio prompt vetou WebGL nesta fase: o mesmo
 * efeito perceptível por uma fração do peso de bundle e do risco de
 * performance em celular médio, que é a maioria do público. Fica escondido
 * abaixo de `lg` (1024px) inteiro — não é um componente que se adapta, é um
 * componente que só existe quando sobra tela.
 *
 * Mesma disciplina de linha do resto do sistema: só contorno, nunca
 * preenchimento; `--rule`/`--accent`, nenhuma cor nova. Cada peça usa
 * `cena-pop` (globals.css) — o mesmo pop curto e não repetido das cenas
 * ilustradas do quiz — na primeira vez que o progresso cruza o marco dela;
 * depois disso fica parada, só a cor muda de `--rule` pra `--accent`.
 */

interface Peca {
  /** Marco de PROGRESSO (0–100) a partir do qual esta peça acende. */
  marco: number;
  /** Path da peça — formas simples de molde (colarinho, manga, corpo, saia,
      bainha), não recortes de costura reais. */
  d: string;
}

const PECAS: Peca[] = [
  { marco: 15, d: "M118 18 L182 18 L170 52 L130 52 Z" }, // gola
  { marco: 33, d: "M46 66 L118 52 L118 148 L62 168 Z" }, // manga esquerda
  { marco: 52, d: "M254 66 L182 52 L182 148 L238 168 Z" }, // manga direita
  { marco: 72, d: "M118 52 L182 52 L192 216 L108 216 Z" }, // corpo
  { marco: 94, d: "M108 216 L192 216 L216 372 L84 372 Z" }, // saia
  { marco: 100, d: "M84 372 L216 372 L207 402 L93 402 Z" }, // bainha
];

export function PainelDesktop({
  progresso,
  rotulo,
}: {
  progresso: number;
  rotulo: string;
}) {
  return (
    <div
      aria-hidden
      role="img"
      aria-label={rotulo}
      className="pointer-events-none fixed top-0 right-0 bottom-0 z-30 hidden w-[280px] items-center justify-center min-[1120px]:flex"
    >
      <svg viewBox="0 0 300 420" width="220" height="308">
        {PECAS.map((peca, i) => {
          const acesa = progresso >= peca.marco;
          return (
            <path
              key={i}
              d={peca.d}
              fill="var(--accent)"
              fillOpacity={acesa ? 0.12 : 0}
              stroke={acesa ? "var(--accent)" : "var(--rule)"}
              strokeWidth={acesa ? 1.75 : 1}
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={acesa ? 1 : undefined}
              style={
                {
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transition: "stroke 500ms ease, fill-opacity 900ms ease",
                  // A peça se desenha (tracar) e assenta com o pop de sempre.
                  "--traco": 1,
                  animation: acesa
                    ? "tracar 1100ms cubic-bezier(0.16, 1, 0.3, 1) both, cena-pop 700ms cubic-bezier(0.16, 1, 0.3, 1) both"
                    : undefined,
                } as React.CSSProperties
              }
            />
          );
        })}
      </svg>
    </div>
  );
}
