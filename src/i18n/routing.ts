import { defineRouting } from "next-intl/routing";

/**
 * EN é o idioma padrão e PT-BR o segundo (decisão de 20/09/2026, handoff da
 * holding §9.9). O francês saiu.
 *
 * O texto do diagnóstico da holding não mora em messages/: vem da
 * configuração do cliente (`src/content/clientes/`), que exige cada texto
 * nestes mesmos idiomas. messages/ segue servindo a proposta e o modo
 * confirmação legado.
 *
 * `localeDetection` fica explícito, mesmo sendo o padrão do next-intl: na
 * primeira visita sem prefixo de idioma o middleware lê o `Accept-Language` do
 * navegador e o cookie `NEXT_LOCALE`, e redireciona para `/<locale>/…`. O
 * seletor de idioma no topo é o override manual quando a detecção erra.
 */
export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "en",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
