# Histórico de engenharia e design — Tailor

Log único e cronológico das decisões de engenharia, produto, design e
negócio do Tailor, de 13/08/2026 em diante. Nasceu em 19/09/2026 fundindo o
log de `CLAUDE.md` com as rodadas datadas de `DESIGN.md` (essas entradas
trazem _Originalmente em …_). Desde 20/09 as entradas são escritas direto
aqui.

**Isto é histórico, não regra vigente.** Para o que vale hoje: `CLAUDE.md`
(convenções, condições do Conselho, regras do repo), `PRODUCT.md` (produto),
`DESIGN.md` (mundo visual como construído) e
`docs/holding/HANDOFF-implementacao.md` (a especificação do quiz da holding).
Para o que ainda depende de decisão humana: `docs/PENDING.md`. O negócio da
Renilza (esteira, preços, holding) vive no vault, em
`C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/holding/`.

Uma entrada pode descrever algo que uma entrada posterior substitui ou
reverte — isso é o histórico funcionando, não uma contradição a corrigir. A
data e o título de cada entrada bastam para situar o que valia naquele
momento. A linha do tempo logo abaixo dá o status de cada decisão hoje.

**O que faltava neste histórico (corrigido em 23/09/2026).** Até 22/09 este
cabeçalho dizia que nada tinha sido resumido, cortado ou reescrito. Isso
vale para o log do `CLAUDE.md` e para as rodadas datadas do `DESIGN.md` de
`develop`, que entraram inteiros (conferido parágrafo a parágrafo contra
`HEAD` em 23/09). Mas o histórico **não estava completo**:

- cinco entradas de 15/08, 23/08 e 24/08 só existiam no `CLAUDE.md` da
  branch órfã `feature/dark-light-mode` (commit `1379718`). A entrada de
  10/09 decidiu não reimportar aquele arquivo, mas as próprias entradas de
  10/09 citam decisões dele;
- três eventos nunca tiveram entrada: o commit `0dc3470` (10/09), o workflow
  `supabase-keepalive` (commit `c0ae34b`, 19/09) e a reorganização da
  documentação (19/09).

As oito foram **reconstituídas a partir do git** na limpeza de 23/09. Cada
uma está no seu ponto cronológico e marcada com _Reconstituída em
23/09/2026_. São versões curtas. O texto integral das cinco de agosto só
existe em `git show 1379718:CLAUDE.md` (branch `feature/dark-light-mode`,
local e em `origin`); não apague essa branch sem decidir antes se esse texto
importa. IDs da Meta, números de telefone, e-mail e token aparecem como
`[REDACTED]`.

**Caminhos que saíram do repo.** Entradas antigas citam `docs/jornada/`,
`docs/oferta/`, `docs/renilza-conhecimento.md` e partes de `docs/holding/`.
Esses arquivos foram copiados para o vault em 23/09. O mapa caminho antigo →
caminho novo está na última entrada ("23/09/2026 — Limpeza do repo e
produtos da holding no vault"). As entradas antigas não foram reescritas.

**Navegação.** A entrada de 20/09 ficou em nível `###`, logo abaixo das de
19/09, e acumula complementos até 22/09. Está como foi escrita.

---

## Linha do tempo das decisões (13/08 → 23/09/2026)

Todas as decisões do projeto, dia a dia, uma por linha. A lista foi
deduplicada a partir da auditoria de 23/09: seis grupos cruzaram este
histórico, os docs e o git, e uma crítica adversarial corrigiu os rótulos. O
texto completo de cada decisão está na entrada do dia, mais abaixo.

**Status hoje.**
- `vigente`.
- `superada por <o que> (<quando>)`.
- `pendente`: depende de conta, credencial ou decisão.
- `decidido na consolidação, falta assinatura da Renilza`: o que o
  planejamento da holding marcou `[DECIDIDO]`. É recomendação forte, não
  aprovação dela.

As decisões que o Willian assinou em 22/09 vencem qualquer linha anterior:
white label, holding em 3 vertentes, nomes de nível, prancha de
Posicionamento, logo e entrada direta por vertente.

**Onde vive.**
- `HANDOFF` = `docs/holding/HANDOFF-implementacao.md`.
- `fontes/` = `C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/holding/fontes/`.
- `arquivo/` = `C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/90-arquivo/tailor-docs-2026-09-22/`.
- "entrada" = a entrada do mesmo dia neste arquivo.

**Siglas.**
- Q01–Q28: as perguntas da esteira que o Willian respondeu
  (`fontes/decisoes-esteira-20-09.md` e `fontes/decisoes-esteira-22-09.md`).
- A01–A66: os achados da auditoria de 19/09
  (`arquivo/jornada/achados-auditoria.md`).
- D1–D21: as decisões de `arquivo/holding/identidade-por-vertente.md`.

Os preços aparecem aqui como registro de decisão. O código continua lendo
preço só da configuração (regra do `CLAUDE.md`).

### 13/08/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 13/08 | O Conselho aprova por 6–0 as sete condições C1–C7 como restrição de produto | vigente (desde 22/09, C1 vale por ramo) | `CLAUDE.md`, `PRODUCT.md`, `src/lib/conselho.test.ts` |
| 13/08 | Repositório próprio, fora do OneDrive e do `_ai-platform` (produto de cliente, dado sob LGPD); a pasta muda de `C:\_tailor` para `C:\_ParenteIT\_tailor` | vigente | entrada |
| 13/08 | Mundo visual "A Folha de Molde", sorteado pelo `concept-seed` | vigente só no mundo de Imagem; Posicionamento e Estética ganharam mundo próprio (22/09) | `DESIGN.md`, HANDOFF §5 |
| 13/08 | Arco de superfície: o quiz acontece em noir e a proposta vira ivory | vigente como padrão; tema claro opcional (12/09 e 19/09); Estética clara (22/09) | `DESIGN.md`, HANDOFF §5 |
| 13/08 | Em conflito de paleta, o BRAND-VISUAL v1.1 vence o protótipo e o prompt | vigente | `CLAUDE.md` |
| 13/08 | C5: a validade de 72h expira de verdade no servidor e aparece como data sóbria, nunca como contagem regressiva | vigente | código da proposta, HANDOFF §4 |
| 13/08 | C1: a Q2 vira sub-opção da Q1 e o fluxo fecha em 9 telas até o gate, travado por teste | vigente (desde 22/09, 9 telas por ramo) | `conselho.test.ts`, HANDOFF §2 |
| 13/08 | C4: teto da fita métrica limitado a 2–3× o valor declarado | vigente no código; falta decidir se a fita entra no fluxo da holding | `conselho.test.ts` |
| 13/08 | `--ivory-3` e `--ink-3` ajustados para 4,5:1; a divergência vai para o BRAND-VISUAL | vigente (registrada no §10.1 em 14/08) | `DESIGN.md` |
| 13/08 | Ordem de C7: quiz frio, depois modo confirmação, depois modo áudio | vigente (F5 em 13/08, F6 em 14/08) | `PRODUCT.md`, `README.md` |
| 13/08 | Acentos de persona na família do terra (#C17B83, #BC7C4E, #6F9B85) | superada pelas paletas por vertente (22/09); o #C17B83 segue em Imagem; ainda no código | HANDOFF §5 |
| 13/08 | Moeda por idioma, sem conversão: BRL em pt, USD em en/fr, cada moeda com faixa própria | vigente no mecanismo; o francês sai (20/09) mas segue no código | `src/content/config.ts` |
| 13/08 | Pontes da fita: Jornada → Dossiê → Prisma, com O Círculo fora | superada pela esteira por vertente e pelo desmembramento do Prisma (22/09); ainda no código | `fontes/planejamento-holding-3-vertentes.md` |
| 13/08 | A oferta sai da faixa marcada na Q9 (`OFERTA_POR_FAIXA`), e a Q9 grava a chave, não o rótulo | vigente a regra de gravar chave; o mapa faixa→produto foi superado pela oferta por vertente e faixa (22/09) | `config.ts`, HANDOFF §3 |
| 13/08 | Contato pelo WhatsApp oficial da Renilza; `NEXT_PUBLIC_WHATSAPP` sobrepõe em teste | vigente | env |
| 13/08 | Checkout híbrido: Hotmart para as assinaturas (níveis 0–2), checkout próprio via Asaas para o alto ticket | vigente; falta gateway para cobrar em USD (22/09) | `src/lib/checkout.ts`, `docs/PENDING.md` |
| 13/08 | Hotmart como cross-sell no fim da proposta, só com `HOTMART_LINK_*` | vigente no código; a revisar contra a esteira por vertente | `checkout.ts` |
| 13/08 | Asaas: link de pagamento por proposta, `externalReference` = lead, checkout hospedado (escopo PCI zero), CPF nunca no banco | vigente | `src/lib/asaas.ts` |
| 13/08 | Juros do parcelamento repassados à compradora; `CHECKOUT_MAX_PARCELAS=1` desliga | vigente (premissa reversível) | env |
| 13/08 | Sem preço em env, nada é cobrado nem inventado (mock `sem_preco`) | vigente | `checkout.ts`, `checkout.test.ts` |
| 13/08 | O link de pagamento expira junto com a proposta (C5 também no dinheiro) | vigente | `asaas.ts` |
| 13/08 | Supabase em `sa-east-1`, plano free; RLS sem policy implementa o C6 (só `service_role`) | vigente; upgrade para o Pro antes de abrir pendente (23/08) | `supabase/migrations/` |
| 13/08 | Segredos no Bitwarden (pastas `Tailor/*`), com Asaas sandbox e produção em itens separados | vigente (mais o Secrets Manager desde 15/08) | Bitwarden |
| 13/08 | F5: o modo confirmação reusa o mesmo `Quiz`; só espelho, q3 e gap são confirmáveis; verbatim sem resposta é descartado; link inválido cai no quiz frio | vigente no fluxo atual; falta decidir se fica no fluxo da holding (A61) | `src/lib/confirmacao.ts` |
| 13/08 | Preço e nome de produto vêm de env de ponta a ponta; sem env, aparece ◆ | vigente; vai migrar para a configuração de cliente (HANDOFF §1) | `checkout.ts` |
| 13/08 | Deploy no Netlify com fontes self-hosted, build webpack e `middleware.ts` edge | vigente | `CLAUDE.md` (Ambiente), `netlify.toml` |
| 13/08 | Asaas de produção: recuperar a conta antiga do CNPJ da Renilza, sem abrir outra | superada pela conta nova no CNPJ dela (24/08), que aguarda documentação | entrada de 24/08 |

### 14/08/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 14/08 | Retomada local em `localStorage`, limpa ao entrar no Pico | vigente (com cópia por aba desde 19/09) | `src/lib/retomada.ts` |
| 14/08 | `--color-alerta` separado dos acentos: erro é voz do sistema, não de persona | vigente; falta reconferir a cor por mundo (D10) | `globals.css`, `docs/PENDING.md` |
| 14/08 | F6, modo áudio: consentimento em etapa própria, arquivo nunca persistido, microfone desenhado, só na Q3 | vigente; áudio nos campos "outro" pendente (A47) | `src/lib/gravador.ts`, `api/transcribe` |
| 14/08 | `q3Via` e `consentimentoAudioEm` chegam ao banco; o autosave nunca rebaixa `origem` | vigente | `api/leads`, `store.ts` |
| 14/08 | Degraus da Q9 sobem para a esteira v4 (ate3500→Dossiê … naoDizer→Prisma Essencial) | superada pela oferta por vertente e faixa (22/09); a Renilza nunca confirmou; ainda no código | `config.ts` |
| 14/08 | Nenhum degrau da Q9 promete um teto que a esteira não atende | vigente (virou "o orçamento é teto", HANDOFF §3) | HANDOFF §3 |
| 14/08 | A fita métrica é a mesma para as três personas, só a copy varia | superada pela ramificação por vertente (22/09) | — |
| 14/08 | Sem persona nem eixo de "estética" | superada pela clientela real (20/09) e pela vertente Estética (22/09) | — |
| 14/08 | O Bloco 6 mantém o aviso honesto de que não existe depoimento real | vigente; o contador ◆ precisa sumir (A44) | `messages/*.json` |
| 14/08 | Acionamento pela WhatsApp Cloud API: HMAC sobre o corpo cru, lead por variantes do número, idempotência por `wamid`, link de confirmação automático | vigente no código; conta Meta e número dedicado pendentes | `src/lib/whatsapp-mensagem.ts` |
| 14/08 | Webhook do WhatsApp: 3.000/min por IP; a proteção real é por remetente (5/min) e o teto global | vigente | `api/webhooks/whatsapp` |
| 14/08 | Risco aceito: o webhook pode adotar um lead do quiz criado com o número de outra pessoa | pendente (a mitigação é decisão de produto) | `docs/PENDING.md` |
| 14/08 | Campos sem leitor (`whatsappConfigurado`, `ultimaMensagemRecebidaEm`) ficam como infraestrutura | vigente | `src/lib/whatsapp.ts` |
| 14/08 | E-mail opcional no gate, só na submissão final, sem envio automatizado | vigente | `quiz-state.ts`, HANDOFF §2 |
| 14/08 | Rate limit durável (Upstash) nas 7 rotas, com volta ao balde por processo | vigente | `src/lib/rate-limit.ts` |
| 14/08 | Nota fiscal fora da plataforma exige contratar um emissor | pendente (decisão do Willian) | `docs/PENDING.md` |
| 14/08 | Imersão de Estilo sai do catálogo do Tailor | vigente | `config.ts` |
| 14/08 | O IP do chamador vem do cabeçalho de borda do Netlify e o XFF é lido pela direita; balde `sem-origem` como padrão | vigente | `rate-limit.ts` |
| 14/08 | Teto global por rota (proposal, analyze, transcribe) e limite no `meta` dos eventos | vigente | `rate-limit.ts`, `api/proposta/[token]/evento` |
| 14/08 | `/api/proposal` preserva o consentimento de áudio; `escolherOferta` valida a faixa; a proposta respeita `removido_em` | vigente | `api/proposal`, `store.ts` |
| 14/08 | Transcrição trocável por env (Groq ou Deepgram) | vigente | `src/lib/transcricao.ts` |
| 14/08 | Webhook do Asaas: falha fechado sem token, comparação em tempo constante, ignora valores do corpo, idempotente | vigente | `api/webhooks/asaas` |
| 14/08 | Webhook do Asaas registrado (v3, sequencial, 5 eventos) e desativado até a publicação | vigente; recriado na conta nova em 24/08; ativação pendente | `docs/PENDING.md` |
| 14/08 | A conta Asaas da Parente IT serve só de sandbox; produção e nota fiscal ficam na conta da Renilza | vigente | entrada |
| 14/08 | A seta do CTA vira o SVG `<Seta/>` (o glifo não existe no subset da Jost) | vigente | `molde.tsx` |
| 14/08 | `<main>` centralizado na vertical; reset CSS dentro de `@layer base` | vigente | `globals.css` |
| 14/08 | Botão primário maior, com borda no acento da persona depois da escolha | superada pelo CTA "pôr do sol" (07/09) e pelo botão por vertente (22/09) | — |
| 14/08 | "Seis passos" vira "Poucas perguntas, menos de três minutos" | vigente; falta reconciliar com o copy deck e medir a promessa (A56) | `docs/PENDING.md` |
| 14/08 | Gramática das duas tintas: ouro é a voz da casa, acento é a linha dela | superada em parte pelo CTA único (07/09) | `DESIGN.md` |
| 14/08 | Anti-regras de cor: não revelar a cor da persona antes do clique, acento nunca como preenchimento, nenhuma quarta cor, noir nunca clareado | superada em parte pelo tema claro (12/09), pelo lavado na opção (19/09) e pelo preenchimento em Posicionamento (22/09) | `DESIGN.md` |
| 14/08 | Ouro e acentos redefinidos no ivory para passar 4,5:1 | vigente | `globals.css` |
| 14/08 | Penumbra na Q3, a validar pela taxa de resposta | vigente no padrão; medição pendente | `docs/PENDING.md` |
| 14/08 | Gate sempre vivo (erro por campo, Enter envia) com a primeira frase da confissão como epígrafe | vigente (virou a prévia da leitura no gate, HANDOFF §4) | `quiz.tsx`, HANDOFF §4 |
| 14/08 | "de 9" só a partir da Peça 6; progresso monotônico | superada pelo progresso dotado, "2 de 9" já na tela 2 (22/09) | HANDOFF §4 |
| 14/08 | Microinterações: vibração ao marcar, recibo "Guardei. Palavra por palavra.", fases reais no envio | vigente (virou recibo por resposta no HANDOFF) | HANDOFF §4 |
| 14/08 | `themeColor` por superfície (#F6EFE1 na proposta) | vigente | `src/app/p/[token]` |
| 14/08 | Descartados: barra fixa na base, auto-avanço na Q8, Q7 por persona, campo numérico na régua, percentual, streak, medalha, confete, som | vigente (exceção desde 22/09: barra fixa só com textarea focada) | `DESIGN.md`, HANDOFF §4 |
| 14/08 | Acentos, contrastes, duas tintas, alerta e penumbra registrados no BRAND-VISUAL §10.1 | vigente; falta propagar ao Notion | `docs/PENDING.md` |
| 14/08 | Vitest sem paralelismo de arquivos (o backend de arquivo é compartilhado) | vigente | `vitest.config.mts` |

### 15/08/2026 (entradas reconstituídas)

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 15/08 | Modelo de texto trocável por `LLM_PROVEDOR` (provedor pago como padrão, alternativa com cota gratuita); corte por `MAX_TOKENS` é tratado como recusa | vigente (código resgatado em 10/09) | `src/lib/llm.ts` |
| 15/08 | Fallback automático do provedor pago para o gratuito em falha de runtime; recusa por segurança não aciona | vigente | `llm.ts` |
| 15/08 | Subdomínio `sobmedida.renilzamiranda.com` por CNAME no DNS da Squarespace | vigente (HTTPS desde 24/08) | Netlify, Squarespace |
| 15/08 | Chaves também no Bitwarden Secrets Manager (projeto "Tailor") | vigente | Bitwarden |

### 23/08/2026 (entrada reconstituída)

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 23/08 | O Supabase free pausa depois de ~7 dias sem uso; upgrade para o plano Pro antes de qualquer lançamento | pendente (mitigado pelo keepalive de 19/09) | entrada de 23/08 |
| 23/08 | Quando a automação do navegador não consegue colar no formulário de env do Netlify, o humano cola; token nunca passa por texto visível | vigente (processo) | entrada de 23/08 |

### 24/08/2026 (entradas reconstituídas)

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 24/08 | Conta Asaas nova no CNPJ da Renilza; webhook "Tailor" recriado nela e desativado até a aprovação | vigente; aprovação (documentos da Renilza) e ativação pendentes | `docs/PENDING.md` |
| 24/08 | Não migrar agora o número oficial para a Cloud API; o Willian providencia um número novo | vigente | `docs/PENDING.md` |
| 24/08 | A troca da URL canônica para o domínio próprio fica com o Willian | pendente | `docs/PENDING.md` |
| 24/08 | Visão de SaaS multi-tenant fora do repo (`13-willian-saas/Tailor/`) | superada em parte pelo white label (22/09): a estrutura parametrizável nasce no repo; a infraestrutura multi-cliente segue fora do escopo | HANDOFF §1 |
| 24/08 | Prioridade: o produto da Renilza vem antes de qualquer multi-tenant | superada por 22/09: desenvolvimento 100% para a Renilza, com estrutura white label desde já | HANDOFF §1 |

### 30/08/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 30/08 | Link oficial `https://sobmedida.renilzamiranda.com`, sem hífen e com `.com` | vigente | `README.md` |
| 30/08 | A skill `impeccable` precisa estar no repo para valer em sessão remota | superada pela instalação local de 18/09, mantida fora do git | `.gitignore` |
| 30/08 | Camada `atmosfera` (curvas de molde, só linha, a partir de 900px) como experimento além do §8 | vigente como experimento; registro pelo §10 pendente | `src/components/atmosfera.tsx` |
| 30/08 | Mais cor e imagem para reter dependem de quanto a marca cede do teto de 3% | superada pelo CTA preenchido e pelas cenas coloridas (07/09) e pelas pranchas por vertente (22/09); foto segue sem material real | HANDOFF §5 |

### 07/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 07/09 | A ilustração reativa nunca é a fonte do dado; `null` tem estado latente próprio | vigente | `src/components/cenas/` |
| 07/09 | Cenas por `next/dynamic` em contêiner de altura fixa; o estado aceso muda cor e traço juntos | vigente | `cenas/` |
| 07/09 | Sai o "100%" fixo do Futuro; resumo textual sempre visível, nada exige arrasto | vigente | `comparador.tsx` |
| 07/09 | Fundo noir de marrom (#141009) para ameixa (#181022) | superada pelos mundos por vertente (22/09: telas 1–2 no #141009, Imagem em #1C1229); ainda no código | HANDOFF §5 |
| 07/09 | CTA preenchido "pôr do sol" (#E8935B, canto de 10px) no funil inteiro | superada pelo botão por vertente (22/09); o canto de 10px segue em Imagem e Estética | HANDOFF §5, §6 |
| 07/09 | Paleta "pôr do sol" nas ilustrações | superada pela paleta índigo, céu e verde-azulado (12/09) | — |
| 07/09 | `cena-pop` (320ms, uma vez, nunca em loop) nas seis cenas | vigente | `globals.css` |
| 07/09 | `valorParado` vira maço de cédulas (C3); `volumeMensal` vira folha de agenda | vigente no fluxo atual | `cenas/` |
| 07/09 | Q9 com uma frase por faixa em balão de pensamento, sem escopo, retorno ou merecimento | vigente no fluxo atual | `messages/*.json` |
| 07/09 | A coluna Futuro só mostra o que ela declarou (C2) | vigente | `comparador.tsx` |
| 07/09 | Estender o traço cartoon do guarda-roupa às outras cinco cenas | pendente (em aberto, não recusado) | entrada |
| 07/09 | O token terra escuro (#78513B) só entra quando uma cena precisar de preenchimento | pendente (condicional) | entrada |

### 08/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 08/09 | Comparador empilhado na vertical, sem arrasto, com a leitura em prosa dentro do cartão | vigente | `comparador.tsx` |
| 08/09 | A leitura é montada só com os dados dela, sem modelo no cliente; o número solto só aparece sem prosa | vigente | `messages/*.json` (`pico.leitura.*`) |
| 08/09 | Travessões fora da copy visível; o "·" da notação fica | vigente | `messages/*.json` |
| 08/09 | O Comparador se revela em três tempos (Hoje, corte, Futuro), só com transform e opacity | vigente | `globals.css` |

### 10/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 10/09 | O nome vai para a Peça 1; o gate fica só com WhatsApp e e-mail; `+55` deixa de ser forçado; `{nome}` em cinco momentos (commit `0dc3470`) | vigente (tela 1 = nome, HANDOFF §2) | `quiz.tsx`, `quiz-state.ts` |
| 10/09 | `upsertLead` cria lead novo quando o `leadId` do cliente não existe mais | vigente | `store.ts` |
| 10/09 | Do histórico órfão só `llm.ts` e `llm.test.ts` são resgatados; o log órfão não é reimportado | vigente para o código; o log foi reconstituído em 23/09 | `llm.ts`, este arquivo |
| 10/09 | Uma branch integradora por rodada, só com `git add`; o Willian commita em pedaços | vigente | `CLAUDE.md` |
| 10/09 | `search_path` corrigido por migração nova (0003), sem editar a 0001 | vigente | `supabase/migrations/0003_fix_search_path.sql` |
| 10/09 | Dark/light resolvido como ajuste de contraste dentro do ato | superada pelo tema claro real (12/09) | — |
| 10/09 | i18n: detecção por `Accept-Language`, seletor manual, tradução EN/FR sem revisão nativa, idioma gravado até a proposta | vigente no mecanismo; francês removido e inglês principal decididos em 20/09 | `src/i18n/routing.ts` |
| 10/09 | Faixas da Q9 em en/fr qualitativas, sem valor em USD inventado | superada pelos preços em USD de 20–22/09; faltam as faixas em USD na configuração | `docs/PENDING.md` |
| 10/09 | Preço literal não entra no README: nenhum preço fora de `config.ts` | vigente como regra; o conflito com a configuração de cliente é pendência do Willian (23/09) | `CLAUDE.md` |

### 11/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 11/09 | Bandeiras em SVG desenhado, sempre ao lado do nome do idioma (desvio consciente de cor do §8) | vigente (virou dropdown em 19/09); registro pelo §10 pendente | `seletor-idioma.tsx` |
| 11/09 | Ícone de contraste em círculo meio-preenchido | superada pelo sol e lua (12/09) | — |

### 12/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 12/09 | Tema claro real (branco, tinta slate, acento e CTA índigo, alerta #b91c1c) valendo em tudo, inclusive na Q3, só para quem ativa | vigente no código (peek em 18/09, switch visível em 19/09); falta decidir o destino diante dos mundos por vertente (D11, A43) | `tema.tsx`, `docs/PENDING.md` |
| 12/09 | Cenas cartoon com paleta fixa índigo, céu e verde-azulado, sem virar token | vigente (dívida: a paleta não varia por tema) | `cenas/` |

### 18/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 18/09 | O tema vira "peek" (segurar para espiar) e o switch fica escondido em Acessibilidade | superada pelo switch visível no topo (19/09) | — |
| 18/09 | Sem GSAP, ScrollTrigger nem Lenis: CSS com o easing próprio `cubic-bezier(0.16,1,0.3,1)` | vigente | `globals.css` |
| 18/09 | Coluna de costura: o `TrilhoDeGiz` vira SVG ligado ao progresso real e descostura ao voltar | vigente no fluxo atual; na holding, a figura de cada vertente anda por `translateX` | `molde.tsx`, HANDOFF §5 |
| 18/09 | Um alfinete na faixa lateral para idioma e tema | superada pelas pílulas no topo (19/09) | — |
| 18/09 | Corte efêmero ao selecionar uma opção, fora dos cartões de persona | vigente no fluxo atual | `molde.tsx` |
| 18/09 | Costura viva na Q3, proporcional ao texto (satura em 140 caracteres) | vigente no fluxo atual | `quiz.tsx` |
| 18/09 | A retomada visual sai da própria transição da coluna, sem código separado | vigente | `quiz.tsx` |
| 18/09 | Clímax: véu circular antes da proposta, blocos em sequência, frase dela palavra por palavra (separador NBSP) | vigente no código; na holding, a navegação nunca espera animação (A16) | `quiz.tsx`, `comparador.tsx` |
| 18/09 | `prefers-reduced-motion` zera também o `animation-delay`; o véu cai para 60ms | vigente | `globals.css` |
| 18/09 | Painel desktop em SVG, não Three.js: seis peças de molde que acendem com o progresso | vigente (a partir de 1120px desde 19/09) | `painel-desktop.tsx` |
| 18/09 | Saída do `/taste`, scaffolding `.github/*` do impeccable e `.mcp.json` ficam fora do git | vigente; a saída do `/taste` foi para `arquivo/taste/` (23/09); o `.mcp.json` depende do Willian | `.gitignore` |

### 19/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 19/09 | Keepalive do Supabase (seg/qua/sex, 11:00 UTC): ping no endpoint de produção e religamento pela Management API se o projeto estiver pausado | vigente | `.github/workflows/supabase-keepalive.yml` |
| 19/09 | Tema e idioma em pílulas no topo (no fluxo, nunca `fixed`); o tema persistente entra antes do primeiro paint | vigente | `controles-topo.tsx`, `src/app/layout.tsx` |
| 19/09 | Pílulas com raio de 999px, desvio do §4 | pendente de registro pelo §10 | — |
| 19/09 | Animações mais visíveis: fio de 2px com agulha, lavado do acento na opção, painel desktop desenhado a partir de 1120px | vigente no fluxo atual | `molde.tsx`, `painel-desktop.tsx` |
| 19/09 | Cópia do progresso por aba (`sessionStorage`) para trocar de idioma sem recomeçar; moeda presa à de origem | vigente | `retomada.ts` |
| 19/09 | Seletor de idioma em dropdown gerado de `routing.locales` | vigente | `seletor-idioma.tsx` |
| 19/09 | Documentação reorganizada: docs vivos na raiz só com regra; histórico único aqui; pendências únicas em `docs/PENDING.md` | vigente (revista em 23/09: o negócio sai para o vault) | `docs/README.md` |
| 19/09 | As duas propostas de jornada em 3 atos ficam lado a lado, sem fusão até decisão humana | superada pela holding em 3 vertentes (22/09) | `arquivo/jornada/` |
| 19/09 | Auditoria: uma Fase 0 de engenharia antes de qualquer copy nova | vigente só no fluxo antigo (aplicada em parte em 22/09) | `arquivo/jornada/auditoria-e-plano-de-validacao.md` |
| 19/09 | Decisão 1 da auditoria: manter a medida (calculadora) como núcleo | vigente, incorporada ao HANDOFF | HANDOFF §1, §3 |
| 19/09 | Decisão 5: o prazo nunca fica dobrado na Q9 | vigente, incorporada ao HANDOFF (prazo depois do gate) | HANDOFF §2 |
| 19/09 | Decisão 7: faixas tocáveis, limites na configuração, orçamento como teto, "Prefiro não dizer" sem produto | vigente, incorporada ao HANDOFF | HANDOFF §3 |
| 19/09 | Decisão 8: qual técnica de movimento usar | superada: só `transform` e `opacity` (22/09) | `CLAUDE.md`, HANDOFF |
| 19/09 | Decisão 9: registrar pelo §10 ou reverter as divergências visuais em produção | pendente (o registro das exceções é do Willian, no vault) | HANDOFF §6 |
| 19/09 | Decisão 10: não tirar o e-mail do gate sem medir | vigente, incorporada ao HANDOFF (e-mail opcional) | HANDOFF §2 |
| 19/09 | Decisão 11: reescrever a copy de privacidade para o fluxo real (A29) | pendente | `docs/PENDING.md`, HANDOFF |
| 19/09 | Decisão 12: Bloco 4 sem promessa de resultado, só depois da aprovação da Renilza (a Q7 por persona caiu com a holding) | pendente (A21) | `docs/PENDING.md` |

### 20/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 20/09 | As falas do Willian valem como posição da Renilza; frase de cliente e credencial exigem fonte original | vigente | `fontes/entrevista-renilza-rodada-1.md` §6 |
| 20/09 | Sai a persona "dona de clínica": a clientela real é de profissionais que cobram pelo próprio serviço | vigente | `fontes/renilza-conhecimento.md`, `PRODUCT.md` |
| 20/09 | Duas personas: a profissional que cobra pelo serviço e a de armário/autoestima, com a carreira ligada a ela | superada pelas 3 vertentes escolhidas na tela 2 (22/09) | HANDOFF §2 |
| 20/09 | "Recomeço" como contexto dentro de armário/autoestima, com salvaguardas de encaminhamento | superada por "Nenhuma dessas" na tela 2 (22/09); as salvaguardas valem; o limite de encaminhamento está pendente | `PRODUCT.md`, `docs/PENDING.md` |
| 20/09 | As certificações internacionais são reais; aparecem só na proposta, depois da devolução | vigente; onde a credencial aparece e o uso de marcas de terceiros estão pendentes | `PRODUCT.md`, `docs/PENDING.md` |
| 20/09 | Idiomas: inglês principal e PT-BR, francês removido, USD no inglês (AED descartado); o Willian revisa o inglês e a Renilza aprova o sentido em PT | vigente; já feito na branch de implementação da holding, falta o merge | HANDOFF §1, §9 |
| 20/09 | Tudo nasce em inglês, com opção de português, inclusive a edição de estética | vigente | `fontes/proposta-mentoria-estetica-1a1.md` |
| 20/09 | Público de luxo buscado por narrativa nas redes e pelo diferencial de Dubai, não por indicação | vigente | `fontes/renilza-conhecimento.md` |
| 20/09 | Alto ticket e estrangeiro não viram persona; a estrangeira recebe o mesmo quiz em inglês e USD | vigente (a lógica passou para as vertentes) | `fontes/entrevista-renilza-rodada-1.md` |
| 20/09 | O quiz não está aberto ao público; os 11 leads do banco são testes | vigente | `docs/PENDING.md` (checklist de pré-lançamento) |
| 20/09 | Sem tráfego, a validação é qualitativa (leitura com a Renilza, sessões com usuárias), sem A/B | vigente | HANDOFF, `docs/PENDING.md` |
| 20/09 | Alto ticket a partir de US$ 1.000 | superada no mesmo dia pelo limiar abaixo | — |
| 20/09 | Limiar de alto ticket: em PT, os valores do Prisma (≈ R$ 7 mil); em EN, a partir de US$ 3.000; faixa médio-alta de US$ 1.000–2.999 | vigente por Q06 (20/09) e Q17 (22/09); as linhas 40 e 144 de `fontes/renilza-conhecimento.md` estão obsoletas nisso | `fontes/decisoes-esteira-20-09.md`, `fontes/decisoes-esteira-22-09.md` |
| 20/09 | Criar um produto de estética de ticket alto e abrir a mentoria do "molde antigo" | superada pelo Signature (20/09) e pela vertente Estética (22/09) | `fontes/proposta-mentoria-estetica-1a1.md` |
| 20/09 | O herdeiro da Mentoria 360º é uma mentoria 1:1 de estética, não o Prisma | superada pela holding (22/09): a 360º não volta, e o conteúdo vai para o Da Maca e para a Turma/Signature | `fontes/planejamento-holding-3-vertentes.md` §7 |
| 20/09 | A "Clínica Av. Paulista" era coworking: ela nunca teve clínica própria, e nenhuma copy sugere o contrário | vigente | `PRODUCT.md`, `fontes/renilza-conhecimento.md` |
| 20/09 | Capacidade: 3 atendimentos por dia, segunda a sexta, 46 semanas, 70% de uso; a remedição ocupa 1 atendimento (Q15) | vigente | `fontes/capacidade-e-projecao.md` |
| 20/09 | Q01: meta de R$ 1 milhão bruto no ano 2; o ano 1 é de prova | vigente | `fontes/decisoes-esteira-20-09.md` |
| 20/09 | Regra do tempo: low ticket só escalável, tempo dela só no alto ticket; exceções Dossiê 1:1, A Mesa e encontros do Da Maca (Q02–Q04); Sai Pronta gravada (Q05) | vigente | `fontes/decisoes-esteira-20-09.md` |
| 20/09 | Proposta de escada de estágios e subida de preço do Prisma | superada por Q07 (valores mantidos) e pelo desmembramento do Prisma (22/09) | `fontes/esteira-reprecificada-e-meta-1m.md` |
| 20/09 | Proposta de aposentar o Dossiê 1:1 em favor de um Dossiê Digital | superada por Q02 (o Dossiê 1:1 fica); o Dossiê Digital volta na holding a R$ 147 / US$ 39, preço a assinar | `fontes/planejamento-holding-3-vertentes.md` |
| 20/09 | Preços em inglês do low ticket (Sai Pronta US$ 37, Consultora US$ 19/mês, Da Maca US$ 197→297, Jornada US$ 29/mês) | pendente (nunca decidido) | `fontes/esteira-reprecificada-e-meta-1m.md`, `docs/PENDING.md` |
| 20/09 | Q07: o Prisma mantém Essencial R$ 6.997 e Completo R$ 9.997 → 11.997 com 3 casos publicados | superada em estrutura pelo desmembramento (22/09), que herdou os preços | `fontes/decisoes-esteira-20-09.md` |
| 20/09 | Q08: Assinatura Anual US$ 7.500 com limite, Auditoria de Coerência US$ 9–25 mil, Dubai em Pessoa US$ 9–12 mil (6–8 vagas) | vigente (por convite, fora do gate) | `fontes/decisoes-esteira-20-09.md` |
| 20/09 | Q09: turma fechada já na primeira turma, com preço menor por vaga | superada em preço por Q27 e em vertente pela holding (vira Turma de Estética, 22/09) | `fontes/decisoes-esteira-22-09.md` |
| 20/09 | Q10: para a iniciante, só Sai Pronta e Da Maca | vigente; na holding, Estética nível 1 fica sem produto no ano 1, e o catálogo fica congelado até 02/11 | `fontes/decisoes-esteira-20-09.md` |
| 20/09 | Q11: a primeira turma é "fundadora", com desconto em troca de caso publicado | vigente (detalhada por Q28) | `fontes/decisoes-esteira-20-09.md` |
| 20/09 | Q12: a própria Renilza fecha o alto ticket, em call curta | vigente | `fontes/decisoes-esteira-20-09.md` |
| 20/09 | Q13: o Signature é aberto a qualquer profissional de estética | vigente (Estética nível 3, 1:1) | `fontes/decisoes-esteira-20-09.md` |
| 20/09 | Q14: cabelo e maquiagem entram na Fase 3 | vigente; no desmembramento vão para Imagem (22/09) | `fontes/decisoes-esteira-20-09.md` |

### 22/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 22/09 | Fase 0: A18 (CTA do Pico), A22 (Continuar acima do teclado), A23 (áudio com 44px), A26 (foco na troca de peça), A27 (Q7/Q8/situação como chave) | vigente só no fluxo antigo: A18 e A27 perdem o objeto no quiz da holding; A22, A23 e A26 precisam ser reaplicados nos componentes genéricos | `quiz.tsx`, `molde.tsx`, HANDOFF |
| 22/09 | Resposta de escolha se grava como chave, nunca como texto localizado | vigente (vale para o fluxo novo) | `proposta.ts`, HANDOFF |
| 22/09 | Sobras da Fase 0: A51 (o prompt não recebe q7/q8 e o diagnóstico sai em PT para lead em EN), `q7Outro` descartado, "Nunca tentei" virando "tentou" | pendente | `docs/PENDING.md`, HANDOFF |
| 22/09 | Decisão 6 da auditoria: agulha "Proposta B" (14px, desliza até a resposta) | superada pelas figuras por vertente (agulha, templo, toque) do HANDOFF | HANDOFF §5 |
| 22/09 | A Renilza vira holding de 3 empresas (Imagem, Posicionamento, Estética), cada uma com nome de nível e esteira próprios | vigente (assinada); a natureza jurídica está pendente | `fontes/planejamento-holding-3-vertentes.md` §1, HANDOFF |
| 22/09 | O Tailor é SaaS white label: marca, vertentes, perguntas, faixas, produtos e textos em configuração; a Renilza é a primeira cliente | vigente (assinada) | HANDOFF §1 |
| 22/09 | "Tailor" sai da interface: a única marca exibida é "Renilza Miranda", e as telas 1–2 levam só a frase-mestra | vigente (assinada) | HANDOFF §1, §8 |
| 22/09 | Arquitetura de marca endossada (Renilza Miranda → Tailor → mundos) | superada pelo white label (22/09) | — |
| 22/09 | Um só quiz: a tela 1 é o nome; a tela 2 escolhe a vertente por cenas de reconhecimento, sem nomeá-la; C1 ≤ 9 telas por ramo | vigente; a copy passa por leitura em voz alta com a Renilza | HANDOFF §2, §3 |
| 22/09 | "Nenhuma dessas" abre campo livre, segue pelo ramo de Imagem e marca o lead para leitura manual | vigente; o choque com a salvaguarda do Recomeço ("nunca atribuir a causa à imagem") está pendente | HANDOFF §2, `docs/PENDING.md` |
| 22/09 | Entrada direta por vertente (`/v/<vertente>`), que abre na tela 3 e conta 8 telas | vigente (assinada); feita na branch de implementação, falta o merge | HANDOFF §2 |
| 22/09 | Nomes de nível: Imagem Primeiro Corte · Ajuste · Alta-Costura; Posicionamento Alicerce · Estrutura · Cúpula; Estética Colaboradora · Autônoma · Empresária (no lugar de Bancada · Maca · Ateliê); só na proposta | vigente (assinada); falta decidir o produto de cada nível de Estética | HANDOFF §7 |
| 22/09 | Prisma desmembrado: Posicionamento fica com 8 sessões, Imagem com 5, e a versão em turma vai para o topo de Estética (hoje Turma de Estética, nível Empresária) | decidido na consolidação, falta assinatura da Renilza | `fontes/planejamento-holding-3-vertentes.md` §4 |
| 22/09 | Preços do desmembramento: a Cúpula herda R$ 9.997 → 11.997 / US$ 8.500 → 11.000; a Alta-Costura se ancora em R$ 6.997 / US$ 4.500, sem cálculo de custo | decidido na consolidação, falta assinatura da Renilza | `fontes/planejamento-holding-3-vertentes.md` §4 |
| 22/09 | A Turma migra para Estética; Posicionamento fica sem produto em grupo em 2026 (candidata para 2027) | decidido na consolidação, falta assinatura da Renilza; adaptação do conteúdo pendente | `fontes/planejamento-holding-3-vertentes.md` §4–§5 |
| 22/09 | O Da Maca (R$ 497 → 997) é um produto só, com o preço subindo com o tempo; ocupa o nível 2 de Estética, e o nível 1 fica sem produto | vigente (correção de fato das auditorias) | `fontes/planejamento-holding-3-vertentes.md` §3 |
| 22/09 | A Mentoria Excelência 360º não volta (C2); o desafio de oratória de 30 dias vira bônus do Signature | decidido na consolidação, falta assinatura da Renilza | `fontes/planejamento-holding-3-vertentes.md` §7 |
| 22/09 | Gate de certificação só no alto ticket do funil; produto por convite fica fora; no ano 1 o gate só vale em BRL, e o público em dólar vai para call | decidido na consolidação, falta assinatura da Renilza | `fontes/planejamento-holding-3-vertentes.md` §6 |
| 22/09 | Nenhum produto se chama "Certificação"; o selo só sai depois da entrega medida; o gate é por compra na v1 | decidido na consolidação, falta assinatura da Renilza (a ficha H1 do vault já segue) | `fontes/planejamento-holding-3-vertentes.md` §6 |
| 22/09 | Selo visual por nível concluído | vigente fora do quiz: selo só depois da entrega medida (ficha H1 do vault, 23/09); dentro do quiz vale o HANDOFF §4 (nenhum ponto nem medalha) | vault `holding/00-holding/sistema-de-selos-e-gate/`, HANDOFF §4 |
| 22/09 | Abertura escalonada: em 02/11 só Imagem completo, com Posicionamento e Estética numa tela de captura; em 30/11 os dois completos | decidido na consolidação, falta assinatura da Renilza | `fontes/planejamento-holding-3-vertentes.md` §9 |
| 22/09 | O catálogo fica congelado como em 20–22/09 até 02/11 | decidido na consolidação, falta assinatura da Renilza | `fontes/planejamento-holding-3-vertentes.md` §9 |
| 22/09 | Um degrau sem produto não aparece na escada da proposta, e o motor nunca o indica (D15) | pendente (decisão do Willian; o vault já propõe um produto para o Alicerce) | `docs/PENDING.md` |
| 22/09 | Teste de viés da tela 2 e de continuidade com 5 pessoas por persona, no celular, antes de 30/11 (D21) | pendente | `docs/PENDING.md` |
| 22/09 | Wireframe de Imagem aprovado: painel ameixa, régua 1–9, stepper, folha marfim com marcas de corte, CTA ameixa com borda tracejada dourada | vigente, menos o wordmark "Tailor" (white label) | `docs/holding/prototipo/layout-final.html` |
| 22/09 | Identidades "Pedra de Toque" (Posicionamento) e "Ficha do Negócio" (Estética) | superada no mesmo dia pelas três pranchas de 22/09 | `arquivo/holding/identidade-por-vertente.md` |
| 22/09 | Vetos das vertentes: sem figura humana (§5), sem "clínica" ou "sucesso" como chegada (C2), diamante só como geometria | vigente | HANDOFF §8 |
| 22/09 | As pranchas entram com as regras da marca: fontes da casa, sem folhas nem ícone de pessoa, sem slogan de resultado, telas 1–2 no noir | vigente | HANDOFF §5, §8 |
| 22/09 | Posicionamento segue a prancha à risca (degradê cobre, pílula, ícones, seleção preenchida, templo que sobe), só nessa vertente | vigente (assinada); registro no BRAND-VISUAL §10 pendente | HANDOFF §5, §6 |
| 22/09 | Imagem em ameixa #1C1229 com agulha; Estética clara (marfim, verde, sálvia) com toque; telas 1–2 no noir #141009 | vigente | HANDOFF §5 |
| 22/09 | Logo "RENILZA MIRANDA" em Bodoni Moda com dourado em degradê, só na tela 1 | vigente (assinada); registro no §10 pendente | HANDOFF §5, §6 |
| 22/09 | Botão com canto de 10px em Imagem e Estética; pílula só em Posicionamento | vigente | HANDOFF §5 |
| 22/09 | Gamificação: progresso dotado, figura que anda, recibo por resposta, conta no meio, reta final, prévia no gate, prazo depois do contato; nada de cronômetro, escassez, pontos ou medalha | vigente | HANDOFF §4 |
| 22/09 | As faixas de investimento vão para a configuração; o orçamento é teto; "Prefiro não dizer" não escolhe produto | vigente; a tabela faixa → oferta por vertente está pendente | HANDOFF §3, `docs/PENDING.md` |
| 22/09 | Telas compartilhadas sem descritor de vertente; nada de "Seus dados estão seguros"; nenhum ícone de pessoa, gráfico, folha ou manequim; um único rosa (#C17B83) | vigente | HANDOFF §8 |
| 22/09 | Fotografia só como macro real do ofício, fora do quiz, quando existir banco de fotos real; nenhuma foto sintética | vigente | `layout-final.html` ("Decidido em 22/09", item 6), HANDOFF |
| 22/09 | A especificação é o HANDOFF mais o protótipo, e a implementação acontece numa sessão separada | vigente | HANDOFF |
| 22/09 | `docs/oferta/` vira inventário, e a vertente de cada produto passa a vir do planejamento da holding | superada em 23/09: os dois foram para `fontes/` | `fontes/` |
| 22/09 | Q16: os preços em inglês seguem o mercado de Dubai, acima da conversão direta | vigente | `fontes/decisoes-esteira-22-09.md` |
| 22/09 | Q20: A Mesa da Jornada fica, com revisão em 6 meses (vira quinzenal abaixo de 60 assinantes na T1 ou 30 na T2) | vigente | `fontes/decisoes-esteira-22-09.md` |
| 22/09 | Q21: o Signature começa em R$ 9.997, sem degrau Essencial | vigente; preço em USD não definido | `fontes/decisoes-esteira-22-09.md` |
| 22/09 | Q22: cabelo e maquiagem são entregues pela própria Renilza | vigente | `fontes/decisoes-esteira-22-09.md` |
| 22/09 | Q23: no máximo 8 calls de fechamento por semana, com qualificação prévia pelo quiz | vigente | `fontes/decisoes-esteira-22-09.md` |
| 22/09 | Q24: o ano 1 começa em outubro | superada no mesmo dia por novembro | — |
| 22/09 | O ano 1 passa para novembro de 2026 (alvo 02/11), com cronograma de ~6 semanas | vigente, refinado pela abertura escalonada | `fontes/cronograma-desenvolvimento.md` |
| 22/09 | Q25: Prisma em inglês a US$ 4.500 (Essencial) e US$ 8.500 → 11.000 (Completo) | vigente como preço herdado (Alta-Costura US$ 4.500; Cúpula US$ 8.500 → 11.000) | `fontes/decisoes-esteira-22-09.md` |
| 22/09 | Q26: Consultoria de Imagem · Dubai & Europa a US$ 1.800, ou US$ 2.800 com compras guiadas | vigente (Imagem, nível Ajuste) | `fontes/decisoes-esteira-22-09.md`, vault `holding/imagem/05-consultoria-dubai-europa/` |
| 22/09 | Q27: Turma de 8 vagas e 8 semanas a R$ 4.997 / US$ 2.200 por vaga | vigente em preço e formato; vira Turma de Estética | `fontes/decisoes-esteira-22-09.md` |
| 22/09 | Q28: fundadora a 30% (R$ 3.498 / US$ 1.540) só em 5 das 8 vagas, com consentimento de caso antes, e nunca se repete | vigente | `fontes/decisoes-esteira-22-09.md` |
| 22/09 | Risco: não existe gateway de pagamento internacional (só Asaas, em BRL) | pendente | `docs/PENDING.md` |
| 22/09 | O rastro das rodadas de auditoria cruzada sai do repo; só o consolidado fica | vigente | entrada |

### 23/09/2026

| Data | Decisão | Status hoje | Onde vive |
|---|---|---|---|
| 23/09 | Limpeza: docs de negócio vão para `fontes/` e docs superados para `arquivo/`; nesta rodada nada é apagado do repo | vigente (a remoção do repo vem depois, com commit do Willian) | entrada de 23/09 |
| 23/09 | Este histórico é completado: cinco entradas de agosto e três eventos reconstituídos do git, mais esta linha do tempo | vigente | este arquivo |
| 23/09 | O protótipo publicado não é editado; onde ele diverge do decidido vira "Errata do protótipo" no HANDOFF | vigente | HANDOFF |
| 23/09 | Mensagem pré-preenchida do WhatsApp: código ou link da proposta e a próxima etapa, sem o nome (o texto viaja na URL) | vigente (regra única; substitui a versão com nome do A35) | HANDOFF |
| 23/09 | Produto com gate nunca vai ao checkout; a frase do gate aparece na proposta (Alta-Costura, Cúpula, Turma, Signature) | vigente pela ficha H1 do vault; falta no motor de proposta | vault `holding/00-holding/`, HANDOFF |
| 23/09 | Texto-base do diagnóstico com voz por vertente e instrução de idioma num `prompts/v2`, sem editar `prompts/v1.ts` | pendente | HANDOFF |
| 23/09 | Regra "nenhum preço fora de `src/content/config.ts`" × preços reais na configuração de cliente da branch da holding | pendente (decisão do Willian antes do merge; a regra não mudou) | `CLAUDE.md`, `docs/PENDING.md` |
| 23/09 | Fichas de produto da holding no vault (H1, Imagem 01–06, Posicionamento 01–04) | vigente como proposta de produto; os preços novos dependem da assinatura da Renilza | vault `holding/` |
| 23/09 | D18: o `PRODUCT.md` deixa de ligar a persona de Estética à clínica e passa a descrever as usuárias por cena e vertente | vigente no `PRODUCT.md`; copy deck, BRAND-VISUAL §10.1 e roteirista de reels pendentes (A31/A52) | `PRODUCT.md`, `docs/PENDING.md` |

---

## 13/08/2026 — Engenharia v0.2, fatia F1→F4

_Originalmente em `CLAUDE.md`._

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

## 13/08/2026 (mesma sessão) — Pendências resolvidas

_Originalmente em `CLAUDE.md`._

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

## 13/08/2026 (mesma sessão) — Checkout ligado

_Originalmente em `CLAUDE.md`._

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

## 13/08/2026 (mesma sessão) — Infra, F5 e deploy

_Originalmente em `CLAUDE.md`._

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

## 14/08/2026 — Branch `design-retencao-e-f6`: pesquisa de retenção + F6 (áudio)

_Originalmente em `CLAUDE.md`._

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

## 14/08/2026 (mesma sessão) — Reconciliação com a esteira v4: faixa da Q9

_Originalmente em `CLAUDE.md`._

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

## 14/08/2026 (branch `whatsapp-direto`) — Acionamento direto via WhatsApp

_Originalmente em `CLAUDE.md`._

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

## 14/08/2026 (mesma sessão) — E-mail no gate, rate limit durável, Imersão fora do catálogo

_Originalmente em `CLAUDE.md`._

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

## 14/08/2026 (mesma sessão) — Auditoria de segurança e transcrição trocável

_Originalmente em `CLAUDE.md`._

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

## Auditoria de 14/08/2026 — layout e craft floor

_Originalmente em `DESIGN.md`._

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

### Pendências herdadas da v0.2, ambas resolvidas nesta rodada

1. ~~Os três acentos de persona precisam entrar no `BRAND-VISUAL.md` pelo §10.~~
   Registrado em §10.1, 14/08/2026.
2. ~~As duas divergências de contraste acima precisam voltar para o §2.3.~~
   Registrado em §10.1 junto do item 1 (o `raio-x.html` é superfície só-noir e
   não compartilha este par ivory; sua reconciliação segue aberta na tabela
   de pendências do §10).

### Pendências de design (novas)

3. Screenshot real do deploy (mobile) ainda não confirmado nesta sessão — o
   painel do navegador segue instável para captura em algumas páginas; a
   verificação desta rodada usou `canvas.measureText` via `javascript_tool`
   para a evidência do glifo, não pixel a pixel.
4. `abertura.corpo` diverge do copy deck (ver acima) — levar de volta para
   `tailor-copy-deck.md` pelo protocolo de fonte de texto.

## Rodada de retenção — 14/08/2026 (síntese de três pesquisas)

_Originalmente em `DESIGN.md`._

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

**ATUALIZADO 12/09/2026 — o veto acima foi conscientemente revertido para
quem ativa o tema claro.** Decisão do Willian: um toggle claro/escuro real
(`src/components/tema.tsx`, `[data-tema="claro"]` em `globals.css`) agora
sobrepõe o arco inteiro, Q3 incluída — "vale em tudo, sem exceção". A regra
"não clarear o noir para legibilidade" (§ "Anti-regras" acima) segue válida
para quem NÃO ativou o tema claro; o padrão do produto continua sendo o arco
noir→ivory com a Q3 escurecida. Isto é uma troca de propósito da vantagem
psicológica documentada por consistência visual — decisão de produto
registrada, não bug. Ver `CLAUDE.md`, entrada de 12/09/2026, para a paleta
inteira e a justificativa de contraste.

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

## 15/08/2026 — Modelo de texto virou trocável (`LLM_PROVEDOR`)

_Reconstituída em 23/09/2026 a partir de `git show 1379718:CLAUDE.md`,
linhas 354–392 (branch órfã `feature/dark-light-mode`). Versão curta._

Ao testar `/api/analyze` em produção, o provedor padrão devolveu "saldo
insuficiente". A chave estava certa: a API paga é uma conta separada da
assinatura de uso pessoal. Decisão do Willian: pôr crédito no provedor
padrão e, em paralelo, deixar pronto um segundo provedor com cota gratuita.

- **`src/lib/llm.ts`**, no mesmo desenho do `transcricao.ts`.
  `LLM_PROVEDOR` escolhe o provedor. Env inválida cai no padrão com log, e
  uma guarda nomeia a env que falta antes de qualquer chamada de rede. O
  cliente antigo virou código morto e saiu. `analise.ts` e `proposta.ts`
  passaram a chamar `extrairEstruturado` e `escreverTexto`, sem mudar o
  comportamento do caminho padrão.
- **Dois pontos não verificados contra a API real do segundo provedor.**
  O primeiro é o `additionalProperties: false` no schema da análise. O
  segundo é que `finishReason !== "STOP"` conta como recusa, inclusive
  `MAX_TOKENS`, e isso é de propósito: um diagnóstico cortado vira texto de
  reserva, nunca texto truncado.
- 119/119 testes (8 novos em `llm.test.ts`) e `tsc` limpos. Não foi
  deployado: ficou staged junto da branch `whatsapp-direto`.

## 15/08/2026 (mesma sessão) — Fallback automático entre provedores, subdomínio e Upstash

_Reconstituída em 23/09/2026 a partir de `git show 1379718:CLAUDE.md`,
linhas 640–688. Versão curta._

- **Fallback automático.** Decisão do Willian: "se falhar o pago vai para o
  gratuito automaticamente". `comFallback` tenta o outro provedor quando o
  principal falha em runtime (sem crédito, fora do ar, erro de rede), sem
  redeploy. Recusa por segurança não aciona o fallback, porque é sinal
  sobre o conteúdo e não sobre o provedor. `llmDisponivel()` responde
  verdadeiro se qualquer um dos dois tiver chave. O caminho feliz do
  fallback não tem teste, porque exige rede real.
- **Segredos também no Bitwarden Secrets Manager.** O Willian criou o
  projeto "Tailor", separado do cofre de senhas, com as chaves dos dois
  provedores de texto.
- **Subdomínio `sobmedida.renilzamiranda.com`** configurado como domínio
  primário no Netlify. Faltava o registro `CNAME sobmedida →
  tailor-renilza.netlify.app` no DNS da Squarespace. A Squarespace é a
  registradora de `renilzamiranda.com` (achado por WHOIS), com os
  nameservers padrão dela.
- **Upstash:** conta criada pelo Willian; faltava colar as duas env.
- As chaves dos dois provedores de texto foram para o Netlify, e o crédito
  do provedor pago foi adicionado. A `GROQ_API_KEY` ficou pendente: uma
  tentativa de preencher não persistiu.

## 23/08/2026 — Supabase pausado, DNS no ar, credenciais completas

_Reconstituída em 23/09/2026 a partir de `git show 1379718:CLAUDE.md`,
linhas 690–731. Versão curta; e-mail mascarado._

- **O Supabase free pausou por inatividade** (~7 dias sem uso, status
  `INACTIVE`). Foi restaurado e confirmado `ACTIVE_HEALTHY`. Vai se repetir
  enquanto não houver uso constante. Por isso, antes de qualquer lançamento
  real, o plano é o upgrade para o Pro (US$ 25/mês). Mitigado desde 19/09
  pelo workflow de keepalive (entrada de 19/09).
- **A Groq recusa cadastro com e-mail `@hotmail.com`.** A conta foi criada
  com um e-mail da Parente IT ([REDACTED]), e a `GROQ_API_KEY` foi salva no
  Netlify.
- **Processo:** o Ctrl+V sintético da automação do navegador não cola no
  campo de valor do formulário de env do Netlify, e o formulário não mostra
  erro. Quando isso acontecer, o humano cola o valor. Tokens são copiados
  pelo botão mascarado direto para o destino, sem passar por texto visível.
- **O DNS do subdomínio propagou** (o Netlify confirmou). A primeira emissão
  do certificado Let's Encrypt falhou porque a propagação ainda não estava
  completa; o Netlify tenta de novo sozinho.
- **Upstash completo:** banco `tailor-rate-limit` (free, `us-east-1`), com
  URL e token no Netlify e no Bitwarden.
- Estado final: as cinco chaves (dois provedores de texto, Groq, URL e token
  do Upstash) no Netlify. No Bitwarden faltava só a da Groq. Faltava também
  um redeploy.

## 24/08/2026 — Celular real, conta Asaas nova, webhook recriado, Meta travada

_Reconstituída em 23/09/2026 a partir de `git show 1379718:CLAUDE.md`,
linhas 733–787. Versão curta; IDs da Meta, números de telefone e token
mascarados._

- **Quiz percorrido num celular de verdade**: 9 telas, três personas e a
  proposta gerada. Cai a ressalva que vinha desde 13/08.
- A `GROQ_API_KEY` foi colada à mão pelo Willian no Netlify e copiada para o
  Bitwarden sem exibir o valor.
- **Conta Asaas nova, no CNPJ da Renilza, criada pelo Willian.** Resolve o
  bloqueio de entidade de 14/08: a conta de teste é da Parente IT, fora do
  CNAE dela. Está em "Conclua seu cadastro" e depende da Renilza mandar a
  documentação. **Isto supera o caminho de 13/08** ("recuperar a conta
  antiga pelo suporte"). A seção 2 da entrada de 10/09 ainda lista essa
  recuperação como pendente; vale o que está aqui.
- **Webhook "Tailor" recriado na conta nova.** Aponta para
  `/api/webhooks/asaas` no Netlify, com v3, envio sequencial e os 5 eventos
  de `STATUS_POR_EVENTO`. O token de 64 caracteres ([REDACTED]) foi guardado
  no Bitwarden pelo Willian. **Desativado de propósito** até a conta ser
  aprovada.
- **WhatsApp.** A verificação da empresa está concluída no Gerenciador, e o
  produto WhatsApp Business foi adicionado ao app da Meta da Renilza (Phone
  Number ID e App ID [REDACTED]). Seguiram-se três falhas do lado da Meta,
  no onboarding do app à WABA e na criação de Usuário do Sistema. Nada
  indica erro de configuração nosso. Decisão: não insistir por ora.
- **Número errado conectado.** O número ligado ao Gerenciador ([REDACTED])
  não é o oficial que a Renilza usa com as leads ([REDACTED], o de
  `NEXT_PUBLIC_WHATSAPP`), e o Willian perdeu o acesso ao primeiro.
  **Decisão do Willian: não migrar o número oficial agora.** Migrar um
  número ativo no app para a Cloud API tira o número do celular dela, sem
  coexistência. O Willian vai providenciar um número novo para conectar.

## 24/08/2026 (mesma sessão) — HTTPS resolvido, visão de SaaS fora do repo, prioridade explícita

_Reconstituída em 23/09/2026 a partir de `git show 1379718:CLAUDE.md`,
linhas 789–821. Versão curta._

- **HTTPS do subdomínio confirmado** num navegador de verdade. A troca da
  URL canônica de `tailor-renilza.netlify.app` para o domínio próprio fica
  com o Willian, porque é mudança em sistema em uso.
- **Visão de SaaS multi-tenant consolidada fora deste repositório**, em
  `OneDrive\_millionaire\ParenteMiranda\13-willian-saas\Tailor\`. A base
  foram quinze pesquisas de mercado (posicionamento, pricing e growth,
  revisão cruzada). Lá estão a visão estratégica, um consolidado do estado
  atual e um artefato visual para leigo. Ficou fora de propósito, para não
  misturar o roadmap futuro com o estado de engenharia.
- **Prioridade explícita do Willian: o produto da Renilza primeiro.**
  Nenhum trabalho de multi-tenant começa antes de três coisas: webhook do
  Asaas ativo, WhatsApp conectado e nota fiscal saindo. Na mesma rodada, a
  branch órfã corrigiu no `README.md` e no `PRODUCT.md` o alvo de deploy
  (Vercel), o checkout descrito como mock e F5/F6 como pendentes. Em
  `develop`, a mesma correção só entrou em 10/09 (item 1.4).
- _Nota de 23/09:_ as duas decisões acima foram revistas em 22/09. O Tailor
  passa a ser SaaS white label, com a estrutura parametrizável nascendo no
  próprio repo e desenvolvimento 100% para a Renilza (entrada "Planejamento
  da holding encerrado"). A infraestrutura multi-cliente (banco, painel e
  domínio por cliente) continua fora do escopo (HANDOFF §1).

## 30/08/2026 — Sessão remota: link oficial, auditoria de pendências, experimento de presença visual

_Originalmente em `CLAUDE.md`._

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

## Ilustrações reativas — 07/09/2026

_Originalmente em `DESIGN.md`._

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

_Originalmente em `DESIGN.md`._

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

_Originalmente em `DESIGN.md`._

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

_Originalmente em `DESIGN.md`._

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

## 10/09/2026 — Nome na Peça 1, gate só com contato e `leadId` órfão (commit `0dc3470`)

_Reconstituída em 23/09/2026 a partir da mensagem e do diff do commit
`0dc3470` (10/09, entrou em `develop` pelo merge `32c919f`). Nunca teve
entrada no log._

- **Bug corrigido.** O `upsertLead` (Supabase) não fazia nada quando o
  `leadId` do cliente não casava com nenhuma linha (localStorage velho,
  remoção por LGPD, outro projeto), e a gravação seguinte das respostas
  quebrava por chave estrangeira. Agora ele cria um lead novo. É a mesma
  classe de bug já corrigida em `registrarContatoWhatsapp` em 14/08.
- **O nome passou para a Peça 1 (abertura)**, e o gate ficou só com WhatsApp
  e e-mail. O modo confirmação pega o nome do lead conhecido e nunca
  pergunta de novo. C1 (9 telas) intacto.
- `normalizarWhatsapp` deixou de forçar `+55`: um `+` no início indica que
  ela já digitou o código do país.
- As opções da Q8 foram reescritas em primeira pessoa.
- `{nome}` entrou em cinco momentos de peso (`espelho.rotulagem`, `q3.sub`,
  as duas notas do gap e `pico.titulo`), não em toda tela.
- O `README.md` foi atualizado para o estado entregue e o setup do Netlify.

Arquivos: `src/lib/store.ts`, `src/lib/quiz-state.ts`,
`src/components/quiz.tsx`, `messages/pt.json`, `README.md`.

## 10/09/2026 — Achado: histórico órfão com fallback de LLM real, resgatado em parte

_Originalmente em `CLAUDE.md`._

Uma sessão pedida pra implementar dark/light mode devolveu, em vez disso,
código e log de uma tarefa completamente diferente, datados de 15/08/2026:
fallback automático Anthropic↔Gemini, mais um README com referências a um
artefato "Quadro de Corte", uma decisão sobre "WhatsApp Coexistence" e um
documento de visão SaaS fora deste repo — nada disso nunca apareceu em
nenhuma versão do `CLAUDE.md` lida por esta sessão. O commit partia de
`23ab0db` (a base real do projeto), não do `develop` que devia ser a base —
ou seja: existe um segundo histórico, divergente, que nunca foi reconciliado
com o que virou `whatsapp-direto`/`main`. A causa mais provável é reuso de
ambiente/container carregando checkout de uma sessão anterior não relacionada;
não dá pra confirmar daqui.

**Resgatado, verificado e mergeado:** só `src/lib/llm.ts` + `llm.test.ts` — o
fallback automático Anthropic↔Gemini (`LLM_PROVEDOR` escolhe o principal;
se ele falhar em runtime, o outro tenta sozinho antes de cair no texto de
reserva; recusa por segurança não aciona fallback, é sinal sobre o conteúdo,
não sobre o provedor). `analise.ts`/`proposta.ts` passaram a chamar
`extrairEstruturado`/`escreverTexto` em vez de `getClaude()` direto —
`claude.ts` virou código morto e foi removido. Decidi salvar isto e só isto
porque: (1) o código é autocontido e não conflitava com nada que mudou desde
`23ab0db` — conferido por diff antes de aplicar; (2) `GEMINI_API_KEY` já
existe nas environment variables do Netlify, então alguém real já preparou
produção pra isto funcionar — não é especulativo. `tsc --noEmit` e
`vitest run` (138/138, +7 da suíte nova) limpos depois de aplicado.
⚠️ Gemini segue **não verificado contra a API real** (mesmo aviso do
`asaas.ts`/`whatsapp.ts`: escrito contra a doc oficial, sem chave disponível
nesta sessão para testar).

**Não resgatado, de propósito:** o resto do README daquela branch (itens de
checkout Hotmart, status do webhook Asaas, decisão de WhatsApp, link pro
"Quadro de Corte", roadmap SaaS). Não tenho como confirmar se isso ainda é
atual — pode já estar resolvido, revertido ou superado pelo que realmente
aconteceu entre 15/08 e hoje na linha que virou `main`. Fica registrado aqui
pra alguém (Willian) decidir se vale garimpar mais daquela branch
(`feature/dark-light-mode` no GitHub, ainda existe) — eu não mexi em mais
nada dela.

**Dark/light mode em si — ainda não existe.** Era o pedido original; nada
nesta branch órfã o implementa. Segue pendente, tarefa separada.

## 10/09/2026 (sessão seguinte) — Pendências fechadas: search_path, contraste, i18n completo

_Originalmente em `CLAUDE.md`._

Branch `feature/pendencias-set-2026` a partir de `develop`. Uma branch
integradora, não uma por tarefa: sem commit (regra do repo), o staging do git
é global e não dá para deixar quatro branches cada uma com o seu diff. Willian
commita em pedaços lógicos pelas fronteiras abaixo. Tudo `git add`, nada
commitado. `tsc --noEmit` e `vitest run` (138/138) limpos ao fim de cada
mudança lógica.

**1.1 — `search_path` mutável em `tocar_atualizado_em` — FECHADO.**
`supabase/migrations/0003_fix_search_path.sql` novo (não editei a 0001, já
aplicada): `alter function public.tocar_atualizado_em() set search_path = ''`.
A função só usa `now()`, então nada quebra. Aplicado também no banco real via
MCP (`apply_migration`, versão `20260910…`), confirmado por
`pg_proc.proconfig = {search_path=""}` e pelo advisor de segurança: o WARN
`function_search_path_mutable` sumiu. Sobram só os 5 INFO de
`rls_enabled_no_policy`, que são o C6 por construção.

**1.2 — Dark/light mode — FECHADO como ajuste de contraste dentro do ato**
(decisão do Willian, entre as três saídas oferecidas). Não é dark/light mode e
não lê `prefers-color-scheme`: o arco noir → ivory é mecânica de marca e um
modo de tema amarrado ao SO o sequestraria. `[data-contraste="alto"]` no
`<html>` (novo bloco em `globals.css`, depois de `[data-penumbra]`): no noir
sobe para o `--color-noir-3` já derivado — variante MAIS CLARA dentro do mesmo
ato, que corta a halação do serif fino sobre quase-preto — e sobe `--ink-2`/
`--ink-3`/filetes; no ivory (`[data-contraste="alto"] [data-superficie="ivory"]`,
seletor de descendência porque o ivory é `<div>` e o atributo é do `<html>`)
o papel escurece meio passo e as tintas ganham corpo. O ouro e os acentos não
mudam (já passam ≥4,5:1 nos dois atos). `src/components/contraste.tsx`
(`ControleContraste`): botão fixo no canto inferior direito, notação em caixa
alta com um piquete de giz vazio→cheio, sem emoji nem gradiente (§8). Escolha
em `localStorage` (`tailor:contraste`), try/catch em toda leitura/escrita,
nunca em trânsito. Montado em `[locale]/layout.tsx` (arco noir) e em
`p/[token]/page.tsx` dentro da `Superficie` (arco ivory). Verificado ao vivo
no quiz: liga, sobe o noir para noir-3, persiste no reload, zero erro de
console. O lado ivory ficou só na revisão de código — não há token de proposta
em dev para percorrer o funil (mesma ressalva de sempre). Fica um lint
`react-hooks/set-state-in-effect` no efeito que lê o `localStorage` no mount —
padrão idêntico ao já tolerado em `quiz.tsx` (retomada), é o jeito correto de
não ter mismatch de hidratação para estado só-cliente.

**1.3 — i18n: mecanismo + tradução completa EN/FR — FECHADO** (Willian pediu a
tradução completa, assumindo o risco de copy de marca traduzida por agente ir
a produção sem revisão nativa). Não existe branch `feature/i18n-auto-deteccao`
no `origin` — implementado do zero.
- **Detecção por `Accept-Language`**: já era o padrão do next-intl; deixei
  `localeDetection: true` explícito em `routing.ts` com o comentário. Conferido
  por `curl`: `/` responde 307 para `/fr`, `/en`, `/pt` conforme o cabeçalho.
- **Seletor manual** (`src/components/seletor-idioma.tsx`): `PT · EN · FR` em
  caixa alta no topo do quiz, atual riscada pela linha de corte, sem bandeira
  nem emoji (§8). Preserva o caminho (`router.replace(pathname, { locale })`) e
  sincroniza `<html lang>` num efeito (navegação de cliente não re-renderiza o
  layout raiz). Só no arco noir — a proposta não tem seletor, a língua dela foi
  decidida no quiz.
- **`messages/en.json` e `messages/fr.json`**: eram esqueletos de 6 linhas,
  agora traduzem as 223 chaves de `pt.json` (paridade conferida por script:
  zero chave faltando, zero sobrando). Regras de produto preservadas: C2 (todo
  `gap.*.nota`/`pico.leitura.*` abre com "based on what you told me" / "d'après
  ce que vous m'avez dit", nada de projeção), C3 (Patrícia — "dormant" /
  "endormis", nunca "wasted"), Bloco 6 traduz o aviso honesto de que nada foi
  inventado. **As tranches da Q9 em en/fr são qualitativas de propósito** ("A
  first step" … "The whole journey"): não há preço em USD declarado para a
  esteira, e inventar `$X` quebraria a regra de "nenhum número que ela não
  declarou". Registrado em `_traducao.moeda` dos dois arquivos como pendência
  para a Renilza (tranches reais em USD, e EUR se abrir a França).
- **`idioma` de ponta a ponta**: o quiz agora manda `idioma: locale` no
  autosave (`/api/leads`) e no gate (`/api/proposal`) — antes era sempre "pt"
  hardcoded, apesar de a coluna e o schema Zod já aceitarem. `montarProposta`
  grava `idioma` no `ConteudoProposta`, e `p/[token]/page.tsx` lê `c.idioma`
  para `getTranslations` e para a data da validade (`LOCALE_DATA`: pt→pt-BR,
  en→en-US, fr→fr-FR) em vez do `"pt"` fixo. `Expirada` recebe `locale`.
  Proposta antiga sem o campo cai em pt.
- Verificado ao vivo: quiz completo em EN e FR (screenshots), seletor troca
  idioma e texto, `<html lang>` acompanha, zero erro de console em aba limpa.
  O caminho da proposta traduzida ficou na revisão de código (sem token de
  proposta em dev).

**1.4 — Garimpo da branch órfã `feature/dark-light-mode` — FECHADO, quase nada
a trazer.** Cruzei o `git diff 23ab0db origin/feature/dark-light-mode` de
`README.md`/`PRODUCT.md`/`.env.example` com o código real de `develop`:
- **Verificado e trazido**: a stack estava desatualizada nos dois lados de
  `develop` também. `README.md` e `PRODUCT.md` diziam "Claude API" e o
  `PRODUCT.md` ainda dizia "Deploy alvo Vercel" — ambos falsos contra o código
  (`src/lib/llm.ts` com fallback Anthropic↔Gemini, `src/lib/transcricao.ts`
  Groq/Deepgram, `netlify.toml`). Linha de stack corrigida nos dois arquivos.
  Adicionada seção "Próximos passos" ao `README.md` só com itens verificáveis
  (webhook Asaas, preços, NF, WhatsApp, URL canônica) — a substância já estava
  no `CLAUDE.md` de 24/08.
- **Não trazido, de propósito**: preços literais no README (R$ 3.500 / 6.997 /
  9.997 — viola "nenhum preço fora de `config.ts`", e `config.ts` mostra ◆ em
  tudo); o artefato "Quadro de Corte" (só o Willian tem o link, não
  verificável); "testar WhatsApp Coexistence" como próximo passo (contradiz a
  decisão de 24/08 de não migrar o número agora); "produtos Hotmart em criação
  lá" (estado externo não verificável); "merge da branch whatsapp-direto" (o
  código de WhatsApp já está em `23ab0db`/`develop`). O corpo do `CLAUDE.md`
  órfão (222 linhas) **não foi reimportado**: é uma elaboração paralela do
  mesmo período 13–24/08 que a entrada de 10/09 acima já reconciliou; só o
  `llm.ts` valia e já foi mergeado em `1756e60`.

**1.5 — Env "pendentes" do log — provavelmente resolvidas, confirmação
indireta.** Não tenho token do Netlify nesta sessão. Evidência que consegui:
o projeto Supabase responde `ACTIVE_HEALTHY` (MCP), e a produção
(`https://sobmedida.renilzamiranda.com`) responde — `/` 307→`/pt`,
`/pt/diagnostico` e `/en/diagnostico` 200. As entradas de 23/08 e 24/08 já
registram `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`,
`UPSTASH_REDIS_REST_URL/TOKEN` e `PRECO_DOSSIE_CENTAVOS` coladas no Netlify, e
o task falava de uma auditoria de 10/09 que as encontrou lá mais
`SUPABASE_SERVICE_ROLE` e os três `PRECO_*_CENTAVOS`. **Tratadas como
resolvidas**; confirmação definitiva no painel do Netlify cabe ao Willian. O
que sobra de env não resolvida é preço real (`PRECO_JORNADA_CENTAVOS`,
`PRECO_CIRCULO_CENTAVOS`, `PRECO_PRISMA_*` — item de negócio, não de config).

**Seção 2 (não-código) — Willian confirmou que nada mudou.** Seguem `⏳ ainda
pendente, não é código`, sem novidade desde 24/08: preços reais em
`config.ts`; registro dos três acentos de persona e das divergências de
contraste no `BRAND-VISUAL.md` (fora deste repo); fornecedor de nota fiscal;
recuperação da conta Asaas de produção (suporte deles); ativação do webhook do
Asaas no painel; conta WhatsApp Cloud API (número novo + verificação Meta);
confirmação com a Renilza do mapa faixa→produto da Q9 — hoje `ate3500→dossie`,
`de3500a7k→prismaEssencial`, `de7a10k`/`acima10k→prismaCompleto`,
`naoDizer→prismaEssencial`, alinhado à esteira v4 (nenhum degrau promete teto
que a esteira não atende).

**Arquivos, por tarefa (fronteiras de commit sugeridas):**
- 1.1: `supabase/migrations/0003_fix_search_path.sql`
- 1.2: `src/app/globals.css`, `src/components/contraste.tsx`,
  `src/app/[locale]/layout.tsx` (parte contraste), `src/app/p/[token]/page.tsx`
  (parte contraste), `messages/{pt,en,fr}.json` (chave `contraste`)
- 1.3: `src/i18n/routing.ts`, `src/components/seletor-idioma.tsx`,
  `src/app/[locale]/layout.tsx` (parte seletor), `src/components/quiz.tsx`,
  `src/lib/proposta.ts`, `src/app/p/[token]/page.tsx` (parte idioma/data),
  `messages/{pt,en,fr}.json` (resto)
- 1.4: `README.md`, `PRODUCT.md`
- Log: `CLAUDE.md`

## 11/09/2026 — Bandeira no seletor de idioma, ícone no toggle de contraste

_Originalmente em `CLAUDE.md`._

Pedido do Willian: idiomas com bandeira (pt-BR, en-US) em vez de só texto, e
"o mesmo deve ser feito para o dark mode" — ícone reconhecível em vez de botão
só-texto, seguindo o padrão de mercado, com pesquisa antes de decidir a forma.
FR foi mantido (não era pra tirar, era só exemplo de dois dos três).

**Pesquisa (WebSearch) antes de implementar:**
- Seletor de idioma: a literatura de UX geralmente desaconselha bandeira
  sozinha (bandeira marca país, não língua — PT existe em vários países, EN
  também) e recomenda ícone de globo/texto puro. Mas quando bandeira é usada
  (é o pedido explícito aqui), a prática corrente (GitHub, Stripe, Notion) é
  sempre **parear com o nome do idioma visível**, nunca a bandeira sozinha, e
  **SVG desenhado, não caractere emoji** — fonte de emoji de bandeira
  (regional-indicator) não é garantida entre SOs; Windows historicamente
  mostra as duas letras do país em vez do pavilhão composto.
- Toggle de contraste: sol/lua é o ícone padrão de dark/light mode, mas este
  controle não inverte nada — é ajuste de legibilidade dentro do ato, não um
  segundo tema. Usei o círculo meio-preenchido, o mesmo glifo que
  alternadores de "alto contraste" de verdade (Windows/macOS) já usam:
  comunica a função certa em vez de prometer um dark mode que não existe.

**Implementado:**
- `src/components/seletor-idioma.tsx`: `Bandeira` — três SVGs desenhados
  (18×13, moldura em `--rule-2`), simplificados de propósito (Brasil sem
  brasão, EUA com 5 listras e grade de pontos no lugar de 50 estrelas, França
  exata por ser só três blocos). `aria-hidden`, o texto visível
  (`PT-BR`/`EN-US`/`FR`) e o `aria-label` do botão carregam a identificação —
  bandeira nunca é o único sinal. **Correção no mesmo turno**: a primeira
  versão pôs os três lado a lado; o Willian pediu caixa de seleção — reescrito
  para trigger (bandeira + código do ativo + seta) que abre um `role="listbox"`
  com as três opções, fecha ao escolher, clicar fora ou Esc. Mesma navegação
  por baixo (`router.replace(pathname, { locale })`).
- `src/components/contraste.tsx`: `IconeContraste`, monocromático
  (`currentColor`, cor de `--accent` quando ligado) — não abre exceção de cor
  nova, só o glifo mudou.

**Desvio registrado do BRAND-VISUAL §8** (veta cor fora do ouro/acentos de
persona, sob 3% de área): a bandeira é cor nacional saturada — verde/amarelo/
azul, vermelho/azul/branco. Decisão consciente do Willian, não deriva
automática; documentado no comentário do componente e aqui para entrar no
`BRAND-VISUAL.md` pelo protocolo §10 se ficar. O ícone de contraste NÃO abre
esse desvio — é monocromático, dentro do sistema de tinta existente.

Verificado ao vivo: bandeiras renderizam nos três idiomas, PT-BR ativo
sublinhado em `--accent`, clique em "English" navega para `/en/diagnostico`
com o conteúdo certo, zero erro de console. `tsc --noEmit` e `vitest run`
(138/138) limpos. Lint: mesmo `react-hooks/set-state-in-effect` de sempre em
`contraste.tsx` (leitura de `localStorage` no mount), nada novo.

**Deploy no mesmo dia:** `npm run deploy` (Netlify) publicado direto do
working directory local — o deploy não passa por git, então foi o branch
`feature/pendencias-set-2026` inteiro (não commitado) que foi ao ar em
`https://sobmedida.renilzamiranda.com`. Achado no caminho: o primeiro deploy
falhou com `EPERM` renomeando `.next` — processos `next dev` órfãos desta
mesma sessão (do `preview_start`/`preview_stop` do Browser pane) ainda
seguravam arquivos abertos, clássico do Turbopack não morrer limpo no
Windows. Resolvido matando só os PIDs confirmados por `Get-CimInstance
Win32_Process` como deste projeto (`next dev`, `start-server.js`, um worker
Turbopack) — nenhum processo do VS Code/Playwright MCP tocado. Redeploy
passou; `/pt`, `/en`, `/fr` conferidos 200 em produção.

## 12/09/2026 — Toggle claro/escuro real, substitui o ajuste de contraste

_Originalmente em `CLAUDE.md`._

**Pedido do Willian, direto: "não quero isso [o contraste], quero realmente
ter um light mode em branco e outra cor que achar boa, e corrigir também as
cores da animação para ficar condizente com layout de aplicações enterprise."**
Perguntei o escopo antes de mexer (três perguntas: onde vale, referência
visual, quais animações) — respostas: **vale em tudo, sem exceção** (inclusive
a Q3), **paleta a meu critério**, **todas as animações coloridas do sistema**.

**Isto reverte uma regra registrada em `DESIGN.md`**, não um ajuste cosmético:
"Não clarear a fase noir 'para legibilidade' — o escuro é funcional (Miwa &
Hanyu 2006: luz baixa aumenta autorrevelação)." A Q3 pedia baixa luz de
propósito, para reduzir a vergonha de confessar. O pedido do Willian foi
explícito o bastante para tratar como decisão de produto consciente, não
como algo que eu deveria filtrar — mas fica registrado em três lugares
(`DESIGN.md`, aqui, e no comentário do próprio `globals.css`) exatamente
porque é grande demais para ficar implícito. **Quem não ativa o toggle
continua no arco padrão** (noir no quiz, Q3 mais escura, ivory na proposta) —
a reversão só vale para quem escolhe o tema claro.

**O que foi trocado:**
- `src/components/contraste.tsx` → `src/components/tema.tsx`
  (`ControleTema`). Mesmo mecanismo de sempre (`localStorage`,
  `data-*` no `<html>`, try/catch em toda leitura/escrita), chave nova
  (`tailor:tema`, valor `"claro"`), ícone sol/lua desenhado (Feather-style,
  `currentColor`) em vez do círculo meio-preenchido — agora é dark mode de
  verdade, sol/lua é a convenção real (a pesquisa de 11/09 já tinha
  confirmado isso; só não cabia então). Mostra o ícone do modo PARA ONDE o
  clique leva (convenção X/GitHub): sol quando está escuro, lua quando está
  claro.
- `globals.css`: `[data-contraste="alto"]` saiu, `[data-tema="claro"]` entrou
  — não é mais "sobe um passo dentro do ato", é o tema inteiro. Branco puro
  (`#ffffff`), tinta quase-preta `#101828` (slate, não a ameixa do noir),
  regras/filetes recalculados. **O acento vira índigo** (`--color-gold:
  #4f46e5`, `--color-gold-hi: #3730a3`) em vez de ouro — índigo é a família
  de cor mais comum em dashboard B2B (Stripe, Linear, Vercel), e por estar no
  MESMO token que já era lido diretamente por filete, ênfase de título, foco
  de teclado e o fio de grainline da atmosfera, todos herdam o índigo de
  graça — nenhum componente precisou mudar, só o valor do token (mesma
  arquitetura que já fazia noir→ivory funcionar). `--color-cta`/
  `--color-cta-ink` (o botão "pôr do sol" laranja, nunca antes trocado por
  superfície) viram índigo sólido + texto branco. `--color-alerta` vira
  vermelho convencional (`#b91c1c`) — a família do terra deixa de fazer
  sentido fora do tema quente. Os três acentos de persona reusam os valores
  já calibrados para ivory (ivory e branco têm luminância próxima).
  `[data-tema="claro"]` vem DEPOIS de `[data-penumbra]` no arquivo de
  propósito — mesma especificidade, quem vem depois vence, e é assim que a
  Q3 para de escurecer quando o tema é claro. `[data-tema="claro"]
  [data-superficie="ivory"]` (seletor de descendência, o ivory é `<div>`)
  garante que a proposta também vira branco/índigo, não fica presa no ivory
  quente.
  - Todos os pares conferidos ≥4,5:1 por script de luminância relativa
    (Node, mesma fórmula das rodadas anteriores): ink 17,75:1, ink-2 7,61:1,
    ink-3 5,35:1, índigo sobre branco 6,29:1, índigo-alto 9,93:1, branco
    sobre CTA índigo 6,29:1, alerta 6,47:1 (usei `#b91c1c`, não o `#dc2626`
    inicial, que media só 4,83:1 — margem curta demais para texto de 14px),
    os três acentos de persona 5,2–5,24:1.
- **Animações recoloridas** (pedido: "todas as coloridas"): `atmosfera.tsx`
  não precisou de nenhuma mudança de código — já lia `--rule`/`--ink-3`/
  `--color-gold` por herança, então o índigo chegou de graça (verificado ao
  vivo: o fio de grainline no canto superior direito está índigo no tema
  claro). O traçado de giz da barra de progresso e os piquetes idem (leem
  `--accent`/`--color-gold`). As três cenas ilustradas
  (`cenas/agenda.tsx`, `cenas/armario-cartoon.tsx`, `cenas/etiquetas.tsx`)
  tinham paleta HARDCODED (`#E8935B`/`#F0C24A`/`#D9707A`, laranja/ouro/rosa —
  não eram token, não trocavam sozinhas): recoloridas para
  `#4F46E5`/`#0EA5E9`/`#14B8A6` (índigo/céu/verde-azulado), a mesma família
  do novo acento. Não converti para CSS custom property (exigiria
  reestruturar as três cenas) — ficou registrado como possível dívida se um
  dia precisar variar por tema em vez de ser fixo.
- **`DESIGN.md`** ganhou uma nota logo depois de "A candeia da Q3" registrando
  a reversão consciente do veto de Miwa & Hanyu para quem ativa o tema claro.

**Verificado ao vivo** (Browser pane, viewport 1400px pra ver a atmosfera):
tema claro liga por clique, `data-tema="claro"` no `<html>`, `--surface`
resolve pra `#fff` mesmo com `data-penumbra` true na Q3 (conferido via
`getComputedStyle`, não só visual) — a Q3 fica branca de verdade quando o
tema é claro. Botão "Começar" preenchido em índigo sólido quando ativo, trilho
de giz e curvas de fundo em índigo/slate. Toggle-off restaura `#1f1530`
(noir-2, penumbra) e limpa o `localStorage`. Zero erro de console nos dois
sentidos. `tsc --noEmit` e `vitest run` (138/138) limpos; lint só o
`react-hooks/set-state-in-effect` de sempre (mesmo padrão tolerado desde
`quiz.tsx`).

**Não verificado ao vivo:** o lado ivory→branco da proposta (`p/[token]`) —
mesma ressalva de sempre, sem token de proposta em ambiente de dev. A
mecânica é idêntica à do quiz (mesmos tokens, mesma herança), então a
confiança é alta, mas fica registrado como revisão de código, não observação.

**Desvio de marca, maior que os anteriores desta semana.** Isto não é uma
bandeira ou um ícone — é a paleta inteira do produto quando o tema claro está
ativo, incluindo a reversão de uma regra com citação de pesquisa. Registrado
em três arquivos por decisão do Willian (não peço confirmação da Renilza aqui
porque não é meu lugar decidir isso — só deixo sinalizado): antes de mostrar
o tema claro pra ela, vale considerar se a paleta índigo/enterprise ainda lê
como "consultoria de imagem francesa" ou já é um produto visualmente
diferente por baixo do mesmo texto.

## 18/09/2026 — Prompt de redesign disruptivo/motion: Fase 1 + P0/P1 (mecanismos A–E, H)

_Originalmente em `CLAUDE.md`._

Prompt colado pelo Willian, gerado numa sessão separada (Cowork/vault) em cima
de auditoria ao vivo de `sobmedida.renilzamiranda.com` + inspeção de CSS/JS
computado. Pedia duas fases: auditoria com `/impeccable` + `/taste` primeiro,
depois implementar os mecanismos A–H (coluna de costura, menu ancorado, corte
ao selecionar, tema como peek, costura viva na Q3, painel desktop, clímax da
revelação, retomada visual) sem parar a cada um — só parar se a Fase 1
contradissesse algo ou esbarrasse em veto do BRAND-VISUAL.

**Fase 1 rodada de verdade, com achados que mudaram o plano:**
- **`BRAND-VISUAL.md` — ao contrário do que o prompt assumiu ("não tenho
  acesso"), esta sessão TEM** (`OneDrive/.../branding/BRAND-VISUAL.md`, lido
  inteiro). Achado decisivo: **§2.4 regra 4** ("noir é o padrão; ivory é para
  ler... a troca de fundo é o sinal de 'aqui você lê', e é intencional") é
  exatamente o argumento do mecanismo D — e o oposto direto do que o Willian
  tinha pedido em 12/09 ("vale em tudo, sem exceção"). Perguntei antes de
  implementar; ele escolheu **seguir o mecanismo D como o prompt pede**,
  revertendo a decisão de 12/09 conscientemente — registrado como decisão
  dele, não filtro meu.
- **`/taste` rodou contra produção** (`sobmedida.renilzamiranda.com-viewport
  .jpeg`, `.md`, `.json` na raiz do repo — não commitados, são artefato de
  análise, não código do produto). DNA confirmado por medição real: ouro em
  1,4% da área (vs. 98,1% noir), zero `box-shadow` no sistema inteiro, só 2
  valores de `border-radius`, e **o achado que mudou o mecanismo A**: as 5
  transições amostradas usam TODAS o mesmo `cubic-bezier(0.16,1,0.3,1)`
  escrito à mão — "easing próprio, sem lib de motion" é uma das 4 taste
  principles com evidência. O prompt pedia GSAP pro mecanismo A; troquei por
  CSS transition com o MESMO token de easing — GSAP exigiria aproximar essa
  curva (a exata é plugin pago) e uma dependência nova, pra um tween de valor
  único que CSS já resolve certo. Nenhum dos mecanismos P0/P1 precisa de
  scroll-linked orchestration (só F/G, adiados), então **GSAP não entrou —
  zero dependência nova**.
- **`/impeccable` foi instalado nesta sessão** (não existia neste repo) —
  mas a instalação (`npx impeccable@latest install`) trouxe uma versão (0.1.5)
  cujo binário (`detect`) diverge do fluxo `context.mjs`/`audit` que o próprio
  SKILL.md documenta (esse arquivo não existe nesta versão instalada — parece
  o mesmo tipo de drift entre wrapper npm e engine bundlado que o próprio
  prompt alertava, mas confirmado com `@latest` explícito, não é o bug de
  cache do issue #266). Rodei `impeccable detect --json` direto (scan de
  arquivo, não a URL — o binário deu `ERR_NAME_NOT_RESOLVED` tentando resolver
  DNS sozinho, ambiente isolado do dele, não da rede real) contra
  `quiz.tsx`/`molde.tsx`/`alfinete.tsx`/`seletor-idioma.tsx`/`tema.tsx`/
  `globals.css`: **zero achados**, antes e depois da implementação.

**Escopo desta sessão (segunda pergunta ao Willian): P0+P1 agora (A, B, C, D,
E, H) — G fica pendente de ver a proposta de verdade, F (painel desktop) fica
pra depois, ambos como P2/P1.5 do próprio prompt.**

**A — Coluna de costura.** `TrilhoDeGiz` (`molde.tsx`) deixou de ser
`scaleY` em `<div>` e virou `<svg>` com `stroke-dashoffset`/`pathLength=1` —
a mesma técnica de `tracar`/`atmosfera-tracar`, agora estendida ao indicador
de progresso. Continua ligada a `PROGRESSO[etapa]` (o índice real, não
scroll); ao voltar, a transição CSS interpola pra trás sozinha — "descoze"
sem nenhum código extra, é o mesmo mecanismo de sempre, só que reversível de
graça. `--rule`/`--accent`, mesma paleta.

**B — Alfinete (conserta o bug de sobreposição achado na auditoria).** Os
dois controles fixos soltos (idioma canto superior-direito, tema
inferior-direito) — confirmados na auditoria sobrepondo texto de opção em
tela longa do quiz, mobile — viraram um único pino (`alfinete.tsx`), 32×32,
ancorado na MESMA faixa lateral que `TrilhoDeGiz` já ocupa com segurança
(`left-2 sm:left-4`), nunca sobre a coluna de leitura. Colapsado por padrão;
abre um painel com idioma + tema + o link de acessibilidade do mecanismo D.
`seletor-idioma.tsx` e `tema.tsx` viraram módulos de peças reaproveitadas
(bandeiras, ícones sol/lua, mapas de nome) — o `SeletorIdioma`/`ControleTema`
fixos e soltos de 11/09 e 12/09 saíram de cena. A seção de idioma vive num
subcomponente próprio (`SecaoIdioma`) porque `useLocale`/`useRouter` do
next-intl exigem `NextIntlClientProvider` — a proposta (`p/[token]`) não tem
um, e hook não pode ser condicional; só o componente pode deixar de montar
(`mostrarIdioma=false` lá).

**C — Corte ao selecionar.** `LinhaOpcao` (usada por Q7/Q8/Q9 e pela
sub-lista "situação" do Espelho — NÃO pelos cartões de persona em si, que já
têm o próprio tratamento de fade a 28% de opacidade e ficaram como estavam,
de propósito, pra não empilhar duas animações na tela de maior risco de
abandono) ganhou um traço perpendicular efêmero (`Corte`, 220ms,
`stroke-dashoffset`, mesmo `tracar`) que cruza a opção no clique, antes do
estado "selecionada" assumir. O estado real (`aria-pressed`, `onClick`)
muda no mesmo instante — o corte é só visual, nunca atrasa a lógica.
Verificado por leitura de `aria-pressed` (correto) e por inspeção de código;
**não consegui capturar o frame do corte ao vivo** — a janela é 220-260ms e o
round-trip das ferramentas de browser deste ambiente excede isso, inclusive
`requestAnimationFrame` trava com a aba em segundo plano. Confiança alta por
ser o mesmo padrão já provado ao vivo em D/E nesta mesma sessão, não é
suposição cega.

**D — Tema virou peek, não switch persistente (reverte 12/09, decisão
explícita do Willian).** `Alfinete` já cobre o mecanismo: segurar (pointerdown/
pointerup/pointercancel/leave, e Espaço/Enter por teclado) liga
`data-tema="claro"` só enquanto segura, **nunca grava `localStorage`** —
verificado ao vivo (`durante: "claro"`, `depois: null`, `storage: null`). O
switch de verdade, persistente, existe atrás de um link "Acessibilidade" no
mesmo painel — verificado ao vivo escrevendo e limpando
`localStorage['tailor:tema']` nos dois sentidos, sem interferir um com o
outro (soltar o peek nunca apaga a preferência persistente já fixada, e
vice-versa — os dois efeitos leem `espiando || climaPersistente`).

**E — Costura viva na Q3.** `PerguntaAberta` ganhou uma linha
`stroke-dashoffset` sob o campo, proporcional a `valor.trim().length / 140`
(140 = uma frase completa típica, satura em 1, nunca corta texto real).
Verificado ao vivo: `dashoffset` bateu exato com a fórmula em 108 caracteres
digitados (`0.2286` calculado = `0.2286` medido), reagindo em tempo real ao
teclado.

**H — Retomada visual.** Não precisou de código novo: como `indice` nasce em
0 e só sincroniza pro valor restaurado depois do mount (efeito em `quiz.tsx`,
já existia), a transição de 700ms de A já desenha do zero até o ponto
restaurado sozinha — a "sensação de o alfaiate retomando" que H pedia já sai
de graça da mesma mecânica de A. Não criei uma duração de 600ms separada só
pra esse caso: a diferença contra 700ms é imperceptível e não justificava
mais uma ramificação de estado.

**Não feito nesta sessão, de propósito:**
- **F (painel desktop com Three.js/SVG generativo)** — P2 explícito do
  próprio prompt, maior risco de custo/prazo, menor efeito na taxa de
  conclusão do quiz (que é o que importa pro negócio). Não comecei.
- **G (clímax da revelação noir→ivory)** — o próprio prompt pedia confirmar
  o estado real da tela de proposta antes de implementar, e **não tenho
  token de proposta em ambiente de dev** (mesma ressalva de sempre, várias
  sessões). Fica pendente até alguém abrir uma proposta de verdade e eu ver
  o que já existe lá antes de "elevar" algo que não vi.
- Aplicar `Corte` (mecanismo C) aos cartões de persona do Espelho — decisão
  deliberada, não esquecimento, ver acima.

**Verificado ao vivo** (Browser pane, mobile 375×812, retomando de um estado
real salvo em `localStorage` até "Peça 3"): rail A desenha e "descoze" ao
voltar; Alfinete abre sem sobrepor nenhum texto de opção na tela do Espelho
(a tela exata que a auditoria flagrou); peek D liga/desliga sem persistir;
link de acessibilidade persiste/limpa corretamente, inclusive re-renderizando
o painel inteiro em branco/índigo quando ativo; costura E bate com a fórmula
exata; zero erro de console em todo o percurso. `tsc --noEmit` e `vitest run`
(138/138) limpos. `impeccable detect` limpo antes e depois.

**Achado de ambiente, registrado porque vai se repetir:** o binário nativo do
`impeccable` (`detect --viewport ... <url>`) falha com
`ERR_NAME_NOT_RESOLVED` tentando resolver `sobmedida.renilzamiranda.com`
mesmo com o domínio resolvendo normalmente por `curl`/`nslookup` no mesmo
shell — o Chromium bundlado do binário não herda o resolver do sistema neste
ambiente. Scan por arquivo local (`detect --json <arquivos>`) funciona sem
problema; é o caminho a usar aqui até isso ser investigado.

**Arquivos não commitados por decisão, deixados fora do `git add`:**
`.github/agents/`, `.github/hooks/`, `.github/skills/` (scaffolding do
`impeccable` pra GitHub Copilot — ferramenta local, não código do produto),
`.mcp.json` (registro do MCP `threejs-devtools-mcp`, tarefa separada),
`sobmedida.renilzamiranda.com{-viewport.jpeg,.md,.json}` (saída do `/taste`,
artefato de análise). Nenhum é secreto nem quebra nada ficando de fora; só
não é produto.

## 18/09/2026 (mesma sessão) — Mecanismos F e G: pedido "siga com todos os ajustes"

_Originalmente em `CLAUDE.md`._

Depois de A–E+H, o Willian pediu pra fechar o resto — G (clímax) e F (painel
desktop), os dois que eu tinha deixado pendentes com razão específica
registrada acima. As duas razões foram resolvidas, não puladas.

**G — desbloqueado gerando uma proposta real.** Sem token de proposta em dev
(a ressalva de sempre), usei o próprio `/api/proposal` direto (`fetch` no
console, backend de arquivo local) com um payload completo de teste — gerou
um lead + token reais (`d4fe97b9…`), o que finalmente deixou eu ver o estado
atual da transição. **Achado que mudou o desenho:** não existia transição
nenhuma — `Pico`'s CTA é um `<a href={url}>` cru, e `/p/[token]` é uma rota
fora do `[locale]`, então clicar é sempre navegação de página inteira
(recarrega). Não dá pra fazer crossfade DENTRO de uma troca de página assim.
Solução: tocar a animação inteira do lado noir, atrás de um véu que já
cobriu a tela antes da navegação de verdade acontecer.

- `VeuDeRevelacao` (`quiz.tsx`, dentro de `Pico`): um círculo cresce do
  centro (`clip-path: circle()`, paint-only) cobrindo a tela em ivory —
  ou no branco real do tema claro, se `data-tema="claro"` estiver ativo,
  senão o véu prometeria ivory quente e entregaria branco/índigo do outro
  lado. 1200ms, mesmo easing de sempre. O clique no CTA (`irParaProposta`)
  previne a navegação, liga o véu, e só troca `window.location.href` depois
  — sob `prefers-reduced-motion`, a espera cai pra 60ms (não trava ela numa
  animação que pedimos pro sistema não mostrar). A coluna de costura (A) já
  chega a 100% sozinha no Pico (`PROGRESSO.pico = 100`), então "a linha
  completa o traço" não precisou de código novo.
- Do lado ivory (`p/[token]/page.tsx`): o título do Bloco 1
  (`TituloRevelado`) revela palavra por palavra — puro SSR, `animation-delay`
  crescente por `<span>`, sem JS nem client component. Os blocos 2–7
  (`Bloco`, prop nova `indice`) entram em sequência depois, `surgir` com
  atraso de `700 + indice*140ms`.
- **Achado real, corrigido no mesmo lugar:** o `@media (prefers-reduced-motion)`
  global só zerava `animation-duration`, não `animation-delay` — um reveal
  escalonado esperaria o delay inteiro (até ~1,5s) antes de aparecer tudo de
  uma vez, o oposto de "menos movimento". Adicionado `animation-delay: 0s
  !important` na mesma regra — beneficia qualquer stagger do sistema, não só
  este.
- Verificado ao vivo (proposta real gerada pelo fetch acima): `animation-delay`
  de cada bloco bate exato com a fórmula (0,84s/0,98s/1,26s/1,4s/1,54s pra
  indice 1/2/4/5/6 — o 3, Bloco 4/fita métrica, não renderizou nesse lead de
  teste porque o payload não tinha dado pra montar a fita, não é bug do
  reveal), palavra por palavra do título com 70ms de passo, zero erro de
  console. **O véu em si (lado noir) não foi capturado ao vivo** — chegar até
  o Pico exigiria completar as 9 telas pela UI de verdade meio a esta rodada
  já ter ido longa; confiança alta por ser `clip-path`+`useState`, o mesmo
  padrão já provado ao vivo em B/D/E nesta sessão.

**F — painel de desktop, ≥1024px, SVG (não Three.js, seguindo o veto do
próprio prompt).** `src/components/painel-desktop.tsx`, novo:
`PainelDesktop` — um `<svg>` fixo à direita (espelhando a coluna de costura à
esquerda), 6 peças de molde simples (colarinho, duas mangas, corpo, saia,
bainha — formas geométricas, não recorte de costura real) que acendem
(`--rule` → `--accent`, com o `cena-pop` de sempre) conforme
`PROGRESSO[etapa]` cruza o marco de cada uma. Na última peça (Pico), as seis
formam o contorno de uma peça de roupa simples. `hidden lg:flex` — não
existe abaixo de 1024px, não é responsivo, é um componente que só existe
quando sobra tela. Verificado ao vivo em 1280px: só o colarinho aceso em
progresso 24 (< marco 33 da manga), cores batendo (`var(--accent)` vs
`var(--rule)`) exatamente como o código prevê; confirmado `display: none` em
375px. Zero erro de console.

`tsc --noEmit`, `vitest run` (138/138) e `impeccable detect --json` (zero
achados) limpos depois dos dois mecanismos. **Os oito mecanismos do prompt
de 17/09 (A–H) estão fechados.**

**Fechamento de lacuna — E/G (frase da Q3 palavra por palavra).** Conferência
final contra o prompt de 17/09 achou um item que as duas passadas anteriores
não cobriram: E (parte 3) e G (passo 3) pedem que a frase dela, devolvida no
fim, apareça palavra por palavra — mas só o título do Bloco 1 tinha o stagger;
a citação no cartão Hoje/Futuro (`comparador.tsx`, usado no Pico e na proposta)
era um parágrafo estático. Novo `FraseRevelada` no próprio `comparador.tsx`:
`surgir` por palavra, começa em 250ms, passo de até 70ms que encolhe em frase
longa (revelação inteira ≤ ~1,4s). Texto literal dela, só o ritmo é nosso.
Verificado ao vivo numa proposta gerada em dev: 14 palavras, atrasos 250ms →
1160ms, espaços preservados. Armadilha registrada: espaço final dentro de
`inline-block` colapsa e gruda as palavras — o separador tem de ser NBSP
(` `), como já era no `TituloRevelado`. `tsc` e `vitest` (138/138) limpos.

**Desvios conscientes do prompt de 17/09, para não voltarem como "pendência":**
GSAP/ScrollTrigger/Lenis não entraram (CSS + estado React, mesmo easing —
ver entrada de A–H); sob `prefers-reduced-motion` o véu de G colapsa a 60ms
em vez do crossfade de ~400ms que o prompt sugeria; a checagem do
`ui-ux-pro-max` (Fase 1, item 3) e os critérios 3 e 5 (overlap em 360/414px e
TTI antes/depois no Lighthouse) não foram medidos formalmente — só 375px foi
conferido ao vivo.

## 19/09/2026 — Keepalive do Supabase no GitHub Actions

_Reconstituída em 23/09/2026 a partir de
`.github/workflows/supabase-keepalive.yml` e do commit `c0ae34b` (PR #2,
19/09), onde o workflow entrou como primeiro commit ("ci: add Supabase
keepalive workflow"). A data em que foi escrito não ficou registrada, só a
do merge._

Resposta à pausa por inatividade de 23/08:

- Roda segunda, quarta e sexta às 11:00 UTC (08:00 em Brasília) e também sob
  demanda, com folga larga contra a janela de 7 dias.
- Faz um GET em `/api/confirmation/<token>` no endpoint de produção. Esse GET
  executa um SELECT real em `leads`, e essa atividade de banco zera o timer.
- Se o projeto estiver pausado, o job religa pela Management API
  (`POST /v1/projects/{ref}/restore`). Isso exige o secret
  `SUPABASE_ACCESS_TOKEN` no GitHub; sem ele, o job só faz o ping e falha.
  Se o banco estiver saudável e o endpoint falhar, o job não religa, porque
  o problema está em outro lugar (env, deploy).
- A saída definitiva continua sendo o upgrade para o plano Pro antes de
  abrir ao público (entrada de 23/08).
- O endpoint e a referência do projeto estão fixos no arquivo. Esse é um
  ponto a parametrizar no white label.

## 19/09/2026 — Controles do topo (sol/lua + idioma) e animações mais visíveis

_Originalmente em `CLAUDE.md`._

Pedido do Willian com um seletor de tema de app como referência (pílula
sol/lua, modo ativo preenchido), mais uma pílula de idioma. Ele achou o tema
claro "ainda escuro" — causa: desde 18/09 o claro era só "segurar para
espiar" (mecanismo D) e o botão persistente ficava atrás de um link de
acessibilidade dentro de um pino colapsado; o CSS do claro já era branco
(`--surface: #fff`, conferido). **Reverte o mecanismo D por decisão dele**
(a mesma chave `tailor:tema`, agora um switch visível).

- `src/components/controles-topo.tsx` (novo) substitui `alfinete.tsx`
  (removido): duas pílulas no **fluxo** da página (`absolute` no topo, rolam
  com ela — nunca `fixed`, que era a causa do bug de sobreposição de 17/09).
  Idioma: bandeira + PT/EN/FR (sem bandeira abaixo de 360px). Tema: sol/lua,
  ativo com `--color-cta` (laranja no escuro, índigo no claro). O `main` do
  quiz ganhou `pt-p5` para reservar a faixa. Na proposta só o tema aparece.
- `src/app/layout.tsx`: script inline aplica `data-tema` antes do primeiro
  paint (sem flash escuro nem os 900ms de transição a cada carga) e
  `suppressHydrationWarning` no `<html>`.
- Mensagens: bloco `alfinete` virou `controles` (`idioma/tema/claro/escuro`).
- Animações (pedido "mais bonito, mais claro"): fio de costura de 1px→2px com
  uma "agulha" (ponto + anel que respira) na ponta; opção escolhida ganha um
  lavado do acento que varre da esquerda (`scaleX`, 480ms) e o corte passa a
  2px/300ms; peças do painel de desktop se desenham (`tracar`) e ganham
  preenchimento de 12% do acento. Só `transform`/`opacity`/paint.
- Painel de desktop só a partir de 1120px (a 1024px encostava no texto) e o
  fio de grainline da atmosfera foi para a esquerda (colidia com o painel).
- **Desvio de forma:** as pílulas usam `border-radius: 999px`, fora do "cantos
  2px" do §4 do BRAND-VISUAL — seguem a referência do Willian; registrar pelo
  §10 se ficar.
- Verificado ao vivo em 375px (barra numa linha só; toggle troca, grava
  `localStorage` e persiste) e em 1360px (claro/escuro). `tsc` limpo.

## 19/09/2026 — Bug: trocar de idioma no quiz recomeçava do zero

_Originalmente em `CLAUDE.md`._

Achado do Willian. Reproduzido ao vivo: trocar o idioma na tela do
diagnóstico final (Pico) devolvia à abertura. Causa: trocar `/pt` → `/en`
remonta o `Quiz`; a retomada lia só o `localStorage`, que (a) é apagado de
propósito ao entrar no Pico e (b) ignora `indice < 1` (abertura com nome
digitado). Nas telas do meio a retomada já funcionava.

- `src/lib/retomada.ts`: cópia do molde na **aba** (`sessionStorage`,
  `tailor:sessao:v1`), gravada a cada mudança, incluindo abertura e Pico
  (com `urlProposta`). Morre com a aba; a retomada entre visitas segue sendo do
  `localStorage`, que continua apagado no Pico (minimização mantida).
  O Pico só é restaurado com link `/p/…` válido e todas as etapas anteriores
  completas. Testes novos em `retomada.test.ts` (6).
- `quiz.tsx`: o efeito que grava passou a esperar a restauração (`pronto`);
  antes ele rodava no mesmo commit e sobrescrevia a cópia com o estado vazio.
- **Moeda:** trocar BRL↔USD com valores já declarados os reinterpretaria em
  outra moeda (R$ 900 virava US$ 900). Cada cópia carrega a `moeda` de origem.
  No Pico a moeda fica presa à de origem (a proposta já foi gerada nela); antes
  do Pico os valores monetários são limpos, o quiz volta à peça 4 e um aviso
  (`retomada.moeda`, pt/en/fr) explica. EN↔FR não muda (ambos USD).
- Verificado ao vivo: Pico em PT → EN continua no diagnóstico, com R$ e o
  mesmo link; peça 4 com valores em R$ aberta em EN limpa os valores e mostra o
  aviso em inglês. `tsc` limpo, `vitest` 144/144.
- Limitação: um F5 no Pico agora reabre o Pico (antes voltava à abertura), na
  mesma aba. Fechar a aba descarta a cópia.

**Seletor de idioma virou dropdown (19/09/2026, sugestão do Willian).** Escala
para mais línguas sem alargar a barra — a 375px as três pílulas ocupavam quase
toda a largura. Gatilho com bandeira + código + seta, lista com nome na própria
língua e ✓ no atual; fecha ao escolher, clicar fora ou Esc. A lista sai de
`routing.locales`. Armadilha corrigida: um idioma novo caía na bandeira dos
EUA; agora `Bandeira` devolve um quadro neutro. **Para acrescentar uma língua:**
`src/i18n/routing.ts`, `messages/<loc>.json`, `NOMES_IDIOMA` e a bandeira em
`seletor-idioma.tsx` (e a moeda em `moedaDoIdioma`, se não for BRL/USD).

## 19/09/2026 — Documentação reorganizada: histórico único e pendências únicas

_Reconstituída em 23/09/2026. O `docs/README.md` dizia que a justificativa
desta reorganização estava neste histórico, mas ela não estava._

- **O quê.** O log datado de `CLAUDE.md` (13/08 → 19/09) e as rodadas
  datadas de `DESIGN.md` (14/08 → 08/09) foram fundidos aqui em ordem
  cronológica, cada entrada marcada com _Originalmente em …_. As pendências
  espalhadas pelo `README.md`, pelo fim do log de `CLAUDE.md` e pelas
  rodadas de `DESIGN.md` viraram uma lista só, `docs/PENDING.md`. O
  `docs/README.md` virou o mapa de onde cada coisa vive. `CLAUDE.md` e
  `DESIGN.md` ficaram só com regra, convenção e o mundo visual como
  construído. No último commit antes disso, o `CLAUDE.md` tinha 1.328 linhas
  e o `DESIGN.md` 690; depois da reorganização, cada um ficou com menos de
  150.
- **Por quê** (`docs/README.md`, `docs/PENDING.md`, `CLAUDE.md` §Histórico):
  separar o que vale hoje do que aconteceu. O que muda a cada sessão vai para
  o histórico, e só regra, convenção e fonte da verdade ficam nos docs vivos.
  Também acaba com as três listas de pendências que divergiam.
- **Convenção que nasceu aqui.** Decisão pontual vira entrada nova neste
  arquivo. O que passa a valer sempre vai para o doc vivo correspondente. O
  que depende de outra pessoa, conta ou decisão vai para `docs/PENDING.md` e
  sai de lá quando resolvido.
- **O que ficou incompleto (conferido em 23/09).** O log do `CLAUDE.md` e
  as rodadas do `DESIGN.md` de `develop` entraram inteiros. O cabeçalho,
  porém, afirmava "nada cortado" sem cobrir as cinco entradas de agosto que
  só existiam na branch órfã, nem os eventos que nunca tiveram entrada. Tudo
  isso foi reconstituído em 23/09. A reorganização ainda não tem commit: os
  arquivos de `docs/` estão só staged, à espera do Willian.

### 20/09/2026 — Jornada: auditoria, entrevista com a Renilza e decisões de persona/idioma

Fluxo: a pedido do Willian (stepback sobre perguntas, persona sem clínica e
formulário como jornada), duas propostas independentes (Claude e GPT) foram
auditadas por 8 lentes de design/UX (impeccable, ui-ux-pro-max, taste,
web-design-guidelines, marca, código, conversão, comparação), com 14 achados
graves verificados por um cético (9 confirmados, 5 refutados). Material em
`docs/jornada/`: as duas propostas, `auditoria-e-plano-de-validacao.md`,
`achados-auditoria.md`, o prompt e o retorno da GPT
(`prompt-gpt-auditoria.md`, `feedback-v2-em-validacao.md`) e a entrevista
(`entrevista-renilza-rodada-1.md`). **Nada foi implementado no código.**

**Decisões do Willian, como estrategista da Renilza (20/09/2026):**
- **Persona "dona de clínica" removida.** A clientela real é de profissionais
  independentes que cobram pelo próprio serviço (estética/bem-estar: massagista,
  cabeleireira, manicure; algumas de venda direta). A "clínica" vinha do produto
  B2 da esteira (Auditoria de Coerência), que não se vende por quiz.
- **Duas personas confirmadas:** profissional que cobra pelo serviço e
  armário/autoestima, com carreira "linkada" (a mulher CLT usa a medida do
  armário). "Recomeço" (fase da vida) segue em aberto como terceiro espelho ou
  contexto.
- **Idiomas: PT-BR e inglês, inglês principal; francês removido; moeda USD no
  inglês.** Willian revisa o inglês. Código ainda não alterado; nenhum lead em
  francês no banco (consulta só de leitura).
- **Alto ticket = a partir de US$ 1.000** (falta dizer se é preço do produto ou
  orçamento da cliente).
- **O quiz não está aberto ao público;** roda só local, e as pendências se
  resolvem antes de abrir. Os 11 leads do banco (14/08–18/09) são testes.
- **Certificações internacionais são reais e documentadas.** Tensão registrada
  com o Princípio 1 do `PRODUCT.md` (a prova é a devolução, não a credencial).

**Achados de oferta:** a estética só tem o curso Da Maca (R$497 → R$997), sem
produto de ticket alto; o mapa faixa→produto da Q9 (Dossiê/Prisma) nunca leva a
ele. Willian quer um produto de estética de ticket alto, mensurável, na mesma
estrutura da mentoria de imagem, e a mentoria do "molde antigo" aberta a todos
os profissionais liberais (a confirmar se é o Prisma).

Conhecimento consolidado sobre a Renilza: `docs/renilza-conhecimento.md`.

**Complemento (20/09/2026, mesma sessão) — oferta e limiar de high ticket.**
Correlação das 7 áreas da mentoria antiga com o Método Prisma
(`docs/oferta/correlacao-mentoria-antiga-prisma.md`): o Prisma é a mentoria
ampla; cobre bem 2 das 7 áreas, parcialmente 2 e **não cobre redes sociais,
atendimento de excelência nem vendas** (por desenho), que já existem no curso
Da Maca. Proposta de mentoria 1:1 de estética (Prisma + conteúdo do Da Maca,
entre o Da Maca e a Auditoria de Coerência) em
`docs/oferta/proposta-mentoria-estetica-1a1.md`. Willian propôs **high ticket
a partir de US$ 3.000**; com R$ 5,1427 por US$ (Investing.com, 20/09/2026) o
Prisma (US$ 1.361–2.333) **não** passa; só Assinatura Anual, Auditoria de
Coerência e Dubai em Pessoa passam, e são "nunca público". **Recomeço** decidido
(provisório) como contexto dentro de armário/autoestima, com salvaguardas de
encaminhamento. Nada foi implementado no código.

**Complemento (20/09/2026) — portfólios antigos, capacidade e correção.** O
Willian enviou os dois portfólios que a Renilza vendia (Mentoria Excelência 360º
e Massagem); registro em `docs/oferta/portfolios-antigos.md`. Hoje ela **não
vende nada** (estuda) e a estrutura está sendo montada para o retorno. **Correção:**
a mentoria antiga tinha 11 tópicos e, em 8, era **negócio para prestadora de
serviço** (precificação, marketing, vendas, negociação, atendimento, fidelização),
que o Prisma exclui por desenho — logo o herdeiro da antiga é a **mentoria 1:1 de
estética**, não o Prisma. Achados: 12 × R$ 583,12 = R$ 6.997,44 (o Prisma Essencial
parece derivar do total parcelado da presencial); "Clínica Av. Paulista" aparece no
portfólio de massagem (confirmar antes de dizer "nunca teve clínica"); nomes de
famosos são clientes da Renata França. **Capacidade:** 3 atendimentos por dia, de
segunda a sexta = 15 slots/semana; modelo e projeções em
`docs/oferta/capacidade-e-projecao.md` (o Prisma Completo rende R$ 1.111 por slot
contra R$ 1.399 do Essencial). **Idioma:** tudo nasce em inglês, com opção de
português. Faixa "médio-alta" (US$ 1.000–2.999) aceita. Pendente: relembrar o
Prisma. Nada implementado no código.

**Complemento (20/09/2026) — meta de R$ 1 milhão, regra do tempo e esteira reprecificada.**
Willian: (1) quer bater **R$ 1 milhão por ano**; (3) a "Clínica Av. Paulista" era
**um coworking alugado** (a Renilza nunca teve clínica própria); (4) pediu para
subir os preços conforme a projeção, o mercado e as estratégias de vendas; (5)
**low ticket só com produto escalável; o tempo dela só com high ticket.** Análise
em `docs/oferta/esteira-reprecificada-e-meta-1m.md`: com o tempo dela só em high
ticket (≥ US$ 3.000) bastam ~34 vendas por ano para R$ 1,008 mi (37% dos
atendimentos); o ano 1 sem casos ≈ R$ 339 mil; o gargalo é demanda e prova, não
capacidade. **A regra 5 quebra** a Jornada (Mesa semanal ao vivo + Ateliê), o Sai
Pronta (Leitura do Mês), o Da Maca (3 encontros ao vivo + Sala), o Dossiê 1:1 e o
Prisma (ambos abaixo de US$ 3.000). Mercado (busca na web): programas de marca
pessoal nos EUA a US$ 3–6 mil+, meio do mercado US$ 5–15 mil, imagem executiva
US$ 15–35 mil; Brasil premium ~R$ 8 mil (o mesmo preço em reais é 2–5× isso).
Proposta de preços e artefato com 15 perguntas: https://claude.ai/artifact/6xWQSapDYkmH3Ls8bW9v82. Nada implementado.

**Complemento (20/09/2026) — decisões da esteira.** O Willian respondeu as 15
perguntas do artefato (https://claude.ai/artifact/6xWQSapDYkmH3Ls8bW9v82; conferidas no banco do artefato). **Meta bruta de
R$ 1 milhão no ano 2** (o ano 1 é de prova). **A escada de estágios e a subida de
preços do Prisma não foram adotadas** (valores mantidos; high ticket em português
= valores do Prisma; "reservar US$ 3.000 para o inglês", ambíguo). **Exceções à
regra do tempo:** Dossiê 1:1, A Mesa da Jornada e encontros do Da Maca; Sai Pronta
gravada. Aceitos: Assinatura US$ 7.500 com limite, Auditoria US$ 9–25 mil, Dubai
US$ 9–12 mil. Turma fechada já na primeira turma, com preço menor por vaga;
turma fundadora com desconto por caso publicado; Signature para qualquer
profissional de estética; cabelo e maquiagem na Fase 3; a Renilza faz o
fechamento; premissas de capacidade confirmadas. **Recalculado:** ano 2 ≈ R$ 989
mil com Dubai e ≈ R$ 665 mil sem (faltam ≈ R$ 335 mil de produtos); ano 1 ≈ R$
253 mil; teto individual a 70% ≈ R$ 845 mil. **Custo das exceções:** A Mesa ≈ 91
h/ano e só se paga com ≈ 60 assinantes (R$ 97,90) ou ≈ 30 (R$ 197); fechamento por
call ≈ 6,5/semana ≈ 10% da capacidade. Detalhe em
`docs/oferta/decisoes-esteira-20-09.md`. Nada implementado.

**Complemento (22/09/2026, mesmo dia) — 25–28 aceitas, data adiada para novembro,
cronograma.** O Willian aceitou as quatro recomendações (Prisma em inglês,
Consultoria de Imagem · Dubai & Europa, preço da Turma, desconto de 30% na
fundadora) e a recomendação da Mesa da Jornada (mantida, revisão em 6 meses).
**Mudou a data do ano 1 de outubro para novembro de 2026**, "para dar tempo de
desenvolvermos todos os produtos". Criado `docs/oferta/cronograma-desenvolvimento.md`:
alvo assumido 02/11/2026, ~6 semanas. Dois riscos reais ao prazo, sinalizados:
**não existe gateway de pagamento internacional** (só Asaas, BRL) — bloqueia
qualquer cobrança em dólar; e **não se sabe se as 18 aulas do Da Maca já estão
gravadas**. Pedido para o artefato: remover o excesso de texto da seção de
decisões (tudo já decidido) e remover a seção de perguntas do fim — v4
publicada, mesma URL: https://claude.ai/artifact/6xWQSapDYkmH3Ls8bW9v82. Nada implementado no código ainda.

## 22/09/2026 — Fase 0: quatro achados de layout da auditoria de 19/09

Primeiros ajustes de código a partir de `docs/jornada/achados-auditoria.md` e
`auditoria-e-plano-de-validacao.md` — só os itens sem decisão de copy/produto
pendente (Renilza/Willian). Nada da proposta de jornada em 3 atos entrou;
continua não fundida.

- **A23 — alvo de toque do `BotaoAudio`.** Os três estados sem `AcaoDiscreta`
  (convite, gravando, erro) tinham ~19px de altura. `minHeight: 44` nos três
  (`molde.tsx`).
- **A18 — CTA do Pico quebrava em duas linhas a 375px.** "Ver minha proposta
  completa" não cabe em `px-p4` com o texto atual; encurtar o rótulo é decisão
  de copy (fica pra Renilza). Remédio de layout: `px-p3`/`gap-p1` abaixo de
  640px (`quiz.tsx`) + tracking reduzido pra essa peça só (`.cta-pico` em
  `globals.css`). Verificado ao vivo no dev server a 375px: cabe numa linha.
- **A26 — trocar de peça só rolava, sem mover foco nem anunciar nada** pra
  leitor de tela/teclado. `<div ref={topo}>` ganhou `tabIndex={-1}` +
  `aria-label` com o título da peça, e o efeito de troca de peça agora chama
  `.focus()` além de `rolarAte` (`quiz.tsx`). De quebra, `.campo:focus-visible`
  voltou a mostrar o anel `--color-gold-hi` — antes só a borda de acento
  cobria qualquer foco, contra PRODUCT.md:105 (`globals.css`).
- **A22 — com o teclado do celular aberto numa `CampoAberto`, o Continuar
  saía do alcance.** A barra de ação passa a `position: fixed` ancorada por
  `visualViewport` só enquanto uma textarea está focada (`quiz.tsx`). Ainda
  pede confirmação num aparelho real — não dá pra simular teclado de software
  neste ambiente; é exatamente o que a V4 do plano de validação já previa.
- **A27 — Q7, Q8 e a situação do Espelho eram gravadas como texto localizado,
  não como chave.** Trocava de idioma ou reabria o rascunho e o valor salvo
  não batia com nenhuma opção da língua nova. Migrado pro mesmo padrão que
  `futuro.palavras` já usava: `q7.opcoes`, `q8.opcoes` e
  `espelho.situacoes.<persona>` viraram objetos chave→texto em `pt/en/fr.json`
  (chaves: `compras`/`influenciadoras`/`autoestima`/`nada` na Q7;
  `semana`/`quatroSemanas`/`trimestre`/`semPressa` na Q8; `s1`..`s4` por
  persona na situação). `Q7`/`Q8`/`Espelho` gravam a chave; a leitura do Pico
  (`pico.leitura.*`) e o prompt do diagnóstico (`proposta.ts`, nova
  `situacaoLegivel()` espelhando `PALAVRA_LEGIVEL`) resolvem a chave de volta
  pro texto na hora de mostrar/enviar ao modelo — sem isso o prompt teria
  passado a receber "s1" no lugar da frase. `"outro"` como sentinela não
  mudou. `indiceOpcao` (Q8/`CenaMarcoPrazo`) já era genérico e não precisou de
  ajuste.

Verificado: `npx tsc --noEmit` limpo, 144/144 testes (`npx vitest run`), e
fluxo completo no dev server (nome → espelho → situação → q3 → medida →
futuro → q7 → q8 → q9 → gate → pico) conferido tela a tela, sem erro de
console nem chave de tradução faltando. Fora de escopo desta rodada: A51 (o
modelo não recebe q7/q8 no prompt — só a situação foi corrigida) e o resto da
Fase 0 do plano (bugs de `q7Outro`, "Nunca tentei" virando "tentou").

## 22/09/2026 — Protótipo da agulha (decisão 6 do §4) e passo atrás pra holding

Depois da Fase 0, o Willian aprovou um protótipo descartável (Claude Artifact,
canvas com dois quadros: "Hoje" vs. "Proposta B") comparando a agulha do
`TrilhoDeGiz` como está (9px, faixa de 24px na borda, fora da coluna de
leitura) contra o remédio da lente `taste` no achado A10 (agulha maior,
14px/28px, sai da borda e desliza até a altura da resposta tocada, 700ms na
mesma curva do código real). **Decisão 6 do §4 fechada: agulha, Proposta B.**
Nada disso entrou no código — é só decisão de design registrada.

**Na sequência, o Willian pediu um passo atrás na estratégia inteira.**
Renilza não é uma consultoria com uma esteira — é uma holding com 3 empresas
(Imagem, Posicionamento, Estética), cada uma com nomenclatura e esteira
próprias, e alto ticket de cada vertente trancado atrás de 1–2 certificações
anteriores da mesma vertente (referência: modelo de certificação da Renata
França). O Prisma (nunca vendido) foi desmembrado: a parte de imagem pura
migra pra Imagem, identidade/posicionamento/mercado migra pra Posicionamento,
a versão em turma vira a certificação de topo de Estética. Planejamento
completo, pronto pra auditoria, em `docs/holding/planejamento-holding-3-vertentes.md`.
A esteira decidida em 20–22/09 (`docs/oferta/`) não foi apagada — continua
como inventário de produtos/preços já negociados, mas a decisão de qual
produto pertence a qual empresa passa a vir de `docs/holding/`.

**Também confirmado:** o Tailor (quiz) vai servir a holding inteira com um
questionário só, mas com arquitetura nova — a primeira pergunta decide a
vertente (Imagem/Posicionamento/Estética), e todas as perguntas seguintes
ramificam e aprofundam só naquela vertente. O problema apontado: hoje a fase
final do quiz ainda mistura três coisas distintas na mesma pergunta genérica;
isso precisa parar. O desenho pergunta a pergunta dessa ramificação fica pra
depois — depende da esteira de cada vertente estar fechada primeiro. Nada
implementado ainda.

## 22/09/2026 — Duas rodadas de auditoria cruzada na holding, consolidadas

O planejamento da holding (entrada anterior) rodou duas rodadas de auditoria
independente em três ferramentas (Claude, Codex, Antigravity), via prompts
que o Willian colou em cada uma. Rastro do processo, resumido aqui e depois
apagado do repositório pra não deixar 7 arquivos fragmentados em
`docs/holding/` — só o consolidado final (`planejamento-holding-3-vertentes.md`,
reescrito nesta rodada) fica como referência.

**Rodada 1** (prompt de 7 lentes: marca vs. holding, nomenclatura,
desmembramento do Prisma, gate, gaps, Q1, cronograma) — só o Claude entregou
resultado de verdade; Codex devolveu um arquivo antigo sem relação, Antigravity
devolveu o próprio prompt sem resposta. A auditoria do Claude achou 10
problemas reais (Turma e Signature fundidos por engano num produto só, Manual
da Esteticista e Dossiê Digital marcados como aprovados sem nunca terem sido,
Mentoria 360º na vertente errada, gate aplicado a produto por convite, gate
travando o público em dólar sem gateway pra cobrar, "Certificação" liberada
por compra contradizendo o Princípio 1 do `PRODUCT.md`, dois produtos herdando
o preço cheio do mesmo Prisma, prazo de novembro não recalculado, nomes de
nível colidindo com nome de produto em Estética) — **mas também reverteu duas
decisões que não eram erro, eram instrução direta do Willian**: desfez o
desmembramento do Prisma e desfez a Q1 como seletor explícito de vertente,
sem ter esse contexto.

**Rodada 2** — prompt reescrito travando essas duas decisões como premissa
("auditar como executar, não se deve existir") e mandando reavaliar os outros
8 achados. As três ferramentas entregaram resultado desta vez. Convergência
forte: Prisma desmembrado sem duplicar preço (Posicionamento herda o preço
cheio do Completo, R$ 9.997→11.997/US$ 8.500→11.000; Imagem ancora no degrau
do Essencial, R$ 6.997/US$ 4.500); Q1 vira 3 cenas de dor na tela 2, sem
nomear a vertente pra visitante; gate fora do escopo de produto por convite;
gate só em BRL no ano 1. Divergências reais entre as três: quantas sessões
exatas cada lado do Prisma leva (Claude: 5+8; Codex: 3+6; Antigravity: 4+6);
se a Mentoria 360º pode voltar como produto novo (Codex discordou dos outros
dois); nome dos níveis de Estética (Bancada·Maca·Ateliê × Preparo·Cuidado·
Excelência); data de abertura dos 3 ramos (uma queria tudo em 02/11, outra só
Imagem, a terceira recusou data fixa); e se "nome" continua na tela 1 antes
da Q1 de vertente (só o Codex notou o problema de retomada nisso).

**Achado extra do Codex, sem disputa**: `Da Maca ao Alto Padrão` a R$ 497 e a
R$ 997 não são dois níveis — é o mesmo curso com o preço subindo com o tempo.
Tratá-los como dois níveis (erro que sobreviveu do planejamento original até
a rodada 1) esvaziava o nível de entrada de Estética. Corrigido no
consolidado.

**Resolução final** (critério: a posição mais grounded no conteúdo já escrito
ganha em empate de contagem de sessão; C2 decide a favor de não reviver a
Mentoria 360º; a data mais conservadora vence porque é a única que respeita a
própria estimativa de esforço das ferramentas) está inteira em
`docs/holding/planejamento-holding-3-vertentes.md`, reescrito como decisão
final, não mais rascunho pra auditoria. Nada implementado — segue precisando
da assinatura da Renilza na lista de bloqueio do documento.

## 22/09/2026 — Wireframe de Imagem aprovado e identidade por vertente

O prompt `docs/holding/prompt-layout-tailor.md`, rodado em outra ferramenta
(Manus/gpt-image), gerou o wireframe desktop e mobile que o Willian aprovou
para a vertente Imagem: painel persistente ameixa com wordmark "Tailor",
régua 1–9, stepper NOME → VERTENTE → APROFUNDAMENTO → CONTATO com a agulha
em pausa, carretel e "No final, uma proposta feita para você"; folha marfim
com marcas de corte, "2 de 9", as 4 cenas da tela 2 e CTA ameixa com borda
interna tracejada dourada. Ele pediu identidades totalmente diferentes para
Posicionamento (sugestão: diamante sendo lapidado, luxo, pessoa de sucesso
sendo moldada) e Estética (sugestão: empreendedora crescendo até ter a
clínica).

Workflow multiagente (pesquisa de luxo/lapidação, mercado de estética no
Brasil, persuasão e arquitetura de marca, restrições internas; 3 conceitos
por ramo; banca; crítico adversarial; síntese) produziu
`docs/holding/identidade-por-vertente.md`. Recomendações principais:
Posicionamento vira "Pedra de Toque" (bancada de ensaio de ourivesaria, risco
de ouro na pedra negra, punção de aço como figura que anda); Estética vira
"Ficha do Negócio" (a ficha de atendimento sobre o negócio dela, espátula
cosmética como figura). As sugestões originais foram traduzidas, não
copiadas: figura humana é vetada pelo BRAND-VISUAL §5; "clínica" e "sucesso"
como chegada violam C2; "lapidar/diamante" está saturado em mentorias
(evidência na pesquisa) — o diamante fica só como geometria (chanfro,
octógono). Arquitetura de marca: endossada (Renilza Miranda → Tailor → mundos
sem nome público). Reabre decisões já tomadas: nomes de nível de
Posicionamento e Estética, acento de Posicionamento (âmbar → aço), CTA laranja
único, e registro no §10 do BRAND-VISUAL. Contrastes reconferidos de forma
independente depois da síntese. Nada implementado.

**Mesmo dia, depois:** o Willian mostrou as três pranchas geradas pelo GPT antes da auditoria (Imagem em ameixa e rosa, Posicionamento em preto e cobre com templo, Estética clara com verde e maca) e pediu para validar o que aproveitar. Decidiu também que o quiz é **white label**: "Tailor" sai da interface e a marca é só "Renilza Miranda". Resultado no layout final (Claude Artifact https://claude.ai/artifact/5qCT5sS1XiHmeHDU55wxd5): paletas e elementos das pranchas mantidos, com as regras da marca aplicadas (fontes da casa, sem folhas nem ícones de pessoa, sem slogans de resultado, telas 1–2 compartilhadas no noir, copy aprovada das cenas). Em Posicionamento, ele escolheu seguir a prancha à risca: ícone em cada opção, seleção e botão em cobre-dourado, templo que sobe. Degradê e pílula ficaram como opção comparável na página, registrados como exceção ao §2.4, ao §4 e ao §10.1, pendente de registro pelo §10. "Pedra de Toque" e "Ficha do Negócio" foram arquivadas. Nada implementado.

## 22/09/2026 — Planejamento da holding encerrado

Decisões finais do Willian: (1) o Tailor é um **SaaS white label**; o
desenvolvimento agora é 100% para a Renilza, mas a estrutura nasce
parametrizável por cliente (marca, logo, vertentes, perguntas, faixas,
produtos, textos em configuração, nunca em código). (2) Posicionamento segue
a prancha do GPT com degradê e pílula, só nessa vertente. (3) Logo da Renilza:
"RENILZA MIRANDA" em Bodoni Moda com dourado em degradê, pedido antigo dela.
(4) Níveis de Estética por estágio de carreira: Colaboradora · Autônoma ·
Empresária. (5) Entrada direta por vertente aprovada. Roteiro completo das
três vertentes, gamificação (progresso dotado, figura que anda, recibo por
resposta, conta no meio, reta final, prévia da leitura no gate, prazo depois
do contato) e todas as animações montados no protótipo navegável
(`docs/holding/prototipo/layout-final.html`, artifact
https://claude.ai/artifact/5qCT5sS1XiHmeHDU55wxd5). Handoff em
`docs/holding/HANDOFF-implementacao.md`. A validação independente das pranchas
(2 rodadas, crítico cruzado) foi incorporada na §8 do handoff. Implementação
segue numa sessão separada.

## 23/09/2026 — Limpeza do repo e produtos da holding no vault

O Willian pediu três coisas: deixar no repo só o que é relevante para o
Tailor (SaaS white label, com a Renilza como primeira cliente), tirar os
docs que não servem mais e registrar aqui as decisões do projeto dia a dia.
Primeiro veio uma auditoria só de leitura, em seis grupos (jornada, holding,
oferta, docs da raiz, linha do tempo, higiene do repo), mais uma crítica
adversarial que corrigiu a auditoria onde as duas divergiam. Depois veio a
execução.

**Nada foi apagado do repo nesta rodada.** Sessões paralelas, como a
implementação da holding, ainda leem esses arquivos. Os docs foram
**copiados** para o vault. A remoção do repo vem num passo seguinte, com
commit do Willian, e precisa ser repetida no índice da branch de
implementação (worktree `brave-hermann-42e1da`) antes do merge, senão os
arquivos voltam. Atenção: nenhum arquivo de `docs/` tem commit ainda, estão
só staged. Este histórico e os docs que ficam precisam de commit antes da
remoção, ou o conteúdo só vai existir no vault.

**Mapa caminho antigo → caminho novo.**
- `fontes/` = `C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/holding/fontes/`
  (negócio ainda válido).
- `arquivo/` = `C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/90-arquivo/tailor-docs-2026-09-22/`
  (superado, só preservado).

| Caminho antigo (repo) | Caminho novo |
|---|---|
| `docs/holding/planejamento-holding-3-vertentes.md` | `fontes/planejamento-holding-3-vertentes.md` |
| `docs/renilza-conhecimento.md` | `fontes/renilza-conhecimento.md` |
| `docs/jornada/entrevista-renilza-rodada-1.md` | `fontes/entrevista-renilza-rodada-1.md` |
| `docs/oferta/capacidade-e-projecao.md` | `fontes/capacidade-e-projecao.md` |
| `docs/oferta/cronograma-desenvolvimento.md` | `fontes/cronograma-desenvolvimento.md` |
| `docs/oferta/decisoes-esteira-20-09.md` | `fontes/decisoes-esteira-20-09.md` |
| `docs/oferta/decisoes-esteira-22-09.md` | `fontes/decisoes-esteira-22-09.md` |
| `docs/oferta/esteira-reprecificada-e-meta-1m.md` | `fontes/esteira-reprecificada-e-meta-1m.md` |
| `docs/oferta/portfolios-antigos.md` | `fontes/portfolios-antigos.md` |
| `docs/oferta/proposta-mentoria-estetica-1a1.md` | `fontes/proposta-mentoria-estetica-1a1.md` |
| `docs/jornada/README.md`, `achados-auditoria.md`, `auditoria-e-plano-de-validacao.md`, `feedback-v2-em-validacao.md`, `prompt-*-auditoria.md`, as duas `proposta-jornada-*.md` e `prototipo-jornada-*.svg` | `arquivo/jornada/`, com os mesmos nomes |
| `docs/holding/identidade-por-vertente.md` | `arquivo/holding/identidade-por-vertente.md` |
| `docs/holding/prompt-layout-tailor.md` | `arquivo/holding/prompt-layout-tailor.md` |
| `docs/oferta/correlacao-mentoria-antiga-prisma.md` | `arquivo/oferta/correlacao-mentoria-antiga-prisma.md` |
| `.taste/` (saída do `/taste` sobre o site em produção, 18/09) | `arquivo/taste/` |

Ficam no repo `README.md`, `CLAUDE.md`, `AGENTS.md` (sem edição),
`PRODUCT.md`, `DESIGN.md`, `docs/README.md`, `docs/PENDING.md`, este
histórico, `docs/holding/HANDOFF-implementacao.md` e
`docs/holding/prototipo/layout-final.html`. O protótipo fica sem edição
porque está publicado. `docs/holding/README.md` virou um índice curto.

**IDs de achado.** Os IDs A01–A66 são achados da auditoria de 19/09
(A05, A13, A14, A15, A16, A18, A21, A22, A26, A27, A29, A35, A51 e os
demais). Eles aparecem nos comentários de `src/app/globals.css`,
`src/components/quiz.tsx` e `src/lib/proposta.ts`, no HANDOFF, no
`PRODUCT.md`, no `docs/PENDING.md`, nas entradas de 22/09 e na linha do
tempo deste histórico. Todos resolvem em
`C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/90-arquivo/tailor-docs-2026-09-22/jornada/achados-auditoria.md`.
O veredito do verificador cético (quais foram refutados ou rebaixados) está
em `…/jornada/auditoria-e-plano-de-validacao.md` §3.4. Os IDs D1–D21 resolvem
em `…/holding/identidade-por-vertente.md`.

**O que foi extraído antes de sair.** Nesta mesma limpeza, o conteúdo que
só existia nos docs que saíram foi levado para os docs que ficam:

- **HANDOFF**:
  - passa a apontar para `fontes/` e `arquivo/`;
  - recebe a tabela da esteira por vertente (produto, nível, preço em BRL
    e USD) que alimenta a configuração da Renilza;
  - recebe as regras do motor de proposta: gate só no alto ticket do
    funil, produto por convite nunca ofertado, gate só em BRL no ano 1,
    produto com gate nunca vai ao checkout, degrau sem produto;
  - recebe a abertura escalonada como status por vertente na
    configuração;
  - recebe as regras de copy e proposta por vertente: tom, vocabulário
    proibido, nenhum dado de saúde (LGPD), e a proposta se chama "leitura",
    nunca "certificado";
  - recebe a regra única da mensagem do WhatsApp;
  - recebe os achados abertos que a holding herda, cada um com uma linha
    de descrição e não só o ID;
  - ganha a "Errata do protótipo", com os pontos em que `layout-final.html`
    diverge do decidido.
- **`docs/PENDING.md`**:
  - o checklist de pré-lançamento, que antes só existia no §17 da
    entrevista;
  - D10, D11, D15, D18 e D21 (do D18, só o que falta fora do `PRODUCT.md`,
    que foi corrigido nesta rodada);
  - a tabela faixa → oferta por vertente;
  - gateway e nota fiscal para vender em dólar;
  - os preços em US$ ainda não decididos;
  - o risco aceito de 14/08 (lead adotado por número);
  - o choque entre "Nenhuma dessas" e a salvaguarda do Recomeço;
  - a regra de preço do `CLAUDE.md` contra os preços reais na configuração
    de cliente da branch da holding, como decisão do Willian (a regra não
    mudou);
  - correção dos itens que já estavam resolvidos ou superados (conta
    Asaas, iniciante, francês).
- **`PRODUCT.md`**: as regras de marca e copy que só viviam em
  `renilza-conhecimento.md`:
  - credencial nunca no quiz, uma única vez na proposta, depois da
    devolução;
  - Dubai como repertório ("vive e circula internacionalmente, com base em
    Dubai"), nunca como persona, campo ou ostentação;
  - curso de terceiros citado só como fato, sem sugerir endosso;
  - nunca sugerir clínica própria;
  - as salvaguardas do Recomeço aplicadas a "Nenhuma dessas";
  - os idiomas: inglês principal, PT-BR, sem francês.
- `README.md`, `CLAUDE.md`, `DESIGN.md` e `docs/README.md` foram
  atualizados para o estado de 23/09: holding, white label e os caminhos
  novos.
- **Este histórico**: cabeçalho corrigido, oito entradas reconstituídas do
  git e a linha do tempo das decisões no topo.
- **Vault**: as fichas de produto da holding (H1, Imagem 01–06,
  Posicionamento 01–04 e alguns materiais) citam
  `C:/_ParenteIT/_tailor/docs/...`. **Essas citações não foram reescritas
  nesta rodada**, porque outra sessão ainda escrevia nessas pastas. Enquanto
  os arquivos continuam no repo, elas resolvem. Antes da remoção, precisam
  passar a apontar para `holding/fontes/` (pendência em `docs/PENDING.md`
  §6). As que citam o HANDOFF e o protótipo continuam válidas.
- **Vault, `fontes/portfolios-antigos.md`**: ganhou o §4 com o terceiro PDF
  de portfólio (Consultoria Excelência 360º, nov/2023), que nenhum doc
  registrava.

**Produtos da holding no vault.** Entre 22 e 23/09 foram criadas fichas de
produto em
`C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/holding/`,
cada uma com `produto.md` e pastas de materiais, roteiros e, quando cabe,
sessões:
- `00-holding/sistema-de-selos-e-gate/` (H1: selos, gate e Carta de Nível);
- `imagem/01` a `06`: Sai Pronta em 7 Dias, Consultora de Bolso, Dossiê
  Digital, Dossiê de Imagem 1:1, Consultoria de Imagem Dubai & Europa e
  Alta-Costura;
- `posicionamento/01` a `04`: Alicerce ("A Frase que Te Apresenta"), Jornada
  Valor Percebido, Cúpula 1:1 e Auditoria de Coerência.

Estética ainda não tinha pasta de produto na data desta entrada. Os preços
novos propostos nas fichas, como o do Alicerce, seguem como proposta até a
assinatura da Renilza.

**O que não mudou.** `src/`, o worktree da implementação da holding,
`AGENTS.md` e o protótipo publicado. A regra "nenhum preço fora de
`src/content/config.ts`" também segue como está: mudar a regra é decisão do
Willian, registrada como pendência.

## 23/09/2026 — Diagnóstico da holding implementado (handoff §9, etapas 1–10)

Worktree `claude/brave-hermann-42e1da`. Base: o staged do checkout principal
(`develop`, com `docs/holding/` e a Fase 0), aplicado aqui antes de começar.
Tudo `git add`, nada commitado.

**Quatro decisões do Willian nesta sessão**, pedidas antes de escrever o fluxo:
1. **Inglês sem números até ele definir.** Faixas de investimento e réguas em
   USD ficam `null` na configuração; enquanto forem, nenhum ramo abre em EN e
   `/en/diagnostico` mostra "ainda não abriu neste idioma" com o link para PT.
2. **Regra da oferta:** piso = limite inferior da faixa; em "Até X" o piso é
   X. Entre os produtos da vertente que cabem, o mais alto. Preços em negrito
   do planejamento (20–22/09) entram na configuração só como referência da
   regra; pendentes (Alta-Costura, Dossiê Digital) ficam sem preço e nunca
   são ofertados. Na tela, o preço continua vindo da env de checkout, senão ◆.
3. **Tela final:** o gate gera a proposta `/p/[token]` como antes; "Continuar
   no WhatsApp" abre o número da Renilza com o nome dela e o link já na
   mensagem.
4. **Modo confirmação fica no legado.** `/diagnostico/c/[token]` segue no
   quiz de personas, intocado; `/diagnostico` é o fluxo novo.

**White label — a fronteira.** `src/content/clientes/esquema.ts` (Zod) +
`renilza.ts` + loader `index.ts`. Marca, logo, cores de cada mundo, vertentes,
perguntas, faixas, produtos, preços de referência e todos os textos do
diagnóstico (EN e PT) vêm da configuração; os componentes não têm uma linha de
copy. O esquema recusa na carga: cor fora de `#rrggbb`/`rgba()`/`linear-gradient`
estreito (vira CSS gerado no servidor), texto sem um dos idiomas, ids
repetidos, medida que não cobre os papéis da conta e **ramo com mais de 9
telas até o gate (C1 na carga, além do teste)**. Cliente ativo por
`NEXT_PUBLIC_TAILOR_CLIENTE` (padrão `renilza`). Sem banco nem painel.

**Fluxo** (`src/lib/fluxo.ts`, o mesmo módulo no navegador e no servidor):
nome → cena → 6 perguntas do ramo → gate → prazo → montando → fim. Entrada
direta `/[locale]/v/<vertente>` pula a cena (8 telas). Trocar de cena zera as
respostas do ramo (ids como `frase`/`medida` existem nos três mundos). A
proposta é pedida no gate e montada enquanto ela responde o prazo; o fim só
abre quando ela existe, e erro devolve ao gate sem perder nada.

**Tipos de pergunta genéricos** (`components/holding/perguntas.tsx`):
escolha, aberta (texto + o áudio de sempre, `BotaoAudio`/`useGravador`),
medida (réguas + conta via `calcularGap`, a mesma aritmética da proposta),
palavras, faixa. **Mundos** por `[data-vertente]`: `lib/mundos-css.ts` gera as
custom properties da configuração (e preenche os tokens antigos, para a
proposta e as primitivas herdarem o mundo); `app/holding.css` só lê `--v-*` e
aplica o gesto por `[data-gesto]` (contorno, fio, preenchimento, onda).
**Figuras** do catálogo (`figuras.tsx`): agulha, templo, toque — só
transform/opacity, nascem uma casa atrás e andam (retomada visual).
Desktop ≥1024px: painel persistente (nome, passos, figura grande) + folha.

**Servidor.** `/api/leads` e `/api/proposal` aceitam `versao: 2`; o corpo
antigo segue para o modo confirmação. As respostas são revalidadas contra a
configuração (opção forjada, régua fora da faixa, cena inexistente e ramo
fechado na moeda respondem 400 — conferido por requisição), e o gate exige o
ramo inteiro respondido. Sem migração: frase → `q3_unica_coisa`, medidas nas
colunas de sempre (as geradas do gap valem), prazo → `q8`, faixa → `q9`;
vertente, cena, ramo e "leitura manual" (cena livre) em `respostas_raw`.
`montarPropostaHolding` monta o diagnóstico com as respostas legíveis e a
oferta pela regra acima; `checkout.ts` aceita produto da configuração (env
`PRECO_<ID>_CENTAVOS`, ex. `PRECO_DOSSIE_IMAGEM_CENTAVOS` — de propósito não
herda a env do Dossiê antigo, que guardava outro preço).

**Proposta por vertente:** mesma estrutura, com os tokens do mundo dela,
assinatura da configuração, "Para quem é: <nível>" na oferta, e sem produto
("prefiro não dizer" ou nada cabe) um convite a conversar. **A fita métrica
sai da proposta da holding** (era a esteira antiga Jornada → Dossiê → Prisma,
que a holding desmembrou) e o cross-sell Hotmart também, até existir o
desenho por vertente.

**EN padrão, francês fora:** `routing` (`en`, `pt`), `messages/fr.json`
removido, bandeira e mapas limpos. **Bug achado no caminho:** o matcher do
middleware excluía tudo que começa com `p` para pular `/p/…` — inclusive
`/pt/…`. Enquanto o padrão era pt ninguém via; com en, a página em PT abria
com o seletor em EN. Corrigido para `p/`.

**Retomada** com chave nova (`tailor:holding:v2`), cliente e versão do
roteiro dentro: molde do quiz de personas nunca é lido; versão ou moeda
diferente descarta; resposta com id desconhecido some; pós-gate só pela aba e
com a proposta na mão. WhatsApp e e-mail nunca vão para o disco.

**Verificação.** `tsc --noEmit` limpo; `vitest run` com 36 testes novos
(`fluxo.test.ts`: configuração, troca de vertente, tipos de pergunta, faixa →
oferta, ausência de orçamento, retomada, reduced-motion) e C1 por vertente em
`conselho.test.ts` (escrito antes do roteamento). No dev server, os três
ramos ponta a ponta em 390px (Imagem pela cena, Posicionamento com volta e
troca de vertente, Estética pela entrada direta com "prefiro não dizer"),
cena livre e os três mundos no desktop (1440px), `/en` fechado, modo
confirmação legado 200, vertente inexistente 404. Zero erro de console.

**O que fica para o Willian / a Renilza:**
- Números em USD (faixas e réguas) — o EN abre quando existirem.
- Tradução EN é nossa: leitura nativa antes de abrir. Nomes de produto em EN
  ("Ready in 7 Days"…) são tradução provisória de nome de marca.
- **Revisar as duas frases reescritas** (abaixo) na leitura com a Renilza.
- Fonte Bodoni Moda não está no repo (baixar arquivo pede sua autorização);
  até lá a logo cai nas Didone do sistema (Bodoni MT/Didot/Georgia).
- Copy da proposta, prompt do diagnóstico e "O Método" ainda falam de
  consultoria de imagem e vivem em `messages/` e `prompts/v1.ts` — fora da
  configuração do cliente e deslocados para Posicionamento e Estética. É o
  "desenho da proposta por vertente" do handoff §10.
- Exceções de marca do handoff §6 continuam para registrar no BRAND-VISUAL §10.

**Correções da auditoria A29 e do planejamento (mesmo dia, pedidas por outra
sessão do Willian):** a frase de privacidade do gate e o apoio das réguas
eram desmentidos pelo fluxo real ("sem compartilhar com terceiros" com o
áudio indo para transcrição; "ninguém além de você vê estes números" com o
autosave indo ao servidor). Reescritas para descrever o caminho real, sem
"seus dados estão seguros". A pergunta de local da Estética ganhou a ordem
que não sugere escada (casa das clientes / espaço só meu / sala alugada /
minha casa / mais de um). A cena de Posicionamento volta citada só pela
segunda metade ("…e continuo sendo a última lembrada.", campo
`cena.citacao` na configuração). Placeholder do WhatsApp em PT avisa o "+"
para número de fora do Brasil. Não apliquei, por serem decisão do Willian:
o ajuste da regra "nenhum preço fora de `src/content/config.ts`" no
CLAUDE.md (hoje os preços de referência da holding moram em
`src/content/clientes/renilza.ts`) e o pedido de não deixar `docs/` staged
neste worktree.
