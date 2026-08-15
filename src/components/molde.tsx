"use client";

import type { CSSProperties, ReactNode } from "react";

/* ==========================================================================
   A FOLHA DE MOLDE — primitivas
   Cada marca aqui é notação de molde real. Uma linha tracejada é a linha de
   costura (o que ainda não foi decidido); uma linha sólida é a linha de corte
   (a decisão tomada). O piquete marca um ponto de encontro. Nada é enfeite.
   ========================================================================= */

/** Cruz de registro — alinha duas folhas sobrepostas. */
export function Registro({ estilo }: { estilo: CSSProperties }) {
  return <span className="registro" style={estilo} aria-hidden />;
}

/**
 * O tique do giz marcando o tecido: 8ms de vibração no instante de marcar uma
 * escolha. Feedback sensorial sem nenhum pixel — Android (a maioria do público)
 * vibra, iOS ignora em silêncio. `prefers-reduced-motion` desliga, como
 * desliga todo o resto do movimento.
 */
export function tique() {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  if (
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }
  navigator.vibrate?.(8);
}

/**
 * Rola até um elemento respeitando `prefers-reduced-motion` — o scroll é
 * navegação, não animação, mas o movimento suave continua sendo movimento.
 */
export function rolarAte(
  el: Element | null,
  block: ScrollLogicalPosition = "start"
) {
  if (!el) return;
  const reduz =
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block, behavior: reduz ? "auto" : "smooth" });
}

/**
 * O traço sob uma decisão. A linha de costura (tracejada) permanece embaixo;
 * a linha de corte (sólida, no acento dela) se DESENHA por cima quando ela
 * marca — scaleX da esquerda, o mesmo gesto do giz riscando. Antes a troca era
 * instantânea; agora a decisão é riscada, não um estado trocado.
 */
export function TracoDecisao({
  marcada,
  className,
}: {
  marcada: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative block h-px w-full ${className ?? ""}`}
      aria-hidden
    >
      <span
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, var(--rule-2) 0 5px, transparent 5px 10px)",
        }}
      />
      <span
        className="absolute inset-0"
        style={{
          background: "var(--accent)",
          transform: `scaleX(${marcada ? 1 : 0})`,
          transformOrigin: "left",
          transition:
            "transform 360ms cubic-bezier(0.16, 1, 0.3, 1), background 360ms ease",
        }}
      />
    </span>
  );
}

/**
 * A seta do sistema: um traço, não um glifo de fonte. `→` (U+2192) não existe
 * no subset self-hosted da Jost e cai para a fonte do sistema — foi assim que
 * o botão primário saiu quebrado. Desenhada com o mesmo peso de traço do
 * resto do mundo (1.5, herda `currentColor`), nunca preenchida.
 */
export function Seta({ tamanho = 13 }: { tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ flex: "none" }}
    >
      <path
        d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A folha: o campo onde a peça é traçada. As quatro cruzes de registro marcam
 * os cantos, como numa folha impressa de verdade.
 */
export function Folha({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <Registro estilo={{ top: -6, left: -6 }} />
      <Registro estilo={{ top: -6, right: -6 }} />
      <Registro estilo={{ bottom: -6, left: -6 }} />
      <Registro estilo={{ bottom: -6, right: -6 }} />
      {children}
    </div>
  );
}

/**
 * O trilho de giz: a linha que o alfaiate risca antes de cortar. É o indicador
 * de progresso — traçado sólido até onde ela chegou, tracejado adiante, com um
 * piquete por peça concluída.
 *
 * Não é barra de urgência (que o §8 do BRAND-VISUAL veta): não conta vagas nem
 * tempo, só diz onde ela está no molde.
 */
export function TrilhoDeGiz({
  progresso,
  marcas,
  rotulo,
}: {
  progresso: number;
  marcas: number[];
  rotulo: string;
}) {
  return (
    <div
      className="pointer-events-none fixed top-0 bottom-0 left-2 z-40 w-6 sm:left-4"
      role="progressbar"
      aria-valuenow={Math.round(progresso)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={rotulo}
    >
      <span
        className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--rule) 0 4px, transparent 4px 9px)",
        }}
      />
      {/* O traçado cresce por transform, não por height: animar layout numa
          barra que acompanha o scroll é o caminho mais curto para jank. O
          background também transiciona: quando ela escolhe a frase-espelho e
          --accent vira a cor dela, todo o caminho já riscado se torna dela —
          visivelmente, não num corte seco. Paint-only, zero layout. */}
      <span
        className="absolute top-0 bottom-0 left-1/2 w-px"
        style={{
          background: "var(--accent)",
          transform: `translateX(-50%) scaleY(${progresso / 100})`,
          transformOrigin: "top",
          transition:
            "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), background 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      {marcas.map((marca) => (
        <span
          key={marca}
          className="absolute left-1/2 h-px"
          style={{
            top: `${marca}%`,
            width: 11,
            background: marca <= progresso ? "var(--accent)" : "var(--rule)",
            transform: `translateX(-50%) scaleX(${marca <= progresso ? 1 : 0.55})`,
            transition: "transform 500ms ease, background 500ms ease",
          }}
        />
      ))}
    </div>
  );
}

/** Notação da peça: Jost, caixa alta, com o filete dourado de abertura. */
export function Notacao({ children }: { children: ReactNode }) {
  return (
    <p className="filete notacao mb-p3">
      <span>{children}</span>
    </p>
  );
}

/**
 * Uma opção é uma linha a traçar, não um cartão. Tracejada enquanto latente,
 * sólida quando escolhida — e o piquete cresce.
 */
export function LinhaOpcao({
  children,
  selecionada,
  onClick,
  sublinha,
}: {
  children: ReactNode;
  selecionada: boolean;
  onClick: () => void;
  sublinha?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        tique();
        onClick();
      }}
      aria-pressed={selecionada}
      className="group block w-full cursor-pointer py-p2 text-left"
      style={{ minHeight: 56 }}
    >
      <span className="flex items-start gap-p2">
        <span
          className="piquete mt-2"
          data-marcado={selecionada}
          style={{
            transform: `scaleY(${selecionada ? 1.45 : 1})`,
            transformOrigin: "top",
            transition: "transform 220ms ease, background 220ms ease",
          }}
        />
        <span className="flex-1">
          <span
            className="block leading-snug"
            style={{
              color: selecionada ? "var(--ink)" : "var(--ink-2)",
              transition: "color 220ms ease",
            }}
          >
            {children}
          </span>
          {sublinha ? (
            <span className="notacao mt-p1 block">{sublinha}</span>
          ) : null}
        </span>
      </span>
      <TracoDecisao marcada={selecionada} className="mt-p2" />
    </button>
  );
}

/**
 * Um traço de ajuste fino: menos é um risco, mais é uma cruz de giz. Desenhados
 * como a Seta — 1.5px, currentColor, nunca preenchidos. São o degrau exato que
 * o dedo não alcança no trilho (um passo de slider mede ~3px num aparelho de
 * 360px; o dedo oclui ±7 passos).
 */
function RiscoAjuste({ mais }: { mais?: boolean }) {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={mais ? "M2.5 8h11M8 2.5v11" : "M2.5 8h11"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A régua de medida. O valor vive acima em Cormorant; o trilho tem graduações
 * reais, e o cursor é uma marca de giz — não a bolinha de um app.
 *
 * Enquanto `latente`, o número mostra o padrão da faixa mas ainda não é dela:
 * tinta clara e linha de costura embaixo. No primeiro toque a sublinha vira
 * corte — a mesma gramática de todo o resto. O slider explora; os dois riscos
 * nas pontas acertam o valor exato (NN/g: slider para explorar, passo fino
 * para precisão — e o número exato é a tese do produto).
 */
export function ReguaMedida({
  rotulo,
  valor,
  min,
  max,
  step,
  formatar,
  graduacoes,
  onChange,
  nota,
  latente,
  rotuloMenos,
  rotuloMais,
}: {
  rotulo: string;
  valor: number;
  min: number;
  max: number;
  step: number;
  formatar: (v: number) => string;
  graduacoes: number[];
  onChange: (v: number) => void;
  nota?: string;
  /** A medida ainda não foi tocada: o valor exibido é padrão, não declaração. */
  latente?: boolean;
  rotuloMenos?: string;
  rotuloMais?: string;
}) {
  const id = `regua-${rotulo.replace(/\W+/g, "-").toLowerCase()}`;
  const ajustar = (delta: number) => {
    tique();
    onChange(Math.min(max, Math.max(min, valor + delta)));
  };
  return (
    <div className="mb-p4">
      <label htmlFor={id} className="notacao mb-p1 block">
        {rotulo}
      </label>
      <p className="medida mb-p2">
        <span
          className="inline-block"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.9rem, 8vw, 2.6rem)",
            lineHeight: 1.05,
            color: latente ? "var(--ink-3)" : "var(--ink)",
            borderBottom: latente
              ? "1px dashed var(--rule-2)"
              : "1px solid var(--accent)",
            paddingBottom: 3,
            transition: "color 360ms ease, border-color 360ms ease",
          }}
        >
          {formatar(valor)}
        </span>
      </p>
      <div className="flex items-center gap-p2">
        <button
          type="button"
          onClick={() => ajustar(-step)}
          disabled={valor <= min}
          aria-label={`${rotuloMenos ?? "−"} · ${rotulo}`}
          className="flex cursor-pointer items-center justify-center"
          style={{
            width: 44,
            height: 44,
            flex: "none",
            color: valor <= min ? "var(--ink-3)" : "var(--ink-2)",
          }}
        >
          <RiscoAjuste />
        </button>
        <input
          id={id}
          type="range"
          className="regua"
          min={min}
          max={max}
          step={step}
          value={valor}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <button
          type="button"
          onClick={() => ajustar(step)}
          disabled={valor >= max}
          aria-label={`${rotuloMais ?? "+"} · ${rotulo}`}
          className="flex cursor-pointer items-center justify-center"
          style={{
            width: 44,
            height: 44,
            flex: "none",
            color: valor >= max ? "var(--ink-3)" : "var(--ink-2)",
          }}
        >
          <RiscoAjuste mais />
        </button>
      </div>
      <div className="mt-p2 flex justify-between" aria-hidden>
        {graduacoes.map((g) => (
          <span key={g} className="notacao" style={{ fontSize: "0.625rem" }}>
            {formatar(g)}
          </span>
        ))}
      </div>
      {nota ? (
        <p className="notacao mt-p1" style={{ letterSpacing: "0.06em" }}>
          {nota}
        </p>
      ) : null}
    </div>
  );
}

/** Campo aberto: linha de base, como o caderno da costureira. Sem caixa. */
export function CampoAberto({
  rotulo,
  valor,
  placeholder,
  onChange,
  linhas = 4,
}: {
  rotulo: string;
  valor: string;
  placeholder?: string;
  onChange: (v: string) => void;
  linhas?: number;
}) {
  const id = `campo-${rotulo.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="mb-p3">
      <label htmlFor={id} className="notacao mb-p1 block">
        {rotulo}
      </label>
      <textarea
        id={id}
        className="campo"
        rows={linhas}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          // No webview, o teclado sobe e o justify-center pode deixar o campo
          // colado no topo ou coberto. Espera o teclado abrir e centraliza.
          const alvo = e.currentTarget;
          window.setTimeout(() => rolarAte(alvo, "center"), 260);
        }}
      />
    </div>
  );
}

function IconeMic() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="6" y="2" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2M6 14h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Um ponto que respira: o único indicador de "estou gravando" — opacidade,
    nunca escala nem cor piscando, e some sob `prefers-reduced-motion`. */
function PulsoGravando() {
  return (
    <span
      aria-hidden
      className="pulso-gravando"
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--color-alerta, currentColor)",
      }}
    />
  );
}

/**
 * O botão de mic de toda pergunta aberta. Estado por estado, não é uma barra
 * de progresso de upload — é a mesma disciplina de notação do resto do mundo:
 * texto claro sobre o que está acontecendo, nunca um spinner genérico.
 *
 * O consentimento (§9 do copy deck) é uma etapa própria, não um checkbox:
 * ela lê a frase inteira antes de qualquer `getUserMedia` ser chamado.
 */
export function BotaoAudio({
  estado,
  suportado,
  textos,
  onIniciar,
  onConsentir,
  onRecusar,
  onParar,
}: {
  estado: "ocioso" | "consentindo" | "gravando" | "transcrevendo" | "erro";
  suportado: boolean;
  textos: {
    convite: string;
    consentimento: string;
    consentir: string;
    recusar: string;
    gravando: string;
    parar: string;
    transcrevendo: string;
    erro: string;
  };
  onIniciar: () => void;
  onConsentir: () => void;
  onRecusar: () => void;
  onParar: () => void;
}) {
  if (!suportado) return null;

  if (estado === "consentindo") {
    return (
      <div className="mt-p2">
        <p className="notacao mb-p2" style={{ color: "var(--ink-2)" }}>
          {textos.consentimento}
        </p>
        <div className="flex flex-wrap items-center gap-p3">
          <AcaoDiscreta onClick={onConsentir}>{textos.consentir}</AcaoDiscreta>
          <AcaoDiscreta onClick={onRecusar}>{textos.recusar}</AcaoDiscreta>
        </div>
      </div>
    );
  }

  if (estado === "gravando") {
    return (
      <button
        type="button"
        onClick={onParar}
        className="notacao mt-p2 inline-flex cursor-pointer items-center gap-p2"
        style={{ color: "var(--color-alerta, var(--ink))" }}
      >
        <PulsoGravando />
        {textos.gravando} · {textos.parar}
      </button>
    );
  }

  if (estado === "transcrevendo") {
    return (
      <p className="notacao mt-p2" style={{ color: "var(--ink-3)" }}>
        {textos.transcrevendo}
      </p>
    );
  }

  if (estado === "erro") {
    return (
      <button
        type="button"
        onClick={onIniciar}
        className="notacao mt-p2 cursor-pointer"
        style={{ color: "var(--ink-3)" }}
      >
        {textos.erro}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onIniciar}
      className="notacao mt-p2 inline-flex cursor-pointer items-center gap-p2"
      style={{ color: "var(--ink-3)" }}
    >
      <IconeMic />
      {textos.convite}
    </button>
  );
}

export function CampoLinha({
  rotulo,
  valor,
  placeholder,
  tipo = "text",
  autoComplete,
  inputMode,
  nome,
  enterKeyHint,
  erro,
  onChange,
}: {
  rotulo: string;
  valor: string;
  placeholder?: string;
  tipo?: "text" | "tel" | "email";
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email";
  /** Atributo `name` — o autofill dos webviews decide por heurística dele. */
  nome?: string;
  enterKeyHint?: "next" | "go" | "done";
  erro?: string | null;
  onChange: (v: string) => void;
}) {
  const id = `linha-${rotulo.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="mb-p3">
      <label htmlFor={id} className="notacao mb-p1 block">
        {rotulo}
      </label>
      <input
        id={id}
        type={tipo}
        name={nome}
        className="campo"
        value={valor}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {erro ? (
        // Alerta tem tinta própria — nunca o acento de uma persona. Ver
        // --color-alerta em globals.css.
        <p
          id={`${id}-erro`}
          role="alert"
          className="mt-p1"
          style={{ color: "var(--color-alerta)", fontSize: "var(--text-apoio)" }}
        >
          {erro}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Ação primária: rótulo de papel sobre o tecido escuro. Ivory chapado, não
 * ouro — a regra 1 do §2.4 veta botão sólido dourado, e o ouro fica reservado
 * ao filete e ao reveal.
 */
/**
 * Ação primária. O peso vem de área e contraste, nunca de sombra — a régua de
 * espaço do §4 dá ao botão a mesma disciplina de respiro que o resto da folha:
 * pouco preenchido é "isso é barato"; o CTA precisa do oposto.
 */
export function Acao({
  children,
  onClick,
  desabilitada,
  tipo = "button",
  carregando,
  acentuada,
  form,
}: {
  children: ReactNode;
  onClick?: () => void;
  desabilitada?: boolean;
  tipo?: "button" | "submit";
  carregando?: boolean;
  /** Depois que ela escolhe a frase-espelho, o traço passa a ser dela. */
  acentuada?: boolean;
  /** Liga o botão a um <form> pelo id — o Enter do teclado passa a enviar. */
  form?: string;
}) {
  const ativa = !desabilitada && !carregando;
  const corBorda = ativa
    ? acentuada
      ? "var(--accent)"
      : "var(--ink)"
    : "var(--rule-2)";
  return (
    <button
      type={tipo}
      form={form}
      onClick={onClick}
      disabled={desabilitada || carregando}
      className="notacao inline-flex items-center gap-p2 px-p4 py-p3"
      style={{
        background: ativa ? "var(--ink)" : "transparent",
        color: ativa ? "var(--surface)" : "var(--ink-3)",
        border: `1px solid ${corBorda}`,
        borderRadius: 2,
        cursor: ativa ? "pointer" : "not-allowed",
        minHeight: 56,
        transform: "scale(1)",
        transition:
          "transform 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease",
      }}
      onMouseDown={(e) => {
        if (ativa) e.currentTarget.style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
      {carregando ? null : <Seta />}
    </button>
  );
}

export function AcaoDiscreta({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  // O alvo é o botão (44px de altura e respiro horizontal p2); a sublinha fica
  // no span interno para continuar do tamanho do texto, não do alvo.
  return (
    <button
      type="button"
      onClick={onClick}
      className="notacao inline-flex cursor-pointer items-center px-p2"
      style={{ color: "var(--ink-3)", minHeight: 44, minWidth: 44 }}
    >
      <span
        style={{ borderBottom: "1px solid var(--rule-2)", paddingBottom: 2 }}
      >
        {children}
      </span>
    </button>
  );
}
