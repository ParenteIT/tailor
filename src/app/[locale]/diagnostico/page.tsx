import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { idiomaValido } from "@/content/clientes";
import { resolverCliente } from "@/lib/tenants";
import { QuizHolding } from "@/components/holding/quiz-holding";

export default async function Diagnostico({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!idiomaValido(locale)) notFound();
  setRequestLocale(locale);
  const cliente = await resolverCliente((await headers()).get("host"));
  return <QuizHolding idioma={locale} cliente={cliente} />;
}
