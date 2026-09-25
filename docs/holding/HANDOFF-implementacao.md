# Handoff para implementação — quiz da holding em 3 vertentes

**Planejamento encerrado em 22/09/2026.** Este é o documento que a sessão de
implementação segue. **Revisto em 23/09/2026, na limpeza do repo:** o
planejamento e a análise de identidade saíram de `docs/holding/`, e o que a
implementação precisava deles foi trazido para cá (esteira e preços, gate,
abertura escalonada, regras de copy e de movimento, achados abertos). Fontes,
em ordem de precedência:

1. Este arquivo.
2. `docs/holding/prototipo/layout-final.html`: o protótipo navegável aprovado,
   com copy, tokens, ícones SVG e animações exatos. O objeto `ROTEIRO` no
   script de fim de arquivo é a fonte da copy das perguntas. O mesmo arquivo
   está publicado em https://claude.ai/artifact/5qCT5sS1XiHmeHDU55wxd5.
   **Onde o protótipo diverge deste arquivo, vale a errata do §13.**
3. Arquivo, fora do repo (histórico, não vigente):
   `OneDrive/_millionaire/ParenteMiranda/90-arquivo/tailor-docs-2026-09-22/`.
   `holding/identidade-por-vertente.md` é a análise dos mundos por vertente;
   as regras dela que ainda valem estão nos §3, §5, §7 e §11 deste arquivo.
   `jornada/achados-auditoria.md` é a lista completa dos achados da auditoria
   de 19/09: os IDs A01–A66 citados aqui e em comentários de código resolvem
   lá.
4. Negócio, no vault:
   `OneDrive/_millionaire/ParenteMiranda/20-renilza-planejamento/holding/`.
   `fontes/planejamento-holding-3-vertentes.md` tem esteira, produtos, preços,
   gate e cronograma (lá, `[DECIDIDO]` quer dizer recomendação forte, ainda
   sem a assinatura da Renilza). As fichas por produto ficam em `imagem/` e
   `posicionamento/`; a regra do gate e dos selos em
   `00-holding/sistema-de-selos-e-gate/`, e o
   `materiais/08-leitura-do-tailor.md` dessa pasta diz o que a configuração
   declara e como a proposta se comporta diante do gate. Em nome de nível,
   este arquivo vence o planejamento (§7).

**Assinado em 22/09** (vence qualquer fonte que diga outra coisa): white
label; holding em 3 vertentes; os nomes de nível do §7; Posicionamento segue a
prancha (degradê, pílula e preenchimento, só nele); logo em Bodoni com dourado
em degradê; entrada direta `/v/<vertente>`. O que vem do planejamento traz o
status em cada linha.

Regras de sempre do repo (CLAUDE.md): **commits são do Willian**, o agente só
faz `git add`; nenhuma menção a IA; código e comentários em português; Node
20 (`nvm use 20.17.0`); nenhum preço fora da configuração (o texto atual do
CLAUDE.md diz `config.ts`; ver o conflito no §10); rotas validam com Zod e
refazem a validação no servidor; movimento só por `transform` e `opacity`.

---

## 1. Princípio de arquitetura: SaaS white label desde o primeiro commit

Decisão do Willian: o Tailor é um **SaaS white label**. Agora o
desenvolvimento é 100% para a Renilza, mas a estrutura **precisa ser
totalmente parametrizável** para, validada a Renilza, virar produto para
outros clientes sem reescrita.

O que isso significa na prática:

- **Nada de marca em código de componente.** Nome, logo, frase de
  assinatura, cores, ícones, perguntas, faixas, produtos, preços e textos
  saem de uma **configuração de cliente** (`src/content/clientes/renilza.ts`
  ou equivalente), tipada, validada com Zod na carga. Isso conflita com a
  regra do CLAUDE.md "Nenhum preço fora de `src/content/config.ts`" e com o
  teste "nenhum preço real vazou para o catálogo": o caminho (mudar a regra
  para a configuração de cliente, ou o `config.ts` reexportar o `renilza.ts`)
  é decisão do Willian **antes do merge** (§10).
- **Vertentes são dados, não `if`.** O fluxo lê a lista de vertentes do
  cliente: a cena da tela 2, o mundo visual, as 6 perguntas e o gate de
  cada uma. Um cliente com 2 ou 4 vertentes precisa funcionar sem mudar
  código.
- **Status de abertura por vertente.** Cada vertente declara se está aberta
  (quiz completo) ou em captura (tela curta de contato). É o que permite a
  abertura escalonada (§2) sem mexer em código.
- **Níveis, produtos e gate também são dados** (§7). Um nível pode não ter
  produto. Cada produto declara o nível, o canal (`checkout` · `conversa` ·
  `convite`), se tem gate, se conta como nível anterior e o preço por moeda.
  A vertente declara a frase do gate em cada idioma. (Em 24/09 entraram
  `canal`, `gate` e `linkHotmart`; "conta como nível anterior" e a frase do
  gate ainda não estão no esquema.)
- **Mundo visual por vertente via tokens.** Cada vertente declara seus
  tokens (fundo, cartão, tinta, apoio, linha, acento, preenchimento,
  botão, raio do botão, painel), a figura que anda (`agulha` | `templo` |
  `toque`, ou outra registrada no catálogo) e o gesto de seleção (`fio` |
  `preenchimento` | `onda`). O CSS aplica por `[data-vertente]` com custom
  properties.
- **Tipos de pergunta como componentes genéricos:** `escolha` (com ou sem
  ícone), `aberta` (texto + áudio), `medida` (réguas + conta: `armario` ou
  `preco`), `palavras` (2 a 3), `faixa` (investimento). Nenhuma pergunta
  escrita à mão em JSX.
- **Textos por idioma dentro da configuração** (EN principal, PT; francês
  sai, decisão já registrada). Faixas, réguas da medida e telefone também
  variam por idioma e moeda: o protótipo só tem BRL (§10).
- **Voz da proposta por vertente** (§11 e `prompts/v2`, §9 passo 7).
- **Fora do escopo agora:** infraestrutura multi-cliente (banco por
  cliente, painel de administração, domínios por cliente). Só a fronteira
  certa: um cliente carregado por configuração, com a Renilza como o
  primeiro.

## 2. Fluxo (C1: no máximo 9 telas até o gate, por ramo)

| Tela | O que é | Mundo |
|---|---|---|
| 1 | Nome, com a logo | casa (noir #141009) |
| 2 | Cena de reconhecimento, que define a vertente (4 opções; a 4ª é "Nenhuma dessas" → campo livre → segue pelo ramo de Imagem, lead marcado para leitura manual; ver a pendência do §10 sobre a salvaguarda do Recomeço) | casa |
| 3–8 | 6 perguntas do ramo (roteiro abaixo) | da vertente |
| 9 | Gate: prévia da leitura ("a sua leitura já começa assim:" + a frase dela) + WhatsApp + e-mail opcional | da vertente |
| pós-gate | Prazo em um toque (opcional, com "Pular"), fora da conta de C1 | da vertente |
| pós-gate | "Lendo o que você escreveu… / Cruzando com as suas medidas… / Pronto." | da vertente |
| fim | Espelho do que ela disse + CTA "Continuar no WhatsApp" | da vertente |

- **Entrada direta por vertente (aprovada):** uma rota de campanha
  (ex.: `/v/estetica`) abre na tela 3 daquele mundo, com o nome pedido
  antes; conta 8 telas. A rota respeita o status da vertente: vertente em
  captura abre a captura.
- `conselho.test.ts`: C1 passa a iterar as vertentes do cliente e exigir
  ≤ 9 em cada uma. Escrever este teste **antes** do roteamento.
- Retomada (`retomada.ts`) precisa guardar `vertente` e a versão do fluxo;
  moldes salvos no formato antigo não podem ser lidos como escolhas da Q1
  nova (descartar com segurança).
- **"Nenhuma dessas"** aceita texto **ou** áudio (a mesma saída do Recomeço,
  planejamento §8); o protótipo só desenhou o texto. O que ela escrever ou
  gravar chega ao lead e à proposta com a via certa (A47/A50: hoje o campo
  "outro" não tem áudio, o `q7Outro` é aceito pelo Zod e descartado antes da
  proposta, e o `situacaoVia` fica sempre `opcao`).
- **Chaves de i18n da tela 2 nomeadas pela cena, nunca pela vertente**, para
  o nome da vertente não vazar na interface.
- **Abertura escalonada** (decidida na consolidação, falta a assinatura da
  Renilza; planejamento §9 e §10.4):
  - **02/11:** abre só o ramo de Imagem completo. Quem escolhe a cena de
    Posicionamento ou de Estética vê uma tela curta de captura ("ainda
    estamos preparando isso — deixe seu contato") no lugar das telas 3–9. A
    captura grava o contato e a vertente no lead; o desenho dela não foi
    feito.
  - **30/11:** Posicionamento e Estética abrem completos, se cumprirem o
    mesmo critério do ramo de Imagem: copy nativa revisada, QA com usuárias,
    C1 ≤ 9 e o teste de viés e continuidade (D21, §10).

## 3. Roteiro (copy aprovada para protótipo; passa pela leitura com a Renilza antes de ir ao ar)

**Tela 2 (casa):** "{nome}, o que mais parece com o seu momento?"
1. "Tenho o armário cheio, mas não me reconheço em quase nada dele." → Imagem (ícone agulha)
2. "Entrego mais do que muita gente que aparece mais — e continuo sendo a última lembrada." → Posicionamento (ícone templo)
3. "Atendo o dia inteiro, mas ainda parece que estou só trabalhando — não construindo um negócio." → Estética (ícone maca)
4. "Nenhuma dessas." (ícone reticências) → campo livre

**Imagem:** 3 escolha "Quando você abre o armário de manhã, o que acontece
primeiro?" · 4 escolha "Em que momento a sua imagem mais pesa?" · 5 aberta
"Se uma coisa mudasse na forma como você se veste, o que seria?" · 6 medida
armário (% usado; R$ em peças paradas) · 7 palavras "Daqui a seis meses,
quando você sai de uma sala, como quer ser descrita?" · 8 faixa.

**Posicionamento:** 3 escolha com ícones "Quando alguém fala do seu trabalho
para outra pessoa, o que costuma dizer?" · 4 escolha com ícones "Onde você
mais sente que perde espaço hoje?" · 5 aberta "Complete: 'Eu queria ser
lembrada como a pessoa que…'" · 6 medida preço (atual, desejado, volume) ·
7 escolha com ícones "O que mais te trava na hora de se apresentar?" · 8 faixa.

**Estética:** 3 escolha "Quando uma cliente pergunta o preço, o que acontece
do seu lado?" (+ "Marque o que acontece na maioria das vezes, não o que
deveria acontecer.") · 4 escolha "Antes da primeira sessão, o que uma
cliente nova já sabe sobre o seu atendimento?" · 5 escolha "Onde acontecem
os seus atendimentos hoje?" (5 opções, sem ordem de degrau, **nesta ordem**:
"Na casa das minhas clientes." / "Em um espaço só meu." / "Em sala alugada ou
compartilhada." / "Na minha casa, num canto que preparei." / "Em mais de um
desses lugares." — o protótipo as põe em escada, ver §13) · 6 medida preço
· 7 aberta "Se o seu negócio mudasse uma coisa nos próximos meses, qual
seria?" · 8 faixa.

Opções, faixas e prazo: exatamente as do `ROTEIRO`/`PRAZO` no protótipo,
**com a errata do §13**. Faixas de investimento **vão para a configuração**
(achado A14: os limites das faixas viviam em texto, em `messages/pt.json`,
fora do `config.ts`, e "Até R$ 3.500" levava a um produto de R$ 3.500).
Regra do orçamento: é teto; só ofertar produto cujo preço caiba no piso da
faixa marcada; "Prefiro não dizer" não escolhe produto. A tabela vertente ×
faixa → oferta (`OFERTA_POR_VERTENTE_E_FAIXA`) ainda não está definida em
documento nenhum (§10).

**Regras do conjunto de opções e das medidas:**
- **Critério de conjunto de opções**, para todo o `ROTEIRO`: exaustivo
  (cobre os casos reais, com saída quando não cobre), mutuamente exclusivo
  (uma opção não contém a outra) e com procedência declarada (de onde veio
  cada opção: clientela real da Renilza, pesquisa ou hipótese). Opção sem
  procedência é hipótese e passa pela leitura com a Renilza.
- **Teto de 4 opções por decisão** (A54: várias decisões passavam de 4
  opções visíveis). A tela 5 de Estética tem 5: validar com usuárias.
- **A saída para campo livre existe só na tela 2.** Nas telas 3–8, se a copy
  precisar dela, entra como 5ª linha de opção, nunca como link, para não
  criar uma segunda ação na tela (BRAND-VISUAL §8).
- **Medida `preco`** (Posicionamento e Estética): oferecer "não se aplica /
  prefiro não informar", porque nem toda autônoma cobra por atendimento
  (projeto, hora, pacote); ausência nunca vira zero, nem na conta nem na
  proposta.
- **Ancoragem (A13):** a conta dela aparece na tela 6, antes da faixa na tela
  8. O título da faixa nunca cita o valor da conta. Com tráfego, medir a
  distribuição da faixa por quartil da conta.
- **`FAIXA_APOIO`** ("Não é o meu preço. É o seu teto de abertura.") só é
  verdade se o motor aplicar a regra do piso: fica travada por teste (§9,
  passo 10).

## 4. Gamificação (e os limites dela)

| Mecânica | Como |
|---|---|
| Progresso dotado | "2 de 9" já na tela 2; na tela 3, "Sua leitura tem 9 peças. Você já montou 2." |
| Figura que anda | agulha / templo / toque avançam a cada resposta (ver §5) |
| Recibo | uma linha após cada resposta ("Guardei.", "Anotado na sua leitura.", "Guardei. Palavra por palavra." na aberta, "Suas medidas estão na leitura." na medida) |
| Recompensa no meio | a conta dela aparece na tela 6 assim que as réguas são mexidas |
| Reta final | "Faltam duas." na tela 7; "Última pergunta antes da sua leitura." na 8 |
| Curiosidade no gate | prévia com a frase que ela escreveu (ou a cena, se a aberta ficou vazia) |
| Pergunta pós-compromisso | prazo depois do gate, um toque, pulável |
| Trabalho visível | três linhas de "montando a leitura" antes do fim |

Limites que não se negociam: nenhum cronômetro, contagem regressiva ou
escassez (§8); nenhum número que ela não declarou; nenhuma promessa de
resultado (C2); nenhum ponto, medalha ou confete.

- **Contrato de consequência do prazo:** o prazo pós-gate muda só o convite
  final, nunca o diagnóstico nem a gravidade do retrato.
- **Selo só fora do quiz.** O negócio tem selo por nível (vault,
  `sistema-de-selos-e-gate/`), mas ele só sai depois da entrega medida, nunca
  na compra, e nunca aparece no quiz. Dentro do quiz valem os limites acima.

## 5. Mundos visuais

Tokens exatos em `.w-casa`, `.w-img`, `.w-pos`, `.w-est` do protótipo.
Todos os textos ≥ 4,5:1 e bordas de componente ≥ 3:1 (conferido).

| | Imagem | Posicionamento | Estética |
|---|---|---|---|
| Fundo | ameixa #1C1229 | grafite #111315 | marfim #F6EFE1 |
| Acento | rosa-argila #C17B83 | cobre-dourado #C8935E | sálvia densa #4A6D5B |
| Botão | areia #EADBC8, texto ameixa, 10px | degradê #E3B888→#C48A55→#A8733F, texto #111315, pílula | verde #2E4A3B, texto marfim, 10px |
| Seleção | borda rosa + fio que se desenha (scaleX 360ms) | cartão preenchido pelo degradê (camada por opacity 240ms), ícone e texto escuros | borda sálvia + onda do toque (scale+opacity 620ms, 2 anéis) |
| Figura | agulha sobre linha tracejada, translateX 700ms | templo que sobe por partes (8 partes; translateY+opacity 520ms) + barra de progresso cobre | ponto de toque sobre 9 marcas, translateX 700ms + onda |
| Ícones | agulha, linha, alfinete, carretel | templo, aspas, documento, alvo, interrogação, chat, envelope, **tela** (usado no `ROTEIRO` e ausente do sprite: desenhar e registrar, §13) | maca, toque |

**Logo (pedido da Renilza):** "RENILZA MIRANDA" em Bodoni Moda 400,
caixa-alta, tracking .2em, degradê #9C7A30 → #D8B563 → #F1DFA6 → #D8B563 →
#B08A3A; filete dourado abaixo; frase-mestra em Jost. Entra com
opacity+translateY. Só na tela 1 (e no topo de páginas institucionais). Nas
demais telas, "Renilza Miranda" em Cormorant 300. Configurável por cliente.

Tipografia do produto: Cormorant Garamond, Hanken Grotesk, Jost (Bodoni só
na logo). `prefers-reduced-motion` zera toda animação, inclusive as de JS.

**Movimento (vale para os três mundos):**
- A troca de mundo depois da tela 2 é feita por uma camada do mundo novo,
  já montada por baixo, que entra por `opacity`. Nunca por transição de
  `background-color`.
- O acento da vertente só aparece depois da escolha. Nas telas 1–2, a
  seleção usa o traço neutro da casa.
- A cor nunca carrega o estado sozinha: a seleção muda forma e borda (ou
  preenchimento), não só a cor.
- **Nenhuma figura em loop** (A38: a agulha do fluxo antigo respira em loop
  infinito, contra o WCAG 2.2.2). Parada, a figura é estática, sem respirar
  nem pulsar; ela se move uma vez por avanço. Nada anima com campo em foco.
- **A navegação nunca espera animação** (A16: hoje o véu segura a navegação
  por 1,3 s e os blocos da proposta entram com 700 ms + 140 ms por bloco de
  atraso). O toque navega na hora; sem `preventDefault` quando houver tecla
  modificadora.
- O rótulo do stepper é "CENA", nunca "VERTENTE" (D2 da análise de
  identidade: o nome da vertente não aparece na interface).

**Layout desktop** (só nas pranchas do protótipo, `.desk`): grade com painel
de 36% à esquerda e folha à direita. O painel leva "Renilza Miranda" em
Cormorant 300 com a frase-mestra abaixo, o stepper Nome → Cena →
Aprofundamento → Contato, o objeto da vertente e um rodapé em Cormorant
itálico. A folha leva o contador ("3 DE 9"), o kicker, a pergunta e as
opções. Rodapé por vertente:
- Imagem: "No final, uma proposta feita para você."
- Posicionamento: "No final, uma leitura feita com o que você me contar."
- Estética: "No fim, uma proposta feita com o que você me contar."

**Cor de alerta (D10, pendente):** na análise de 22/09, o alerta #C4674E da
casa reprovou sobre o ameixa (4,47:1); a proposta era #D2785E nos fundos
escuros e #A4492F no marfim. O protótipo não define cor de erro por mundo:
definir um token por mundo e conferir contra #1C1229, #111315 e #F6EFE1.

## 6. Exceções à marca que o Willian assinou (registrar no BRAND-VISUAL §10)

Tarefa do Willian no vault (fora do repo): registrar como extensões.
- Degradê cobre, pílula e preenchimento com a cor da vertente, **só em
  Posicionamento** (§2.4 regra 3, §4, §10.1).
- Logo em Bodoni com dourado em degradê (§1.2, §2.4, §3).
- Canto de 10px nos botões de Imagem e Estética (experimento de 07/09).
- Noir ameixa e mundos com fundos próprios por vertente.

## 7. Níveis, esteira e gate (nomes de nível só na proposta, nunca no quiz)

- Imagem: Primeiro Corte · Ajuste · Alta-Costura
- Posicionamento: Alicerce · Estrutura · Cúpula
- Estética: **Colaboradora · Autônoma · Empresária** (estágio de carreira;
  aparecem como "para quem é", nunca "você vai virar")

### 7.1 Esteira por vertente (alimenta a configuração do cliente)

Substitui, para a implementação, o §5 do planejamento (vault,
`holding/fontes/`). É a referência de negócio para preencher a configuração;
no código, os números vivem só nela (§1). **Decidido** = preço fechado entre
14/08 e 22/09. **Proposta** = número de trabalho, falta a assinatura da
Renilza. **—** = não existe.

**Imagem**

| Nível | Produto | BRL | USD | Status | Canal · gate |
|---|---|---|---|---|---|
| Primeiro Corte | Sai Pronta em 7 Dias | R$ 97 | US$ 37 (proposta de 20/09) | BRL decidido | checkout · sem gate |
| Primeiro Corte | Consultora de Bolso | R$ 49/mês no beta (20 vagas) → R$ 69/mês | — | BRL decidido | checkout (assinatura) · sem gate |
| Primeiro Corte | Dossiê Digital | R$ 147 | US$ 39 | proposta (22/09), sem cálculo de custo; ano 1 "se couber" | checkout · sem gate |
| Ajuste | Dossiê de Imagem · 1:1 | R$ 3.500 | — (quem decide em dólar vai para a Consultoria Dubai & Europa) | decidido | conversa · sem gate |
| Ajuste | Consultoria de Imagem · Dubai & Europa | — | US$ 1.800 (sessão) / 2.800 (com compras guiadas) | decidido (22/09); sem gateway internacional, não cobra | conversa (call) · sem gate |
| Alta-Costura | 1:1 de imagem, 5 sessões | R$ 6.997 | US$ 4.500 | proposta: âncora de trabalho, sem cálculo de custo; fora do caminho crítico de novembro | conversa · **com gate** |

**Posicionamento**

| Nível | Produto | BRL | USD | Status | Canal · gate |
|---|---|---|---|---|---|
| Alicerce | *(gap: nenhum produto no ano 1)* | — | — | o vault tem uma ficha PROPOSTA (R$ 147 / US$ 39), não decidida | — |
| Estrutura | Jornada Valor Percebido | R$ 97,90/mês na T1 → R$ 197/mês a partir da T2 | US$ 29/mês (proposta de 20/09) | BRL decidido | checkout (assinatura) · sem gate |
| Cúpula | 1:1 de Posicionamento, 8 sessões (era o Prisma Completo) | R$ 9.997 → 11.997 (sobe com 3 casos publicados) | US$ 8.500 → 11.000 | decidido (20–22/09), âncora sem cálculo de custo | conversa · **com gate** |
| fora da escada | Auditoria de Coerência (B2B) | — | US$ 9–25 mil por escopo | decidido | convite · **nunca ofertada pelo quiz** |
| fora da escada | Assinatura Anual (alumni, cap 10) | — | US$ 7.500 | decidido | convite, depois do alto ticket · **nunca ofertada pelo quiz** |
| fora da escada | Dubai em Pessoa | — | US$ 9–12 mil | decidido, 2027 | convite · **nunca ofertada pelo quiz** |

**Estética**

| Nível | Produto | BRL | USD | Status | Canal · gate |
|---|---|---|---|---|---|
| Colaboradora | *(gap: nenhum produto no ano 1; a iniciante vai para Sai Pronta ou Da Maca, decisão Q10 de 20/09)* | — | — | selo reservado | — |
| Autônoma | Da Maca ao Alto Padrão (um produto só: o preço sobe com o tempo) | R$ 497 → 997 | US$ 197 → 297 (proposta de 20/09) | BRL decidido | checkout · sem gate |
| Empresária · grupo | Turma de Estética, 8 vagas, 8 semanas | R$ 4.997 por vaga (fundadora: 30% em 5 das 8 vagas, R$ 3.498) | US$ 2.200 por vaga (fundadora US$ 1.540) | preço decidido (22/09); adaptação do conteúdo pendente | conversa · **com gate** |
| Empresária · 1:1 | Signature (desafio de oratória de 30 dias como bônus) | a partir de R$ 9.997 | — | BRL decidido (22/09) | conversa · **com gate** |

- Em Estética, o mapeamento nível → produto foi herdado 1 para 1 de Bancada
  · Maca · Ateliê (planejamento §5) e confirmado na ficha do sistema de
  selos do vault. Os nomes estão assinados; o mapeamento ainda não (§10).
- Catálogo congelado até 02/11: nenhum produto novo (Alta-Costura, Alicerce)
  entra antes disso.
- Os preços em USD marcados como proposta nunca foram decididos; os que
  faltam estão no §10.

### 7.2 Gate (regras que afetam a proposta)

Decidido na consolidação (planejamento §6); a regra operacional está no
vault, em `00-holding/sistema-de-selos-e-gate/` (material 08).

- **O gate só vale para o alto ticket vendido pelo funil:** Alta-Costura, 1:1
  de Posicionamento, Turma de Estética e Signature. Exige 1–2 níveis
  anteriores da mesma vertente; na v1, "ter feito" é ter comprado (o
  acompanhamento de conclusão fica para a v2).
- **Produtos por convite** (Auditoria de Coerência, Assinatura Anual, Dubai
  em Pessoa) **nunca são ofertados pelo quiz** e não aparecem na escada.
- **No ano 1, o gate só vale em BRL/PT.** Em USD/EN não há checkout enquanto
  não existir gateway internacional: o público em dólar vai para uma call de
  qualificação (CTA de conversa no WhatsApp).
- **Produto com gate nunca vai ao checkout**, em moeda nenhuma, nem por cupom,
  parâmetro de URL ou rota de campanha. Na proposta ele aparece só como "o
  que vem depois", com a frase do gate e um link de texto para o WhatsApp; o
  CTA principal é sempre um produto sem gate que caiba no piso da faixa.
  **Implementado em 24/09/2026 (PR #10):** `canal` e `gate` no produto
  (`src/content/clientes/esquema.ts`), preenchidos pela tabela do §7.1;
  `escolherOferta` nunca devolve produto com gate ou por convite, e
  `cobrancaDaOferta` (`src/lib/proposta.ts`) só abre checkout para canal
  `checkout`, sem gate e em BRL. Falta mostrar o produto com gate como "o
  que vem depois", com a frase do gate.
- **Nada se chama "Certificação".** Nenhum produto, selo ou texto usa
  "certificação", "certificado", "credencial", "desbloquear", "subir de
  nível" ou "conquista". O selo só sai depois da entrega medida (Raio-X →
  remedição D+90 → Carta de Nível), nunca na compra, e nunca aparece como
  coisa comprada.

### 7.3 Nível sem produto

- A configuração aceita nível sem produto (hoje, Alicerce e Colaboradora).
- Recomendação D15 da análise de identidade, a decidir pelo Willian (§10):
  o nível sem produto não aparece na escada da proposta e o motor nunca o
  indica como próxima etapa.
- Valem já, por C2 (nenhuma promessa de resultado): a proposta devolvida não
  é chamada de nível; nunca dizer que ela "chegou" a um nível por ter feito o
  quiz; em Estética, "espaço só meu" nunca é tratado como meta ou próximo
  passo.

## 8. Da validação independente das pranchas (aceito)

- Nas telas compartilhadas (1–2), nada de "Consultoria de Imagem" nem
  qualquer descritor de uma vertente: só a frase-mestra.
- "Seus dados estão seguros" não entra (alegação sem lastro). **A frase de
  uso de dados que existe hoje também não serve:** o achado A29 mostra que
  "Sem compartilhamento com terceiros" (`gate.privacidade`) e "Ninguém além
  de você vê estes números" (apoio da medida) são desmentidas pelo próprio
  fluxo. O autosave vai ao servidor, a medida vai ao provedor que gera a
  proposta, o áudio vai à Groq, a Renilza lê a leitura, e o gate promete
  envio por WhatsApp sem a Cloud API ativa. **Reescrever a privacidade e o
  apoio da medida descrevendo o fluxo real** (texto a decidir pelo Willian,
  §10).
- Nenhum ícone de pessoa, gráfico de barras, folha ou manequim.
- Um único tom de rosa (#C17B83); nada de segundo rosa salmão.
- **Fotografia** (decidido em 22/09; antes só estava no protótipo): só macro
  real do ofício, fora do quiz, quando existir o banco de fotos de ofício
  (hoje não existe; ver `docs/PENDING.md`). Nenhuma imagem gerada: só
  fotografia real.

## 9. Ordem de trabalho sugerida

1. Configuração de cliente tipada + Zod (`renilza.ts`) e loader; mover para
   lá marca, faixas (por moeda), oferta por vertente e faixa, produtos e
   preços, níveis e gate (§7), status de abertura por vertente (§2) e a voz
   da proposta por vertente (§11). Validar na carga as invariantes do gate:
   nenhum produto com gate tem canal `checkout`; a alternativa oferecida no
   lugar de um produto com gate é da mesma vertente, de nível menor, e
   existe; toda vertente com gate declara a frase do gate em PT e em EN.
2. `quiz-state.ts`: `vertente` em `Respostas`; etapas comuns + etapas por
   vertente vindas da configuração; versão do fluxo; retomada segura.
   **Antes de mexer, o inventário dos consumidores das etapas antigas** (A61:
   mudar as etapas quebra código que depende de `espelho`, `q3` e `gap`):
   - `src/lib/confirmacao.ts:20` (`ETAPAS_CONFIRMAVEIS = ["espelho","q3","gap"]`);
   - `src/lib/whatsapp-mensagem.ts`, que pré-responde a `q3`;
   - `src/components/quiz.tsx:209` (`ETAPAS.indexOf("gap")`, retomada de
     moeda);
   - `src/app/[locale]/diagnostico/c/[token]`, que ainda renderiza o
     `<Quiz>` antigo.

   O inventário termina numa decisão explícita: o modo confirmação (C7/F5,
   confirmação por link) e o webhook do WhatsApp ficam no fluxo antigo ou
   migram para o novo.
3. `conselho.test.ts`: C1 por vertente (antes do roteamento). Os testes de
   regra do gate (passo 10) também entram antes de ligar a oferta por
   vertente.
4. Componentes genéricos por tipo de pergunta; tema por `[data-vertente]`.
   Os componentes nascem com o que o `quiz.tsx` antigo corrigiu na Fase 0
   (22/09) e com o que ficou aberto:
   - **Reaplicar A22, A23 e A26**, corrigidos só no `quiz.tsx` antigo:
     Continuar ancorado acima do teclado por `visualViewport` quando o campo
     de texto está em foco (A22: com o teclado aberto, o Continuar saía do
     alcance); alvos de toque do áudio com 44 px ou mais (A23: os botões de
     áudio tinham ~19 px); na troca de peça, foco no título da peça, com
     `tabIndex=-1` e `focus({preventScroll:true})` (A26: a troca não movia o
     foco nem anunciava nada).
   - **A26 residual + A66:** região `aria-live` com "Peça N de 9"; Continuar
     habilitado nas peças de toque, dizendo o que falta ao ser tocado;
     `progressbar` com `aria-valuetext` em vez de anunciar os 15% fictícios
     da abertura (o progresso visual dotado fica).
   - **A48:** `escolha` nasce como grupo de rádio (`fieldset` e `legend`, ou
     `role="radiogroup"`), não como botões `aria-pressed`.
   - **A24/A25, no componente `aberta`:** estado do áudio anunciado por
     `aria-live`; foco preservado ao consentir; consentimento pedido uma vez,
     com a finalidade, a versão do aviso e a regra de quando pedir de novo
     (hoje o consentimento é pedido em cada campo e o `consentimentoAudioEm`
     é regravado a cada vez); a transcrição se soma ao texto já digitado,
     nunca o substitui.
5. Figuras e gestos (agulha, templo, toque) como componentes do catálogo,
   com as regras de movimento do §5.
6. Gate com prévia; pós-gate (prazo, montando); tela final; tela de captura
   da abertura escalonada (§2).
   - **Mensagem do WhatsApp, uma regra só:** a mensagem pré-preenchida leva
     o código (ou o link `/p/{token}`) da proposta e a próxima etapa. Nunca
     leva o nome, relatos ou números, porque o texto viaja na URL. O resto do
     A35 continua aberto: hoje a mensagem é genérica e a Renilza não é
     avisada do lead.
   - Telefone em formato internacional, não "DDD e número" com "≥ 10
     dígitos" (§13).
   - **A57:** "copiar link" da leitura na tela final (com e-mail opcional e
     sem Cloud API, é o único reenvio garantido) e `enterKeyHint="go"` no
     campo de telefone.
   - O CTA final navega no toque (A16, §5).
   - Em Posicionamento, a tela final e a prévia do gate citam só "…e
     continuo sendo a última lembrada." (§11).
7. `api/leads` e `api/proposal`: aceitar `vertente` e respostas por ramo,
   validar com Zod no servidor; a proposta passa a variar por vertente
   (a página `p/[token]` recebe os tokens do mundo; o desenho dela por
   vertente **não foi feito** — aplicar tokens e manter a estrutura atual).
   Com a estrutura atual mantida, entram junto:
   - **Revalidar tudo no servidor (A64):** hoje só o gate é revalidado;
     `palavras` não tem mínimo nem enum, e a `q3` aceita `.min(1)` contra o
     `> 2` do cliente.
   - **Gate na proposta (§7.2):** Alta-Costura, 1:1 de Posicionamento, Turma
     e Signature nunca geram link de checkout; aparecem só como "o que vem
     depois", com a frase do gate.
   - **`prompts/v2` com voz por vertente e instrução de idioma.** O
     `prompts/v1.ts` fala como "consultora de imagem com metodologia
     francesa", e Posicionamento e Estética sairiam nessa voz. A51: hoje o
     prompt recebe a chave da persona em vez da frase, a situação e as
     palavras vêm só do português, o diagnóstico de reserva é fixo em
     português e não há instrução de idioma, então um lead EN pode receber
     diagnóstico em português. Criar o v2 sem editar o v1, porque
     `VERSAO_PROMPT` é gravada em cada proposta. Guardas do v2: "O que ela já
     tentou nunca é erro dela"; "O prazo dela nunca vira pressa na sua
     escrita"; as regras do §11; diagnóstico de reserva localizado.
   - **A21:** o Bloco 4 fixo promete resultado comercial, contra C2 ("Você
     passa a ser convidada pras salas certas…", "Pacientes chegam
     pré-convencidas…", "Sua clínica vira referência. Preço deixa de ser a
     primeira objeção."). Sai.
   - **A44:** o Bloco 6 mostra "Antes de você, outras ◆ mulheres…"
     (`numeroDepoimentos = '◆'`). Fica escondido até existir material real
     autorizado.
   - **A37:** a `FraseRevelada` e o título palavra por palavra da proposta
     ganham `aria-label` com a frase inteira, spans `aria-hidden` e
     `overflow-wrap:anywhere`.
   - **A34 residual:** o nome nunca é autosalvo (o lead abandonado chega
     anônimo) e `utm_*` é sobrescrito com `null` a cada autosave.
   - **Corte editorial da devolutiva antiga**, enquanto a página mantiver a
     estrutura: garantias ("preço deixa de ser objeção", "convidada para as
     salas certas", "pacientes pré-convencidas"); "Essa quantia já deveria
     ser sua" (diferença aritmética não é receita perdida); "Muita gente
     também sentiu vergonha"; depoimentos, contadores e placeholders ◆; o
     ranking A Percebida → A Inevitável como resultado de compra;
     comparações depreciativas.
   - **Inventário de "clínica/paciente" nas mensagens** (A49), a limpar se o
     Bloco 4 antigo continuar: 7 chaves por idioma — `espelho.cards.carla`,
     `espelho.situacoes.carla` s1–s3, `futuro.sub.carla`,
     `proposta.b4.copy.carla.referencia` e `.inevitavel`.
   - Validade de 72 h real no servidor (C5), exibida como data, nunca como
     contagem regressiva.
8. Rota de entrada direta por vertente, respeitando o status de abertura
   (§2).
9. EN como padrão, remoção do francês. Mesmo com EN padrão, o link do
   Instagram brasileiro continua caindo em pt-BR (detecção por
   `Accept-Language`).
10. Testes: C1 por vertente, troca de vertente sem contaminar respostas,
    retomada, faixa → oferta (com a regra do piso, que é o que torna
    verdadeira a `FAIXA_APOIO`), ausência de orçamento, reduced-motion.
    Testes de regra do gate: nenhum produto com gate tem canal `checkout`; o
    mapa vertente × faixa nunca devolve produto com gate como CTA principal;
    em dólar, nenhum CTA abre checkout enquanto não houver gateway
    internacional; nenhum texto da configuração ou das mensagens contém a
    família "certific"; nenhum nome de nível aparece nas telas 1–9. E mais:
    "Nenhuma dessas" chega ao lead com o texto e a via; a mensagem do
    WhatsApp nunca leva o nome.

Verificação: `npx tsc --noEmit`, `npx vitest run`, e o fluxo inteiro dos 3
ramos no dev server (Browser pane), no celular (390px) e no desktop.
Critérios de aceite (V4 da auditoria de 19/09): nenhuma animação segura
toque, foco ou navegação; nenhum alvo tocável abaixo de 44 px; percorrer
todas as peças só com teclado e só com TalkBack; `prefers-reduced-motion`
cobre também timers e rolagem de JS; áudio sem apagar texto e com estado
anunciado; custo por lead dentro de US$ 0,04–0,08 (PRODUCT.md); teste num
Android intermediário real. Com tráfego, medir o tempo de preenchimento
(A56, §12).

## 10. O que continua pendente (não bloqueia o código)

Nada aqui impede escrever o código; o que trava o merge ou a abertura de um
ramo está dito na linha. O que depende de conta, credencial ou do negócio
fora do Tailor fica em `docs/PENDING.md`.

**Decisões do Willian antes do merge**
- **Regra de preço.** O CLAUDE.md diz "Nenhum preço fora de
  `src/content/config.ts`", e a configuração de cliente (`renilza.ts`) da
  implementação em andamento já grava preços reais em BRL e USD. Mudar a
  regra para a configuração de cliente ou fazer o `config.ts` reexportar o
  `renilza.ts` (§1).
- **Texto de privacidade e do apoio da medida** descrevendo o fluxo real
  (A29, §8).
- **D15:** nível sem produto fora da escada da proposta (§7.3).

**Decisões de produto (Willian e Renilza)**
- **Tabela `OFERTA_POR_VERTENTE_E_FAIXA`**, que não está definida em
  documento nenhum. Com a regra do piso e as faixas do protótipo: o 1:1 de
  Posicionamento (R$ 9.997) só cabe em "Acima de R$ 12.000"; quem marca "De
  R$ 5.000 a R$ 12.000" recebe só a Jornada; o Signature só cabe em "Acima
  de R$ 10.000". Como produto com gate nunca é o CTA principal (§7.2), na v1
  a oferta principal de Posicionamento é sempre a Jornada e a de Estética,
  sempre o Da Maca. Nas faixas "Até R$ …" o piso é zero: a tabela precisa
  dizer o que elas recebem. Falta também a oferta padrão de "Prefiro não
  dizer" (o material 08 do vault propõe uma por vertente).
- **"Nenhuma dessas" → ramo de Imagem × salvaguarda do Recomeço.** A
  salvaguarda manda nunca atribuir a causa à imagem (`renilza-conhecimento.md`
  §6, agora no vault, `holding/fontes/`), e o encaminhamento para Imagem pode
  fazer justamente isso. Decidir junto do limite de encaminhamento: o que
  recebe o lead marcado para leitura manual, e se vale o gate de Imagem.
  Trava a abertura ao público (`docs/PENDING.md` §1), não o código.
- **Mapeamento dos níveis de Estética para produtos** (§7.1).
- **Abertura escalonada** (§2): confirmar com a Renilza que só Imagem entra
  em 02/11.
- **Adaptação da Turma ao público de estética** (exemplos de recepção,
  direct e preço na conversa, não de reunião de honorário).
- **Leitura em voz alta da copy com a Renilza** (tela 2 e roteiro dos 3
  ramos), no roteiro da V1 da auditoria: ler na ordem do fluxo; perguntar
  "você diria isso para uma cliente?"; aprovar, reescrever ou rejeitar cada
  linha; registrar a autoria por linha; nenhuma frase marcada como hipótese
  entra em `messages`. Na mesma leitura: a opção de Estética "O que a amiga
  que indicou contou." usa "indicação", que é vocabulário proibido na
  vertente (§11).
- **Preços novos:** Alta-Costura (R$ 6.997 / US$ 4.500) e Dossiê Digital
  (R$ 147 / US$ 39), âncoras sem cálculo de custo.
- **Preços em USD que faltam para o EN:** Signature; o low ticket inteiro
  (Sai Pronta, Consultora de Bolso, Jornada, Da Maca — as propostas de 20/09
  nunca foram decididas); e o Dossiê Digital, que tem dois números (US$
  97–147 na esteira reprecificada de 20/09, US$ 39 na holding).

**Engenharia sem desenho ainda**
- Faixas de investimento e réguas da medida em USD, e telefone
  internacional, para o EN (o protótipo é só BRL).
- Tela de captura da abertura escalonada (§2).
- Destino da fita e do pico (C4: fita 100% dinâmica sobre os números
  declarados, travada em `conselho.test.ts`). O fluxo novo não tem a fita:
  decidir se ela volta na proposta ou se a C4 muda de objeto.
- Ícone `tela` de Posicionamento, que falta no sprite (§5).
- Cor de alerta por mundo (D10, §5).
- Destino do seletor de tema claro/escuro diante de mundos com fundo próprio
  (D11: tema claro por ramo; o tema claro atual usa o índigo padrão do
  Tailwind, A43).
- Desenho da proposta por vertente e da fita métrica com os níveis por
  vertente.

**Antes de abrir Posicionamento e Estética**
- **Teste de viés da tela 2 e de continuidade** (D21): 5 pessoas por
  vertente, no celular, antes de 30/11. Obrigatório para liberar os ramos.

**Documentação e marca**
- D18 e A31/A52: o `PRODUCT.md` foi corrigido em 23/09 (usuárias por cena e
  vertente, sem "clínica"). Ainda descrevem as personas antigas o copy deck
  §0/§3, o BRAND-VISUAL §10.1 ("precificação de clínica") e o roteirista de
  reels; a lista está no checklist de pré-lançamento de `docs/PENDING.md`.
- Registro das exceções do §6 no BRAND-VISUAL §10 (vault).
- Gateway de pagamento internacional (quem contrata, até quando): sem ele,
  nada em dólar é cobrado.
- Natureza jurídica da holding (pessoa jurídica ou só arquitetura de marca).

## 11. Regras de copy e proposta por vertente

A proposta e o `prompts/v2` passam a variar por vertente. Estas regras vêm
da análise de identidade de 22/09 (arquivada, fonte 3) e valem para o quiz, a
proposta e as mensagens.

**Nas três vertentes**
- Fórmulas fixas: "com base no que você me contou" e "Próxima etapa, pelo
  que você me contou". Todo número vem "com base no que você me contou", e
  nenhum número que ela não declarou aparece.
- O documento devolvido é "leitura" (ou "proposta"), nunca "laudo",
  "ensaio", "certificado" ou "certificação".
- **LGPD:** o quiz nunca pergunta sobre a pele ou a saúde dela ou das
  clientes (dado sensível).
- Nenhuma comparação com terceiros ("quem entrega menos", "resultado
  inferior", "menos preparada"); nenhum prazo que não veio dela ("em 30
  dias"); nenhuma urgência, escassez ou contagem regressiva.
- Apoio de pergunta com escala: "Marque o que acontece na maioria das vezes,
  não o que deveria acontecer." "Não existe resposta melhor aqui" só em
  pergunta descritiva, sem valor de escala.
- Nomes de nível só na proposta (§7).

**Imagem:** mantém a voz atual da marca (`PRODUCT.md`).

**Posicionamento**
- Tom sóbrio e exato, de igual para igual, com verbos de leitura; nunca o
  de uma mentora que promete. As perguntas das telas 3–8 são sempre
  literais, nas palavras do cotidiano dela.
- A proposta e o espelho citam só a segunda metade da cena: "…e continuo
  sendo a última lembrada.", sem a metade comparativa.
- Proibido na interface: lapidar, bruto, diamante, brilhar, joia; folheado,
  falso, genuíno; fogo, forja; destaque, virar referência, ser convidada, ser
  lembrada (como promessa), sucesso, sua melhor versão, valor comprovado,
  falta pouco.
- **No texto gerado (`prompts/v2`, decisão do Willian em 24/09/2026):** uma
  palavra proibida que ela mesma digitou num campo livre pode voltar só
  como citação literal, nunca como afirmação ou promessa da autora. Opção
  do quiz, pergunta e texto do sistema não contam como fala dela. O gate
  pós-saída (`src/lib/verificar-diagnostico.ts`) confere as duas coisas.

**Estética**
- Tom de colega sênior de atendimento: frases curtas, segunda pessoa, verbos
  de trabalho (preparar, organizar, apresentar, cobrar, rever). Vocabulário
  de base: ficha, atendimento, cliente, preço, agenda.
- Proibido: transforme, fature, lote a agenda, vire referência,
  insubstituível, brilhe, sua clínica, alto padrão garantido; "anamnese",
  "retorno", "consulta" e "tempo de pausa" como rótulo; "indicação" no
  sentido de cliente indicada; comparação com outras profissionais;
  pressupor ficha formal ou trabalho com pele; urgência, escassez,
  exclamação.
- "Espaço só meu" nunca é meta nem próximo passo (C2).

## 12. Achados da auditoria de 19/09 que a holding herda

Abertos no código atual. A lista completa está no arquivo (fonte 3). A18 e
A27 perderam o objeto com o fluxo novo; A22, A23 e A26 foram corrigidos na
Fase 0 (22/09), mas só no `quiz.tsx` antigo.

| Achado | O que é | Onde entra |
|---|---|---|
| A13 | O título da faixa ancorava o orçamento no valor da conta dela | §3 |
| A16 | O véu segura a navegação por 1,3 s e os blocos da proposta entram com atraso decorativo | §5, §9 passo 6 |
| A21 | O Bloco 4 fixo da proposta promete resultado comercial (C2) | §9 passo 7 |
| A22 | Com o teclado aberto, o Continuar sai do alcance | §9 passo 4 (reaplicar) |
| A23 | Botões de áudio com ~19 px de altura, abaixo dos 44 px | §9 passo 4 (reaplicar) |
| A24/A25 | Áudio: estado não anunciado, foco perdido, consentimento repetido e regravado; a transcrição apaga o texto digitado | §9 passo 4 |
| A26 + A66 | Troca de peça sem foco nem anúncio, Continuar desabilitado sob o dedo, progressbar anunciando 15% fictício | §9 passo 4 |
| A29 | A copy de privacidade é desmentida pelo próprio fluxo | §8, §10 |
| A34 | O nome nunca é autosalvo e `utm_*` é apagado a cada autosave | §9 passo 7 |
| A35 | Mensagem do WhatsApp genérica, sem o código da proposta, e a Renilza não é avisada do lead | §9 passo 6 |
| A37 | Revelação palavra por palavra sem o texto inteiro acessível | §9 passo 7 |
| A38 | Figura animada em loop infinito (WCAG 2.2.2) | §5 |
| A44 | Prova social sem fonte: o contador ◆ do Bloco 6 | §9 passo 7 |
| A47/A50 | Campos "outro" sem áudio; o texto livre é descartado antes da proposta e a via gravada mente | §2 |
| A48 | Escolha única feita de botões `aria-pressed`, sem grupo de rádio | §9 passo 4 |
| A51 | O prompt recebe a chave da persona e nenhuma instrução de idioma: lead EN pode receber diagnóstico em português | §9 passo 7 |
| A54 | Decisões com mais de 4 opções visíveis | §3 |
| A56 | A tela 1 promete "menos de três minutos" sem medição: medir a mediana e o p75 de `propostas.gerado_em − leads.criado_em` e ajustar a copy se o p75 passar de 3 min | §9, verificação |
| A57 | Sem canal de reenvio garantido: falta "copiar link" e o telefone usa `enterKeyHint="next"` | §9 passo 6 |
| A61 | Mudar as etapas quebra consumidores de código que ninguém mapeou | §9 passo 2 |
| A64 | O servidor só revalida o gate | §9 passo 7 |

## 13. Errata do protótipo

O `layout-final.html` não é editado (está publicado como artifact). Onde ele
diz o que está na coluna do meio, vale a da direita.

| Onde, no protótipo | O que diz | O que vale |
|---|---|---|
| Sistema de Estética (≈ l. 733) | "Níveis: em aberto… a auditoria sugeriu Preparo · Protocolo · Autoria." | Colaboradora · Autônoma · Empresária (o próprio arquivo decide isso na lista "Decidido em 22/09"; §7) |
| Posicionamento, "Preto e cobre" (≈ l. 769) | "o cobre é o âmbar-terra #BC7C4E" | cobre-dourado #C8935E (§5) |
| Rodapé (≈ l. 824) | "Fontes: docs/holding/identidade-por-vertente.md, planejamento-holding-3-vertentes.md" | as fontes 3 e 4 do topo deste arquivo |
| `ROTEIRO`, apoio das 3 medidas | "Ninguém além de você vê estes números." | falso (A29): os números vão ao servidor, ao provedor que gera a proposta e à Renilza. Reescrever (§8) |
| Gate, texto de privacidade | "Seus dados são usados só para montar e te enviar este diagnóstico. Sem spam, sem compartilhar com terceiros." | o áudio vai à Groq (A29). Reescrever descrevendo o fluxo real (§8) |
| `ROTEIRO.estetica`, pergunta `local` | opções em escada (casa das clientes → minha casa → sala → espaço só meu) | a ordem sem degrau do §3 |
| `ROTEIRO.posicionamento`, pergunta `espaco` | `ic: ["doc", "chat", "tela", "aspas"]` | não há `<symbol id="i-tela">` no sprite, então a 3ª opção fica sem ícone: desenhar e registrar |
| Tela final e prévia do gate (`fraseDela()`) | "Você começou pela cena "<cena inteira>"" | em Posicionamento, só "…e continuo sendo a última lembrada." (§11) |
| Gate, WhatsApp | validação "≥ 10 dígitos" e placeholder "DDD e número" | formato internacional; o EN é o idioma principal |
| Seletor "Como na prancha / Na regra da marca" | ferramenta de decisão | vale "prancha" (degradê e pílula, §6); o seletor não vai para o produto |
| `ROTEIRO.estetica`, pergunta `antes` | "O que a amiga que indicou contou." | "indicação" é proibida em Estética (§11): resolver na leitura com a Renilza (§10) |
| Tela 2, "Nenhuma dessas" | só campo de texto | texto ou áudio (§2) |
| Faixas e réguas da medida | só em BRL | versão em USD para o EN, ainda sem desenho (§10) |
