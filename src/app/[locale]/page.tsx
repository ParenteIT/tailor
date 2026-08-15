import { redirect } from "@/i18n/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // A raiz não tem conteúdo próprio: o produto é o diagnóstico.
  redirect({ href: "/diagnostico", locale });
}
