"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  FAIXAS_INVESTIMENTO,
  FAIXAS_POR_MOEDA,
  moedaDoIdioma,
  type Faixas,
  type Moeda,
} from "@/content/config";
import {
  MAX_PALAVRAS,
  PALAVRAS_IDENTIDADE,
  PERSONAS,
  PERSONA_KEYS,
  type PersonaKey,
} from "@/content/personas";
import { calcularGap, dinheiro } from "@/lib/gap";
import type { EtapaConfirmavel, Preenchimento } from "@/lib/confirmacao";
import {
  ETAPAS,
  PROGRESSO,
  RESPOSTAS_VAZIAS,
  emailValido,
  etapaCompleta,
  trilhaDe,
  whatsappValido,
  type Etapa,
  type Respostas,
} from "@/lib/quiz-state";
import {
  Acao,
  AcaoDiscreta,
  BotaoAudio,
  CampoAberto,
  CampoLinha,
  Folha,
  LinhaOpcao,
  Notacao,
  ReguaMedida,
  Seta,
  TracoDecisao,
  TrilhoDeGiz,
  rolarAte,
  tique,
} from "@/components/molde";
import { guardarMolde, lerMolde, limparMolde } from "@/lib/retomada";
import { useGravador } from "@/lib/gravador";
import { Comparador } from "@/components/comparador";
import { indiceOpcao } from "@/lib/cenas";
import {
  BalaoInvestimento,
  CenaAgenda,
  CenaArmarioCartoon as CenaArmario,
  CenaEscalaPreco,
  CenaEtiquetas,
  CenaMarcoPrazo,
  ComposicaoPalavras,
} from "@/components/cenas";

const MARCAS_TRILHO = ETAPAS.map((e) => PROGRESSO[e]);

interface ErrosGate {
  whatsapp: string | null;
  email: string | null;
  geral: string | null;
}

const SEM_ERROS: ErrosGate = { whatsapp: null, email: null, geral: null };

export function Quiz({ confirmacao }: { confirmacao?: Preenchimento } = {}) {
  const t = useTranslations();
  // A moeda vem do idioma em que ela está respondendo: BRL no pt-BR, USD no
  // internacional. Nada é convertido — ver o comentário em content/config.ts.
  const moeda = moedaDoIdioma(useLocale());
  const faixas = FAIXAS_POR_MOEDA[moeda];
  const [indice, setIndice] = useState(0);
  const [r, setR] = useState<Respostas>(() =>
    confirmacao
      ? // `confirmacao.nome` é campo próprio, não parte de `respostas` (que só
        // guarda as perguntas do quiz) — sem isto a peça 1 pediria o nome de
        // novo de quem já mandou áudio.
        { ...RESPOSTAS_VAZIAS, ...confirmacao.respostas, nome: confirmacao.nome }
      : RESPOSTAS_VAZIAS
  );
  // No modo confirmação o lead já existe: o autosave atualiza, não cria outro.
  const [leadId, setLeadId] = useState<string | null>(
    confirmacao?.leadId ?? null
  );
  // Etapas em que ela pediu "Ajustar": a confirmação sai e a pergunta normal
  // entra, já preenchida com o que o áudio disse.
  const [ajustando, setAjustando] = useState<Etapa[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [errosGate, setErrosGate] = useState<ErrosGate>(SEM_ERROS);
  const [urlProposta, setUrlProposta] = useState<string | null>(null);
  // Ela voltou depois de o webview descartar a aba: o molde foi restaurado do
  // aparelho dela e a tela avisa isso uma vez, em notação.
  const [retomada, setRetomada] = useState(false);
  const hidratado = useRef(false);
  const topo = useRef<HTMLDivElement>(null);

  const etapa = ETAPAS[indice];
  const persona = r.persona ? PERSONAS[r.persona] : null;
  const trilha = trilhaDe(r);
  const completa = etapaCompleta(etapa, r);

  /**
   * O trecho do áudio a confirmar nesta etapa, se houver. `undefined` aqui
   * significa "pergunte normalmente" — é o que o §9 do copy deck manda para
   * pergunta que o áudio não respondeu, e é também o que acontece depois que
   * ela clica em Ajustar.
   */
  const verbatim =
    confirmacao && !ajustando.includes(etapa)
      ? confirmacao.ouvido[etapa as EtapaConfirmavel]
      : undefined;

  const atualizar = useCallback(
    (patch: Partial<Respostas>) => setR((atual) => ({ ...atual, ...patch })),
    []
  );

  useEffect(() => {
    rolarAte(topo.current, "start");
  }, [indice]);

  /**
   * Retomada — declarada ANTES do efeito que guarda, para rodar primeiro no
   * mount: se a ordem invertesse, o estado vazio inicial sobrescreveria o
   * molde guardado antes de ele ser lido. No modo confirmação não há o que
   * retomar: o lead já existe no servidor.
   */
  useEffect(() => {
    hidratado.current = true;
    if (confirmacao) return;
    const guardado = lerMolde();
    if (!guardado) return;
    setR(guardado.respostas);
    setIndice(guardado.indice);
    if (guardado.leadId) setLeadId(guardado.leadId);
    setRetomada(true);
  }, [confirmacao]);

  useEffect(() => {
    if (!hidratado.current || confirmacao) return;
    if (etapa === "pico") {
      // Molde entregue: o rascunho local já cumpriu o papel.
      limparMolde();
      return;
    }
    guardarMolde({ indice, respostas: r, leadId });
  }, [confirmacao, etapa, indice, r, leadId]);

  /**
   * A candeia da Q3: um passo de calor dentro do noir enquanto ela escreve a
   * coisa que dói. O atributo vive no <html> porque é o body que pinta
   * --surface, e a transição de 900ms já existe lá.
   */
  useEffect(() => {
    const raiz = document.documentElement;
    if (etapa === "q3") raiz.setAttribute("data-penumbra", "");
    else raiz.removeAttribute("data-penumbra");
    return () => raiz.removeAttribute("data-penumbra");
  }, [etapa]);

  /**
   * Autosave por etapa. Se ela fechar a aba na tela 6, o que já contou não se
   * perde — e a Renilza ainda vê que alguém começou. Falha de rede aqui é
   * silenciosa de propósito: não é problema dela.
   */
  const salvar = useCallback(async () => {
    try {
      const resposta = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          leadId,
          persona: r.persona,
          // Sem isto, todo autosave regravava origem "quiz_frio" por cima
          // do lead do modo confirmação — achado consertando o F6.
          origem: confirmacao ? "confirmacao" : "quiz_frio",
          respostas: {
            situacao: r.situacao,
            situacaoOutro: r.situacaoOutro,
            q3: r.q3,
            q3Via: r.q3Via,
            consentimentoAudioEm: r.consentimentoAudioEm,
            precoAtual: r.precoAtual,
            precoDesejado: r.precoDesejado,
            volumeMensal: r.volumeMensal,
            pctUsado: r.pctUsado,
            valorParado: r.valorParado,
            palavras: r.palavras,
            q7: r.q7,
            q7Outro: r.q7Outro,
            q8: r.q8,
            q9: r.q9,
          },
        }),
      });
      if (resposta.ok) {
        const dados = (await resposta.json()) as { leadId?: string };
        if (dados.leadId) setLeadId(dados.leadId);
      }
    } catch {
      /* autosave é melhor-esforço */
    }
  }, [leadId, r, confirmacao]);

  /**
   * A confissão da Q3 é o lead parcial mais valioso do funil — se ela abandona
   * sem tocar Continuar, a frase não pode se perder. Debounce de 3s depois da
   * pausa de digitação; o efeito rearma a cada tecla.
   */
  useEffect(() => {
    if (etapa !== "q3" || r.q3.trim().length <= 2) return;
    const timer = setTimeout(() => void salvar(), 3000);
    return () => clearTimeout(timer);
  }, [etapa, r.q3, salvar]);

  function avancar() {
    if (!completa) return;
    setRetomada(false);
    void salvar();
    setIndice((i) => Math.min(i + 1, ETAPAS.length - 1));
  }

  function voltar() {
    setRetomada(false);
    setIndice((i) => Math.max(i - 1, 0));
  }

  /**
   * No gate o botão fica sempre vivo e a validação fala: botão apagado sem
   * explicação é a receita clássica de abandono na última tela. Os dois campos
   * validam juntos (as duas mensagens aparecem de uma vez, cada uma sob o seu
   * campo) e a falha de rede tem lugar próprio junto ao botão — antes ela
   * chegava como aria-invalid no telefone, lendo como "seu número está errado".
   */
  async function enviarGate() {
    if (!r.persona) return;
    const erroWhatsapp = whatsappValido(r.whatsapp)
      ? null
      : t("gate.erroWhatsapp");
    const erroEmail = emailValido(r.email) ? null : t("gate.erroEmail");
    setErrosGate({ whatsapp: erroWhatsapp, email: erroEmail, geral: null });
    if (erroWhatsapp || erroEmail) return;

    setEnviando(true);
    try {
      const resposta = await fetch("/api/proposal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          leadId,
          persona: r.persona,
          nome: r.nome,
          whatsapp: r.whatsapp,
          email: r.email.trim() || undefined,
          respostas: {
            situacao: r.situacao,
            situacaoOutro: r.situacaoOutro,
            q3: r.q3,
            // O gate precisa reenviar estes dois: o upsert do servidor grava a
            // linha inteira, então omitir aqui apagaria a evidência de
            // consentimento que o autosave já tinha guardado.
            q3Via: r.q3Via,
            consentimentoAudioEm: r.consentimentoAudioEm,
            precoAtual: r.precoAtual,
            precoDesejado: r.precoDesejado,
            volumeMensal: r.volumeMensal,
            pctUsado: r.pctUsado,
            valorParado: r.valorParado,
            palavras: r.palavras,
            q7: r.q7,
            q7Outro: r.q7Outro,
            q8: r.q8,
            q9: r.q9,
          },
        }),
      });

      if (!resposta.ok) throw new Error(String(resposta.status));
      const dados = (await resposta.json()) as { url: string };
      setUrlProposta(dados.url);
      limparMolde();
      setIndice(ETAPAS.indexOf("pico"));
    } catch {
      setErrosGate({ whatsapp: null, email: null, geral: t("gate.erroGeral") });
    } finally {
      setEnviando(false);
    }
  }

  const gap = useMemo(
    () => (trilha ? calcularGap(r, trilha) : null),
    [r, trilha]
  );

  return (
    <div
      style={
        persona
          ? ({ "--accent": persona.acento } as React.CSSProperties)
          : undefined
      }
    >
      <TrilhoDeGiz
        progresso={PROGRESSO[etapa]}
        marcas={MARCAS_TRILHO}
        rotulo={t("peca." + etapa)}
      />

      {/* min-h-svh é piso, não teto: uma tela curta centraliza como peça
          exposta; uma tela longa (o cartão-espelho, por exemplo) já é mais
          alta que o viewport e volta a fluir do topo sozinha. O respiro
          vertical encolhe no celular (p4, não p6): num viewport de ~660px
          úteis, 104px de topo empurravam a revelação do espelho e o CTA para
          fora da dobra. */}
      <main className="mx-auto flex min-h-svh w-full max-w-[var(--container-leitura)] flex-col justify-center px-p4 py-p4 sm:px-p5 sm:py-p6">
        <div ref={topo} />
        {retomada && etapa !== "pico" ? (
          <p className="notacao surgir mb-p3">{t("retomada.aviso")}</p>
        ) : null}
        <Folha>
          <div key={etapa} className="surgir">
            {etapa !== "abertura" && etapa !== "pico" ? (
              <Notacao>{t(`peca.${etapa}`)}</Notacao>
            ) : null}

            {verbatim ? (
              <CartaoOuvido
                verbatim={verbatim}
                onConfirmar={avancar}
                onAjustar={() => setAjustando((atual) => [...atual, etapa])}
              />
            ) : null}

            {verbatim ? null : (
              <>
            {etapa === "abertura" ? (
              <Abertura
                nome={confirmacao?.nome}
                valorNome={r.nome}
                onChangeNome={(v) => atualizar({ nome: v })}
              />
            ) : null}
            {etapa === "espelho" ? (
              <Espelho r={r} atualizar={atualizar} />
            ) : null}
            {etapa === "q3" && persona ? (
              <PerguntaAberta
                titulo={t(`q3.titulo.${persona.key}`)}
                sub={t("q3.sub", { nome: r.nome })}
                rotulo={t("q3.rotulo")}
                placeholder={t("q3.placeholder")}
                recibo={t("q3.recibo")}
                valor={r.q3}
                onChange={(v) => atualizar({ q3: v, q3Via: "texto" })}
                onTranscrito={(texto) =>
                  atualizar({ q3: texto, q3Via: "audio" })
                }
                onConsentimento={(em) =>
                  atualizar({ consentimentoAudioEm: em })
                }
                audioTextos={{
                  convite: t("audio.convite"),
                  consentimento: t("audio.consentimento"),
                  consentir: t("audio.consentir"),
                  recusar: t("audio.digitar"),
                  gravando: t("audio.gravando"),
                  parar: t("audio.parar"),
                  transcrevendo: t("audio.transcrevendo"),
                  erro: t("audio.erro"),
                }}
              />
            ) : null}
            {etapa === "gap" && trilha ? (
              <TelaGap
                r={r}
                trilha={trilha}
                atualizar={atualizar}
                gap={gap}
                moeda={moeda}
                faixas={faixas}
              />
            ) : null}
            {etapa === "futuro" && persona ? (
              <Futuro personaKey={persona.key} r={r} atualizar={atualizar} />
            ) : null}
            {etapa === "q7" ? <Q7 r={r} atualizar={atualizar} /> : null}
            {etapa === "q8" ? <Q8 r={r} atualizar={atualizar} /> : null}
            {etapa === "q9" && trilha ? (
              <Q9 r={r} trilha={trilha} gap={gap} atualizar={atualizar} moeda={moeda} />
            ) : null}
            {etapa === "gate" ? (
              <Gate
                r={r}
                atualizar={atualizar}
                erros={errosGate}
                limparErro={(campo) =>
                  setErrosGate((atuais) => ({ ...atuais, [campo]: null }))
                }
                onEnviar={() => void enviarGate()}
              />
            ) : null}
            {etapa === "pico" && persona ? (
              <Pico r={r} gap={gap} url={urlProposta} moeda={moeda} />
            ) : null}
              </>
            )}
          </div>
        </Folha>

        {/* Rodapé fixo do modo confirmação — §9 do copy deck. Some no pico. */}
        {confirmacao && etapa !== "pico" ? (
          <p className="notacao mt-p4">{t("confirmacao.rodape")}</p>
        ) : null}

        {etapa !== "pico" ? (
          <>
            <div className="mt-p4 flex flex-wrap items-center gap-p3 sm:mt-p5">
              {/* Confirmando, quem avança é o cartão: dois botões para a mesma
                  ação seria pedir a decisão duas vezes. O voltar continua. */}
              {verbatim ? null : etapa === "gate" ? (
                // Sempre vivo: no gate a validação explica, não bloqueia.
                // tipo=submit + form ligam o Enter/"ir" do teclado ao envio.
                <Acao
                  tipo="submit"
                  form="molde-gate"
                  carregando={enviando}
                  acentuada={Boolean(r.persona)}
                >
                  {enviando ? <RotuloEnvio /> : t("gate.cta")}
                </Acao>
              ) : (
                <Acao
                  onClick={avancar}
                  desabilitada={!completa}
                  acentuada={Boolean(r.persona)}
                >
                  {etapa !== "abertura"
                    ? t("acoes.avancar")
                    : confirmacao
                      ? t("confirmacao.cta")
                      : t("acoes.comecar")}
                </Acao>
              )}
              {indice > 0 ? (
                <AcaoDiscreta onClick={voltar}>{t("acoes.voltar")}</AcaoDiscreta>
              ) : null}
            </div>
            {etapa === "gate" && errosGate.geral ? (
              // Falha de rede mora junto do botão que falhou — não sob o
              // telefone dela, que não tem culpa.
              <p
                role="alert"
                className="surgir mt-p2"
                style={{
                  color: "var(--color-alerta)",
                  fontSize: "var(--text-apoio)",
                }}
              >
                {errosGate.geral}
              </p>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
}

/* ========================================================================== */

function Abertura({
  nome,
  valorNome,
  onChangeNome,
}: {
  nome?: string;
  /** Só usado no modo frio — no modo confirmação o nome já é conhecido. */
  valorNome?: string;
  onChangeNome?: (v: string) => void;
}) {
  const t = useTranslations();
  // Quem chegou pelo link de confirmação já mandou um áudio. Abrir com o
  // convite do quiz frio faria parecer que a mensagem dela se perdeu.
  const confirmando = Boolean(nome);
  return (
    <>
      <p className="notacao mb-p4">
        {t("marca.nome")} · {t("marca.assinatura")}
      </p>
      <h1 className="mb-p3">
        {nome ? t("confirmacao.titulo", { nome }) : t("abertura.titulo")}
      </h1>
      <p style={{ color: "var(--ink-2)" }}>
        {confirmando ? t("confirmacao.corpo") : t("abertura.corpo")}
      </p>
      {/* Pedido do Willian (10/09/2026): nome sai do gate (peça 9) e entra
          aqui — email e telefone continuam só no fim. No modo confirmação
          ela não digita nada, o nome já veio do áudio. */}
      {!confirmando && onChangeNome ? (
        <CampoLinha
          rotulo={t("abertura.nome")}
          placeholder={t("abertura.nomePlaceholder")}
          valor={valorNome ?? ""}
          nome="name"
          autoComplete="given-name"
          enterKeyHint="next"
          erro={null}
          onChange={onChangeNome}
        />
      ) : null}
      {/* A nota de privacidade vale nos dois modos. */}
      <p className="notacao mt-p3">{t("abertura.nota")}</p>
    </>
  );
}

/**
 * O padrão do §9 do copy deck: ela não responde de novo, lê o que a Renilza
 * ouviu e diz se está certo.
 *
 * "Isso mesmo" avança na hora — é a engenharia do *that's right*: concordar
 * com a própria fala pesa mais do que concordar com a nossa pergunta. O trecho
 * é literalmente o dela; parafrasear aqui destruiria o efeito e, pior, poria
 * palavra na boca de alguém.
 */
function CartaoOuvido({
  verbatim,
  onConfirmar,
  onAjustar,
}: {
  verbatim: string;
  onConfirmar: () => void;
  onAjustar: () => void;
}) {
  const t = useTranslations();
  return (
    <>
      <p className="notacao mb-p3">{t("confirmacao.ouvi")}</p>
      <blockquote
        className="mb-p3 pl-p3"
        style={{
          borderLeft: "1px solid var(--rule)",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(1.15rem, 4.6vw, 1.45rem)",
          lineHeight: 1.35,
          color: "var(--ink)",
        }}
      >
        {verbatim}
      </blockquote>
      <p className="notacao mb-p4">{t("confirmacao.confirma")}</p>
      <div className="flex flex-wrap items-center gap-p3">
        <Acao onClick={onConfirmar}>{t("acoes.confirmar")}</Acao>
        <AcaoDiscreta onClick={onAjustar}>{t("acoes.ajustar")}</AcaoDiscreta>
      </div>
    </>
  );
}

/**
 * C1 — o corte que o Conselho prescreveu: a Q2 deixou de ser tela e virou
 * sub-opção revelada dentro do cartão-espelho escolhido. Três curvas de tamanho
 * sobrepostas na mesma folha; ao escolher, duas apagam e a dela permanece.
 */
function Espelho({
  r,
  atualizar,
}: {
  r: Respostas;
  atualizar: (p: Partial<Respostas>) => void;
}) {
  const t = useTranslations();
  const escolhida = r.persona;
  const revelado = useRef<HTMLDivElement>(null);

  /**
   * Num viewport Android comum, o bloco revelado monta INTEIRO abaixo da
   * dobra: ela tocava a frase, duas apagavam e "não acontecia nada" — a
   * mecânica exata do beco-sem-saída percebido, na tela de maior risco de
   * abandono precoce. O scroll leva a folha até a segunda pergunta.
   */
  useEffect(() => {
    if (escolhida) rolarAte(revelado.current, "start");
  }, [escolhida]);

  return (
    <>
      <h2 className="mb-p2">{t("espelho.titulo")}</h2>
      <p className="notacao mb-p4">{t("espelho.sub")}</p>

      <div>
        {PERSONA_KEYS.map((chave) => {
          const ativa = escolhida === chave;
          const apagada = Boolean(escolhida) && !ativa;
          return (
            <div
              key={chave}
              style={{
                opacity: apagada ? 0.28 : 1,
                transition: "opacity 520ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  tique();
                  atualizar({
                    persona: chave as PersonaKey,
                    situacao: null,
                    situacaoOutro: "",
                  });
                }}
                aria-pressed={ativa}
                className="block w-full cursor-pointer py-p3 text-left"
              >
                <span className="flex items-start gap-p2">
                  <span className="piquete mt-2" data-marcado={ativa} />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: "clamp(1.15rem, 4.6vw, 1.45rem)",
                      lineHeight: 1.3,
                      color: ativa ? "var(--ink)" : "var(--ink-2)",
                    }}
                  >
                    {t(`espelho.cards.${chave}`)}
                  </span>
                </span>
              </button>
              <TracoDecisao marcada={ativa} />
            </div>
          );
        })}
      </div>

      {escolhida ? (
        <div ref={revelado} className="surgir mt-p4" style={{ scrollMarginTop: 24 }}>
          <p
            className="mb-p4"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              color: "var(--color-gold-hi)",
              fontSize: "1.05rem",
              lineHeight: 1.4,
            }}
          >
            {t("espelho.rotulagem", { nome: r.nome })}
          </p>

          <h3 className="mb-p3">{t(`espelho.situacaoTitulo.${escolhida}`)}</h3>
          {(t.raw(`espelho.situacoes.${escolhida}`) as string[]).map((opcao) => (
            <LinhaOpcao
              key={opcao}
              selecionada={r.situacao === opcao}
              onClick={() => atualizar({ situacao: opcao })}
            >
              {opcao}
            </LinhaOpcao>
          ))}
          <LinhaOpcao
            selecionada={r.situacao === "outro"}
            onClick={() => atualizar({ situacao: "outro" })}
          >
            {t("espelho.outraSituacao")}
          </LinhaOpcao>
          {r.situacao === "outro" ? (
            <div className="surgir mt-p3">
              <CampoAberto
                rotulo={t("espelho.outraSituacao")}
                placeholder={t("espelho.outraSituacaoPlaceholder")}
                valor={r.situacaoOutro}
                linhas={3}
                onChange={(v) => atualizar({ situacaoOutro: v })}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function PerguntaAberta({
  titulo,
  sub,
  rotulo,
  placeholder,
  recibo,
  valor,
  onChange,
  onTranscrito,
  onConsentimento,
  audioTextos,
}: {
  titulo: string;
  sub: string;
  rotulo: string;
  placeholder: string;
  /** Surge quando ela pausa de digitar: o sub abre o loop ("é essa frase que
      eu vou te devolver"), o recibo confirma que ela entrou no molde. */
  recibo?: string;
  valor: string;
  onChange: (v: string) => void;
  /** F6 — o mic é outra porta pra mesma pergunta, nunca uma segunda. */
  onTranscrito?: (texto: string) => void;
  onConsentimento?: (emISO: string) => void;
  audioTextos?: {
    convite: string;
    consentimento: string;
    consentir: string;
    recusar: string;
    gravando: string;
    parar: string;
    transcrevendo: string;
    erro: string;
  };
}) {
  const [guardou, setGuardou] = useState(false);
  const gravador = useGravador(
    (texto) => onTranscrito?.(texto),
    onConsentimento
  );

  useEffect(() => {
    setGuardou(false);
    if (valor.trim().length <= 2) return;
    const timer = setTimeout(() => setGuardou(true), 900);
    return () => clearTimeout(timer);
  }, [valor]);

  return (
    <>
      <h2 className="mb-p2">{titulo}</h2>
      <p className="notacao mb-p4">{sub}</p>
      <CampoAberto
        rotulo={rotulo}
        placeholder={placeholder}
        valor={valor}
        linhas={5}
        onChange={onChange}
      />
      {audioTextos && onTranscrito ? (
        <BotaoAudio
          estado={gravador.estado}
          suportado={gravador.suportado}
          textos={audioTextos}
          onIniciar={gravador.pedirConsentimento}
          onConsentir={gravador.consentir}
          onRecusar={gravador.recusarConsentimento}
          onParar={gravador.parar}
        />
      ) : null}
      {recibo ? (
        // Só opacidade — o espaço fica reservado para o texto não pular.
        <p
          className="notacao"
          aria-hidden={!guardou}
          style={{
            opacity: guardou ? 1 : 0,
            transition: "opacity 520ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {recibo}
        </p>
      ) : null}
    </>
  );
}

/* ==========================================================================
   ETAPA 3 — O GAP
   A margem de costura: a distância entre a linha de corte e a linha de costura.
   ========================================================================= */

function TelaGap({
  r,
  trilha,
  atualizar,
  gap,
  moeda,
  faixas: FAIXAS,
}: {
  r: Respostas;
  trilha: "precificacao" | "guarda_roupa";
  atualizar: (p: Partial<Respostas>) => void;
  gap: ReturnType<typeof calcularGap>;
  moeda: Moeda;
  faixas: Faixas;
}) {
  const t = useTranslations();
  const fmt = (v: number) => dinheiro(v, moeda);
  const secao = trilha === "guarda_roupa" ? "gap.guardaRoupa" : "gap.precificacao";

  return (
    <>
      <h2 className="mb-p2">{t(`${secao}.titulo`)}</h2>
      <p className="notacao mb-p4">{t(`${secao}.sub`)}</p>

      {trilha === "precificacao" ? (
        <>
          <ReguaMedida
            rotulo={t("gap.precificacao.precoAtual")}
            valor={r.precoAtual ?? FAIXAS.precoAtual.padrao}
            latente={r.precoAtual === null}
            min={FAIXAS.precoAtual.min}
            max={FAIXAS.precoAtual.max}
            step={FAIXAS.precoAtual.step}
            graduacoes={[FAIXAS.precoAtual.min, 2500, FAIXAS.precoAtual.max]}
            formatar={(v) => fmt(v)}
            rotuloMenos={t("regua.diminuir")}
            rotuloMais={t("regua.aumentar")}
            onChange={(v) =>
              atualizar({
                precoAtual: v,
                // O clamp só vale para o que ELA declarou. Preencher o
                // desejado com o atual quando ainda era nulo fabricava um
                // gap de R$ 0 — e a Q9 abria pedindo investimento sobre
                // "R$ 0 em doze meses".
                precoDesejado:
                  r.precoDesejado === null
                    ? null
                    : Math.max(v, r.precoDesejado),
              })
            }
          />
          <ReguaMedida
            rotulo={t("gap.precificacao.precoDesejado")}
            nota={t("gap.precificacao.precoDesejadoNota")}
            valor={
              r.precoDesejado ??
              Math.max(r.precoAtual ?? 0, FAIXAS.precoDesejado.padrao)
            }
            latente={r.precoDesejado === null}
            min={r.precoAtual ?? FAIXAS.precoDesejado.min}
            max={FAIXAS.precoDesejado.max}
            step={FAIXAS.precoDesejado.step}
            graduacoes={[r.precoAtual ?? FAIXAS.precoDesejado.min, 10000, 20000]}
            formatar={(v) => fmt(v)}
            rotuloMenos={t("regua.diminuir")}
            rotuloMais={t("regua.aumentar")}
            onChange={(v) => atualizar({ precoDesejado: v })}
          />
          {/* Escala comum das duas medidas acima — nunca duas normalizações
              independentes, ver src/components/cenas/escala-preco.tsx. */}
          <div className="mb-p4">
            <CenaEscalaPreco
              atual={r.precoAtual}
              desejado={r.precoDesejado}
              escalaMax={FAIXAS.precoDesejado.max}
              latenteAtual={r.precoAtual === null}
              latenteDesejado={r.precoDesejado === null}
            />
          </div>
          <div className="sm:flex sm:items-start sm:gap-p4">
            <div className="sm:min-w-0 sm:flex-1">
              <ReguaMedida
                rotulo={t("gap.precificacao.volumeMensal")}
                valor={r.volumeMensal ?? FAIXAS.volumeMensal.padrao}
                latente={r.volumeMensal === null}
                min={FAIXAS.volumeMensal.min}
                max={FAIXAS.volumeMensal.max}
                step={FAIXAS.volumeMensal.step}
                graduacoes={[1, 30, 60]}
                formatar={(v) => String(v)}
                rotuloMenos={t("regua.diminuir")}
                rotuloMais={t("regua.aumentar")}
                onChange={(v) => atualizar({ volumeMensal: v })}
              />
            </div>
            <div className="mb-p4 sm:mb-0 sm:w-36 sm:flex-none">
              <CenaAgenda volume={r.volumeMensal} latente={r.volumeMensal === null} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* PROTÓTIPO 07/09/2026: cena maior, acima da régua, em vez do
              lado — a ilustração cartoon é o protagonista aqui, não um
              acompanhamento pequeno. Só nesta pergunta, pra avaliação. */}
          <div className="mb-p3 sm:max-w-72">
            <CenaArmario pct={r.pctUsado} latente={r.pctUsado === null} />
          </div>
          <ReguaMedida
            rotulo={t("gap.guardaRoupa.pctUsado")}
            valor={r.pctUsado ?? FAIXAS.pctUsado.padrao}
            latente={r.pctUsado === null}
            min={FAIXAS.pctUsado.min}
            max={FAIXAS.pctUsado.max}
            step={FAIXAS.pctUsado.step}
            graduacoes={[5, 50, 100]}
            formatar={(v) => `${v}%`}
            rotuloMenos={t("regua.diminuir")}
            rotuloMais={t("regua.aumentar")}
            onChange={(v) => atualizar({ pctUsado: v })}
          />
          <div className="sm:flex sm:items-start sm:gap-p4">
            <div className="sm:min-w-0 sm:flex-1">
              <ReguaMedida
                rotulo={t("gap.guardaRoupa.valorParado")}
                valor={r.valorParado ?? FAIXAS.valorParado.padrao}
                latente={r.valorParado === null}
                min={FAIXAS.valorParado.min}
                max={FAIXAS.valorParado.max}
                step={FAIXAS.valorParado.step}
                graduacoes={[500, 20000, 40000]}
                formatar={(v) => fmt(v)}
                rotuloMenos={t("regua.diminuir")}
                rotuloMais={t("regua.aumentar")}
                onChange={(v) => atualizar({ valorParado: v })}
              />
            </div>
            <div className="mb-p4 sm:mb-0 sm:w-36 sm:flex-none">
              <CenaEtiquetas
                valor={r.valorParado}
                min={FAIXAS.valorParado.min}
                max={FAIXAS.valorParado.max}
                latente={r.valorParado === null}
                // A cifra segue a moeda que o idioma dela definiu — nada de
                // "R$" cravado numa cena que também roda em USD.
                simbolo={moeda === "BRL" ? "R$" : "$"}
              />
            </div>
          </div>
        </>
      )}

      <PainelMargem gap={gap} trilha={trilha} moeda={moeda} nome={r.nome} />
    </>
  );
}

/**
 * A margem de costura desenhada: duas linhas paralelas com a hachura entre
 * elas. O número no meio é a conta dela — C2 manda que a frase de abertura
 * diga isso em voz alta.
 */
function PainelMargem({
  gap,
  trilha,
  moeda,
  nome,
}: {
  gap: ReturnType<typeof calcularGap>;
  trilha: "precificacao" | "guarda_roupa";
  moeda: Moeda;
  nome: string;
}) {
  const t = useTranslations();
  const fmt = (v: number) => dinheiro(v, moeda);
  const secao = trilha === "guarda_roupa" ? "gap.guardaRoupa" : "gap.precificacao";

  if (!gap) {
    return (
      <p className="notacao mt-p4" style={{ color: "var(--ink-3)" }}>
        {t(`${secao}.aguardando`)}
      </p>
    );
  }

  return (
    <div className="surgir mt-p4">
      <span className="block h-px w-full" style={{ background: "var(--accent)" }} />
      <div className="hachura" style={{ height: 14 }} aria-hidden />
      <span
        className="block h-px w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, var(--rule-2) 0 5px, transparent 5px 10px)",
        }}
      />

      <p className="notacao mt-p3 mb-p2">{t(`${secao}.calculoTitulo`)}</p>

      {gap.trilha === "precificacao" && gap.unidade === 0 ? (
        // Meta igual ao preço atual: mostrar "R$ 0 por ano" no clímax da conta
        // seria transformar o momento-aha em piada. A linha convida a declarar
        // a meta real — a aritmética continua sendo dela (C2).
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1.15rem, 4.6vw, 1.5rem)",
            lineHeight: 1.35,
            color: "var(--ink-2)",
          }}
        >
          {t("gap.precificacao.semGap")}
        </p>
      ) : gap.trilha === "precificacao" ? (
        // Itálico + --color-gold-hi: o mesmo par que marca "isto é a leitura
        // do que você disse" no espelho (espelho.rotulagem). A régua acima
        // usa serif reta em --ink porque é pergunta; aqui é resposta.
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", lineHeight: 1.25 }}>
          <p
            className="medida"
            style={{ fontSize: "clamp(1.35rem, 5.5vw, 1.9rem)", color: "var(--color-gold-hi)" }}
          >
            {t("gap.precificacao.porAtendimento", { unidade: fmt(gap.unidade) })}
          </p>
          <p
            className="medida"
            style={{ fontSize: "clamp(1.15rem, 4.6vw, 1.5rem)", color: "var(--ink-2)" }}
          >
            {t("gap.precificacao.porMes", { mes: fmt(gap.mes) })}
          </p>
          <p
            className="medida"
            style={{ fontSize: "clamp(1.15rem, 4.6vw, 1.5rem)", color: "var(--ink-2)" }}
          >
            {t("gap.precificacao.porAno", { ano: fmt(gap.ano) })}
          </p>
        </div>
      ) : (
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", lineHeight: 1.25 }}>
          <p
            className="medida"
            style={{ fontSize: "clamp(1.35rem, 5.5vw, 1.9rem)", color: "var(--color-gold-hi)" }}
          >
            {t("gap.guardaRoupa.usado", { pct: gap.pctUsado })}
          </p>
          <p
            className="medida"
            style={{ fontSize: "clamp(1.15rem, 4.6vw, 1.5rem)", color: "var(--ink-2)" }}
          >
            {t("gap.guardaRoupa.adormecido", { pct: gap.pctAdormecido })}
          </p>
          <p
            className="medida"
            style={{ fontSize: "clamp(1.15rem, 4.6vw, 1.5rem)", color: "var(--ink-2)" }}
          >
            {t("gap.guardaRoupa.valor", { valor: fmt(gap.valorParado) })}
          </p>
        </div>
      )}

      {gap.trilha === "precificacao" && gap.unidade === 0 ? null : (
        <p
          className="mt-p3"
          style={{ color: "var(--ink-3)", fontSize: "var(--text-apoio)" }}
        >
          {t(`${secao}.nota`, { nome })}
        </p>
      )}
    </div>
  );
}

/* ========================================================================== */

function Futuro({
  personaKey,
  r,
  atualizar,
}: {
  personaKey: PersonaKey;
  r: Respostas;
  atualizar: (p: Partial<Respostas>) => void;
}) {
  const t = useTranslations();
  const cheio = r.palavras.length >= MAX_PALAVRAS;

  function alternar(palavra: (typeof PALAVRAS_IDENTIDADE)[number]) {
    const tem = r.palavras.includes(palavra);
    if (tem) {
      tique();
      atualizar({ palavras: r.palavras.filter((p) => p !== palavra) });
    } else if (!cheio) {
      tique();
      atualizar({ palavras: [...r.palavras, palavra] });
    }
  }

  return (
    <>
      <p
        className="mb-p3"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "var(--ink-2)",
          fontSize: "1.05rem",
        }}
      >
        {t(`futuro.sub.${personaKey}`)}
      </p>
      <h2 className="mb-p2">{t("futuro.titulo")}</h2>
      <p className="notacao mb-p4">{t("futuro.instrucao")}</p>

      <div className="flex flex-wrap gap-x-p4 gap-y-p2">
        {PALAVRAS_IDENTIDADE.map((palavra) => {
          const sel = r.palavras.includes(palavra);
          const bloqueada = cheio && !sel;
          return (
            <button
              key={palavra}
              type="button"
              onClick={() => alternar(palavra)}
              aria-pressed={sel}
              disabled={bloqueada}
              className="cursor-pointer py-p1"
              style={{ minHeight: 44, opacity: bloqueada ? 0.3 : 1 }}
            >
              <span className="flex items-center gap-p1">
                {/* O piquete CRESCE ao marcar (scaleY), a mesma gramática de
                    `LinhaOpcao` — a seleção nunca depende só da cor: o
                    sublinhado (borda) e o tamanho do piquete mudam junto. */}
                <span
                  className="piquete"
                  data-marcado={sel}
                  style={{
                    transform: `scaleY(${sel ? 1.45 : 1})`,
                    transformOrigin: "top",
                    transition: "transform 220ms ease, background 220ms ease",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    color: sel ? "var(--ink)" : "var(--ink-2)",
                    borderBottom: sel
                      ? "1px solid var(--accent)"
                      : "1px solid transparent",
                    paddingBottom: 2,
                  }}
                >
                  {t(`futuro.palavras.${palavra}`)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* "Mais 3 palavras" antes de qualquer escolha era ruído: a instrução
          acima já diz tudo. O contador entra com a primeira marca; cheio, ele
          explica que dá para trocar — as apagadas a 0.3 não se explicavam. */}
      {r.palavras.length > 0 ? (
        <p className="notacao mt-p4">
          {cheio
            ? t("futuro.trocar")
            : t("futuro.restante", { n: MAX_PALAVRAS - r.palavras.length })}
        </p>
      ) : null}

      {/* A pequena composição tipográfica — as mesmas palavras já legíveis
          na grade acima, reunidas como assinatura. Decorativa aqui: o texto
          acessível já existe nos botões. */}
      {r.palavras.length > 0 ? (
        <div className="mt-p4">
          <ComposicaoPalavras
            palavras={r.palavras.map((p) => t(`futuro.palavras.${p}`))}
            decorativa
          />
        </div>
      ) : null}
    </>
  );
}

function Q7({
  r,
  atualizar,
}: {
  r: Respostas;
  atualizar: (p: Partial<Respostas>) => void;
}) {
  const t = useTranslations();
  return (
    <>
      <h2 className="mb-p4">{t("q7.titulo")}</h2>
      {(t.raw("q7.opcoes") as string[]).map((opcao) => (
        <LinhaOpcao
          key={opcao}
          selecionada={r.q7 === opcao}
          onClick={() => atualizar({ q7: opcao })}
        >
          {opcao}
        </LinhaOpcao>
      ))}
      <LinhaOpcao
        selecionada={r.q7 === "outro"}
        onClick={() => atualizar({ q7: "outro" })}
      >
        {t("q7.outro")}
      </LinhaOpcao>
      {r.q7 === "outro" ? (
        <div className="surgir mt-p3">
          <CampoAberto
            rotulo={t("q7.outro")}
            placeholder={t("q7.outroPlaceholder")}
            valor={r.q7Outro}
            linhas={3}
            onChange={(v) => atualizar({ q7Outro: v })}
          />
        </div>
      ) : null}
    </>
  );
}

function Q8({
  r,
  atualizar,
}: {
  r: Respostas;
  atualizar: (p: Partial<Respostas>) => void;
}) {
  const t = useTranslations();
  const opcoes = t.raw("q8.opcoes") as string[];
  return (
    <>
      <h2 className="mb-p4">{t("q8.titulo")}</h2>
      {opcoes.map((opcao) => (
        <LinhaOpcao
          key={opcao}
          selecionada={r.q8 === opcao}
          onClick={() => atualizar({ q8: opcao })}
        >
          {opcao}
        </LinhaOpcao>
      ))}
      <div className="mt-p2">
        <CenaMarcoPrazo total={opcoes.length} indice={indiceOpcao(opcoes, r.q8)} />
      </div>
    </>
  );
}

function Q9({
  r,
  trilha,
  gap,
  atualizar,
  moeda,
}: {
  r: Respostas;
  trilha: "precificacao" | "guarda_roupa";
  gap: ReturnType<typeof calcularGap>;
  atualizar: (p: Partial<Respostas>) => void;
  moeda: Moeda;
}) {
  const t = useTranslations();
  const fmt = (v: number) => dinheiro(v, moeda);

  const titulo =
    gap?.trilha === "guarda_roupa"
      ? t("q9.titulo.guardaRoupa", { valor: fmt(gap.valorParado) })
      : gap?.trilha === "precificacao"
        ? gap.ano > 0
          ? t("q9.titulo.precificacao", { ano: fmt(gap.ano) })
          : // Meta igual ao atual: abrir o pedido de investimento com
            // "R$ 0 em doze meses" desmontaria a tela. Pergunta direta.
            t("q9.tituloSemGap")
        : // Sem gap calculado, a pergunta direta também serve. A versão antiga
          // preenchia o valor com um travessão e exibia "há — adormecidos no
          // seu armário".
          t("q9.tituloSemGap");

  return (
    <>
      <h2 className="mb-p2">{titulo}</h2>
      <p className="notacao mb-p4">{t("q9.sub")}</p>
      {/* Guarda a CHAVE da faixa, não o rótulo: é ela que decide qual produto
          o Bloco 7 oferta (OFERTA_POR_FAIXA em content/config.ts). Casar por
          texto quebraria na primeira revisão de copy — ou na tradução. */}
      {FAIXAS_INVESTIMENTO.map((faixa) => (
        <LinhaOpcao
          key={faixa}
          selecionada={r.q9 === faixa}
          onClick={() => atualizar({ q9: faixa })}
        >
          {t(`q9.opcoes.${faixa}`)}
        </LinhaOpcao>
      ))}
      {/* Uma frase por faixa (07/09/2026) — a chave é a própria faixa, então
          copy nova entra em messages/pt.json sem tocar em código. */}
      {r.q9 ? <BalaoInvestimento texto={t(`q9.balao.${r.q9}`)} /> : null}
    </>
  );
}

/**
 * O primeiro trecho do que ela confessou na Q3 — uma frase, truncada em limite
 * de palavra. Volta como epígrafe do gate: no ponto de maior atrito do funil
 * (entregar o WhatsApp), desistir vira desistir da frase DELA, não do
 * formulário de alguém. Material 100% dela; nada inventado.
 */
/**
 * As opções de lista chegam capitalizadas ("Nas próximas 2 a 4 semanas"), e
 * elas entram no MEIO das frases de leitura do Pico. Sem isto sai "você marcou
 * Nas próximas 2 a 4 semanas".
 */
function minuscula(texto: string): string {
  return texto.charAt(0).toLowerCase() + texto.slice(1);
}

/** "elegante, autoridade e memorável" — vírgula até a última, que leva "e". */
function listar(itens: string[]): string {
  if (itens.length <= 1) return itens[0] ?? "";
  return `${itens.slice(0, -1).join(", ")} e ${itens.at(-1)}`;
}

function primeiraFrase(texto: string, limite = 110): string {
  const linha = texto.trim().split(/\n+/)[0] ?? "";
  const fim = linha.search(/[.!?…]/);
  const frase = (fim >= 0 ? linha.slice(0, fim + 1) : linha).trim();
  if (frase.length <= limite) return frase;
  const corte = frase.slice(0, limite);
  const ultimoEspaco = corte.lastIndexOf(" ");
  return `${corte.slice(0, ultimoEspaco > 60 ? ultimoEspaco : limite).trimEnd()}…`;
}

function Gate({
  r,
  atualizar,
  erros,
  limparErro,
  onEnviar,
}: {
  r: Respostas;
  atualizar: (p: Partial<Respostas>) => void;
  erros: ErrosGate;
  limparErro: (campo: "whatsapp" | "email") => void;
  onEnviar: () => void;
}) {
  const t = useTranslations();
  const confissao = primeiraFrase(r.q3);
  return (
    <>
      {confissao ? (
        <blockquote
          className="mb-p3 pl-p3"
          style={{
            borderLeft: "1px solid var(--rule)",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1.05rem, 4.4vw, 1.3rem)",
            lineHeight: 1.4,
            color: "var(--ink-2)",
          }}
        >
          “{confissao}”
        </blockquote>
      ) : null}
      <h2 className="mb-p4">{t("gate.titulo")}</h2>
      {/* O <form> dá o submit pelo Enter/"ir" do teclado (o botão lá embaixo
          aponta para cá via form="molde-gate") e melhora a heurística de
          autofill dos webviews, que costumam ignorar campo solto. */}
      <form
        id="molde-gate"
        onSubmit={(e) => {
          e.preventDefault();
          onEnviar();
        }}
      >
        <CampoLinha
          rotulo={t("gate.whatsapp")}
          placeholder={t("gate.whatsappPlaceholder")}
          valor={r.whatsapp}
          tipo="tel"
          nome="tel"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="next"
          erro={erros.whatsapp}
          onChange={(v) => {
            limparErro("whatsapp");
            atualizar({ whatsapp: v });
          }}
        />
        <CampoLinha
          rotulo={t("gate.email")}
          placeholder={t("gate.emailPlaceholder")}
          valor={r.email}
          tipo="email"
          nome="email"
          inputMode="email"
          autoComplete="email"
          enterKeyHint="go"
          erro={erros.email}
          onChange={(v) => {
            limparErro("email");
            atualizar({ email: v });
          }}
        />
      </form>
      <p
        className="mt-p3"
        style={{ color: "var(--ink-2)", fontSize: "var(--text-apoio)" }}
      >
        {t("gate.nota")}
      </p>
      <p
        className="mt-p2"
        style={{ color: "var(--ink-3)", fontSize: "var(--text-micro)", lineHeight: 1.6 }}
      >
        {t("gate.privacidade")}
      </p>
    </>
  );
}

/**
 * O trabalho visível do envio: as fases espelham o pipeline real (ler →
 * medir → traçar; a geração leva segundos de verdade) e avançam por tempo
 * decorrido, sem nenhum delay artificial — se a resposta chega em 800ms, ela
 * só vê a primeira. Buell & Norton: esforço operacional mostrado durante a
 * espera aumenta o valor percebido do resultado. Aqui é transparência.
 */
function RotuloEnvio() {
  const t = useTranslations();
  const [fase, setFase] = useState(0);

  useEffect(() => {
    const inicio = Date.now();
    const timer = setInterval(() => {
      const s = (Date.now() - inicio) / 1000;
      setFase(s >= 2.8 ? 2 : s >= 1.2 ? 1 : 0);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <span key={fase} className="surgir">
      {t(`gate.enviando${fase + 1}`)}
    </span>
  );
}

/**
 * O pico. A peak-end rule manda terminar aqui, no reveal — não no formulário.
 *
 * É o único quadro onde as duas tintas se encontram de propósito: a linha de
 * corte do Comparador é o acento DELA; a borda do CTA é o ouro DA CASA — a
 * casa entregando a peça costurada com a linha dela. Antes desta tela o ouro
 * só existiu como filete e rotulagem (gramática registrada no DESIGN.md).
 */
function Pico({
  r,
  gap,
  url,
  moeda,
}: {
  r: Respostas;
  gap: ReturnType<typeof calcularGap>;
  url: string | null;
  moeda: Moeda;
}) {
  const t = useTranslations();
  const fmt = (v: number) => dinheiro(v, moeda);
  const palavrasLegiveis = r.palavras.map((p) => t(`futuro.palavras.${p}`));

  /**
   * A leitura do que ela contou, em prosa, dentro do próprio cartão.
   *
   * Não é o texto das perguntas repetido de volta: é a devolutiva de quem
   * ouviu. Cada frase só existe se o dado por trás dela existe (o `filter` no
   * fim não é defesa contra `undefined`, é o Princípio 2 do PRODUCT.md escrito
   * em código). Por isso os dois lados são assimétricos de propósito: não há
   * "% de armário desejado" nem faturamento projetado, porque ela nunca
   * declarou nenhum dos dois.
   */
  const situacaoDita = r.situacao === "outro" ? r.situacaoOutro : r.situacao;
  const leituraHoje = [
    r.persona &&
      (situacaoDita
        ? t("pico.leitura.abertura", {
            frase: t(`espelho.cards.${r.persona}`),
            situacao: minuscula(situacaoDita),
          })
        : t("pico.leitura.aberturaSemSituacao", {
            frase: t(`espelho.cards.${r.persona}`),
          })),
    gap?.trilha === "precificacao" &&
      t("pico.leitura.numerosPreco", {
        preco: fmt(gap.precoAtual),
        volume: gap.volumeMensal,
      }),
    gap?.trilha === "guarda_roupa" &&
      t("pico.leitura.numerosGuardaRoupa", { pct: gap.pctUsado }),
    // A resposta da Q7 é escrita em primeira pessoa ("Comprei roupas..."), então
    // ela entra entre aspas: embutida na frase sem isso, a pessoa do verbo
    // quebrava ("você já tinha tentado: comprei roupas").
    r.q7 &&
      t("pico.leitura.tentou", {
        tentou: r.q7 === "outro" ? r.q7Outro : r.q7,
      }),
  ].filter((frase): frase is string => Boolean(frase));

  const leituraFuturo = [
    palavrasLegiveis.length > 0 &&
      t("pico.leitura.palavras", { palavras: listar(palavrasLegiveis) }),
    // A diferença por ano é aritmética dela sobre números dela: não é projeção
    // de faturamento nem promessa de ganho (C2), é a subtração que ela mesma
    // montou arrastando as réguas.
    gap?.trilha === "precificacao" &&
      (gap.ano > 0
        ? t("pico.leitura.metaPreco", {
            meta: fmt(gap.precoDesejado),
            ano: fmt(gap.ano),
          })
        : t("pico.leitura.metaSemGap", { meta: fmt(gap.precoDesejado) })),
    gap?.trilha === "guarda_roupa" &&
      t("pico.leitura.adormecido", { valor: fmt(gap.valorParado) }),
    r.q8 && t("pico.leitura.prazo", { prazo: minuscula(r.q8) }),
  ].filter((frase): frase is string => Boolean(frase));

  return (
    <>
      <Notacao>{t("peca.pico")}</Notacao>
      <h2 className="mb-p4">{t("pico.titulo", { nome: r.nome })}</h2>
      <Comparador
        verbatim={r.q3}
        // A chave crua vinha sem acento ("memoravel", "inevitavel") a 2rem no
        // reveal de uma marca que vende percepção. O texto exibível mora nas
        // messages, como todo texto.
        palavras={palavrasLegiveis}
        gap={gap}
        moeda={moeda}
        rotuloHoje={t("pico.hoje")}
        rotuloFuturo={t("pico.futuro")}
        leituraHoje={leituraHoje}
        leituraFuturo={leituraFuturo}
      />
      {url ? (
        <div className="mt-p5">
          {/* Experimento 07/09/2026: unificado com o CTA padrão (Acao) —
              mesmo preenchimento --color-cta e canto de 10px. Antes este era
              o único botão com borda dourada ("a casa entrega com a linha
              dela" — DESIGN.md, gramática das duas tintas); a unificação
              troca aquele momento sutil por reconhecimento consistente do
              botão ao longo de todo o funil. Registrado, não perdido: se
              quiser o gesto de volta, é só devolver `border`/`borderRadius`
              aos valores antigos aqui. */}
          <a
            href={url}
            className="notacao inline-flex items-center gap-p2 px-p4 py-p3"
            style={{
              background: "var(--color-cta)",
              color: "var(--color-cta-ink)",
              border: "1px solid var(--color-cta)",
              borderRadius: "var(--radius-cta)",
              minHeight: 56,
              textDecoration: "none",
            }}
          >
            {t("pico.cta")} <Seta />
          </a>
        </div>
      ) : null}
    </>
  );
}
