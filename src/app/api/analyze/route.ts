import { NextResponse } from "next/server";
import { z } from "zod";
import { PERSONA_KEYS } from "@/content/personas";
import { analisarRespostas } from "@/lib/analise";
import {
  dentroDoTetoGlobal,
  identificarChamador,
  verificarLimiteDuravel,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Extração estruturada isolada. A geração da proposta chama a mesma função
 * diretamente (sem passar por HTTP); esta rota existe para o modo confirmação
 * e para depurar a extração sem gerar proposta.
 *
 * C6 — teto mais apertado que o de /api/leads: cada chamada aqui custa dinheiro.
 */
const Corpo = z.object({
  persona: z.enum(PERSONA_KEYS).optional(),
  situacao: z.string().max(2000).nullable().optional(),
  q3: z.string().min(1).max(4000),
  palavras: z.array(z.string().max(40)).max(3).optional(),
});

export async function POST(req: Request) {
  const limite = await verificarLimiteDuravel(`analyze:${identificarChamador(req)}`, 8, 60);
  if (!limite.permitido) {
    return NextResponse.json(
      { erro: "muitas_requisicoes" },
      { status: 429, headers: { "Retry-After": String(limite.reiniciaEmSegundos) } }
    );
  }

  if (!(await dentroDoTetoGlobal("analyze"))) {
    return NextResponse.json({ erro: "indisponivel_no_momento" }, { status: 503 });
  }

  let bruto: unknown;
  try {
    bruto = await req.json();
  } catch {
    return NextResponse.json({ erro: "json_invalido" }, { status: 400 });
  }

  const analise = Corpo.safeParse(bruto);
  if (!analise.success) {
    return NextResponse.json(
      { erro: "corpo_invalido", detalhes: analise.error.issues },
      { status: 400 }
    );
  }

  return NextResponse.json(await analisarRespostas(analise.data));
}
