import "server-only";
import type { Cliente } from "@/content/clientes";
import { leituraManual, perguntaDeFaixa, vertenteDaCena, type RespostasHolding } from "@/lib/fluxo";

/**
 * Aviso à dona do diagnóstico quando um lead passa pelo gate (A35). O canal é
 * decisão de operação, não de código: um POST para `AVISO_LEAD_URL` (um
 * webhook de Make, n8n ou Zapier leva ao WhatsApp, e-mail ou planilha dela).
 * Sem a env, nada acontece.
 *
 * O corpo leva o link da proposta e o que ajuda a priorizar a conversa, nunca
 * nome, contato, relato ou número declarado: o webhook é um terceiro a mais
 * no caminho, e a proposta aberta pelo link já mostra o resto.
 */

export interface AvisoLead {
  cliente: string;
  link: string;
  idioma: string;
  vertente: string | null;
  entrada: RespostasHolding["entrada"];
  faixa: string | null;
  leituraManual: boolean;
  em: string;
}

export function corpoDoAviso(
  cliente: Cliente,
  r: RespostasHolding,
  idioma: string,
  link: string,
  em: Date
): AvisoLead {
  const v = vertenteDaCena(cliente, r.cena);
  const pergunta = v ? perguntaDeFaixa(v) : null;
  const faixa = pergunta ? r.ramo[pergunta.id] : undefined;
  return {
    cliente: cliente.id,
    link,
    idioma,
    vertente: v?.id ?? null,
    entrada: r.entrada,
    faixa: typeof faixa === "string" ? faixa : null,
    leituraManual: leituraManual(r),
    em: em.toISOString(),
  };
}

export function avisoConfigurado(): boolean {
  return /^https:\/\//.test(process.env.AVISO_LEAD_URL ?? "");
}

/**
 * Esperado pela rota, com teto de 3 s: numa função serverless, uma promessa
 * solta depois da resposta pode morrer no meio. Falhar aqui nunca derruba o
 * gate — a proposta já existe e o lead já está no banco.
 */
export async function avisarLead(aviso: AvisoLead): Promise<boolean> {
  const url = process.env.AVISO_LEAD_URL;
  if (!url || !avisoConfigurado()) return false;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(aviso),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) console.error(`[tailor] aviso de lead respondeu ${r.status}`);
    return r.ok;
  } catch (erro) {
    console.error("[tailor] falha ao avisar lead", erro);
    return false;
  }
}
