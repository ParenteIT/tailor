import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // O pacote server-only lança ao ser importado fora do runtime de servidor
      // do Next. No teste, o que importa é a lógica do módulo, não a guarda.
      "server-only": fileURLToPath(new URL("./src/test/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Os testes de fluxo (webhook do Asaas, webhook do WhatsApp) exercitam o
    // store de verdade, e o backend de arquivo é UM `.tailor-dev/banco.json`
    // com leitura-modificação-escrita. Em paralelo, dois arquivos de teste
    // sobrescrevem o trabalho um do outro e chegam a ler o JSON pela metade —
    // observado em 14/08/2026, quando o segundo webhook entrou na suíte.
    fileParallelism: false,
  },
});
