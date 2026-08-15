"use client";

import { useState } from "react";
import { dinheiro, type Gap } from "@/lib/gap";
import type { Moeda } from "@/content/config";

/**
 * O comparador Hoje / Futuro.
 *
 * No mundo da folha de molde, isto é a peça dobrada sobre si mesma: uma linha
 * de corte que ela arrasta para ver os dois lados da mesma pessoa. Tudo o que
 * aparece dos dois lados saiu dela — a citação é o que ela escreveu, os números
 * são os que ela arrastou, as palavras são as que ela escolheu.
 */
export function Comparador({
  verbatim,
  palavras,
  gap,
  rotuloHoje,
  rotuloFuturo,
  instrucao,
  fixo,
  moeda,
}: {
  verbatim: string;
  palavras: string[];
  gap: Gap | null;
  rotuloHoje: string;
  rotuloFuturo: string;
  instrucao?: string;
  fixo?: number;
  /** Em qual moeda ela declarou — ver content/config.ts. */
  moeda: Moeda;
}) {
  const [corte, setCorte] = useState(fixo ?? 50);
  const fmt = (v: number) => dinheiro(v, moeda);
  const arrastavel = fixo === undefined;

  return (
    <div>
      <div
        className="relative overflow-hidden"
        style={{
          border: "1px solid var(--rule-2)",
          borderRadius: 2,
          minHeight: 300,
        }}
      >
        <Painel
          rotulo={rotuloFuturo}
          alinhamento="right"
          fundo="color-mix(in srgb, var(--color-terra) 14%, var(--surface))"
        >
          {palavras.length ? (
            <ul className="space-y-p1">
              {palavras.map((p) => (
                <li
                  key={p}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem, 6vw, 2rem)",
                    lineHeight: 1.15,
                  }}
                >
                  {p}
                </li>
              ))}
            </ul>
          ) : null}
          {gap?.trilha === "precificacao" ? (
            <p className="medida notacao mt-p3">{fmt(gap.precoDesejado)}</p>
          ) : null}
          {gap?.trilha === "guarda_roupa" ? (
            <p className="medida notacao mt-p3">100%</p>
          ) : null}
        </Painel>

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - corte}% 0 0)` }}
        >
          <Painel rotulo={rotuloHoje} alinhamento="left" fundo="var(--surface)">
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(1.05rem, 4.4vw, 1.3rem)",
                lineHeight: 1.4,
                color: "var(--ink-2)",
              }}
            >
              {verbatim ? `“${verbatim}”` : ""}
            </p>
            {gap?.trilha === "precificacao" ? (
              <p className="medida notacao mt-p3">{fmt(gap.precoAtual)}</p>
            ) : null}
            {gap?.trilha === "guarda_roupa" ? (
              <p className="medida notacao mt-p3">{gap.pctUsado}%</p>
            ) : null}
          </Painel>
        </div>

        {/* A linha de corte. */}
        <span
          className="pointer-events-none absolute top-0 bottom-0 w-px"
          style={{ left: `${corte}%`, background: "var(--accent)" }}
          aria-hidden
        />

        {arrastavel ? (
          <input
            type="range"
            min={0}
            max={100}
            value={corte}
            onChange={(e) => setCorte(Number(e.target.value))}
            aria-label={instrucao}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            // O input cobre o cartão inteiro; sem pan-y ele disputa o gesto
            // de rolagem vertical no iOS bem onde ela precisa descer ao CTA.
            style={{ touchAction: "pan-y" }}
          />
        ) : null}
      </div>
      {instrucao && arrastavel ? (
        <p className="notacao mt-p2">{instrucao}</p>
      ) : null}
    </div>
  );
}

function Painel({
  rotulo,
  alinhamento,
  fundo,
  children,
}: {
  rotulo: string;
  alinhamento: "left" | "right";
  fundo: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-full min-h-[300px] flex-col justify-center p-p3"
      style={{ background: fundo, textAlign: alinhamento }}
    >
      <p className="notacao mb-p2">{rotulo}</p>
      {children}
    </div>
  );
}
