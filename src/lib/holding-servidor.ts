import "server-only";
import { z } from "zod";
import { IDIOMAS, moedaDe, type Cliente, type Idioma } from "@/content/clientes";
import {
  CENA_LIVRE,
  RESPOSTAS_VAZIAS,
  entradaDaMedida,
  esquemaRespostas,
  leituraManual,
  perguntaDeFaixa,
  vertenteDaCena,
  vertenteDisponivel,
  type RespostasHolding,
} from "@/lib/fluxo";
import type { DadosRespostas } from "@/lib/store";

/**
 * O corpo que o diagnóstico da holding manda às rotas. `versao: 2` separa do
 * quiz de personas, que continua vivo no modo confirmação. As respostas são
 * revalidadas aqui contra a configuração do cliente — o mesmo esquema do
 * navegador, sem confiar em nada que o cliente diga ter checado.
 */
const Base = z.object({
  versao: z.literal(2),
  leadId: z.string().uuid().nullable().optional(),
  idioma: z.enum(IDIOMAS),
  respostas: z.unknown(),
});

export const CorpoLeadHolding = Base.extend({
  nome: z.string().max(120).optional(),
  utm: z
    .object({
      source: z.string().max(120).optional(),
      medium: z.string().max(120).optional(),
      campaign: z.string().max(120).optional(),
    })
    .optional(),
});

export const CorpoPropostaHolding = Base.extend({
  nome: z.string().min(2).max(120),
  whatsapp: z.string().min(8).max(40),
  email: z.string().max(200).optional(),
});

export function ehCorpoDaHolding(bruto: unknown): boolean {
  return typeof bruto === "object" && bruto !== null && (bruto as { versao?: unknown }).versao === 2;
}

export type ResultadoRespostas =
  | { ok: true; respostas: RespostasHolding }
  | { ok: false; detalhes: unknown };

export function validarRespostas(
  cliente: Cliente,
  bruto: unknown,
  idioma: Idioma
): ResultadoRespostas {
  const moeda = moedaDe(cliente, idioma);
  const r = esquemaRespostas(cliente, moeda).safeParse(bruto);
  if (!r.success) return { ok: false, detalhes: r.error.issues };
  const respostas: RespostasHolding = { ...RESPOSTAS_VAZIAS, ...r.data };
  // Um ramo fechado nesta moeda não recebe resposta, nem por chamada direta.
  const v = vertenteDaCena(cliente, respostas.cena);
  if (v && !vertenteDisponivel(v, moeda)) return { ok: false, detalhes: "ramo_fechado" };
  return { ok: true, respostas };
}

/**
 * As colunas de `respostas` que já existiam servem à holding sem migração: a
 * frase aberta ocupa o lugar da antiga q3, as medidas as mesmas colunas (e as
 * colunas geradas do gap continuam valendo), o prazo a q8 e a faixa a q9. O
 * resto — vertente, cena, ramo inteiro — vai para `respostas_raw`, que é o
 * superset auditável de sempre.
 */
export function dadosDasRespostas(
  cliente: Cliente,
  r: RespostasHolding,
  idioma: Idioma
): DadosRespostas {
  const v = vertenteDaCena(cliente, r.cena);
  const aberta = v?.perguntas.find((p) => p.tipo === "aberta");
  const escrita = aberta ? r.ramo[aberta.id] : undefined;
  const medida = v?.perguntas.find((p) => p.tipo === "medida");
  const numeros = medida?.tipo === "medida" ? entradaDaMedida(medida, r.ramo[medida.id]) : {};
  const palavras = v?.perguntas.find((p) => p.tipo === "palavras");
  const escolhidas = palavras ? r.ramo[palavras.id] : undefined;
  const faixa = v ? perguntaDeFaixa(v) : null;
  const marcada = faixa ? r.ramo[faixa.id] : undefined;

  return {
    situacao: r.cena === CENA_LIVRE ? r.livre.trim() || null : r.cena,
    situacaoVia: r.cena === CENA_LIVRE ? "texto" : r.cena ? "opcao" : null,
    q3: typeof escrita === "string" ? escrita : null,
    q3Via: r.viaAberta ?? (typeof escrita === "string" && escrita ? "texto" : null),
    consentimentoAudioEm: r.consentimentoAudioEm,
    precoAtual: numeros.precoAtual ?? null,
    precoDesejado: numeros.precoDesejado ?? null,
    volumeMensal: numeros.volumeMensal ?? null,
    pctUsado: numeros.pctUsado ?? null,
    valorParado: numeros.valorParado ?? null,
    palavras: Array.isArray(escolhidas) ? escolhidas : null,
    q7: null,
    q8: r.prazo,
    q9: typeof marcada === "string" ? marcada : null,
    raw: {
      versao: 2,
      cliente: cliente.id,
      versaoFluxo: cliente.versaoFluxo,
      idioma,
      vertente: v?.id ?? null,
      entrada: r.entrada,
      cena: r.cena,
      livre: r.livre,
      leituraManual: leituraManual(r),
      ramo: r.ramo,
      prazo: r.prazo,
    },
  };
}
