import { NextResponse } from "next/server";
import { carregarPreenchimento } from "@/lib/confirmacao-server";
import { identificarChamador, verificarLimiteDuravel } from "@/lib/rate-limit";
import { tokenPlausivel } from "@/lib/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Payload pré-preenchido do modo confirmação.
 *
 * O token é a única credencial que separa o mundo do que ela contou num áudio,
 * então vale a mesma disciplina do token da proposta (C6): formato conferido
 * antes de qualquer ida ao banco, e rate limit apertado — este endereço é
 * enumerável por natureza, e 20 tentativas por minuto tornam a busca inviável
 * sem atrapalhar quem só recarregou a página.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const limite = await verificarLimiteDuravel(
    `confirmacao:${identificarChamador(req)}`,
    20,
    60
  );
  if (!limite.permitido) {
    return NextResponse.json(
      { erro: "muitas_requisicoes" },
      {
        status: 429,
        headers: { "Retry-After": String(limite.reiniciaEmSegundos) },
      }
    );
  }

  const { token } = await params;
  if (!tokenPlausivel(token)) {
    return NextResponse.json({ erro: "nao_encontrado" }, { status: 404 });
  }

  const preenchimento = await carregarPreenchimento(token);
  if (!preenchimento) {
    return NextResponse.json({ erro: "nao_encontrado" }, { status: 404 });
  }

  return NextResponse.json(preenchimento, {
    // Dado pessoal declarado. Não entra em cache de CDN nem de browser.
    headers: { "cache-control": "no-store" },
  });
}
