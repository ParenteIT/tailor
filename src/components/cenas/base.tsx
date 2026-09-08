/* ==========================================================================
   CENAS — primitivas compartilhadas.

   Ilustrações reativas às respostas do quiz (Bloco "Fita métrica" da Etapa 3
   e vizinhos). Mesma disciplina do resto do sistema: traço, nunca
   preenchimento; cor nunca é o único sinal (o estado "aceso" também muda de
   traço sólido para tracejado, como toda "linha de costura → linha de corte"
   do `molde.tsx`); nenhuma delas é a fonte da verdade — o número ao lado
   sempre é exato, a ilustração é esquemática.

   Decorativas por padrão (`aria-hidden`): a informação que carregam já existe
   em texto ao lado (o valor formatado da `ReguaMedida`, a opção marcada na
   `LinhaOpcao`). Nenhuma cena aqui é a única portadora de um dado.
   ========================================================================= */

import type { CSSProperties } from "react";

/** Espaço reservado com a altura final da cena — evita layout shift enquanto
    o chunk lazy carrega, e é o próprio fallback do `next/dynamic`. */
export function Reservado({
  altura,
  className,
}: {
  altura: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ height: altura, width: "100%" }}
    />
  );
}

export const ALTURA_CENA = 72;
export const ALTURA_CENA_DESKTOP = 96;

/** Contêiner comum: reserva altura, nunca intercepta toque, nunca é a única
    portadora da informação. */
export function CenaContainer({
  altura = ALTURA_CENA,
  children,
  className,
}: {
  altura?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ height: altura, width: "100%" }}
    >
      {children}
    </div>
  );
}

export const TRANSICAO_TRACO = "stroke 220ms ease, opacity 220ms ease";
export const TRANSICAO_TRACO_LONGA = "stroke 380ms cubic-bezier(0.16,1,0.3,1), opacity 380ms cubic-bezier(0.16,1,0.3,1)";

/**
 * Um segmento esquemático: traço sólido "aceso" (cor de acento) ou tracejado
 * "latente/apagado" (mesma gramática de `.linha-costura`/`.linha-corte`).
 * O `strokeDasharray` muda junto da cor — dois sinais, nunca cor sozinha.
 */
export function segmentoEstilo(aceso: boolean, latente: boolean): CSSProperties {
  if (latente) {
    return {
      stroke: "var(--rule-2)",
      strokeDasharray: "2 3",
      opacity: 0.7,
      transition: TRANSICAO_TRACO,
    };
  }
  return {
    stroke: aceso ? "var(--accent)" : "var(--ink-3)",
    strokeDasharray: aceso ? "none" : "2 3",
    opacity: 1,
    transition: TRANSICAO_TRACO,
  };
}
