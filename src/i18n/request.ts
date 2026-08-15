import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Dicionario = { [key: string]: unknown };

/**
 * PT-BR é a base. EN/FR são sobreposições parciais: o que ainda não foi
 * traduzido cai no português em vez de quebrar a página com chave ausente.
 * Isso mantém os dois locales navegáveis enquanto a tradução não existe —
 * e deixa visível, na própria tela, o que falta traduzir.
 */
function sobrepor(base: Dicionario, cima: Dicionario): Dicionario {
  const saida: Dicionario = { ...base };
  for (const [chave, valor] of Object.entries(cima)) {
    const atual = saida[chave];
    if (
      valor &&
      typeof valor === "object" &&
      !Array.isArray(valor) &&
      atual &&
      typeof atual === "object" &&
      !Array.isArray(atual)
    ) {
      saida[chave] = sobrepor(atual as Dicionario, valor as Dicionario);
    } else {
      saida[chave] = valor;
    }
  }
  return saida;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const base = (await import("../../messages/pt.json")).default as Dicionario;
  if (locale === "pt") return { locale, messages: base };

  const overlay = (await import(`../../messages/${locale}.json`))
    .default as Dicionario;

  return { locale, messages: sobrepor(base, overlay) };
});
