-- =============================================================================
-- Tailor — schema inicial
--
-- C6 — RLS ligada nas quatro tabelas e SEM policy para `anon`. Nada aqui é
-- legível ou gravável direto do cliente: todo acesso passa pelos route handlers
-- com a service role. Dado pessoal (WhatsApp, respostas, números declarados)
-- nunca fica exposto a query direta do browser.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- leads
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  nome text,
  whatsapp text,
  persona text check (persona in ('patricia', 'camila', 'carla')),
  origem text not null default 'quiz_frio'
    check (origem in ('quiz_frio', 'quiz_audio', 'confirmacao')),
  confirmation_token text unique,
  idioma text not null default 'pt',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'novo'
    check (status in ('novo', 'proposta_gerada', 'proposta_aberta',
                      'checkout_iniciado', 'fechado', 'perdido')),
  -- LGPD: soft delete. Nada é apagado fisicamente sem decisão explícita.
  removido_em timestamptz
);

-- -----------------------------------------------------------------------------
-- respostas
-- As colunas geradas garantem que a aritmética do Gap seja a mesma no banco e
-- na tela. Se divergirem algum dia, o banco é a versão auditável.
-- -----------------------------------------------------------------------------
create table if not exists public.respostas (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  situacao text,
  situacao_via text check (situacao_via in ('texto', 'audio', 'opcao')),
  q3_unica_coisa text,
  q3_via text check (q3_via in ('texto', 'audio')),
  preco_atual numeric,
  preco_desejado numeric,
  volume_mensal int,
  pct_usado int,
  valor_parado numeric,
  gap_unidade numeric generated always as (preco_desejado - preco_atual) stored,
  gap_mes numeric generated always as
    ((preco_desejado - preco_atual) * volume_mensal) stored,
  gap_ano numeric generated always as
    ((preco_desejado - preco_atual) * volume_mensal * 12) stored,
  palavras_identidade text[],
  q7_ja_tentou text,
  q8_quando text,
  q9_investimento_faixa text,
  -- Superset de backup: o payload completo como chegou, para não perder um
  -- dado que ainda não virou coluna.
  respostas_raw jsonb not null default '{}'::jsonb,
  -- LGPD: evidência do consentimento de áudio, com carimbo de tempo.
  consentimento_audio_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (lead_id)
);

-- -----------------------------------------------------------------------------
-- propostas
-- -----------------------------------------------------------------------------
create table if not exists public.propostas (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  versao text not null default 'v0.2',
  -- Os blocos já montados, incluindo o diagnóstico gerado.
  conteudo jsonb not null,
  -- Fica null enquanto o preço da Renilza for ◆.
  preco_investimento numeric,
  token text not null unique,
  gerado_em timestamptz not null default now(),
  -- C5 — a validade é uma coluna, não um contador de tela. Quem decide se a
  -- proposta ainda vale é o servidor lendo esta data.
  expira_em timestamptz not null
);

create index if not exists propostas_lead_idx on public.propostas (lead_id);

-- -----------------------------------------------------------------------------
-- eventos_abertura
-- -----------------------------------------------------------------------------
create table if not exists public.eventos_abertura (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null references public.propostas(id) on delete cascade,
  tipo text not null check (tipo in ('view', 'cta_primario_click',
    'cta_secundario_click', 'checkout_iniciado', 'checkout_concluido')),
  meta jsonb,
  criado_em timestamptz not null default now()
);

create index if not exists eventos_proposta_idx
  on public.eventos_abertura (proposta_id, criado_em desc);

-- -----------------------------------------------------------------------------
-- RLS — ligada, sem policy. Ausência de policy significa negar tudo para
-- qualquer papel que não seja service_role (que ignora RLS por definição).
-- -----------------------------------------------------------------------------
alter table public.leads enable row level security;
alter table public.respostas enable row level security;
alter table public.propostas enable row level security;
alter table public.eventos_abertura enable row level security;

alter table public.leads force row level security;
alter table public.respostas force row level security;
alter table public.propostas force row level security;
alter table public.eventos_abertura force row level security;

revoke all on public.leads from anon, authenticated;
revoke all on public.respostas from anon, authenticated;
revoke all on public.propostas from anon, authenticated;
revoke all on public.eventos_abertura from anon, authenticated;

-- -----------------------------------------------------------------------------
-- atualizado_em automático
-- -----------------------------------------------------------------------------
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists leads_tocar on public.leads;
create trigger leads_tocar before update on public.leads
  for each row execute function public.tocar_atualizado_em();

drop trigger if exists respostas_tocar on public.respostas;
create trigger respostas_tocar before update on public.respostas
  for each row execute function public.tocar_atualizado_em();
