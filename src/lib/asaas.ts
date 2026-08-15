import "server-only";

/**
 * Cliente do Asaas — o gateway do high-ticket.
 *
 * Premissa registrada (13/08/2026): a proposta cria um **link de pagamento**
 * por lead, e é a própria pessoa que preenche os dados dela na página do Asaas.
 * O CPF nunca passa pelo nosso banco, o que mantém intacta a minimização de
 * dados escrita no PRODUCT.md — e o `externalReference` amarra o pagamento ao
 * lead certo quando o webhook chegar.
 *
 * ⚠️ NÃO VERIFICADO CONTRA A API REAL. Este módulo foi escrito sem credencial
 * disponível, então o contrato abaixo é o documentado, não o observado. Rode
 * uma vez em sandbox (`ASAAS_AMBIENTE=sandbox`) antes de apontar para produção.
 */

const BASES = {
  sandbox: "https://api-sandbox.asaas.com/v3",
  producao: "https://api.asaas.com/v3",
} as const;

export type AmbienteAsaas = keyof typeof BASES;

export function ambienteAsaas(): AmbienteAsaas {
  return process.env.ASAAS_AMBIENTE === "producao" ? "producao" : "sandbox";
}

export function asaasConfigurado(): boolean {
  return Boolean(process.env.ASAAS_API_KEY);
}

export interface LinkDePagamento {
  id: string;
  url: string;
}

export interface PedidoDeLink {
  /** Nome do produto, como aparece no checkout dela. */
  nome: string;
  descricao: string;
  /** Em centavos — o env guarda centavos para não haver float no caminho. */
  centavos: number;
  /** Id do lead. Volta no webhook e é o que amarra pagamento ↔ proposta. */
  referenciaExterna: string;
  /**
   * C5 — o link morre junto com a proposta. Escassez honesta significa que o
   * pagamento também expira, não só o texto na tela.
   */
  expiraEm: Date;
  /** 1 = só à vista. Acima disso, o Asaas mostra o parcelado. */
  maxParcelas: number;
}

export async function criarLinkDePagamento(
  pedido: PedidoDeLink
): Promise<LinkDePagamento> {
  const chave = process.env.ASAAS_API_KEY;
  if (!chave) throw new Error("ASAAS_API_KEY não está definida.");

  const corpo: Record<string, unknown> = {
    name: pedido.nome,
    description: pedido.descricao,
    // UNDEFINED deixa ela escolher Pix, cartão ou boleto no checkout do Asaas.
    billingType: "UNDEFINED",
    chargeType: pedido.maxParcelas > 1 ? "INSTALLMENT" : "DETACHED",
    value: pedido.centavos / 100,
    externalReference: pedido.referenciaExterna,
    notificationEnabled: true,
    endDate: pedido.expiraEm.toISOString().slice(0, 10),
  };

  if (pedido.maxParcelas > 1) corpo.maxInstallmentCount = pedido.maxParcelas;

  const resposta = await fetch(`${BASES[ambienteAsaas()]}/paymentLinks`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      access_token: chave,
    },
    body: JSON.stringify(corpo),
    // Sem cache: cada proposta gera o seu.
    cache: "no-store",
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => "");
    // O detalhe do Asaas pode conter dado da conta — vai só para o log do
    // servidor, nunca para a resposta da rota.
    throw new Error(`asaas ${resposta.status}: ${detalhe.slice(0, 400)}`);
  }

  const dados = (await resposta.json()) as { id?: string; url?: string };
  if (!dados.url || !dados.id) {
    throw new Error("asaas: resposta sem url/id");
  }

  return { id: dados.id, url: dados.url };
}
