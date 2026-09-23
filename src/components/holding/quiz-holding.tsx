"use client";

import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { moedaDe, txt, type Cliente, type Idioma, type Texto } from "@/content/clientes";
import {
  CENA_LIVRE,
  RESPOSTAS_VAZIAS,
  cenaLivreDisponivel,
  contaDaMedida,
  emailValido,
  escolherCena,
  mundoDaTela,
  posicaoNoContador,
  telaCompleta,
  telasDe,
  totalDePecas,
  vertenteDaCena,
  vertenteDisponivel,
  vertentesDisponiveis,
  whatsappValido,
  type RespostasEnviadas,
  type RespostasHolding,
  type Tela,
  type ValorResposta,
} from "@/lib/fluxo";
import { dinheiro } from "@/lib/gap";
import { guardarMoldeHolding, lerMoldeHolding } from "@/lib/retomada";
import { ID_CASA } from "@/lib/mundos-css";
import { Link } from "@/i18n/navigation";
import { SeletorIdioma } from "@/components/controles-topo";
import { BarraDaFaixa, FiguraDaFaixa, FiguraDoPainel, Templo, prefereMenosMovimento } from "./figuras";
import { Icone, SetaAvancar } from "./icones";
import { Logo } from "./logo";
import { CorpoDaPergunta, Opcoes, Rico, opcoesExibidas } from "./perguntas";

type EstadoProposta = "ociosa" | "gerando" | "pronta" | "erro";

/** WhatsApp e e-mail só saem no gate — o autosave nunca os carrega. */
function enviaveis(r: RespostasHolding): RespostasEnviadas {
  return {
    nome: r.nome,
    entrada: r.entrada,
    cena: r.cena,
    livre: r.livre,
    ramo: r.ramo,
    viaAberta: r.viaAberta,
    consentimentoAudioEm: r.consentimentoAudioEm,
    prazo: r.prazo,
  };
}

function lerUtm(): Record<string, string> | undefined {
  try {
    const p = new URLSearchParams(window.location.search);
    const utm = {
      source: p.get("utm_source") ?? undefined,
      medium: p.get("utm_medium") ?? undefined,
      campaign: p.get("utm_campaign") ?? undefined,
    };
    const limpo = Object.fromEntries(
      Object.entries(utm).filter((e): e is [string, string] => typeof e[1] === "string").map(([k, v]) => [k, v.slice(0, 120)])
    );
    return Object.keys(limpo).length ? limpo : undefined;
  } catch {
    return undefined;
  }
}

/**
 * O diagnóstico da holding: nome → cena → ramo da vertente → gate → prazo →
 * montando → fim. Tudo o que a tela diz sai de `cliente`; este componente só
 * sabe andar pelas telas que `telasDe` devolve.
 *
 * `cliente` chega por prop, resolvido pelo domínio no servidor (a página que
 * renderiza este componente decide qual — `src/lib/tenants.ts`), não mais
 * importado como um global fixo no bundle: um domínio, um cliente, sem
 * recompilar.
 */
export function QuizHolding({
  idioma,
  cliente,
  vertenteDireta,
}: {
  idioma: Idioma;
  cliente: Cliente;
  /** Entrada de campanha (`/v/<vertente>`): pula a cena. */
  vertenteDireta?: string;
}) {
  const moeda = moedaDe(cliente, idioma);
  const inicial = useMemo<RespostasHolding>(
    () =>
      vertenteDireta ? { ...RESPOSTAS_VAZIAS, entrada: "direta", cena: vertenteDireta } : RESPOSTAS_VAZIAS,
    [vertenteDireta]
  );

  const [r, setR] = useState<RespostasHolding>(inicial);
  const [indice, setIndice] = useState(0);
  const [urlProposta, setUrlProposta] = useState<string | null>(null);
  const [proposta, setProposta] = useState<EstadoProposta>("ociosa");
  const [recibo, setRecibo] = useState<{ texto: string; chave: number } | null>(null);
  const [erroGate, setErroGate] = useState<Texto | null>(null);
  const [restaurado, setRestaurado] = useState(false);

  const leadRef = useRef<string | null>(null);
  const fila = useRef<Promise<unknown>>(Promise.resolve());
  const utm = useRef<Record<string, string> | undefined>(undefined);
  const topo = useRef<HTMLDivElement>(null);

  const telas = telasDe(cliente, r);
  const tela: Tela = telas[Math.min(indice, telas.length - 1)];
  const vertente = vertenteDaCena(cliente, r.cena);
  const mundo = mundoDaTela(cliente, tela, r);
  const noCasa = tela.tipo === "nome" || tela.tipo === "cena";
  const total = totalDePecas(cliente, r, moeda);
  const posicao = posicaoNoContador(telas, indice, total);
  const abertos = vertentesDisponiveis(cliente, moeda);

  /* ---------------------------------------------------------------- retomada */

  useEffect(() => {
    utm.current = lerUtm();
    const molde = lerMoldeHolding(cliente, moeda);
    // Link de campanha manda: um molde de outro ramo não sequestra a entrada.
    if (molde && (!vertenteDireta || molde.respostas.cena === vertenteDireta)) {
      setR(molde.respostas);
      setIndice(molde.indice);
      leadRef.current = molde.leadId;
      if (molde.urlProposta) {
        setUrlProposta(molde.urlProposta);
        setProposta("pronta");
      }
    }
    setRestaurado(true);
    // Só no mount: a retomada é do que estava no aparelho quando ela chegou.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!restaurado) return;
    guardarMoldeHolding({
      cliente: cliente.id,
      versaoFluxo: cliente.versaoFluxo,
      indice,
      respostas: r,
      leadId: leadRef.current,
      moeda,
      urlProposta,
    });
  }, [restaurado, cliente, indice, r, moeda, urlProposta]);

  useEffect(() => {
    if (!restaurado) return;
    window.scrollTo({ top: 0, behavior: prefereMenosMovimento() ? "auto" : "smooth" });
    topo.current?.focus({ preventScroll: true });
  }, [indice, restaurado]);

  /* ---------------------------------------------------------------- servidor */

  const salvar = useCallback(
    (atual: RespostasHolding) => {
      fila.current = fila.current
        .then(async () => {
          const res = await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              versao: 2,
              leadId: leadRef.current,
              nome: atual.nome.trim() || undefined,
              idioma,
              respostas: enviaveis(atual),
              utm: utm.current,
            }),
          });
          if (!res.ok) return;
          const dados = (await res.json()) as { leadId?: string };
          if (dados.leadId) leadRef.current = dados.leadId;
        })
        .catch(() => {
          /* autosave é melhor-esforço: o gate refaz tudo */
        });
    },
    [idioma]
  );

  const gerarProposta = useCallback(
    (atual: RespostasHolding) => {
      setProposta("gerando");
      fila.current = fila.current
        .then(async () => {
          const res = await fetch("/api/proposal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              versao: 2,
              leadId: leadRef.current,
              nome: atual.nome.trim(),
              whatsapp: atual.whatsapp,
              email: atual.email.trim() || undefined,
              idioma,
              respostas: enviaveis(atual),
            }),
          });
          if (!res.ok) throw new Error(String(res.status));
          const dados = (await res.json()) as { leadId: string; url: string };
          leadRef.current = dados.leadId;
          setUrlProposta(dados.url);
          setProposta("pronta");
        })
        .catch(() => setProposta("erro"));
    },
    [idioma]
  );

  /* ---------------------------------------------------------------- navegação */

  const reciboDe = useCallback(
    (t: Tela): Texto | null => {
      const lista =
        t.tipo === "cena"
          ? cliente.textos.recibos.cena
          : t.tipo === "pergunta"
            ? cliente.textos.recibos[t.pergunta.tipo]
            : null;
      return lista ? lista[indice % lista.length] : null;
    },
    [cliente, indice]
  );

  function podeAvancar(): boolean {
    if (tela.tipo === "prazo") return r.prazo !== null;
    // E-mail é opcional: incompleto não trava o botão calado — o clique
    // mostra o que falta (enviarGate).
    if (tela.tipo === "gate") return whatsappValido(r.whatsapp);
    return telaCompleta(cliente, tela, r, moeda);
  }

  function avancar() {
    if (!podeAvancar() || proposta === "gerando") return;
    if (tela.tipo === "gate") return enviarGate();
    const rt = reciboDe(tela);
    setRecibo(rt ? { texto: txt(rt, idioma), chave: indice } : null);
    setIndice(indice + 1);
    if (tela.tipo !== "montando" && tela.tipo !== "fim") salvar(r);
  }

  function voltar() {
    setRecibo(null);
    setErroGate(null);
    setIndice(Math.max(0, indice - 1));
  }

  function enviarGate() {
    if (!whatsappValido(r.whatsapp)) return setErroGate(cliente.textos.gate.erroWhatsapp);
    if (!emailValido(r.email)) return setErroGate(cliente.textos.gate.erroEmail);
    setErroGate(null);
    setRecibo(null);
    gerarProposta(r);
    setIndice(indice + 1);
  }

  function pularPrazo() {
    setR((x) => ({ ...x, prazo: null }));
    setRecibo(null);
    setIndice(indice + 1);
  }

  function responder(id: string, valor: ValorResposta) {
    setR((x) => ({ ...x, ramo: { ...x.ramo, [id]: valor } }));
  }

  /* ---------------------------------------------------------------- telas */

  if (!abertos.length || (vertente && !vertenteDisponivel(vertente, moeda))) {
    return <Indisponivel idioma={idioma} cliente={cliente} />;
  }

  const primeiroNome = r.nome.trim().split(/\s+/)[0] ?? "";
  const indicePrimeiraPergunta = telas.findIndex((t) => t.tipo === "pergunta");
  const ultimaPergunta = tela.tipo === "pergunta" && telas[indice + 1]?.tipo === "gate";
  const liberado = podeAvancar();
  const posGate = tela.tipo === "prazo" || tela.tipo === "montando" || tela.tipo === "fim";
  const figura = noCasa ? null : (vertente?.figura ?? null);
  const comIcone = mundo.iconesNasOpcoes;
  const t = cliente.textos;

  const fraseDela = (() => {
    const aberta = vertente?.perguntas.find((p) => p.tipo === "aberta");
    const escrita = aberta ? r.ramo[aberta.id] : undefined;
    if (typeof escrita === "string" && escrita.trim()) return escrita.trim();
    if (r.cena === CENA_LIVRE && r.livre.trim()) return r.livre.trim();
    return vertente ? txt(vertente.cena.citacao ?? vertente.cena.texto, idioma) : "";
  })();

  let meta: string | null = null;
  if (tela.tipo === "pergunta") {
    if (indice === indicePrimeiraPergunta) meta = txt(t.comum.dotado, idioma, { total, feitas: posicao - 1 });
    else if (ultimaPergunta) meta = txt(t.comum.ultima, idioma);
    else if (posicao === total - 2) meta = txt(t.comum.faltamDuas, idioma);
  }

  const rotuloCta =
    tela.tipo === "nome"
      ? txt(t.abertura.cta, idioma)
      : tela.tipo === "gate"
        ? txt(proposta === "gerando" ? t.gate.enviando : t.gate.cta, idioma)
        : tela.tipo === "prazo"
          ? txt(t.prazo.cta, idioma)
          : ultimaPergunta
            ? txt(t.comum.ultimaPergunta, idioma)
            : txt(t.comum.avancar, idioma);

  const contador = txt(t.comum.progresso, idioma, { n: posicao, total });

  return (
    <div data-vertente={noCasa ? ID_CASA : vertente?.id} data-gesto={mundo.gesto} className="h-mundo">
      <div className="h-grade">
        <Painel
          idioma={idioma}
          cliente={cliente}
          tela={tela}
          temCena={r.entrada === "cena"}
          figura={figura}
          icone={noCasa ? null : (vertente?.cena.icone ?? null)}
          posicao={posicao}
          total={total}
        />

        <main className="h-folha">
          <div className="h-topo">
            <SeletorIdioma rotulo={txt(t.idioma, idioma)} />
          </div>

          {tela.tipo !== "nome" ? (
            <>
              <div className="h-faixa">
                <div>
                  <div className="h-faixa-nome">{cliente.marca.nome}</div>
                  <div className="h-faixa-n">{contador}</div>
                </div>
                <FiguraDaFaixa figura={figura} posicao={posicao} total={total} />
              </div>
              <BarraDaFaixa figura={figura} posicao={posicao} total={total} />
              <p className="h-contador-desk">{contador}</p>
            </>
          ) : null}

          <div ref={topo} tabIndex={-1} key={indice} className="h-miolo h-vira" style={{ outline: "none" }}>
            {recibo ? (
              <p key={recibo.chave} className="h-recibo" role="status">
                {recibo.texto}
              </p>
            ) : null}

            {figura === "templo" && (tela.tipo === "pergunta" || tela.tipo === "gate") ? (
              <div className="h-templo-corpo">
                <Templo posicao={posicao} total={total} />
              </div>
            ) : null}

            {tela.tipo === "nome" ? (
              <TelaNome
                idioma={idioma}
                cliente={cliente}
                nome={r.nome}
                onNome={(nome) => setR((x) => ({ ...x, nome }))}
                onEnter={avancar}
              />
            ) : null}

            {tela.tipo === "cena" ? (
              <TelaCena
                idioma={idioma}
                cliente={cliente}
                r={r}
                nome={primeiroNome}
                cenas={[
                  ...abertos.map((v) => ({ id: v.id, texto: v.cena.texto, icone: v.cena.icone })),
                  ...(cenaLivreDisponivel(cliente, moeda)
                    ? [{ id: CENA_LIVRE, texto: cliente.cenaLivre.texto, icone: cliente.cenaLivre.icone }]
                    : []),
                ]}
                onCena={(cena) => setR((x) => escolherCena(cliente, x, cena))}
                onLivre={(livre) => setR((x) => ({ ...x, livre }))}
              />
            ) : null}

            {tela.tipo === "pergunta" ? (
              <>
                {meta ? <p className="h-meta">{meta}</p> : null}
                <p className="h-kicker">{txt(tela.pergunta.kicker, idioma)}</p>
                <h1 className="h-titulo">
                  <Rico texto={txt(tela.pergunta.titulo, idioma)} />
                </h1>
                {tela.pergunta.apoio ? <p className="h-apoio">{txt(tela.pergunta.apoio, idioma)}</p> : null}
                <CorpoDaPergunta
                  cliente={cliente}
                  pergunta={tela.pergunta}
                  idioma={idioma}
                  moeda={moeda}
                  valor={r.ramo[tela.pergunta.id]}
                  comIcone={comIcone}
                  onResponder={(v) => {
                    responder(tela.pergunta.id, v);
                    if (tela.pergunta.tipo === "aberta") setR((x) => ({ ...x, viaAberta: x.viaAberta ?? "texto" }));
                  }}
                  onTranscrito={(texto) =>
                    setR((x) => ({ ...x, viaAberta: "audio", ramo: { ...x.ramo, [tela.pergunta.id]: texto } }))
                  }
                  onConsentimento={(em) => setR((x) => ({ ...x, consentimentoAudioEm: x.consentimentoAudioEm ?? em }))}
                />
              </>
            ) : null}

            {tela.tipo === "gate" ? (
              <TelaGate
                idioma={idioma}
                cliente={cliente}
                nome={primeiroNome}
                frase={fraseDela}
                r={r}
                erro={erroGate}
                onContato={(parcial) => {
                  setErroGate(null);
                  setR((x) => ({ ...x, ...parcial }));
                }}
              />
            ) : null}

            {tela.tipo === "prazo" ? (
              <>
                <p className="h-kicker">{txt(t.prazo.kicker, idioma)}</p>
                <h1 className="h-titulo">{txt(t.prazo.titulo, idioma)}</h1>
                <p className="h-apoio">{txt(t.prazo.apoio, idioma)}</p>
                <Opcoes
                  rotulo={txt(t.prazo.titulo, idioma)}
                  opcoes={opcoesExibidas(t.prazo.opcoes, idioma)}
                  selecionada={r.prazo}
                  onEscolher={(prazo) => setR((x) => ({ ...x, prazo }))}
                  comIcone={comIcone}
                />
              </>
            ) : null}

            {tela.tipo === "montando" ? (
              <Montando
                idioma={idioma}
                cliente={cliente}
                proposta={proposta}
                onPronto={() => setIndice((i) => i + 1)}
                onVoltarAoGate={() => {
                  setProposta("ociosa");
                  setIndice(telas.findIndex((x) => x.tipo === "gate"));
                }}
              />
            ) : null}

            {tela.tipo === "fim" ? (
              <TelaFim
                idioma={idioma}
                cliente={cliente}
                r={r}
                nome={primeiroNome}
                frase={fraseDela}
                urlProposta={urlProposta}
              />
            ) : null}

            {tela.tipo !== "montando" && tela.tipo !== "fim" ? (
              <div className="h-acoes">
                <button
                  type="button"
                  className="h-cta"
                  aria-disabled={!liberado || proposta === "gerando"}
                  onClick={avancar}
                >
                  {rotuloCta} <SetaAvancar />
                </button>
                {tela.tipo === "prazo" ? (
                  <button type="button" className="h-link" onClick={pularPrazo}>
                    {txt(t.prazo.pular, idioma)}
                  </button>
                ) : null}
                {indice > 0 && !posGate ? (
                  <button type="button" className="h-link" onClick={voltar}>
                    {txt(t.comum.voltar, idioma)}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ==========================================================================
   Telas
   ========================================================================= */

function TelaNome({
  idioma,
  cliente,
  nome,
  onNome,
  onEnter,
}: {
  idioma: Idioma;
  cliente: Cliente;
  nome: string;
  onNome: (v: string) => void;
  onEnter: () => void;
}) {
  const a = cliente.textos.abertura;
  return (
    <>
      <Logo idioma={idioma} cliente={cliente} />
      <h1 className="h-titulo h-titulo-abertura">{txt(a.titulo, idioma)}</h1>
      <p className="h-apoio">{txt(a.apoio, idioma)}</p>
      <div className="h-campo-grupo">
        <label htmlFor="h-nome">{txt(a.rotuloNome, idioma)}</label>
        <input
          id="h-nome"
          className="h-campo"
          type="text"
          autoComplete="given-name"
          maxLength={120}
          placeholder={txt(a.placeholderNome, idioma)}
          value={nome}
          onChange={(e) => onNome(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onEnter();
          }}
        />
      </div>
      <p className="h-nota">{txt(a.nota, idioma)}</p>
    </>
  );
}

function TelaCena({
  idioma,
  cliente,
  r,
  nome,
  cenas,
  onCena,
  onLivre,
}: {
  idioma: Idioma;
  cliente: Cliente;
  r: RespostasHolding;
  nome: string;
  cenas: { id: string; texto: Texto; icone: Parameters<typeof Icone>[0]["nome"] }[];
  onCena: (id: string) => void;
  onLivre: (v: string) => void;
}) {
  const c = cliente.textos.cena;
  return (
    <>
      <p className="h-kicker">{txt(c.kicker, idioma)}</p>
      <h1 className="h-titulo">{nome ? txt(c.titulo, idioma, { nome }) : txt(c.tituloSemNome, idioma)}</h1>
      <Opcoes
        rotulo={txt(c.kicker, idioma)}
        opcoes={opcoesExibidas(cenas, idioma)}
        selecionada={r.cena}
        onEscolher={onCena}
        comIcone
      />
      {r.cena === CENA_LIVRE ? (
        <div className="h-campo-grupo">
          <label htmlFor="h-livre" className="sr-only">
            {txt(c.rotuloLivre, idioma)}
          </label>
          <textarea
            id="h-livre"
            className="h-campo h-textarea h-textarea-curta"
            rows={2}
            maxLength={2000}
            placeholder={txt(c.placeholderLivre, idioma)}
            value={r.livre}
            onChange={(e) => onLivre(e.target.value)}
          />
        </div>
      ) : null}
    </>
  );
}

function TelaGate({
  idioma,
  cliente,
  nome,
  frase,
  r,
  erro,
  onContato,
}: {
  idioma: Idioma;
  cliente: Cliente;
  nome: string;
  frase: string;
  r: RespostasHolding;
  erro: Texto | null;
  onContato: (p: Partial<Pick<RespostasHolding, "whatsapp" | "email">>) => void;
}) {
  const g = cliente.textos.gate;
  return (
    <>
      <p className="h-kicker">{txt(g.kicker, idioma)}</p>
      <h1 className="h-titulo">{nome ? txt(g.titulo, idioma, { nome }) : txt(g.tituloSemNome, idioma)}</h1>
      <blockquote className="h-teaser">“{frase}”</blockquote>
      <p className="h-apoio">{txt(g.apoio, idioma)}</p>
      <div className="h-campo-grupo">
        <label htmlFor="h-wa">{txt(g.whatsapp, idioma)}</label>
        <div className="h-campo-icone">
          <Icone nome="chat" tamanho={16} />
          <input
            id="h-wa"
            className="h-campo"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder={txt(g.whatsappPlaceholder, idioma)}
            value={r.whatsapp}
            onChange={(e) => onContato({ whatsapp: e.target.value })}
          />
        </div>
      </div>
      <div className="h-campo-grupo">
        <label htmlFor="h-email">{txt(g.email, idioma)}</label>
        <div className="h-campo-icone">
          <Icone nome="envelope" tamanho={16} />
          <input
            id="h-email"
            className="h-campo"
            type="email"
            autoComplete="email"
            maxLength={200}
            placeholder={txt(g.emailPlaceholder, idioma)}
            value={r.email}
            onChange={(e) => onContato({ email: e.target.value })}
          />
        </div>
      </div>
      {erro ? (
        <p className="h-erro" role="alert">
          {txt(erro, idioma)}
        </p>
      ) : null}
      <p className="h-privacidade">{txt(g.privacidade, idioma)}</p>
    </>
  );
}

/**
 * Trabalho visível: as linhas entram em sequência e o fim só abre quando a
 * proposta existe de verdade. Se o servidor falhou, ela volta ao gate com o
 * que já tinha digitado — nada se perde.
 */
function Montando({
  idioma,
  cliente,
  proposta,
  onPronto,
  onVoltarAoGate,
}: {
  idioma: Idioma;
  cliente: Cliente;
  proposta: EstadoProposta;
  onPronto: () => void;
  onVoltarAoGate: () => void;
}) {
  const m = cliente.textos.montando;
  const [acesas, setAcesas] = useState(0);

  useEffect(() => {
    const reduz = prefereMenosMovimento();
    const timers = m.linhas.map((_, k) => setTimeout(() => setAcesas(k + 1), reduz ? 0 : 500 + k * 900));
    return () => timers.forEach(clearTimeout);
  }, [m.linhas]);

  const terminou = acesas >= m.linhas.length;
  const aoPronto = useEffectEvent(onPronto);
  useEffect(() => {
    if (!terminou || proposta !== "pronta") return;
    const t = setTimeout(aoPronto, prefereMenosMovimento() ? 300 : 700);
    return () => clearTimeout(t);
  }, [terminou, proposta]);

  return (
    <>
      <p className="h-kicker">{txt(m.kicker, idioma)}</p>
      <div className="h-montando" aria-live="polite">
        {m.linhas.map((linha, k) => (
          <p key={k} data-acesa={k < acesas && (k < m.linhas.length - 1 || proposta === "pronta") ? "sim" : "nao"}>
            {txt(linha, idioma)}
          </p>
        ))}
      </div>
      {proposta === "erro" ? (
        <div className="h-acoes">
          <p className="h-erro" role="alert">
            {txt(cliente.textos.gate.erroGeral, idioma)}
          </p>
          <button type="button" className="h-link" onClick={onVoltarAoGate}>
            {txt(cliente.textos.comum.voltar, idioma)}
          </button>
        </div>
      ) : null}
    </>
  );
}

function TelaFim({
  idioma,
  cliente,
  r,
  nome,
  frase,
  urlProposta,
}: {
  idioma: Idioma;
  cliente: Cliente;
  r: RespostasHolding;
  nome: string;
  frase: string;
  urlProposta: string | null;
}) {
  const f = cliente.textos.fim;
  const vertente = vertenteDaCena(cliente, r.cena);
  const moeda = moedaDe(cliente, idioma);
  const medida = vertente?.perguntas.find((p) => p.tipo === "medida");
  const conta = medida?.tipo === "medida" ? contaDaMedida(medida, r.ramo[medida.id]) : null;

  let textoConta: string | null = null;
  if (medida?.tipo === "medida" && conta?.trilha === "guarda_roupa") {
    textoConta = txt(medida.textoConta, idioma, {
      pct: conta.pctUsado,
      resto: conta.pctAdormecido,
      valor: dinheiro(conta.valorParado, moeda),
    });
  } else if (medida?.tipo === "medida" && conta?.trilha === "precificacao" && conta.unidade > 0) {
    textoConta = txt(medida.textoConta, idioma, {
      unidade: dinheiro(conta.unidade, moeda),
      mes: dinheiro(conta.mes, moeda),
      ano: dinheiro(conta.ano, moeda),
    });
  }

  const cena =
    r.entrada === "cena"
      ? r.cena === CENA_LIVRE
        ? txt(cliente.cenaLivre.texto, idioma)
        : vertente
          ? txt(vertente.cena.citacao ?? vertente.cena.texto, idioma)
          : null
      : null;

  // O fim nunca é renderizado no servidor (a primeira tela é sempre o nome;
  // o fim só chega por estado do navegador), então ler a origem aqui é seguro.
  const origem = typeof window === "undefined" ? "" : window.location.origin;
  const link = urlProposta ? `${origem}${urlProposta}` : "";
  const mensagem = txt(f.mensagemWhatsapp, idioma, { nome: nome || r.nome.trim(), link });
  const href = `https://wa.me/${cliente.contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;

  return (
    <>
      <p className="h-kicker">{txt(f.kicker, idioma)}</p>
      <h1 className="h-titulo">{txt(f.titulo, idioma, { nome })}</h1>
      <div className="h-espelho">
        {cena ? (
          <p>
            {txt(f.cena, idioma)} <b>“{cena}”</b>
          </p>
        ) : null}
        <p>
          {txt(f.frase, idioma)} <b>“{frase}”</b>
        </p>
        {textoConta ? (
          <p>
            <Rico texto={textoConta} />
          </p>
        ) : null}
      </div>
      <div className="h-acoes">
        <a className="h-cta" href={href} target="_blank" rel="noreferrer">
          {txt(f.cta, idioma)} <SetaAvancar />
        </a>
        <p className="h-apoio h-centro">{txt(f.apoio, idioma)}</p>
      </div>
    </>
  );
}

/* ==========================================================================
   Painel de desktop e tela de idioma fechado
   ========================================================================= */

function Painel({
  idioma,
  cliente,
  tela,
  temCena,
  figura,
  icone,
  posicao,
  total,
}: {
  idioma: Idioma;
  cliente: Cliente;
  tela: Tela;
  temCena: boolean;
  figura: Parameters<typeof FiguraDoPainel>[0]["figura"];
  icone: Parameters<typeof FiguraDoPainel>[0]["icone"];
  posicao: number;
  total: number;
}) {
  const p = cliente.textos.painel.passos;
  const etapa =
    tela.tipo === "nome" ? 0 : tela.tipo === "cena" ? 1 : tela.tipo === "pergunta" ? 2 : 3;
  const passos = [
    { chave: 0, texto: p.nome },
    ...(temCena ? [{ chave: 1, texto: p.cena }] : []),
    { chave: 2, texto: p.ramo },
    { chave: 3, texto: p.contato },
  ];
  return (
    <aside className="h-painel" aria-hidden="true">
      <div>
        <div className="h-painel-nome">{cliente.marca.nome}</div>
        <div className="h-painel-sub">{txt(cliente.marca.fraseMestra, idioma)}</div>
      </div>
      <ul className="h-passos">
        {passos.map((passo) => (
          <li key={passo.chave} data-estado={passo.chave < etapa ? "feito" : passo.chave === etapa ? "ativo" : "depois"}>
            <i />
            {txt(passo.texto, idioma)}
          </li>
        ))}
      </ul>
      <div className="h-painel-obj">
        {tela.tipo !== "nome" ? <FiguraDoPainel figura={figura} icone={icone} posicao={posicao} total={total} /> : null}
      </div>
      <p className="h-painel-rodape">{txt(cliente.textos.painel.rodape, idioma)}</p>
    </aside>
  );
}

function Indisponivel({ idioma, cliente }: { idioma: Idioma; cliente: Cliente }) {
  const t = cliente.textos.indisponivel;
  const destino = (Object.keys(cliente.moedaPorIdioma) as Idioma[]).find(
    (i) => i !== idioma && vertentesDisponiveis(cliente, moedaDe(cliente, i)).length > 0
  );
  return (
    <div data-vertente={ID_CASA} data-gesto={cliente.casa.gesto} className="h-mundo">
      <main className="h-folha h-folha-sozinha">
        <div className="h-topo">
          <SeletorIdioma rotulo={txt(cliente.textos.idioma, idioma)} />
        </div>
        <div className="h-miolo">
          <Logo idioma={idioma} cliente={cliente} />
          <h1 className="h-titulo h-titulo-abertura">{txt(t.titulo, idioma)}</h1>
          <p className="h-apoio">{txt(t.corpo, idioma)}</p>
          {destino ? (
            <div className="h-acoes">
              <Link className="h-cta" href="/diagnostico" locale={destino}>
                {txt(t.cta, idioma)} <SetaAvancar />
              </Link>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
