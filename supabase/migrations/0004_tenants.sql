-- =============================================================================
-- Tailor — tenants
--
-- A configuração de cliente (marca, vertentes, perguntas, produtos, preços,
-- textos — o que hoje é `src/content/clientes/renilza.ts`) passa a viver
-- aqui também. Um cliente novo é uma linha, não mais um arquivo + deploy;
-- preço e copy mudam sem redeploy, publicados por `scripts/sync-tenant.ts`.
--
-- `config` guarda o mesmo formato validado por `src/content/clientes/esquema.ts`
-- (`Cliente`) — a mesma regra de carga vale aqui, só que em runtime em vez de
-- em build (ver `src/lib/tenants.ts`). O arquivo estático continua sendo a
-- fonte revisada por PR; esta tabela é o que a aplicação lê.
--
-- RLS ligada, sem policy — mesmo padrão de leads/respostas/propostas/eventos
-- (0001): só `service_role` lê e escreve. `config` não é segredo (é servida
-- à visitante, é a própria copy do quiz), mas nada aqui é gravável por
-- engano do browser.
-- =============================================================================

create table if not exists public.tenants (
  id text primary key,
  dominio text not null unique,
  dominios_extra text[] not null default '{}',
  config jsonb not null,
  ativo boolean not null default true,
  -- Bumped por `sync-tenant.ts` a cada publish — não é lido pela aplicação,
  -- é rastro de auditoria de quantas vezes um cliente foi republicado.
  versao int not null default 1,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists tenants_dominios_extra_idx
  on public.tenants using gin (dominios_extra);

alter table public.tenants enable row level security;
alter table public.tenants force row level security;

revoke all on public.tenants from anon, authenticated;

-- Reaproveita o trigger de 0001 (search_path já fixo desde 0003).
drop trigger if exists tenants_tocar on public.tenants;
create trigger tenants_tocar before update on public.tenants
  for each row execute function public.tocar_atualizado_em();
