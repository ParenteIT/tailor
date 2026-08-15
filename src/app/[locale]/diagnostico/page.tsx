import { setRequestLocale } from "next-intl/server";
import { Quiz } from "@/components/quiz";

export default async function Diagnostico({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Quiz />;
}
