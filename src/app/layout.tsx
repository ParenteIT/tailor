import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import "./globals.css";

/* O display vive atrás de --font-display (globals.css). BRAND-VISUAL §3.1-BIS
   já registra que Cormorant sai em setembro: a troca é este bloco e a linha
   do token, nada mais.

   Self-hosted (variable, subset latin) em vez de next/font/google: o download
   em tempo de build já quebrou um deploy — o pipeline webpack pedia URLs
   antigas do gstatic e recebia 404. Arquivo no repo torna o build
   determinístico e tira o Google do caminho da lead, o que a LGPD agradece. */
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond.var.woff2", style: "normal" },
    { path: "../fonts/cormorant-garamond-italic.var.woff2", style: "italic" },
  ],
  weight: "300 700",
  variable: "--font-cormorant",
  display: "swap",
});

const jost = localFont({
  src: "../fonts/jost.var.woff2",
  weight: "100 900",
  variable: "--font-jost",
  display: "swap",
});

const hanken = localFont({
  src: "../fonts/hanken-grotesk.var.woff2",
  weight: "100 900",
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Renilza Miranda — seu diagnóstico de imagem",
  // Espelha abertura.corpo: este texto é o preview do link no WhatsApp e na
  // bio — a primeira tela do funil. "Seis passos" era a mesma promessa falsa
  // que a auditoria de 14/08 removeu de dentro do app (o fluxo tem 9 peças).
  description:
    "Poucas perguntas, menos de três minutos. No final, um diagnóstico feito sob medida — não um resultado genérico de quiz.",
};

export const viewport: Viewport = {
  themeColor: "#141009",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${jost.variable} ${hanken.variable}`}
    >
      <body>
        {/* THESIS: A pattern sheet is the only drawing that exists because one
        specific person exists. Refuses the quiz-funnel card stack: no boxes, no
        progress bar, no eyebrow-over-heading decoration.
        OWN-WORLD: Tailor's chalk on dark cloth. Noir #141009 ground, ivory
        hairlines, gold rationed under 3% of area, terra carrying the warmth.
        Cut line solid, sewing line dashed, notches, registration crosses,
        seam-allowance hatching. No shadow, no gradient, 2px corners.
        STORY: She confesses in the dark, sees her own words measured, and the
        surface turns to ivory paper when the proposal is hers to read.
        FIRST VIEWPORT: Noir field, registration marks at the corners, a chalk
        rail down the left carrying notches for each finished piece, one
        Cormorant question at display scale, one action low-left.
        FORM: A Folha de Molde — candidate 6 of 7 on the grounded list; seed key
        1d77bb43.
        FINISH: unreviewed and undocumented is unfinished; this build ends with
        the finish review, the verdict, and DESIGN.md */}
        {children}
      </body>
    </html>
  );
}
