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
import { crossSellHotmart, maxParcelas } from "@/lib/checkout";
import { ESTACOES_FITA, type EstacaoFita } from "@/lib/gap";
import { expirou, type ConteudoProposta } from "@/lib/proposta";
import { getStore } from "@/lib/store";
import { tokenPlausivel } from "@/lib/token";

export const dynamic = "force-dynamic";

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
  const t = await getTranslations({ locale: "pt" });

  if (!tokenPlausivel(token)) return <NaoEncontrada />;

  const proposta = await getStore().buscarPropostaPorToken(token);
  if (!proposta) return <NaoEncontrada />;

  // C5 — a validade é decidida aqui, no servidor, lendo a coluna. O browser
  // não participa da decisão.
  if (expirou(proposta.expiraEm)) return <Expirada />;

  const c = proposta.conteudo as unknown as ConteudoProposta;
  const primeiroNome = c.nome.split(/\s+/)[0] ?? c.nome;

  const copyEstacoes = Object.fromEntries(
    ESTACOES_FITA.map((chave) => [
      chave,
      {
        nome: t(`proposta.b4.estacoes.${chave}`),
        ponte: t(`proposta.b4.pontes.${chave}`),
        texto: t(`proposta.b4.copy.${c.persona}.${chave}`),
      } satisfies CopyEstacao,
    ])
  ) as Record<EstacaoFita, CopyEstacao>;

  const validade = new Date(proposta.expiraEm).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  // As palavras foram gravadas como CHAVE (sem acento); o exibível vive nas
  // messages. Chave desconhecida (proposta antiga) cai no texto cru.
  const palavrasLegiveis = c.palavras.map((p) =>
    (PALAVRAS_IDENTIDADE as readonly string[]).includes(p)
      ? t(`futuro.palavras.${p}`)
      : p
  );

  return (
    <Superficie acento={PERSONAS[c.persona]?.acento}>
      <RegistrarAbertura token={token} />

      <article className="mx-auto w-full max-w-[var(--container-leitura)] px-p4 py-p5 sm:px-p5 sm:py-p6">
        {/* B1 — Abertura / Espelho */}
        <header className="mb-p6">
          <p className="filete notacao mb-p4">
            <span>
              {t("marca.nome")} · {t("marca.assinatura")}
            </span>
          </p>
          <h1 className="mb-p3">
            {t("proposta.b1.titulo", { nome: primeiroNome })}
          </h1>
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
        <Bloco notacao={t("proposta.b2.notacao")}>
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

        {/* B3 — Hoje / Futuro, agora fixo: a prova já foi feita. */}
        <Bloco notacao={t("proposta.b3.notacao")} titulo={t("proposta.b3.titulo")}>
          <Comparador
            verbatim={c.analise.verbatimQ3 || ""}
            palavras={palavrasLegiveis}
            gap={c.gap}
            rotuloHoje={t("proposta.b3.hoje")}
            rotuloFuturo={t("proposta.b3.futuro")}
            moeda={c.moeda ?? "BRL"}
            fixo={50}
          />
        </Bloco>

        {/* B4 — A Fita Métrica da Virada */}
        {c.fita ? (
          <Bloco
            notacao={t("proposta.b4.notacao")}
            titulo={t("proposta.b4.titulo")}
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
        <Bloco notacao={t("proposta.b5.notacao")} titulo={t("proposta.b5.titulo")}>
          <p className="mb-p3" style={{ color: "var(--ink-2)" }}>
            {t("proposta.b5.corpo")}
          </p>
          <p style={{ color: "var(--ink-2)" }}>{t("proposta.b5.corpo2")}</p>
        </Bloco>

        {/* B6 — Prova. Nada aqui foi inventado; o material real ainda não existe. */}
        <Bloco notacao={t("proposta.b6.notacao")} titulo={t("proposta.b6.titulo")}>
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
        <Bloco notacao={t("proposta.b7.notacao")} titulo={t("proposta.b7.titulo")}>
          <Oferta
            token={token}
            whatsapp={CONTATO.whatsapp}
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
              mensagemWhatsapp: t("whatsapp.mensagem"),
            }}
          />
        </Bloco>

        {/* O degrau de baixo, na Hotmart — só aparece se os links existirem. */}
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
}: {
  children: React.ReactNode;
  acento?: string;
}) {
  return (
    <div
      data-superficie="ivory"
      className="min-h-svh"
      style={
        {
          background: "var(--surface)",
          color: "var(--ink)",
          ...(acento ? { "--accent": acento } : null),
        } as React.CSSProperties
      }
    >
      <Atmosfera />
      {children}
    </div>
  );
}

function Bloco({
  notacao,
  titulo,
  children,
}: {
  notacao: string;
  titulo?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-p6">
      <p className="filete notacao mb-p3">
        <span>{notacao}</span>
      </p>
      {titulo ? <h2 className="mb-p3">{titulo}</h2> : null}
      {children}
    </section>
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

async function Expirada() {
  const t = await getTranslations({ locale: "pt" });
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
