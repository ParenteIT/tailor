# Design — Tailor

<!-- impeccable:design-doc 1 -->

Registro do mundo visual **como construído**, não como pretendido. Onde este
arquivo e `BRAND-VISUAL.md` v1.1 divergirem, a divergência está marcada e
precisa voltar para o documento de marca pelo protocolo do §10.

## O mundo: A Folha de Molde

Giz de alfaiate sobre tecido escuro. Uma folha de molde é atravessada por
várias curvas de tamanho sobrepostas e **só uma é a sua** — e é isso que o
produto faz: a pessoa escolhe a frase-espelho, duas curvas apagam, a dela
permanece traçada.

A escolha do mundo não veio de ranking: veio do sorteio do `concept-seed`
(candidato 6 de 7, chave `1d77bb43`), e o quilt, a bancada de osciloscópio e o
dossiê de espionagem foram pesados e perderam — o quilt por exigir histórias de
outras mulheres que não existem, a bancada por violar a paleta travada, o
dossiê por inverter a emoção (gramática de vigilância sobre alguém admitindo
vergonha).

**A tese:** um molde é o único desenho que só existe porque uma pessoa
específica existe. O que este mundo recusa é a pilha de cards do funil de quiz:
sem caixas, sem barra de progresso genérica, sem eyebrow decorativo.

## Superfície: o arco noir → ivory

A troca de fundo **é o produto**, não decoração.

| Etapa | Superfície | Por quê |
|---|---|---|
| Questionário | `--noir #141009` | Ela escreve algo que tem vergonha de dizer em voz alta. Superfície escura reduz a sensação de exposição. |
| Proposta | `--ivory #F6EFE1` | Onde ela é lida: leitura longa, números, decisão. |

Isso executa a frase-mestra da marca ("do valor invisível ao valor percebido")
como mecânica, e obedece literalmente à regra 4 do §2.4 — noir é o padrão,
ivory é para ler. Implementado por `[data-superficie="ivory"]`, que redefine
`--surface`/`--ink`/`--rule` em vez de trocar classes.

## Tokens

Núcleo e derivados vêm do `BRAND-VISUAL.md` §2. Duas divergências, ambas de
contraste medido, ambas a reconciliar:

| Token | BRAND-VISUAL | Aqui | Motivo |
|---|---|---|---|
| `--ivory-3` | `rgba(246,239,225,.48)` | `.55` | Medido sobre noir, `.48` dá ~4,5:1 — em cima do mínimo, e a notação vive em 12px. |
| `--ink-3` (sobre ivory) | não especificado | `rgba(20,16,9,.64)` | `.5` reprova em 4.5:1, e este token carrega o aviso do checkout mock e o texto de segurança. |

**Acento por persona** — extensão de produto, **não presente no BRAND-VISUAL**:
`--patricia #C17B83` (rosa-argila), `--camila #BC7C4E` (âmbar-terra),
`--carla #6F9B85` (verde-sálvia). Recalibrados em 13/08/2026 para a mesma faixa
de saturação do `--terra`: os valores originais do brief (#D98A93 / #C97F45 /
#7E9B8A) tinham origem cromática dispersa e liam como enxerto ao lado do ouro.
Aplicados como
`--accent` no instante em que ela escolhe a frase-espelho, sob a mesma
disciplina de área do ouro: filete, ponto, marca de giz — nunca preenchimento.
Ela não sabe que foi segmentada; sente que a coisa é dela. Precisa entrar como
decisão registrada.

## Gramática

Toda marca é notação de molde real. Nenhuma é enfeite.

| Marca | Significado | Implementação |
|---|---|---|
| Linha tracejada | Linha de costura — a opção ainda latente | `repeating-linear-gradient` monocromático (padrão de traço, não gradiente de cor) |
| Linha sólida | Linha de corte — a decisão tomada | `1px solid var(--accent)` |
| Piquete | Ponto de encontro | `.piquete`, cresce por `scaleY` ao ser marcado |
| Cruz de registro | Alinhamento de folhas sobrepostas | `.registro`, nos quatro cantos da folha |
| Hachura | Margem de costura — o gap entre o que ela cobra e o que quer cobrar | `.hachura`, 45° |
| Filete de 36×1px | Abertura de peça | `.filete::before`, o gesto-assinatura do §4 |

**O trilho de giz** substitui a barra de progresso: uma linha vertical fixa à
esquerda, traçada sólida até onde ela chegou, tracejada adiante, com um piquete
por peça. Nasce em 15% (endowed progress) e não conta vaga nem tempo — o §8 do
BRAND-VISUAL veta essa gramática.

## Tipografia

`Cormorant Garamond` (a voz) · `Jost` (o rigor) · `Hanken Grotesk` (a leitura),
via `next/font/google`. O display vive atrás de **um único token**
(`--font-display`) porque o §3.1-BIS já registra que Cormorant sinaliza tier DIY
e sai em setembro: a troca é aquela linha e o import.

Escala do §3.2, entrelinha 1.6 no corpo, medida travada em `68ch`, container de
leitura em 680px. Itálico do display é o único recurso de ênfase — negrito em
título está vetado e não aparece.

## Forma

- Espaço na régua de 8px: `8 · 16 · 24 · 40 · 64 · 104 · 168`, como tokens
  `--spacing-p1..p7`. Nenhum valor cru fora dela.
- Cantos de 2px.
- **Sombra: nenhuma.** Profundidade vem de linha e contraste de superfície. A
  única exceção é o anel de foco do slider, que é acessibilidade, não relevo.
- Alvos de toque ≥ 44px em tudo que se toca.

## Movimento

Um momento autorado, não efeitos espalhados: **o traçado do giz**. O trilho
cresce por `transform: scaleY` e os piquetes por `scaleX` — nunca por `height`
ou `width`, que causam thrash de layout numa barra que acompanha o scroll. A
entrada de tela é `surgir` (620ms, exponencial, saindo de um estado já visível).
`prefers-reduced-motion` desliga tudo.

## O que a fita métrica desenha (C4 × C2)

Duas leituras convivem, e a distinção é deliberada:

- **HOJE e SUA META** são aritmética — a posição exata do que ela declarou na
  escala dela.
- **Os três piquetes das estações** mostram onde a jornada de identidade cruza
  essa escala, e **não carregam valor**. Escrever um preço na estação final
  seria prometer que ela chega lá, o que C2 proíbe.

O teto é limitado a 3× o preço atual antes de a meta dela entrar — o
arredondamento "bonito" sozinho já estourou isso uma vez (1.200 virou régua de
5.000, ou 4,17×). Travado por teste em `src/lib/conselho.test.ts`.

## Vetos respeitados

Ouro ≤3% de área (o botão primário é ivory chapado, não dourado) · sem
gradiente decorativo, metálico ou brilho · sem emoji · sem countdown — a
validade de 72h é real no servidor e exibida como data · no máximo dois CTAs, e
só no fim da página · sem preço riscado · sem depoimento inventado.

## Pendências de design

1. ~~Os três acentos de persona precisam entrar no `BRAND-VISUAL.md` pelo §10.~~
   Registrado em §10.1, 14/08/2026.
2. ~~As duas divergências de contraste acima precisam voltar para o §2.3.~~
   Registrado em §10.1 junto do item 1 (o `raio-x.html` é superfície só-noir e
   não compartilha este par ivory; sua reconciliação segue aberta na tabela
   de pendências do §10).

## Auditoria de 14/08/2026 — layout e craft floor

Rodada via skill `impeccable` (`audit` + `layout` + `craft-floor`), motivada por
queixa direta: "o layout está quebrado, o botão está feio".

**A causa raiz do botão, confirmada por medição, não por olho:** a seta `→`
(U+2192) do CTA é um glifo Unicode, e o subset `latin` da Jost self-hosted
(`src/fonts/jost.var.woff2`) não o contém. O navegador cai para a fonte de
sistema — no Chrome/Windows, produzindo métricas (`width`, `ascent`,
`actualBoundingBoxRight`) **idênticas às de Arial puro**, medido via
`canvas.measureText`. Resolvido substituindo por `<Seta />`
(`components/molde.tsx`), um traço SVG autorado de 1.5px que herda
`currentColor` — a mesma disciplina de linha do resto do mundo, e exatamente o
que o item 3 (agora removido) desta lista já apontava. Aplicado nos 6 pontos da
UI que usavam o glifo; as ocorrências em comentário e teste ficaram como estão.

**A causa do "quebrado":** não era falta de conteúdo, era ausência de
centralização vertical — `<main>` tinha só `min-h-svh`, então uma tela curta
(a abertura, a maioria das perguntas) ficava presa ao topo de um viewport que
sobrava quase inteiro vazio, lendo como página incompleta em vez de "peça
exposta com respiro". Fix: `flex flex-col justify-center` no mesmo elemento —
como é `min-h-svh` (piso, não altura fixa), uma tela mais alta que o viewport
(o cartão-espelho, por exemplo) segue fluindo do topo normalmente; não há
telas que dependam de overflow controlado para caber.

**O peso do botão primário:** `px-p3 py-p2` (24/16) virou `px-p4 py-p3`
(40/24), `minHeight` 48→56, e ganhou feedback de toque via `transform: scale`
no mousedown/up (nunca `height`/`width`, que o §8 do BRAND-VISUAL veta). Depois
que ela escolhe a frase-espelho, a borda do botão principal passa a usar
`--accent` em vez de `--ink` (prop `acentuada` em `<Acao>`) — o mesmo
acento-por-persona que já pinta piquete e traço agora alcança também o CTA,
sob a mesma disciplina de linha (nunca preenchimento).

**Achado de confiança, fora do escopo visual:** `abertura.corpo` prometia
"Seis passos" — o fluxo real tem 9 telas até o gate (`TELAS_ATE_O_GATE`). Uma
visitante que conta as "Peça N de 9" no rótulo de cada etapa bateria de frente
com uma promessa falsa no meio do quiz, exatamente o tipo de atrito que este
produto existe para evitar. Suavizado para "Poucas perguntas, menos de três
minutos" — mantém a promessa de tempo (verdadeira) e derruba a contagem
falsificável. Diverge do `tailor-copy-deck.md`; reconciliar lá.

**A causa raiz de verdade, achada só depois de medir o site no ar:** o padding
do botão não era pequeno — era **zero**. `getComputedStyle` no deploy mostrou
`paddingTop/Right/Bottom/Left: 0px` apesar da classe `px-p4 py-p3` estar no
DOM. Motivo: `globals.css` tinha `button { padding: 0; border: none;
background: none; }` como CSS solto, fora de qualquer `@layer` — e regra sem
camada sempre vence regra em camada, **independente de especificidade ou
ordem no arquivo**. Como o Tailwind v4 injeta seus utilitários dentro da
camada `utilities`, aquele reset zerava `px-p4`/`py-p3`/`py-p2`/`py-p1` de
**todo** `<button>` do site, sempre — não só o CTA principal, também cada
linha de opção (`LinhaOpcao`, usada no cartão-espelho e em Q7/Q8/Q9) e o botão
de pagamento da proposta. Corrigido envolvendo o bloco de reset (`*`, `html`,
`body`, headings, `p`, `button`, `input`/`textarea`, seleção, foco) em
`@layer base { … }` — a camada mais baixa das quatro do Tailwind, exatamente
onde um reset deve viver para que utilitário continue podendo sobrescrevê-lo.
Nenhuma cor, forma ou token mudou; só a prioridade de cascata voltou a fazer
sentido. Bônus do fix: toda linha de opção do quiz ganhou de volta o respiro
vertical que `py-p2` sempre devia ter dado e nunca deu.

`node .claude/skills/impeccable/scripts/detect.mjs` limpo antes e depois, em
todos os arquivos tocados. 42/42 testes, `tsc --noEmit` limpo, build e deploy
verificados.

## Pendências de design (novas)

3. Screenshot real do deploy (mobile) ainda não confirmado nesta sessão — o
   painel do navegador segue instável para captura em algumas páginas; a
   verificação desta rodada usou `canvas.measureText` via `javascript_tool`
   para a evidência do glifo, não pixel a pixel.
4. `abertura.corpo` diverge do copy deck (ver acima) — levar de volta para
   `tailor-copy-deck.md` pelo protocolo de fonte de texto.

## Rodada de retenção — 14/08/2026 (síntese de três pesquisas)

Três pesquisas independentes (cor, gamificação, retenção UX) foram sintetizadas
e o que era coerente com o BRAND-VISUAL §8 e as 7 condições do Conselho foi
implementado. Percurso completo verificado ao vivo (Playwright, viewport 360px,
abertura → pico → proposta). O que segue é o registro como construído.

### A gramática das duas tintas

O sistema já praticava sem nomear: **ouro é a voz da casa** (filete de
abertura de toda peça, rotulagem do espelho, itálico de ênfase); **o acento é
a linha dela** (piquete marcado, traço de decisão, trilho, borda do CTA depois
da escolha). O comentário do `Pico` prometia "o ouro aparece pela segunda e
última vez" mas a borda do CTA usava `--accent` — contradição resolvida a favor
do comentário: **o pico é o único quadro onde as duas tintas se encontram** — a
linha de corte do Comparador no acento dela, a borda do CTA da proposta em ouro
(1px, dentro do teto de 3%). A casa entrega a peça costurada com a linha dela.
A proposta agora recebe `--accent` da persona (`Superficie` em `p/[token]`),
estendendo a linha dela até a página em que ela é lida.

Anti-regras registradas junto com a gramática (pesquisa de cor, R7):

- **Não** pré-revelar as cores de persona no cartão-espelho — cor antes do
  clique transforma identificação em menu de segmentação.
- **Não** usar acento como preenchimento (o painel Futuro do Comparador segue
  no tint de 14% de terra — terra é a única cor com licença de área).
- **Não** adicionar quarta cor de sistema (consistência prediz preferência;
  Labrecque & Milne 2012). A exceção registrada é `--color-alerta`, que é voz
  de sistema, não de persona — ver abaixo.
- **Não** clarear a fase noir "para legibilidade" — o escuro é funcional
  (Miwa & Hanyu 2006: luz baixa aumenta autorrevelação).

### Tinta mais densa sobre ivory (bug de contraste real)

`[data-superficie="ivory"]` não redefinia ouro nem acentos: `--gold-hi` media
**1,44:1** na frase-fecho da fita métrica e no `:focus-visible`; `--gold`
**2,10:1** na marca SUA META — os elementos-clímax da página de decisão eram os
menos legíveis dela. Redefinidos dentro do bloco ivory, mesmo matiz, L reduzida
até ≥4,5:1 (medido por luminância relativa, script conferido):

| Token | noir | ivory |
|---|---|---|
| `--color-gold` | `#C9A24C` | `#856828` (4,58:1) |
| `--color-gold-hi` | `#E3C77E` | `#755C19` (5,56:1 — no claro, "hi" é o traço mais fundo) |
| `--color-patricia` | `#C17B83` | `#AA505A` (4,58:1) |
| `--color-camila` | `#BC7C4E` | `#966039` (4,56:1) |
| `--color-carla` | `#6F9B85` | `#507462` (4,57:1) |

Os hexes sugeridos pela pesquisa (#8A6D2B etc.) foram conferidos e **reprovavam**
em 4,5:1 — os valores acima são derivação própria por matiz idêntico.

### Alerta com tinta própria

O único erro de validação do fluxo acontece no gate — e saía em
`--color-patricia`: para a Patrícia, a linha "dela" virava repreensão; para as
outras, o erro chegava na cor de outra mulher. Novo token `--color-alerta`
`#C4674E` (terra queimado, 4,87:1 sobre noir), deliberadamente fora da banda de
saturação dos acentos: alerta é sistema, não persona.

### A candeia da Q3

`--surface` desloca para `--color-noir-2` (`#1A1410`, token dormente derivado
do terra) apenas na Peça 3, via `[data-penumbra]` no `<html>`; a transição de
900ms do body faz o fade. Não é um terceiro ato do arco noir→ivory — é
modulação dentro do noir: quarto com abajur em vez de void (Miwa & Hanyu
mediram luz *baixa*, não breu). **Validar pela taxa de resposta da Q3 no
autosave; reverter é apagar uma regra de CSS.**

### Retenção estrutural (sem tela nova; C1 segue 9, teste verde)

- **Retomada local** (`src/lib/retomada.ts`): `{indice, respostas, leadId}`
  versionados em `localStorage`, saneados campo a campo na volta, índice
  clampado pela primeira etapa incompleta (mesma régua `etapaCompleta` do
  fluxo vivo). Limpa no pico. Aviso em notação: "Retomei de onde você parou."
- **Gate sempre vivo**: CTA habilitado; validação explica por campo
  (`erroNome`/`erroWhatsapp` deixaram de ser código morto), falha de rede
  junto ao botão. `<form id="molde-gate">` + `enterKeyHint` + `name` — o
  Enter/"ir" do teclado envia.
- **Epígrafe verbatim no gate**: a primeira frase da confissão dela (truncada
  em limite de palavra) volta como citação acima do pedido de contato —
  material 100% dela, zero risco C2.
- **Espelho rola até a revelação**: o bloco da situação montava inteiro abaixo
  da dobra ("toquei e não aconteceu nada"). `scrollIntoView` respeitando
  `prefers-reduced-motion`; respiro vertical do `<main>` encolhe no mobile
  (p4) para devolver dobra.
- **Régua**: faixa de toque de 44px (o trilho visível segue 1px); estado
  latente honesto — valor padrão em `--ink-3` com linha de costura tracejada
  até ela tocar (valor mostrado ≠ valor registrado agora é visível); ajuste
  fino por dois riscos de giz SVG de 44px (um passo de slider media ~3px).
- **Gap R$ 0 fabricado**: mover a régua 1 preenchia a régua 2 em silêncio →
  "essa diferença soma R$ 0" na entrada do pedido de investimento. O clamp só
  vale para valor declarado; meta igual ao atual ganhou frase própria
  (`semGap`) e a Q9 um título sem número.
- **Goal-gradient na rotulagem**: "de 9" só da Peça 6 em diante (Koo &
  Fishbach: começo enfatiza o feito, fim enfatiza o pouco que falta). O total
  é real e trancado por teste — enquadramento, não urgência.
- **PROGRESSO monotônico**: incrementos 9,9,9,10,10,10,11,11 — a sequência
  anterior desacelerava nas últimas peças, contra o goal-gradient.
- **Trilho re-tinge com transição**: o traçado já percorrido vira a cor dela
  em 700ms no instante da escolha (posse do progresso), paint-only.
- **Traço de decisão desenhado**: a linha de corte entra por `scaleX` da
  esquerda (360ms) — a decisão é riscada, não trocada. Piquete e traço são o
  mesmo gesto.
- **Tique de giz**: `navigator.vibrate(8)` ao marcar (linhas, espelho,
  palavras, ajuste fino). Android vibra, iOS ignora; `prefers-reduced-motion`
  desliga. Zero pixels.
- **Recibo da confissão**: "Guardei. Palavra por palavra." surge (opacidade)
  quando ela pausa de digitar na Q3 — e é literalmente verdade: autosave
  debounced de 3s grava a frase no servidor sem esperar o Continuar.
- **Trabalho visível no envio**: o rótulo do CTA atravessa as fases reais do
  pipeline (Lendo → Medindo → Traçando) por tempo decorrido, sem delay
  artificial (Buell & Norton, labor illusion honesta).
- **Palavras com acento**: a chave crua ("memoravel") vazava no pico, no bloco
  3 da proposta e no diagnóstico de reserva. Exibível vem das messages nos
  três pontos.
- **Contador do Futuro**: só a partir da primeira marca; cheio, explica a
  troca ("Toque numa delas pra trocar").
- **themeColor por superfície**: a rota da proposta exporta `#F6EFE1` — o arco
  noir→ivory agora alcança a barra do navegador (91,5% mobile).
- **Preview do link**: `metadata.description` ainda dizia "Seis passos";
  espelhada em `abertura.corpo` (9 peças reais).
- **Comparador**: `touch-action: pan-y` no range invisível — não disputa mais
  o scroll vertical no iOS.
- **Voltar**: alvo digno (44px de altura, respiro horizontal p2, sublinha no
  span interno).

### Descartado nesta rodada, e por quê

- **Barra de ação fixa na base** (pesquisa UX, E6): vizinho demais do "banner
  fixo de oferta" que o §8 veta — não entra sem decisão registrada do
  protocolo §10. Aplicado só o ajuste de respiro.
- **Auto-avanço na Q8** (pesquisa UX, P2): remove o consentimento explícito de
  avançar numa pergunta de dado e quebra a consistência de interação.
- **Q7 por persona** (pesquisa UX, P2): o copy deck é fonte de texto 1:1;
  inventar variantes viola a governança de copy. Vai como pendência para o
  deck.
- **Input numérico inline na régua** (pesquisa UX, E4b): os riscos de ajuste
  fino resolvem a precisão sem abrir teclado no meio do fluxo (NN/g manda
  passo fino; não manda teclado). Decisão de design, não de governança.
- **"de 9" em todas as telas** (pesquisa UX, E7): mostrar 7 restantes na Peça
  2 desmotiva (small-area hypothesis); prevaleceu a variante da segunda
  metade.
- **Percentual numérico, streak, medalha, confete, som, contador de
  caracteres na Q3**: as próprias pesquisas já os vetavam; registrados aqui
  para não voltarem.

### Pendências desta rodada

5. ~~Levar ao `BRAND-VISUAL.md` pelo §10: gramática das duas tintas,
   variantes de tinta densa sobre ivory, `--color-alerta`, penumbra da Q3 e o
   acento de persona na proposta (soma-se à pendência 1).~~ Registrado em
   §10.1, 14/08/2026. Falta só propagar para o Notion (pendência #11 do §10).
6. Reconciliar com `tailor-copy-deck.md`: rótulos "de 9" (peça 6–9), frase do
   endowed progress em `abertura.corpo`, `q3.recibo`, `futuro.trocar`,
   `gap.precificacao.semGap`, `q9.tituloSemGap`, fases `gate.enviando1..3`,
   `retomada.aviso`, `regua.diminuir/aumentar`.
7. Medir a candeia da Q3 (taxa de resposta antes/depois) — o autosave por
   etapa já dá o número.
8. `/favicon.ico` responde 404 (pré-existente, visto no percurso de
   verificação) — o webview do Instagram pede esse arquivo.
