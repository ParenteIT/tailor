import {
  FAIXAS_INVESTIMENTO,
  OFERTA_POR_FAIXA,
  PRODUTOS,
  VALIDADE_PROPOSTA_HORAS,
  moedaDoIdioma,
  type FaixaInvestimento,
  type Moeda,
} from "@/content/config";
import { PERSONAS, type PersonaKey } from "@/content/personas";
import { analisarRespostas, type Analise } from "@/lib/analise";
import { nomeExibido, precoExibido } from "@/lib/checkout";
import { escreverTexto, llmDisponivel } from "@/lib/llm";
import {
  calcularGap,
  escalaDaFita,
  posicoesDasEstacoes,
  precoDeProduto,
  type EscalaFita,
  type Gap,
} from "@/lib/gap";
import { PROMPT_DIAGNOSTICO, VERSAO_PROMPT } from "../../prompts/v1";
import mensagensPt from "../../messages/pt.json";
import { moedaDe, txt, type Cliente, type Idioma, type Moeda as MoedaCliente, type Pergunta } from "@/content/clientes";
import {
  CENA_LIVRE,
  contaDaMedida,
  escolherOferta as escolherOfertaDaHolding,
  leituraManual,
  opcoesDaFaixa,
  perguntaDeFaixa,
  vertenteDaCena,
  type RespostasHolding,
} from "@/lib/fluxo";

/**
 * As palavras da Q6 são gravadas como CHAVE ("memoravel"); o exibível, com
 * acento, mora nas messages — a mesma fonte da UI, sem texto duplicado. Todo
 * lugar onde a palavra vira frase lida por ela (diagnóstico de reserva, prompt
 * do modelo) passa por aqui; chave desconhecida cai no texto cru.
 */
const PALAVRA_LEGIVEL: Record<string, string> = mensagensPt.futuro.palavras;

function palavrasLegiveis(palavras: string[]): string[] {
  return palavras.map((p) => PALAVRA_LEGIVEL[p] ?? p);
}

/**
 * A27 (auditoria 19/09): a situação também passou a ser gravada como CHAVE
 * (s1..s4, por persona), não mais o texto — mesma razão da palavra acima.
 * "outro" nunca passa por aqui: já chega como texto livre dela.
 */
const SITUACAO_LEGIVEL: Record<string, Record<string, string>> =
  mensagensPt.espelho.situacoes;

function situacaoLegivel(
  persona: PersonaKey,
  situacao: string | null | undefined
): string | null {
  if (!situacao) return null;
  return SITUACAO_LEGIVEL[persona]?.[situacao] ?? situacao;
}

export interface RespostasProposta {
  persona: PersonaKey;
  situacao: string | null;
  situacaoOutro?: string;
  q3: string;
  precoAtual?: number | null;
  precoDesejado?: number | null;
  volumeMensal?: number | null;
  pctUsado?: number | null;
  valorParado?: number | null;
  palavras: string[];
  q7?: string | null;
  q8?: string | null;
  q9?: string | null;
  nome: string;
  /** Idioma em que ela respondeu. Decide a moeda da régua. */
  idioma?: string;
}

export interface ConteudoProposta {
  versaoPrompt: string;
  /** Só nas propostas do quiz de personas (modo confirmação legado). */
  persona?: PersonaKey;
  /** Só nas propostas da holding: a vertente e o cliente que a geraram. */
  vertente?: string;
  cliente?: string;
  /** "Nenhuma dessas" na cena: a Renilza lê à mão antes de responder. */
  leituraManual?: boolean;
  nome: string;
  /** Bloco 2 — a única parte escrita por modelo. */
  diagnostico: string;
  /** Marcado quando o diagnóstico saiu do fallback, não do modelo. */
  diagnosticoDegradado: boolean;
  analise: Analise;
  gap: Gap | null;
  fita: {
    escala: EscalaFita;
    estacoes: Record<string, number>;
  } | null;
  palavras: string[];
  q9: string | null;
  /**
   * O que o Bloco 7 oferta, escolhido pela faixa que ela marcou na Q9.
   * Gravado junto com a proposta para que reabrir o link não mude a oferta.
   */
  oferta: {
    produto: string;
    nome: string;
    preco: string;
    nivel?: string;
    /**
     * Só na holding (propostas de antes de 24/09 não têm): o preço que a
     * tela mostrou, em centavos, e como a venda fecha. O checkout cobra
     * este número, não o da configuração do dia do clique.
     */
    centavos?: number;
    canal?: "checkout" | "conversa" | "convite";
    recorrencia?: "unica" | "mensal";
  } | null;
  /** Moeda em que ela declarou — a proposta reabre sempre igual. */
  moeda: Moeda;
  /** Idioma em que ela respondeu — decide a língua da proposta ao reabrir. */
  idioma: string;
  geradoEm: string;
}

export function calcularExpiracao(de: Date = new Date()): Date {
  return new Date(de.getTime() + VALIDADE_PROPOSTA_HORAS * 60 * 60 * 1000);
}

/**
 * C5 — quem decide se a proposta ainda vale é o servidor lendo a coluna, nunca
 * o relógio do browser. O §8 do BRAND-VISUAL veta cronômetro, então a data
 * existe como fato verificado aqui e como frase sóbria na página.
 */
export function expirou(expiraEm: string | Date): boolean {
  const limite = typeof expiraEm === "string" ? new Date(expiraEm) : expiraEm;
  return Number.isFinite(limite.getTime()) && limite.getTime() <= Date.now();
}

export type Cobranca = { via: "asaas" } | { via: "hotmart"; url: string } | null;

/**
 * Como a proposta da holding cobra, ou null quando o próximo passo é conversa.
 * Só cobra o que a tela mostrou e a configuração de hoje ainda vende: preço
 * congelado nela, em real (sem gateway em dólar), canal `checkout`, sem gate.
 * Pagamento único vai ao Asaas; assinatura mensal, ao link da Hotmart do
 * produto (24/09). A página e a rota de checkout perguntam aqui, então o botão
 * de pagar nunca aparece para algo que a rota recusaria.
 */
export function cobrancaDaOferta(c: ConteudoProposta, cliente: Cliente): Cobranca {
  const o = c.oferta;
  if (!o || c.moeda !== "BRL" || o.canal !== "checkout") return null;
  if (!Number.isSafeInteger(o.centavos) || o.centavos! <= 0) return null;
  const atual = cliente.produtos.find((p) => p.id === o.produto);
  if (!atual?.publicado || atual.canal !== "checkout" || atual.gate) return null;
  if (o.recorrencia === "unica") return { via: "asaas" };
  if (o.recorrencia === "mensal" && atual.linkHotmart) return { via: "hotmart", url: atual.linkHotmart };
  return null;
}

export async function montarProposta(
  respostas: RespostasProposta
): Promise<ConteudoProposta> {
  const persona = PERSONAS[respostas.persona];
  const moeda = moedaDoIdioma(respostas.idioma);
  const gap = calcularGap(respostas, persona.trilha);
  const analise = await analisarRespostas({
    persona: respostas.persona,
    situacao:
      respostas.situacaoOutro?.trim() ||
      situacaoLegivel(respostas.persona, respostas.situacao),
    q3: respostas.q3,
    palavras: respostas.palavras,
  });

  const { texto: diagnostico, degradado } = await escreverDiagnostico(
    entradaDoDiagnostico(respostas, gap),
    () => diagnosticoDeReserva(respostas, analise)
  );

  return {
    versaoPrompt: VERSAO_PROMPT,
    persona: respostas.persona,
    nome: respostas.nome.trim(),
    diagnostico,
    diagnosticoDegradado: degradado,
    analise,
    gap,
    moeda,
    fita: gap
      ? (() => {
          const escala = escalaDaFita(gap, moeda);
          return { escala, estacoes: posicoesDasEstacoes(escala) };
        })()
      : null,
    palavras: respostas.palavras,
    q9: respostas.q9 ?? null,
    oferta: escolherOferta(respostas.q9, moeda),
    // Gravado junto com a proposta: reabrir o link mostra a mesma língua em
    // que ela respondeu, sem depender do Accept-Language de quem abre.
    idioma: respostas.idioma ?? "pt",
    geradoEm: new Date().toISOString(),
  };
}

/**
 * A oferta sai do teto de abertura que ela mesma marcou — é o que torna a
 * proposta sob medida também no preço. Faixa desconhecida ou ausente cai no
 * degrau do meio: presumir o topo de quem não declarou seria inventar.
 */
function faixaConhecida(valor: string | null | undefined): valor is FaixaInvestimento {
  return (FAIXAS_INVESTIMENTO as readonly string[]).includes(valor ?? "");
}

function escolherOferta(faixa: string | null | undefined, moeda: Moeda) {
  // O cast direto de antes (`as FaixaInvestimento`) só existia em tempo de
  // compilação: uma q9 valendo "toString" alcançava `Object.prototype` e
  // devolvia uma função, que o `??` não considera nula e o `checkout.ts`
  // quebrava com TypeError. Auditoria de 14/08/2026.
  const chave = faixaConhecida(faixa) ? faixa : "naoDizer";
  const produto = OFERTA_POR_FAIXA[chave];
  // Nome e preço saem da mesma env que alimenta o link de pagamento
  // (`PRECO_*_CENTAVOS` / `PRODUTO_*_NOME`): a tela e a cobrança não têm como
  // divergir. Sem env, o catálogo estático segue valendo e o preço fica ◆.
  return {
    produto,
    nome: nomeExibido(produto),
    preco: precoExibido(produto, moeda) ?? PRODUTOS[produto].preco,
  };
}

function entradaDoDiagnostico(respostas: RespostasProposta, gap: Gap | null): string {
  return [
    `Primeiro nome: ${respostas.nome.trim()}`,
    `Frase-espelho escolhida: ${respostas.persona}`,
    `Situação marcada: ${respostas.situacaoOutro?.trim() || situacaoLegivel(respostas.persona, respostas.situacao) || "(não informada)"}`,
    `O que ela escreveu sobre a única coisa que mudaria tudo: "${respostas.q3.trim()}"`,
    `Palavras de identidade escolhidas: ${palavrasLegiveis(respostas.palavras).join(", ") || "(nenhuma)"}`,
    gap ? `Números que ela declarou: ${JSON.stringify(gap)}` : "Ela não declarou números.",
  ].join("\n");
}

async function escreverDiagnostico(
  entrada: string,
  reserva: () => string
): Promise<{ texto: string; degradado: boolean }> {
  if (!llmDisponivel()) return { texto: reserva(), degradado: true };

  try {
    const { texto, recusado } = await escreverTexto({
      sistema: PROMPT_DIAGNOSTICO,
      entrada,
      maxTokens: 700,
    });

    if (recusado) {
      console.warn("[tailor] diagnóstico recusado pelos classificadores");
      return { texto: reserva(), degradado: true };
    }
    if (!texto) return { texto: reserva(), degradado: true };
    return { texto, degradado: false };
  } catch (erro) {
    console.error("[tailor] falha ao gerar diagnóstico", erro);
    return { texto: reserva(), degradado: true };
  }
}

/**
 * Reserva sem modelo. Devolve as palavras dela e não afirma nada que ela não
 * tenha dito — é curto de propósito: melhor um parágrafo honesto e visivelmente
 * simples do que um texto inventado com cara de diagnóstico.
 */
function diagnosticoDeReserva(
  respostas: RespostasProposta,
  analise: Analise
): string {
  const trecho = analise.verbatimQ3 || respostas.q3.trim();
  const nome = respostas.nome.trim();
  const partes = [
    `${nome}, você me disse que a coisa que mudaria tudo é isto: "${trecho}".`,
    "Guardei essa frase porque ela é o começo do trabalho, não o fim.",
  ];
  if (respostas.palavras.length) {
    partes.push(
      `E escolheu ser lida como ${palavrasLegiveis(respostas.palavras).join(", ")} — é dali que a gente parte.`
    );
  }
  return partes.join(" ");
}

/* ==========================================================================
   Proposta da holding — a vertente decide o mundo, a faixa decide a oferta
   ========================================================================= */

/** A resposta como ela leu na tela, na língua em que respondeu. */
function respostaLegivel(p: Pergunta, valor: unknown, idioma: Idioma, moeda: MoedaCliente): string | null {
  if (valor === undefined || valor === null) return null;
  switch (p.tipo) {
    case "escolha": {
      const o = p.opcoes.find((x) => x.id === valor);
      return o ? txt(o.texto, idioma) : null;
    }
    case "faixa": {
      const o = opcoesDaFaixa(p, moeda).find((x) => x.id === valor);
      return o ? txt(o.texto, idioma) : null;
    }
    case "aberta":
      return typeof valor === "string" && valor.trim() ? `"${valor.trim()}"` : null;
    case "palavras":
      return Array.isArray(valor) ? palavrasDaHolding(p, valor, idioma).join(", ") || null : null;
    case "medida":
      return null;
  }
}

function palavrasDaHolding(p: Pergunta & { tipo: "palavras" }, ids: unknown[], idioma: Idioma): string[] {
  return ids
    .map((w) => p.opcoes.find((o) => o.id === w))
    .filter((o): o is NonNullable<typeof o> => Boolean(o))
    .map((o) => txt(o.texto, idioma));
}

/**
 * Chamado só depois de a rota validar as respostas contra a configuração e
 * conferir o ramo completo — aqui nada é revalidado, só lido.
 */
export async function montarPropostaHolding(opcoes: {
  cliente: Cliente;
  respostas: RespostasHolding;
  idioma: Idioma;
}): Promise<ConteudoProposta> {
  const { cliente, respostas: r, idioma } = opcoes;
  const moeda = moedaDe(cliente, idioma);
  const vertente = vertenteDaCena(cliente, r.cena);
  if (!vertente) throw new Error("[tailor] proposta sem vertente");

  const nome = r.nome.trim();
  const primeiroNome = nome.split(/\s+/)[0] ?? nome;
  const aberta = vertente.perguntas.find((p) => p.tipo === "aberta");
  const escrita = aberta ? r.ramo[aberta.id] : undefined;
  const frase = typeof escrita === "string" ? escrita.trim() : "";
  const medida = vertente.perguntas.find((p): p is Pergunta & { tipo: "medida" } => p.tipo === "medida");
  const gap = medida ? contaDaMedida(medida, r.ramo[medida.id]) : null;
  const perguntaPalavras = vertente.perguntas.find(
    (p): p is Pergunta & { tipo: "palavras" } => p.tipo === "palavras"
  );
  const idsPalavras = perguntaPalavras ? r.ramo[perguntaPalavras.id] : undefined;
  const palavras =
    perguntaPalavras && Array.isArray(idsPalavras) ? palavrasDaHolding(perguntaPalavras, idsPalavras, idioma) : [];
  const faixa = perguntaDeFaixa(vertente);
  const marcada = faixa ? r.ramo[faixa.id] : undefined;
  const faixaId = typeof marcada === "string" ? marcada : null;
  const cena = r.cena === CENA_LIVRE ? r.livre.trim() : txt(vertente.cena.texto, idioma);

  const linhas = vertente.perguntas
    .map((p) => {
      const lida = respostaLegivel(p, r.ramo[p.id], idioma, moeda);
      return lida ? `${txt(p.titulo, idioma).replace(/\*/g, "")} → ${lida}` : null;
    })
    .filter((l): l is string => Boolean(l));

  const analise = await analisarRespostas({ cena, q3: frase, respostas: linhas, palavras });

  const entrada = [
    `Primeiro nome: ${primeiroNome}`,
    `Cena em que ela se reconheceu: "${cena}"`,
    ...linhas,
    gap ? `Números que ela declarou: ${JSON.stringify(gap)}` : "Ela não declarou números.",
  ].join("\n");

  const reserva = () => {
    const partes = [
      txt(cliente.textos.reserva.frase, idioma, {
        nome: primeiroNome,
        // A frase dela já costuma terminar em ponto; o texto fecha a citação
        // com outro. Sem isto sai `escuras.".`.
        frase: (analise.verbatimQ3 || frase || cena).replace(/[.!?…\s]+$/u, ""),
      }),
      txt(cliente.textos.reserva.guardei, idioma),
    ];
    if (palavras.length) {
      partes.push(txt(cliente.textos.reserva.palavras, idioma, { palavras: palavras.join(", ") }));
    }
    return partes.join(" ");
  };

  const { texto: diagnostico, degradado } = await escreverDiagnostico(entrada, reserva);
  const produto = escolherOfertaDaHolding(cliente, vertente.id, faixaId, moeda);
  const nivel = produto ? vertente.niveis[produto.nivel] : undefined;

  return {
    versaoPrompt: VERSAO_PROMPT,
    vertente: vertente.id,
    cliente: cliente.id,
    leituraManual: leituraManual(r),
    nome,
    diagnostico,
    diagnosticoDegradado: degradado,
    analise: { ...analise, verbatimQ3: analise.verbatimQ3 || frase },
    gap,
    // A fita métrica é a esteira antiga (Jornada → Dossiê → Prisma), que a
    // holding desmembrou; o desenho da proposta por vertente ainda não
    // existe (handoff §10). Sem fita até existir.
    fita: null,
    palavras,
    q9: faixaId,
    // Preço exibido: o mesmo preço da configuração que decidiu QUAL produto
    // cabe — uma fonte só, sem env de checkout à parte (23/09/2026, ao mover
    // a config de cliente para o banco). `publicado` já filtrou em
    // escolherOferta; aqui só falta formatar ou cair em ◆ se a moeda não
    // tiver preço (produto com preço só em outra moeda, sinal de config
    // furada — nunca deveria chegar aqui, mas não inventa número).
    oferta: produto
      ? {
          produto: produto.id,
          nome: txt(produto.nome, idioma),
          preco: produto.preco[moeda] != null ? precoDeProduto(produto.preco[moeda]!, moeda) : "◆",
          nivel: nivel ? txt(nivel, idioma) : undefined,
          centavos: produto.preco[moeda] != null ? Math.round(produto.preco[moeda]! * 100) : undefined,
          canal: produto.canal,
          recorrencia: produto.recorrencia,
        }
      : null,
    moeda,
    idioma,
    geradoEm: new Date().toISOString(),
  };
}
