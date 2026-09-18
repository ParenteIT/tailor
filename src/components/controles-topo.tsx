"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
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

/** Idioma, em dropdown: escala para mais línguas sem alargar a barra (a 375px
    três pílulas já ocupavam quase toda a largura). Isolado porque
    `useLocale`/`useRouter` (next-intl) exigem `NextIntlClientProvider`, e a
    proposta (`p/[token]`) não tem um — hook não pode ser condicional, então é
    o componente inteiro que deixa de montar. */
function SeletorIdioma({ rotulo }: { rotulo: string }) {
  const atual = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const raizRef = useRef<HTMLDivElement>(null);
  const gatilhoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.lang = atual;
  }, [atual]);

  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(e: MouseEvent) {
      if (raizRef.current && !raizRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAberto(false);
        gatilhoRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  function escolher(loc: string) {
    setAberto(false);
    if (loc !== atual) router.replace(pathname, { locale: loc });
  }

  return (
    <div ref={raizRef} className="relative">
      <button
        ref={gatilhoRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={`${rotulo}: ${NOMES_IDIOMA[atual] ?? atual}`}
        onClick={() => setAberto((v) => !v)}
        className="notacao inline-flex cursor-pointer items-center"
        style={{
          ...pilula,
          gap: 8,
          height: 40,
          padding: "0 12px 0 12px",
          color: "var(--ink)",
        }}
      >
        <Bandeira loc={atual} />
        {atual.toUpperCase()}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          style={{
            transform: aberto ? "rotate(180deg)" : "none",
            transition: `transform 300ms ${EASE}`,
          }}
        >
          <path
            d="M1.5 3.5 5 7l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {aberto ? (
        <ul
          role="listbox"
          aria-label={rotulo}
          className="absolute top-full right-0 z-50 mt-p1"
          style={{
            minWidth: 190,
            margin: 0,
            padding: 4,
            listStyle: "none",
            background: "var(--surface)",
            border: "1px solid var(--rule-2)",
            borderRadius: 16,
          }}
        >
          {routing.locales.map((loc) => {
            const ativo = loc === atual;
            return (
              <li key={loc} role="option" aria-selected={ativo}>
                <button
                  type="button"
                  lang={loc}
                  onClick={() => escolher(loc)}
                  className="inline-flex w-full cursor-pointer items-center"
                  style={{
                    gap: 10,
                    minHeight: 40,
                    padding: "0 12px",
                    borderRadius: 12,
                    textAlign: "left",
                    color: ativo ? "var(--ink)" : "var(--ink-2)",
                    background: ativo
                      ? "color-mix(in srgb, var(--ink) 8%, transparent)"
                      : "transparent",
                  }}
                >
                  <Bandeira loc={loc} />
                  <span className="flex-1">{NOMES_IDIOMA[loc] ?? loc}</span>
                  {ativo ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path
                        d="M2 6.5 4.8 9 10 3.2"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
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
