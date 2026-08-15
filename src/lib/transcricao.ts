import "server-only";

/**
 * Transcrição de áudio, atrás de uma porta única.
 *
 * Atende duas entradas, pelo mesmo provedor: o áudio gravado dentro do próprio
 * quiz (o botão de mic do modo padrão, com consentimento explícito de 1 clique)
 * e o áudio que ela manda no WhatsApp, que agora chega por
 * `/api/webhooks/whatsapp`. O que mudou no modo confirmação foi o lugar da
 * transcrição, não o provedor: ela deixou de ser feita localmente pelo Willian.
 *
 * O provedor é escolhido por env (`TRANSCRICAO_PROVEDOR`), não por código: a
 * rota chama `transcrever` e não sabe quem atendeu. Trocar de fornecedor é uma
 * variável de ambiente, não um deploy — decisão do Willian em 14/08/2026,
 * quando o console da Groq ficou inacessível e valia ter saída pronta.
 *
 * Nenhum provedor recebe SDK próprio: é uma chamada HTTP cada, e o projeto já
 * evita dependência por integração (ver asaas.ts, mesmo padrão).
 */

export type ProvedorTranscricao = "groq" | "deepgram";

export interface ResultadoTranscricao {
  texto: string;
}

interface Provedor {
  nome: ProvedorTranscricao;
  /** Nome da env que guarda a chave — usado também na mensagem de erro. */
  envDaChave: string;
  transcrever(chave: string, audio: Blob, nomeArquivo: string): Promise<string>;
}

/* ==========================================================================
   Groq — endpoint compatível com OpenAI, multipart
   ========================================================================= */

const groq: Provedor = {
  nome: "groq",
  envDaChave: "GROQ_API_KEY",

  async transcrever(chave, audio, nomeArquivo) {
    const modelo = process.env.GROQ_MODELO_TRANSCRICAO || "whisper-large-v3-turbo";

    const forma = new FormData();
    forma.append("file", audio, nomeArquivo);
    forma.append("model", modelo);
    forma.append("language", "pt");
    forma.append("response_format", "json");

    const resposta = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      { method: "POST", headers: { Authorization: `Bearer ${chave}` }, body: forma }
    );

    if (!resposta.ok) {
      const corpo = await resposta.text().catch(() => "");
      throw new Error(`Groq respondeu ${resposta.status}: ${corpo.slice(0, 300)}`);
    }

    const dados = (await resposta.json()) as { text?: string };
    return dados.text ?? "";
  },
};

/* ==========================================================================
   Deepgram — bytes crus no corpo, sem multipart
   ========================================================================= */

const deepgram: Provedor = {
  nome: "deepgram",
  envDaChave: "DEEPGRAM_API_KEY",

  async transcrever(chave, audio) {
    const modelo = process.env.DEEPGRAM_MODELO_TRANSCRICAO || "nova-2";
    const busca = new URLSearchParams({
      model: modelo,
      language: "pt-BR",
      smart_format: "true",
      punctuate: "true",
    });

    // A Deepgram recebe o arquivo cru — o `Content-Type` é o do próprio blob
    // (audio/webm vindo do MediaRecorder), sem envelope multipart.
    const resposta = await fetch(`https://api.deepgram.com/v1/listen?${busca}`, {
      method: "POST",
      headers: {
        Authorization: `Token ${chave}`,
        "Content-Type": audio.type || "audio/webm",
      },
      body: audio,
    });

    if (!resposta.ok) {
      const corpo = await resposta.text().catch(() => "");
      throw new Error(`Deepgram respondeu ${resposta.status}: ${corpo.slice(0, 300)}`);
    }

    const dados = (await resposta.json()) as {
      results?: { channels?: Array<{ alternatives?: Array<{ transcript?: string }> }> };
    };
    return dados.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
  },
};

/* ========================================================================== */

const PROVEDORES: Record<ProvedorTranscricao, Provedor> = { groq, deepgram };

/**
 * Env inválida cai na Groq em vez de derrubar a rota: um erro de digitação em
 * `TRANSCRICAO_PROVEDOR` não deve tirar o modo áudio do ar.
 */
export function provedorEscolhido(): Provedor {
  const pedido = process.env.TRANSCRICAO_PROVEDOR?.trim().toLowerCase();
  if (pedido && pedido in PROVEDORES) {
    return PROVEDORES[pedido as ProvedorTranscricao];
  }
  if (pedido) {
    console.error(
      `[tailor] TRANSCRICAO_PROVEDOR="${pedido}" não existe; usando groq. ` +
        `Válidos: ${Object.keys(PROVEDORES).join(", ")}`
    );
  }
  return groq;
}

/** A mesma guarda que `/api/transcribe` usa para decidir entre 503 e seguir. */
export function transcricaoDisponivel(): boolean {
  return Boolean(process.env[provedorEscolhido().envDaChave]);
}

/**
 * `audio` chega como veio do `MediaRecorder` do navegador — webm/opus na
 * prática. Nenhum provedor exige conversão deste lado.
 */
export async function transcrever(
  audio: Blob,
  nomeArquivo = "audio.webm"
): Promise<ResultadoTranscricao> {
  const provedor = provedorEscolhido();
  const chave = process.env[provedor.envDaChave];
  if (!chave) throw new Error(`${provedor.envDaChave} não está definida.`);

  const texto = await provedor.transcrever(chave, audio, nomeArquivo);
  return { texto: texto.trim() };
}
