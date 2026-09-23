# Documentação — Tailor

Mapa de onde cada coisa vive. O Tailor é um SaaS white label de quiz com
proposta sob medida; o primeiro cliente é a Renilza Miranda.

Duas reorganizações até aqui:

- **19/09/2026** — o log saiu de `CLAUDE.md` e `DESIGN.md` para
  `docs/history/CHANGELOG.md`, as pendências espalhadas viraram
  `docs/PENDING.md`, e a saída do `/taste` foi para `.taste/`. Nada apagado.
- **23/09/2026** — depois do planejamento da holding (encerrado em 22/09), o
  repo passou a guardar só código, a spec de implementação, as pendências e o
  histórico. O negócio da Renilza foi para o vault e o material superado foi
  arquivado, com o mapa caminho antigo → caminho novo abaixo. Enquanto a
  remoção do repo não acontece, cópias antigas desses arquivos ainda podem
  aparecer em `docs/`: a que vale é a do destino.

## O que vale hoje

### Raiz do repositório

| Arquivo | O que é | Quem/o que lê |
|---|---|---|
| `README.md` | Estado do produto, como rodar, deploy, estrutura, custo. Ponto de entrada. | Humano novo no repo |
| `CLAUDE.md` | Fontes da verdade, regras não-negociáveis, fronteiras (white label, repo × vault), convenções de código. **Lido automaticamente pela ferramenta de desenvolvimento em toda sessão** — não mover nem renomear. | Ferramenta + humano |
| `AGENTS.md` | Avisos do Next.js sobre a própria versão. **Reescrito automaticamente por `next dev`** — não editar à mão, não remover. | Next.js (ferramenta) |
| `PRODUCT.md` | Usuárias, propósito, condições do Conselho, compromissos de marca. Fonte de produto; onde divergir das decisões de 22/09, vale o HANDOFF. | Humano + `impeccable` |
| `DESIGN.md` | O mundo visual como construído no quiz de fluxo único: paleta, tokens, gramática, movimento, vetos. Os mundos por vertente estão no HANDOFF §5 e no protótipo. | Humano + `impeccable` |

`PRODUCT.md` e `DESIGN.md` carregam um comentário `<!-- impeccable:*-schema N -->`
perto do topo — marca de versão lida por ferramenta. Não remover o comentário
nem tirar esses dois arquivos da raiz.

### `docs/`

| Caminho | O que é |
|---|---|
| `docs/holding/HANDOFF-implementacao.md` | **A spec de implementação vigente** do quiz da holding (assinada em 22/09): white label, fluxo, roteiro, gamificação, mundos por vertente, exceções de marca, ordem de trabalho. Traz a "Errata do protótipo". |
| `docs/holding/prototipo/layout-final.html` | O protótipo navegável aprovado — fonte exata de copy (`ROTEIRO`), tokens, ícones e animações. Está publicado: **não editar**; correção vai para a errata no HANDOFF. |
| `docs/holding/README.md` | Índice curto da pasta. |
| `docs/PENDING.md` | **A única lista de pendências vigente**, inclusive o checklist de pré-lançamento. O que depende de conta, credencial, preço ou decisão da Renilza/do Willian. |
| `docs/history/CHANGELOG.md` | **O histórico de engenharia, design e produto**, em ordem cronológica. De 13/08 a 19/09, o texto veio de `CLAUDE.md` e `DESIGN.md`, reordenado por data e com a fonte marcada; de 20/09 em diante, as entradas são escritas direto nele, algumas como resumo de material que foi apagado ou movido para o vault. Não é transcrição integral de tudo: o cabeçalho dele registra a origem de cada trecho. |

## O que saiu do repo em 23/09/2026

### Negócio ainda válido → vault

Destino: `C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/holding/fontes/`,
com o mesmo nome de arquivo. O resto de `20-renilza-planejamento/holding/`
é a fonte do negócio da holding: o documento-mestre `00-HOLDING.md`
(esteira por vertente, gate, cronograma, o que falta a Renilza assinar e as
pendências de negócio) e as fichas de produto por vertente, com o sistema
de selos e gate.

| Caminho antigo | O que é |
|---|---|
| `docs/holding/planejamento-holding-3-vertentes.md` | As 3 empresas, nomenclatura, esteira por vertente, Prisma desmembrado, gate, cronograma, o que falta a Renilza assinar. "[DECIDIDO]" = recomendação forte, sem assinatura dela. |
| `docs/renilza-conhecimento.md` | O que se sabe da Renilza, do negócio e do público, com etiqueta de fonte em cada fato. Consultar antes de escrever copy, persona ou oferta. |
| `docs/jornada/entrevista-renilza-rodada-1.md` | A entrevista de 20/09, com as respostas literais: quem ela atende, personas, idioma, Recomeço, credenciais. |
| `docs/oferta/decisoes-esteira-20-09.md` | As respostas às 15 perguntas da esteira (Q01–Q15) e o custo das exceções à regra do tempo. |
| `docs/oferta/decisoes-esteira-22-09.md` | Perguntas 16–28: preços para Dubai, o produto Dubai & Europa, a Turma, o desconto da fundadora, a data do ano 1. |
| `docs/oferta/esteira-reprecificada-e-meta-1m.md` | A proposta de reprecificação e a conta da meta de R$ 1 milhão (parcialmente superada pelas decisões de 20/09). |
| `docs/oferta/capacidade-e-projecao.md` | Capacidade 1:1 da Renilza e projeção. |
| `docs/oferta/cronograma-desenvolvimento.md` | Datas de desenvolvimento dos produtos até novembro. |
| `docs/oferta/portfolios-antigos.md` | Mentoria 360º e massagem: conteúdo e preços históricos. |
| `docs/oferta/proposta-mentoria-estetica-1a1.md` | A proposta da mentoria 1:1 de estética, que virou o Signature. |

### Superado, preservado → arquivo

Destino: `C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/90-arquivo/tailor-docs-2026-09-22/`.

| Caminho antigo | Agora em | Por que saiu |
|---|---|---|
| `docs/jornada/` inteira, menos a entrevista (README, auditoria e plano de validação, lista de achados, feedback v2, as duas propostas de jornada, o prompt da auditoria e o SVG do protótipo) | `jornada/` | A jornada em 3 atos foi substituída pela holding; o que valeu entrou no HANDOFF. |
| `docs/holding/identidade-por-vertente.md`, `docs/holding/prompt-layout-tailor.md` | `holding/` | Análise de identidade e o prompt do wireframe; o resultado está no HANDOFF e no protótipo. |
| `docs/oferta/correlacao-mentoria-antiga-prisma.md` | `oferta/` | Correlação com o Prisma, desmembrado em 22/09. |
| `.taste/` | `taste/` | DNA medido da interface de produção em 17/09, anterior à holding. |

Os IDs de achado citados em comentários do código (A05, A18, A22, A26, A27)
se resolvem em `90-arquivo/tailor-docs-2026-09-22/jornada/achados-auditoria.md`.

## Convenção daqui pra frente

- **Decisão de uma sessão, evento pontual, bug encontrado e corrigido** → vira
  entrada nova em `docs/history/CHANGELOG.md`, no formato que já existe lá
  (data — título, depois o corpo).
- **Algo que passa a valer sempre** (regra, token, condição do Conselho,
  convenção de código) → atualiza o doc vigente correspondente
  (`CLAUDE.md`/`PRODUCT.md`/`DESIGN.md`), e opcionalmente uma linha no
  histórico registrando a mudança.
- **Algo que falta e depende de outra pessoa/conta/decisão** → `docs/PENDING.md`.
  Ao resolver, apaga de lá — o "como foi resolvido" mora no histórico, não na
  lista de pendências.
- **Uma proposta grande de produto ou código, ainda não decidida** → pasta
  própria em `docs/`, como foram `docs/jornada/` e `docs/holding/`, nunca
  direto nos docs vigentes. Quando decidida, o que vale vira spec ou entra nos
  docs vigentes, e o resto vai para o arquivo.
- **Negócio da Renilza** (holding, esteira, produtos, preços de oferta,
  cronograma, conhecimento sobre ela e o público, entrevistas) → vault, em
  `20-renilza-planejamento/holding/`, nunca em `docs/`.
- **Material superado que vale guardar** → `90-arquivo/` do vault, numa pasta
  datada, com uma entrada no CHANGELOG ligando o caminho antigo ao novo.
