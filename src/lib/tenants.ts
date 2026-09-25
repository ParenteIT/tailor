import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis";
import { CLIENTE, carregarCliente, completarVozDoRegistro, type Cliente } from "@/content/clientes";

/**
 * Multi-tenant por domínio (23/09/2026).
 *
 * Um cliente novo é uma linha em `public.tenants`, publicada por
 * `scripts/sync-tenant.ts` a partir do arquivo validado em
 * `src/content/clientes/<slug>.ts` — o arquivo continua sendo a fonte
 * revisada por PR; o banco é o que a aplicação lê em runtime, sem redeploy
 * por mudança de preço, copy ou cliente novo.
 *
 * `CLIENTE` (o registro estático de hoje, um cliente por build) segue
 * existindo como o piso de segurança: sem Supabase configurado, sem Redis,
 * com o banco fora do ar, ou sem linha para o domínio pedido, a tela nunca
 * quebra por falta de infraestrutura — ela mostra a Renilza, como sempre
 * mostrou. Local dev sem nenhuma env continua funcionando exatamente como
 * antes desta mudança.
 */

const TTL_SEGUNDOS = 300;

let redis: Redis | null | undefined;
function redisCliente(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

let supabase: SupabaseClient | null | undefined;
function supabaseCliente(): SupabaseClient | null {
  if (supabase !== undefined) return supabase;
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE;
  supabase = url && chave ? createClient(url, chave, { auth: { persistSession: false } }) : null;
  return supabase;
}

/** O host da requisição, sem porta e em minúsculas — "localhost:3000" → "localhost". */
export function hostSemPorta(host: string | null | undefined): string | null {
  if (!host) return null;
  const semPorta = host.split(":")[0]?.trim().toLowerCase();
  return semPorta || null;
}

function chaveCache(host: string): string {
  return `tailor:tenant:${host}`;
}

/**
 * Resolve o cliente pelo domínio da requisição: cache (Redis, 5 min) na
 * frente da tabela `tenants` (Supabase), com o `CLIENTE` estático como
 * último degrau. Nunca lança — uma falha de infraestrutura degrada para o
 * cliente do build, nunca vira 500 pra quem está respondendo o quiz.
 */
export async function resolverCliente(host: string | null | undefined): Promise<Cliente> {
  const chave = hostSemPorta(host);
  if (!chave) return CLIENTE;

  const cache = redisCliente();
  if (cache) {
    try {
      const guardado = await cache.get<unknown>(chaveCache(chave));
      // Revalida: uma versão guardada antes de o esquema ganhar campo novo
      // (canal e gate, 24/09) passaria sem eles, e `!p.gate` deixaria o alto
      // ticket virar oferta até o cache expirar. Inválida, cai no banco.
      if (guardado) return carregarCliente(completarVozDoRegistro(guardado));
    } catch (erro) {
      console.error("[tailor] falha ao ler tenant do cache", erro);
    }
  }

  const db = supabaseCliente();
  if (!db) return CLIENTE;

  const { data, error } = await db
    .from("tenants")
    .select("config")
    .eq("ativo", true)
    .or(`dominio.eq.${chave},dominios_extra.cs.{${chave}}`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[tailor] falha ao buscar tenant", error);
    return CLIENTE;
  }
  if (!data) return CLIENTE;

  let resolvido: Cliente;
  try {
    resolvido = carregarCliente(completarVozDoRegistro(data.config));
  } catch (erro) {
    // Config inválida no banco não derruba a tela: fica registrado e ela
    // recebe o cliente do build enquanto alguém corrige a linha.
    console.error(`[tailor] tenant do domínio '${chave}' com config inválida`, erro);
    return CLIENTE;
  }

  if (cache) {
    cache.set(chaveCache(chave), resolvido, { ex: TTL_SEGUNDOS }).catch((erro) => {
      console.error("[tailor] falha ao gravar tenant no cache", erro);
    });
  }

  return resolvido;
}
