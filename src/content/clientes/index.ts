import { Cliente, type Idioma, type Moeda, type Texto } from "./esquema";
import { renilza } from "./renilza";

export * from "./esquema";

/**
 * O registro de clientes. Um cliente por deploy, escolhido por env; sem
 * banco, sem painel — só a fronteira certa para o dia em que houver um
 * segundo (decisão do Willian, 22/09/2026: white label desde o primeiro
 * commit, infraestrutura multi-cliente só depois de validar a Renilza).
 */
const REGISTRO = { renilza } as const;

type IdCliente = keyof typeof REGISTRO;

function idAtivo(): IdCliente {
  const pedido = process.env.NEXT_PUBLIC_TAILOR_CLIENTE ?? "renilza";
  if (pedido in REGISTRO) return pedido as IdCliente;
  throw new Error(`[tailor] cliente desconhecido: ${pedido}`);
}

/**
 * Validação na carga: configuração inválida quebra o build e o primeiro
 * import, nunca a tela de quem está respondendo. Os erros saem todos juntos,
 * com o caminho do campo, para caber numa leitura só.
 */
export function carregarCliente(bruto: unknown): Cliente {
  const r = Cliente.safeParse(bruto);
  if (r.success) return r.data;
  const linhas = r.error.issues.map((i) => `  - ${i.path.join(".") || "(raiz)"}: ${i.message}`);
  throw new Error(`[tailor] configuração de cliente inválida:\n${linhas.join("\n")}`);
}

/**
 * Migração de `voz` (24/09/2026): uma linha de `tenants` publicada antes de a
 * voz existir recebe a voz do arquivo do mesmo cliente, até o próximo
 * `sync:tenant`. Só para cliente que existe no registro — um tenant novo sem
 * voz continua falhando na validação, sem voz genérica silenciosa. Some
 * quando todas as linhas do banco tiverem a voz.
 */
export function completarVozDoRegistro(bruto: unknown): unknown {
  if (typeof bruto !== "object" || bruto === null) return bruto;
  const b = bruto as Record<string, unknown>;
  const registrado = typeof b.id === "string" ? REGISTRO[b.id as IdCliente] : undefined;
  if (!registrado) return bruto;
  const vozesDaVertente = new Map(registrado.vertentes.map((v) => [v.id, v.voz]));
  const vertentes = Array.isArray(b.vertentes)
    ? b.vertentes.map((v) => {
        if (typeof v !== "object" || v === null || "voz" in v) return v;
        const voz = vozesDaVertente.get((v as { id?: string }).id ?? "");
        return voz ? { ...v, voz } : v;
      })
    : b.vertentes;
  const faltava = !("voz" in b) || vertentes !== b.vertentes;
  if (faltava) console.warn(`[tailor] tenant '${b.id}' sem voz no banco; usando a do arquivo até o sync:tenant`);
  return { ...b, voz: b.voz ?? registrado.voz, vertentes };
}

const base = carregarCliente(REGISTRO[idAtivo()]);

/** O WhatsApp de teste sobrepõe o oficial sem tocar na configuração. */
export const CLIENTE: Cliente = {
  ...base,
  contato: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || base.contato.whatsapp,
  },
};

export function idiomaValido(valor: unknown): valor is Idioma {
  return typeof valor === "string" && valor in CLIENTE.moedaPorIdioma;
}

export function moedaDe(cliente: Cliente, idioma: Idioma): Moeda {
  return cliente.moedaPorIdioma[idioma];
}

/** Resolve um texto da configuração e troca os {marcadores}. */
export function txt(
  t: Texto,
  idioma: Idioma,
  valores?: Record<string, string | number>
): string {
  const bruto = t[idioma];
  if (!valores) return bruto;
  return bruto.replace(/\{(\w+)\}/g, (inteiro, chave: string) =>
    chave in valores ? String(valores[chave]) : inteiro
  );
}
