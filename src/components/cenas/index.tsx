"use client";

/* ==========================================================================
   CENAS — ponto único de importação.

   As cinco cenas em SVG (armário, etiquetas, escala de preço, agenda, marco
   de prazo) só entram no bundle do cliente quando a pergunta correspondente
   é de fato alcançada — `next/dynamic` faz o code-splitting por trás de cada
   `import()`. As duas mais leves (a composição tipográfica das palavras e o
   balão do investimento) não têm SVG nem peso relevante e ficam diretas.
   ========================================================================= */

import dynamic from "next/dynamic";
import { Reservado } from "./base";

export const CenaArmario = dynamic(() => import("./armario"), {
  loading: () => <Reservado altura={72} />,
});

/** Protótipo em avaliação (07/09/2026) — ver armario-cartoon.tsx. */
export const CenaArmarioCartoon = dynamic(() => import("./armario-cartoon"), {
  loading: () => <Reservado altura={168} />,
});

export const CenaEtiquetas = dynamic(() => import("./etiquetas"), {
  loading: () => <Reservado altura={72} />,
});

export const CenaEscalaPreco = dynamic(() => import("./escala-preco"), {
  loading: () => <Reservado altura={72} />,
});

export const CenaAgenda = dynamic(() => import("./agenda"), {
  loading: () => <Reservado altura={72} />,
});

export const CenaMarcoPrazo = dynamic(() => import("./marco-prazo"), {
  loading: () => <Reservado altura={56} />,
});

export { ComposicaoPalavras } from "./composicao-palavras";
export { BalaoInvestimento } from "./balao";
