import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Quiz } from "@/components/quiz";
import { carregarPreenchimento } from "@/lib/confirmacao-server";
import { tokenPlausivel } from "@/lib/token";

export const dynamic = "force-dynamic";

// C6 — o link carrega o que ela contou num áudio. Fora do índice, sem preview.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/**
 * F5 — o mesmo quiz, entrando por outra porta.
 *
 * Nada aqui é uma segunda implementação do questionário: são as mesmas nove
 * telas, o mesmo estado e o mesmo gate. A única diferença é que três delas
 * chegam com resposta e trocam a pergunta por uma confirmação. Duplicar o
 * fluxo seria garantir que um dos dois envelhecesse errado.
 */
export default async function DiagnosticoConfirmacao({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);

  const preenchimento = tokenPlausivel(token)
    ? await carregarPreenchimento(token)
    : null;

  // Link inválido, expirado ou já removido não vira erro: vira o quiz frio.
  // Ela veio responder — mandar de volta para uma página de erro custaria o
  // lead por um problema que é nosso.
  if (!preenchimento) return <QuizFrioComAviso />;

  return <Quiz confirmacao={preenchimento} />;
}

async function QuizFrioComAviso() {
  const t = await getTranslations();
  return (
    <>
      <p
        className="notacao mx-auto w-full max-w-[var(--container-leitura)] px-p4 pt-p4"
        role="status"
      >
        {t("confirmacao.linkInvalido")}
      </p>
      <Quiz />
    </>
  );
}
