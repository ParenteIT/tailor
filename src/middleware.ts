import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

/*
 * middleware.ts, não proxy.ts — decisão de deploy, não de preferência. O Next
 * 16 mantém esta convenção exatamente para quem precisa do runtime edge
 * (proxy.ts é Node, não configurável), e o adapter do Netlify só tem o
 * caminho maduro para middleware edge: o wrapper dele para node-middleware
 * quebra no runtime do bundler (webpack e Turbopack) — visto neste repo em
 * 13/08/2026, mesma família da issue #3114 do opennextjs-netlify.
 */
export const config = {
  // Fora do matcher de propósito: /api (rotas de servidor não têm locale de
  // caminho) e /p (o link da proposta é curto e compartilhável — não carrega
  // prefixo de idioma; o idioma dela vem gravado no lead).
  matcher: "/((?!api|p|_next|_vercel|.*\\..*).*)",
};
