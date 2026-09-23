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

## Pendências

Consolidadas em `docs/PENDING.md`, junto com as pendências de produto e de
infraestrutura — para não ter duas listas de pendência divergindo. As
resolvidas (os três acentos de persona e as divergências de contraste, ambos
registrados no `BRAND-VISUAL.md` §10.1 em 14/08/2026) saíram daqui; o
registro de como foram resolvidas está no histórico abaixo.

## Histórico

Cada rodada de design — pesquisa, auditoria visual, mudança de paleta,
motion — está registrada sessão por sessão, fundida em ordem cronológica com
o log de `CLAUDE.md`, em `docs/history/CHANGELOG.md`.
