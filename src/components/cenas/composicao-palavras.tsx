"use client";

/**
 * A composição tipográfica das palavras-identidade (Etapa 5 e reaproveitada
 * no painel "Futuro" do Comparador — Pico). Sempre as mesmas 2–3 palavras que
 * ela escolheu, em Cormorant itálico, com leve escalonamento — a primeira
 * marcada é a mais grave, como assinatura, não como ranking.
 *
 * `decorativa`: quando as mesmas palavras já existem em texto acessível ao
 * lado (a grade de botões da Etapa 5), isto é só reforço visual e some do
 * leitor de tela. No painel Futuro do Comparador, onde esta composição É o
 * conteúdo (não existe outro texto com as palavras), `decorativa` fica de
 * fora — leitura normal.
 */
export function ComposicaoPalavras({
  palavras,
  decorativa,
}: {
  palavras: string[];
  decorativa?: boolean;
}) {
  if (palavras.length === 0) return null;
  const tamanhos = [
    "clamp(1.5rem, 7vw, 2.1rem)",
    "clamp(1.2rem, 5.5vw, 1.6rem)",
    "clamp(1.05rem, 4.6vw, 1.35rem)",
  ];
  return (
    // Fluxo inline de propósito, nunca flex: o alinhamento (esquerda no
    // painel "Hoje/Futuro" do Comparador é herdado via `text-align` do
    // container-pai — flex ignora `text-align` e fazia as palavras vazarem
    // para fora do painel, sobre o texto do lado oposto. `<span>` inline com
    // quebra normal de texto respeita o alinhamento herdado, como qualquer
    // outro texto do sistema.
    <p aria-hidden={decorativa} className="surgir" style={{ lineHeight: 1.3 }}>
      {palavras.map((p, i) => (
        <span
          key={`${p}-${i}`}
          style={{
            display: "inline-block",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: tamanhos[Math.min(i, tamanhos.length - 1)],
            color: i === 0 ? "var(--ink)" : "var(--ink-2)",
            marginInlineEnd: "var(--spacing-p3)",
          }}
        >
          {p}
        </span>
      ))}
    </p>
  );
}
