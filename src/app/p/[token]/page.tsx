import type { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import { CONTATO, PRECOS } from "@/content/config";
import { PALAVRAS_IDENTIDADE, PERSONAS } from "@/content/personas";
import { Comparador } from "@/components/comparador";
import { Seta } from "@/components/molde";
import { Atmosfera } from "@/components/atmosfera";
import { FitaMetrica, type CopyEstacao } from "@/components/fita-metrica";
import { Oferta, RegistrarAbertura } from "@/components/oferta";
import { CrossSell } from "@/components/cross-sell";
import { ControlesTopo } from "@/components/controles-topo";
import { crossSellHotmart, maxParcelas } from "@/lib/checkout";
import { ESTACOES_FITA, type EstacaoFita } from "@/lib/gap";
import { expirou, type ConteudoProposta } from "@/lib/proposta";
import { getStore } from "@/lib/store";
import { tokenPlausivel } from "@/lib/token";
import { CLIENTE, idiomaValido, txt } from "@/content/clientes";
import { EstiloDosMundos } from "@/components/holding/estilo-mundos";

export const dynamic = "force-dynamic";

/** Locale do quiz → tag BCP-47 para `toLocaleDateString` da validade (C5). */
const LOCALE_DATA: Record<string, string> = {
  pt: "pt-BR",
  en: "en-US",
};

// C6 — a proposta carrega nome, WhatsApp e os números declarados de uma pessoa.
// Fora do índice, e sem preview em lugar nenhum.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

// 91,5% mobile: a barra do navegador é a moldura da página. A proposta é
// ivory — carregar a barra noir do layout raiz aqui pararia o arco
// noir → ivory (que o DESIGN.md chama de "o produto") na borda do viewport.
export const viewport: Viewport = {
  themeColor: "#f6efe1",
};

export default async function PaginaProposta({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!tokenPlausivel(token)) return <NaoEncontrada />;

  const proposta = await getStore().buscarPropostaPorToken(token);
  if (!proposta) return <NaoEncontrada />;

  const c = proposta.conteudo as unknown as ConteudoProposta;

  // A proposta reabre na língua em que ela respondeu — gravada no conteúdo
  // (proposta antiga sem o campo cai em pt). O quiz é `/[locale]/…`; este
  // caminho curto e compartilhável não carrega prefixo, então o idioma vem
  // daqui, não da URL.
  const locale = c.idioma ?? "pt";
  const t = await getTranslations({ locale });

  // C5 — a validade é decidida aqui, no servidor, lendo a coluna. O browser
  // não participa da decisão.
  if (expirou(proposta.expiraEm)) return <Expirada locale={locale} />;

  const primeiroNome = c.nome.split(/\s+/)[0] ?? c.nome;

  const persona = c.persona;
  // Proposta da holding: o mundo da vertente em vez do ivory, a marca e a
  // oferta da configuração do cliente. A estrutura dos blocos é a mesma — o
  // desenho da proposta por vertente ainda não foi feito (handoff §9.7).
  const vertente = c.vertente ? CLIENTE.vertentes.find((v) => v.id === c.vertente) : undefined;
  const idiomaCliente = idiomaValido(locale) ? locale : CLIENTE.idiomaPadrao;

  const copyEstacoes = Object.fromEntries(
    ESTACOES_FITA.map((chave) => [
      chave,
      {
        nome: t(`proposta.b4.estacoes.${chave}`),
        ponte: t(`proposta.b4.pontes.${chave}`),
        texto: persona ? t(`proposta.b4.copy.${persona}.${chave}`) : "",
      } satisfies CopyEstacao,
    ])
  ) as Record<EstacaoFita, CopyEstacao>;

  const validade = new Date(proposta.expiraEm).toLocaleDateString(
    LOCALE_DATA[locale] ?? "pt-BR",
    { weekday: "long", day: "2-digit", month: "long" }
  );

  // As palavras foram gravadas como CHAVE (sem acento); o exibível vive nas
  // messages. Chave desconhecida (proposta antiga) cai no texto cru.
  const palavrasLegiveis = c.palavras.map((p) =>
    (PALAVRAS_IDENTIDADE as readonly string[]).includes(p)
      ? t(`futuro.palavras.${p}`)
      : p
  );

  return (
    <Superficie acento={persona ? PERSONAS[persona].acento : undefined} vertente={vertente?.id}>
      <RegistrarAbertura token={token} />
      {/* Só o tema: a proposta não troca de língua (decidida no quiz). No
          mundo de uma vertente não há tema — as cores são as dela. */}
      {vertente ? null : (
        <ControlesTopo
          mostrarIdioma={false}
          textos={{
            idioma: "",
            tema: t("controles.tema"),
            claro: t("controles.claro"),
            escuro: t("controles.escuro"),
          }}
        />
      )}

      <article className="mx-auto w-full max-w-[var(--container-leitura)] px-p4 py-p5 sm:px-p5 sm:py-p6">
        {/* B1 — Abertura / Espelho */}
        <header className="mb-p6">
          <p className="filete notacao mb-p4">
            <span>
              {vertente
                ? `${CLIENTE.marca.nome} · ${txt(CLIENTE.marca.fraseMestra, idiomaCliente)}`
                : `${t("marca.nome")} · ${t("marca.assinatura")}`}
            </span>
          </p>
          <TituloRevelado
            texto={t("proposta.b1.titulo", { nome: primeiroNome })}
          />
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1.1rem, 4.4vw, 1.4rem)",
              color: "var(--ink-2)",
              lineHeight: 1.35,
            }}
          >
            {t("proposta.b1.epigrafe")}
          </p>
        </header>

        {/* B2 — Diagnóstico */}
        <Bloco notacao={t("proposta.b2.notacao")} indice={1}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.25rem, 5vw, 1.7rem)",
              lineHeight: 1.4,
              color: "var(--ink)",
            }}
          >
            {c.diagnostico}
          </p>
        </Bloco>

        {/* B3 — Hoje / Futuro. O cartão virou empilhado em 08/09/2026 e não
            arrasta mais em lugar nenhum, então o `fixo` que existia só aqui
            deixou de fazer sentido. */}
        <Bloco notacao={t("proposta.b3.notacao")} titulo={t("proposta.b3.titulo")} indice={2}>
          <Comparador
            verbatim={c.analise.verbatimQ3 || ""}
            palavras={palavrasLegiveis}
            gap={c.gap}
            rotuloHoje={t("proposta.b3.hoje")}
            rotuloFuturo={t("proposta.b3.futuro")}
            moeda={c.moeda ?? "BRL"}
          />
        </Bloco>

        {/* B4 — A Fita Métrica da Virada */}
        {c.fita ? (
          <Bloco
            notacao={t("proposta.b4.notacao")}
            titulo={t("proposta.b4.titulo")}
            indice={3}
          >
            <FitaMetrica
              escala={c.fita.escala}
              estacoes={c.fita.estacoes}
              copy={copyEstacoes}
              rotuloHoje={t("proposta.b4.hojeMarca")}
              rotuloMeta={t("proposta.b4.metaMarca")}
              fecho={t("proposta.b4.fecho")}
            />
          </Bloco>
        ) : null}

        {/* B5 — O Método */}
        <Bloco notacao={t("proposta.b5.notacao")} titulo={t("proposta.b5.titulo")} indice={4}>
          <p className="mb-p3" style={{ color: "var(--ink-2)" }}>
            {t("proposta.b5.corpo")}
          </p>
          <p style={{ color: "var(--ink-2)" }}>{t("proposta.b5.corpo2")}</p>
        </Bloco>

        {/* B6 — Prova. Nada aqui foi inventado; o material real ainda não existe. */}
        <Bloco notacao={t("proposta.b6.notacao")} titulo={t("proposta.b6.titulo")} indice={5}>
          <p className="mb-p3" style={{ color: "var(--ink-2)" }}>
            {t("proposta.b6.corpo", { numero: PRECOS.numeroDepoimentos })}
          </p>
          <p
            className="p-p2"
            style={{
              border: "1px dashed var(--rule-2)",
              borderRadius: 2,
              color: "var(--ink-3)",
              fontSize: "var(--text-micro)",
              lineHeight: 1.6,
            }}
          >
            {t("proposta.b6.placeholder")}
          </p>
        </Bloco>

        {/* B7 — Oferta */}
        <Bloco notacao={t("proposta.b7.notacao")} titulo={t("proposta.b7.titulo")} indice={6}>
          {c.oferta?.nivel ? (
            <p className="notacao mb-p2">
              {txt(CLIENTE.textos.proposta.nivel, idiomaCliente, { nivel: c.oferta.nivel })}
            </p>
          ) : null}
          {/* Sem oferta ("prefiro não dizer", ou nenhum produto cabe na faixa
              dela): o próximo passo é conversa, nunca um preço presumido. */}
          {c.oferta === null ? (
            <>
              <p className="mb-p4" style={{ color: "var(--ink-2)" }}>
                {txt(CLIENTE.textos.proposta.semOferta, idiomaCliente)}
              </p>
              <a
                className="notacao inline-flex items-center gap-p2 px-p4 py-p3"
                href={`https://wa.me/${CLIENTE.contato.whatsapp}?text=${encodeURIComponent(
                  txt(CLIENTE.textos.proposta.mensagemWhatsapp, idiomaCliente)
                )}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "var(--color-cta)",
                  color: "var(--color-cta-ink)",
                  borderRadius: "var(--radius-cta)",
                  minHeight: 56,
                  textDecoration: "none",
                }}
              >
                {txt(CLIENTE.textos.proposta.semOfertaCta, idiomaCliente)} <Seta />
              </a>
            </>
          ) : (
          <Oferta
            token={token}
            whatsapp={vertente ? CLIENTE.contato.whatsapp : CONTATO.whatsapp}
            textos={{
              produto: c.oferta?.nome ?? "",
              parcelamentoNota: t("proposta.b7.parcelamentoNota", {
                parcelas: maxParcelas(),
              }),
              ctaAbrindo: t("proposta.b7.ctaAbrindo"),
              erroAviso: t("proposta.b7.erroAviso"),
              expiradaAviso: t("proposta.b7.expiradaAviso"),
              investimento: t("proposta.b7.investimento", {
                valor: c.oferta?.preco ?? PRECOS.investimentoFinal,
              }),
              pix: t("proposta.b7.pix"),
              pixBonus: t("proposta.b7.pixBonus", { bonus: PRECOS.bonusPix }),
              cartao: t("proposta.b7.cartao"),
              ctaPrimario: t("proposta.b7.ctaPrimario"),
              ctaSecundario: t("proposta.b7.ctaSecundario"),
              seguranca: t("proposta.b7.seguranca"),
              mockAviso: t("proposta.b7.mockAviso"),
              mensagemWhatsapp: vertente
                ? txt(CLIENTE.textos.proposta.mensagemWhatsapp, idiomaCliente)
                : t("whatsapp.mensagem"),
            }}
          />
          )}
        </Bloco>

        {/* O degrau de baixo, na Hotmart — só aparece se os links existirem.
            Fica fora da proposta da holding: Círculo e Jornada eram a escada
            antiga, e a esteira por vertente ainda não tem cross-sell. */}
        {vertente ? null : (
        <CrossSell
          itens={crossSellHotmart()}
          titulo={t("proposta.crossSell.titulo")}
          nota={t("proposta.crossSell.nota")}
          rotulos={{
            circulo: {
              nome: t("proposta.crossSell.itens.circulo.nome"),
              descricao: t("proposta.crossSell.itens.circulo.descricao"),
            },
            jornada: {
              nome: t("proposta.crossSell.itens.jornada.nome"),
              descricao: t("proposta.crossSell.itens.jornada.descricao"),
            },
          }}
        />
        )}

        {/* C5 exibida como data, nunca como relógio: o §8 veta countdown. */}
        <footer className="mt-p6">
          <span
            className="mb-p3 block h-px w-full"
            style={{ background: "var(--rule)" }}
          />
          <p className="notacao">{t("proposta.validade.ativa", { data: validade })}</p>
        </footer>
      </article>
    </Superficie>
  );
}

/**
 * A troca de superfície é o produto, não decoração: o questionário acontece no
 * escuro, onde confessar custa menos; a proposta é onde ela é lida. A regra 4
 * do §2.4 do BRAND-VISUAL manda exatamente isso — noir é o padrão, ivory é
 * para ler.
 *
 * O acento é a linha DELA (gramática das duas tintas, DESIGN.md): a proposta
 * conhece a persona e costura a linha de corte do Comparador e os piquetes da
 * fita com a mesma cor que a acompanhou no quiz. Sem persona (404/expirada),
 * o acento fica no padrão da casa. Os tokens de acento têm versão aprofundada
 * sobre ivory em globals.css — mesma tinta, mais densa.
 */
function Superficie({
  children,
  acento,
  vertente,
}: {
  children: React.ReactNode;
  acento?: string;
  /** Proposta da holding: os tokens do mundo dela, gerados da configuração. */
  vertente?: string;
}) {
  return (
    <div
      {...(vertente ? { "data-vertente": vertente } : { "data-superficie": "ivory" })}
      className="min-h-svh"
      style={
        {
          background: "var(--surface)",
          color: "var(--ink)",
          ...(acento ? { "--accent": acento } : null),
        } as React.CSSProperties
      }
    >
      {vertente ? <EstiloDosMundos /> : null}
      <Atmosfera />
      {children}
    </div>
  );
}

/**
 * Mecanismo G (18/09/2026): a proposta não revela mais tudo de uma vez no
 * carregamento — cada bloco entra em sequência, `surgir` (o mesmo fade+slide
 * de sempre) com um atraso crescente. `indice` conta a partir do Bloco 2 (o 1
 * já teve o próprio reveal palavra a palavra no header); a base de 700ms dá
 * tempo do véu do clímax (`VeuDeRevelacao`, quiz.tsx) e do título terminarem
 * antes do próximo bloco começar a aparecer. `prefers-reduced-motion` zera
 * duração E delay (globals.css) — sem sequência visível pra quem pediu menos
 * movimento.
 */
function Bloco({
  notacao,
  titulo,
  children,
  indice = 0,
}: {
  notacao: string;
  titulo?: string;
  children: React.ReactNode;
  indice?: number;
}) {
  return (
    <section
      className="surgir mb-p6"
      style={{ animationDelay: `${700 + indice * 140}ms` }}
    >
      <p className="filete notacao mb-p3">
        <span>{notacao}</span>
      </p>
      {titulo ? <h2 className="mb-p3">{titulo}</h2> : null}
      {children}
    </section>
  );
}

/**
 * O título do Bloco 1 revela palavra por palavra — o tratamento mais rico do
 * fluxo (mecanismo G), reservado pra frase que é literalmente a devolutiva
 * dela. Puro SSR: `animation-delay` por `<span>` não precisa de JS nem de
 * client component, o navegador escalona sozinho a partir do primeiro paint.
 */
function TituloRevelado({ texto }: { texto: string }) {
  const palavras = texto.split(" ");
  return (
    <h1 className="mb-p3">
      {palavras.map((palavra, i) => (
        <span
          key={i}
          className="surgir inline-block"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          {palavra}
          {i < palavras.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}

async function NaoEncontrada() {
  const t = await getTranslations({ locale: "pt" });
  return (
    <Superficie>
      <main className="mx-auto w-full max-w-[var(--container-leitura)] px-p4 py-p6">
        <h1 className="mb-p3">{t("proposta.naoEncontrada.titulo")}</h1>
        <p className="mb-p4" style={{ color: "var(--ink-2)" }}>
          {t("proposta.naoEncontrada.corpo")}
        </p>
        <a
          className="notacao inline-flex items-center gap-p1"
          href="/pt/diagnostico"
        >
          {t("proposta.naoEncontrada.cta")} <Seta tamanho={11} />
        </a>
      </main>
    </Superficie>
  );
}

async function Expirada({ locale = "pt" }: { locale?: string }) {
  const t = await getTranslations({ locale });
  return (
    <Superficie>
      <main className="mx-auto w-full max-w-[var(--container-leitura)] px-p4 py-p6">
        <h1 className="mb-p3">{t("proposta.validade.expirada")}</h1>
        <p className="mb-p4" style={{ color: "var(--ink-2)" }}>
          {t("proposta.validade.expiradaCorpo")}
        </p>
        <a
          className="notacao inline-flex items-center gap-p1"
          href={`https://wa.me/${CONTATO.whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          {t("proposta.validade.expiradaCta")} <Seta tamanho={11} />
        </a>
      </main>
    </Superficie>
  );
}
