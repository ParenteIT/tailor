/**
 * Peças reaproveitadas pelos controles do topo (`controles-topo.tsx`) — a bandeira
 * SVG de cada idioma. Deixou de existir como nav fixa própria: o menu de
 * idioma/tema virou um único pino ancorado à coluna de costura, não dois
 * controles soltos disputando canto de tela (era o bug de sobreposição sobre
 * as opções de resposta, achado na auditoria de 17/09/2026).
 *
 * Bandeira como SVG desenhado, não caractere emoji (`🇧🇷`/`🇺🇸`): fonte de
 * emoji regional-indicator não é garantida — o Windows historicamente mostra
 * as duas letras do país em vez da bandeira composta. Simplificada de
 * propósito (sem brasão, sem estrelas individuais). `aria-hidden`: o rótulo
 * acessível vive no texto visível ao lado — bandeira nunca é o único
 * identificador.
 *
 * DESVIO REGISTRADO do BRAND-VISUAL §8 (cor fora do ouro/acentos de persona,
 * sob 3% de área): decisão consciente do Willian (11/09/2026), pendente
 * registrar no BRAND-VISUAL pelo protocolo §10 se ficar.
 */
export function Bandeira({ loc }: { loc: string }) {
  const comum = { width: 18, height: 13, viewBox: "0 0 18 13", "aria-hidden": true as const };
  const moldura = { stroke: "var(--rule-2)", strokeWidth: 0.6, fill: "none" };

  if (loc === "pt") {
    return (
      <svg {...comum}>
        <rect width="18" height="13" fill="#2e8f4f" />
        <path d="M9 1.6 16.6 6.5 9 11.4 1.4 6.5Z" fill="#f2c94c" />
        <circle cx="9" cy="6.5" r="2.3" fill="#2b5faa" />
        <rect width="18" height="13" {...moldura} />
      </svg>
    );
  }
  if (loc === "fr") {
    return (
      <svg {...comum}>
        <rect width="6" height="13" fill="#2b5faa" />
        <rect x="6" width="6" height="13" fill="#f4f1ea" />
        <rect x="12" width="6" height="13" fill="#c1443c" />
        <rect width="18" height="13" {...moldura} />
      </svg>
    );
  }
  if (loc !== "en") {
    // Idioma sem bandeira desenhada: quadro neutro, nunca a de outro país.
    // Para acrescentar uma língua: routing.ts, messages/<loc>.json,
    // NOMES_IDIOMA aqui e a bandeira acima.
    return (
      <svg {...comum}>
        <rect width="18" height="13" fill="none" />
        <rect width="18" height="13" {...moldura} />
      </svg>
    );
  }
  // en — EUA: listras simplificadas (5, não 13) + cantão com grade de pontos
  // no lugar das 50 estrelas. Padrão reconhecível, não o pavilhão exato.
  return (
    <svg {...comum}>
      <rect width="18" height="13" fill="#f4f1ea" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} y={(i * 13) / 5} width="18" height={13 / 10} fill="#c1443c" />
      ))}
      <rect width="8" height="7" fill="#2b5faa" />
      {[0, 1].flatMap((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={1.6 + col * 2.4}
            cy={1.8 + row * 3}
            r="0.5"
            fill="#f4f1ea"
          />
        ))
      )}
      <rect width="18" height="13" {...moldura} />
    </svg>
  );
}

/** Nome de cada idioma na própria língua — igual nos três arquivos de mensagem. */
export const NOMES_IDIOMA: Record<string, string> = {
  pt: "Português",
  en: "English",
  fr: "Français",
};

