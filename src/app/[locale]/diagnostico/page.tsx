import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { idiomaValido } from "@/content/clientes";
import { QuizHolding } from "@/components/holding/quiz-holding";

export default async function Diagnostico({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!idiomaValido(locale)) notFound();
  setRequestLocale(locale);
  return <QuizHolding idioma={locale} />;
}
