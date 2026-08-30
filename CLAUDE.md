@AGENTS.md

# Tailor — memória do projeto

Sistema de propostas sob medida da consultoria de imagem da Renilza Miranda.
Leia `PRODUCT.md` para a verdade de produto e `DESIGN.md` para o mundo visual
como construído. Este arquivo é o log de decisões e as convenções do código.

## Fontes da verdade, nesta ordem

1. `PRODUCT.md` — usuárias, propósito, condições do Conselho, compromissos de marca.
2. `OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/branding/BRAND-VISUAL.md`
   v1.1 — sistema de identidade, com protocolo de mudança no §10. **Vence o
   protótipo** em cor, tipografia, forma e vetos.
3. `.../21-renilza-consultoria-imagem/tailor-proposal-crafter/tailor-copy-deck.md`
   — a fonte de texto. `messages/pt.json` é ele como dados.
4. `.../tailor-spec.md` — rotas, schema, pipeline, custo, riscos.
5. `.../tailor-v0.2.html` — o protótipo. Autoridade sobre **estrutura, fluxo,
   copy e modelo de estado**. Não é autoridade visual: foi construído sem o
   BRAND-VISUAL v1.1 e viola o §8 em quatro pontos (gradiente na barra de
   progresso, botão primário preenchido de ouro, emoji na interface, tipografia
   divergente).

## As sete condições do Conselho (13/08/2026, aprovado 6–0)

Restrição de produto, não sugestão. Ver o README para onde cada uma vive.
`src/lib/conselho.test.ts` trava C1, C3 e C4, que quebram em silêncio.

## Regras que não se negociam neste repo

- **Nenhum preço fora de `src/content/config.ts`.** Se aparecer um número de
  oferta em outro arquivo, é bug.
- **Nenhum número exibido que ela não tenha declarado.** Nada de projeção,
  estimativa ou exemplo. A aritmética é dela e só dela.
- **Nenhum depoimento, contador de alunas, credencial ou case inventado.** Não
  existe material real; o Bloco 6 diz isso na tela.
- **Nunca commitar credencial.** `.env.example` com placeholders; valores reais
  só em `.env.local`.
- **Commits são manuais do Willian.** Um agente pode `git add`; nunca
  `git commit` nem `git push`.
- Conventional Commits, em inglês. Nenhuma menção a IA em commit, código,
  comentário ou PR.

## Convenções do código

- Código e comentários em **português**, como o resto do domínio — a exceção
  são termos de framework. Nomes de tipo em PascalCase, funções em camelCase,
  arquivos em kebab-case.
- Comentário só quando o **porquê** não é óbvio pelo código. A densidade atual
  é a referência: comentar decisão de conselho, armadilha medida e divergência
  de marca; não comentar o que a linha seguinte já diz.
- Tailwind para layout e espaço (só os tokens `p1..p7`); tokens de marca por
  CSS custom property; as primitivas do mundo em `globals.css` e
  `components/molde.tsx`.
- Rotas de API validam com Zod na entrada e **refazem** no servidor toda
  validação que o cliente já fez.
- Nada de animar `height`/`width`. Movimento por `transform` e `opacity`.

## Ambiente

- **Node 20.9+** (Next 16). A máquina responde Node 18 por padrão:
  `nvm use 20.17.0`, ou prefixe `C:\Users\willi\AppData\Local\nvm\v20.17.0` no PATH.
- `vitest.config.mts` precisa da extensão `.mts` — como `package.json` não tem
  `"type": "module"`, um `.ts` é carregado como CJS e o vitest quebra com
  `ERR_REQUIRE_ESM` no Node 20.
- `src/middleware.ts` (runtime edge), não `proxy.ts` — o Next 16 mantém a
  convenção antiga exatamente para edge, e o adapter do Netlify só tem caminho
  maduro para middleware edge (o wrapper de node-middleware quebra no runtime
  do bundler). Ver o comentário no próprio arquivo.

---

## Log

### 13/08/2026 — Engenharia v0.2, fatia F1→F4

**Repositório.** Nasceu em `C:\_tailor`, fora do OneDrive, repo próprio. Não
entrou no `_ai-platform` porque aquele `PRODUCT.md` declara "nenhum usuário
final externo direto" e "reuso por natureza da ferramenta, não por cliente" — o
Tailor é o oposto: produto de um cliente, com deploy próprio e dado pessoal sob
LGPD. O `tailor-spec.md` §6.7 já tinha registrado que isto deveria nascer em
`C:\`.

**Mundo visual.** Sorteio do `concept-seed` (candidato 6 de 7, chave
`1d77bb43`) caiu em **A Folha de Molde**. O quilt de retalhos, a bancada de
osciloscópio e o dossiê de espionagem foram fundidos, pesados e perderam. Ver
`DESIGN.md`.

**Arco de superfície.** O questionário acontece em noir e a proposta vira
ivory. É a frase-mestra da marca executada como mecânica, e obedece
literalmente à regra 4 do §2.4.

**Conflito resolvido — paleta.** O prompt v0.2, o protótipo e o BRAND-VISUAL
v1.1 traziam três paletas diferentes. Venceu o BRAND-VISUAL: é o documento de
governança, com protocolo formal de mudança, e o protótipo demonstravelmente
não foi construído contra ele.

**Conflito resolvido — C5 × veto de countdown.** A validade de 72h expira de
verdade no servidor (C5 intacta) mas é exibida como data sóbria, nunca como
relógio regressivo (§8).

**Conflito resolvido — C1.** O fluxo tinha o gate na décima tela. Aplicado o
corte que o próprio Conselho prescreveu: a Q2 virou sub-opção revelada dentro
da Q1. Fecha em exatamente 9, travado por teste.

**Defeito encontrado e corrigido.** O arredondamento "bonito" do teto da fita
levava 1.200 a uma régua de 5.000 — 4,17×, acima do limite de 2–3× de C4 — e as
graduações passavam do teto fora de ordem. Corrigido e travado por teste.

**Contraste.** Dois tokens reprovavam em 4.5:1 (`--ivory-3` em cima do mínimo,
`--ink-3` sobre ivory reprovando). Ajustados; a divergência está registrada em
`DESIGN.md` para voltar ao BRAND-VISUAL.

**Não feito nesta fatia:** F5 (modo confirmação), F6 (áudio + Groq), e o
restante de F7. O modo áudio tem as strings de consentimento prontas em
`messages/pt.json`, mas nenhuma UI — C7 manda frio → confirmação → áudio.

**Revisão de acabamento degradada, e isto é uma ressalva real:** o painel do
navegador não compõe frames nesta sessão, então **nenhuma captura de tela foi
feita**. O detector mecânico passa limpo e a revisão contra o contrato de
direção rodou só sobre o código, por mim — não houve revisor independente.
Antes de mostrar isto à Renilza, abra em um celular de verdade.

**Pendências que precisam de decisão humana:**
- Os três acentos de persona não existem no BRAND-VISUAL — registrar pelo §10.
- Qual checkout real (Kiwify ✅ confirmado 15/07 para níveis 0–2 × Hotmart no
  kickoff × checkout próprio) segue ⏳ pendente.
- A Fita Métrica usa a escada de 3 degraus da skill de reels; a escada vigente
  do rebranding de 06/08 tem 6 e O Círculo é o degrau mais barato. Mantida como
  jornada de identidade, não ranking de preço — validar com a Renilza.
- Moeda da calculadora do gap para lead em EN/FR.
- Número de WhatsApp oficial (`NEXT_PUBLIC_WHATSAPP` está com placeholder).

### 13/08/2026 (mesma sessão) — Pendências resolvidas

Quatro decisões do Willian, aplicadas e travadas por teste:

1. **Acentos de persona recalibrados à família do terra.** Os valores do brief
   (#D98A93 / #C97F45 / #7E9B8A) tinham origem cromática dispersa; agora são
   `#C17B83` rosa-argila, `#BC7C4E` âmbar-terra e `#6F9B85` verde-sálvia — mesma
   faixa de saturação do `--terra`. Falta registrar no BRAND-VISUAL pelo §10.
2. **Moeda por idioma.** BRL no pt-BR, USD no en/fr. **Sem conversão** — cada
   moeda tem faixa própria de slider, porque converter introduziria uma taxa de
   câmbio que ninguém declarou. Ver `MOEDA_POR_IDIOMA` e `FAIXAS_POR_MOEDA`.
3. **Pontes da fita corrigidas** para a esteira vigente: Jornada Valor Percebido
   → Dossiê de Imagem → Método Prisma. Progressão monotônica de profundidade e
   preço; O Círculo saiu da fita (é entrada, não topo).
4. **A oferta do Bloco 7 sai da faixa que ela marcou na Q9.** `OFERTA_POR_FAIXA`
   mapeia faixa → produto; a Q9 passou a guardar a **chave** da faixa, não o
   rótulo, para não quebrar em revisão de copy ou tradução. Preços seguem ◆.

**WhatsApp oficial aplicado:** `5511950291364`, fonte 🧠 Renilza — Estratégia
Central no Notion. A env `NEXT_PUBLIC_WHATSAPP` sobrepõe para teste.

**Checkout — pesquisa feita, recomendação híbrida.** Taxas verificadas em
fontes oficiais (agosto/2026): Hotmart 9,9%+R$1 · Kiwify 8,99%+R$2,49 · Asaas
Pix R$1,99 fixo e cartão ~2,99%. Num trimestre de R$150 mil com ~R$140 mil em
high-ticket, a plataforma custa ≈R$13.900 e um gateway próprio ≈R$1.750 —
**≈R$12.100 por trimestre de diferença, 94% dela concentrada no high-ticket**,
onde a plataforma não entrega nada (venda é 1:1 por WhatsApp: sem afiliado, sem
área de membros, sem recuperação de carrinho). Recomendação: Hotmart fica com
0–2 (assinaturas precisam de dunning e área de membros, e a economia absoluta
lá é ~R$700/trimestre), checkout próprio para Dossiê/Imersão/Prisma dentro do
Tailor. Gateway sugerido: **Asaas**; evitar Pagar.me/PagBank em 12x absorvido
(21–25%). Falta o Willian executar.

**Pendências que continuam abertas:**
- Confirmar com a Renilza o mapa faixa→produto, sobretudo "até R$ 2.000", onde
  nenhum produto 1:1 cabe (o mais barato é o Dossiê a R$2.500).
- Preços reais — todo ◆ segue em `src/content/config.ts`.
- Registrar no BRAND-VISUAL §10: os três acentos e as duas divergências de
  contraste.

### 13/08/2026 (mesma sessão) — Checkout ligado

Quatro premissas assumidas na ausência de resposta, todas reversíveis e todas
registradas no quadro de gestão:

1. **Hotmart = cross-sell no fim da proposta** (`crossSellHotmart()`). Sem os
   `HOTMART_LINK_*` o bloco não aparece.
2. **Asaas = link de pagamento por proposta**, com `externalReference` = id do
   lead. Ela preenche os próprios dados no checkout deles, então o CPF nunca
   entra no nosso banco e a minimização do `PRODUCT.md` fica intacta.
3. **Juros do parcelamento repassados a ela** — taxa efetiva ~3%.
   `CHECKOUT_MAX_PARCELAS=1` desliga o parcelado.
4. **Redireciona para o checkout hospedado do Asaas** — escopo de PCI zero
   deste lado.

**Sem preço, nada é cobrado e nada é inventado.** Os preços vivem em env, em
centavos (`PRECO_*_CENTAVOS`); ausentes, a rota `/api/proposta/[token]/checkout`
responde `{estado:"mock",motivo:"sem_preco"}` e a página assume o aviso de
demonstração. Travado por teste em `src/lib/checkout.test.ts`, inclusive que o
Asaas **não é chamado** nesse caminho.

**O link de pagamento expira junto com a proposta** (`endDate`) — C5 vale
também para o dinheiro, não só para o texto na tela.

⚠️ **`src/lib/asaas.ts` nunca foi chamado contra a API real.** Foi escrito sem
credencial disponível: o contrato é o documentado, não o observado. Rodar uma
cobrança em sandbox antes de apontar `ASAAS_AMBIENTE=producao`.

**Quadro de gestão publicado:** https://claude.ai/code/artifact/efe64c4e-4728-49bb-9d29-8db4f4fa5791

### 13/08/2026 (mesma sessão) — Infra, F5 e deploy

**O repo mudou de casa: `C:\_ParenteIT\_tailor`** (era `C:\_tailor`). Movido
fora desta sessão; conferido íntegro — nada perdido, staged preservado.

**Supabase provisionado de verdade.** Projeto `tailor`, ref
`ffyzmplwuvxdzikxpsje`, região `sa-east-1`, plano free. A migração
`0001_tailor_init` foi aplicada e os advisors conferidos: os 4 avisos de "RLS
sem policy" são o C6 por construção (negar tudo que não é service_role).
Ficou **um WARN aberto**: `tocar_atualizado_em` com `search_path` mutável —
corrigir com `alter function ... set search_path = ''` no 0001 **e** no banco,
juntos, para repo e produção não divergirem.

**Segredos moram no Bitwarden** (conta do Willian, pastas `Tailor/*`): 10
itens, campos ocultos ainda vazios. O item "Tailor — mapa do .env.local" é o
índice env → item. Asaas sandbox e produção são itens separados de propósito.
Limite descoberto: organização free = 2 collections; a estrutura foi em
pastas pessoais.

**F5 — modo confirmação, implementado.** `/[locale]/diagnostico/c/[token]` +
`GET /api/confirmation/[token]`. Decisões de engenharia:
- É o **mesmo** `Quiz`, com prop opcional `confirmacao` — nenhuma segunda
  implementação do fluxo. C1 segue valendo e testado.
- Só `espelho`, `q3` e `gap` são confirmáveis por áudio. O resto é escolha em
  lista que ninguém dita num áudio.
- **Verbatim sem resposta gravada por trás é descartado** — a regra que impede
  "confirma?" sobre o vazio. Reusa `etapaCompleta`, o mesmo portão do quiz
  frio. Travado por `confirmacao.test.ts` (12 testes; suíte em 42).
- Autosave no modo confirmação **não rebaixa** `origem` para `quiz_frio` — a
  guarda está no `upsertLead` dos dois backends.
- Link inválido/expirado degrada para o quiz frio com um aviso, nunca para
  página de erro: ela veio responder, o erro é nosso.
- O verbatim vive em `respostas_raw.ouvido` (jsonb); vira coluna quando o
  formato estabilizar. O transcritor local é quem grava.

**Preço e nome de produto agora são env de ponta a ponta.**
`precoExibido()`/`nomeExibido()` em `lib/checkout.ts`; a oferta do Bloco 7 usa
os dois. A MESMA `PRECO_*_CENTAVOS` alimenta tela e cobrança; `PRODUTO_*_NOME`
sobrescreve o catálogo. Sem env, ◆ — nada é inventado para demo.

**Deploy NO AR: https://tailor-renilza.netlify.app** (site `tailor-renilza`,
id `22968c95…`, conta do Willian). Verificado por requisição: quiz 200 em
`/pt/diagnostico`, middleware edge redirecionando `/` → `/pt`, e `/api/leads`
respondendo 500 de propósito até a service role existir. Três correções que o
deploy exigiu: **fontes self-hosted** em `src/fonts/` (next/font/google baixava
em build e recebia 404 do gstatic), **build webpack no deploy**
(`build:netlify`; o edge-bundler não compila runtime de Turbopack) e
**`middleware.ts` edge no lugar de `proxy.ts`** (wrapper node-middleware do
adapter quebra — issue #3114 do opennextjs-netlify).
`netlify.toml` com `@netlify/plugin-nextjs` e Node 20.17.0. Envs setadas:
`SUPABASE_URL`, `APP_URL`, `PRECO_DOSSIE_CENTAVOS=250000` (o único preço
documentado como real). **Pendente humano: colar `SUPABASE_SERVICE_ROLE` e
`ANTHROPIC_API_KEY` no painel do Netlify** — sem a primeira, gravar lead/
proposta falha de propósito em produção; sem a segunda, o diagnóstico sai
degradado (por design). Redeploy: `npx -y @netlify/mcp` (ver README) ou o
botão do painel.

**Asaas — bloqueio real:** o CNPJ 35.570.755/0001-06 já tem conta, criada há
~2-3 anos, e-mail desconhecido (não está na caixa do Workspace, que é de
jul/2026). Caminho: recuperar pelo suporte do Asaas com CNPJ + docs da
titular; **não** criar conta nova de produção com o mesmo CNPJ. O sandbox é
ambiente separado — dá pra criar conta sandbox nova e destravar o teste da
integração sem esperar a recuperação.

### 14/08/2026 — Branch `design-retencao-e-f6`: pesquisa de retenção + F6 (áudio)

**Pesquisa em três frentes** (workflow Fable, max effort, três agentes em
paralelo + síntese): cor/identificação, gamificação compatível com o §8,
retenção UX mobile. Achados reais implementados: bug de contraste WCAG real
(ouro sobre ivory reprovava — `[data-superficie="ivory"]` não redefinia os
tokens de ouro), `--color-alerta` separado dos acentos de persona (erro não
pode sair na cor de uma persona que não é dela), re-tingimento do trilho na
escolha da persona, penumbra na Q3 (`--surface: noir-2`), gap de R$0
fabricado quando só a primeira régua era tocada (bug real, corrigido),
retomada local (`localStorage`, `src/lib/retomada.ts`) para sobreviver a
webview descartando a aba. `npx tsc`, `vitest` e o detector do impeccable
limpos antes de cada commit lógico; um "Maximum update depth exceeded" só em
`next dev` foi investigado a fundo e **descartado** — não reproduz em build
de produção, StrictMode/HMR do Turbopack, não é bug de código.

**F6 — modo áudio.** `src/lib/groq.ts` (fetch cru contra o endpoint
compatível OpenAI da Groq, sem SDK nova — mesmo padrão do `asaas.ts`),
`/api/transcribe` (rate limit próprio, nunca persiste o arquivo),
`src/lib/gravador.ts` (`useGravador`, MediaRecorder + consentimento
explícito em etapa própria, nunca um checkbox), `BotaoAudio` em `molde.tsx`
(ícone de mic desenhado, não emoji). Ligado só na Q3 por ora — `situacaoOutro`
e `q7Outro` ficam para uma rodada seguinte. `q3Via`/`consentimentoAudioEm`
agora trafegam de verdade cliente → `/api/leads` → Supabase (antes,
`q3Via` era sempre hardcoded "texto" na rota, mesmo quando a coluna e o tipo
já existiam prontos — achado consertando o F6). Mesmo achado revelou que
`origem` também era sempre sobrescrito para `quiz_frio` a cada autosave,
inclusive no modo confirmação — corrigido junto, é o mesmo arquivo.

Verificado por interação real (não só `tsc`/testes): fluxo completo até o
consentimento de áudio, em build de produção local. A investigação bateu
numa pegadinha da própria ferramenta de automação do navegador — coordenada
de clique no referencial do screenshot (1568px) não é a mesma coisa que
`getBoundingClientRect()` no viewport real (1912px, escala ~0,82) — registrada
aqui porque custou a maior parte do tempo desta rodada e não é óbvia.

**Não testado nesta rodada:** transcrição de verdade (exige `GROQ_API_KEY`,
que não existe neste ambiente, e microfone real). O caminho de erro
(permissão negada, Groq fora do ar) está coberto no código mas não
observado ao vivo.

### 14/08/2026 (mesma sessão) — Reconciliação com a esteira v4: faixa da Q9

A esteira de produtos v4 (mesma data) subiu o Dossiê de R$ 2.500 para
R$ 3.500 e fixou o Prisma em Essencial R$ 6.997 / Completo R$ 9.997. Isso
quebrou a regra que o próprio `OFERTA_POR_FAIXA` já se impunha (comentário de
13/08): "nenhum degrau da Q9 pode prometer um teto que a esteira não atende".
Quem marcava "até R$ 2.500" passaria a ver uma proposta R$ 1.000 acima do que
sinalizou caber no bolso.

**Correção (decisão do Willian, 14/08/2026):** subir os cinco degraus da Q9
para casar com os preços reais, em vez de inventar um produto mais barato ou
usar a Jornada (assinatura mensal via Hotmart, sem preço avulso, não serve
para um checkout 1:1). Chaves e mapa em `src/content/config.ts`:

```
ate3500     → dossie           (R$ 3.500)
de3500a7k   → prismaEssencial  (R$ 6.997)
de7a10k     → prismaCompleto   (R$ 9.997)
acima10k    → prismaCompleto   (inalterado)
naoDizer    → prismaEssencial  (era dossie — dossie virou o degrau de entrada,
                                 então "não quis dizer" agora cai no meio, não
                                 mais no fundo)
```

Copy correspondente em `messages/pt.json` (`q9.opcoes`) e testes em
`src/lib/conselho.test.ts` atualizados junto — `vitest run` (45/45) e
`tsc --noEmit` limpos depois da mudança.

**Confirmado, sem alteração de código — três perguntas resolvidas por
investigação, não por suposição:**
- **Fita métrica (Bloco 4, `proposta.b4.pontes`):** já é só Jornada → Dossiê →
  Prisma. O Círculo nunca esteve nela — não existe nada para remover. Faz
  sentido ficar assim: Círculo e Raio-X são gratuitos, topo de funil por
  IG/Brevo, não degraus de uma jornada paga.
- **Persona "estética":** não existe. As três personas (`patricia`, `camila`,
  `carla`) cobrem autoestima/guarda-roupa, carreira e precificação de clínica
  — nenhuma delas, nem a esteira v4, nomeiam um eixo "estética" separado. A
  fita métrica já é intencionalmente unificada (mesmos três produtos, mesma
  sequência, para as três) — só a copy de cada estação varia por persona
  (`proposta.b4.copy.<persona>.<estacao>`). Não há produto de estética
  específico para construir uma fita própria; inventar uma agora seria
  presumir um eixo que a esteira não define.
- **Bloco 6 (prova social):** segue exatamente como está — aviso honesto de
  que não existe depoimento real ainda, sem nada inventado. Nenhuma mudança.

### 14/08/2026 (branch `whatsapp-direto`) — Acionamento direto via WhatsApp

Até aqui o "modo confirmação" exigia o Willian no meio: ouvir o áudio que
chegava no WhatsApp, transcrever com ferramenta própria, e escrever lead +
`confirmation_token` direto no banco por SQL. `store.ts` já sabia gravar o
token (`upsertLead`/`registrarContatoWhatsapp`) desde a sessão passada, mas
nada no código o chamava — achado confirmado por grep antes de escrever
qualquer linha.

**Fluxo novo**, workflow com Opus 5 em 4 fases (investigar codebase + contrato
real da WhatsApp Cloud API via WebSearch → projetar → implementar → revisar
adversarial), depois eu mesmo apliquei as correções que a revisão levantou:
mensagem chega em `POST /api/webhooks/whatsapp` → assinatura HMAC-SHA256
conferida em tempo constante sobre o corpo cru (unicode escapado — calcular
sobre JSON reserializado dá assinatura diferente, e todo lead brasileiro
manda acento) → lead buscado por `variantesDeWhatsapp` (a Meta às vezes omite
o nono dígito do celular) ou criado → se áudio, baixa mídia (dois passos,
URL restrita a `*.fbsbx.com`) e transcreve pelo `transcricao.ts` já existente
→ grava o texto em `respostas_raw.ouvido`, o mesmo lugar de sempre → gera
`confirmation_token` com `gerarTokenProposta()` → responde com o link, texto
livre dentro da janela de 24h ou template aprovado fora dela.

**Arquivos novos:** `src/lib/whatsapp.ts` (cliente Cloud API),
`src/lib/whatsapp-mensagem.ts` (o fluxo), `src/app/api/webhooks/whatsapp/route.ts`,
migração `0002_whatsapp_acionamento.sql` (índice em `leads.whatsapp`,
`ultima_mensagem_recebida_em`, tabela `mensagens_whatsapp` para idempotência
por `wamid`), e 3 arquivos de teste (31 casos). Aplicada em produção.

**Revisão adversarial encontrou 9 pontos reais, todos corrigidos por mim
depois do workflow:**
- **O mais sério:** o rate limit por chamador da rota usava o IP de quem
  chama — que para um webhook é sempre a borda da Meta, não a lead. Um teto
  apertado ali arrisca 429 em pico de reentrega, e reentrega falhando repetido
  é o que faz a Meta desativar a assinatura. Subido de 120 para 3.000/min; o
  teto que de fato protege é o por remetente (5/min) e o global por hora.
- `registrarContatoWhatsapp` e `upsertLead` podiam "ter sucesso" sem escrever
  nada (update contra lead removido/inexistente casa zero linhas sem erro no
  Postgres) — ela receberia um link que sempre dá 404. Corrigido nos dois
  backends, nos dois métodos.
- Colisão de `confirmation_token` só virava `TokenEmUso` (e portanto retry) no
  caminho de lead existente; no de lead novo caía em erro genérico. Corrigido
  para tratar 23505 igual nos dois caminhos, nos dois backends.
- Chave do rate limit por remetente usava o número cru, não a variante
  canônica — a mesma mulher com/sem o nono dígito ganhava dois baldes,
  furando o próprio limite.
- Três comentários corrigidos por overclaim (o filtro de `phone_number_id` só
  vale com a env setada; o teto de 3MB é checagem de bom senso pós-buffer, não
  guarda de memória real; a ordem de checar limite antes de reservar o wamid é
  economia de escrita, não proteção do wamid).
- Dois campos escritos sem leitor (`whatsappConfigurado`,
  `ultimaMensagemRecebidaEm`) — decisão registrada: manter, documentados como
  infraestrutura à frente do uso (consistência de formato com
  `asaasConfigurado`/`transcricaoDisponivel`; janela de 24h para envio fora do
  fluxo de recebimento, ainda não construído).

**Risco aceito, registrado em código e aqui, não corrigido nesta rodada:**
`buscarLeadPorWhatsapp` casa por número em qualquer origem, inclusive lead
criado pelo quiz. Alguém pode digitar o WhatsApp de outra pessoa no quiz (o
número não é verificado ali); se essa pessoa depois mandar mensagem de
verdade, o fluxo "adota" o lead do quiz e ela recebe um link de confirmação
sobre respostas que nunca deu. Vazamento estreito (a dona do número vê algo
associado ao próprio número, não um terceiro vendo dado alheio) e a cadeia de
ataque é convoluta, mas real — e a pergunta é confissão pessoal, sensível o
bastante para não deixar implícito. Mitigação (não adotar lead sem
`confirmation_token` prévio, ou verificar número no quiz) é decisão de
produto, não bug.

**O que não dá para testar nem funcionar sem conta real da Meta:** Business
verificado, WhatsApp Business Account, número aprovado, token permanente de
System User, template de mensagem aprovado — processo de conta e negócio,
dias de espera, não algo que se resolve com código. Todo o resto degrada
graciosamente sem essas env, do mesmo jeito que Groq/Deepgram/Asaas já fazem.

`vitest run` 111/111 (duas vezes seguidas, para confirmar que o backend de
arquivo não regride em corrida) e `tsc --noEmit` limpos depois das correções.
Nenhum `git commit` nem `git push` — staged, à espera do Willian, na branch
`whatsapp-direto`.

### 14/08/2026 (mesma sessão) — E-mail no gate, rate limit durável, Imersão fora do catálogo

**E-mail no quiz (decisão do Willian: pedir).** Campo opcional na tela do
gate, ao lado de nome/WhatsApp — vazio é válido, só reprova o que ela
efetivamente digitou e está incompleto (`emailValido`, `src/lib/quiz-state.ts`).
Migration `leads_add_email` aplicada em produção (`leads.email text`, nullable,
sem unique). Trafega só na submissão final do gate (`POST /api/proposal`),
igual a nome/whatsapp — nunca no autosave por etapa, mesma regra de
minimização que já valia pros outros dois. **Nenhum envio automatizado existe
ainda** — o campo coleta o dado; usá-lo para nutrição por e-mail é decisão e
integração futuras, não implícitas nesta mudança.

**Rate limit durável (Upstash).** `verificarLimiteDuravel` em
`src/lib/rate-limit.ts` usa Upstash Redis (sliding window,
`@upstash/ratelimit` + `@upstash/redis`) quando `UPSTASH_REDIS_REST_URL` e
`UPSTASH_REDIS_REST_TOKEN` existem; sem elas, ou se o Upstash cair, cai para o
balde por processo de sempre — nunca menos proteção do que já havia. As 7
rotas com rate limit (`leads`, `proposal`, `transcribe`, `analyze`,
`confirmation/[token]`, `proposta/[token]/checkout`,
`proposta/[token]/evento`) migradas para a versão durável. Falta só colar as
duas env no Netlify — sem conta Upstash criada nesta sessão (criação de conta
é ação do Willian).

**Nota fiscal — não é código.** Ficou registrado no quadro de gestão como
pendência técnica, mas é dívida operacional: sair da Hotmart/Kiwify pro
checkout próprio (Asaas) tira a emissão automática de nota que a plataforma
fazia. Requer contratar um serviço de emissão (NFe.io, eNotas ou equivalente)
ou processo manual com contador — decisão de fornecedor e custo recorrente
(~R$100–200/mês) que não me cabe tomar nem executar (criação de conta em
serviço de terceiro é ação do Willian).

**Imersão de Estilo removida do catálogo do Tailor** (decisão do Willian, em
resposta à pergunta sobre o preço em aberto): produto tirado de `PRODUTOS`
(`src/content/config.ts`) e de `ENV_DE_PRECO` (`src/lib/checkout.ts`) — não
existe mais como opção de checkout no produto, consistente com estar fora da
esteira v4 oficial. `.env.example` reconciliado junto.

`vitest run` 50/50 (5 testes novos: `emailValido` × 3, `verificarLimiteDuravel`
× 2) e `tsc --noEmit` limpos.

### 14/08/2026 (mesma sessão) — Auditoria de segurança e transcrição trocável

Auditoria em 4 frentes (injeção/dados, authz/tokens, headers/XSS/SSRF,
segredos/LGPD/deps), cada achado passando por verificador adversarial
instruído a refutar. 19 achados brutos → **2 furos reais** (os outros 6
"confirmados" eram o mesmo bug reportado por frentes diferentes), 13
refutados com justificativa em código.

**Furo 1 (alto) — `identificarChamador` confiava no XFF mais à esquerda.**
`x-forwarded-for.split(",")[0]` é justamente o trecho que o cliente escreve; a
borda ACRESCENTA à direita. O comentário antigo justificava com "atrás da
Vercel", mas o deploy é Netlify, onde o cabeçalho confiável é
`x-nf-client-connection-ip` — que não era lido em lugar nenhum. Como essa
string é a chave do balde nas 7 rotas, um laço de curl variando o cabeçalho
caía num balde novo a cada requisição e o teto nunca disparava: gasto
ilimitado na Anthropic via `/api/proposal` (2 chamadas por requisição) e na
Groq via `/api/transcribe`. Corrigido lendo cabeçalhos de borda em ordem de
confiança, e caindo para o XFF pela **direita**; `x-real-ip` saiu (nada nesta
stack o normaliza) e o default virou balde único compartilhado (`sem-origem`)
em vez de chave nova por anônimo.

**Rede embaixo do furo 1:** `dentroDoTetoGlobal` conta a rota inteira sem
olhar quem chamou, então nenhuma falsificação de origem o contorna. Ligado em
`/api/proposal`, `/api/analyze` e `/api/transcribe`, ajustável por env
(`TETO_GLOBAL_*_POR_HORA`). Sem Upstash não há teto global possível e ele
libera — o limite por chamador continua sendo o que sempre foi.

**Furo 2 (médio) — `meta` da rota de eventos era jsonb sem teto.**
`z.record(z.string(), z.unknown())` sem `.max()` em nada, indo direto para
coluna jsonb; era o único campo de origem do usuário sem limite no projeto.
Um laço gravando MB por requisição enchia o disco do Supabase até o banco
virar somente-leitura, derrubando o funil inteiro. Restringido a chaves de 40
chars, valores escalares de 200, máximo 10 chaves, mais recusa por
`content-length` acima de 4KB. A tela nunca mandou `meta` — `oferta.tsx`
envia só `{ tipo }`.

**Três bugs de corretude que a verificação descartou como vulnerabilidade mas
confirmou como defeito** — corrigidos porque são baratos e um deles é LGPD:
- `/api/proposal` apagava `consentimento_audio_em` e rebaixava `q3Via` para
  "texto": o upsert grava a linha inteira, e o gate não reenviava esses
  campos. A submissão legítima da lead destruía a evidência do consentimento
  que ela mesma tinha dado. O F6 corrigiu só o caminho `/api/leads` e nunca
  tocou aqui. Corrigido nos dois lados (schema da rota + `enviarGate`).
- `escolherOferta` fazia `OFERTA_POR_FAIXA[faixa as FaixaInvestimento]` — cast
  só de compilação. Uma q9 valendo `"toString"` alcançava `Object.prototype`,
  devolvia função, o `??` não caía no fallback e o `checkout.ts` quebrava com
  TypeError (500 depois de já ter gravado lead e respostas). Agora valida
  pertinência a `FAIXAS_INVESTIMENTO` de verdade.
- `buscarPropostaPorToken` não olhava `removido_em`, ao contrário de
  `buscarLeadPorConfirmationToken`. Nada escreve essa coluna hoje, mas quando
  escrever, pedir exclusão apagaria o cadastro e o link no WhatsApp dela
  continuaria abrindo a proposta com nome e confissão dentro. Join `!inner`
  com `leads` fecha isso agora.

**Transcrição virou trocável por env** (decisão do Willian): `src/lib/groq.ts`
deu lugar a `src/lib/transcricao.ts`, com Groq e Deepgram atrás da mesma
porta. `TRANSCRICAO_PROVEDOR` escolhe; env inválida cai na Groq com log em vez
de derrubar o modo áudio. A rota não sabe quem atendeu. Deepgram recebe bytes
crus (sem multipart) e usa `nova-2` com `pt-BR`; Groq segue no
`whisper-large-v3-turbo`. Motivo: o console da Groq ficou inacessível nesta
sessão e valia ter a saída pronta antes de precisar dela.

`vitest run` 55/55 e `tsc --noEmit` limpos.

**Webhook do Asaas — a metade que faltava do checkout.** O painel mostrou
"Nenhum Webhook encontrado": o produto criava o link de pagamento e **nunca
ficava sabendo se alguém pagou**. O lead travava em `checkout_iniciado` para
sempre e só o painel do Asaas sabia a verdade — a Renilza teria que conferir
na mão, uma a uma. O `asaas.ts` já mandava o `leadId` como
`externalReference` "para amarrar quando o webhook chegar"; o receptor nunca
tinha sido escrito.

`POST /api/webhooks/asaas` fecha isso. Decisões que valem registro:
- **Falha fechado.** Sem `ASAAS_WEBHOOK_TOKEN` a rota responde 503 e não
  processa nada. Aberta, qualquer um marcaria qualquer lead como pago — é a
  única rota pública que move um lead para "fechado".
- Token no cabeçalho `asaas-access-token`, comparado com `timingSafeEqual`.
- **Nenhum valor monetário do corpo decide nada.** O webhook só diz que um
  pagamento mudou de estado; preço continua vindo da env. Confiar no corpo
  seria deixar o remetente escolher quanto foi pago.
- `externalReference` validado como UUID antes de virar consulta.
- Idempotente por construção: `atualizarStatusLead` devolve o status anterior
  e só escreve quando muda, então reentrega do Asaas não duplica evento.
- Evento desconhecido responde 200 — devolver erro faria o Asaas reentregar
  para sempre algo que nunca vamos querer. 500 só em falha nossa, aí a
  reentrega é desejada.

**Validação do webhook (mesma sessão).** O webhook foi registrado no painel da
conta de teste (Parenteit) e conferido campo a campo relendo o registro salvo,
não o formulário digitado: v3, envio **sequencial** (fora de ordem, um
`PAYMENT_REFUNDED` chegando antes do `PAYMENT_CONFIRMED` deixaria o lead
"fechado" em vez de "perdido"), token definido, exatamente os 5 eventos do
`STATUS_POR_EVENTO`, e **desativado de propósito** — a rota responde 404 em
produção enquanto esta branch não for publicada, e webhook ativo apontando
para 404 faz o Asaas travar a fila e desativar sozinho.

`ASAAS_WEBHOOK_TOKEN` já existe no Netlify (conferido por `env:list`), marcada
como secreta.

**`webhook-asaas-fluxo.test.ts`** cobre o caminho feliz, que era o buraco:
`webhook-asaas.test.ts` testa quem NÃO entra, este testa o que acontece com
quem entra — pagamento vira status, reentrega não reverte, lead inexistente
responde 200 (500 faria o Asaas reentregar para sempre um evento que nunca
resolve, ex.: lead apagado por LGPD).

Duas correções que só apareceram porque a asserção foi feita direito:
- A primeira versão do teste usava `atualizarStatusLead` para LER o status —
  mas ela também escreve, então o teste de reentrega passaria com o webhook
  sem fazer nada. Trocado por leitura direta do arquivo.
- Com a leitura honesta, apareceu divergência real entre os backends: o
  backend de arquivo não inicializava `status`, enquanto o Supabase tem
  `default 'novo'`. Dev deixava de refletir produção justo no campo que o
  webhook move. Corrigido em `store.ts`.

Falta ativar o webhook no painel — depois de publicar a branch, nunca antes.

**Asaas — NF não configurada, e o bloqueio não é de acesso.** A conta aberta é
**PARENTEIT LTDA, CNPJ 59.963.184/0001-38** — outra empresa que não a da
Renilza (35.570.755/0001-06). O próprio painel declara duas pendências:
migração obrigatória para o Portal Nacional, e **certificado digital +
senha**, que a prefeitura exige. Certificado digital assina documento fiscal
em nome da empresa: é credencial criptográfica, não configuração, e não é algo
que um agente deva instalar nem ter a senha. Somado ao problema de entidade
(a NF sairia da Parente IT para a cliente final de um serviço fora do CNAE
dela, exigindo depois a Renilza faturar contra a Parente IT — dois fatos
geradores), a recomendação registrada é: usar esta conta só em **sandbox**
para validar a integração, e manter a recuperação da conta da Renilza como o
caminho de produção.

### 30/08/2026 — Sessão remota: link oficial, auditoria de pendências, experimento de presença visual

**Link oficial validado: `https://sobmedida.renilzamiranda.com`** — sem
hífen, `.com` (não `.com.br`). Confirmado ao vivo por `curl`: responde
`Netlify`/`Next.js`, redireciona `/` → `/pt` → `/pt/diagnostico`, batendo com
`middleware.ts`. **Não estava documentado em lugar nenhum do repo** — foi
apontado direto no DNS/Netlify fora de uma sessão de código. `sob-medida`
**com hífen não existe** (DNS não resolve) — evitar essa grafia em qualquer
material que circule.

**Ambiente remoto (Claude Code on the web) não herda `node_modules` nem
`.claude/skills/`.** Cada sessão clona o repo do zero: `npm install` é
necessário sempre. Mais importante — a skill `impeccable` usada na auditoria
de 14/08 (`DESIGN.md` linha 138+) **nunca foi commitada**: só o script
existiu na máquina local do Willian, e `.claude/` no repo só tem
`launch.json`. Uma sessão remota não consegue rodar `impeccable` nem achar
"frontend designer" (não existe esse plugin no catálogo da conta — o mais
próximo é o plugin genérico "Design", voltado a Figma/Notion, não instalado).
Se a auditoria mecânica for para continuar valendo em sessão remota, o
script precisa entrar no repo em `.claude/skills/impeccable/`.

**Auditoria de pendências, PM-style.** Conferido por git, não só pelo log:
um único commit consolidado (`23ab0db`, 15/08/2026) reúne tudo até o
`whatsapp-direto`; zero commits e zero PRs desde então. Os bloqueios seguem
sendo **conta, credencial e decisão**, não código: preços reais nas envs
(`config.ts` ainda mostra `◆` em tudo), `SUPABASE_SERVICE_ROLE` e
`ANTHROPIC_API_KEY` no Netlify, recuperação da conta Asaas de produção,
webhook do Asaas (pronto, desativado de propósito), conta WhatsApp Cloud
API, conta Upstash, e nota fiscal. Nenhum item novo além do que já estava
registrado nas seções anteriores deste log — a auditoria só confirmou que
nada mudou desde 15/08.

**Experimento — `src/components/atmosfera.tsx`, commit `5285fe9`.** Pedido
do Willian: "o layout está muito simples e apagado", com autorização
explícita para testar além do §8 do BRAND-VISUAL. Camada de fundo fixa
(`z-index:-1`, `pointer-events:none`), visível só a partir de 900px de
largura (no celular a coluna de leitura já ocupa a tela inteira — screenshot
confirmou que nada muda lá). Desenha a tese do mundo que até aqui só existia
em prosa (`DESIGN.md` linha 11-14 — "várias curvas de tamanho sobrepostas e
só uma é a sua"): curvas de molde, cruzes de registro maiores, um fio de
grainline (marca "sentido do tecido" de peça de molde real, nunca usada no
sistema) e grão de tecido via `feTurbulence`. Só linha, nunca preenchimento;
nenhuma cor nova — lê `--rule`/`--ink-3`/`--color-gold`, que já trocam
sozinhos entre noir e ivory. Verificado ao vivo (Playwright, screenshots
antes/depois enviadas ao Willian) no quiz; no lado ivory da proposta
(`Superficie` em `p/[token]`) está conectado pelo mesmo mecanismo mas **não
foi visto ao vivo** — a automação não conseguiu completar o funil inteiro a
tempo (cartão-espelho resiste a clique programático). `tsc`/`eslint` limpos.
**Isto é proposta para avaliação, não adoção do contrato** — se ficar,
precisa entrar no `BRAND-VISUAL.md` pelo protocolo §10, senão a próxima
sessão volta a tratar como divergência a reconciliar.

**Pesquisa: o que retém até o fim de um formulário.** Fontes são blog de
produto/growth de 2026, não peer-review — direção, não verdade travada.

- Formulário multi-etapa converte mais que formulário único, mas abandono é
  alto (Formstack 2026: 82,4% abandona; acima de 4 passos, conclusão cai a
  9,7%). O Tailor já mitiga isso: C1 trava em 9 telas por teste.
- Barra de progresso animada reduz abandono 20-25% vs. estática;
  *endowed progress* (começar com progresso já feito) aumenta conclusão —
  **já implementado**: o trilho de giz nasce em 15%, e o rótulo "de 9" só
  aparece a partir da Peça 6 (goal-gradient, registrado em `DESIGN.md`).
- Micro-interação (transição fluida entre perguntas) reforça sensação de
  avanço — **já implementado**: `surgir`, o traçado do giz, o tique de
  vibração.
- Cor de destaque/contraste: heatmaps mostram +23% de clique em elementos de
  alto contraste; recomendação de mercado é ~10% da página em cor de
  acento, concentrada no CTA. **Aqui está a tensão real**: isso é bem mais
  área de cor do que o teto de 3% do BRAND-VISUAL §8. A pesquisa de mercado
  geral e o contrato de marca deste produto puxam para lados opostos — não
  dá para "pesquisar a solução" sem decidir antes até onde a marca cede.
- Ilustração/imagem aumenta engajamento em onboarding — mas fica bloqueado
  por **falta de material**, não por design: `PRODUCT.md`/§8 vetam imagem
  inventada, e não existe banco de fotos real da Renilza ainda.
- O gate de contato é onde funis de quiz historicamente perdem 30-50% de
  quem termina — **já mitigado**: o gate ficou "sempre vivo" (CTA nunca
  desabilitado) na rodada de retenção de 14/08.

**Leitura:** a maior parte do que a pesquisa de mercado recomenda para reter
até o fim (progresso, endowed progress, micro-interação) o Tailor já tem,
documentado em `DESIGN.md`. O que falta para ir além — mais cor, imagem — é
exatamente o que o contrato de marca hoje restringe. A `atmosfera` acima é
uma primeira aposta nessa direção sem preenchimento nem imagem; decidir se
vale abrir mais espaço de cor/imagem é decisão do Willian/Renilza, não algo
que pesquisa de mercado resolve sozinha.
