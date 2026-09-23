import type { Cliente, Mundo } from "@/content/clientes/esquema";

/**
 * Os mundos visuais viram custom properties por `[data-vertente]`. O CSS dos
 * componentes só lê `--v-*`; a cor de cada mundo existe apenas na
 * configuração do cliente. Os valores chegam aqui já validados pelo esquema
 * (hex, rgba e linear-gradient em formato estreito, ids em camelCase), então
 * nenhum deles consegue fechar a regra e escrever outra.
 *
 * Também preenche os tokens antigos (`--surface`, `--ink`, `--accent`…):
 * primitivas compartilhadas (botão de áudio) e a página da proposta passam a
 * herdar o mundo sem conhecer vertente nenhuma.
 */

export const ID_CASA = "casa";

function declaracoes(m: Mundo): string {
  const v: Record<string, string> = {
    "--v-fundo": m.fundo,
    "--v-cartao": m.cartao,
    "--v-tinta": m.tinta,
    "--v-apoio": m.apoio,
    "--v-linha": m.linha,
    "--v-trilho": m.trilho,
    "--v-acento": m.acento,
    "--v-acento-suave": m.acentoSuave,
    "--v-ouro": m.ouro,
    "--v-botao": m.botaoFundo,
    "--v-botao-tinta": m.botaoTinta,
    "--v-raio-botao": `${m.raioBotao}px`,
    "--v-preenchimento": m.preenchimento,
    "--v-tinta-preenchida": m.tintaSobrePreenchimento,
    "--v-painel": m.painel,
    "--v-painel-tinta": m.painelTinta,
    "--v-painel-apoio": m.painelApoio,
    "--v-painel-acento": m.painelAcento,
    "--surface": m.fundo,
    "--ink": m.tinta,
    "--ink-2": m.apoio,
    "--ink-3": m.apoio,
    "--rule": m.acentoSuave,
    "--rule-2": m.linha,
    "--accent": m.acento,
    "--color-gold": m.ouro,
    "--color-gold-hi": m.acento,
    "--color-cta": m.botaoFundo,
    "--color-cta-ink": m.botaoTinta,
    "--radius-cta": `${m.raioBotao}px`,
  };
  const esquema = m.esquema === "claro" ? "light" : "dark";
  return `color-scheme:${esquema};${Object.entries(v)
    .map(([k, valor]) => `${k}:${valor}`)
    .join(";")}`;
}

export function cssDosMundos(cliente: Cliente): string {
  const regras = [
    `[data-vertente="${ID_CASA}"]{${declaracoes(cliente.casa)}}`,
    ...cliente.vertentes.map((v) => `[data-vertente="${v.id}"]{${declaracoes(v.mundo)}}`),
  ];
  return regras.join("\n");
}
