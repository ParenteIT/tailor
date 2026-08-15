import { NextResponse } from "next/server";
import { z } from "zod";
import { PERSONA_KEYS } from "@/content/personas";
import {
  emailValido,
  nomeValido,
  normalizarWhatsapp,
  whatsappValido,
} from "@/lib/quiz-state";
import { calcularExpiracao, montarProposta } from "@/lib/proposta";
import {
  dentroDoTetoGlobal,
  identificarChamador,
  verificarLimiteDuravel,
} from "@/lib/rate-limit";
import { getStore } from "@/lib/store";
import { gerarTokenProposta } from "@/lib/token";

export const runtime = "nodejs";

const Corpo = z.object({
  leadId: z.string().uuid().nullable().optional(),
  persona: z.enum(PERSONA_KEYS),
  nome: z.string().min(2).max(120),
  whatsapp: z.string().min(8).max(40),
  email: z.string().max(200).optional(),
  idioma: z.string().max(10).optional(),
  respostas: z.object({
    situacao: z.string().max(400).nullable(),
    situacaoOutro: z.string().max(2000).optional(),
    q3: z.string().min(1).max(4000),
    // Sem estes dois aqui, o upsert de `salvarRespostas` gravava NULL por cima
    // do que o autosave já tinha registrado: a submissão final do gate apagava
    // a evidência de consentimento de áudio do próprio lead que consentiu, e
    // rebaixava q3Via para "texto" mesmo quando a resposta veio de voz.
    // Achado da auditoria de 14/08/2026 — não é furo de segurança, é perda de
    // prova de LGPD causada pelo caminho legítimo.
    q3Via: z.enum(["texto", "audio"]).nullable().optional(),
    consentimentoAudioEm: z.string().max(40).nullable().optional(),
    precoAtual: z.number().nonnegative().nullable().optional(),
    precoDesejado: z.number().nonnegative().nullable().optional(),
    volumeMensal: z.number().int().nonnegative().nullable().optional(),
    pctUsado: z.number().min(0).max(100).nullable().optional(),
    valorParado: z.number().nonnegative().nullable().optional(),
    palavras: z.array(z.string().max(40)).max(3),
    q7: z.string().max(200).nullable().optional(),
    q7Outro: z.string().max(2000).optional(),
    q8: z.string().max(200).nullable().optional(),
    q9: z.string().max(200).nullable().optional(),
  }),
});

export async function POST(req: Request) {
  // Duas chamadas de modelo por requisição — o teto aqui é o mais apertado.
  const limite = await verificarLimiteDuravel(`proposal:${identificarChamador(req)}`, 5, 300);
  if (!limite.permitido) {
    return NextResponse.json(
      { erro: "muitas_requisicoes" },
      { status: 429, headers: { "Retry-After": String(limite.reiniciaEmSegundos) } }
    );
  }

  // Duas chamadas pagas à Anthropic por requisição: o teto por chamador
  // depende de cabeçalho, este não depende de nada que o cliente escreva.
  if (!(await dentroDoTetoGlobal("proposal"))) {
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

  const { leadId, persona, nome, whatsapp, email, idioma, respostas } = analise.data;

  // A validação do gate é refeita aqui: o cliente pode mentir, o servidor não
  // pode confiar nele.
  if (!nomeValido(nome) || !whatsappValido(whatsapp) || !emailValido(email ?? "")) {
    return NextResponse.json({ erro: "gate_invalido" }, { status: 400 });
  }

  const store = getStore();

  try {
    const id = await store.upsertLead(leadId ?? null, {
      persona,
      nome: nome.trim(),
      whatsapp: normalizarWhatsapp(whatsapp),
      email: email?.trim() || null,
      idioma: idioma ?? "pt",
      origem: "quiz_frio",
    });

    await store.salvarRespostas(id, {
      situacao: respostas.situacao,
      situacaoVia: respostas.situacao ? "opcao" : null,
      q3: respostas.q3,
      q3Via: respostas.q3Via ?? (respostas.q3 ? "texto" : null),
      consentimentoAudioEm: respostas.consentimentoAudioEm ?? null,
      precoAtual: respostas.precoAtual ?? null,
      precoDesejado: respostas.precoDesejado ?? null,
      volumeMensal: respostas.volumeMensal ?? null,
      pctUsado: respostas.pctUsado ?? null,
      valorParado: respostas.valorParado ?? null,
      palavras: respostas.palavras,
      q7: respostas.q7 ?? null,
      q8: respostas.q8 ?? null,
      q9: respostas.q9 ?? null,
      raw: { ...respostas },
    });

    const conteudo = await montarProposta({
      persona,
      nome,
      idioma: idioma ?? "pt",
      situacao: respostas.situacao,
      situacaoOutro: respostas.situacaoOutro,
      q3: respostas.q3,
      precoAtual: respostas.precoAtual,
      precoDesejado: respostas.precoDesejado,
      volumeMensal: respostas.volumeMensal,
      pctUsado: respostas.pctUsado,
      valorParado: respostas.valorParado,
      palavras: respostas.palavras,
      q7: respostas.q7,
      q8: respostas.q8,
      q9: respostas.q9,
    });

    const token = gerarTokenProposta();
    const proposta = await store.criarProposta(
      id,
      token,
      conteudo as unknown as Record<string, unknown>,
      calcularExpiracao()
    );

    return NextResponse.json({
      leadId: id,
      token: proposta.token,
      url: `/p/${proposta.token}`,
      expiraEm: proposta.expiraEm,
    });
  } catch (erro) {
    console.error("[tailor] falha ao gerar proposta", erro);
    return NextResponse.json({ erro: "falha_ao_gerar" }, { status: 500 });
  }
}
