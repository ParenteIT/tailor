# Tailor — Proposal Crafter

Sistema de propostas sob medida da consultoria de imagem da **Renilza Miranda**.
Um questionário conversacional de 9 telas devolve, em minutos, um diagnóstico
escrito com as palavras da própria pessoa e uma proposta ancorada nos números
que ela mesma declarou.

Sucesso é ela ler o diagnóstico e pensar *"como ela sabe disso?"*.

## Estado

**F1→F6 entregues:** fundação, quiz frio, motor de análise/geração, página de
proposta, modo confirmação (`/diagnostico/c/[token]`) e resposta por áudio
(Groq Whisper, trocável por Deepgram). F7 (qualidade/segurança) parcial: a
auditoria de segurança já rodou e os 2 furos reais encontrados foram
corrigidos; o que falta de F7 é o acionamento direto via WhatsApp, pronto numa
branch separada (`whatsapp-direto`, 118 testes verdes) aguardando só a conta
real da Meta pra mergear. No ar em produção: `tailor-renilza.netlify.app` e o
domínio próprio `sobmedida.renilzamiranda.com` (HTTPS confirmado funcionando).
Ver `CLAUDE.md` para o log completo da sessão a sessão.

## Próximos passos

Caminho crítico pra Renilza vender de verdade, em ordem de quanto trava o
resto — detalhe de cada um no artefato "Tailor — Quadro de Corte" (Willian
tem o link):

1. **Ativar o webhook do Asaas** — já está criado e configurado
   (`/api/webhooks/asaas`), desativado até a Renilza enviar a documentação
   pendente que o Asaas pede pra aprovar a conta nova. *Responsável: Renilza.*
2. **Links de checkout da Hotmart** — produtos (O Círculo, Jornada) ainda em
   criação lá; colar os 2 links assim que prontos. *Responsável: Willian.*
3. **Nota fiscal** — o Asaas emite NFS-e nativa, mas trava em certificado
   digital + migração pro Portal Nacional (o problema de entidade/CNPJ já foi
   resolvido). *Responsável: Willian/Renilza.*
4. **WhatsApp — número novo e reconexão** — o número hoje conectado à Meta
   não é o oficial da Renilza; decisão tomada de não migrar o oficial agora
   (risco de perder conversas ativas, sem o recurso de coexistência
   garantido). Vale testar **WhatsApp Coexistence** antes de fechar essa
   decisão em definitivo. *Responsável: Willian.*
5. **Merge da branch `whatsapp-direto`** assim que o WhatsApp estiver
   conectado de verdade — código já testado, só falta a conta real.
   *Responsável: Willian.*
6. **Decidir se troca a URL canônica** pro domínio próprio, agora que o
   HTTPS está confirmado funcionando ao vivo. *Responsável: Willian.*

### Prioridade agora

**O foco é entregar o produto da Renilza** — os seis itens acima são o
caminho crítico pra isso. A visão de transformar o Tailor num SaaS
multi-tenant (outros profissionais usando o mesmo motor, não só a Renilza) é
a fase seguinte, deliberadamente adiada. A documentação completa dessa visão
— 15 pesquisas de mercado consolidadas, pricing, growth, sequência de fases —
vive **fora deste repositório**, em
`OneDrive\_millionaire\ParenteMiranda\13-willian-saas\Tailor\`, pra não
misturar o roadmap de produto futuro com o estado de engenharia de hoje. Não
iniciar trabalho de multi-tenant/SaaS antes do produto da Renilza estar
rodando de ponta a ponta (webhook ativo, WhatsApp conectado, nota fiscal
saindo).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · next-intl (`pt` default,
`en`/`fr` esqueletados) · Supabase · Anthropic/Gemini com fallback automático ·
deploy no Netlify.

**Node 20.9+ é obrigatório** (Next 16). A máquina de desenvolvimento responde
Node 18 por padrão — use `nvm use 20.17.0` ou prefixe o PATH.

## Rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

O app abre em `http://localhost:3000` e redireciona para `/pt/diagnostico`.

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
Next, Node 20.17.0). O id do site vive em `.netlify/state.json` — fora do git,
recriável com `npx netlify link`.

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

```
src/
  app/
    [locale]/diagnostico/    # o quiz
    p/[token]/               # a proposta — noindex, expiração no servidor
    api/leads                # autosave por etapa
    api/analyze              # extração estruturada (Haiku)
    api/proposal             # gera a proposta e cria o token
    api/proposta/[t]/evento  # log de abertura e cliques
  components/                # molde (primitivas do mundo), quiz, fita, comparador, oferta
  content/                   # personas, config (todo ◆ mora aqui)
  lib/                       # gap, quiz-state, proposta, store, claude, token, rate-limit
prompts/v1.ts                # templates versionados
messages/{pt,en,fr}.json     # o copy deck como dados
supabase/migrations/         # schema com RLS
```

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
| C1 | Máximo 9 telas até o gate | `quiz-state.ts` (`TELAS_ATE_O_GATE`), travado por teste. A Q2 virou sub-opção da Q1, como o Conselho prescreveu. |
| C2 | Nenhuma promessa de ganho | `prompts/v1.ts` (proibição 1) + toda microcopy de gap abre com "com base no que você me contou" |
| C3 | Patrícia sem culpa | `messages/pt.json` → `gap.guardaRoupa`: valor adormecido, nunca desperdiçado |
| C4 | Fita 100% dinâmica, teto 2–3× | `lib/gap.ts` → `escalaDaFita`, travado por teste |
| C5 | 72h que expiram de verdade | Coluna `propostas.expira_em`, verificada no servidor em `p/[token]/page.tsx`. Exibida como data, nunca como cronômetro — o §8 do brand veta countdown. |
| C6 | Segurança | Token de 24 bytes CSPRNG · `noindex`/`no-referrer` no `next.config.ts` · RLS sem policy de `anon` · rate limit nas rotas |
| C7 | Release fatiado frio → confirmação → áudio | Só o modo frio existe; o gate promete "na hora" porque a geração é síncrona |

**Fora do produto por decisão definitiva:** nenhum campo de @, nenhuma coleta ou
menção a Instagram/Facebook, nenhuma pergunta visual de paleta.

## Limitações conhecidas

- **Rate limit tem dois níveis.** `verificarLimiteDuravel` (`src/lib/rate-limit.ts`)
  usa Upstash quando `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`
  existem — teto real, compartilhado entre instâncias. Sem elas, cai no balde
  por processo de sempre (`limite × instâncias`). As duas variáveis já estão
  no Netlify e no Bitwarden; falta só confirmar que o redeploy mais recente
  pegou elas.
- **Checkout é real (Asaas), mas o webhook que confirma pagamento está
  desativado em produção** até a Renilza terminar a aprovação da conta nova —
  sem env de preço, a rota ainda cai no modo mock de propósito.
- **Preço real só em parte da esteira.** Dossiê (R$3.500), Prisma Essencial
  (R$6.997) e Prisma Completo (R$9.997) já vêm de `PRECO_*_CENTAVOS`. Jornada,
  O Círculo e o bônus Pix continuam ◆ em `src/content/config.ts`.
- **Nenhum depoimento existe.** O Bloco 6 diz isso na cara em vez de inventar.
- **EN/FR caem no pt-BR** enquanto não forem traduzidos. A moeda já está
  decidida: BRL no pt-BR, USD no en/fr, **sem conversão** — cada moeda tem faixa
  própria de slider (`FAIXAS_POR_MOEDA`), porque converter introduziria uma taxa
  de câmbio que ninguém declarou.
- **A oferta do Bloco 7 vem da faixa da Q9** (`OFERTA_POR_FAIXA`). Ajustado em
  14/08/2026 para a esteira v4: degrau de entrada "até R$ 3.500" casando com o
  novo preço do Dossiê (o produto 1:1 mais barato da esteira), "R$ 3.500 a
  7.000" para o Prisma Essencial, "R$ 7.000 a 10.000" e "acima de R$ 10.000"
  para o Prisma Completo.
