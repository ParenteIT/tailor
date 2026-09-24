import { NextResponse } from "next/server";
import { abrirCheckout } from "@/lib/checkout";
import { cobrancaDaOferta, expirou, type ConteudoProposta } from "@/lib/proposta";
import { identificarChamador, verificarLimiteDuravel } from "@/lib/rate-limit";
import { getStore } from "@/lib/store";
import { resolverCliente } from "@/lib/tenants";
import { tokenPlausivel } from "@/lib/token";

export const runtime = "nodejs";

/**
 * Cria o link de pagamento no momento do clique, não na geração da proposta:
 * a maioria não vai pagar, e link criado à toa é chamada de API paga e lixo no
 * painel do Asaas.
 *
 * O preço e o produto vêm do que está gravado na proposta — nunca do corpo da
 * requisição. Aceitar valor do cliente seria deixar qualquer um escolher
 * quanto pagar.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const limite = await verificarLimiteDuravel(`checkout:${identificarChamador(req)}`, 10, 300);
  if (!limite.permitido) {
    return NextResponse.json(
      { erro: "muitas_requisicoes" },
      { status: 429, headers: { "Retry-After": String(limite.reiniciaEmSegundos) } }
    );
  }

  const { token } = await params;
  if (!tokenPlausivel(token)) {
    return NextResponse.json({ erro: "nao_encontrada" }, { status: 404 });
  }

  const store = getStore();
  const proposta = await store.buscarPropostaPorToken(token);
  if (!proposta) {
    return NextResponse.json({ erro: "nao_encontrada" }, { status: 404 });
  }

  // C5 — proposta vencida não gera cobrança. A escassez tem de valer também
  // para o dinheiro, senão ela é só um texto na tela.
  if (expirou(proposta.expiraEm)) {
    return NextResponse.json({ erro: "expirada" }, { status: 410 });
  }

  const conteudo = proposta.conteudo as unknown as ConteudoProposta;
  const oferta = conteudo.oferta;
  if (!oferta?.produto) {
    return NextResponse.json({ erro: "sem_oferta" }, { status: 409 });
  }

  // Holding: a mesma pergunta que decidiu o botão da página. Só pagamento
  // único passa por aqui; assinatura vai direto ao link da Hotmart, e gate,
  // conversa ou dólar nunca geram cobrança, nem chamando a rota direto.
  const holding = Boolean(conteudo.vertente);
  if (holding) {
    const cobranca = cobrancaDaOferta(conteudo, await resolverCliente(req.headers.get("host")));
    if (cobranca?.via !== "asaas") {
      return NextResponse.json({ erro: "sem_checkout" }, { status: 409 });
    }
  }

  await store.registrarEvento(proposta.id, "checkout_iniciado", { produto: oferta.produto });

  const resultado = await abrirCheckout({
    produto: oferta.produto,
    preco: holding ? { centavos: oferta.centavos!, nome: oferta.nome } : undefined,
    leadId: proposta.leadId,
    primeiroNome: (conteudo.nome ?? "").split(/\s+/)[0] ?? "",
    expiraEm: new Date(proposta.expiraEm),
  });

  if (resultado.estado === "pronto") {
    return NextResponse.json({ estado: "pronto", url: resultado.url });
  }
  if (resultado.estado === "mock") {
    return NextResponse.json({ estado: "mock", motivo: resultado.motivo });
  }
  return NextResponse.json({ estado: "erro" }, { status: 502 });
}
