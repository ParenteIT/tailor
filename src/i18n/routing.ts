import { defineRouting } from "next-intl/routing";

/**
 * PT-BR é a versão canônica e a única de fato escrita nesta rodada.
 * EN/FR ficam esqueletados até a Consultoria abrir formalmente para o público
 * internacional — ver tailor-spec.md §5.
 *
 * Pendência aberta lá e ainda não decidida: em qual moeda mostrar a
 * calculadora do gap para um lead que responde em EN/FR (BRL fixo, ou
 * EUR/USD conforme o locale). Não inventar a resposta aqui.
 */
export const routing = defineRouting({
  locales: ["pt", "en", "fr"],
  defaultLocale: "pt",
});

export type Locale = (typeof routing.locales)[number];
