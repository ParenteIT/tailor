import type { NomeIcone } from "@/content/clientes/esquema";

/**
 * O catálogo de ícones que a configuração de um cliente pode citar pelo nome.
 * Só traço, sem preenchimento (exceto os pontos), `currentColor` sempre: a cor
 * é do mundo, nunca do ícone. Desenhos do protótipo aprovado de 22/09/2026;
 * `tela` foi acrescentado porque o protótipo o citava sem desenhá-lo.
 *
 * Vetos do handoff §8: nenhum ícone de pessoa, gráfico de barras, folha ou
 * manequim entra aqui.
 */
const TRACO = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.15,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const DESENHOS: Record<NomeIcone, React.ReactNode> = {
  agulha: (
    <>
      <path d="M4.5 19.5 18 6" {...TRACO} strokeWidth={1.25} />
      <ellipse cx="19.2" cy="4.8" rx="1.6" ry="1" transform="rotate(-45 19.2 4.8)" {...TRACO} strokeWidth={1.1} />
    </>
  ),
  templo: (
    <path
      d="M3 20.5h18M4.5 18.5h15M6 18.5v-8M10 18.5v-8M14 18.5v-8M18 18.5v-8M4.5 10.5h15M4 8.5 12 3.5l8 5z"
      {...TRACO}
    />
  ),
  maca: (
    <path
      d="M3 10.5h18v2.6H3zM5.5 13.1v6.4M18.5 13.1v6.4M8.5 13.1v3.6M15.5 13.1v3.6M4.5 10.5c.4-1.5 1.5-2.2 3-2.2"
      {...TRACO}
    />
  ),
  pontos: (
    <>
      <circle cx="6" cy="12" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      <circle cx="18" cy="12" r="1.3" fill="currentColor" />
    </>
  ),
  linha: <path d="M3 15c3-5 6 3 9-1s5-6 9-3" {...TRACO} />,
  alfinete: (
    <>
      <circle cx="12" cy="5.5" r="2.3" {...TRACO} />
      <path d="M12 7.8v13" {...TRACO} />
    </>
  ),
  carretel: <path d="M6.5 4h11M6.5 20h11M8 4v16M16 4v16M8 8h8M8 11h8M8 14h8M8 17h8" {...TRACO} strokeWidth={1.1} />,
  prumo: (
    <>
      <path d="M12 2.5v11" {...TRACO} strokeWidth={1.1} />
      <path d="M9 13.5h6l-3 7.5z" {...TRACO} />
    </>
  ),
  cota: <path d="M3 12h18M3 8.5v7M21 8.5v7M6 10l-3 2 3 2M18 10l3 2-3 2" {...TRACO} strokeWidth={1.1} />,
  toque: (
    <>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="5.5" {...TRACO} strokeWidth={1.05} opacity={0.7} />
      <circle cx="12" cy="12" r="9" {...TRACO} strokeWidth={1} opacity={0.4} />
    </>
  ),
  aspas: (
    <>
      <path d="M5 17c0-4 1-7 5-9M13 17c0-4 1-7 5-9" {...TRACO} strokeWidth={1.2} />
      <circle cx="7" cy="17" r="2" {...TRACO} strokeWidth={1.1} />
      <circle cx="15" cy="17" r="2" {...TRACO} strokeWidth={1.1} />
    </>
  ),
  doc: <path d="M6 3.5h8l4 4v13H6z M14 3.5v4h4 M9 12h6M9 15h6M9 18h3" {...TRACO} />,
  alvo: (
    <>
      <circle cx="12" cy="12" r="8.5" {...TRACO} strokeWidth={1.1} />
      <circle cx="12" cy="12" r="5" {...TRACO} strokeWidth={1.1} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  interroga: (
    <>
      <path d="M9 9a3 3 0 1 1 4.2 2.8c-.8.4-1.2 1-1.2 1.9v.8" {...TRACO} strokeWidth={1.2} />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="9.5" {...TRACO} strokeWidth={1} opacity={0.55} />
    </>
  ),
  chat: <path d="M4 12a8 8 0 1 1 3.6 6.7L4 20l1.3-3.5A7.9 7.9 0 0 1 4 12z" {...TRACO} />,
  envelope: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="1" {...TRACO} />
      <path d="m4 7 8 6 8-6" {...TRACO} />
    </>
  ),
  tela: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" {...TRACO} />
      <path d="M10.5 18.5h3" {...TRACO} />
    </>
  ),
};

export function Icone({
  nome,
  tamanho = 22,
  className,
}: {
  nome: NomeIcone;
  tamanho?: number;
  className?: string;
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={{ flex: "none" }}
    >
      {DESENHOS[nome]}
    </svg>
  );
}

export function SetaAvancar() {
  return (
    <svg width="16" height="8" viewBox="0 0 16 8" aria-hidden="true" style={{ flex: "none" }}>
      <path d="M0 4h14.5M11.5 1l3 3-3 3" {...TRACO} strokeWidth={1.1} />
    </svg>
  );
}
