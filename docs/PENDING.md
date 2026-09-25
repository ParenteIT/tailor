# Pendências — Tailor

Lista única do que ainda está em aberto **no Tailor**. Existia espalhado em
três lugares (`README.md`, o fim do log de `CLAUDE.md`, e pendências soltas
dentro de rodadas de `DESIGN.md`) — consolidado aqui em 19/09/2026 para não
ter duas listas divergindo. Em 23/09/2026, na limpeza do repo, as pendências
de **negócio** da Renilza (esteira, preços, gateway, jurídico da holding,
nomes de produto) saíram para o vault; a última seção aponta para onde elas
vivem. Itens já resolvidos foram **removidos** desta lista (o registro de
como foram resolvidos fica no histórico, não aqui).

Ao resolver um item, apague-o daqui e, se valer a pena registrar como foi
resolvido, acrescente uma entrada em `docs/history/CHANGELOG.md`.

Caminhos do vault abaixo são relativos a
`C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/`. Os achados da
auditoria de 19/09 (A01–A66) estão descritos em
`90-arquivo/tailor-docs-2026-09-22/jornada/achados-auditoria.md`; aqui cada
ID vem com a descrição de uma linha.

---

## 1. Depende de conta, credencial ou decisão do Willian/Renilza

Nenhum destes é código. Ordem: o que mais trava a Renilza vender de ponta a
ponta primeiro.

1. **Ativar o webhook do Asaas no painel deles.** Código pronto
   (`src/app/api/webhooks/asaas/route.ts`), desativado de propósito — ativar
   antes da conta nova (CNPJ da Renilza) ser aprovada faz o Asaas desligar a
   fila sozinho. Depende da conta de produção, que é pendência de negócio
   (última seção).
2. **Ligar os preços reais.** Hoje `src/content/config.ts` lê
   `PRECO_*_CENTAVOS` e mostra ◆ onde a env falta. A auditoria de 10/09 achou
   três `PRECO_*_CENTAVOS` no Netlify; a do Dossiê foi gravada em 13/08, antes
   de a esteira v4 (14/08) mudar o preço dele — conferir no painel. Com a
   holding, os preços passam para a configuração do cliente (ver a regra de
   preço no §6); os valores vêm do vault.
3. **Tabela faixa → oferta por vertente** (`OFERTA_POR_VERTENTE_E_FAIXA`, na
   configuração do cliente). Nenhum documento a define. O `OFERTA_POR_FAIXA`
   de `src/content/config.ts` (travado em `conselho.test.ts`) é do fluxo
   antigo, feito para Dossiê/Prisma, e nunca foi confirmado pela Renilza. A
   regra já decidida (HANDOFF §3): a faixa é teto, só se oferta produto cujo
   preço caiba no piso da faixa marcada, e "Prefiro não dizer" não escolhe
   produto. Com essa regra e as faixas do protótipo, o 1:1 de Posicionamento
   só cabe em "Acima de R$ 12.000", quem marca "De R$ 5.000 a R$ 12.000" em
   Posicionamento recebe só a Jornada, e o Signature só cabe em "Acima de
   R$ 10.000". Decidida, a tabela entra no HANDOFF §3 e no teste
   faixa → oferta (HANDOFF §9, passo 10). O mesmo teste garante o apoio da
   tela de faixa ("Não é o meu preço. É o seu teto de abertura."), que só é
   verdade se o motor aplicar o piso.
4. **Degrau sem produto (D15, decisão do Willian).** Recomendação não
   assinada: um nível sem produto não aparece na escada da proposta e o motor
   nunca o indica. De qualquer forma, a configuração precisa aceitar nível
   sem produto. O nível 1 de Estética (Colaboradora) não tem produto no ano
   1: a Q10 (20/09) manda a iniciante para Sai Pronta e Da Maca, e o catálogo
   fica congelado até 02/11. O vault já propõe um produto para o Alicerce
   (`20-renilza-planejamento/holding/posicionamento/01-alicerce/produto.md`,
   em PROPOSTA).
5. **"Nenhuma dessas" × Recomeço.** O HANDOFF §2 manda "Nenhuma dessas"
   (tela 2) → campo livre → ramo de Imagem, com o lead marcado para leitura
   manual. Isso colide com a salvaguarda do Recomeço (decidido em 20/09 como
   contexto provisório dentro de armário/autoestima, não reavaliado na
   holding): "nunca atribuir a causa à imagem"
   (`20-renilza-planejamento/holding/fontes/renilza-conhecimento.md` §6).
   Junto: o **limite de encaminhamento** — o que a Renilza encaminha e para
   quem quando a dor não é de imagem. Decisão dela; bloqueia a abertura.
6. **Texto de privacidade (A29, decisão do Willian).** A copy de privacidade
   é contradita pelo próprio fluxo: "Ninguém além de você vê estes números"
   (`gap.sub`, e o apoio da medida nos três ramos do protótipo) e "Sem
   compartilhamento com terceiros" (`gate.privacidade`), mas o autosave vai
   ao servidor, o gap vai ao provedor de geração de texto e o áudio vai para
   transcrição na Groq; `gate.nota` promete envio por WhatsApp sem Cloud API;
   a frase de descarte do áudio nunca foi verificada. O texto novo descreve o
   fluxo real — e o HANDOFF §8 não pode reaproveitar a frase atual.
7. **Conta WhatsApp Cloud API.** Empresa verificada; o número novo é
   pendência de negócio (o oficial não migra agora — risco de perder
   conversas ativas, decisão registrada no histórico). Do lado do Tailor:
   ligar o fluxo de acionamento quando o número estiver conectado.
8. **Risco aceito em 14/08: lead adotado por número não verificado.**
   `buscarLeadPorWhatsapp` pode adotar um lead do quiz criado com o número de
   outra pessoa. A mitigação (só adotar lead com `confirmation_token` prévio,
   ou verificar o número) é decisão de produto.
9. **Supabase fora do plano gratuito antes de um lançamento real.** O plano
   gratuito pausa depois de ~7 dias sem uso; o workflow
   `supabase-keepalive.yml` (19/09) mitiga, não resolve. Recomendação de
   23/08; a decisão de custo é do Willian.
10. **URL canônica.** `sobmedida.renilzamiranda.com` está no ar com HTTPS
    válido; trocar a URL canônica (`APP_URL`) de
    `tailor-renilza.netlify.app` para ela é mudança em sistema em uso — cabe
    ao Willian confirmar quando quiser.
11. **Deploy automático por branch.** Hoje o deploy é manual
    (`npm run deploy`, sobe o código local de quem roda o comando). Ligar o
    site ao GitHub no painel do Netlify depende do GitHub App ganhar acesso
    ao repo na organização.
12. **Tema claro/escuro diante dos mundos por vertente (D11 e A43).** O
    seletor claro/escuro (commit `c0ae34b`) não combina com mundos de esquema
    fixo — Estética só existe clara. E o tema claro atual usa o índigo padrão
    do Tailwind (`#4f46e5` em `globals.css`), que nenhuma jornada desenhou.
    Decidir se o seletor fica, sai ou passa a valer por vertente.

### Checklist de pré-lançamento

O quiz **não está aberto ao público** (só roda local; os leads do banco são
testes), e nada abre até estes itens fecharem. Veio do §17 de
`20-renilza-planejamento/holding/fontes/entrevista-renilza-rodada-1.md`, sem
o que já foi resolvido ou superado pela holding. Também bloqueiam a
abertura: os itens 3, 5 e 6 acima, a validação do §3 e o idioma do §4.

- **Copy e fonte:**
  - Leitura em voz alta, com a Renilza, da copy da tela 2 e do roteiro dos
    três ramos (HANDOFF §3); depois, registrar no copy deck (§2).
  - **Falas reais:** 5–10 frases anonimizadas e autorizadas (estética e
    venda direta) para tirar a copy de HIPÓTESE. Roteiro pronto para a
    próxima rodada de entrevista: o banco de perguntas das Rodadas 2–5,
    quase todo sem resposta, no prompt da auditoria de 19/09, arquivado em
    `90-arquivo/tailor-docs-2026-09-22/jornada/` (`prompt-*-auditoria.md`).
  - **Bloco 4 da proposta sem promessa de resultado (A21, contra C2).** O
    `pt.json` promete "salas certas", "pacientes pré-convencidas" e "preço
    deixa de ser a primeira objeção". A página `p/[token]` mantém a
    estrutura na holding, então a promessa sobrevive se ninguém tirar.
  - **Prova social sem fonte (A44):** "Muita gente… sentiu vergonha" e o
    contador ◆ do Bloco 6.
  - **Atualizar a fonte de cima para as 3 vertentes (A31/A52, D18).** O
    `PRODUCT.md` foi corrigido em 23/09 (Users por cena e vertente, sem
    "clínica"). Ainda descrevem as personas antigas (Patrícia, Camila e a
    Dra. Carla "da clínica"): o copy deck §0/§3, o `BRAND-VISUAL.md` §10.1
    ("precificação de clínica") e o roteirista de reels
    (`roteirista-reels-renilza`).
- **Integridade (engenharia):**
  - **Ligar o aviso de lead (A35).** O código existe desde 24/09
    (`src/lib/aviso-lead.ts`, chamado no gate): falta criar o webhook
    (Make/n8n/Zapier) que leva ao canal da Renilza, gravar a URL em
    `AVISO_LEAD_URL` no Netlify e acrescentar a env ao `.env.example` (a
    sessão de 24/09 não tinha permissão de ler esse arquivo). O corpo não
    leva nome nem contato, mas leva o link da proposta, que abre tudo: com o
    webhook ligado, o texto de privacidade (item 6) precisa contar esse
    serviço também.
  - **Resíduos de a11y que pedem copy** (sem texto no deck, não inventado):
    o Continuar desabilitado não diz o que falta ao ser tocado (A26);
    "microfone negado" e "falha na transcrição" usam a mesma frase, e não há
    "texto pronto para revisar" depois da transcrição (A24). Também em
    aberto no A24: registrar a versão do aviso de consentimento junto com o
    carimbo. No A25, não há "desfazer" da transcrição (o texto dela nunca é
    apagado, só acrescentado).
  - **Fluxo antigo (modo confirmação, `quiz.tsx`).** Ainda regrava
    `consentimentoAudioEm` e substitui a q3 pela transcrição (A24/A25);
    some quando o modo confirmação migrar para a holding.

---

## 2. Depende do `tailor-copy-deck.md` (vault, fora deste repo)

O deck vive em
`21-renilza-consultoria-imagem/tailor-proposal-crafter/tailor-copy-deck.md`
(o vault é local, no OneDrive, e dá para ler daqui). A conferência 1:1 com
`messages/pt.json` nunca foi feita. Divergem ou nunca foram checadas:

- Rótulos "de 9" nas Peças 6–9 (`peca.q7` etc.), enquanto o fluxo antigo
  estiver no código
- `abertura.corpo` (foi reescrito em 14/08/2026 por achado de auditoria —
  "Seis passos" era uma promessa falsa contra as 9 telas reais — e nunca
  voltou para o deck)
- `q3.recibo`, `futuro.trocar`, `gap.precificacao.semGap`, `q9.tituloSemGap`,
  `gate.enviando1..3`, `retomada.aviso`, `regua.diminuir`/`regua.aumentar`
- A copy do quiz da holding: o `ROTEIRO` de
  `docs/holding/prototipo/layout-final.html` entra no deck depois da leitura
  com a Renilza (checklist do §1)

## 3. Verificação e validação ainda não feitas ao vivo

- **Teste de viés da tela 2 e de continuidade (D21), obrigatório antes de
  liberar os ramos.** 5 pessoas por persona, no celular, antes de 30/11.
  Gatilho de recuo: se as pessoas de Posicionamento ou de Estética
  escolherem o armário, ou disserem que o quiz "é de moda", a tela 2 fica
  mais neutra. Ficou mais urgente porque a tela 2 final tem ícones de
  agulha, templo e maca. Recrutar fora da base de estética e pelos contextos
  reais, não por quem já se encaixa na persona (aprovação circular). Limites
  de métrica a respeitar (`gerado_em − criado_em` não é tempo ativo; clique
  no CTA não prova reconhecimento):
  `90-arquivo/tailor-docs-2026-09-22/jornada/feedback-v2-em-validacao.md`.
- **A22 — o Continuar ancorado por `visualViewport` com o teclado do
  celular aberto** — no `quiz.tsx` antigo (22/09) e no quiz da holding
  (24/09), mas só dá pra confirmar em aparelho real (iOS in-app browser
  inclusive); não dá pra simular teclado de software neste ambiente de dev.
- **Atraso decorativo da proposta (resto do A16).** Os blocos de `p/[token]`
  entram com `700 + i×140 ms`; a base de 700 ms existia para esperar o véu,
  que não existe na holding. Rever no desenho da proposta por vertente (§5).
- **`/favicon.ico` responde 404** — pré-existente, o webview do Instagram
  pede esse arquivo; não existe `public/` nem `src/app/icon`.
- **`atmosfera.tsx` no lado ivory da proposta** (`p/[token]`) nunca foi visto
  ao vivo — só revisão de código; confiança alta, baixa prioridade. Se a
  atmosfera sobreviver ao layout da holding: ela fica `display:none` abaixo
  de 900px (invisível para 91,5% do público) e ainda pede registro pelo §10
  do BRAND-VISUAL.

## 4. Idioma e moeda

- **Faixas por moeda na configuração do cliente.** O protótipo só tem faixas
  em BRL; faltam faixas e réguas em USD e telefone internacional para o EN,
  que é o idioma principal. Os valores em USD são decisão de negócio (vault);
  até lá, o EN não mostra número inventado.
- **Revisão do EN pelo Willian** (`messages/en.json` e os textos EN da
  configuração do cliente), com leitura nativa antes de abrir e vocabulário
  por idioma: "massagista" e "manicure" não traduzem literalmente ("massage
  therapist", "nail technician").

## 5. Implementação da holding

A implementação segue `docs/holding/HANDOFF-implementacao.md` numa sessão
separada, na branch da implementação da holding (worktree
`brave-hermann-42e1da`): configuração de cliente
(`src/content/clientes/renilza.ts`), vertentes como dado, C1 por vertente,
`/v/[vertente]`, pós-gate, faixas por moeda, oferta por vertente e faixa. O
que ainda não tem desenho ou decisão (espelha o HANDOFF §10; a ordem de
trabalho está no §9):

- **Desenho da proposta `p/[token]` por vertente** — não feito (HANDOFF §9,
  passo 7, e §10); hoje ela só recebe os tokens do mundo. Inclui a fita
  métrica com os níveis por vertente e o destino da fita/Pico (C4, travada
  em `conselho.test.ts`), que não aparece no fluxo novo.
- **Tela de captura de interesse para Posicionamento e Estética** na
  abertura escalonada (02/11 só Imagem completo; os outros dois ramos em
  30/11). O status por vertente na configuração está no HANDOFF §1 e §2; o
  desenho da tela não foi feito (HANDOFF §10). A abertura escalonada foi
  decidida na consolidação e falta a assinatura da Renilza.
- ~~**Cor de alerta por mundo (D10).**~~ — **feito em 24/09/2026**: campo
  `alerta` no `Mundo`, token `--v-alerta`, `#D2785E` na casa, em Imagem e em
  Posicionamento e `#A4492F` em Estética, travado em `mundos-css.test.ts`
  (≥ 4,5:1 sobre fundo e cartão). Publicado no banco em 25/09 (versão 2
  da linha, alerta nos quatro mundos).
- **Sobras da Fase 0 de 22/09, só no fluxo antigo** (modo confirmação; a
  holding já usa o `prompts/v2`, com idioma pelo locale e reserva
  localizada): o modelo recebe a chave da persona em vez da frase, não
  recebe q7/q8 (A51); o `q7Outro` não chega à proposta (A50); "Nunca tentei
  nada estruturado" aparece no Pico como "você já tinha tentado" (A28: some
  se o Pico não voltar).
- **Voz do diagnóstico (`prompts/v2`, 24/09) — o que falta antes de valer:**
  - Leitura em voz alta, com a Renilza, da voz em `renilza.ts` (`voz` do
    cliente e das três vertentes) e das frases de reserva; ela aprova a
    autenticidade, o Willian a conformidade (C2/C3, fontes).
  - ~~Rodar os fixtures F01–F12 contra o modelo real~~ — feito: rodada 1
    em 24/09 e rodada 2 em 25/09 (27/36; 34/36 no rescore com o gate
    afinado), com a chave num `.env.local` posto pelo Willian. As
    variáveis de modelo são *secretas* no Netlify e o CLI não as devolve
    (`env:get` entrega "No value set…"); nova rodada segue o mesmo
    caminho: `npx tsx --conditions=react-server scripts/avaliar-voz.ts
    <saida.json> 3`.
  - ~~**F03**~~ — feita em 24/09: `posicionamento23set()` em
    `src/lib/voz-fixtures.ts`, com as respostas exatas da proposta 0aca5878
    (sem nome nem contato); o gate reprova o diagnóstico que o v1 gravou
    ("finalmente", "imagem"). "imagem", "corpo" e "cor" entraram nos
    proibidos de Posicionamento.
  - Antes de liberar o EN: fixture em inglês lida por humano, teste de
    naturalidade e de calque, e revisão dos equivalentes EN dos proibidos.
  - "Metodologia francesa" continua no bloco "O método" de Imagem
    (`renilza.ts`) e no PRODUCT.md como assinatura. A auditoria da voz não
    a trata como fato documentado (o que se sustenta é a formação em escola
    francesa); a formulação pública final é da Renilza. Fora do prompt v2.
  - ~~`npm run sync:tenant -- renilza` depois do merge~~ — a voz está no
    banco desde 25/09 (versão 2). Os proibidos novos de Estética da rodada
    2 pedem outro sync depois do merge; até lá, a linha do banco ainda não
    os tem.

## 6. Higiene do repo e merge da branch da holding

- **Inglês da holding fechado até existirem números em USD** (decisão do Willian, 23/09): faixas de investimento e réguas por vertente ficam `null` em `src/content/clientes/renilza.ts`; enquanto forem, nenhum ramo abre em EN.
- ~~Aplicar a migração `0004_tenants.sql` e publicar a Renilza no banco~~ —
  **feito em 23/09/2026**, pelo Willian: migração colada no SQL Editor do
  painel (o `supabase db push` via CLI bateu duas vezes em problema de rede —
  `EAUTHQUERY` no pooler e depois histórico de migração remoto sem
  correspondência local; nenhum dos dois é específico deste SQL); `npm run
  sync:tenant -- renilza` publicou a linha (versão 1). `SUPABASE_URL`/
  `SUPABASE_SERVICE_ROLE` obtidos via `netlify env:get <nome>` (sem
  `--context`, que devolvia "No value set" para uma env marcada "mesmo valor
  em todos os contextos" — bug/particularidade do CLI, não do Netlify).
  Site conferido no ar depois, sem erro de console.
  **`scripts/sync-tenant.ts` deixou de usar `@supabase/supabase-js`**: o SDK
  monta o cliente de realtime no import e lança "Node.js 20 detected without
  native WebSocket support" rodando fora do runtime do Next — o script fala
  com a API REST do Supabase por HTTP puro agora (mesmo padrão de
  `asaas.ts`/`transcricao.ts`). `src/lib/tenants.ts` continua com o SDK, sem
  problema, porque roda dentro do Next.js/Netlify Functions.
- ~~Regra de preço do `CLAUDE.md` × `renilza.ts`~~ — **resolvido em
  23/09/2026.** A regra virou "preço só na configuração de cliente" (CLAUDE.md
  §"Regras que não se negociam"); `checkout.ts`/`PRECO_*_CENTAVOS` continuam
  existindo, mas só para o fluxo legado de personas, que a holding não usa
  mais. O preço agora é `produto.preco` + `produto.publicado` em
  `src/content/clientes/renilza.ts`, sem env no Netlify.
- **Citações do vault para `docs/` do repo, antes da remoção.** As fichas
  de `20-renilza-planejamento/holding/` (o `produto.md` da H1, de Imagem
  01–06 e de Posicionamento 01–04, e alguns materiais, como páginas de
  vendas; uma busca por `_tailor/docs` e `docs/oferta` nessas pastas acha
  todas) citam `C:/_ParenteIT/_tailor/docs/renilza-conhecimento.md`,
  `docs/holding/planejamento-holding-3-vertentes.md`, `docs/oferta/*` e
  `docs/PENDING.md`. Não foram reescritas em 23/09 porque outra sessão ainda
  escrevia nessas pastas. Antes de remover os arquivos do repo, trocar essas
  citações por `holding/fontes/<arquivo>` (as do HANDOFF, do protótipo e do
  `PENDING.md` continuam válidas).
- **`.mcp.json` (decisão do Willian).** Fora do git; registra só o servidor
  MCP `threejs-devtools-mcp`, sem uso — o projeto não depende de three.js e
  o painel desktop foi feito em SVG. Manter, pôr no `.gitignore` ou remover;
  mudar configuração pede autorização dele.
- **Código morto que depende de decisão** (o resto da lista saiu em 24/09):
  - `/api/analyze` não tem chamador no repo e é endpoint público que gasta
    com geração de texto — decidir se fica;
  - tokens de `globals.css` que nada lê: `--color-line-gold`,
    `--color-noir-3`, `--text-display`, `--text-lead`, `--radius-sheet`,
    `--container-vitrine`. Mapeiam escalas do BRAND-VISUAL (§3.2 e §4),
    então apagar é decisão de design; `--spacing-p7` fica, porque a escala
    `p1..p7` é convenção do repo.
- **Branches locais sem trabalho próprio:** `master` (commit inicial),
  `design-retencao-e-f6` e `whatsapp-direto` (já mergeadas) e
  `feature/dark-light-mode` (o código foi resgatado em `1756e60`). Antes de
  apagar a última, confirmar que as entradas de 15/08, 23/08 e 24/08 do
  `CLAUDE.md` dela estão no CHANGELOG. Apagar é decisão do Willian.
- **`impeccable` em sessão remota.** Instalado só localmente (18/09), fora
  do git de propósito por causa do binário de 14,7 MB. Sessão remota instala
  com `npx impeccable@latest install` no início; lá o `detect` por URL falha
  com `ERR_NAME_NOT_RESOLVED` — usar `detect --json <arquivos>`.

---

**Fora do produto por decisão definitiva** (não é pendência, é escopo
fechado): nenhum campo de @, nenhuma coleta ou menção a Instagram/Facebook,
nenhuma pergunta visual de paleta, nenhuma migração do número oficial de
WhatsApp para o Cloud API por ora.

---

## Pendências de negócio (vivem no vault)

Não são do Tailor e não se resolvem neste repo. Vivem em
`C:/Users/willi/OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/holding/00-HOLDING.md`
(fontes em `holding/fontes/`). Algumas travam itens daqui:

- Conta Asaas de produção no CNPJ da Renilza: a conta nova, criada em 24/08,
  espera a documentação dela para ser aprovada (a recuperação da conta
  antiga, caminho de 13/08, foi superada) — trava a ativação do webhook (§1).
- Número novo de WhatsApp para o Cloud API — trava o acionamento (§1).
- Preços que faltam: a esteira em USD, o low ticket em inglês e os produtos
  novos (Alta-Costura, Dossiê Digital) — travam os preços reais (§1) e as
  faixas em USD (§4).
- Gateway de pagamento internacional (quem contrata e até quando) e nota
  fiscal, no Brasil e na venda em dólar.
- Assinatura da Renilza no que foi decidido na consolidação:
  desmembramento do Prisma, preços, abertura escalonada (02/11 e 30/11).
- Produto por nível em cada vertente e nomes de produto; adaptação da Turma
  para estética; se as 18 aulas do Da Maca já estão gravadas.
- Natureza jurídica da holding; uso de marcas de terceiros (cursos);
  mercado principal em inglês.
- Registro no `BRAND-VISUAL.md` §10 das exceções do HANDOFF §6 e dos desvios
  de 30/08, 07/09, 11/09, 12/09 e 19/09, e a propagação para o Notion que o
  próprio §10 exige.
