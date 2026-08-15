import { NextResponse } from "next/server";
import { transcricaoDisponivel, transcrever } from "@/lib/transcricao";
import {
  dentroDoTetoGlobal,
  identificarChamador,
  verificarLimiteDuravel,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

/** 60s a ~1Mbit/s de webm/opus fica bem abaixo disto; o teto é contra abuso. */
const TAMANHO_MAXIMO_BYTES = 8 * 1024 * 1024;

/**
 * Recebe o áudio do botão de mic do quiz e devolve texto. Nada aqui persiste
 * o arquivo — ele existe só durante esta requisição, em memória, e some com
 * ela. É a mesma garantia que `audio.consentimento` promete na tela: "depois
 * de transcrito, não guardamos o arquivo".
 *
 * C6 — rate limit mais apertado que /api/leads: cada chamada custa dinheiro e
 * carrega dado de voz, uma categoria mais sensível que texto.
 */
export async function POST(req: Request) {
  const limite = await verificarLimiteDuravel(`transcribe:${identificarChamador(req)}`, 6, 60);
  if (!limite.permitido) {
    return NextResponse.json(
      { erro: "muitas_requisicoes" },
      { status: 429, headers: { "Retry-After": String(limite.reiniciaEmSegundos) } }
    );
  }

  if (!(await dentroDoTetoGlobal("transcribe"))) {
    return NextResponse.json({ erro: "transcricao_indisponivel" }, { status: 503 });
  }

  if (!transcricaoDisponivel()) {
    return NextResponse.json({ erro: "transcricao_indisponivel" }, { status: 503 });
  }

  let forma: FormData;
  try {
    forma = await req.formData();
  } catch {
    return NextResponse.json({ erro: "corpo_invalido" }, { status: 400 });
  }

  const audio = forma.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json({ erro: "audio_ausente" }, { status: 400 });
  }
  if (audio.size > TAMANHO_MAXIMO_BYTES) {
    return NextResponse.json({ erro: "audio_grande_demais" }, { status: 413 });
  }

  try {
    const resultado = await transcrever(audio);
    if (!resultado.texto) {
      return NextResponse.json({ erro: "transcricao_vazia" }, { status: 422 });
    }
    return NextResponse.json(resultado, {
      headers: { "cache-control": "no-store" },
    });
  } catch (erro) {
    console.error("[tailor] falha na transcrição", erro);
    return NextResponse.json({ erro: "falha_na_transcricao" }, { status: 502 });
  }
}
