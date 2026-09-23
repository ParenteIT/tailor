import { CLIENTE, txt, type Idioma } from "@/content/clientes";

/**
 * A logo do cliente: nome em caixa-alta espaçada com o degradê da
 * configuração, filete e frase-mestra. Só na tela 1 e em páginas
 * institucionais; nas outras telas o nome aparece em Cormorant, na faixa.
 * Entra por opacity+translateY (e fica parada sob reduced-motion).
 */
export function Logo({ idioma }: { idioma: Idioma }) {
  const { nome, fraseMestra, logo } = CLIENTE.marca;
  const passo = 100 / (logo.degrade.length - 1);
  const degrade = logo.degrade.map((cor, i) => `${cor} ${Math.round(i * passo)}%`).join(", ");
  return (
    <div className="h-logo">
      <span className="h-logo-nome" style={{ backgroundImage: `linear-gradient(100deg, ${degrade})` }}>
        {nome}
      </span>
      <span
        className="h-logo-filete"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, transparent, ${logo.filete} 20%, ${logo.filete} 80%, transparent)`,
        }}
      />
      <span className="h-logo-sub" style={{ color: logo.sub }}>
        {txt(fraseMestra, idioma)}
      </span>
    </div>
  );
}
