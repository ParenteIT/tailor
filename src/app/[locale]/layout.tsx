import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { idiomaValido, txt } from "@/content/clientes";
import { resolverCliente } from "@/lib/tenants";
import { EstiloDosMundos } from "@/components/holding/estilo-mundos";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cliente = await resolverCliente((await headers()).get("host"));
  const idioma = idiomaValido(locale) ? locale : cliente.idiomaPadrao;
  return {
    title: txt(cliente.textos.meta.titulo, idioma),
    description: txt(cliente.textos.meta.descricao, idioma),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const cliente = await resolverCliente((await headers()).get("host"));

  return (
    <NextIntlClientProvider>
      {/* Os controles do topo agora são de cada página: o diagnóstico da
          holding só tem idioma (os mundos têm cor própria, validada para
          contraste); o modo confirmação legado mantém idioma e tema. */}
      <EstiloDosMundos cliente={cliente} />
      {children}
    </NextIntlClientProvider>
  );
}
