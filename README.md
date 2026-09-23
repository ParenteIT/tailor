# Tailor — Proposal Crafter

Quiz conversacional com proposta sob medida, construído como **SaaS white
label**: marca, vertentes, perguntas, faixas, produtos e textos são
configuração de cliente, não código. O primeiro cliente é a **Renilza
Miranda**, que desde 22/09/2026 opera como holding em 3 vertentes (Imagem,
Posicionamento, Estética). Em poucas telas, o quiz devolve um diagnóstico
escrito com as palavras da própria pessoa e uma proposta ancorada nos números
que ela mesma declarou.

Sucesso é ela ler o diagnóstico e pensar *"como ela sabe disso?"*.

## Estado

**No ar, fechado ao público:** `https://sobmedida.renilzamiranda.com`. Sem
abertura nem divulgação; os leads do banco são testes internos (decisão de
20/09).

**Em código (`develop`), o quiz de fluxo único:** fatias F1→F6 entregues —
fundação, quiz frio de 9 telas, motor de análise/geração, página de proposta,
modo confirmação por link (F5), modo áudio com transcrição trocável
Groq/Deepgram (F6) —, mais acionamento direto por WhatsApp (mensagem chega,
vira lead, devolve link de confirmação) e checkout Asaas por proposta. O
restante de F7 (qualidade e segurança) segue em auditoria contínua.

**Em implementação, o quiz da holding:** tela de nome, tela de escolha da
vertente por cenas, até 9 telas por ramo até o gate, entrada direta por
`/v/<vertente>`, mundo visual próprio por vertente, tudo lido da configuração
do cliente. A spec é
[`docs/holding/HANDOFF-implementacao.md`](docs/holding/HANDOFF-implementacao.md)
com o protótipo navegável
[`docs/holding/prototipo/layout-final.html`](docs/holding/prototipo/layout-final.html).
Nada disso está em `develop` ainda.

**Decidido em 20/09, ainda fora de `develop`:** inglês como idioma principal,
PT-BR selecionável, francês removido, USD no inglês. A troca de idioma já foi
feita na branch da implementação da holding e entra com o merge dela.

Histórico completo, decisão por decisão, em
[`docs/history/CHANGELOG.md`](docs/history/CHANGELOG.md).

## Próximos passos

1. Implementar a holding na ordem do HANDOFF §9 (configuração de cliente
   tipada → estado por vertente → C1 por vertente → componentes genéricos →
   figuras → gate → APIs → entrada direta → EN padrão → testes).
2. Resolver o que bloqueia a abertura ao público — conta, credencial, preço,
   leitura da copy com a Renilza, teste com usuárias. **Lista completa e
   sempre atual, com o checklist de pré-lançamento, em
   [`docs/PENDING.md`](docs/PENDING.md).**

**White label.** Desde 22/09 o Tailor nasce parametrizável: marca, vertentes,
perguntas, faixas, produtos e textos saem de uma configuração de cliente
tipada (`src/content/clientes/<cliente>.ts`, validada com Zod na carga), nunca
de componente. O desenvolvimento segue 100% para a Renilza; infra
multi-cliente (banco por cliente, painel de administração, domínios) fica fora
de escopo até ela estar validada. A visão estratégica de SaaS vive no vault,
em `OneDrive\_millionaire\ParenteMiranda\13-willian-saas\Tailor\`.

**Negócio fora do repo.** Holding, esteira, produtos, preços de oferta,
cronograma e o que se sabe da Renilza e do público vivem no vault, em
`OneDrive\_millionaire\ParenteMiranda\20-renilza-planejamento\holding\`
(documento-mestre `00-HOLDING.md`; as fontes que antes estavam em `docs/`
foram para `holding\fontes\`). Este repo
guarda código, a spec de implementação, as pendências e o histórico.

## Onde está cada coisa

| Onde | O quê |
|---|---|
| `CLAUDE.md` | Fontes da verdade, regras do repo, convenções de código, armadilhas de ambiente |
| `PRODUCT.md` / `DESIGN.md` | Produto e mundo visual como construídos (quiz de fluxo único) |
| `docs/holding/` | Spec do quiz da holding: HANDOFF + protótipo aprovado |
| `docs/PENDING.md` | Tudo o que falta e depende de decisão, conta ou credencial |
| `docs/history/CHANGELOG.md` | Histórico de decisões, sessão por sessão, desde 13/08/2026 |
| `docs/README.md` | Mapa completo dos docs, inclusive o que saiu para o vault e para o arquivo em 23/09 |

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · next-intl · Supabase ·
Anthropic Claude com fallback automático para Gemini (`src/lib/llm.ts`) ·
transcrição Groq/Deepgram trocável · deploy no Netlify.

Idiomas hoje: `pt` padrão, `en`/`fr` traduzidos, detecção por
`Accept-Language` e seletor em dropdown nas pílulas do topo. A troca para EN
padrão com remoção do francês é o passo 9 do HANDOFF §9 (feita na branch da
holding, falta o merge); o `Accept-Language`
continua mandando o tráfego brasileiro para `pt`.

**Node 20.9+ é obrigatório** (Next 16). A máquina de desenvolvimento responde
Node 18 por padrão — use `nvm use 20.17.0` ou prefixe o PATH.

## Rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

O app abre em `http://localhost:3000` e redireciona para `/pt/diagnostico`.
Quando o EN virar padrão, a raiz passa a abrir em inglês; a holding acrescenta
a entrada direta `/v/<vertente>`.

**Sem credencial nenhuma ele funciona ponta a ponta.** Sem `SUPABASE_*`, o store
cai num backend de arquivo em `.tailor-dev/banco.json` (ignorado pelo git, e que
falha de propósito em produção). Sem `ANTHROPIC_API_KEY`, o diagnóstico usa um
texto de reserva que devolve as palavras dela sem inventar nada. Os dois avisam
no log quando entram em ação.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm test` | Suíte Vitest — trava as condições do Conselho |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run deploy` | Build + deploy de produção no Netlify |

## Deploy

O site é `tailor-renilza` no Netlify (`netlify.toml` na raiz; plugin oficial do
Next, Node 20.17.0), domínio custom `sobmedida.renilzamiranda.com`. **Hoje o
deploy é manual**, sem integração Git configurada no Netlify — cada
`npm run deploy` sobe o código local da máquina de quem roda o comando, sem
passar pelo git, então produção só atualiza quando alguém lembra de rodar isso.
Ligar o site ao GitHub para deploy automático por branch é trabalho em
andamento (falta o GitHub App do Netlify ganhar acesso ao repo na organização).

```bash
npx netlify login   # uma vez por máquina
npm run deploy
```

Variáveis em **Site settings → Environment variables** — a lista canônica é o
`.env.example`. As duas que destravam produção de verdade:

- `SUPABASE_SERVICE_ROLE` — sem ela, autosave e geração de proposta **falham
  de propósito** (o backend de arquivo se recusa a rodar em produção).
- `ANTHROPIC_API_KEY` — sem ela, o diagnóstico sai no texto de reserva.

Preço e nome de produto são env de ponta a ponta: `PRECO_*_CENTAVOS` alimenta
o preço exibido **e** o link de pagamento; `PRODUTO_*_NOME` sobrescreve o
catálogo. Sem env, a proposta mostra ◆ e o checkout responde mock.

## Estrutura

Como está em `develop` (quiz de fluxo único):

```
src/
  app/
    [locale]/diagnostico/            # o quiz
    [locale]/diagnostico/c/[token]/  # modo confirmação (F5): o mesmo quiz, pré-preenchido
    p/[token]/                       # a proposta — noindex, expiração no servidor
    api/leads                        # autosave por etapa
    api/analyze                      # extração estruturada (Haiku)
    api/proposal                     # gera a proposta e cria o token
    api/confirmation/[token]         # payload do modo confirmação
    api/transcribe                   # áudio → texto (F6), sem guardar o arquivo
    api/proposta/[token]/evento      # log de abertura e cliques
    api/proposta/[token]/checkout    # link de pagamento Asaas, criado no clique
    api/webhooks/asaas               # pagamento → status do lead (desligado no painel)
    api/webhooks/whatsapp            # mensagem → lead → link de confirmação
  components/                        # molde (primitivas do mundo), quiz, fita-metrica,
                                     # comparador, oferta, cross-sell, cenas/ (ilustrações
                                     # reativas), painel-desktop, controles-topo,
                                     # seletor-idioma, tema, atmosfera
  content/                           # personas, config (todo ◆ mora aqui)
  i18n/                              # roteamento e mensagens do next-intl
  lib/                               # gap, quiz-state, retomada, proposta, analise, llm,
                                     # store, token, rate-limit, checkout, asaas,
                                     # confirmacao, gravador, transcricao, whatsapp, cenas
  middleware.ts                      # negociação de idioma (runtime edge)
prompts/v1.ts                        # templates versionados
messages/{pt,en,fr}.json             # o copy deck como dados (fr sai, decisão de 20/09)
supabase/migrations/                 # schema com RLS
```

A holding acrescenta `src/content/clientes/<cliente>.ts` (a configuração do
cliente) e a rota de entrada direta por vertente — ver HANDOFF §1 e §9.

## Como o dinheiro é gasto

| Etapa | Modelo | Configuração | Custo alvo |
|---|---|---|---|
| Extração | `claude-haiku-4-5` | structured outputs, sem thinking, teto 800 tokens | ~US$ 0,01 |
| Diagnóstico | `claude-sonnet-5` | `effort: low`, teto 700 tokens | US$ 0,01–0,02 |

Os dois prompts de sistema carregam `cache_control`, então pagam prefixo cheio
só no primeiro lead. Ambos os modelos vêm de env (`CLAUDE_MODEL_ANALISE`,
`CLAUDE_MODEL_GERACAO`).

## As sete condições do Conselho (13/08/2026)

São restrição de produto, não sugestão. `src/lib/conselho.test.ts` trava as que
quebram em silêncio.

| | Condição | Onde vive |
|---|---|---|
| C1 | Máximo 9 telas até o gate | `quiz-state.ts` (`TELAS_ATE_O_GATE`), travado por teste. A Q2 virou sub-opção da Q1, como o Conselho prescreveu. **Na holding:** no máximo 9 telas por ramo; a entrada direta conta 8; o teste passa a iterar as vertentes do cliente (HANDOFF §2). |
| C2 | Nenhuma promessa de ganho | `prompts/v1.ts` (proibição 1) + toda microcopy de gap abre com "com base no que você me contou" |
| C3 | Patrícia sem culpa | `messages/pt.json` → `gap.guardaRoupa`: valor adormecido, nunca desperdiçado |
| C4 | Fita 100% dinâmica, teto 2–3× | `lib/gap.ts` → `escalaDaFita`, travado por teste |
| C5 | 72h que expiram de verdade | Coluna `propostas.expira_em`, verificada no servidor em `p/[token]/page.tsx`. Exibida como data, nunca como cronômetro — o §8 do brand veta countdown. |
| C6 | Segurança | Token de 24 bytes CSPRNG · `noindex`/`no-referrer` no `next.config.ts` · RLS sem policy de `anon` · rate limit nas rotas |
| C7 | Release fatiado frio → confirmação → áudio | As três fatias existem: frio (o quiz), confirmação por link (F5, `diagnostico/c/[token]`, também acionada pelo WhatsApp) e áudio (F6, `api/transcribe`). O gate promete "na hora" porque a geração é síncrona. |

**Fora do produto por decisão definitiva:** nenhum campo de @, nenhuma coleta ou
menção a Instagram/Facebook, nenhuma pergunta visual de paleta.

## Limitações conhecidas

- **Rate limit tem dois níveis.** `verificarLimiteDuravel` (`src/lib/rate-limit.ts`)
  usa Upstash quando `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`
  existem — teto real, compartilhado entre instâncias. Sem elas, cai no balde
  por processo de sempre (`limite × instâncias`). As duas variáveis já estão
  no Netlify.
- **Checkout via Asaas (link de pagamento por proposta), webhook pronto e
  desativado.** `POST /api/webhooks/asaas` fecha o ciclo (pagamento →
  status do lead), mas segue desligado no painel do Asaas até a conta nova de
  produção, no CNPJ da Renilza, ser aprovada. O Asaas cobra só em BRL: não
  existe gateway para cobrar em dólar, o que bloqueia a venda em USD (risco
  registrado em 22/09). Emissão de nota fiscal é dívida separada, não
  resolvida em código.
- **Preço vem de env, não do código.** `src/content/config.ts` mostra ◆
  quando a variável `PRECO_*_CENTAVOS` correspondente não existe — é o
  fallback de demonstração, nunca um número inventado.
- **Nenhum depoimento existe.** O Bloco 6 diz isso na cara em vez de inventar.
- **Idiomas e moeda.** Hoje `en.json` e `fr.json` espelham `pt.json`; o
  `middleware.ts` negocia por `Accept-Language`, há um seletor em dropdown
  nas pílulas do topo, e a proposta reabre na língua gravada no lead. Moeda:
  BRL no pt-BR, USD no en/fr, **sem conversão** — cada moeda tem faixa própria
  de slider (`FAIXAS_POR_MOEDA`). As tranches da Q9 em en/fr são
  **qualitativas de propósito** no fluxo atual. Os preços em USD já foram
  decididos no negócio (22/09, no vault) e, na holding, as faixas por moeda
  vão para a configuração do cliente (HANDOFF §3). A revisão do inglês é do
  Willian; o francês sai.
- **A oferta do Bloco 7 vem da faixa da Q9** (`OFERTA_POR_FAIXA`, esteira v4
  de 14/08): "até R$ 3.500" → Dossiê; "R$ 3.500 a 7.000" → Prisma Essencial;
  "R$ 7.000 a 10.000" e "acima de R$ 10.000" → Prisma Completo; "Prefiro não
  dizer" → Prisma Essencial. **Superada pela holding:** o Prisma foi
  desmembrado em 22/09 e a oferta passa a ser por vertente e faixa. A faixa é
  teto — só se oferta produto cujo preço caiba no piso dela — e "Prefiro não
  dizer" não escolhe produto (HANDOFF §3). A tabela faixa → oferta por
  vertente ainda depende de decisão (`docs/PENDING.md`).
