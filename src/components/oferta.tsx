"use client";

import { useEffect, useState } from "react";
import { Seta } from "@/components/molde";

type Tipo =
  | "view"
  | "cta_primario_click"
  | "cta_secundario_click"
  | "checkout_iniciado";

async function registrar(token: string, tipo: Tipo) {
  try {
    await fetch(`/api/proposta/${token}/evento`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tipo }),
      keepalive: true,
    });
  } catch {
    /* telemetria é melhor-esforço */
  }
}

/** Grava a abertura. É o gancho que a Renilza vai querer: "ela abriu?". */
export function RegistrarAbertura({ token }: { token: string }) {
  useEffect(() => {
    void registrar(token, "view");
  }, [token]);
  return null;
}

type Estado = "parado" | "abrindo" | "mock" | "expirada" | "erro";

/**
 * Bloco 7 — oferta e fechamento.
 *
 * O botão primário pede ao servidor um link de pagamento do Asaas e redireciona
 * para o checkout hospedado deles: nenhum dado de cartão passa por aqui, e o
 * escopo de PCI deste lado é zero. Enquanto não houver preço configurado, a
 * mesma rota responde "mock" e a página assume o aviso de demonstração — sem
 * inventar valor e sem fingir que processa.
 *
 * Dois CTAs, nunca mais que dois.
 */
export function Oferta({
  token,
  whatsapp,
  textos,
}: {
  token: string;
  whatsapp: string;
  textos: {
    produto: string;
    investimento: string;
    pix: string;
    pixBonus: string;
    cartao: string;
    parcelamentoNota: string;
    ctaPrimario: string;
    ctaAbrindo: string;
    ctaSecundario: string;
    seguranca: string;
    mockAviso: string;
    erroAviso: string;
    expiradaAviso: string;
    mensagemWhatsapp: string;
  };
}) {
  const [metodo, setMetodo] = useState<"pix" | "cartao">("pix");
  const [estado, setEstado] = useState<Estado>("parado");

  async function pagar() {
    setEstado("abrindo");
    void registrar(token, "cta_primario_click");
    try {
      const resposta = await fetch(`/api/proposta/${token}/checkout`, {
        method: "POST",
      });

      if (resposta.status === 410) return setEstado("expirada");
      if (!resposta.ok) return setEstado("erro");

      const dados = (await resposta.json()) as { estado: string; url?: string };
      if (dados.estado === "pronto" && dados.url) {
        window.location.href = dados.url;
        return;
      }
      setEstado(dados.estado === "mock" ? "mock" : "erro");
    } catch {
      setEstado("erro");
    }
  }

  return (
    <div>
      {textos.produto ? (
        <p className="notacao mb-p1">{textos.produto}</p>
      ) : null}
      <p
        className="medida mb-p2"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.4rem, 10vw, 3.4rem)",
          lineHeight: 1,
        }}
      >
        {textos.investimento}
      </p>

      <div className="mb-p3 flex flex-wrap gap-p3">
        {(["pix", "cartao"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMetodo(m)}
            aria-pressed={metodo === m}
            className="notacao cursor-pointer py-p1"
            style={{
              minHeight: 44,
              color: metodo === m ? "var(--ink)" : "var(--ink-3)",
              borderBottom:
                metodo === m ? "1px solid var(--color-gold)" : "1px solid transparent",
            }}
          >
            {m === "pix" ? textos.pix : textos.cartao}
          </button>
        ))}
      </div>

      <p className="mb-p4" style={{ color: "var(--ink-2)" }}>
        {metodo === "pix" ? textos.pixBonus : textos.parcelamentoNota}
      </p>

      <div className="flex flex-wrap items-center gap-p3">
        <button
          type="button"
          onClick={() => void pagar()}
          disabled={estado === "abrindo"}
          className="notacao inline-flex items-center gap-p2 px-p4 py-p3"
          style={{
            background: estado === "abrindo" ? "transparent" : "var(--ink)",
            color: estado === "abrindo" ? "var(--ink-3)" : "var(--surface)",
            border: `1px solid ${estado === "abrindo" ? "var(--rule-2)" : "var(--ink)"}`,
            borderRadius: 2,
            minHeight: 56,
            cursor: estado === "abrindo" ? "progress" : "pointer",
          }}
        >
          {estado === "abrindo" ? textos.ctaAbrindo : textos.ctaPrimario}
          {estado === "abrindo" ? null : <Seta />}
        </button>

        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(textos.mensagemWhatsapp)}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => void registrar(token, "cta_secundario_click")}
          className="notacao"
          style={{
            color: "var(--ink-3)",
            borderBottom: "1px solid var(--rule-2)",
            paddingBottom: 2,
            textDecoration: "none",
          }}
        >
          {textos.ctaSecundario}
        </a>
      </div>

      <p
        className="mt-p3"
        style={{ color: "var(--ink-3)", fontSize: "var(--text-micro)" }}
      >
        {textos.seguranca}
      </p>

      {estado === "mock" || estado === "erro" || estado === "expirada" ? (
        <p
          role="status"
          className="surgir mt-p3 p-p3"
          style={{
            border: "1px dashed var(--rule-2)",
            borderRadius: 2,
            color: "var(--ink-2)",
            fontSize: "var(--text-apoio)",
          }}
        >
          {estado === "mock"
            ? textos.mockAviso
            : estado === "expirada"
              ? textos.expiradaAviso
              : textos.erroAviso}
        </p>
      ) : null}
    </div>
  );
}
