"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Bandeira, NOMES_IDIOMA } from "./seletor-idioma";
import { CHAVE_TEMA_PERSISTENTE, IconeLua, IconeSol } from "./tema";

export interface TextosControles {
  idioma: string;
  tema: string;
  claro: string;
  escuro: string;
}

/**
 * Os controles do topo — 19/09/2026, pedido do Willian com um seletor simples
 * de app como referência: uma pílula sol/lua (o modo ativo fica preenchido) e
 * outra de idioma. Substitui o Alfinete (18/09), que escondia o tema claro
 * atrás de "segure para espiar" e de um link de acessibilidade — resultado:
 * quem abria o site nunca achava o modo claro. Reverte, por decisão dele, o
 * mecanismo D do prompt de 17/09 e restaura a de 12/09 ("vale em tudo").
 *
 * Não é `fixed`: mora no fluxo do documento, no topo, e rola junto com a
 * página. Foi a posição fixa que fez os dois botões antigos cobrirem o texto
 * das opções em tela longa (bug de 17/09) — aqui isso não tem como acontecer,
 * o `main` reserva o espaço da barra em cima.
 */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const pilula: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
  padding: 3,
  borderRadius: 999,
  border: "1px solid var(--rule-2)",
  background: "color-mix(in srgb, var(--ink) 5%, transparent)",
};

/** Idioma. Isolado porque `useLocale`/`useRouter` (next-intl) exigem
    `NextIntlClientProvider`, e a proposta (`p/[token]`) não tem um — hook não
    pode ser condicional, então é o componente inteiro que deixa de montar. */
function SeletorIdioma({ rotulo }: { rotulo: string }) {
  const atual = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.lang = atual;
  }, [atual]);

  return (
    <div role="group" aria-label={rotulo} style={pilula}>
      {routing.locales.map((loc) => {
        const ativo = loc === atual;
        return (
          <button
            key={loc}
            type="button"
            lang={loc}
            aria-pressed={ativo}
            aria-label={NOMES_IDIOMA[loc] ?? loc}
            onClick={() => {
              if (!ativo) router.replace(pathname, { locale: loc });
            }}
            className="notacao inline-flex cursor-pointer items-center"
            style={{
              gap: 6,
              minHeight: 32,
              padding: "0 9px",
              borderRadius: 999,
              color: ativo ? "var(--ink)" : "var(--ink-3)",
              background: ativo
                ? "color-mix(in srgb, var(--ink) 12%, transparent)"
                : "transparent",
              transition: `background 300ms ${EASE}, color 300ms ${EASE}`,
            }}
          >
            <span className="max-[359px]:hidden">
              <Bandeira loc={loc} />
            </span>
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

function SeletorTema({ textos }: { textos: TextosControles }) {
  const [claro, setClaro] = useState(false);

  // O script inline do layout raiz já pôs `data-tema` antes do primeiro
  // paint; aqui só sincronizamos o estado do botão com o que está no <html>.
  useEffect(() => {
    setClaro(document.documentElement.getAttribute("data-tema") === "claro");
  }, []);

  function aplicar(novo: boolean) {
    setClaro(novo);
    const raiz = document.documentElement;
    if (novo) raiz.setAttribute("data-tema", "claro");
    else raiz.removeAttribute("data-tema");
    try {
      if (novo) window.localStorage.setItem(CHAVE_TEMA_PERSISTENTE, "claro");
      else window.localStorage.removeItem(CHAVE_TEMA_PERSISTENTE);
    } catch {
      /* sem storage: vale só nesta visita */
    }
  }

  const segmento = (ativo: boolean): CSSProperties => ({
    width: 32,
    height: 32,
    borderRadius: 999,
    color: ativo ? "var(--color-cta-ink)" : "var(--ink-3)",
    background: ativo ? "var(--color-cta)" : "transparent",
    transition: `background 300ms ${EASE}, color 300ms ${EASE}`,
  });

  return (
    <div role="group" aria-label={textos.tema} style={pilula}>
      <button
        type="button"
        aria-pressed={claro}
        aria-label={textos.claro}
        onClick={() => aplicar(true)}
        className="inline-flex cursor-pointer items-center justify-center"
        style={segmento(claro)}
      >
        <IconeSol />
      </button>
      <button
        type="button"
        aria-pressed={!claro}
        aria-label={textos.escuro}
        onClick={() => aplicar(false)}
        className="inline-flex cursor-pointer items-center justify-center"
        style={segmento(!claro)}
      >
        <IconeLua />
      </button>
    </div>
  );
}

export function ControlesTopo({
  textos,
  mostrarIdioma = true,
}: {
  textos: TextosControles;
  /** A proposta não troca de língua: a dela foi decidida no quiz. */
  mostrarIdioma?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-[var(--container-leitura)] flex-wrap justify-end gap-p1 px-p3 pt-p2">
        {mostrarIdioma ? (
          <div className="pointer-events-auto">
            <SeletorIdioma rotulo={textos.idioma} />
          </div>
        ) : null}
        <div className="pointer-events-auto">
          <SeletorTema textos={textos} />
        </div>
      </div>
    </div>
  );
}
