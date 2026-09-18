/**
 * Ícones do seletor de tema (`controles-topo.tsx`). O tema é uma preferência
 * persistente e sempre visível desde 19/09/2026 — o "peek" do mecanismo D
 * (18/09) foi revertido por decisão do Willian.
 */
export function IconeSol() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

export function IconeLua() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor" />
    </svg>
  );
}

/** Chave de localStorage do tema (valor "claro"; ausente = escuro). O script
    inline do layout raiz lê a mesma chave antes do primeiro paint. */
export const CHAVE_TEMA_PERSISTENTE = "tailor:tema";
