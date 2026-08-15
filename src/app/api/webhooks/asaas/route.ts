import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore, type StatusLead } from "@/lib/store";

export const runtime = "nodejs";

/**
 * Receptor de webhook do Asaas — a metade que faltava do checkout.
 *
 * Até 14/08/2026 o produto criava o link de pagamento e nunca ficava sabendo
 * se alguém pagou: o lead travava em `checkout_iniciado` para sempre e só o
 * painel do Asaas sabia a verdade. O `asaas.ts` já mandava o `leadId` como
 * `externalReference` esperando este endpoint ("amarra o pagamento ao lead
 * certo quando o webhook chegar") — ele só nunca tinha sido escrito.
 *
 * SEGURANÇA — este endpoint é público e move o lead para "fechado", então a
 * autenticação não é opcional:
 *  - Sem `ASAAS_WEBHOOK_TOKEN` configurado, a rota responde 503 e não processa
 *    nada. Falhar fechado é obrigatório aqui: aberto, qualquer um marcaria
 *    qualquer lead como pago.
 *  - O token vem no cabeçalho `asaas-access-token` (o que o painel do Asaas
 *    manda quando você configura um token no webhook) e é comparado em tempo
 *    constante.
 *  - `externalReference` é validado como UUID antes de chegar ao banco.
 *  - Nenhum valor monetário do corpo é usado para decidir nada. O webhook diz
 *    "este pagamento mudou de estado"; o preço continua vindo da env, como
 *    sempre. Confiar no valor do corpo seria deixar o remetente escolher.
 *
 * IDEMPOTÊNCIA — o Asaas reenvia até receber 200. `atualizarStatusLead` só
 * escreve quando o status muda de verdade e devolve o anterior, então
 * reentrega vira no-op sem duplicar evento.
 */

const Corpo = z.object({
  event: z.string().max(80),
  payment: z
    .object({
      id: z.string().max(120).optional(),
      externalReference: z.string().max(120).nullable().optional(),
      status: z.string().max(40).optional(),
    })
    .optional(),
});

/**
 * O que cada evento significa para o lead. Só os que movem o funil estão
 * aqui; qualquer outro é reconhecido com 200 e ignorado — devolver erro faria
 * o Asaas reentregar para sempre um evento que nunca vamos querer.
 */
const STATUS_POR_EVENTO: Record<string, StatusLead> = {
  PAYMENT_CONFIRMED: "fechado",
  PAYMENT_RECEIVED: "fechado",
  PAYMENT_REFUNDED: "perdido",
  PAYMENT_CHARGEBACK_REQUESTED: "perdido",
  PAYMENT_DELETED: "perdido",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function tokenConfere(recebido: string | null, esperado: string): boolean {
  if (!recebido) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  // timingSafeEqual exige mesmo tamanho; comparar o tamanho antes vaza só o
  // comprimento, que não é segredo.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const esperado = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!esperado) {
    console.error(
      "[tailor] webhook do Asaas chamado sem ASAAS_WEBHOOK_TOKEN configurado — recusado"
    );
    return NextResponse.json({ erro: "webhook_nao_configurado" }, { status: 503 });
  }

  if (!tokenConfere(req.headers.get("asaas-access-token"), esperado)) {
    return NextResponse.json({ erro: "nao_autorizado" }, { status: 401 });
  }

  let bruto: unknown;
  try {
    bruto = await req.json();
  } catch {
    return NextResponse.json({ erro: "json_invalido" }, { status: 400 });
  }

  const analise = Corpo.safeParse(bruto);
  if (!analise.success) {
    return NextResponse.json({ erro: "corpo_invalido" }, { status: 400 });
  }

  const { event, payment } = analise.data;
  const novoStatus = STATUS_POR_EVENTO[event];

  // 200 em tudo que é legítimo mas não interessa: o Asaas só para de
  // reentregar quando recebe 2xx.
  if (!novoStatus) {
    return NextResponse.json({ ok: true, ignorado: event });
  }

  const leadId = payment?.externalReference ?? null;
  if (!leadId || !UUID.test(leadId)) {
    console.error(
      `[tailor] webhook ${event} sem externalReference utilizável — nada a fazer`
    );
    return NextResponse.json({ ok: true, semReferencia: true });
  }

  try {
    const store = getStore();
    const anterior = await store.atualizarStatusLead(leadId, novoStatus);

    if (anterior === null) {
      // Lead inexistente ou já removido por LGPD. Não é erro do Asaas.
      return NextResponse.json({ ok: true, leadDesconhecido: true });
    }

    // Só registra evento quando houve mudança real — reentrega não duplica.
    if (anterior !== novoStatus && novoStatus === "fechado") {
      const proposta = await store.buscarPropostaPorLeadId(leadId);
      if (proposta) {
        await store.registrarEvento(proposta.id, "checkout_concluido", {
          evento: event,
          pagamento: payment?.id ?? null,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (erro) {
    // 500 faz o Asaas reentregar, que é o comportamento certo para falha
    // nossa — o pagamento não pode se perder porque o banco piscou.
    console.error("[tailor] falha ao processar webhook do Asaas", erro);
    return NextResponse.json({ erro: "falha_ao_processar" }, { status: 500 });
  }
}
