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

## Ilustrações reativas — 07/09/2026

Pedido do Willian: tornar as perguntas do Bloco "A medida" (Etapa 3) e
vizinhas mais compreensíveis e envolventes com ilustrações que reagem ao que
ela responde, sem sair do mundo da Folha de Molde nem do §8. Implementado
localmente (não commitado nesta rodada — autorização do pedido era só de
edição local), em `src/components/cenas/` + `src/lib/cenas.ts`.

**A regra que organiza tudo:** a ilustração nunca é a fonte do dado. O texto
formatado (`ReguaMedida`) sempre mostra o valor exato; a cena ao lado é
esquemática — segmentos fixos que acendem em fração, nunca crescem em
quantidade. `null` (ela ainda não tocou a régua) é um estado visual PRÓPRIO
(`latente`, mesma palavra e mesma gramática tracejada que `ReguaMedida` já
usava) — nunca "zero aceso", que pareceria resposta declarada.

**As seis cenas:**
- `CenaArmario` (`pctUsado`) — 10 peças fixas na cabideira, a fração acesa
  cresce com o percentual.
- `CenaEtiquetas` (`valorParado`) — 5 etiquetas fixas, cresce dentro dos
  limites reais do campo (`min`/`max` da faixa vigente).
- `CenaEscalaPreco` (`precoAtual`/`precoDesejado`) — uma REGUA COMUM aos dois
  valores (mesmo `escalaMax`, nunca duas normalizações independentes); "Hoje"
  e "Sua meta" ficam em raias verticais separadas e usam formas diferentes
  (círculo × losango) para nunca depender só de cor.
- `CenaAgenda` (`volumeMensal`) — 12 marcadores fixos (teto visual, a faixa
  real vai a 60), com "+" além do teto.
- `CenaMarcoPrazo` (Q8) — um piquete por opção, o marcado ganha traço sólido;
  nenhuma semântica de tempo real, nenhum countdown.
- `ComposicaoPalavras` (Q6 e reaproveitada no painel Futuro do Comparador) —
  as 2–3 palavras escolhidas como pequena assinatura tipográfica.
- `BalaoInvestimento` (Q9) — mesmo tamanho e tom em qualquer faixa, inclusive
  "prefiro não dizer"; texto novo em `messages/pt.json` (`q9.balaoPadrao`,
  `q9.balaoNaoDizer`).

**Só traço, nunca preenchimento** — a mesma disciplina do resto do sistema.
Nenhuma cor nova: tudo lê `--rule`/`--rule-2`/`--ink-3`/`--accent`, que já
trocam sozinhos entre noir e ivory. O estado aceso muda DOIS sinais ao mesmo
tempo (cor E traço sólido↔tracejado) — nunca só cor, para quem não distingue
`--accent` de `--ink-3`.

**Performance:** as cinco cenas em SVG entram por `next/dynamic`
(`src/components/cenas/index.tsx`) — só a pergunta alcançada baixa o próprio
chunk. As duas sem SVG (composição de palavras, balão) são leves demais para
valer o code-splitting e entram diretas. Toda cena vive num contêiner de
altura fixa (`Reservado`/`CenaContainer`), então o carregamento não desloca
layout.

**Responsivo:** no mobile, cada cena é uma faixa compacta (≤72px) logo abaixo
da régua — nunca empurra pergunta/valor/controle pra longe. A partir de
`sm:` (640px), régua e cena dividem uma linha (`sm:flex`), a cena ficando ao
lado.

**Bug real achado e corrigido durante a verificação visual:** a primeira
versão de `ComposicaoPalavras` usava `flex flex-wrap` — que ignora
`text-align` herdado. No painel "Futuro" do Comparador (alinhado à direita
via `style={{ textAlign: alinhamento }}`), isso fazia as palavras vazarem
para a esquerda e sobrepor o texto de "Hoje", ilegível. Corrigido trocando
por fluxo inline (`<span style={{ display: "inline-block" }}>` dentro de um
`<p>`), que respeita o alinhamento do container-pai como qualquer texto do
sistema. Achado só porque o funil foi dirigido de ponta a ponta com
Playwright, não só lido no código — screenshot antes/depois confirmou.

**Correção de conteúdo no Comparador (item 8 do pedido):** o painel "Futuro"
do guarda-roupa mostrava um "100%" fixo — uma meta que ela nunca declarou
(a trilha guarda-roupa não tem "percentual desejado", só o que já usa hoje).
Isso é exatamente o tipo de número que o Princípio 2 do `PRODUCT.md` proíbe
("nenhum número exibido pode ser promessa, projeção ou exemplo"). Removido;
as palavras-identidade carregam o painel Futuro sozinhas agora. Também
adicionado um resumo textual sempre visível (`HOJE 70% · FUTURO elegante ·
autoridade`) abaixo do cartão arrastável — antes, o valor "Hoje" podia ficar
parcialmente cortado pelo `clip-path` até ela arrastar, o que o pedido
proibia explicitamente ("não exigir arrastar para acessar informação
essencial").

**Verificado ao vivo, três personas, Playwright:** funil completo
(abertura → gate) em 390×844 (mobile) e 1440×900 (desktop), estado latente
antes de tocar qualquer régua, `prefers-reduced-motion: reduce`, e ordem de
tab por teclado (o foco pula direto para o controle real — as cenas são
`aria-hidden` e não interceptam nada). `npx tsc --noEmit`, `eslint` nos
arquivos tocados e `vitest run` (131/131, 20 novos em `src/lib/cenas.test.ts`)
limpos. **Não verificado**: EN/FR (mensagens ainda caem no pt.json por
sobreposição parcial, comportamento herdado, não testado aqui
especificamente para os textos novos do balão) e o modo confirmação/áudio
(a mudança não toca nesses caminhos, mas não foi percorrida ao vivo).

**Pendência de design:** esta rodada usa só os tokens de cor já existentes —
o "terra escuro" (#78513B) proposto no pedido não foi necessário porque
nenhuma cena usa preenchimento sólido atrás de texto (só traço), então o
problema de contraste ivory-sobre-terra que motivou a proposta não chega a
acontecer aqui. Registrado para não represar como pendência: se uma cena
futura precisar de preenchimento, ESSE é o momento de trazer o token novo,
não antes.

## Fundo ameixa, botão pôr-do-sol e animação nas cenas — 07/09/2026

Segunda rodada do mesmo pedido: "não gostei do marrom", "quero algo que
conecte mais e chame mais atenção". Três decisões do Willian, cada uma
validada com comparação real antes de aplicar (nunca só descrita em texto) e
com contraste WCAG reconferido, não só olhado:

**Fundo — de `--color-noir` #141009 pra #181022 (ameixa).** Rastreei de onde
vinha a queixa de "marrom": não eram as cenas, era o `--color-noir` em si
(a base de toda tela) e o acento da Camila (`#BC7C4E`, literalmente
"âmbar-terra" no comentário do token). Só o fundo foi trocado nesta rodada —
o acento da Camila e `--color-terra` continuam como estavam, por decisão
explícita de escopo do Willian ("o fundo", não os acentos de persona).
Três fundos foram desenhados e comparados lado a lado no app real (carvão
neutro, ameixa, petróleo) antes da escolha. Confirmado ameixa. Reconferido
por script o contraste de TODOS os tokens de texto/acento contra o novo
fundo — só `--color-terra` como texto direto cairia abaixo de 4,5:1, e ele
nunca é usado como texto (só tinta de 14% e `::selection`). `--color-line`/
`--color-line-2` tingidas de frio junto (eram um bege quente que brigava com
o novo fundo). Valor anterior documentado no comentário do token, pra
reverter em uma linha se for o caso.

**Botão — formato e cor.** Pesquisa real antes de propor: cantos
arredondados recebem 17–55% mais clique que cantos retos (*contour bias* —
Biswas, Abell & Chacko), e o ganho de "amigável" já aparece com qualquer
arredondamento visível, não precisa de pílula total. Quatro variantes
comparadas lado a lado sobre o fundo ameixa já confirmado (atual 2px ivory ·
suave 10px ivory · pílula 28px ivory · suave 10px preenchido em pôr do sol).
Escolhida a última: `--color-cta` #E8935B, `--radius-cta` 10px, texto em
`--color-cta-ink` #1A1015 (contraste 7,76:1, passa até o AAA de 7:1 — a
combinação errada, texto ivory sobre o mesmo preenchimento, dava 2,10:1 e
foi descartada antes de entrar em qualquer tela). Aplicado nos dois lugares
que tinham CTA preenchido: `Acao` (`molde.tsx`, usado em todo o quiz) e o
CTA final do Pico, que antes era o único botão com borda dourada ("a casa
entrega com a linha dela", gramática das duas tintas registrada acima nesta
mesma página). Essa unificação troca aquele gesto sutil por reconhecimento
consistente do botão ao longo do funil inteiro — decisão deliberada, não
perda por descuido; documentada no comentário do próprio JSX pra reverter se
o Willian preferir o gesto de volta. `acentuada` (o prop que fazia a borda
do CTA virar a cor da persona) ficou sem efeito — tipo mantido, comentado,
pronto pra religar se o acento por persona voltar ao botão.

**Paleta da ilustração — "pôr do sol".** Quatro paletas comparadas lado a
lado no guarda-roupa cartoon (a rosa/ouro/sálvia original, pôr do sol,
"joia fria" e monocromático de ouro). Confirmado pôr do sol
(`#E8935B`/`#F0C24A`/`#D9707A`), substituindo a paleta da rodada anterior em
`armario-cartoon.tsx`.

**Animação em todas as 6 cenas.** Pedido explícito: "todas devem ter
animações". `@keyframes cena-pop` (novo, `globals.css`) — um pop curto
(320ms, scale 0.6→1.08→1 com opacidade) no instante em que um segmento vira
aceso, nunca em loop contínuo. Aplicado nas seis: guarda-roupa, etiquetas,
agenda e marco-prazo (no elemento que acende/marca), e escala-preco (nas
duas marcas, que já só existem no DOM depois que ela toca a régua — o pop
toca no primeiro aparecimento). `prefers-reduced-motion` zera a duração
pela regra global já existente, como todo o resto do sistema — não precisou
de tratamento novo.

**Um bug de SVG evitado, não só achado:** em `escala-preco.tsx`, a marca
"Sua meta" já usava um atributo XML `transform="translate(...)"` pra
posição. Aplicar `.cena-pop` (que anima a propriedade CSS `transform`) no
MESMO elemento faria a marca pular pra origem (0,0) toda vez que a animação
disparasse — CSS `transform` sobrescreve o atributo `transform` de SVG no
mesmo nó, sempre. Resolvido com um `<g>` filho, dedicado só à escala,
dentro do `<g>` que carrega a posição. As outras cinco cenas não tinham esse
atributo nos elementos animados, então não precisaram do mesmo ajuste —
conferido um por um antes de aplicar a classe, não assumido.

`npx tsc --noEmit`, `eslint` nos arquivos tocados (2 erros pré-existentes em
`quiz.tsx`, fora do diff desta rodada, mesmos de sempre) e `vitest run`
(131/131) limpos depois de cada mudança. Verificado ao vivo nas 3 personas,
mobile 390px e desktop, com o funil completo rodado via Playwright.

**Ainda fora do escopo confirmado, registrado pra não esquecer:** as outras
5 cenas continuam no traço esquemático hairline, sem preenchimento colorido
— só o guarda-roupa recebeu ilustração cartoon completa. Estender esse
tratamento às outras cinco é decisão em aberto, não recusada.

### Quarta rodada, mesmo dia — cédulas, agenda, balão por faixa e o mapa

Quatro ajustes pedidos depois de ver a terceira rodada rodando:

**`valorParado` virou maço de cédulas.** As cinco etiquetas penduradas
saíram; entrou uma pilha de notas com a cifra da moeda, que vão APARECENDO
conforme o valor sobe. C3 continua valendo ao pé da letra — nada some, nada
queima, nada é desperdício: nota parada é dinheiro dela adormecido. A cifra
vem por prop (`simbolo`), não cravada, porque a moeda vem do idioma. Dois
detalhes que só apareceram desenhando: (1) em SVG quem é desenhado depois
fica por cima, então sem inverter a ordem as notas AINDA APAGADAS cobriam as
acesas e o maço parecia vazio com valor declarado; (2) nota apagada precisou
de preenchimento `var(--surface)` em vez de transparente, senão a pilha vira
um emaranhado de contornos em vez de camadas de papel.

**`volumeMensal` virou folha de agenda.** A grade de 12 bolinhas saiu;
entrou uma folha com espiral e blocos de horário que preenchem conforme os
atendimentos. Mesma disciplina de antes: 12 blocos são o teto VISUAL (o
campo vai a 60), o número exato mora no texto ao lado e o "+" avisa quando
ela declarou mais do que a folha desenha.

**Q9 — frase por faixa, em balão de PENSAMENTO.** Antes eram duas frases
(uma genérica, uma pra "prefiro não dizer"); agora são cinco, uma por faixa,
com a chave sendo a própria faixa (`q9.balao.<faixa>`), então copy nova entra
em `messages/pt.json` sem tocar em código. O balão virou nuvem com duas
bolhas: quem pensa é ela, não a Renilza.

O pedido era "frases que incentivem a pessoa a investir mais". O que foi
escrito fala da PROFUNDIDADE do percurso que cada faixa abre — a esteira é
uma escada real e documentada (Jornada → Dossiê → Prisma). O que
deliberadamente NÃO foi escrito, e por quê:
- **escopo/entregável por faixa** ("nessa faixa cabe o método inteiro"): o
  escopo de cada produto não está documentado em lugar nenhum deste repo.
  Escrever seria fabricar oferta.
- **retorno financeiro** ("esse investimento se paga em X meses"): C2.
- **faixa maior = mais coragem/merecimento**: a tela anterior é uma
  confissão, e a crença documentada da Patrícia no `PRODUCT.md` é
  literalmente "não mereço investir em mim". Usar isso pra empurrar faixa
  converte hoje e queima a marca depois. Ficou registrado como escolha
  consciente, não esquecimento — se a decisão mudar, muda com o custo à
  vista.

**O mapa item por item (`resumo-mapeado.tsx`).** O Comparador é o gesto; o
resumo abaixo dele é a leitura completa em texto, com tudo que ela declarou
no funil dividido entre Hoje e Futuro. As duas colunas são assimétricas de
propósito: a coluna Futuro só tem linha onde ela DECLAROU algo sobre o
depois (meta de preço, a diferença anual que a própria aritmética dela
montou, as palavras, o prazo, a faixa). Não existe "% de armário desejado"
nem faturamento projetado porque ela nunca declarou nenhum dos dois —
inventar o par simétrico seria a promessa que C2 proíbe. O filtro no fim da
montagem não é defesa contra `undefined`: é a regra do Princípio 2 escrita
em código.

`tsc`, `eslint` (fora os 2 erros pré-existentes de sempre em `quiz.tsx`) e
`vitest` 131/131 limpos. Verificado ao vivo nas 3 personas em 390px.

## O Comparador virou vertical, e a leitura entrou nele — 08/09/2026

**A decisão de UX, e por que não foi o arrasto.** O pedido era pôr o resumo
Hoje × Futuro dentro do próprio cartão deslizante (arrastar tudo pra um lado
pra ler um lado inteiro), com a alternativa de empilhar na vertical se não
coubesse. Não cabe, e por quatro motivos que não são de gosto:

1. `clip-path` corta a PINTURA, não o layout. Com uma linha por lado dava
   certo; com parágrafo, o texto era fatiado no meio da palavra na posição do
   corte. Esse bug exato já tinha acontecido nesta mesma sessão com a
   composição de palavras.
2. Para "ler tudo do Hoje" ela teria que arrastar até 100%, o que esconde o
   Futuro inteiro. A comparação, que é a razão de o cartão existir, some
   justamente quando passa a haver conteúdo pra comparar.
3. Prendia informação atrás de um gesto que teclado e leitor de tela não
   executam, contra a regra de "não exigir arrastar para acessar informação
   essencial" que este mesmo cartão já tinha recebido.
4. Arrasto horizontal no celular disputa o scroll vertical: o código precisava
   de `touch-action: pan-y` só pra não roubar a rolagem da página.

Empilhado resolve os quatro e a metáfora sobrevive: a peça segue dobrada sobre
si mesma, a dobra só passou a ser horizontal, o que é até mais fiel a um molde
dobrado no fio. `fixo` e `instrucao` ("Arraste para atravessar") saíram junto,
por terem virado código morto; `ResumoMapeado`, criado na rodada anterior,
foi removido porque o conteúdo dele mora agora dentro do cartão.

**A leitura substituiu a tabela.** Antes o resumo era rótulo + valor ("Onde
apareceu: Na frente do armário, atrasada"), ou seja, o texto das perguntas
devolvido cru. Agora são frases de quem ouviu: "Você começou pela frase '…', e
me contou que isso apareceu na frente do armário, atrasada, trocando de roupa
três vezes." Cada frase só existe se o dado existe, montada em
`pico.leitura.*` com os valores dela como parâmetros. Nada é gerado por
modelo no cliente e nada é inventado: continua valendo que a coluna Futuro só
fala do que ela declarou.

Duas armadilhas de português que o código precisou tratar:
- as opções de lista chegam capitalizadas e entram no meio da frase, então
  `minuscula()` evita "você marcou Nas próximas 2 a 4 semanas";
- a resposta da Q7 é escrita em primeira pessoa ("Comprei roupas..."), então
  ela entra entre aspas como fala dela. Embutida direto, a pessoa do verbo
  quebrava ("você já tinha tentado: comprei roupas").

**O número solto virou condicional.** Com a prosa dizendo "você cobra R$ 900
hoje", repetir "R$ 900" embaixo era eco. Mas a proposta (`p/[token]`) monta o
mesmo cartão SEM leitura, e lá o número é a única medida da tela: ele agora
aparece só quando não há prosa naquele lado.

**Travessões removidos da copy visível**, a pedido: sobrou zero em
`messages/pt.json`, e o par de "—" que a Q9 usava como valor de fallback
quando não havia gap deu lugar à pergunta direta que já existia
(`q9.tituloSemGap`) — antes a tela podia exibir "há — adormecidos no seu
armário". Os "·" da notação (`Peça 4 · A medida`) ficaram: são separadores do
sistema de notação do copy deck, não travessões.

`tsc`, `eslint` e `vitest` 131/131 limpos. Verificado ao vivo em 390px e
desktop. **Não verificado ao vivo:** o cartão na página da proposta, que exige
token válido e esbarrou no rate limit local; a lógica do número condicional
está conferida por leitura de código e tipos, não por screenshot.

## Revelação em sequência no Comparador — 08/09/2026

Pedido: uma animação para a tela do Pico. Em vez de um efeito solto, o
cartão Hoje/Futuro passou a se revelar em três tempos, reaproveitando a
gramática de "decisão riscada" que já existe em `TracoDecisao`/`TrilhoDeGiz`
— nunca inventando um gesto novo:

1. **Hoje** aparece (`.surgir`, 620ms — a peça como ela chegou);
2. a **linha de corte** se risca (`.traco-corte`, `scaleX` 0→1, 420ms, atraso
   de 480ms — a virada);
3. **Futuro** aparece por último (`.surgir`, atraso de 760ms — a decisão).

`.traco-corte` é keyframe novo em `globals.css`; `.surgir` já existia. Os dois
só animam `transform`/`opacity` (nunca `height`/`width`, regra do
`CLAUDE.md`), correm uma vez (sem loop) e `prefers-reduced-motion` zera tudo
pela regra global — o conteúdo aparece completo, sem o gesto.

Verificado capturando três instantes reais (não só o estado de repouso):
logo que a tela aparece, no meio do escalonamento e no final — a captura do
meio mostrou exatamente o estado pretendido, Hoje completo e a linha já
riscada com o Futuro ainda oculto, provando que o atraso está fazendo o que
deveria, não só que o CSS não quebrou. `tsc`, `eslint` e `vitest` 131/131
limpos.
