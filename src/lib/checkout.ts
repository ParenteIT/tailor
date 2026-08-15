import "server-only";
import { PRODUTOS, type Moeda, type ProdutoKey } from "@/content/config";
import { asaasConfigurado, criarLinkDePagamento } from "@/lib/asaas";
import { dinheiro } from "@/lib/gap";

/**
 * A camada de checkout.
 *
 * Premissas registradas em 13/08/2026, na ausência de resposta — cada uma é
 * reversível numa linha e está no artefato de gestão:
 *
 *  1. High-ticket (Dossiê, Prisma) vai por **Asaas**, checkout próprio.
 *  2. Low-ticket e assinaturas ficam na **Hotmart**, como cross-sell no fim da
 *     proposta — é lá que a plataforma entrega área de membros e dunning.
 *  3. **Os juros do parcelamento são repassados** a ela: você recebe o preço
 *     cheio e a taxa efetiva fica em ~3%. É o padrão do high-ticket.
 *  4. O pagamento **redireciona** para o checkout hospedado do Asaas — escopo
 *     de PCI zero deste lado, antifraude e 3DS por conta deles.
 *
 * Sem preço configurado, tudo isto fica dormente e a página segue mostrando ◆
 * com o aviso de demonstração. Nenhum preço é inventado em lugar nenhum.
 */

/** Preço em CENTAVOS, por env. Ausente ou inválido ⇒ produto ainda é ◆. */
const ENV_DE_PRECO: Record<ProdutoKey, string> = {
  jornada: "PRECO_JORNADA_CENTAVOS",
  dossie: "PRECO_DOSSIE_CENTAVOS",
  prismaEssencial: "PRECO_PRISMA_ESSENCIAL_CENTAVOS",
  prismaCompleto: "PRECO_PRISMA_COMPLETO_CENTAVOS",
};

export function precoEmCentavos(produto: ProdutoKey): number | null {
  const bruto = process.env[ENV_DE_PRECO[produto]];
  const n = bruto ? Number(bruto) : Number.NaN;
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

/**
 * O preço como a proposta exibe. Mesma env que cobra (`PRECO_*_CENTAVOS`),
 * então o número da tela e o número do link de pagamento não têm como
 * divergir. Sem env, devolve null e o chamador mantém o ◆ — nenhum valor é
 * inventado para ficar bonito em demo.
 */
export function precoExibido(produto: ProdutoKey, moeda: Moeda = "BRL"): string | null {
  const centavos = precoEmCentavos(produto);
  if (centavos === null) return null;
  return dinheiro(centavos / 100, moeda);
}

/** Nome de exibição, sobrescrevível por env (`PRODUTO_<CHAVE>_NOME`). */
export function nomeExibido(produto: ProdutoKey): string {
  const env = process.env[`PRODUTO_${chaveEnv(produto)}_NOME`];
  return env?.trim() || PRODUTOS[produto].nome;
}

function chaveEnv(produto: ProdutoKey): string {
  return produto.replace(/([A-Z])/g, "_$1").toUpperCase();
}

/** Máximo de parcelas oferecido no cartão. 1 desliga o parcelado. */
export function maxParcelas(): number {
  const n = Number(process.env.CHECKOUT_MAX_PARCELAS ?? 12);
  return Number.isSafeInteger(n) && n >= 1 && n <= 21 ? n : 12;
}

export type ResultadoCheckout =
  | { estado: "pronto"; url: string }
  | { estado: "mock"; motivo: "sem_preco" | "sem_gateway" }
  | { estado: "erro" };

export async function abrirCheckout(opcoes: {
  produto: ProdutoKey;
  leadId: string;
  primeiroNome: string;
  expiraEm: Date;
}): Promise<ResultadoCheckout> {
  const centavos = precoEmCentavos(opcoes.produto);
  if (centavos === null) return { estado: "mock", motivo: "sem_preco" };
  if (!asaasConfigurado()) return { estado: "mock", motivo: "sem_gateway" };

  try {
    const link = await criarLinkDePagamento({
      nome: PRODUTOS[opcoes.produto].nome,
      descricao: `${PRODUTOS[opcoes.produto].nome} — proposta de ${opcoes.primeiroNome}`,
      centavos,
      referenciaExterna: opcoes.leadId,
      expiraEm: opcoes.expiraEm,
      maxParcelas: maxParcelas(),
    });
    return { estado: "pronto", url: link.url };
  } catch (erro) {
    console.error("[tailor] falha ao criar link de pagamento", erro);
    return { estado: "erro" };
  }
}

/* ==========================================================================
   HOTMART — cross-sell dos níveis 0–2
   ==========================================================================
   Links de checkout da própria Hotmart, colados por env. Não há chamada de
   API: são produtos de assinatura que já vivem lá, e o Tailor só aponta.
   ========================================================================= */

export interface ItemCrossSell {
  chave: "circulo" | "jornada";
  url: string;
}

export function crossSellHotmart(): ItemCrossSell[] {
  const itens: ItemCrossSell[] = [];
  const circulo = process.env.HOTMART_LINK_CIRCULO;
  const jornada = process.env.HOTMART_LINK_JORNADA;
  if (circulo) itens.push({ chave: "circulo", url: circulo });
  if (jornada) itens.push({ chave: "jornada", url: jornada });
  return itens;
}
