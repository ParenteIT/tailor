import { defineRouting } from "next-intl/routing";

/**
 * PT-BR é a versão canônica. EN e FR são traduções completas do copy deck
 * (messages/en.json, messages/fr.json) — o overlay de request.ts só entra em
 * ação para chave nova ainda não traduzida.
 *
 * `localeDetection` fica explícito, mesmo sendo o padrão do next-intl: na
 * primeira visita sem prefixo de idioma o middleware lê o `Accept-Language` do
 * navegador e o cookie `NEXT_LOCALE`, e redireciona para `/<locale>/…`. O
 * SeletorIdioma no topo do quiz é o override manual quando a detecção erra.
 *
 * Moeda por idioma: BRL no pt-BR, USD no en/fr, sem conversão (decisão do
 * Willian, 13/08/2026 — ver content/config.ts). As faixas da Q9 em en/fr são
 * qualitativas de propósito: não há preço em dólar declarado para os produtos
 * da esteira, e o produto não exibe número que ninguém declarou.
 */
export const routing = defineRouting({
  locales: ["pt", "en", "fr"],
  defaultLocale: "pt",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
