# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 — definido pelo brief do Willian, não delegado. Deploy no Netlify. Persistência em Supabase (Postgres). Geração de texto com provedor trocável por env (`LLM_PROVEDOR`: Anthropic ou Gemini) e fallback automático para o outro (`src/lib/llm.ts`). Transcrição trocável por env (`TRANSCRICAO_PROVEDOR`): Groq `whisper-large-v3-turbo` ou Deepgram `nova-2`. Pagamento por link hospedado do Asaas. i18n com next-intl.

**Idiomas (decidido em 20/09/2026):** inglês é o idioma principal e português (pt-BR) é selecionável; o francês sai. A moeda do inglês é USD, sem conversão: cada idioma tem a sua própria tabela. No código da `develop`, `pt` ainda é o padrão e o francês ainda existe; a troca é o passo 9 do `docs/holding/HANDOFF-implementacao.md`.

Runtime local é Node 20.17.0 (via nvm), não o Node 18.20.8 que responde por padrão no PATH da máquina — Next 16 exige `>=20.9.0`.

## Users

O Tailor é um **SaaS white label** (decisão do Willian, 22/09/2026). O cliente dele é uma marca de serviço — hoje, e por enquanto só, a Renilza Miranda. A interface mostra só a marca do cliente: "Tailor" é o nome interno do produto e **não aparece para a visitante**.

**Usuária primária: a visitante do cliente.** Chega pelo link na bio do Instagram, por um link direto no WhatsApp ou por um link de campanha de uma vertente, quase sempre no celular (91,5% da audiência atual é Brasil mobile). Está sozinha, provavelmente à noite, e vai digitar ou gravar em áudio algo que tem vergonha de admitir em voz alta. O público agora também é internacional: tudo nasce em inglês, com o português como opção.

Ela não escolhe um perfil. Na tela 2, escolhe a **cena** que mais parece com o momento dela, e a cena define a vertente sem nunca nomeá-la (copy exata no `ROTEIRO` do protótipo, HANDOFF §3):

- **Imagem** — o armário cheio e ela sem se reconhecer em quase nada dele.
- **Posicionamento** — entrega mais do que quem aparece mais e continua sendo a última lembrada.
- **Estética** — atende o dia inteiro e ainda sente que só trabalha, sem construir um negócio.
- **"Nenhuma dessas"** — abre um campo livre e segue pelo ramo de Imagem, com o lead marcado para leitura manual.

**O que é fato e o que é hipótese.** A clientela real da Renilza é de profissionais independentes da estética (massagistas, cabeleireiras, manicures) e de venda direta: 2 dos 6 perfis que o negócio quer atingir. Para os outros quatro — carreira/CLT, quem gosta de se vestir bem ou quer começar, recém-separada ou em recomeço, empreendedora em rebranding pessoal e de marca — a copy é **HIPÓTESE** até existirem falas reais e teste com usuárias recrutadas fora da base de estética.

As personas de 13/08 (Patrícia, Camila, Dra. Carla) guiaram o fluxo que ainda roda na `develop`. A "dona de clínica" saiu em 20/09 (a Renilza nunca teve clínica), e as três deram lugar às vertentes em 22/09. As chaves técnicas `patricia`/`camila`/`carla` saem do código com a implementação da holding, que está numa branch ainda sem merge.

**Usuária secundária: o cliente do Tailor** (hoje a Renilza), que recebe o lead qualificado e o link da proposta já montada. Não opera o sistema durante o fluxo — só consome o resultado. Os leads de "Nenhuma dessas" pedem a leitura dela.

## Product Purpose

Transformar uma conversa de diagnóstico que hoje o cliente faz à mão (no caso da Renilza: áudio no WhatsApp, proposta escrita à mão, dias de latência) em um fluxo que devolve à pessoa, em minutos, um diagnóstico que ela reconhece como sendo sobre ela — e uma proposta ancorada nos números que ela mesma declarou.

Sucesso é a pessoa ler o diagnóstico e pensar *"como ela sabe disso?"*. Não é volume de leads: é a taxa de leads que chegam à conversa já convencidos de que foram vistos.

## Positioning

O mecanismo que um concorrente não copia sem copiar a tese: **a proposta é escrita com as palavras da própria pessoa**. O trecho verbatim que ela digitou ou falou volta como citação; a aritmética exibida é feita com os números que ela arrastou nas réguas; a fita métrica é desenhada nas coordenadas dela. Nada é template preenchido. Vale igual nas três vertentes.

Isso obedece à tese comercial da marca ("você é excelente e não é percebida assim") em vez de contradizê-la. A categoria brasileira de consultoria de imagem prova por credencial e volume — muro de logos, "+10.000 alunas", menu com 20+ serviços. Se a prova fosse credencial acumulada, o valor invisível não existiria como fenômeno. A prova desta marca é o ofício e o *durante*.

## Operating Context

- **Quatro pontos de entrada, um motor só:**
  1. quiz frio, pelo link na bio ou por link direto;
  2. o mesmo quiz com áudio nas perguntas abertas (na `develop`, só na Q3; na holding, todo tipo `aberta` aceita texto ou áudio);
  3. modo confirmação — quem manda mensagem ou áudio ao número comercial vira lead pelo webhook da WhatsApp Cloud API e recebe um link exclusivo, onde as respostas já dadas viram cards "foi isso que eu ouvi — confirma?";
  4. entrada direta por vertente — um link de campanha (`/v/<vertente>`) abre na tela 3 daquele mundo, com o nome pedido antes (aprovada em 22/09; conta 8 telas).
- **Em aberto:** o modo confirmação e o webhook do WhatsApp pré-respondem etapas do fluxo antigo (espelho, Q3, gap). Falta decidir se migram para o fluxo por vertente ou ficam no antigo.
- **Ordem de release (condição C7 do Conselho):** frio → confirmação → áudio, entregues em 13/08 (confirmação) e 14/08 (áudio). A promessa do gate só pode dizer "chega em minutos" se a entrega estiver automatizada; caso contrário, "ainda hoje".
- **Áudio sempre passa por provedor externo de transcrição.** O gravado no quiz vai para a Groq ou a Deepgram, sem persistir o arquivo. O do WhatsApp também: o webhook baixa a mídia na Meta e transcreve pelo mesmo provedor (`src/lib/whatsapp-mensagem.ts` → `src/lib/transcricao.ts`). A versão anterior deste arquivo dizia que o áudio do WhatsApp era transcrito localmente; isso é falso desde 14/08/2026.
- A proposta vive numa URL persistente e reabrível, não é a tela final do quiz.
- O cliente é carregado por configuração (`src/content/clientes/<cliente>.ts`, tipada e validada com Zod; HANDOFF §1). Infraestrutura multi-cliente — banco por cliente, painel, domínio por cliente — está fora do escopo agora.
- Custo alvo por lead: US$ 0,04–0,08 com áudio, US$ 0,01–0,03 só-texto.
- **Estado:** o quiz **não está aberto ao público**, e as pendências se resolvem antes de abrir (`docs/PENDING.md`). Os 11 leads no banco (14/08–18/09) são testes internos: não existe amostra de tráfego, a validação é qualitativa e mudar estrutura não custa migração de dado real.

## Capabilities and Constraints

**Confirmado — holding em 3 vertentes (22/09/2026).** Fonte de fluxo e copy do quiz: `docs/holding/HANDOFF-implementacao.md` e o protótipo `docs/holding/prototipo/layout-final.html`.

- **Fluxo:** tela 1, nome (com a logo) → tela 2, cena (define a vertente) → telas 3–8, as 6 perguntas do ramo → tela 9, gate com prévia da leitura, WhatsApp e e-mail opcional → pós-gate, prazo em um toque (pulável, fora da conta de C1) → "montando a leitura" → fim, com o espelho do que ela disse e o CTA "Continuar no WhatsApp". A `develop` ainda roda o fluxo de 13/08 (Espelho → Dor viva → Gap → Futuro → Compromisso → Gate + Pico).
- **Vertentes são dados, não `if`:** a lista vem da configuração do cliente, e um cliente com 2 ou 4 vertentes funciona sem mudar código. Tipos de pergunta genéricos: `escolha`, `aberta`, `medida`, `palavras`, `faixa`.
- **Medida `preco`** (Posicionamento e Estética), a calculadora do gap ao vivo: `gap_unidade = preço_desejado − preço_atual`; `gap_mês = gap_unidade × volume_mensal`; `gap_ano = gap_mês × 12`. **Medida `armario`** (Imagem): percentual do guarda-roupa usado + valor parado em 12 meses.
- **Faixa de investimento é teto:** só se oferta produto cujo preço caiba no piso da faixa marcada, e "Prefiro não dizer" não escolhe produto. As faixas saem do texto e vão para a configuração.
- **Níveis por vertente, só na proposta e nunca no quiz:** Imagem — Primeiro Corte · Ajuste · Alta-Costura; Posicionamento — Alicerce · Estrutura · Cúpula; Estética — Colaboradora · Autônoma · Empresária (estágio de carreira, apresentado como "para quem é", nunca "você vai virar").
- **Proposta em 7 blocos:** Espelho → Diagnóstico → Slider Hoje/Futuro → Fita Métrica da Virada → O Método → Prova → Oferta. A estrutura fica na holding; o desenho por vertente não foi feito (a página recebe os tokens do mundo). Na holding, o texto gerado usa `prompts/v2` (24/09/2026): a voz da autora e a da vertente vêm da configuração do cliente, e "Nenhuma dessas" recebe uma leitura neutra, sem voz de vertente; a voz ainda passa pela leitura em voz alta com a Renilza. O modo confirmação segue no `prompts/v1.ts`.
- **Checkout real desde 13/08:** o Asaas gera um link de pagamento por proposta (checkout hospedado, escopo PCI zero, CPF nunca entra no banco do Tailor); a Hotmart entra como cross-sell no fim da proposta, só quando existem os `HOTMART_LINK_*`. O mock só aparece quando falta o preço na env (`PRECO_*_CENTAVOS`): a rota não cobra nem inventa valor, e a página avisa que é demonstração. O webhook do Asaas está pronto e desligado até a conta de produção ser aprovada. Não existe gateway internacional: nada em USD pode ser cobrado ainda.
- **Gate de certificação da holding** (negócio, não a tela 9): o alto ticket vendido pelo funil exige 1–2 níveis anteriores da mesma vertente; produto por convite fica fora; no ano 1 vale só em BRL/PT. A ficha do vault (`holding/00-holding/sistema-de-selos-e-gate/produto.md`) diz que produto com gate não vai direto ao checkout, e hoje toda proposta recebe link do Asaas — reconciliar antes de ofertar alto ticket pelo funil.

**Preços.** São decisão de negócio e vivem no vault (esteira por vertente em `20-renilza-planejamento/holding/` e nas fontes de `holding/fontes/`). No código, entram só por configuração — hoje `src/content/config.ts` mais as envs `PRECO_*_CENTAVOS` — e nunca em copy nem neste arquivo. A configuração de cliente do HANDOFF §1 vai carregar preço por vertente e por moeda, o que conflita com a regra do `CLAUDE.md` ("nenhum preço fora de `src/content/config.ts`"). Ajustar a regra é decisão do Willian, ainda pendente, e precisa vir antes do merge da holding.

**Condições do Conselho de 13/08/2026 (aprovado 6–0), que são restrição de produto, não sugestão:**
- **C1** — máximo de 9 telas do início ao gate, **por vertente** (a entrada direta conta 8). O teste itera as vertentes do cliente.
- **C2** — proibida qualquer promessa de ganho ("você vai faturar X"). O gap é a aritmética dela, sempre com "com base no que você me contou". A promessa de faturamento ×2 a ×5 da mentoria antiga da Renilza nunca é reaproveitada.
- **C3** — a medida do armário (Imagem; no fluxo antigo, a variante da Patrícia) usa "valor adormecido no seu armário" (esperança), nunca "dinheiro desperdiçado" (vergonha).
- **C4** — fita métrica 100% dinâmica sobre os números declarados; teto ≈ 2–3× o preço atual e nunca abaixo da meta declarada. Proibido exemplo fixo tipo "5k→15k".
- **C5** — a validade de 72h expira de verdade, verificada no servidor. Sem renovação automática de "última chance".
- **C6** — token de proposta com aleatoriedade criptográfica, página com `noindex`, expiração server-side, RLS no Supabase, rate limiting nas rotas de análise, geração e transcrição.
- **C7** — release fatiado, na ordem acima.

**Fora do produto por decisão definitiva:** nenhum campo de @, nenhuma coleta ou menção a Instagram/Facebook, nenhum código preparado para redes sociais, e nenhuma pergunta visual de paleta. A entrada é exclusivamente o questionário.

**LGPD by design:** consentimento explícito antes de gravar ou enviar áudio (com timestamp gravado como evidência); texto curto de privacidade no gate; minimização — só se coleta o que o quiz usa; soft delete; dado financeiro declarado usado somente na geração da proposta. O texto de privacidade ainda não descreve o fluxo real (servidor, modelo de texto, transcrição externa) — achado A29, aberto. Até ser reescrito, "Seus dados estão seguros" não entra (HANDOFF §8).

**"Nenhuma dessas" herda as salvaguardas do recomeço.** Texto livre pode trazer sofrimento. Então: (1) nunca nomear nem diagnosticar estado emocional; (2) nunca atribuir a causa à imagem; (3) sempre existe saída em texto ou áudio — na tela 2, é o próprio "Nenhuma dessas"; (4) o limite de encaminhamento (o que o cliente encaminha, e para quem) é definido antes de abrir ao público; (5) o recomeço não ganha tela nem ramo próprio. Conflito aberto: o HANDOFF §2 manda "Nenhuma dessas" pelo ramo de Imagem, o que esbarra na salvaguarda 2.

**Explicitamente indeciso — não inventar resposta:**
- Gateway internacional para cobrar em USD: quem contrata e até quando.
- A tabela faixa → oferta por vertente. Com a regra do piso, há faixas em que o produto de ticket alto de uma vertente não cabe.
- Se um nível sem produto aparece na proposta (Estética nível 1 não tem produto no ano 1).
- O limite de encaminhamento de "Nenhuma dessas" e o ramo por onde ela segue.
- Onde, na proposta, entra a credencial; e a autorização de uso de marcas de terceiros.
- A voz do texto gerado por vertente, e se o modo confirmação migra para o fluxo novo.
- O desenho da proposta por vertente.
- Se a holding é pessoa jurídica ou só arquitetura de marca — muda quantas marcas e páginas o Tailor serve.
- Marcado "[DECIDIDO]" no planejamento da holding, que vale como recomendação forte e ainda espera a assinatura da Renilza: o desmembramento do Prisma e os preços novos, a abertura escalonada (só Imagem na primeira data), a adaptação da Turma ao público de estética. A copy da tela 2 e do roteiro ainda passa pela leitura em voz alta com ela antes de ir ao ar.

## Brand Commitments

**White label.** A marca é do cliente e vem da configuração: nome, logo, frase de assinatura, cores, ícones, perguntas, faixas, produtos, preços e textos. Nada de marca em código de componente. Nome do produto: **Tailor** (interno, nunca na interface). Primeiro cliente: **Renilza Miranda**, como holding em três vertentes (Imagem, Posicionamento, Estética).

**Para a Renilza**, é vinculante o `20-renilza-planejamento/branding/BRAND-VISUAL.md` v1.1 (08/08/2026), sistema de identidade com protocolo de mudança formal no §10 — alteração de forma passa por aquele arquivo primeiro, depois registra no Notion.

- **Paleta núcleo:** `--noir #141009` (superfície primária), `--ivory #F6EFE1` (texto sobre noir, superfície de leitura longa), `--gold #C9A24C` (acento único), `--terra #9B6A4F` (o calor da paleta).
- **As quatro regras da cor, declaradas inegociáveis:** (1) ouro é tinta rara, teto de 3% da área — botão sólido, bloco e fio de moldura dourados estão vetados; (2) o calor vem do terra, não do ouro; (3) sem gradiente, brilho, metálico ou foil; (4) noir é o padrão, ivory é para ler.
- **Tipografia:** Cormorant Garamond (a voz — títulos, frase-mestra), Jost (o rigor — kicker, label, dado, sempre uppercase com tracking), Hanken Grotesk (a leitura — corpo, formulário). O display *afirma*, Jost *classifica*, Hanken *explica*. Negrito em título está vetado. O §3.1-BIS dizia que o Cormorant sinaliza tier DIY e seria trocado em setembro; não foi. O HANDOFF mantém as três famílias e usa Bodoni Moda só na logo. A troca continua sem decisão, e o display continua atrás de um único token.
- **Forma:** escala de espaço 8/16/24/40/64/104/168, nada fora dela. Cantos de 2px. **Sombra: nenhuma** — profundidade vem de linha e contraste de superfície. Container 680px para leitura, 1120px para vitrine. O filete de abertura de 36×1px em ouro antes de todo kicker é o gesto-assinatura do sistema.
- **Respiro é sinal de segmento:** "se a peça está cheia, ela está barata".
- **Frases oficiais, com tratamento fixo:** "Do valor invisível ao valor percebido" (frase-mestra); "Não basta ser excelente. É preciso ser percebida." (âncora, sempre em duas linhas); "Tradução, não transformação." (filosofia, tratada como carimbo). **Aposentada e proibida:** "É preciso parecer excelente."
- **Telas compartilhadas (1–2):** só a frase-mestra. Nenhum descritor de vertente — nem "Consultoria de Imagem", nem a assinatura atual "Metodologia francesa de imagem", que descreve a vertente Imagem (HANDOFF §8).
- **Vetado no visual (§8):** preço riscado ou "de R$X por R$Y"; countdown, cronômetro, barra de vagas, badge de urgência; pop-up de saída, banner fixo de oferta, chat proativo; ouro em massa, gradiente, metálico, glitter; emoji em peça de marca; selo ™ enquanto o INPI não sair; mais de um CTA acima da dobra; depoimento com cifra de faturamento.

**Exceções assinadas pelo Willian em 22/09/2026** (HANDOFF §6), a registrar no §10 como extensões:
- degradê cobre, pílula e preenchimento com a cor da vertente, **só em Posicionamento**;
- a logo "RENILZA MIRANDA" em Bodoni Moda com dourado em degradê, só na tela 1 e no topo de páginas institucionais;
- canto de 10px nos botões de Imagem e Estética;
- fundo ameixa e mundos com fundo próprio por vertente.

**Desvios já construídos na `develop`, ainda pendentes do §10:** fundo ameixa `#181022` e CTA "pôr do sol" preenchido com canto de 10px (07/09); bandeiras em SVG com cores nacionais no seletor de idioma (11/09); tema claro branco/índigo (12/09, switch visível desde 19/09); pílulas de 999px nos controles do topo (19/09); a camada "atmosfera" (30/08, experimento). Os acentos de persona, as divergências de contraste, o alerta e a penumbra já estão no §10.1 desde 14/08; falta propagar ao Notion. Detalhe em `DESIGN.md`.

**Voz, prova e biografia** (regras que valem para toda copy e para o texto gerado):
- **Credencial fora do quiz.** As certificações internacionais da Renilza são reais e documentadas, mas aparecem uma única vez, na proposta, **depois** da devolução — nunca no quiz (Princípio 1). Para o público estrangeiro, testar se a credencial pesa mais; não assumir.
- **Cursos e escolas de terceiros** entram só como fato, sem sugerir endosso, e só depois de confirmado o uso da marca.
- **Dubai:** a linguagem é sempre "vive e circula internacionalmente, com base em Dubai" — nunca afirmar residência como fato jurídico. Dubai é selo de repertório, nunca ostentação; é história dela, nunca persona da visitante nem campo do quiz.
- **Nomes famosos do portfólio de massagem** são clientes da Renata França, criadora do método, não da Renilza. Nunca viram prova.
- **Oferta antiga não é oferta vigente.** Hoje a Renilza não vende nada; os preços dos portfólios antigos são históricos e não aparecem como oferta.
- **Vocabulário muda por idioma.** "Massagista", "manicure" e afins não se traduzem literalmente. O inglês atual foi traduzido sem revisão nativa: o Willian revisa, e a Renilza aprova o sentido em português (não valida copy em inglês sozinha).

## Evidence on Hand

- `docs/holding/HANDOFF-implementacao.md` e `docs/holding/prototipo/layout-final.html` — autoridade de fluxo, copy, tokens e animação do quiz da holding. O objeto `ROTEIRO` no script do protótipo é a fonte da copy das perguntas.
- `tailor-copy-deck.md` — copy das 3 personas × 3 entradas, os 7 blocos e a fita métrica. Continua a fonte de texto da proposta; para o quiz, vale o `ROTEIRO`.
- `tailor-spec.md` — rotas, schema Supabase, pipeline STT→análise→geração, custo por lead, i18n, riscos.
- `tailor-v0.2.html` — protótipo single-file de 13/08, superado como autoridade de fluxo pelo HANDOFF. Nunca foi autoridade visual: foi construído sem o BRAND-VISUAL v1.1 e viola o §8 em quatro pontos (gradiente na barra de progresso, botão primário preenchido de ouro, emoji na interface, tipografia divergente).
- Esses três em `OneDrive/_millionaire/ParenteMiranda/21-renilza-consultoria-imagem/tailor-proposal-crafter/`.
- **Negócio da Renilza, no vault** (`OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/holding/`): as fichas de produto por vertente (`imagem/`, `posicionamento/`, `00-holding/sistema-de-selos-e-gate/`) e, em `holding/fontes/`, o planejamento da holding (`planejamento-holding-3-vertentes.md`), a base de conhecimento sobre ela, o público e a clientela (`renilza-conhecimento.md`), a entrevista de 20/09 com o checklist para abrir ao público (`entrevista-renilza-rodada-1.md`), as decisões da esteira de 20 e 22/09, a capacidade, o cronograma, os portfólios antigos e a proposta da mentoria de estética.
- **Arquivado** em `OneDrive/_millionaire/ParenteMiranda/90-arquivo/tailor-docs-2026-09-22/`: as propostas de jornada em 3 atos e a auditoria de 19/09 com os achados A01–A66 (`jornada/`), a análise de identidade por vertente e o prompt do layout (`holding/`), a correlação entre a mentoria antiga e o Prisma (`oferta/`).

**Ausências que trabalho futuro não pode fabricar:** não existe nenhum depoimento, número de alunas, case ou foto de antes/depois para este produto. `numeroDepoimentos` é placeholder. Não existem ainda as falas reais de clientes (5–10 frases anonimizadas e autorizadas). A credencial existe, mas só segue as regras acima. O protótipo v0.1 (`atelier-de-propostas.html`) nunca chegou a nenhum ambiente — não há decisão de estética herdada dele que possa ser citada.

## Product Principles

1. **A prova é a devolução, não a credencial.** O que convence é ela reconhecer as próprias palavras de volta. Toda tentação de adicionar logo, contador ou selo contradiz a tese que o produto vende. A credencial real entra uma vez, na proposta, depois da devolução; o selo de nível da holding vive fora do quiz e só existe depois da entrega medida — no quiz, nenhum ponto, medalha ou selo (HANDOFF §4).
2. **A aritmética é dela, e só dela.** Nenhum número exibido pode ser promessa, projeção ou exemplo. Se não veio de um input dela, não aparece.
3. **Respiro é o sinal de preço.** Uma ideia por tela. Densidade é o que separa isto de um funil de quiz genérico.
4. **Confissão precisa de penumbra; decisão precisa de luz.** A escolha de superfície é funcional, não decorativa. Vale como padrão, com duas exceções decididas: o tema claro, para quem o ativa (12/09), e o mundo claro de Estética (22/09). A medição que sustenta a penumbra (taxa de resposta da Q3) ainda não foi feita.
5. **Escassez honesta ou nenhuma.** Se a validade não expira de verdade no servidor, ela não é exibida.

## Accessibility & Inclusion

Mobile-first não negociável — 91,5% da audiência atual é Brasil no celular. Entrelinha nunca abaixo de 1.5 em texto corrido e medida de linha entre 60–75 caracteres, porque legibilidade é literalmente o que a marca vende. Toda pergunta aberta aceita texto **ou** áudio, e o texto transcrito volta sempre editável — a pessoa nunca fica presa no que a transcrição entendeu errado. Alvos de toque confortáveis para uso com uma mão; foco visível usando `--gold-hi` (que vira índigo no tema claro). Textos ≥ 4,5:1 e bordas de componente ≥ 3:1 em todos os mundos. `prefers-reduced-motion` zera toda animação, inclusive as de JS, e nenhuma figura de progresso anima em loop infinito (WCAG 2.2.2).
