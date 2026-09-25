/**
 * Rodada dos fixtures da voz (F01–F12) contra o modelo real — o checklist
 * manual da auditoria de 24/09/2026. Cada fixture roda N vezes (padrão 3),
 * pelo mesmo `llm.ts` da produção, e cada saída passa pelo gate pós-saída.
 *
 * É chamada paga: rodar só com autorização do Willian.
 *
 *   npx tsx --conditions=react-server scripts/avaliar-voz.ts <arquivo-de-saida.json> [execucoes]
 *
 * `--conditions=react-server` faz o pacote `server-only` virar vazio fora do
 * Next. As credenciais saem de `process.env` ou do `.env.local`, lidas aqui
 * dentro: nunca vão para a linha de comando nem para o arquivo de saída.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
    if ((valor.startsWith('"') && valor.endsWith('"')) || (valor.startsWith("'") && valor.endsWith("'"))) {
      valor = valor.slice(1, -1);
    }
    if (!(chave in process.env)) process.env[chave] = valor;
  }
}

async function main() {
  const saida = process.argv[2];
  const execucoes = Number(process.argv[3] ?? 3);
  if (!saida) throw new Error("uso: avaliar-voz.ts <arquivo-de-saida.json> [execucoes]");

  carregarEnvLocal();
  // Depois do env: o llm.ts lê o nome dos modelos no import.
  const { CLIENTE } = await import("@/content/clientes");
  const { escreverTexto, llmDisponivel, provedorLLMEscolhido } = await import("@/lib/llm");
  const { prepararDiagnosticoHolding } = await import("@/lib/proposta");
  const { verificarDiagnostico } = await import("@/lib/verificar-diagnostico");
  const { FIXTURES } = await import("@/lib/voz-fixtures");

  if (!llmDisponivel()) throw new Error("nenhum provedor de texto configurado");
  const provedor = provedorLLMEscolhido().nome;
  console.log(`provedor principal: ${provedor} · ${FIXTURES.length} fixtures × ${execucoes}`);

  const resultados = [];
  for (const f of FIXTURES) {
    const preparo = prepararDiagnosticoHolding(CLIENTE, f.respostas, f.idioma);
    for (let i = 1; i <= execucoes; i++) {
      const inicio = Date.now();
      let texto = "";
      let erro: string | null = null;
      try {
        const r = await escreverTexto({ sistema: preparo.sistema, entrada: preparo.entrada, maxTokens: 700 });
        texto = r.recusado ? "" : r.texto;
        if (r.recusado) erro = "recusado";
      } catch (e) {
        erro = e instanceof Error ? e.message : String(e);
      }
      const problemas = texto ? verificarDiagnostico(texto, preparo.contexto) : ["sem texto"];
      resultados.push({ fixture: f.id, descricao: f.descricao, execucao: i, ms: Date.now() - inicio, texto, erro, problemas });
      console.log(`${f.id} #${i}: ${problemas.length ? `REPROVADO (${problemas.join("; ")})` : "ok"}`);
    }
  }

  writeFileSync(
    saida,
    JSON.stringify({ geradoEm: new Date().toISOString(), provedor, versaoVoz: "por fixture", resultados }, null, 2)
  );
  const reprovados = resultados.filter((r) => r.problemas.length).length;
  console.log(`\n${resultados.length - reprovados}/${resultados.length} passaram no gate · ${saida}`);
}

main().catch((erro) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
