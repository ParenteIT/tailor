import { createHmac, randomInt, randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { POST } from "@/app/api/webhooks/whatsapp/route";
import { carregarPreenchimento } from "@/lib/confirmacao-server";
import { getStore } from "@/lib/store";

/**
 * O caminho feliz do acionamento direto, ponta a ponta contra o store real
 * (backend de arquivo, porque não há credencial de Supabase em teste).
 *
 * `webhook-whatsapp.test.ts` cobre o portão — quem NÃO entra. Este cobre o que
 * acontece com quem entra: a mensagem dela vira lead, confirmation_token e
 * verbatim, e a tela de confirmação enxerga tudo isso. Era o trabalho manual
 * que o Willian fazia com SQL; se isto quebrar, uma confissão vira um cadastro
 * vazio em silêncio.
 *
 * A suíte corre inteira pelos caminhos de degradação: sem `WHATSAPP_TOKEN` não
 * há envio nem download de mídia, sem `GROQ_API_KEY` não há transcrição, sem
 * `ANTHROPIC_API_KEY` a análise devolve o texto dela cru. Nenhuma chamada de
 * rede acontece.
 */

const SEGREDO = "app-secret-do-fluxo-whatsapp";
const NOSSO_NUMERO = "109876543210987";

const ENVS = [
  "WHATSAPP_APP_SECRET",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_TOKEN",
  "WHATSAPP_TEMPLATE_CONFIRMACAO",
  "ANTHROPIC_API_KEY",
  "GROQ_API_KEY",
  "DEEPGRAM_API_KEY",
] as const;
const ORIGINAIS = Object.fromEntries(ENVS.map((e) => [e, process.env[e]]));

beforeAll(() => {
  process.env.WHATSAPP_APP_SECRET = SEGREDO;
  process.env.WHATSAPP_PHONE_NUMBER_ID = NOSSO_NUMERO;
  delete process.env.WHATSAPP_TOKEN;
  delete process.env.WHATSAPP_TEMPLATE_CONFIRMACAO;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.GROQ_API_KEY;
  delete process.env.DEEPGRAM_API_KEY;
});

afterAll(() => {
  for (const env of ENVS) {
    const valor = ORIGINAIS[env];
    if (valor === undefined) delete process.env[env];
    else process.env[env] = valor;
  }
});

const ARQUIVO = path.join(process.cwd(), ".tailor-dev", "banco.json");

interface LeadArquivo {
  id?: string;
  origem?: string;
  whatsapp?: string;
  nome?: string | null;
  confirmationToken?: string;
  removidoEm?: string;
}

/**
 * Lê direto do arquivo, pela mesma razão de `webhook-asaas-fluxo.test.ts`:
 * verificar por um método do store que também escreve tornaria o teste de
 * reentrega verde mesmo com o webhook sem fazer nada.
 */
async function bancoDoArquivo(): Promise<{ leads: Record<string, LeadArquivo> }> {
  return JSON.parse(await readFile(ARQUIVO, "utf8")) as {
    leads: Record<string, LeadArquivo>;
  };
}

async function leadDoBanco(leadId: string): Promise<LeadArquivo | undefined> {
  return (await bancoDoArquivo()).leads[leadId];
}

async function contarLeads(): Promise<number> {
  return Object.keys((await bancoDoArquivo()).leads).length;
}

/** Par de números que só diferem pelo nono dígito, novo a cada chamada. */
function parDeNumeros() {
  const assinante = String(randomInt(10_000_000, 100_000_000));
  return { comNove: `55119${assinante}`, semNove: `5511${assinante}` };
}

function assinado(corpo: unknown): string {
  return JSON.stringify(corpo);
}

function chamar(corpoCru: string) {
  const assinatura = createHmac("sha256", SEGREDO)
    .update(Buffer.from(corpoCru, "utf8"))
    .digest("hex");
  return POST(
    new Request("https://exemplo.test/api/webhooks/whatsapp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hub-signature-256": `sha256=${assinatura}`,
      },
      body: corpoCru,
    })
  );
}

function envelope(mensagem: Record<string, unknown>, de: string, nome = "Renata Alves") {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "0",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: { phone_number_id: NOSSO_NUMERO },
              contacts: [{ wa_id: de, profile: { name: nome } }],
              messages: [mensagem],
            },
          },
        ],
      },
    ],
  };
}

function payloadTexto(de: string, texto: string, nome?: string) {
  return envelope(
    {
      id: `wamid.${randomUUID()}`,
      from: de,
      timestamp: String(Math.floor(Date.now() / 1000)),
      type: "text",
      text: { body: texto },
    },
    de,
    nome
  );
}

function payloadAudio(de: string) {
  return envelope(
    {
      id: `wamid.${randomUUID()}`,
      from: de,
      timestamp: String(Math.floor(Date.now() / 1000)),
      type: "audio",
      audio: { id: `midia.${randomUUID()}`, mime_type: "audio/ogg; codecs=opus", voice: true },
    },
    de
  );
}

interface CorpoResposta {
  resultados: Array<{ status: string; leadId?: string; respondido?: boolean; motivo?: string }>;
}

describe("acionamento direto — a mensagem dela vira lead, token e verbatim", () => {
  it("texto cria o lead com token, e a tela de confirmação lê o que ela disse", async () => {
    const { comNove } = parDeNumeros();
    const r = await chamar(
      assinado(payloadTexto(comNove, "Tenho medo de cobrar o que vale"))
    );
    expect(r.status).toBe(200);

    const { resultados } = (await r.json()) as CorpoResposta;
    expect(resultados[0].status).toBe("processada");
    // Sem WHATSAPP_TOKEN o envio degrada, e a rota segue 200 mesmo assim.
    expect(resultados[0]).toMatchObject({ respondido: false, motivo: "nao_configurado" });

    const lead = await leadDoBanco(resultados[0].leadId as string);
    expect(lead?.origem).toBe("confirmacao");
    expect(lead?.whatsapp).toBe(comNove);
    expect(lead?.nome).toBe("Renata Alves");
    expect(typeof lead?.confirmationToken).toBe("string");

    // A prova que vale: o leitor REAL enxerga o verbatim.
    const p = await carregarPreenchimento(lead?.confirmationToken as string);
    expect(p?.ouvido.q3).toContain("medo de cobrar");
    expect(p?.respostas.q3).toContain("medo de cobrar");
  });

  it("reentrega do mesmo wamid não cria nada nem troca o token", async () => {
    const { comNove } = parDeNumeros();
    const cru = assinado(payloadTexto(comNove, "Cobro pouco e trabalho demais"));

    const primeira = (await (await chamar(cru)).json()) as CorpoResposta;
    expect(primeira.resultados[0].status).toBe("processada");
    const leadId = primeira.resultados[0].leadId as string;
    const tokenAntes = (await leadDoBanco(leadId))?.confirmationToken;
    const antes = await contarLeads();

    const segunda = (await (await chamar(cru)).json()) as CorpoResposta;
    expect(segunda.resultados[0].status).toBe("duplicada");
    expect(segunda.resultados[0].leadId).toBeUndefined();
    expect(await contarLeads()).toBe(antes);
    expect((await leadDoBanco(leadId))?.confirmationToken).toBe(tokenAntes);
  });

  it("segunda mensagem do mesmo número reusa o lead e o link que ela já recebeu", async () => {
    const { comNove } = parDeNumeros();

    const primeira = (await (
      await chamar(assinado(payloadTexto(comNove, "Minha marca não parece profissional")))
    ).json()) as CorpoResposta;
    const leadId = primeira.resultados[0].leadId as string;
    const token = (await leadDoBanco(leadId))?.confirmationToken;
    const antes = await contarLeads();

    const segunda = (await (
      await chamar(assinado(payloadTexto(comNove, "Esqueci de dizer que atendo online")))
    ).json()) as CorpoResposta;

    expect(segunda.resultados[0].leadId).toBe(leadId);
    expect(await contarLeads()).toBe(antes);
    expect((await leadDoBanco(leadId))?.confirmationToken).toBe(token);
  });

  it("número sem o nono dígito cai no mesmo lead — não vira uma segunda mulher", async () => {
    const { comNove, semNove } = parDeNumeros();

    const primeira = (await (
      await chamar(assinado(payloadTexto(comNove, "Quero parar de dar desconto")))
    ).json()) as CorpoResposta;
    const leadId = primeira.resultados[0].leadId as string;
    const antes = await contarLeads();

    const segunda = (await (
      await chamar(assinado(payloadTexto(semNove, "É isso mesmo que eu quero")))
    ).json()) as CorpoResposta;

    expect(segunda.resultados[0].leadId).toBe(leadId);
    expect(await contarLeads()).toBe(antes);
  });

  it("áudio sem provedor de transcrição gera lead e link, e nada de verbatim inventado", async () => {
    const { comNove } = parDeNumeros();
    const r = await chamar(assinado(payloadAudio(comNove)));
    expect(r.status).toBe(200);

    const { resultados } = (await r.json()) as CorpoResposta;
    expect(resultados[0].status).toBe("sem_transcricao");

    const lead = await leadDoBanco(resultados[0].leadId as string);
    expect(typeof lead?.confirmationToken).toBe("string");

    const p = await carregarPreenchimento(lead?.confirmationToken as string);
    expect(p?.ouvido).toEqual({});
  });

  it("texto curto demais para ser resposta não vira verbatim", async () => {
    const { comNove } = parDeNumeros();
    const r = await chamar(assinado(payloadTexto(comNove, "oi")));
    const { resultados } = (await r.json()) as CorpoResposta;
    expect(resultados[0].status).toBe("sem_transcricao");

    const lead = await leadDoBanco(resultados[0].leadId as string);
    expect(typeof lead?.confirmationToken).toBe("string");

    const p = await carregarPreenchimento(lead?.confirmationToken as string);
    expect(p?.ouvido).toEqual({});
  });

  it("lead removido por LGPD não é reaberto pelo número — nasce um lead novo", async () => {
    const { comNove } = parDeNumeros();
    const store = getStore();
    const removido = await store.upsertLead(null, {
      nome: "Cadastro Apagado",
      whatsapp: comNove,
      origem: "confirmacao",
    });

    const banco = JSON.parse(await readFile(ARQUIVO, "utf8")) as {
      leads: Record<string, LeadArquivo>;
    };
    banco.leads[removido].removidoEm = new Date().toISOString();
    await writeFile(ARQUIVO, JSON.stringify(banco, null, 2), "utf8");

    const r = await chamar(assinado(payloadTexto(comNove, "Mudei de ideia, quero voltar")));
    const { resultados } = (await r.json()) as CorpoResposta;

    expect(resultados[0].leadId).not.toBe(removido);
    expect((await leadDoBanco(removido))?.confirmationToken).toBeUndefined();
  });
});
