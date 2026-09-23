import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CLIENTE, idiomaValido } from "@/content/clientes";
import { QuizHolding } from "@/components/holding/quiz-holding";

/**
 * Entrada direta por campanha (aprovada no handoff §2): `/v/<vertente>` pede
 * o nome e abre direto na primeira pergunta daquele mundo — 8 telas até o
 * gate. A vertente tem de existir na configuração; qualquer outro valor é 404.
 */
export default async function EntradaDireta({
  params,
}: {
  params: Promise<{ locale: string; vertente: string }>;
}) {
  const { locale, vertente } = await params;
  if (!idiomaValido(locale)) notFound();
  if (!CLIENTE.vertentes.some((v) => v.id === vertente)) notFound();
  setRequestLocale(locale);
  return <QuizHolding idioma={locale} vertenteDireta={vertente} />;
}
