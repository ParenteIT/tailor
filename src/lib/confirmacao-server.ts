import "server-only";
import {
  normalizarPreenchimento,
  type Preenchimento,
} from "@/lib/confirmacao";
import type { Respostas } from "@/lib/quiz-state";
import { getStore } from "@/lib/store";

/**
 * Resolve o token de confirmação para o payload que a tela consome.
 *
 * Existe uma única cópia disto: a página `/diagnostico/c/[token]` chama daqui
 * direto (é server component, não precisa do salto HTTP) e a rota
 * `/api/confirmation/[token]` só a expõe. Duas leituras divergentes do mesmo
 * token seria a forma mais fácil de a tela mostrar uma coisa e o banco guardar
 * outra.
 */
export async function carregarPreenchimento(
  token: string
): Promise<Preenchimento | null> {
  const store = getStore();

  const lead = await store.buscarLeadPorConfirmationToken(token);
  if (!lead) return null;

  const respostas = await store.buscarRespostas(lead.id);
  const raw = (respostas?.raw ?? {}) as Record<string, unknown>;

  return normalizarPreenchimento({
    leadId: lead.id,
    nome: lead.nome,
    persona: lead.persona,
    respostas: {
      situacao: respostas?.situacao ?? null,
      q3: respostas?.q3 ?? null,
      precoAtual: respostas?.precoAtual ?? null,
      precoDesejado: respostas?.precoDesejado ?? null,
      volumeMensal: respostas?.volumeMensal ?? null,
      pctUsado: respostas?.pctUsado ?? null,
      valorParado: respostas?.valorParado ?? null,
    } as Partial<Respostas>,
    // O verbatim do áudio vive no jsonb livre, gravado pelo passo de
    // transcrição local. Coluna própria só quando o formato parar de mudar.
    ouvido: (raw.ouvido as Record<string, unknown> | undefined) ?? null,
  });
}
