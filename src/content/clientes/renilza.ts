import type { z } from "zod";
import type { Cliente } from "./esquema";

/**
 * Renilza Miranda — o primeiro cliente do Tailor. Holding em três vertentes
 * (Imagem, Posicionamento, Estética), decidida em 22/09/2026.
 *
 * Fontes: `docs/holding/HANDOFF-implementacao.md` e o protótipo aprovado
 * `docs/holding/prototipo/layout-final.html` (objetos ROTEIRO, CENAS, PRAZO,
 * RECIBO e as classes .w-casa/.w-img/.w-pos/.w-est). A copy em português é a
 * do protótipo, sem edição; a inglesa é tradução nossa e ainda precisa de
 * leitura nativa antes de abrir.
 *
 * Faixas de investimento e réguas em dólar ficam null de propósito (decisão
 * do Willian, 22/09/2026): não existe número em USD declarado para a esteira,
 * e o produto não exibe número que ninguém declarou. Enquanto forem null, o
 * diagnóstico não abre em inglês.
 *
 * Preços: só entram os decididos em 20–22/09 (a esteira está no HANDOFF
 * §7.1). Os pendentes (Alta-Costura, Dossiê Digital) ficam null e nunca são
 * ofertados. Desde 23/09 o preço daqui é o que a proposta exibe e cobra,
 * sem env de checkout.
 */

const APOIO_ABERTA = {
  pt: "Escreve do seu jeito. É essa frase que eu vou te devolver no final.",
  en: "Write it your way. This is the line I'll hand back to you at the end.",
};
const APOIO_MEDIDA = {
  // A copy do protótipo dizia "Ninguém além de você vê estes números" —
  // falso: vão para o servidor e para a leitura (auditoria A29, 23/09/2026).
  pt: "Arraste até chegar perto do real. É com estes números que a conta da sua leitura é feita.",
  en: "Drag until it's close to real. These are the numbers your reading's math is made with.",
};
const APOIO_FAIXA = {
  pt: "Não é o meu preço. É o seu teto de abertura.",
  en: "It's not my price. It's your opening ceiling.",
};
const KICKER_MEDIDA = { pt: "As suas medidas", en: "Your measurements" };
const KICKER_FAIXA = { pt: "O investimento", en: "The investment" };
const TITULO_FAIXA = {
  pt: "Qual faixa de investimento faz sentido para cuidar disso agora?",
  en: "What investment range makes sense for taking care of this now?",
};
const NAO_DIZER = { pt: "Prefiro não dizer agora", en: "I'd rather not say for now" };
const DESEJADO = { pt: "E quanto ele deveria valer?", en: "And how much should it be worth?" };

const CONTA_PRECO = {
  pt: "Com base no que você me contou: **{unidade}** de diferença em cada atendimento. Pela sua própria agenda, {mes} por mês. Em doze meses, **{ano}**. A conta é sua: foram os seus números que a fizeram.",
  en: "Based on what you told me: **{unidade}** of difference on each appointment. By your own schedule, {mes} a month. Over twelve months, **{ano}**. The math is yours: your numbers did it.",
};
const CONTA_PRECO_IGUAL = {
  pt: "A sua meta ficou igual ao que você já cobra. Arrasta a segunda medida até onde ela deveria estar.",
  en: "Your target is the same as what you already charge. Drag the second measure to where it should be.",
};

export const renilza: z.input<typeof Cliente> = {
  id: "renilza",
  dominio: "sobmedida.renilzamiranda.com",
  dominiosExtra: ["tailor-renilza.netlify.app", "localhost"],
  versaoFluxo: "holding-2026-09-22",
  idiomaPadrao: "en",
  moedaPorIdioma: { en: "USD", pt: "BRL" },

  marca: {
    nome: "Renilza Miranda",
    fraseMestra: {
      pt: "Do valor invisível ao valor percebido",
      en: "From invisible worth to perceived worth",
    },
    logo: {
      degrade: ["#9C7A30", "#D8B563", "#F1DFA6", "#D8B563", "#B08A3A"],
      filete: "#D8B563",
      sub: "#B08A3A",
    },
  },

  contato: { whatsapp: "5511950291364" },

  // Voz do texto gerado (prompts/v2). Sai do "COMO ELA ESCREVE" do v1, sem a
  // tese "não está sendo percebida", que presumia o problema antes de ler as
  // respostas (auditoria da voz, 24/09/2026). Passa pela leitura em voz alta
  // com a Renilza antes de valer como definitiva.
  voz: {
    autora: "Renilza Miranda",
    quemE:
      "Ela parte do que a pessoa já faz e traduz o que aparece nas respostas, sem presumir falta de valor, sem prometer transformação e sem inventar causas.",
    comoEscreve: [
      "Primeira pessoa, direta, sem preâmbulo: \"eu vi\", \"eu li\", \"o que eu vejo aqui\".",
      "Frases curtas. Nada de jargão de coach, nada de \"jornada de autoconhecimento\", nada de \"empoderamento\".",
      "Nomeia a coisa pelo nome, com as palavras que a própria pessoa usou.",
      "Calor sem infantilização: fala com uma adulta que já entende do próprio ofício.",
    ],
  },

  // Telas 1 e 2: o noir oficial do BRAND-VISUAL §2.1, sem cor de vertente.
  casa: {
    esquema: "escuro",
    fundo: "#141009",
    cartao: "#1E1812",
    tinta: "#F6EFE1",
    apoio: "#A79E90",
    linha: "#736A60",
    trilho: "#736A60",
    acento: "#F6EFE1",
    acentoSuave: "rgba(246,239,225,.08)",
    alerta: "#D2785E",
    ouro: "#C9A24C",
    botaoFundo: "#F6EFE1",
    botaoTinta: "#141009",
    raioBotao: 10,
    preenchimento: "#F6EFE1",
    tintaSobrePreenchimento: "#141009",
    painel: "#141009",
    painelTinta: "#F6EFE1",
    painelApoio: "rgba(246,239,225,.62)",
    painelAcento: "#C9A24C",
    gesto: "contorno",
    iconesNasOpcoes: true,
  },

  cenaLivre: {
    texto: { pt: "Nenhuma dessas.", en: "None of these." },
    icone: "pontos",
    segue: "imagem",
  },

  vertentes: [
    {
      id: "imagem",
      voz: {
        papel:
          "Lê a relação dela com o armário e a roupa: peça, cor, forma, ajuste. Mede o que já existe e traduz antes de qualquer compra.",
        tom: [
          "Concreto, com as palavras do armário: peça, cor, forma, ajuste, medir, traduzir.",
          "Nunca \"transformar\" nem \"nova você\": ela não vira outra pessoa.",
        ],
        proibido: [
          { pt: "transformação", en: "transformation" },
          { pt: "transformar", en: "transform" },
          { pt: "nova você", en: "new you" },
          { pt: "melhor versão", en: "best version" },
        ],
      },
      cena: {
        texto: {
          pt: "Tenho o armário cheio, mas não me reconheço em quase nada dele.",
          en: "My wardrobe is full, but I barely recognize myself in any of it.",
        },
        icone: "agulha",
      },
      mundo: {
        esquema: "escuro",
        fundo: "#1C1229",
        cartao: "#27193A",
        tinta: "#F6EFE1",
        apoio: "#B8ABBE",
        linha: "#806C86",
        trilho: "#806C86",
        acento: "#C17B83",
        acentoSuave: "rgba(193,123,131,.12)",
        alerta: "#D2785E",
        ouro: "#C9A24C",
        botaoFundo: "#EADBC8",
        botaoTinta: "#1C1229",
        raioBotao: 10,
        preenchimento: "#C17B83",
        tintaSobrePreenchimento: "#1C1229",
        painel: "#150D20",
        painelTinta: "#F6EFE1",
        painelApoio: "rgba(246,239,225,.62)",
        painelAcento: "#C17B83",
        gesto: "fio",
        iconesNasOpcoes: false,
      },
      figura: "agulha",
      niveis: [
        { pt: "Primeiro Corte", en: "First Cut" },
        { pt: "Ajuste", en: "Fitting" },
        { pt: "Alta-Costura", en: "Haute Couture" },
      ],
      // O texto do copy deck, escrito para a consultoria de imagem.
      metodo: {
        titulo: { pt: "Tradução, não transformação.", en: "Translation, not transformation." },
        corpo: [
          {
            pt: "Consultoria de estilo genérica troca você por outra pessoa: um arquétipo, uma paleta, um manual. A metodologia francesa faz o contrário. Ela lê o que já está ali e traduz. Você não vira outra. Você passa a ser lida como quem você já é.",
            en: "Generic style consulting swaps you for someone else: an archetype, a palette, a manual. The French methodology does the opposite. It reads what's already there and translates it. You don't become someone else. You start being read as who you already are.",
          },
          {
            pt: "Por isso o trabalho começa medindo, não comprando. Primeiro a leitura, depois a linguagem, e só então a peça.",
            en: "That's why the work starts by measuring, not buying. First the reading, then the language, and only then the piece.",
          },
        ],
      },
      perguntas: [
        {
          id: "armario",
          tipo: "escolha",
          kicker: { pt: "O seu armário hoje", en: "Your wardrobe today" },
          titulo: {
            pt: "Quando você abre o armário de manhã, o que acontece primeiro?",
            en: "When you open your wardrobe in the morning, what happens first?",
          },
          opcoes: [
            { id: "mesmas", texto: { pt: "Pego as mesmas peças de sempre, sem pensar muito.", en: "I grab the same pieces as always, without much thought." } },
            { id: "trocas", texto: { pt: "Troco de roupa duas, três vezes antes de sair.", en: "I change two, three times before I leave." } },
            { id: "nuncaUsei", texto: { pt: "Vejo peças que nunca usei e deixo pra outro dia.", en: "I see pieces I've never worn and leave them for another day." } },
            { id: "nenhuma", texto: { pt: "Nenhuma dessas.", en: "None of these." } },
          ],
        },
        {
          id: "onde",
          tipo: "escolha",
          kicker: { pt: "Onde isso aparece", en: "Where it shows up" },
          titulo: {
            pt: "Em que momento a sua imagem mais pesa?",
            en: "When does your image weigh on you the most?",
          },
          opcoes: [
            { id: "trabalho", texto: { pt: "No trabalho, quando preciso me apresentar.", en: "At work, when I need to present myself." } },
            { id: "eventos", texto: { pt: "Em eventos, quando não sei o que é adequado.", en: "At events, when I don't know what's appropriate." } },
            { id: "fotos", texto: { pt: "Nas fotos, quando me vejo depois.", en: "In photos, when I see myself afterwards." } },
            { id: "diaADia", texto: { pt: "No dia a dia, só comigo mesma.", en: "Day to day, just with myself." } },
          ],
        },
        {
          id: "frase",
          tipo: "aberta",
          kicker: { pt: "A única coisa", en: "The one thing" },
          titulo: {
            pt: "Se uma coisa mudasse na forma como você se veste, o que seria?",
            en: "If one thing changed in the way you dress, what would it be?",
          },
          apoio: APOIO_ABERTA,
          placeholder: { pt: "Uma coisa só.", en: "Just one thing." },
          audio: true,
        },
        {
          id: "medida",
          tipo: "medida",
          kicker: KICKER_MEDIDA,
          titulo: { pt: "Agora, o seu armário em números.", en: "Now, your wardrobe in numbers." },
          apoio: APOIO_MEDIDA,
          conta: "armario",
          campos: [
            {
              id: "pct",
              papel: "pctUsado",
              rotulo: {
                pt: "Que fatia do seu armário você realmente usa?",
                en: "What share of your wardrobe do you actually wear?",
              },
              formato: "pct",
              faixa: { min: 5, max: 100, step: 5, padrao: 30 },
            },
            {
              id: "parado",
              papel: "valorParado",
              rotulo: {
                pt: "Nos últimos 12 meses, quanto você gastou em peças que ficaram penduradas?",
                en: "In the last 12 months, how much did you spend on pieces that stayed on the hanger?",
              },
              formato: "moeda",
              faixaPorMoeda: {
                BRL: { min: 500, max: 40000, step: 500, padrao: 4000 },
                USD: null,
              },
            },
          ],
          // C3: "adormecidos", nunca "desperdiçados".
          textoConta: {
            pt: "**{pct}%** do seu armário trabalha por você hoje. Os outros {resto}% não sumiram: estão adormecidos. São **{valor}** em peças que ainda estão lá, esperando alguém dizer com o que combinam.",
            en: "**{pct}%** of your wardrobe works for you today. The other {resto}% haven't gone anywhere: they're dormant. That's **{valor}** in pieces still hanging there, waiting for someone to say what they go with.",
          },
        },
        {
          id: "palavras",
          tipo: "palavras",
          kicker: { pt: "O futuro", en: "The future" },
          titulo: {
            pt: "Daqui a seis meses, quando você sai de uma sala, como quer ser descrita?",
            en: "Six months from now, when you walk out of a room, how do you want to be described?",
          },
          apoio: { pt: "Escolha de 2 a 3 palavras.", en: "Pick 2 to 3 words." },
          min: 2,
          max: 3,
          opcoes: [
            { id: "elegante", texto: { pt: "elegante", en: "elegant" } },
            { id: "autentica", texto: { pt: "autêntica", en: "authentic" } },
            { id: "segura", texto: { pt: "segura", en: "self-assured" } },
            { id: "memoravel", texto: { pt: "memorável", en: "memorable" } },
            { id: "sofisticada", texto: { pt: "sofisticada", en: "sophisticated" } },
            { id: "leve", texto: { pt: "leve", en: "at ease" } },
            { id: "marcante", texto: { pt: "marcante", en: "striking" } },
            { id: "coerente", texto: { pt: "coerente", en: "consistent" } },
          ],
        },
        {
          id: "faixa",
          tipo: "faixa",
          kicker: KICKER_FAIXA,
          titulo: TITULO_FAIXA,
          apoio: APOIO_FAIXA,
          opcoesPorMoeda: {
            BRL: [
              { id: "ate500", texto: { pt: "Até R$ 500", en: "Up to R$ 500" }, piso: 500 },
              { id: "de500a3500", texto: { pt: "De R$ 500 a R$ 3.500", en: "R$ 500 to R$ 3,500" }, piso: 500 },
              { id: "de3500a7000", texto: { pt: "De R$ 3.500 a R$ 7.000", en: "R$ 3,500 to R$ 7,000" }, piso: 3500 },
              { id: "acima7000", texto: { pt: "Acima de R$ 7.000", en: "Over R$ 7,000" }, piso: 7000 },
              { id: "naoDizer", texto: NAO_DIZER, piso: null },
            ],
            USD: null,
          },
        },
      ],
    },
    {
      id: "posicionamento",
      // HANDOFF §11: sóbrio, de igual para igual, e nada de roupa ou
      // aparência — a contaminação por Imagem foi o que motivou o v2.
      voz: {
        papel: "Lê como o trabalho dela é dito, apresentado e entendido: proposta, reunião, narrativa, a forma de explicar o que faz.",
        tom: [
          "Sóbrio e exato, de igual para igual, com verbos de leitura; nunca o de uma mentora que promete.",
          "Não fala de roupa, estilo, corpo, aparência, cor nem peça. \"Presença\" só no sentido de apresentação profissional, nunca de aparência física.",
          "Um desejo que ela declarou pode ser descrito como desejo presente (\"você escreveu que quer...\"), nunca como previsão.",
        ],
        proibido: [
          { pt: "lapidar", en: "polish" },
          { pt: "bruto", en: "rough" },
          { pt: "diamante", en: "diamond" },
          { pt: "brilhar", en: "shine" },
          { pt: "joia", en: "jewel" },
          { pt: "folheado", en: "gold-plated" },
          { pt: "falso", en: "fake" },
          { pt: "genuíno", en: "genuine" },
          { pt: "fogo", en: "fire" },
          { pt: "forja", en: "forge" },
          { pt: "destaque", en: "stand out" },
          { pt: "referência", en: "go-to" },
          { pt: "ser convidada", en: "be invited" },
          { pt: "ser lembrada", en: "be remembered" },
          { pt: "sucesso", en: "success" },
          { pt: "melhor versão", en: "best version" },
          { pt: "valor comprovado", en: "proven value" },
          { pt: "falta pouco", en: "almost there" },
          { pt: "roupa", en: "clothes" },
          { pt: "estilo", en: "style" },
          { pt: "aparência", en: "appearance" },
          { pt: "armário", en: "wardrobe" },
          { pt: "peça", en: "garment" },
          // A proposta real de 23/09 fechou com "a sua imagem finalmente dizer" (F03).
          { pt: "imagem", en: "image" },
          { pt: "corpo", en: "body" },
          { pt: "cor", en: "color" },
        ],
      },
      cena: {
        texto: {
          pt: "Entrego mais do que muita gente que aparece mais — e continuo sendo a última lembrada.",
          en: "I deliver more than many people who are more visible — and I'm still the last one remembered.",
        },
        // Devolvida no fim e no gate só pela segunda metade: é a parte dela.
        citacao: { pt: "…e continuo sendo a última lembrada.", en: "…and I'm still the last one remembered." },
        icone: "templo",
      },
      mundo: {
        esquema: "escuro",
        fundo: "#111315",
        cartao: "#191B1E",
        tinta: "#ECE6DA",
        apoio: "#9C978E",
        linha: "#6C675F",
        trilho: "#3A3834",
        acento: "#C8935E",
        acentoSuave: "rgba(200,147,94,.16)",
        alerta: "#D2785E",
        ouro: "#C8935E",
        // Degradê cobre e pílula: exceção assinada pelo Willian, só nesta
        // vertente (handoff §6 — registrar no BRAND-VISUAL §10).
        botaoFundo: "linear-gradient(135deg, #E3B888 0%, #C48A55 55%, #A8733F 100%)",
        botaoTinta: "#111315",
        raioBotao: 999,
        preenchimento: "linear-gradient(135deg, #E3B888 0%, #C48A55 55%, #A8733F 100%)",
        tintaSobrePreenchimento: "#111315",
        painel: "#0C0D0F",
        painelTinta: "#F6EFE1",
        painelApoio: "rgba(246,239,225,.62)",
        painelAcento: "#C8935E",
        gesto: "preenchimento",
        iconesNasOpcoes: true,
      },
      figura: "templo",
      niveis: [
        { pt: "Alicerce", en: "Foundation" },
        { pt: "Estrutura", en: "Structure" },
        { pt: "Cúpula", en: "Dome" },
      ],
      metodo: {
        titulo: { pt: "Tradução, não transformação.", en: "Translation, not transformation." },
        corpo: [
          {
            pt: "Posicionamento costuma ser vendido como visibilidade: aparecer mais, falar mais alto, vestir uma persona. O Método Valor Percebido faz o contrário. Ele não ensina a aparecer mais. Ensina a ser lida certo quando você aparece. Nada aqui inventa quem você não é.",
            en: "Positioning is usually sold as visibility: show up more, speak louder, put on a persona. The Perceived Worth Method does the opposite. It doesn't teach you to show up more. It teaches you to be read right when you do. Nothing here invents who you're not.",
          },
          {
            pt: "Por isso o trabalho começa pelo que você já entrega, não pelo que falta mostrar. Primeiro o critério, depois a frase, e só então a vitrine.",
            en: "That's why the work starts with what you already deliver, not with what's missing from view. First the criteria, then the sentence, and only then the showcase.",
          },
        ],
      },
      perguntas: [
        {
          id: "dito",
          tipo: "escolha",
          kicker: { pt: "Como o seu trabalho é dito", en: "How your work gets described" },
          titulo: {
            pt: "Quando alguém fala do seu trabalho para outra pessoa, o que costuma dizer?",
            en: "When someone talks about your work to another person, what do they usually say?",
          },
          opcoes: [
            { id: "competente", icone: "aspas", texto: { pt: "Que eu sou muito competente — sem dizer em quê.", en: "That I'm very good — without saying at what." } },
            { id: "resultado", icone: "doc", texto: { pt: "Falam do resultado; o meu nome quase não aparece.", en: "They talk about the result; my name barely comes up." } },
            { id: "assunto", icone: "alvo", texto: { pt: "Um assunto específico: \"fala com ela sobre isso\".", en: "A specific topic: \"talk to her about that.\"" } },
            { id: "naoSei", icone: "interroga", texto: { pt: "Não sei — quase nunca fico sabendo.", en: "I don't know — I rarely find out." } },
          ],
        },
        {
          id: "espaco",
          tipo: "escolha",
          kicker: { pt: "Onde você fica para trás", en: "Where you fall behind" },
          titulo: {
            pt: "Onde você mais sente que perde espaço hoje?",
            en: "Where do you most feel you're losing ground today?",
          },
          opcoes: [
            { id: "propostas", icone: "doc", texto: { pt: "Nas propostas e nos orçamentos.", en: "In proposals and quotes." } },
            { id: "indicacoes", icone: "chat", texto: { pt: "Nas indicações, que vão para outra pessoa.", en: "In referrals, which go to someone else." } },
            { id: "redes", icone: "tela", texto: { pt: "Nas redes, onde quase não apareço.", en: "On social media, where I barely show up." } },
            { id: "reunioes", icone: "aspas", texto: { pt: "Em reuniões e eventos, onde falo pouco.", en: "In meetings and events, where I say little." } },
          ],
        },
        {
          id: "frase",
          tipo: "aberta",
          kicker: { pt: "A frase certa", en: "The right line" },
          titulo: {
            pt: "Complete: \"Eu queria ser lembrada como a pessoa que…\"",
            en: "Finish this: \"I'd like to be remembered as the person who…\"",
          },
          apoio: APOIO_ABERTA,
          placeholder: { pt: "…", en: "…" },
          audio: true,
        },
        {
          id: "medida",
          tipo: "medida",
          kicker: KICKER_MEDIDA,
          titulo: { pt: "Agora, o seu trabalho em números.", en: "Now, your work in numbers." },
          apoio: APOIO_MEDIDA,
          conta: "preco",
          campos: [
            {
              id: "atual",
              papel: "precoAtual",
              rotulo: {
                pt: "Hoje, quanto você cobra pelo seu principal serviço?",
                en: "Today, how much do you charge for your main service?",
              },
              formato: "moeda",
              faixaPorMoeda: {
                BRL: { min: 100, max: 5000, step: 50, padrao: 400 },
                USD: null,
              },
            },
            {
              id: "desejado",
              papel: "precoDesejado",
              rotulo: DESEJADO,
              formato: "moeda",
              faixaPorMoeda: {
                BRL: { min: 100, max: 10000, step: 50, padrao: 700 },
                USD: null,
              },
            },
            {
              id: "volume",
              papel: "volumeMensal",
              rotulo: {
                pt: "Em média, quantos desses você faz por mês?",
                en: "On average, how many of these do you do a month?",
              },
              formato: "numero",
              faixa: { min: 1, max: 80, step: 1, padrao: 10 },
            },
          ],
          textoConta: CONTA_PRECO,
          textoContaIgual: CONTA_PRECO_IGUAL,
        },
        {
          id: "trava",
          tipo: "escolha",
          kicker: { pt: "O que trava", en: "What holds you back" },
          titulo: {
            pt: "O que mais te trava na hora de se apresentar?",
            en: "What holds you back most when you introduce yourself?",
          },
          opcoes: [
            { id: "oQueDizer", icone: "interroga", texto: { pt: "Não sei o que dizer primeiro.", en: "I don't know what to say first." } },
            { id: "gabando", icone: "aspas", texto: { pt: "Parece que estou me gabando.", en: "It feels like I'm bragging." } },
            { id: "tecnico", icone: "doc", texto: { pt: "Falo demais do técnico.", en: "I talk too much about the technical side." } },
            { id: "naoAparecer", icone: "pontos", texto: { pt: "Prefiro nem aparecer.", en: "I'd rather not show up at all." } },
          ],
        },
        {
          id: "faixa",
          tipo: "faixa",
          kicker: KICKER_FAIXA,
          titulo: TITULO_FAIXA,
          apoio: APOIO_FAIXA,
          opcoesPorMoeda: {
            BRL: [
              { id: "ate200mes", icone: "pontos", texto: { pt: "Até R$ 200 por mês", en: "Up to R$ 200 a month" }, piso: 200 },
              { id: "de200a5000", icone: "doc", texto: { pt: "De R$ 200 a R$ 5.000", en: "R$ 200 to R$ 5,000" }, piso: 200 },
              { id: "de5000a12000", icone: "alvo", texto: { pt: "De R$ 5.000 a R$ 12.000", en: "R$ 5,000 to R$ 12,000" }, piso: 5000 },
              { id: "acima12000", icone: "templo", texto: { pt: "Acima de R$ 12.000", en: "Over R$ 12,000" }, piso: 12000 },
              { id: "naoDizer", icone: "interroga", texto: NAO_DIZER, piso: null },
            ],
            USD: null,
          },
        },
      ],
    },
    {
      id: "estetica",
      // HANDOFF §11: colega sênior de atendimento. Pele, corpo e saúde
      // nunca são matéria da leitura (dado sensível; auditoria da voz).
      voz: {
        papel: "Lê o trabalho de atendimento: como ela prepara, organiza, apresenta, cobra e revê; ficha, cliente, preço, agenda e local.",
        tom: [
          "Colega sênior de atendimento: frases curtas, segunda pessoa, verbos de trabalho (preparar, organizar, apresentar, cobrar, rever).",
          "Não interpreta pele, corpo, saúde nem condição física, nem quando ela mencionar. Não pressupõe ficha formal nem trabalho com pele.",
          "O que a cliente já sabe antes de chegar é informação do atendimento, não indicação.",
          "Onde ela atende é fato, nunca degrau: não contraste com um espaço próprio nem o sugira como falta ou próximo passo.",
        ],
        proibido: [
          { pt: "transforme", en: "transform" },
          { pt: "fature", en: "earn more" },
          { pt: "lote a agenda", en: "fill your schedule" },
          { pt: "referência", en: "go-to" },
          { pt: "insubstituível", en: "irreplaceable" },
          { pt: "brilhe", en: "shine" },
          { pt: "sua clínica", en: "your clinic" },
          { pt: "alto padrão garantido", en: "guaranteed high standard" },
          { pt: "anamnese", en: "anamnesis" },
          { pt: "consulta", en: "consultation" },
          { pt: "tempo de pausa", en: "downtime" },
          { pt: "indicação", en: "referral" },
          { pt: "indicou", en: "referred" },
          { pt: "pele", en: "skin" },
          { pt: "corpo", en: "body" },
          { pt: "saúde", en: "health" },
          // "Espaço só meu" nunca é meta (HANDOFF §11): "não no seu espaço" passou na rodada 2.
          { pt: "seu espaço", en: "your own space" },
          { pt: "espaço próprio", en: "space of your own" },
          { pt: "espaço só seu", en: "a place of your own" },
        ],
      },
      cena: {
        texto: {
          pt: "Atendo o dia inteiro, mas ainda parece que estou só trabalhando — não construindo um negócio.",
          en: "I see clients all day, but it still feels like I'm just working — not building a business.",
        },
        icone: "maca",
      },
      mundo: {
        esquema: "claro",
        fundo: "#F6EFE1",
        cartao: "#FFFBF4",
        tinta: "#18231E",
        apoio: "#4A5650",
        linha: "#6B7A72",
        trilho: "#6B7A72",
        acento: "#4A6D5B",
        acentoSuave: "rgba(111,155,133,.18)",
        // Terra mais fundo: o #D2785E dos mundos escuros dá 2,79:1 no marfim.
        alerta: "#A4492F",
        ouro: "#856828",
        botaoFundo: "#2E4A3B",
        botaoTinta: "#F6EFE1",
        raioBotao: 10,
        preenchimento: "#4A6D5B",
        tintaSobrePreenchimento: "#F6EFE1",
        painel: "#2E4A3B",
        painelTinta: "#F6EFE1",
        // .62 dá 4,38:1 sobre a sálvia do painel; .72 dá 5,30:1 (textos de 10–11px).
        painelApoio: "rgba(246,239,225,.72)",
        painelAcento: "#A8C4B4",
        gesto: "onda",
        iconesNasOpcoes: false,
      },
      figura: "toque",
      // Estágio de carreira: "para quem é", nunca "você vai virar" (C2).
      niveis: [
        { pt: "Colaboradora", en: "Team member" },
        { pt: "Autônoma", en: "Independent" },
        { pt: "Empresária", en: "Business owner" },
      ],
      metodo: {
        titulo: { pt: "Tradução, não transformação.", en: "Translation, not transformation." },
        corpo: [
          {
            pt: "Quando a conversa começa pelo preço, o conselho de sempre é postar mais, atender mais, prometer mais. Mas esforço não é o que falta. O Método Valor Percebido lê o que o seu atendimento já entrega e traduz isso em sinais que a cliente percebe antes de perguntar quanto custa.",
            en: "When the conversation starts with price, the usual advice is to post more, book more, promise more. But effort isn't what's missing. The Perceived Worth Method reads what your service already delivers and translates it into signals your client notices before she asks how much it costs.",
          },
          {
            pt: "Por isso o preço vem por último. Primeiro o que você defende, depois o que a cliente vê, ouve e vive. Preço à altura é consequência, não coragem.",
            en: "That's why price comes last. First what you stand for, then what your client sees, hears and lives. Pricing at your level is a consequence, not an act of courage.",
          },
        ],
      },
      perguntas: [
        {
          id: "preco",
          tipo: "escolha",
          kicker: { pt: "Sobre preço", en: "About price" },
          titulo: {
            pt: "Quando uma cliente pergunta o preço, o que acontece *do seu lado*?",
            en: "When a client asks about price, what happens *on your side*?",
          },
          apoio: {
            pt: "Marque o que acontece na maioria das vezes, não o que deveria acontecer.",
            en: "Mark what happens most of the time, not what should happen.",
          },
          opcoes: [
            { id: "explico", texto: { pt: "Explico tudo o que está incluído antes de dizer o valor.", en: "I explain everything that's included before saying the price." } },
            { id: "desconto", texto: { pt: "Ofereço um desconto antes mesmo de ela pedir.", en: "I offer a discount before she even asks." } },
            { id: "sustento", texto: { pt: "Respondo na hora e sustento o valor, sem desconto.", en: "I answer right away and hold the price, no discount." } },
            { id: "torcendo", texto: { pt: "Mando o valor e fico torcendo pra ela não sumir.", en: "I send the price and hope she doesn't disappear." } },
          ],
        },
        {
          id: "antes",
          tipo: "escolha",
          kicker: { pt: "O que chega antes de você", en: "What arrives before you do" },
          titulo: {
            pt: "Antes da primeira sessão, o que uma cliente nova já sabe sobre o seu atendimento?",
            en: "Before the first session, what does a new client already know about how you work?",
          },
          opcoes: [
            { id: "precoEndereco", texto: { pt: "Só o preço e o endereço.", en: "Just the price and the address." } },
            { id: "amiga", texto: { pt: "O que a amiga que indicou contou.", en: "What the friend who referred her said." } },
            { id: "instagram", texto: { pt: "O que ela viu no meu Instagram.", en: "What she saw on my Instagram." } },
            { id: "quaseNada", texto: { pt: "Quase nada — ela descobre na hora.", en: "Almost nothing — she finds out on the spot." } },
          ],
        },
        {
          id: "local",
          tipo: "escolha",
          kicker: { pt: "Onde você atende", en: "Where you work" },
          titulo: {
            pt: "Onde acontecem os seus atendimentos hoje?",
            en: "Where do your appointments happen today?",
          },
          // Cinco lugares sem ordem de degrau: nenhum é "mais avançado".
          opcoes: [
            { id: "casaCliente", texto: { pt: "Na casa das minhas clientes.", en: "At my clients' homes." } },
            { id: "espacoProprio", texto: { pt: "Em um espaço só meu.", en: "In a space of my own." } },
            { id: "salaAlugada", texto: { pt: "Em sala alugada ou compartilhada.", en: "In a rented or shared room." } },
            { id: "minhaCasa", texto: { pt: "Na minha casa, num canto que preparei.", en: "At my home, in a corner I set up." } },
            { id: "varios", texto: { pt: "Em mais de um desses lugares.", en: "In more than one of these places." } },
          ],
        },
        {
          id: "medida",
          tipo: "medida",
          kicker: KICKER_MEDIDA,
          titulo: { pt: "Agora, o seu atendimento em números.", en: "Now, your appointments in numbers." },
          apoio: APOIO_MEDIDA,
          conta: "preco",
          campos: [
            {
              id: "atual",
              papel: "precoAtual",
              rotulo: {
                pt: "Hoje, quanto você cobra pelo seu atendimento principal?",
                en: "Today, how much do you charge for your main treatment?",
              },
              formato: "moeda",
              faixaPorMoeda: {
                BRL: { min: 50, max: 1500, step: 10, padrao: 150 },
                USD: null,
              },
            },
            {
              id: "desejado",
              papel: "precoDesejado",
              rotulo: DESEJADO,
              formato: "moeda",
              faixaPorMoeda: {
                BRL: { min: 50, max: 3000, step: 10, padrao: 250 },
                USD: null,
              },
            },
            {
              id: "volume",
              papel: "volumeMensal",
              rotulo: {
                pt: "Em média, quantos atendimentos assim você faz por mês?",
                en: "On average, how many of these appointments do you do a month?",
              },
              formato: "numero",
              faixa: { min: 5, max: 200, step: 5, padrao: 40 },
            },
          ],
          textoConta: CONTA_PRECO,
          textoContaIgual: CONTA_PRECO_IGUAL,
        },
        {
          id: "frase",
          tipo: "aberta",
          kicker: { pt: "A única coisa", en: "The one thing" },
          titulo: {
            pt: "Se o seu negócio mudasse uma coisa nos próximos meses, qual seria?",
            en: "If your business changed one thing in the coming months, what would it be?",
          },
          apoio: APOIO_ABERTA,
          placeholder: { pt: "Uma coisa só.", en: "Just one thing." },
          audio: true,
        },
        {
          id: "faixa",
          tipo: "faixa",
          kicker: KICKER_FAIXA,
          titulo: TITULO_FAIXA,
          apoio: APOIO_FAIXA,
          opcoesPorMoeda: {
            BRL: [
              { id: "ate1000", texto: { pt: "Até R$ 1.000", en: "Up to R$ 1,000" }, piso: 1000 },
              { id: "de1000a5000", texto: { pt: "De R$ 1.000 a R$ 5.000", en: "R$ 1,000 to R$ 5,000" }, piso: 1000 },
              { id: "de5000a10000", texto: { pt: "De R$ 5.000 a R$ 10.000", en: "R$ 5,000 to R$ 10,000" }, piso: 5000 },
              { id: "acima10000", texto: { pt: "Acima de R$ 10.000", en: "Over R$ 10,000" }, piso: 10000 },
              { id: "naoDizer", texto: NAO_DIZER, piso: null },
            ],
            USD: null,
          },
        },
      ],
    },
  ],

  // Esteira por vertente — planejamento §5. Produtos por convite e fora da
  // escada (Auditoria, Assinatura Anual, Dubai em Pessoa) não entram: não são
  // vendidos pelo funil.
  produtos: [
    // publicado: true nos 8 preços já decididos (20-22/09) — sem env separada
    // pra cobrar, o preço daqui já é o que a proposta mostra e cobra. false
    // nos 3 que ainda dependem da Renilza aprovar o número (docs/PENDING.md §1).
    // Canal e gate: tabela do HANDOFF §7.1.
    { id: "saiPronta", vertente: "imagem", nivel: 0, nome: { pt: "Sai Pronta em 7 Dias", en: "Ready in 7 Days" }, preco: { BRL: 97, USD: null }, publicado: true, recorrencia: "unica", canal: "checkout", gate: false },
    // Assinaturas: vendem pela Hotmart. Colar o link de checkout de cada uma em
    // linkHotmart; enquanto for null, a proposta leva à conversa no WhatsApp.
    { id: "consultoraDeBolso", vertente: "imagem", nivel: 0, nome: { pt: "Consultora de Bolso", en: "Pocket Consultant" }, preco: { BRL: 49, USD: null }, publicado: true, recorrencia: "mensal", canal: "checkout", gate: false, linkHotmart: null },
    { id: "dossieDigital", vertente: "imagem", nivel: 0, nome: { pt: "Dossiê Digital", en: "Digital Dossier" }, preco: { BRL: null, USD: null }, publicado: false, recorrencia: "unica", canal: "checkout", gate: false },
    { id: "dossieImagem", vertente: "imagem", nivel: 1, nome: { pt: "Dossiê de Imagem", en: "Image Dossier" }, preco: { BRL: 3500, USD: null }, publicado: true, recorrencia: "unica", canal: "conversa", gate: false },
    { id: "consultoriaInternacional", vertente: "imagem", nivel: 1, nome: { pt: "Consultoria de Imagem · Dubai & Europa", en: "Image Consulting · Dubai & Europe" }, preco: { BRL: null, USD: 1800 }, publicado: true, recorrencia: "unica", canal: "conversa", gate: false },
    { id: "altaCostura", vertente: "imagem", nivel: 2, nome: { pt: "Alta-Costura", en: "Haute Couture" }, preco: { BRL: null, USD: null }, publicado: false, recorrencia: "unica", canal: "conversa", gate: true },
    { id: "jornada", vertente: "posicionamento", nivel: 1, nome: { pt: "Jornada Valor Percebido", en: "Perceived Worth Journey" }, preco: { BRL: 97.9, USD: null }, publicado: true, recorrencia: "mensal", canal: "checkout", gate: false, linkHotmart: null },
    { id: "posicionamento1a1", vertente: "posicionamento", nivel: 2, nome: { pt: "1:1 de Posicionamento", en: "1:1 Positioning" }, preco: { BRL: 9997, USD: 8500 }, publicado: true, recorrencia: "unica", canal: "conversa", gate: true },
    { id: "daMaca", vertente: "estetica", nivel: 1, nome: { pt: "Da Maca ao Alto Padrão", en: "From the Treatment Bed to High End" }, preco: { BRL: 497, USD: null }, publicado: true, recorrencia: "unica", canal: "checkout", gate: false },
    { id: "turmaEstetica", vertente: "estetica", nivel: 2, nome: { pt: "Turma de Estética", en: "Aesthetics Cohort" }, preco: { BRL: 4997, USD: 2200 }, publicado: true, recorrencia: "unica", canal: "conversa", gate: true },
    { id: "signature", vertente: "estetica", nivel: 2, nome: { pt: "Signature", en: "Signature" }, preco: { BRL: 9997, USD: null }, publicado: true, recorrencia: "unica", canal: "conversa", gate: true },
  ],

  textos: {
    comum: {
      avancar: { pt: "Avançar", en: "Next" },
      ultimaPergunta: { pt: "Ver como fica", en: "See how it looks" },
      voltar: { pt: "Voltar", en: "Back" },
      progresso: { pt: "{n} de {total}", en: "{n} of {total}" },
      dotado: {
        pt: "Sua leitura tem {total} peças. Você já montou {feitas}.",
        en: "Your reading has {total} pieces. You've already put together {feitas}.",
      },
      faltamDuas: { pt: "Faltam duas.", en: "Two to go." },
      ultima: { pt: "Última pergunta antes da sua leitura.", en: "Last question before your reading." },
    },
    recibos: {
      cena: [{ pt: "Seu ponto de partida está guardado.", en: "Your starting point is saved." }],
      escolha: [
        { pt: "Guardei.", en: "Saved." },
        { pt: "Anotado na sua leitura.", en: "Noted in your reading." },
        { pt: "Isso já diz muito.", en: "That already says a lot." },
        { pt: "Guardei. Seguimos.", en: "Saved. On we go." },
      ],
      aberta: [{ pt: "Guardei. Palavra por palavra.", en: "Saved. Word for word." }],
      medida: [{ pt: "Suas medidas estão na leitura.", en: "Your measurements are in the reading." }],
      palavras: [{ pt: "Anotado. É assim que vou te descrever.", en: "Noted. That's how I'll describe you." }],
      faixa: [{ pt: "Guardei.", en: "Saved." }],
    },
    abertura: {
      titulo: { pt: "Antes de tudo, uma pergunta.", en: "First, one question." },
      apoio: {
        pt: "Poucas perguntas, menos de três minutos. No final, você recebe um diagnóstico feito sob medida, não um resultado genérico.",
        en: "A few questions, under three minutes. At the end, you get a diagnosis made to measure, not a generic result.",
      },
      rotuloNome: { pt: "Como você se chama?", en: "What's your name?" },
      placeholderNome: { pt: "Seu primeiro nome", en: "Your first name" },
      nota: { pt: "Nenhuma resposta certa. Só a sua.", en: "No right answers. Only yours." },
      cta: { pt: "Começar", en: "Begin" },
    },
    cena: {
      kicker: { pt: "Escolha uma cena", en: "Pick a scene" },
      titulo: {
        pt: "{nome}, o que mais parece com o seu momento?",
        en: "{nome}, which of these feels most like where you are now?",
      },
      tituloSemNome: {
        pt: "O que mais parece com o seu momento?",
        en: "Which of these feels most like where you are now?",
      },
      rotuloLivre: { pt: "O seu momento, com as suas palavras", en: "Where you are, in your own words" },
      placeholderLivre: { pt: "Me conta em uma linha.", en: "Tell me in one line." },
    },
    aberta: {
      rotulo: { pt: "A sua resposta", en: "Your answer" },
      audio: {
        convite: { pt: "Prefere me contar por áudio?", en: "Rather tell me in a voice note?" },
        consentimento: {
          pt: "Seu áudio vira texto só pra montar seu diagnóstico. Depois de transcrito, não guardamos o arquivo. Ok pra gravar?",
          en: "Your audio becomes text only to build your diagnosis. Once transcribed, we don't keep the file. OK to record?",
        },
        consentir: { pt: "Pode gravar", en: "Go ahead and record" },
        recusar: { pt: "prefiro digitar", en: "I'd rather type" },
        gravando: { pt: "Ouvindo você", en: "Listening to you" },
        parar: { pt: "Terminei", en: "Done" },
        transcrevendo: { pt: "Transcrevendo…", en: "Transcribing…" },
        erro: { pt: "Não consegui gravar agora. Você pode digitar.", en: "I couldn't record just now. You can type." },
      },
    },
    palavras: {
      minimo: { pt: "Escolha pelo menos duas.", en: "Pick at least two." },
      maisUma: { pt: "Mais uma, se quiser.", en: "One more, if you like." },
      completas: { pt: "Três marcadas. Toque numa para trocar.", en: "Three picked. Tap one to swap." },
    },
    medida: {
      convite: { pt: "Mexa nas medidas para ver a sua conta.", en: "Move the measures to see your numbers." },
    },
    gate: {
      kicker: { pt: "Contato", en: "Contact" },
      titulo: { pt: "{nome}, a sua leitura já começa assim:", en: "{nome}, your reading already begins like this:" },
      tituloSemNome: { pt: "A sua leitura já começa assim:", en: "Your reading already begins like this:" },
      apoio: { pt: "Me diz onde te enviar o restante.", en: "Tell me where to send you the rest." },
      whatsapp: { pt: "WhatsApp", en: "WhatsApp" },
      whatsappPlaceholder: {
        pt: "DDD e número — de fora do Brasil, comece com +",
        en: "Number with country code, starting with +",
      },
      email: { pt: "E-mail (opcional)", en: "Email (optional)" },
      emailPlaceholder: { pt: "seu@email.com", en: "you@email.com" },
      privacidade: {
        // A frase antiga dizia "sem compartilhar com terceiros" — o áudio passa
        // por um serviço de transcrição e as respostas por um de texto
        // (auditoria A29, 23/09/2026). Esta descreve o caminho real.
        pt: "Seu contato e suas respostas vão para a Renilza e são usados só para montar e te enviar esta leitura. Para isso, passam pelos serviços que transcrevem o áudio e escrevem o texto. Nada é vendido nem usado para outra coisa, e é só pedir que eu apago.",
        en: "Your contact details and answers go to Renilza and are used only to put together and send you this reading. To do that, they pass through the services that transcribe audio and write the text. Nothing is sold or used for anything else, and you can ask me to delete it at any time.",
      },
      cta: { pt: "Receber meu diagnóstico", en: "Get my diagnosis" },
      enviando: { pt: "Enviando…", en: "Sending…" },
      erroWhatsapp: {
        pt: "Confere o número? Preciso dele pra te mandar o link.",
        en: "Check the number? I need it to send you the link.",
      },
      erroEmail: { pt: "Confere o e-mail? Parece incompleto.", en: "Check the email? It looks incomplete." },
      erroGeral: {
        pt: "Não consegui salvar agora. Tenta de novo em alguns segundos.",
        en: "I couldn't save just now. Try again in a few seconds.",
      },
    },
    prazo: {
      kicker: { pt: "Enquanto monto a sua leitura", en: "While I put your reading together" },
      titulo: { pt: "Pra quando você quer isso resolvido?", en: "When would you like this sorted?" },
      apoio: {
        pt: "Um toque. Isso só muda o convite do final, nunca o diagnóstico.",
        en: "One tap. It only changes the closing invitation, never the diagnosis.",
      },
      cta: { pt: "Ver a minha leitura", en: "See my reading" },
      pular: { pt: "Pular", en: "Skip" },
      opcoes: [
        { id: "semana", icone: "alvo", texto: { pt: "Quero começar essa semana.", en: "I want to start this week." } },
        { id: "quatroSemanas", icone: "doc", texto: { pt: "Nas próximas duas a quatro semanas.", en: "In the next two to four weeks." } },
        { id: "trimestre", icone: "templo", texto: { pt: "Ainda este trimestre.", en: "Sometime this quarter." } },
        { id: "semPressa", icone: "pontos", texto: { pt: "Sem pressa, estou me informando.", en: "No rush, I'm just looking into it." } },
      ],
    },
    montando: {
      kicker: { pt: "A sua leitura", en: "Your reading" },
      linhas: [
        { pt: "Lendo o que você escreveu…", en: "Reading what you wrote…" },
        { pt: "Cruzando com as suas medidas…", en: "Cross-checking with your measurements…" },
        { pt: "Pronto.", en: "Done." },
      ],
    },
    fim: {
      kicker: { pt: "A sua leitura", en: "Your reading" },
      titulo: {
        pt: "{nome}, aqui está o mapa do que você me contou.",
        en: "{nome}, here's the map of what you told me.",
      },
      cena: { pt: "Você começou pela cena", en: "You started with the scene" },
      frase: { pt: "A frase que é sua:", en: "The line that's yours:" },
      cta: { pt: "Continuar no WhatsApp", en: "Continue on WhatsApp" },
      apoio: {
        pt: "A proposta completa chega por lá, feita com o que você me contou.",
        en: "The full proposal arrives there, made from what you told me.",
      },
      // Sem nome, relato ou número: o texto viaja na URL do wa.me (A35).
      mensagemWhatsapp: {
        pt: "Oi, Renilza! Acabei o diagnóstico e quero conversar sobre o próximo passo. A minha leitura: {link}",
        en: "Hi Renilza! I just finished the diagnosis and I'd like to talk about the next step. My reading: {link}",
      },
    },
    painel: {
      passos: {
        nome: { pt: "Nome", en: "Name" },
        cena: { pt: "Cena", en: "Scene" },
        ramo: { pt: "Aprofundamento", en: "Deep dive" },
        contato: { pt: "Contato", en: "Contact" },
      },
      rodape: {
        pt: "No final, uma leitura feita com o que você me contar.",
        en: "At the end, a reading made from what you tell me.",
      },
    },
    indisponivel: {
      titulo: {
        pt: "Este diagnóstico ainda não abriu neste idioma.",
        en: "This diagnosis isn't open in English yet.",
      },
      corpo: {
        pt: "Enquanto isso, ele já está disponível em outro idioma.",
        en: "In the meantime, it's already available in Portuguese.",
      },
      cta: { pt: "Continuar em português", en: "Continue in Portuguese" },
    },
    idioma: { pt: "Idioma", en: "Language" },
    reserva: {
      frase: {
        pt: "{nome}, você me escreveu isto: \"{frase}\".",
        en: "{nome}, you wrote me this: \"{frase}\".",
      },
      guardei: {
        pt: "O que você escreveu também entra nesta leitura.",
        en: "What you wrote is part of this reading too.",
      },
      palavras: {
        pt: "E escolheu ser lida como {palavras} — é dali que a gente parte.",
        en: "And you chose to be read as {palavras} — that's where we start.",
      },
    },
    proposta: {
      nivel: { pt: "Para quem é: {nivel}", en: "Who it's for: {nivel}" },
      semOferta: {
        pt: "O próximo passo a gente decide numa conversa, com o que você me contou na mão.",
        en: "We'll decide the next step in a conversation, with what you told me in hand.",
      },
      semOfertaCta: { pt: "Conversar no WhatsApp", en: "Talk on WhatsApp" },
      porMes: { pt: "{preco}/mês", en: "{preco}/month" },
      mensagemWhatsapp: {
        pt: "Oi, Renilza! Li a minha proposta e quero conversar sobre o próximo passo. A proposta: {link}",
        en: "Hi Renilza! I read my proposal and I'd like to talk about the next step. The proposal: {link}",
      },
    },
    meta: {
      titulo: {
        pt: "Renilza Miranda — seu diagnóstico sob medida",
        en: "Renilza Miranda — your made-to-measure diagnosis",
      },
      // É o preview do link no WhatsApp e na bio: espelha a abertura.
      descricao: {
        pt: "Poucas perguntas, menos de três minutos. No final, um diagnóstico feito sob medida, não um resultado genérico.",
        en: "A few questions, under three minutes. At the end, a diagnosis made to measure, not a generic result.",
      },
    },
  },
};
