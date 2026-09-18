import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ControlesTopo } from "@/components/controles-topo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  const t = await getTranslations({ locale, namespace: "controles" });

  return (
    <NextIntlClientProvider>
      {/* Pílulas de idioma e tema no topo, no fluxo da página (não fixas) —
          nunca mais sobre o texto das opções. */}
      <ControlesTopo
        textos={{
          idioma: t("idioma"),
          tema: t("tema"),
          claro: t("claro"),
          escuro: t("escuro"),
        }}
      />
      {children}
    </NextIntlClientProvider>
  );
}
