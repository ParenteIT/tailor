import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * C6 — rate limiting nas rotas de IA.
 *
 * `verificarLimite` é um balde por processo. Numa função serverless com
 * várias instâncias, cada instância tem o seu balde, então o teto real é
 * `limite × instâncias` — proteção contra script bobo e clique repetido, não
 * contra ataque distribuído. `verificarLimiteDuravel` (abaixo) resolve isso
 * com Upstash quando as env existem; sem elas, cai neste balde local — a
 * mesma proteção de sempre, nunca menos do que já havia.
 */

interface Balde {
  contagem: number;
  reiniciaEm: number;
}

const baldes = new Map<string, Balde>();

export interface ResultadoLimite {
  permitido: boolean;
  restante: number;
  reiniciaEmSegundos: number;
}

export function verificarLimite(
  chave: string,
  limite: number,
  janelaSegundos: number
): ResultadoLimite {
  const agora = Date.now();
  const janelaMs = janelaSegundos * 1000;
  const balde = baldes.get(chave);

  if (!balde || agora >= balde.reiniciaEm) {
    baldes.set(chave, { contagem: 1, reiniciaEm: agora + janelaMs });
    return { permitido: true, restante: limite - 1, reiniciaEmSegundos: janelaSegundos };
  }

  balde.contagem += 1;
  const reiniciaEmSegundos = Math.ceil((balde.reiniciaEm - agora) / 1000);

  if (balde.contagem > limite) {
    return { permitido: false, restante: 0, reiniciaEmSegundos };
  }

  return {
    permitido: true,
    restante: limite - balde.contagem,
    reiniciaEmSegundos,
  };
}

/**
 * Identificador do chamador.
 *
 * A versão anterior lia `x-forwarded-for.split(",")[0]` — a entrada mais à
 * ESQUERDA, que é exatamente a que o cliente escreve. O comentário de então
 * justificava a confiança com "atrás da Vercel", mas o deploy é Netlify, onde
 * a borda ACRESCENTA o IP observado à direita em vez de descartar a cadeia
 * recebida. Consequência real (auditoria de 14/08/2026): um laço de curl
 * variando o cabeçalho a cada requisição caía num balde novo toda vez e o teto
 * nunca disparava — em `/api/proposal` isso é gasto ilimitado na Anthropic,
 * em `/api/transcribe` na Groq.
 *
 * A ordem abaixo é da mais confiável para a menos: cabeçalhos que a borda
 * escreve e o cliente não consegue forjar vêm primeiro; `x-forwarded-for` só
 * entra como último recurso e pela DIREITA, que é o trecho que o proxy
 * acrescentou. `x-real-ip` saiu de vez: nada nesta stack o normaliza.
 */
const CABECALHOS_DE_BORDA = [
  "x-nf-client-connection-ip", // Netlify (produção)
  "client-ip", // Netlify (legado)
  "cf-connecting-ip", // Cloudflare, se um dia entrar na frente
] as const;

export function identificarChamador(req: Request): string {
  for (const cabecalho of CABECALHOS_DE_BORDA) {
    const valor = req.headers.get(cabecalho)?.trim();
    if (valor) return valor;
  }

  // Sem cabeçalho de borda (dev local, ou plataforma desconhecida): a última
  // entrada do XFF é a que o proxy imediato acrescentou. Ainda é forjável se
  // não houver proxy nenhum na frente, e é por isso que as rotas caras têm
  // também o teto global de `verificarTetoGlobal`, que não depende de header.
  const encaminhado = req.headers.get("x-forwarded-for");
  if (encaminhado) {
    const cadeia = encaminhado.split(",").map((p) => p.trim()).filter(Boolean);
    const ultimo = cadeia.at(-1);
    if (ultimo) return ultimo;
  }

  // Falha fechado: todos os anônimos compartilham um balde só, em vez de cada
  // um ganhar o seu.
  return "sem-origem";
}

/** Limpa baldes vencidos para o Map não crescer sem limite num processo longo. */
export function limparBaldesVencidos(): void {
  const agora = Date.now();
  for (const [chave, balde] of baldes) {
    if (agora >= balde.reiniciaEm) baldes.delete(chave);
  }
}

/* ==========================================================================
   Limite durável (Upstash) — compartilhado entre instâncias
   ========================================================================= */

let clienteRedis: Redis | null | undefined;

/** `undefined` = ainda não checou; `null` = checou e não há credencial. */
function redisConfigurado(): Redis | null {
  if (clienteRedis !== undefined) return clienteRedis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  clienteRedis = url && token ? new Redis({ url, token }) : null;
  return clienteRedis;
}

// Ratelimit precisa da janela e do teto na construção — uma instância por
// combinação (chamador único), não por chave de chamador.
const limitadores = new Map<string, Ratelimit>();

function limitadorPara(redis: Redis, limite: number, janelaSegundos: number): Ratelimit {
  const chaveConfig = `${limite}:${janelaSegundos}`;
  let rl = limitadores.get(chaveConfig);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limite, `${janelaSegundos} s`),
      prefix: "tailor",
    });
    limitadores.set(chaveConfig, rl);
  }
  return rl;
}

/**
 * Mesma assinatura de `verificarLimite`, mas compartilhada entre instâncias
 * via Upstash quando `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`
 * existem. Sem elas, ou se o Upstash cair, cai para o balde local — uma
 * requisição real nunca falha por causa do rate limiter.
 */
export async function verificarLimiteDuravel(
  chave: string,
  limite: number,
  janelaSegundos: number
): Promise<ResultadoLimite> {
  const redis = redisConfigurado();
  if (!redis) return verificarLimite(chave, limite, janelaSegundos);

  try {
    const resultado = await limitadorPara(redis, limite, janelaSegundos).limit(chave);
    return {
      permitido: resultado.success,
      restante: Math.max(0, resultado.remaining),
      reiniciaEmSegundos: Math.max(0, Math.ceil((resultado.reset - Date.now()) / 1000)),
    };
  } catch (erro) {
    console.error("[tailor] Upstash indisponível, caindo para o balde local", erro);
    return verificarLimite(chave, limite, janelaSegundos);
  }
}

/* ==========================================================================
   Teto global — o limite que não depende de quem está chamando
   ========================================================================= */

/**
 * Toda identificação de chamador depende, no fim, de um cabeçalho — e
 * cabeçalho é palpite, não prova. Este teto é a rede embaixo: conta as
 * requisições da rota inteira, sem olhar quem chamou, e por isso nenhuma
 * falsificação de origem o contorna.
 *
 * Existe só nas rotas que gastam dinheiro de verdade (duas chamadas à
 * Anthropic por proposta, uma por análise, Groq por transcrição). O número é
 * deliberadamente folgado — não é para moldar tráfego legítimo, é para que uma
 * conta de API não possa crescer sem limite enquanto ninguém está olhando. Se
 * um lançamento real esbarrar nele, sobe por env sem deploy.
 */
const TETO_GLOBAL_PADRAO: Record<string, number> = {
  proposal: 120,
  analyze: 200,
  transcribe: 300,
  whatsapp: 300,
};

const JANELA_GLOBAL_SEGUNDOS = 3600;

function tetoGlobalDe(rota: string): number {
  const env = process.env[`TETO_GLOBAL_${rota.toUpperCase()}_POR_HORA`];
  const n = env ? Number(env) : Number.NaN;
  if (Number.isSafeInteger(n) && n > 0) return n;
  return TETO_GLOBAL_PADRAO[rota] ?? 200;
}

/**
 * Devolve `true` quando a rota ainda pode atender. Sem Upstash não há teto
 * global possível (um contador por processo não conta o que as outras
 * instâncias fizeram), e nesse caso libera — o limite por chamador continua
 * valendo e é o que sempre houve.
 */
export async function dentroDoTetoGlobal(rota: string): Promise<boolean> {
  const redis = redisConfigurado();
  if (!redis) return true;

  try {
    const teto = tetoGlobalDe(rota);
    const { success } = await limitadorPara(
      redis,
      teto,
      JANELA_GLOBAL_SEGUNDOS
    ).limit(`global:${rota}`);
    if (!success) {
      console.error(
        `[tailor] teto global da rota ${rota} atingido (${teto}/h) — ` +
          "requisições recusadas até a janela virar"
      );
    }
    return success;
  } catch (erro) {
    // Upstash fora do ar não pode derrubar o funil: o limite por chamador
    // segue de pé e é a proteção que existia antes deste teto.
    console.error("[tailor] Upstash indisponível no teto global", erro);
    return true;
  }
}
