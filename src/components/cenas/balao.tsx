"use client";

/**
 * O balão da Etapa 8 (Q9 — investimento).
 *
 * Balão de PENSAMENTO (nuvem arredondada + duas bolhas descendo até a opção
 * marcada), não balão de fala: quem está pensando é ela, não a Renilza — a
 * frase acompanha a faixa que ela acabou de marcar em vez de responder por
 * cima dela.
 *
 * A frase muda por faixa desde 07/09/2026 (antes eram só duas: uma genérica e
 * a de "prefiro não dizer"). O que cada uma diz é a PROFUNDIDADE do percurso
 * que aquela faixa abre — a esteira real é uma escada documentada (Jornada →
 * Dossiê → Prisma, ver content/config.ts). O que nenhuma delas faz:
 * - prometer entregável ou escopo (o escopo de cada produto não está
 *   documentado em lugar nenhum deste repo; inventar seria fabricar oferta);
 * - prometer retorno financeiro (C2 do Conselho);
 * - associar faixa maior a coragem, mérito ou autoestima — a tela anterior é
 *   uma confissão, e a crença documentada da Patrícia no PRODUCT.md é
 *   literalmente "não mereço investir em mim".
 * O tamanho e a intensidade visual são idênticos em todas as faixas de
 * propósito: só o texto muda.
 */
export function BalaoInvestimento({ texto }: { texto: string }) {
  return (
    <div className="surgir relative mt-p4 mb-p2 inline-block max-w-[38ch] pl-p3">
      {/* As duas bolhas do pensamento, descendo até a opção marcada. */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          left: 14,
          top: -9,
          width: 9,
          height: 9,
          border: "1px solid var(--rule-2)",
          background: "var(--surface)",
        }}
      />
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          left: 4,
          top: -2,
          width: 5,
          height: 5,
          border: "1px solid var(--rule-2)",
          background: "var(--surface)",
        }}
      />
      <p
        className="px-p3 py-p2"
        style={{
          border: "1px solid var(--rule-2)",
          borderRadius: 20,
          background: "var(--surface)",
          color: "var(--ink-2)",
          fontSize: "var(--text-apoio)",
          lineHeight: 1.5,
        }}
      >
        {texto}
      </p>
    </div>
  );
}
