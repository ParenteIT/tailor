import { NextResponse } from "next/server";
import { z } from "zod";
import { PERSONA_KEYS } from "@/content/personas";
import type { Cliente } from "@/content/clientes";
import { getStore } from "@/lib/store";
import { identificarChamador, verificarLimiteDuravel } from "@/lib/rate-limit";
import { resolverCliente } from "@/lib/tenants";
import { normalizarWhatsapp } from "@/lib/quiz-state";
import {
  CorpoLeadHolding,
  dadosDasRespostas,
  ehCorpoDaHolding,
  validarRespostas,
} from "@/lib/holding-servidor";

export const runtime = "nodejs";

/**
 * Autosave por etapa. O quiz chama isto a cada avanço para não perder o
 * progresso de alguém que fecha a aba no meio.
 *
 * LGPD — minimização: só chegam aqui os campos que o quiz de fato usa. Nome e
 * WhatsApp só existem depois do gate, quando ela decidiu entregá-los.
 */
const Corpo = z.object({
  leadId: z.string().uuid().nullable().optional(),
  persona: z.enum(PERSONA_KEYS).nullable().optional(),
  nome: z.string().max(120).optional(),
  whatsapp: z.string().max(40).optional(),
  idioma: z.string().max(10).optional(),
  // A rota hardcodava "quiz_frio" — o lead do modo confirmação virava
  // quiz_frio no primeiro autosave, e o guard de origem em store.ts nunca
  // chegava a rodar. Achado consertando o F6, registrado aqui.
  origem: z.enum(["quiz_frio", "quiz_audio", "confirmacao"]).optional(),
  respostas: z
    .object({
      situacao: z.string().max(400).nullable().optional(),
      situacaoOutro: z.string().max(2000).optional(),
      q3: z.string().max(4000).optional(),
      q3Via: z.enum(["texto", "audio"]).nullable().optional(),
      consentimentoAudioEm: z.string().max(40).nullable().optional(),
      precoAtual: z.number().nonnegative().nullable().optional(),
      precoDesejado: z.number().nonnegative().nullable().optional(),
      volumeMensal: z.number().int().nonnegative().nullable().optional(),
      pctUsado: z.number().min(0).max(100).nullable().optional(),
      valorParado: z.number().nonnegative().nullable().optional(),
      palavras: z.array(z.string().max(40)).max(3).optional(),
      q7: z.string().max(200).nullable().optional(),
      q7Outro: z.string().max(2000).optional(),
      q8: z.string().max(200).nullable().optional(),
      q9: z.string().max(200).nullable().optional(),
    })
    .optional(),
  utm: z
    .object({
      source: z.string().max(120).optional(),
      medium: z.string().max(120).optional(),
      campaign: z.string().max(120).optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  const limite = await verificarLimiteDuravel(`leads:${identificarChamador(req)}`, 40, 60);
  if (!limite.permitido) {
    return NextResponse.json(
      { erro: "muitas_requisicoes" },
      { status: 429, headers: { "Retry-After": String(limite.reiniciaEmSegundos) } }
    );
  }

  let bruto: unknown;
  try {
    bruto = await req.json();
  } catch {
    return NextResponse.json({ erro: "json_invalido" }, { status: 400 });
  }

  if (ehCorpoDaHolding(bruto)) {
    const cliente = await resolverCliente(req.headers.get("host"));
    return salvarDaHolding(bruto, cliente);
  }

  const analise = Corpo.safeParse(bruto);
  if (!analise.success) {
    return NextResponse.json(
      { erro: "corpo_invalido", detalhes: analise.error.issues },
      { status: 400 }
    );
  }

  const { leadId, persona, nome, whatsapp, idioma, origem, respostas, utm } =
    analise.data;
  const store = getStore();

  try {
    const id = await store.upsertLead(leadId ?? null, {
      persona: persona ?? null,
      nome: nome?.trim() || null,
      whatsapp: whatsapp ? normalizarWhatsapp(whatsapp) : null,
      idioma: idioma ?? "pt",
      origem,
      utm,
    });

    if (respostas) {
      await store.salvarRespostas(id, {
        situacao: respostas.situacao ?? null,
        situacaoVia: respostas.situacao ? "opcao" : null,
        q3: respostas.q3 ?? null,
        // O cliente manda a via real quando a q3 veio de transcrição; sem
        // isso, "texto" é a inferência segura de sempre.
        q3Via: respostas.q3Via ?? (respostas.q3 ? "texto" : null),
        consentimentoAudioEm: respostas.consentimentoAudioEm ?? null,
        precoAtual: respostas.precoAtual ?? null,
        precoDesejado: respostas.precoDesejado ?? null,
        volumeMensal: respostas.volumeMensal ?? null,
        pctUsado: respostas.pctUsado ?? null,
        valorParado: respostas.valorParado ?? null,
        palavras: respostas.palavras ?? null,
        q7: respostas.q7 ?? null,
        q8: respostas.q8 ?? null,
        q9: respostas.q9 ?? null,
        raw: { ...respostas },
      });
    }

    return NextResponse.json({ leadId: id });
  } catch (erro) {
    console.error("[tailor] falha ao salvar lead", erro);
    return NextResponse.json({ erro: "falha_ao_salvar" }, { status: 500 });
  }
}

/**
 * Autosave do diagnóstico da holding. Nome entra desde a tela 1 (decisão de
 * 10/09); WhatsApp e e-mail nunca passam por aqui — só no gate.
 */
async function salvarDaHolding(bruto: unknown, cliente: Cliente) {
  const corpo = CorpoLeadHolding.safeParse(bruto);
  if (!corpo.success) {
    return NextResponse.json({ erro: "corpo_invalido", detalhes: corpo.error.issues }, { status: 400 });
  }
  const { leadId, nome, idioma, utm } = corpo.data;
  const respostas = validarRespostas(cliente, corpo.data.respostas, idioma);
  if (!respostas.ok) {
    return NextResponse.json({ erro: "respostas_invalidas", detalhes: respostas.detalhes }, { status: 400 });
  }

  const store = getStore();
  try {
    const id = await store.upsertLead(leadId ?? null, {
      persona: null,
      nome: nome?.trim() || null,
      idioma,
      utm,
    });
    await store.salvarRespostas(id, dadosDasRespostas(cliente, respostas.respostas, idioma));
    return NextResponse.json({ leadId: id });
  } catch (erro) {
    console.error("[tailor] falha ao salvar lead da holding", erro);
    return NextResponse.json({ erro: "falha_ao_salvar" }, { status: 500 });
  }
}
