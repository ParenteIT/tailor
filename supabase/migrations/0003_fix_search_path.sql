-- =============================================================================
-- Tailor — search_path fixo na função de trigger `tocar_atualizado_em`
--
-- WARN `function_search_path_mutable` aberto nos advisors do Supabase desde
-- 13/08/2026 (ver CLAUDE.md, "Infra, F5 e deploy"): a função roda como trigger
-- BEFORE UPDATE em leads/respostas/propostas/eventos_abertura e não fixava
-- `search_path`. Sem isso, quem dispara o UPDATE decide o path — um schema
-- plantado à frente de `pg_catalog` poderia sequestrar `now()` ou os
-- operadores usados no corpo. `search_path = ''` força qualificação total; o
-- corpo só usa `now()` (built-in, resolvido por `pg_catalog`), então nada
-- quebra.
--
-- Migração nova, não edição da 0001: a 0001 já foi aplicada em produção
-- (`20260813205648`), e migração aplicada não se reescreve — repo e banco
-- divergiriam. `alter function` é idempotente aqui.
-- =============================================================================

alter function public.tocar_atualizado_em() set search_path = '';
