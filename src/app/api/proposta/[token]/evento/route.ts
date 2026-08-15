import { NextResponse } from "next/server";
import { z } from "zod";
import { identificarChamador, verificarLimiteDuravel } from "@/lib/rate-limit";
import { getStore } from "@/lib/store";
import { tokenPlausivel } from "@/lib/token";

export const runtime = "nodejs";

/**
 * Log de abertura e cliques da proposta. É o gancho que a Renilza vai querer
 * ("ela abriu?"), e o ponto onde uma notificação entra depois.
 *
 * Nada aqui devolve conteúdo — só grava. Um token inválido responde 204 igual
 * a um válido, para não virar oráculo de enumeração.
 */
const Corpo = z.object({
  tipo: z.enum([
    "view",
    "cta_primario_click",
    "cta_secundario_click",
    "checkout_iniciado",
    "checkout_concluido",
  ]),
  /**
   * Era `z.record(z.string(), z.unknown())` — sem teto de tamanho, de chaves
   * nem de profundidade, indo direto para uma coluna jsonb. Era o único campo
   * de origem do usuário sem `.max()` no projeto inteiro, e um laço gravando
   * megabytes por requisição enchia o disco do Supabase até o banco virar
   * somente-leitura, derrubando o funil (auditoria de 14/08/2026).
   *
   * A tela nunca manda `meta` — `oferta.tsx` envia só `{ tipo }`. O formato
   * abaixo é o mínimo que serve se um dia mandar, e nada além disso passa.
   */
  meta: z
    .record(
      z.string().max(40),
      z.union([z.string().max(200), z.number(), z.boolean()])
    )
    .refine((m) => Object.keys(m).length <= 10, "meta_grande_demais")
    .optional(),
});

/** Esta rota nunca precisa de corpo grande; recusa antes de ler o stream. */
const CORPO_MAXIMO_BYTES = 4 * 1024;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const limite = await verificarLimiteDuravel(`evento:${identificarChamador(req)}`, 60, 60);
  if (!limite.permitido) return new NextResponse(null, { status: 429 });

  const { token } = await params;
  if (!tokenPlausivel(token)) return new NextResponse(null, { status: 204 });

  const tamanho = Number(req.headers.get("content-length") ?? 0);
  if (tamanho > CORPO_MAXIMO_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  let bruto: unknown;
  try {
    bruto = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const analise = Corpo.safeParse(bruto);
  if (!analise.success) return new NextResponse(null, { status: 204 });

  try {
    const store = getStore();
    const proposta = await store.buscarPropostaPorToken(token);
    if (!proposta) return new NextResponse(null, { status: 204 });

    await store.registrarEvento(proposta.id, analise.data.tipo, analise.data.meta);
  } catch (erro) {
    console.error("[tailor] falha ao registrar evento", erro);
  }

  return new NextResponse(null, { status: 204 });
}
