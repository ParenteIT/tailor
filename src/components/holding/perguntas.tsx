"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { Idioma, Moeda, NomeIcone, Pergunta } from "@/content/clientes/esquema";
import { txt } from "@/content/clientes";
import { ajustarMedida, contaDaMedida, faixaDoCampo, opcoesDaFaixa, type ValorResposta } from "@/lib/fluxo";
import { dinheiro } from "@/lib/gap";
import { BotaoAudio } from "@/components/molde";
import { useGravador } from "@/lib/gravador";
import type { Cliente } from "@/content/clientes/esquema";
import { Icone } from "./icones";

/**
 * Os tipos de pergunta como componentes genéricos. Nenhum conhece a vertente
 * nem o texto: tudo chega da configuração. O gesto da escolha (fio,
 * preenchimento, onda, contorno) é do mundo e vive no CSS, por
 * `[data-gesto]` no radiogroup.
 */

/** `**negrito**` e `*itálico*` — o único markup que a configuração pode usar. */
export function Rico({ texto }: { texto: string }) {
  const partes = texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {partes.map((parte, i) =>
        parte.startsWith("**") ? (
          <b key={i}>{parte.slice(2, -2)}</b>
        ) : parte.startsWith("*") && parte.length > 2 ? (
          <em key={i}>{parte.slice(1, -1)}</em>
        ) : (
          <span key={i}>{parte}</span>
        )
      )}
    </>
  );
}

export interface OpcaoExibida {
  id: string;
  texto: string;
  icone?: NomeIcone;
}

/**
 * Radiogroup com as setas do teclado andando pelas opções (e marcando, como
 * num grupo de rádio nativo). O toque da onda recomeça a cada escolha: a
 * `key` dos anéis muda, o nó remonta, a animação CSS roda de novo.
 */
export function Opcoes({
  rotulo,
  opcoes,
  selecionada,
  onEscolher,
  comIcone,
}: {
  rotulo: string;
  opcoes: OpcaoExibida[];
  selecionada: string | null;
  onEscolher: (id: string) => void;
  comIcone: boolean;
}) {
  const [toques, setToques] = useState(0);

  function escolher(id: string) {
    setToques((n) => n + 1);
    onEscolher(id);
  }

  function aoTeclar(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const passo = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    const alvo = (i + passo + opcoes.length) % opcoes.length;
    const grupo = e.currentTarget.parentElement;
    (grupo?.children[alvo] as HTMLButtonElement | undefined)?.focus();
    escolher(opcoes[alvo].id);
  }

  const indiceMarcado = opcoes.findIndex((o) => o.id === selecionada);

  return (
    <div className="h-opcoes" role="radiogroup" aria-label={rotulo}>
      {opcoes.map((o, i) => {
        const marcada = o.id === selecionada;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={marcada}
            tabIndex={marcada || (indiceMarcado === -1 && i === 0) ? 0 : -1}
            className="h-op"
            onClick={() => escolher(o.id)}
            onKeyDown={(e) => aoTeclar(e, i)}
          >
            {comIcone && o.icone ? (
              <Icone nome={o.icone} className="h-op-icone" />
            ) : (
              <span className="h-op-radio">
                {marcada ? (
                  <span key={toques} className="h-op-toques" aria-hidden="true">
                    <i />
                    <i />
                  </span>
                ) : null}
              </span>
            )}
            <span className="h-op-texto">{o.texto}</span>
            <i className="h-op-fio" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

export function opcoesExibidas(
  opcoes: { id: string; texto: Record<Idioma, string>; icone?: NomeIcone }[],
  idioma: Idioma
): OpcaoExibida[] {
  return opcoes.map((o) => ({ id: o.id, texto: o.texto[idioma], icone: o.icone }));
}

/* ==========================================================================
   Aberta — texto e áudio, uma porta a mais para a mesma pergunta
   ========================================================================= */

export function Aberta({
  cliente,
  pergunta,
  idioma,
  valor,
  onChange,
  onTranscrito,
  onConsentimento,
}: {
  cliente: Cliente;
  pergunta: Pergunta & { tipo: "aberta" };
  idioma: Idioma;
  valor: string;
  onChange: (v: string) => void;
  onTranscrito: (texto: string) => void;
  onConsentimento: (emISO: string) => void;
}) {
  const id = useId();
  const gravador = useGravador(onTranscrito, onConsentimento);
  const a = cliente.textos.aberta.audio;
  return (
    <div className="h-aberta">
      <label htmlFor={id} className="sr-only">
        {txt(cliente.textos.aberta.rotulo, idioma)}
      </label>
      <textarea
        id={id}
        className="h-campo h-textarea"
        rows={4}
        maxLength={4000}
        placeholder={txt(pergunta.placeholder, idioma)}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      />
      {pergunta.audio ? (
        <BotaoAudio
          estado={gravador.estado}
          suportado={gravador.suportado}
          textos={{
            convite: txt(a.convite, idioma),
            consentimento: txt(a.consentimento, idioma),
            consentir: txt(a.consentir, idioma),
            recusar: txt(a.recusar, idioma),
            gravando: txt(a.gravando, idioma),
            parar: txt(a.parar, idioma),
            transcrevendo: txt(a.transcrevendo, idioma),
            erro: txt(a.erro, idioma),
          }}
          onIniciar={gravador.pedirConsentimento}
          onConsentir={gravador.consentir}
          onRecusar={gravador.recusarConsentimento}
          onParar={gravador.parar}
        />
      ) : null}
    </div>
  );
}

/* ==========================================================================
   Medida — réguas e a conta dela
   ========================================================================= */

function formatar(formato: "pct" | "numero" | "moeda", n: number, moeda: Moeda, idioma: Idioma): string {
  if (formato === "moeda") return dinheiro(n, moeda);
  if (formato === "pct") return `${n}%`;
  return new Intl.NumberFormat(idioma === "pt" ? "pt-BR" : "en-US").format(n);
}

/**
 * A conta só aparece quando TODAS as réguas foram mexidas: até lá, o que a
 * tela mostra é o ponto de partida da régua, não um número dela — e conta
 * feita com ponto de partida seria número que ela não declarou.
 */
export function Medida({
  cliente,
  pergunta,
  idioma,
  moeda,
  valor,
  onChange,
}: {
  cliente: Cliente;
  pergunta: Pergunta & { tipo: "medida" };
  idioma: Idioma;
  moeda: Moeda;
  valor: Record<string, number>;
  onChange: (v: Record<string, number>) => void;
}) {
  const base = useId();
  const tocadas = pergunta.campos.every((c) => typeof valor[c.id] === "number");
  const conta = tocadas ? contaDaMedida(pergunta, valor) : null;

  let textoConta: string | null = null;
  if (conta?.trilha === "guarda_roupa") {
    textoConta = txt(pergunta.textoConta, idioma, {
      pct: conta.pctUsado,
      resto: conta.pctAdormecido,
      valor: dinheiro(conta.valorParado, moeda),
    });
  } else if (conta?.trilha === "precificacao") {
    textoConta =
      conta.unidade <= 0 && pergunta.textoContaIgual
        ? txt(pergunta.textoContaIgual, idioma)
        : txt(pergunta.textoConta, idioma, {
            unidade: dinheiro(conta.unidade, moeda),
            mes: dinheiro(conta.mes, moeda),
            ano: dinheiro(conta.ano, moeda),
          });
  }

  return (
    <div className="h-reguas">
      {pergunta.campos.map((campo) => {
        const faixa = faixaDoCampo(campo, moeda);
        if (!faixa) return null;
        const atual = valor[campo.id] ?? faixa.padrao;
        const idCampo = `${base}-${campo.id}`;
        return (
          <div key={campo.id} className="h-regua">
            <label htmlFor={idCampo}>{txt(campo.rotulo, idioma)}</label>
            <output htmlFor={idCampo} className="medida">
              {formatar(campo.formato, atual, moeda, idioma)}
            </output>
            <input
              id={idCampo}
              type="range"
              min={faixa.min}
              max={faixa.max}
              step={faixa.step}
              value={atual}
              onChange={(e) => onChange(ajustarMedida(pergunta, valor, campo.id, Number(e.target.value)))}
            />
          </div>
        );
      })}
      <p className="h-conta" data-visivel={textoConta ? "sim" : "nao"} aria-live="polite">
        {textoConta ? <Rico texto={textoConta} /> : txt(cliente.textos.medida.convite, idioma)}
      </p>
    </div>
  );
}

/* ==========================================================================
   Palavras — de min a max, a mais antiga cede lugar
   ========================================================================= */

export function Palavras({
  cliente,
  pergunta,
  idioma,
  valor,
  onChange,
}: {
  cliente: Cliente;
  pergunta: Pergunta & { tipo: "palavras" };
  idioma: Idioma;
  valor: string[];
  onChange: (v: string[]) => void;
}) {
  function alternar(id: string) {
    if (valor.includes(id)) return onChange(valor.filter((w) => w !== id));
    const cheia = valor.length >= pergunta.max;
    onChange([...(cheia ? valor.slice(1) : valor), id]);
  }
  const t = cliente.textos.palavras;
  const aviso =
    valor.length >= pergunta.max ? t.completas : valor.length >= pergunta.min ? t.maisUma : t.minimo;
  return (
    <>
      <div className="h-chips" role="group" aria-label={txt(pergunta.kicker, idioma)}>
        {pergunta.opcoes.map((o) => (
          <button
            key={o.id}
            type="button"
            className="h-chip"
            aria-pressed={valor.includes(o.id)}
            onClick={() => alternar(o.id)}
          >
            {txt(o.texto, idioma)}
          </button>
        ))}
      </div>
      <p className="h-apoio" aria-live="polite">
        {txt(aviso, idioma)}
      </p>
    </>
  );
}

/* ==========================================================================
   A pergunta, qualquer que seja o tipo
   ========================================================================= */

export function CorpoDaPergunta({
  cliente,
  pergunta,
  idioma,
  moeda,
  valor,
  comIcone,
  onResponder,
  onTranscrito,
  onConsentimento,
}: {
  cliente: Cliente;
  pergunta: Pergunta;
  idioma: Idioma;
  moeda: Moeda;
  valor: ValorResposta | undefined;
  comIcone: boolean;
  onResponder: (v: ValorResposta) => void;
  onTranscrito: (texto: string) => void;
  onConsentimento: (emISO: string) => void;
}) {
  switch (pergunta.tipo) {
    case "escolha":
      return (
        <Opcoes
          rotulo={txt(pergunta.kicker, idioma)}
          opcoes={opcoesExibidas(pergunta.opcoes, idioma)}
          selecionada={typeof valor === "string" ? valor : null}
          onEscolher={onResponder}
          comIcone={comIcone}
        />
      );
    case "faixa":
      return (
        <Opcoes
          rotulo={txt(pergunta.kicker, idioma)}
          opcoes={opcoesExibidas(opcoesDaFaixa(pergunta, moeda), idioma)}
          selecionada={typeof valor === "string" ? valor : null}
          onEscolher={onResponder}
          comIcone={comIcone}
        />
      );
    case "aberta":
      return (
        <Aberta
          cliente={cliente}
          pergunta={pergunta}
          idioma={idioma}
          valor={typeof valor === "string" ? valor : ""}
          onChange={onResponder}
          onTranscrito={onTranscrito}
          onConsentimento={onConsentimento}
        />
      );
    case "medida":
      return (
        <Medida
          cliente={cliente}
          pergunta={pergunta}
          idioma={idioma}
          moeda={moeda}
          valor={valor && typeof valor === "object" && !Array.isArray(valor) ? valor : {}}
          onChange={onResponder}
        />
      );
    case "palavras":
      return (
        <Palavras
          cliente={cliente}
          pergunta={pergunta}
          idioma={idioma}
          valor={Array.isArray(valor) ? valor : []}
          onChange={onResponder}
        />
      );
  }
}
