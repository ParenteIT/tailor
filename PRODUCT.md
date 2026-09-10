# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 — definido pelo brief do Willian, não delegado. Deploy no Netlify. Persistência em Supabase (Postgres). Geração de texto via Anthropic Claude com fallback automático para Gemini (modelo por env). Transcrição via Groq Whisper (`whisper-large-v3-turbo`), trocável por Deepgram. i18n com next-intl, `pt` default, `en`/`fr` esqueletados.

Runtime local é Node 20.17.0 (via nvm), não o Node 18.20.8 que responde por padrão no PATH da máquina — Next 16 exige `>=20.9.0`.

## Users

**Usuária primária:** mulher brasileira, 30–55 anos, no celular (91,5% da audiência é Brasil mobile), respondendo um quiz de 3 minutos que chegou pelo link na bio do Instagram da Renilza ou por um link direto no WhatsApp. Ela está sozinha, provavelmente à noite, e vai digitar ou gravar em áudio algo que tem vergonha de admitir em voz alta. Três recortes confirmados (fonte: skill `roteirista-reels-renilza`):

- **Patrícia** — território de vida pessoal/autoestima. Armário lotado, "nada pra vestir", sente-se invisível. Decide por emoção, sensível a preço. Crença a quebrar: "não mereço investir em mim".
- **Camila** — território de carreira/percepção. Vê profissionais menos preparadas cobrando e aparecendo mais. Decide por emoção → razão (indignação → esperança). Crença a quebrar: "qualidade fala por si".
- **Dra. Carla** — território de negócio/precificação. Imagem abaixo do nível que a clínica entrega. Decide por ROI. Crença a quebrar: "preço é só sobre técnica".

**Usuária secundária:** a Renilza, que recebe o lead qualificado e o link da proposta já montada. Ela não opera o sistema durante o fluxo — só consome o resultado.

## Product Purpose

Transformar uma conversa de diagnóstico que hoje a Renilza faz manualmente (áudio no WhatsApp, proposta escrita à mão, dias de latência) em um fluxo que devolve à pessoa, em minutos, um diagnóstico que ela reconhece como sendo sobre ela — e uma proposta ancorada nos números que ela mesma declarou.

Sucesso é a pessoa ler o diagnóstico e pensar *"como ela sabe disso?"*. Não é volume de leads: é a taxa de leads que chegam à conversa já convencidos de que foram vistos.

## Positioning

O mecanismo que um concorrente não copia sem copiar a tese: **a proposta é escrita com as palavras da própria pessoa**. O trecho verbatim que ela digitou ou falou volta como citação; a aritmética exibida é feita com os números que ela arrastou nos sliders; a fita métrica é desenhada nas coordenadas dela. Nada é template preenchido.

Isso obedece à tese comercial da marca ("você é excelente e não é percebida assim") em vez de contradizê-la. A categoria brasileira de consultoria de imagem prova por credencial e volume — muro de logos, "+10.000 alunas", menu com 20+ serviços. Se a prova fosse credencial acumulada, o valor invisível não existiria como fenômeno. A prova desta marca é o ofício e o *durante*.

## Operating Context

- **Três pontos de entrada, um motor só:** (1) quiz frio pelo link na bio; (2) o mesmo quiz com botão de áudio em toda pergunta aberta; (3) modo confirmação — link exclusivo para quem já mandou áudio no WhatsApp, onde as perguntas já respondidas viram cards "foi isso que eu ouvi — confirma?".
- **Ordem de release (condição C7 do Conselho):** frio → confirmação → áudio. A promessa do gate só pode dizer "chega em minutos" se a entrega estiver automatizada; caso contrário, "ainda hoje".
- Áudio gravado dentro do quiz vai para Groq. Áudio de WhatsApp é transcrito **localmente** pela ferramenta que o Willian já usa e nunca sobe para provedor externo — nesse caminho o pipeline de produção só recebe texto pronto.
- A proposta vive numa URL persistente e reabrível, não é a tela final do quiz.
- Custo alvo por lead: US$ 0,04–0,08 com áudio, US$ 0,01–0,03 só-texto.

## Capabilities and Constraints

**Confirmado:**
- Fluxo de 6 etapas — Espelho → Dor viva → Gap → Futuro → Compromisso → Gate + Pico.
- Calculadora do gap ao vivo: `gap_unidade = preço_desejado − preço_atual`; `gap_mês = gap_unidade × volume_mensal`; `gap_ano = gap_mês × 12`. Variante Patrícia não usa precificação: percentual do guarda-roupa usado + valor parado em 12 meses.
- Proposta em 7 blocos: Espelho → Diagnóstico → Slider Hoje/Futuro → Fita Métrica da Virada → O Método → Prova → Oferta.
- Checkout é **mock**, sem integração real de pagamento. Todo valor de oferta vive em variáveis centralizadas.

**Condições do Conselho de 13/08/2026 (aprovado 6–0), que são restrição de produto, não sugestão:**
- **C1** — máximo de 9 telas do início ao gate.
- **C2** — proibida qualquer promessa de ganho ("você vai faturar X"). O gap é a aritmética dela, sempre com "com base no que você me contou".
- **C3** — a variante financeira da Patrícia usa "valor adormecido no seu armário" (esperança), nunca "dinheiro desperdiçado" (vergonha).
- **C4** — fita métrica 100% dinâmica sobre os números declarados; teto ≈ 2–3× o preço atual e nunca abaixo da meta declarada. Proibido exemplo fixo tipo "5k→15k".
- **C5** — a validade de 72h expira de verdade, verificada no servidor. Sem renovação automática de "última chance".
- **C6** — token de proposta com aleatoriedade criptográfica, página com `noindex`, expiração server-side, RLS no Supabase, rate limiting nas rotas de IA.
- **C7** — release fatiado, na ordem acima.

**Fora do produto por decisão definitiva:** nenhum campo de @, nenhuma coleta ou menção a Instagram/Facebook, nenhum código preparado para redes sociais, e nenhuma pergunta visual de paleta. A entrada é exclusivamente o questionário.

**LGPD by design:** consentimento explícito antes de gravar ou enviar áudio (com timestamp gravado como evidência); texto curto de privacidade no gate; minimização — só se coleta o que o quiz usa; soft delete; dado financeiro declarado usado somente na geração da proposta.

**Explicitamente indeciso — não inventar resposta:**
- Qual gateway de checkout real quando sair do mock. O kickoff descreve "Hotmart mantém Jornada + Círculo; consultoria em checkout próprio", mas conflita com a decisão ✅ Confirmada de Kiwify para os níveis 0–2 (15/07) e com a divisão Kiwify×Hotmart×Skool ⏳ Pendente desde 24/07.
- A Fita Métrica usa a escada de 3 degraus da skill de reels (Jornada → Consultoria → Círculo). A escada vigente do rebranding de 06/08 tem 6 degraus e **O Círculo hoje é o degrau mais barato** (R$29,90/mês), não o topo. Mantida como jornada de identidade/pertencimento, não como ranking de preço — precisa validação da Renilza.
- Em qual moeda mostrar a calculadora do gap para lead que responde em EN/FR.
- Todos os preços da Renilza. Nenhum número real existe ainda.

## Brand Commitments

Vinculante: `20-renilza-planejamento/branding/BRAND-VISUAL.md` v1.1 (08/08/2026), sistema de identidade com protocolo de mudança formal no §10 — alteração de forma passa por aquele arquivo primeiro, depois registra no Notion.

- **Paleta núcleo:** `--noir #141009` (superfície primária), `--ivory #F6EFE1` (texto sobre noir, superfície de leitura longa), `--gold #C9A24C` (acento único), `--terra #9B6A4F` (o calor da paleta).
- **As quatro regras da cor, declaradas inegociáveis:** (1) ouro é tinta rara, teto de 3% da área — botão sólido, bloco e fio de moldura dourados estão vetados; (2) o calor vem do terra, não do ouro; (3) sem gradiente, brilho, metálico ou foil; (4) noir é o padrão, ivory é para ler.
- **Tipografia:** Cormorant Garamond (a voz — títulos, frase-mestra), Jost (o rigor — kicker, label, dado, sempre uppercase com tracking), Hanken Grotesk (a leitura — corpo, formulário). O display *afirma*, Jost *classifica*, Hanken *explica*. Negrito em título está vetado. O §3.1-BIS registra que Cormorant sinaliza tier DIY e deve ser trocado em setembro — por isso a família de display precisa viver atrás de um único token.
- **Forma:** escala de espaço 8/16/24/40/64/104/168, nada fora dela. Cantos de 2px. **Sombra: nenhuma** — profundidade vem de linha e contraste de superfície. Container 680px para leitura, 1120px para vitrine. O filete de abertura de 36×1px em ouro antes de todo kicker é o gesto-assinatura do sistema.
- **Respiro é sinal de segmento:** "se a peça está cheia, ela está barata".
- **Frases oficiais, com tratamento fixo:** "Do valor invisível ao valor percebido" (frase-mestra); "Não basta ser excelente. É preciso ser percebida." (âncora, sempre em duas linhas); "Tradução, não transformação." (filosofia, tratada como carimbo). **Aposentada e proibida:** "É preciso parecer excelente."
- **Vetado no visual (§8):** preço riscado ou "de R$X por R$Y"; countdown, cronômetro, barra de vagas, badge de urgência; pop-up de saída, banner fixo de oferta, chat proativo; ouro em massa, gradiente, metálico, glitter; emoji em peça de marca; selo ™ enquanto o INPI não sair; mais de um CTA acima da dobra; depoimento com cifra de faturamento.

Nome do produto: **Tailor**. Nome da marca-mãe: **Renilza Miranda** · *Metodologia francesa de imagem*.

## Evidence on Hand

- `tailor-copy-deck.md` — copy completo das 3 personas × 3 entradas, os 7 blocos e a fita métrica. É a fonte de texto 1:1.
- `tailor-spec.md` — rotas, schema Supabase, pipeline STT→análise→geração, custo por lead, i18n, riscos.
- `tailor-v0.2.html` — protótipo single-file funcional. Autoridade sobre estrutura, fluxo, copy e modelo de estado. **Não** é autoridade visual: foi construído sem o BRAND-VISUAL v1.1 e viola o §8 em quatro pontos (gradiente na barra de progresso, botão primário preenchido de ouro, emoji na interface, tipografia divergente).
- Todos em `OneDrive/_millionaire/ParenteMiranda/21-renilza-consultoria-imagem/tailor-proposal-crafter/`.

**Ausências que trabalho futuro não pode fabricar:** não existe nenhum depoimento, número de alunas, case, foto de antes/depois ou credencial disponível para este produto. `numeroDepoimentos` é placeholder. Nenhum preço da Renilza existe. O protótipo v0.1 (`atelier-de-propostas.html`) nunca chegou a nenhum ambiente — não há decisão de estética herdada dele que possa ser citada.

## Product Principles

1. **A prova é a devolução, não a credencial.** O que convence é ela reconhecer as próprias palavras de volta. Toda tentação de adicionar logo, contador ou selo contradiz a tese que o produto vende.
2. **A aritmética é dela, e só dela.** Nenhum número exibido pode ser promessa, projeção ou exemplo. Se não veio de um input dela, não aparece.
3. **Respiro é o sinal de preço.** Uma ideia por tela. Densidade é o que separa isto de um funil de quiz genérico.
4. **Confissão precisa de penumbra; decisão precisa de luz.** A escolha de superfície é funcional, não decorativa.
5. **Escassez honesta ou nenhuma.** Se a validade não expira de verdade no servidor, ela não é exibida.

## Accessibility & Inclusion

Mobile-first não negociável — 91,5% da audiência é Brasil no celular. Entrelinha nunca abaixo de 1.5 em texto corrido e medida de linha entre 60–75 caracteres, porque legibilidade é literalmente o que a marca vende. Toda pergunta aberta aceita texto **ou** áudio, e o texto transcrito volta sempre editável — a pessoa nunca fica presa no que a IA entendeu errado. Alvos de toque confortáveis para uso com uma mão; foco visível usando `--gold-hi`.
