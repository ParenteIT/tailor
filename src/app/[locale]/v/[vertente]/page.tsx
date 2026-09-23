import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { idiomaValido } from "@/content/clientes";
import { resolverCliente } from "@/lib/tenants";
import { QuizHolding } from "@/components/holding/quiz-holding";

/**
 * Entrada direta por campanha (aprovada no handoff §2): `/v/<vertente>` pede
 * o nome e abre direto na primeira pergunta daquele mundo — 8 telas até o
 * gate. A vertente tem de existir na configuração do cliente resolvido para
 * este domínio; qualquer outro valor é 404.
 */
export default async function EntradaDireta({
  params,
}: {
  params: Promise<{ locale: string; vertente: string }>;
}) {
  const { locale, vertente } = await params;
  if (!idiomaValido(locale)) notFound();
  const cliente = await resolverCliente((await headers()).get("host"));
  if (!cliente.vertentes.some((v) => v.id === vertente)) notFound();
  setRequestLocale(locale);
  return <QuizHolding idioma={locale} cliente={cliente} vertenteDireta={vertente} />;
}
