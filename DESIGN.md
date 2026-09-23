# Design — Tailor

<!-- impeccable:design-doc 1 -->

Registro do mundo visual **como construído**, não como pretendido. Onde este
arquivo e `BRAND-VISUAL.md` v1.1 divergirem, a divergência está marcada e
precisa voltar para o documento de marca pelo protocolo do §10.

Desde 22/09/2026 convivem duas camadas:

- **O build atual (`develop`):** um mundo só, A Folha de Molde, com o fluxo
  de 13/08 e as extensões construídas entre 30/08 e 19/09. É o que as seções
  abaixo descrevem.
- **O mundo aprovado da holding:** a "casa" das telas 1–2 e três mundos, um
  por vertente. A especificação normativa é o
  `docs/holding/HANDOFF-implementacao.md` §5 (mundos, figuras, gestos, logo)
  e §6 (exceções à marca), com os tokens exatos em
  `.w-casa`/`.w-img`/`.w-pos`/`.w-est` de
  `docs/holding/prototipo/layout-final.html`. Quando a implementação da
  holding entrar, o HANDOFF vence este arquivo, e este arquivo é reescrito a
  partir do build.

## Os mundos da holding (22/09/2026)

Resumo para orientação; os valores que valem estão no HANDOFF §5.

| | Casa (telas 1–2) | Imagem | Posicionamento | Estética |
|---|---|---|---|---|
| Fundo | noir `#141009` | ameixa `#1C1229` | grafite `#111315` | marfim `#F6EFE1` |
| Acento | — | rosa-argila `#C17B83` | cobre-dourado `#C8935E` | sálvia densa `#4A6D5B` |
| Figura | — | agulha | templo | toque |
| Gesto de seleção | — | fio | preenchimento | onda |

- **Imagem herda A Folha de Molde.** A gramática abaixo (tracejado, corte,
  piquete, registro, hachura, filete) continua valendo nela. Um único rosa:
  nada de segundo rosa salmão.
- **Posicionamento segue a prancha aprovada à risca, e só nela:** degradê
  cobre no botão, pílula, ícone em cada opção, seleção preenchida, templo que
  sobe por partes.
- **Estética é o único mundo claro do quiz**, com a maca e o toque.
- **Logo:** "RENILZA MIRANDA" em Bodoni Moda 400 com dourado em degradê, só na
  tela 1 (e no topo de páginas institucionais); nas demais telas, "Renilza
  Miranda" em Cormorant 300. Configurável por cliente. Sendo white label,
  nenhum wordmark "Tailor" aparece na interface.
- Nas telas 1–2, nenhum descritor de vertente, nenhum ícone de pessoa,
  gráfico de barras, folha ou manequim (HANDOFF §8).
- **Descartados em 22/09:** "Pedra de Toque" (Posicionamento em pedra e aço)
  e "Ficha do Negócio" (Estética em verde-noite). A análise inteira está
  arquivada em
  `OneDrive/_millionaire/ParenteMiranda/90-arquivo/tailor-docs-2026-09-22/holding/identidade-por-vertente.md`.
- A página da proposta (`p/[token]`) recebe os tokens do mundo e mantém a
  estrutura atual; o desenho dela por vertente não foi feito.

## O mundo do build: A Folha de Molde

Giz de alfaiate sobre tecido escuro. Uma folha de molde é atravessada por
várias curvas de tamanho sobrepostas e **só uma é a sua** — e é isso que o
produto faz: a pessoa escolhe a frase-espelho, duas curvas apagam, a dela
permanece traçada. Na holding, este é o mundo de Imagem.

A escolha do mundo não veio de ranking: veio do sorteio do `concept-seed`
(candidato 6 de 7, chave `1d77bb43`), e o quilt, a bancada de osciloscópio e o
dossiê de espionagem foram pesados e perderam — o quilt por exigir histórias de
outras mulheres que não existem, a bancada por violar a paleta travada, o
dossiê por inverter a emoção (gramática de vigilância sobre alguém admitindo
vergonha).

**A tese:** um molde é o único desenho que só existe porque uma pessoa
específica existe. O que este mundo recusa é a pilha de cards do funil de quiz:
sem caixas, sem barra de progresso genérica, sem eyebrow decorativo.

## Superfície: o arco escuro → ivory

A troca de fundo **é o produto**, não decoração.

| Etapa | Superfície | Por quê |
|---|---|---|
| Questionário | ameixa `#181022` (`--color-noir`) | Ela escreve algo que tem vergonha de dizer em voz alta. Superfície escura reduz a sensação de exposição. |
| Peça 3 (Dor viva) | `--color-noir-2 #1F1530` (`[data-penumbra]`) | A candeia da confissão: luz baixa, não breu (Miwa & Hanyu, 2006). |
| Proposta | `--ivory #F6EFE1` | Onde ela é lida: leitura longa, números, decisão. |

Isso executa a frase-mestra da marca ("do valor invisível ao valor percebido")
como mecânica, e obedece à regra 4 do §2.4 — o escuro é o padrão, ivory é para
ler. Implementado por `[data-superficie="ivory"]`, que redefine
`--surface`/`--ink`/`--rule` em vez de trocar classes.

- **Ameixa no lugar do noir (07/09/2026, decisão do Willian):** o `#141009`
  lia como marrom e não conectava. A ameixa mantém a função; as linhas foram
  esfriadas (`rgb(220 200 235 / .16)` e `/ .30`) e o contraste de todos os
  tokens de texto foi reconferido. Para reverter, é a linha do
  `--color-noir`. A ameixa do build (`#181022`) não é a de Imagem na holding
  (`#1C1229`): na migração, vale a do protótipo.
- **Penumbra (14/08):** modulação dentro do escuro, não um terceiro ato do
  arco. Falta medir a taxa de resposta da Q3 antes e depois.

### Tema claro (12/09/2026; switch visível desde 19/09)

Light mode de verdade, só para quem ativa: fundo branco `#FFFFFF`, tinta
`#101828`, `--color-gold` e CTA redefinidos para índigo `#4F46E5` (o "hi" é
`#3730A3`, o traço mais fundo), alerta `#B91C1C`. Tudo o que já lia ouro
(filete, ênfase, grainline, foco) herda o índigo sem tocar componente. Vale em
tudo, inclusive na Q3 (a penumbra cede à preferência dela) e na proposta, que
também vira branco e índigo. Reverte conscientemente a anti-regra de 14/08
("não clarear a fase escura para legibilidade"): quem ativa troca a vantagem
do escuro por consistência. Todos os pares conferidos ≥ 4,5:1. O tema é
persistente e aplicado antes do primeiro paint. As cenas ilustradas têm
paleta fixa índigo/céu/verde-azulado e não variam por tema (dívida). O HANDOFF
não especifica o tema claro por vertente — decidir na implementação.

## Tokens

Núcleo e derivados vêm do `BRAND-VISUAL.md` §2. Duas divergências, ambas de
contraste medido, registradas no §10.1 em 14/08/2026:

| Token | BRAND-VISUAL | Aqui | Motivo |
|---|---|---|---|
| `--ivory-3` | `rgba(246,239,225,.48)` | `.55` | Medido sobre o escuro, `.48` dá ~4,5:1 — em cima do mínimo, e a notação vive em 12px. |
| `--ink-3` (sobre ivory) | não especificado | `rgba(20,16,9,.64)` | `.5` reprova em 4.5:1, e este token carrega o aviso do checkout mock e o texto de segurança. |

**Tinta mais densa sobre ivory (14/08).** O ouro e os acentos foram
calibrados para o tecido escuro e desbotavam no papel. Sobre ivory, o mesmo
matiz fica mais denso: ouro `#856828`, gold-hi `#755C19`, acentos `#AA505A` /
`#966039` / `#507462`. Todos ≥ 4,5:1 sobre ivory; no claro, "hi" é o traço mais
fundo, não o mais brilhante.

**CTA "pôr do sol" (07/09).** `--color-cta #E8935B` com texto `#1A1015`
(7,76:1) e `--radius-cta 10px`, no quiz inteiro e no Pico. Preenchido, nunca
dourado. Desvio pendente do §10 (ver "Pendências").

**Alerta.** `--color-alerta #C4674E` (4,87:1 sobre o escuro): erro de
validação é voz do sistema, fora dos acentos de persona. No tema claro,
`#B91C1C`.

**Acento por persona** — extensão de produto registrada no BRAND-VISUAL §10.1
em 14/08 (falta propagar ao Notion): `--patricia #C17B83` (rosa-argila),
`--camila #BC7C4E` (âmbar-terra), `--carla #6F9B85` (verde-sálvia).
Recalibrados em 13/08/2026 para a mesma faixa de saturação do `--terra`: os
valores originais do brief (#D98A93 / #C97F45 / #7E9B8A) tinham origem
cromática dispersa e liam como enxerto ao lado do ouro. Aplicados como
`--accent` no instante em que ela escolhe a frase-espelho, sob a mesma
disciplina de área do ouro: filete, ponto, marca de giz — nunca preenchimento.
Ela não sabe que foi segmentada; sente que a coisa é dela.

Na holding, o acento passa a ser por vertente (tabela acima): o rosa-argila
fica em Imagem, Posicionamento vira cobre-dourado e Estética, sálvia densa. A
disciplina "nunca preenchimento" continua em Imagem e Estética; Posicionamento
é a exceção assinada.

## Gramática

Toda marca é notação de molde real. Nenhuma é enfeite.

| Marca | Significado | Implementação |
|---|---|---|
| Linha tracejada | Linha de costura — a opção ainda latente | `repeating-linear-gradient` monocromático (padrão de traço, não gradiente de cor) |
| Linha sólida | Linha de corte — a decisão tomada | `1px solid var(--accent)` |
| Corte | A tesoura no instante da escolha | `Corte` em `molde.tsx`: traço de 2px por `stroke-dashoffset`, 300ms, desmonta sozinho |
| Lavado | A tinta da escolha | acento a 11% atrás da opção escolhida, entra por `scaleX` |
| Piquete | Ponto de encontro | `.piquete`, cresce por `scaleY` ao ser marcado |
| Cruz de registro | Alinhamento de folhas sobrepostas | `.registro`, nos quatro cantos da folha |
| Hachura | Margem de costura — o gap entre o que ela cobra e o que quer cobrar | `.hachura`, 45° |
| Filete de 36×1px | Abertura de peça | `.filete::before`, o gesto-assinatura do §4 |

**O trilho de giz** (`TrilhoDeGiz`, `molde.tsx`) substitui a barra de
progresso: uma coluna fixa à esquerda, em SVG. A linha de costura tracejada
cobre o caminho inteiro; o fio sólido de 2px, no acento, cresce por
`stroke-dashoffset` ligado ao progresso real (não ao scroll) e descostura ao
voltar. A agulha — um ponto de 9px com um anel de 19px — anda na ponta do fio
por `translateY`, e cada peça tem um piquete que cresce por `scaleX` quando é
alcançado. Nasce em 15% (endowed progress) e não conta vaga nem tempo — o §8
do BRAND-VISUAL veta essa gramática.

Na holding, a figura de Imagem é outra: a agulha anda por `translateX` sobre
uma linha tracejada horizontal (HANDOFF §5). A agulha que deslizava no trilho
até a altura da resposta tocada (Proposta B, 22/09) foi superada por ela.

## Composição no desktop

- **Painel de desktop (18/09; a partir de 1120px desde 19/09):** à direita, o
  espelho da coluna de costura. Seis peças de molde (gola, mangas, corpo,
  saia, bainha) se desenham conforme o progresso e, na última peça, compõem o
  contorno de uma roupa. SVG, não Three.js. Cada peça acesa ganha 12% de
  preenchimento no acento. Com o lavado da opção escolhida (11%), são as duas
  áreas em que o acento vira tinta de fundo no build — tênues, mas fora da
  regra "nunca preenchimento" dos acentos.
- **Atmosfera (30/08, experimento):** fundo fixo de curvas de molde, cruzes
  de registro, grainline e grão de tecido, só linha, a partir de 900px (o
  grainline, a partir de 1280px), traçado uma vez em 2400ms. Registro pelo §10
  pendente; nunca foi vista ao vivo no lado ivory.
- **Controles do topo (19/09):** tema (sol/lua) e idioma (dropdown gerado das
  locales, com bandeira em SVG desenhado sempre ao lado do nome do idioma) em
  pílulas no fluxo da página, nunca `fixed`.

## Tipografia

`Cormorant Garamond` (a voz) · `Jost` (o rigor) · `Hanken Grotesk` (a leitura),
via `next/font/google`. O display vive atrás de **um único token**
(`--font-display`). O §3.1-BIS dizia que o Cormorant sinaliza tier DIY e sairia
em setembro; não saiu. O HANDOFF mantém as três famílias e usa Bodoni Moda 400
só na logo. A troca continua sem decisão — e continua sendo aquela linha e o
import.

Escala do §3.2, entrelinha 1.6 no corpo, medida travada em `68ch`, container de
leitura em 680px. Itálico do display é o único recurso de ênfase — negrito em
título está vetado e não aparece.

## Forma

- Espaço na régua de 8px: `8 · 16 · 24 · 40 · 64 · 104 · 168`, como tokens
  `--spacing-p1..p7`. Nenhum valor cru fora dela.
- Cantos de 2px na folha e nas linhas de opção. Exceções construídas: o CTA
  com 10px (07/09) e as pílulas de 999px dos controles do topo (19/09), as duas
  pendentes do §10. Na holding: 10px nos botões de Imagem e Estética, pílula em
  Posicionamento (HANDOFF §6).
- **Sombra: nenhuma.** Profundidade vem de linha e contraste de superfície. A
  única exceção é o anel de foco do slider, que é acessibilidade, não relevo.
- Alvos de toque ≥ 44px em tudo que se toca (as linhas de opção têm 56px).

## Movimento

Um vocabulário só — o traçado do giz — aplicado a vários momentos, sempre com
a mesma curva `cubic-bezier(0.16, 1, 0.3, 1)`. Nada anima `height`, `width` ou
`top`, que causam thrash de layout numa coluna que acompanha a tela.

| Momento | Como | Duração |
|---|---|---|
| Entrada de tela (`surgir`) | `opacity` + `translateY` de 6px, saindo de um estado já visível | 620ms |
| Trilho de giz e agulha | `stroke-dashoffset` / `translateY` | 700ms |
| Corte ao escolher | `stroke-dashoffset`, efêmero | 300ms |
| Lavado do acento | `scaleX` | 480ms |
| Costura viva (Q3) | a linha sob o campo acompanha quanto ela já escreveu, e satura numa frase típica | 160ms, linear |
| Cenas ilustradas (`cena-pop`) | `scale` + `opacity`, uma vez por segmento, nunca em loop | 320ms |
| Comparador do Pico (`traco-corte`) | `scaleX` | 420ms |
| Véu de revelação (Pico → proposta) | `clip-path` circular em ivory (branco no tema claro) | 1200ms |
| Atmosfera (`tracar`) | `stroke-dashoffset` | 2400ms |

`prefers-reduced-motion` zera duração **e** atraso — só a duração deixava os
reveals escalonados esperando o delay inteiro (18/09) — e o `tique` (vibração
de 8ms ao escolher) respeita a mesma preferência.

Dois elementos animam em loop: o ponto de "gravando" (opacidade, 1400ms, o
único sinal de microfone ativo) e o anel da agulha, que respira (2600ms). Na
holding, figura de progresso não anima em loop (WCAG 2.2.2); o anel precisa
parar na migração.

Figuras e gestos da holding (HANDOFF §5): fio por `scaleX` em 360ms,
preenchimento por `opacity` em 240ms, onda por `scale` + `opacity` em 620ms
(dois anéis); agulha e toque por `translateX` em 700ms; templo que sobe em
oito partes (`translateY` + `opacity`, 520ms).

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

As estações do build vêm da esteira de 13/08 (Jornada → Dossiê → Prisma). Na
holding, a escada é a dos níveis da vertente (HANDOFF §7), que aparecem só na
proposta: as estações precisam ser refeitas com eles, e continuam sem valor.

## Vetos respeitados

Ouro ≤3% de área (o botão primário é o CTA "pôr do sol" preenchido, nunca
dourado) · sem gradiente decorativo, metálico ou brilho no build (na holding,
o degradê entra só no botão de Posicionamento e na logo, como exceções
assinadas) · sem emoji (bandeiras e microfone são SVG desenhado) · bandeiras
com cores nacionais, desvio consciente do §8 (11/09) · sem countdown — a
validade de 72h é real no servidor e exibida como data · no máximo dois CTAs, e
só no fim da página · sem preço riscado · sem depoimento inventado.

## Pendências

Consolidadas em `docs/PENDING.md`, junto com as pendências de produto e de
infraestrutura — para não ter duas listas de pendência divergindo.

Ainda precisam passar pelo §10 do BRAND-VISUAL: o fundo ameixa e o CTA com
10px (07/09), as bandeiras (11/09), o tema claro (12/09), as pílulas (19/09), a
atmosfera (30/08) e as quatro exceções da holding (HANDOFF §6). Os acentos de
persona e as divergências de contraste já estão no §10.1 desde 14/08/2026;
falta propagar ao Notion. O registro de como cada item foi resolvido está em
`docs/history/CHANGELOG.md`.

## Histórico

Cada rodada de design — pesquisa, auditoria visual, mudança de paleta,
motion — está registrada sessão por sessão, fundida em ordem cronológica com
o log de `CLAUDE.md`, em `docs/history/CHANGELOG.md`.
