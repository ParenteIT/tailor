/**
 * Publica um cliente em `public.tenants` (Supabase), a partir do arquivo
 * validado em `src/content/clientes/<slug>.ts` — a fonte revisada por PR.
 * A aplicação lê o banco em runtime (`src/lib/tenants.ts`); depois de
 * publicado, mudar preço ou copy pede rodar este comando de novo, não deploy.
 *
 * Uso:
 *   npm run sync:tenant -- renilza
 *
 * Fala com a API REST do Supabase (PostgREST) por HTTP puro, sem
 * `@supabase/supabase-js` — o mesmo padrão de `asaas.ts`/`transcricao.ts`
 * (uma chamada por provedor, sem SDK). Motivo concreto, não só estilo: o SDK
 * monta o cliente de realtime no import, e ele lança
 * "Node.js 20 detected without native WebSocket support" ao rodar num Node
 * puro (fora do runtime do Next, que tem o polyfill) — exatamente este
 * script, rodado com `tsx` no terminal. `src/lib/tenants.ts` continua com o
 * SDK, porque roda dentro do Next.js/Netlify Functions, onde isso nunca deu
 * problema (é o mesmo cliente que `store.ts` já usa em produção).
 *
 * Lê SUPABASE_URL e SUPABASE_SERVICE_ROLE de `process.env`, com um fallback
 * manual para `.env.local` (o projeto não usa dotenv em lugar nenhum; isto
 * evita adicionar a dependência só por causa deste script).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

function carregarEnvLocal(): void {
  const arquivo = path.resolve(process.cwd(), ".env.local");
  if (!existsSync(arquivo)) return;
  for (const linha of readFileSync(arquivo, "utf8").split("\n")) {
    const l = linha.trim();
    if (!l || l.startsWith("#")) continue;
    const igual = l.indexOf("=");
    if (igual === -1) continue;
    const chave = l.slice(0, igual).trim();
    let valor = l.slice(igual + 1).trim();
    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }
    if (!(chave in process.env)) process.env[chave] = valor;
  }
}

function cabecalhos(chaveServico: string): HeadersInit {
  return {
    apikey: chaveServico,
    Authorization: `Bearer ${chaveServico}`,
  };
}

/** A versão é só rastro de auditoria (não lida pela aplicação) — 0 se a linha ainda não existe. */
async function versaoAtual(url: string, chaveServico: string, id: string): Promise<number> {
  const resposta = await fetch(
    `${url}/rest/v1/tenants?id=eq.${encodeURIComponent(id)}&select=versao`,
    { headers: cabecalhos(chaveServico) }
  );
  if (!resposta.ok) return 0;
  const linhas = (await resposta.json()) as { versao: number }[];
  return linhas[0]?.versao ?? 0;
}

async function publicarTenant(
  url: string,
  chaveServico: string,
  linha: Record<string, unknown>
): Promise<void> {
  const resposta = await fetch(`${url}/rest/v1/tenants?on_conflict=id`, {
    method: "POST",
    headers: {
      ...cabecalhos(chaveServico),
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(linha),
  });
  if (!resposta.ok) {
    const corpo = await resposta.text().catch(() => "");
    throw new Error(`Supabase respondeu ${resposta.status}: ${corpo.slice(0, 500)}`);
  }
}

async function main(): Promise<void> {
  carregarEnvLocal();

  const slug = process.argv[2];
  if (!slug) {
    console.error("uso: npm run sync:tenant -- <slug>  (ex.: renilza)");
    process.exit(1);
  }

  const url = process.env.SUPABASE_URL;
  const chaveServico = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !chaveServico) {
    console.error(
      "faltam SUPABASE_URL / SUPABASE_SERVICE_ROLE (em process.env ou em .env.local)"
    );
    process.exit(1);
  }

  const arquivoCliente = path.resolve(process.cwd(), "src/content/clientes", `${slug}.ts`);
  if (!existsSync(arquivoCliente)) {
    console.error(`não existe src/content/clientes/${slug}.ts`);
    process.exit(1);
  }

  // Import relativo, não pelo alias @/ — este script roda fora do Next.
  const { carregarCliente } = await import("../src/content/clientes/index");
  const modulo: Record<string, unknown> = await import(`../src/content/clientes/${slug}`);
  const bruto = modulo[slug] ?? modulo.default;
  if (!bruto) {
    console.error(`src/content/clientes/${slug}.ts não exporta '${slug}' nem um default`);
    process.exit(1);
  }

  // A mesma validação da carga em build — nada sobe pro banco fora do
  // formato que a aplicação sabe ler. Lança e para aqui se estiver inválido.
  const cliente = carregarCliente(bruto);

  const antes = await versaoAtual(url, chaveServico, cliente.id);
  const nova = antes + 1;

  await publicarTenant(url, chaveServico, {
    id: cliente.id,
    dominio: cliente.dominio,
    dominios_extra: cliente.dominiosExtra ?? [],
    config: cliente,
    ativo: true,
    versao: nova,
  });

  const extras = cliente.dominiosExtra?.length ?? 0;
  console.log(
    `[tailor] tenant '${cliente.id}' publicado em '${cliente.dominio}'` +
      (extras ? ` (+ ${extras} domínio(s) extra)` : "") +
      ` — versão ${nova}.`
  );
  console.log(
    "[tailor] o cache (Redis, 5 min) só perde a versão antiga sozinho; pra ver a mudança na hora, limpe a chave tailor:tenant:<dominio>."
  );
}

main().catch((erro) => {
  console.error("[tailor] falha inesperada ao publicar tenant:", erro);
  process.exit(1);
});
