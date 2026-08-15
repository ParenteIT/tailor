"use client";

import { dinheiro, ESTACOES_FITA, type EscalaFita, type EstacaoFita } from "@/lib/gap";

/**
 * A FITA MÉTRICA DA VIRADA — C4
 *
 * É uma régua, não uma projeção. As graduações vêm dos números que ela
 * declarou; o teto é ≈2,5× o preço atual e nunca fica abaixo da meta dela.
 *
 * Duas leituras convivem na mesma fita, e a distinção é deliberada:
 *  - As marcas HOJE e SUA META são aritmética — a posição exata do que ela
 *    declarou na escala dela.
 *  - Os três piquetes das estações mostram onde a jornada de identidade cruza
 *    essa escala. Nenhum deles carrega valor: escrever um preço na estação
 *    final seria prometer que ela chega lá, o que C2 proíbe.
 *
 * Nenhum exemplo fixo existe aqui — a fita não desenha sem os números dela.
 */

const ALTURA = 460;
const MARGEM = 26;

export interface CopyEstacao {
  nome: string;
  ponte: string;
  texto: string;
}

export function FitaMetrica({
  escala,
  estacoes,
  copy,
  rotuloHoje,
  rotuloMeta,
  fecho,
}: {
  escala: EscalaFita;
  estacoes: Record<string, number>;
  copy: Record<EstacaoFita, CopyEstacao>;
  rotuloHoje: string;
  rotuloMeta: string;
  fecho: string;
}) {
  const util = ALTURA - MARGEM * 2;
  const y = (fracao: number) => ALTURA - MARGEM - Math.min(Math.max(fracao, 0), 1) * util;
  const formatar = (v: number) =>
    escala.unidade === "pct" ? `${v}%` : dinheiro(v, escala.moeda);

  return (
    <div className="grid grid-cols-[auto_1fr] gap-p3 sm:gap-p4">
      <svg
        width="112"
        height={ALTURA}
        viewBox={`0 0 112 ${ALTURA}`}
        role="img"
        aria-label={`Fita métrica de ${formatar(escala.minimo)} a ${formatar(escala.teto)}, com sua posição de hoje em ${formatar(escala.hoje.valor)} e sua meta em ${formatar(escala.meta.valor)}.`}
        style={{ overflow: "visible" }}
      >
        {/* A borda da fita. */}
        <line
          x1={92}
          y1={MARGEM}
          x2={92}
          y2={ALTURA - MARGEM}
          stroke="var(--rule-2)"
          strokeWidth={1}
        />

        {/* Graduações — os números dela, não uma escala genérica. */}
        {escala.graduacoes.map((g) => {
          const fracao = escala.teto ? g / escala.teto : 0;
          return (
            <g key={g}>
              <line
                x1={80}
                y1={y(fracao)}
                x2={92}
                y2={y(fracao)}
                stroke="var(--rule-2)"
                strokeWidth={1}
              />
              <text
                x={74}
                y={y(fracao) + 3.5}
                textAnchor="end"
                fill="var(--ink-3)"
                style={{
                  fontFamily: "var(--font-rigor)",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                }}
              >
                {formatar(g)}
              </text>
            </g>
          );
        })}

        {/* Onde ela está — aritmética. */}
        <Marca
          y={y(escala.hoje.posicao)}
          rotulo={rotuloHoje}
          valor={formatar(escala.hoje.valor)}
          cor="var(--ink-2)"
        />

        {/* A meta que ela declarou — aritmética. */}
        <Marca
          y={y(escala.meta.posicao)}
          rotulo={rotuloMeta}
          valor={formatar(escala.meta.valor)}
          cor="var(--color-gold)"
        />

        {/* Os piquetes das estações — identidade, sem valor. */}
        {ESTACOES_FITA.map((chave) => (
          <line
            key={chave}
            x1={92}
            y1={y(estacoes[chave] ?? 0)}
            x2={104}
            y2={y(estacoes[chave] ?? 0)}
            stroke="var(--accent)"
            strokeWidth={1}
          />
        ))}
      </svg>

      <ol className="flex flex-col justify-between gap-p4">
        {ESTACOES_FITA.map((chave, i) => (
          <li key={chave}>
            <p className="notacao mb-p1">
              {String(i + 1).padStart(2, "0")} · {copy[chave].ponte}
            </p>
            <h3 className="mb-p1">{copy[chave].nome}</h3>
            <p style={{ color: "var(--ink-2)", fontSize: "var(--text-apoio)" }}>
              {copy[chave].texto}
            </p>
          </li>
        ))}
      </ol>

      <p
        className="col-span-2 mt-p3"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(1.15rem, 4.6vw, 1.5rem)",
          lineHeight: 1.35,
          color: "var(--color-gold-hi)",
        }}
      >
        {fecho}
      </p>
    </div>
  );
}

function Marca({
  y,
  rotulo,
  valor,
  cor,
}: {
  y: number;
  rotulo: string;
  valor: string;
  cor: string;
}) {
  return (
    <g>
      <line x1={86} y1={y} x2={98} y2={y} stroke={cor} strokeWidth={2} />
      <text
        x={74}
        y={y - 6}
        textAnchor="end"
        fill={cor}
        style={{
          fontFamily: "var(--font-rigor)",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {rotulo}
      </text>
      <text
        x={74}
        y={y + 9}
        textAnchor="end"
        fill={cor}
        style={{ fontFamily: "var(--font-display)", fontSize: 14 }}
      >
        {valor}
      </text>
    </g>
  );
}
