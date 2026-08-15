import type { ItemCrossSell } from "@/lib/checkout";
import { Seta } from "@/components/molde";

/**
 * O degrau de baixo, para quem não fecha o high-ticket agora.
 *
 * Vive na Hotmart de propósito: são assinaturas, e é lá que a plataforma
 * entrega o que ela cobra — área de membros, retry de cartão recusado, suporte
 * ao comprador. O Tailor só aponta.
 *
 * Discreto por construção: vem depois da oferta, sem botão-caixa, na gramática
 * de linha do molde. O §8 do BRAND-VISUAL veta mais de um CTA acima da dobra —
 * isto está no fim da página e não compete com o Bloco 7.
 */
export function CrossSell({
  itens,
  titulo,
  nota,
  rotulos,
}: {
  itens: ItemCrossSell[];
  titulo: string;
  nota: string;
  rotulos: Record<string, { nome: string; descricao: string }>;
}) {
  if (!itens.length) return null;

  return (
    <section className="mb-p6">
      <span
        className="mb-p4 block h-px w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, var(--rule-2) 0 5px, transparent 5px 10px)",
        }}
      />
      <h3 className="mb-p2">{titulo}</h3>
      <p className="mb-p3" style={{ color: "var(--ink-2)" }}>
        {nota}
      </p>

      {itens.map((item) => (
        <a
          key={item.chave}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="block py-p2"
          style={{ minHeight: 56, textDecoration: "none", color: "inherit" }}
        >
          <span className="flex items-start gap-p2">
            <span className="piquete mt-2" />
            <span className="flex-1">
              <span className="block" style={{ color: "var(--ink)" }}>
                {rotulos[item.chave]?.nome ?? item.chave}
              </span>
              <span className="notacao mt-p1 block">
                {rotulos[item.chave]?.descricao ?? ""}
              </span>
            </span>
            <span style={{ color: "var(--ink-3)" }}>
              <Seta tamanho={12} />
            </span>
          </span>
          <span
            className="mt-p2 block h-px w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, var(--rule-2) 0 5px, transparent 5px 10px)",
            }}
          />
        </a>
      ))}
    </section>
  );
}
