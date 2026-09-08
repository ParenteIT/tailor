"use client";

import { dinheiro, type Gap } from "@/lib/gap";
import type { Moeda } from "@/content/config";
import { ComposicaoPalavras } from "@/components/cenas";

/**
 * O comparador Hoje / Futuro.
 *
 * No mundo da folha de molde, isto é a peça dobrada sobre si mesma: os dois
 * lados da mesma pessoa, um em cima do outro, com a linha de corte no meio.
 *
 * **Era horizontal e arrastável até 08/09/2026.** A dobra virou vertical
 * quando o resumo completo passou a morar dentro do cartão, e o motivo é de
 * UX, não de gosto:
 * - `clip-path` corta a PINTURA, não o layout, então texto longo era fatiado
 *   no meio da palavra na linha do corte;
 * - para ler tudo de um lado ela teria que arrastar até 100%, o que esconde o
 *   outro lado inteiro e mata justamente a comparação que o cartão existe
 *   para fazer;
 * - prendia conteúdo atrás de um gesto que teclado e leitor de tela não
 *   executam, contra a própria regra de "não exigir arrastar para acessar
 *   informação essencial";
 * - arrasto horizontal no celular disputava o scroll vertical (o código
 *   precisava de `touch-action: pan-y` só para não roubar a rolagem).
 *
 * Tudo o que aparece nos dois lados saiu dela: a citação é o que ela
 * escreveu, os números são os que ela arrastou, as frases são leitura do que
 * ela declarou, nunca projeção.
 */
export function Comparador({
  verbatim,
  palavras,
  gap,
  rotuloHoje,
  rotuloFuturo,
  leituraHoje,
  leituraFuturo,
  moeda,
}: {
  verbatim: string;
  palavras: string[];
  gap: Gap | null;
  rotuloHoje: string;
  rotuloFuturo: string;
  /** A leitura do que ela contou, em prosa. Uma frase por item declarado. */
  leituraHoje?: string[];
  leituraFuturo?: string[];
  /** Em qual moeda ela declarou — ver content/config.ts. */
  moeda: Moeda;
}) {
  const fmt = (v: number) => dinheiro(v, moeda);
  const temLeituraHoje = Boolean(leituraHoje?.length);
  const temLeituraFuturo = Boolean(leituraFuturo?.length);

  return (
    <div
      style={{
        border: "1px solid var(--rule-2)",
        borderRadius: "var(--radius-cta)",
        overflow: "hidden",
      }}
    >
      {/* Revelação em sequência, não simultânea: Hoje primeiro (a peça como
          ela chegou), a linha se risca (a virada), Futuro por último (a
          decisão). Mesmo ritmo do "traçado do giz" do resto do sistema —
          nunca um efeito solto, um momento autorado. `prefers-reduced-motion`
          zera tudo isso pela regra global; o conteúdo aparece completo. */}
      <Painel rotulo={rotuloHoje} fundo="var(--surface)" className="surgir">
        {verbatim ? (
          <p
            className="mb-p3"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1.05rem, 4.4vw, 1.3rem)",
              lineHeight: 1.4,
              color: "var(--ink)",
            }}
          >
            “{verbatim}”
          </p>
        ) : null}
        <Leitura frases={leituraHoje} />
        {/* O número solto só aparece quando NÃO há prosa: no Pico a leitura já
            diz "você cobra R$ 900 hoje" com contexto, e repetir o número puro
            embaixo era eco. Na proposta (`p/[token]`), que monta o cartão sem
            leitura, ele continua sendo a única medida na tela. */}
        {!temLeituraHoje && gap?.trilha === "precificacao" ? (
          <p className="medida notacao mt-p3">{fmt(gap.precoAtual)}</p>
        ) : null}
        {!temLeituraHoje && gap?.trilha === "guarda_roupa" ? (
          <p className="medida notacao mt-p3">{gap.pctUsado}%</p>
        ) : null}
      </Painel>

      {/* A linha de corte: a dobra entre as duas metades. */}
      <span
        className="traco-corte block h-px w-full"
        style={{ background: "var(--accent)", animationDelay: "480ms" }}
        aria-hidden
      />

      <Painel
        rotulo={rotuloFuturo}
        fundo="color-mix(in srgb, var(--color-terra) 14%, var(--surface))"
        className="surgir"
        estilo={{ animationDelay: "760ms" }}
      >
        {/* A composição reúne só o que ela escolheu: cada palavra é uma marca
            real da Etapa 5, nenhuma é enfeite. */}
        <ComposicaoPalavras palavras={palavras} />
        <div className={palavras.length ? "mt-p3" : undefined}>
          <Leitura frases={leituraFuturo} />
        </div>
        {!temLeituraFuturo && gap?.trilha === "precificacao" ? (
          <p className="medida notacao mt-p3">{fmt(gap.precoDesejado)}</p>
        ) : null}
        {/* Guarda-roupa não tem meta declarada por ela (só o que já usa hoje).
            Um número fixo aqui seria prometer um resultado, o que C2 proíbe. */}
      </Painel>
    </div>
  );
}

function Leitura({ frases }: { frases?: string[] }) {
  if (!frases || frases.length === 0) return null;
  return (
    <div>
      {frases.map((frase) => (
        <p key={frase} className="mb-p1" style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
          {frase}
        </p>
      ))}
    </div>
  );
}

function Painel({
  rotulo,
  fundo,
  children,
  className,
  estilo,
}: {
  rotulo: string;
  fundo: string;
  children: React.ReactNode;
  className?: string;
  /** Só para o `animationDelay` do escalonamento — nunca posição ou cor. */
  estilo?: React.CSSProperties;
}) {
  return (
    <div className={`p-p3 ${className ?? ""}`} style={{ background: fundo, ...estilo }}>
      <p className="notacao mb-p2">{rotulo}</p>
      {children}
    </div>
  );
}
