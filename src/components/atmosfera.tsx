/* ==========================================================================
   ATMOSFERA — experimento de presença visual, 30/08/2026.
   Fora do §8 do BRAND-VISUAL por decisão explícita do Willian (pedido de
   "testar mais presença visual" mesmo que fure veto) — NÃO é adoção formal
   do contrato, é proposta para avaliação. Se aprovada, precisa entrar pelo
   protocolo §10 antes de virar padrão.

   A ideia não é decorar: é desenhar a própria tese do mundo, que hoje só
   existe em prosa (DESIGN.md linha 11-14) — "uma folha de molde é atravessada
   por várias curvas de tamanho sobrepostas e só uma é a sua". As curvas
   abaixo são exatamente isso, em fio, nunca em preenchimento: mesma
   disciplina de linha do resto do sistema, só que agora ocupando o vazio que
   sobrava nas telas largas em vez de deixá-lo morto.

   Lê os tokens de superfície (--rule, --ink-3, --color-gold) por herança de
   CSS custom property — funciona sem mudança em noir e em ivory (a versão
   ivory já existe em globals.css, "giz sobre tecido, caneta sobre papel").
   ========================================================================= */

export function Atmosfera() {
  return (
    <svg
      className="atmosfera"
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="atmosfera-grao">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="ruido" />
          <feColorMatrix in="ruido" type="saturate" values="0" />
        </filter>
      </defs>

      {/* Grão de tecido/papel — textura, não gradiente. Opacidade mínima de
          propósito: é presença tátil, não ruído visível. */}
      <rect width="1440" height="900" filter="url(#atmosfera-grao)" opacity="0.025" />

      {/* Curvas sobrepostas do molde-mestre — a tese do mundo, desenhada.
          Só fio, nunca preenchimento, como toda marca do sistema.

          O traçado usa `@keyframes tracar` de globals.css — definida na
          auditoria de craft-floor de 14/08 para o trilho de progresso, mas
          nunca chamada por nenhum componente até agora. `pathLength="1"`
          (SVG2) normaliza o comprimento de cada curva para 1, então
          `stroke-dasharray`/`--traco` não precisam medir nada: a curva se
          desenha como giz tocando o tecido pela primeira vez, uma única vez
          por carregamento, escalonada por curva. `prefers-reduced-motion`
          já zera a duração global — a curva aparece inteira, sem o gesto. */}
      <path
        className="atmosfera-tracar"
        d="M -80 620 C 220 460, 480 760, 780 520 S 1260 300, 1560 480"
        fill="none"
        stroke="var(--rule-2)"
        strokeWidth="1"
        pathLength="1"
        style={{ "--traco": 1, animationDelay: "0ms" } as React.CSSProperties}
      />
      <path
        className="atmosfera-tracar"
        d="M -60 180 C 260 340, 560 40, 860 260 S 1320 120, 1540 260"
        fill="none"
        stroke="var(--rule)"
        strokeWidth="1"
        pathLength="1"
        style={{ "--traco": 1, animationDelay: "260ms" } as React.CSSProperties}
      />
      <path
        className="atmosfera-tracar"
        d="M 1560 700 C 1260 540, 1040 820, 760 640 S 300 420, -40 600"
        fill="none"
        stroke="var(--rule)"
        strokeWidth="1"
        pathLength="1"
        style={{ "--traco": 1, animationDelay: "520ms" } as React.CSSProperties}
      />

      {/* Fio de grainline — a marca "sentido do tecido" de toda peça de
          molde real, nunca usada no sistema até agora. Só some no mobile
          via CSS: no celular a régua de leitura já ocupa a tela inteira. */}
      <g className="atmosfera-fio" stroke="var(--color-gold)" strokeWidth="1">
        <line x1="1260" y1="120" x2="1260" y2="420" />
        <path d="M 1260 120 l -7 16 M 1260 120 l 7 16" fill="none" />
        <path d="M 1260 420 l -7 -16 M 1260 420 l 7 -16" fill="none" />
      </g>

      {/* Cruzes de registro, na mesma notação de `.registro`, só que grandes
          e nos vazios da tela em vez de presas ao canto de um cartão. */}
      <g stroke="var(--ink-3)" strokeWidth="1" opacity="0.5">
        <g transform="translate(1180 620)">
          <line x1="-9" y1="0" x2="9" y2="0" />
          <line x1="0" y1="-9" x2="0" y2="9" />
        </g>
        <g transform="translate(140 760)" className="atmosfera-fio">
          <line x1="-9" y1="0" x2="9" y2="0" />
          <line x1="0" y1="-9" x2="0" y2="9" />
        </g>
      </g>
    </svg>
  );
}
