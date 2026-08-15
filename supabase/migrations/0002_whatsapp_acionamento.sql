-- =============================================================================
-- Tailor — acionamento direto por WhatsApp (Cloud API)
--
-- Três coisas: o número vira caminho de busca (era coluna sem índice), o lead
-- passa a lembrar quando ela falou pela última vez (a janela de 24h da Meta é
-- um fato de negócio, não de código), e o wamid ganha um livro-caixa para que
-- reentrega da Meta não vire segundo lead, segunda transcrição, segunda cobrança.
-- =============================================================================

-- `DadosLead.email` existe em store.ts e é enviado em todo insert de lead, mas
-- a coluna nunca foi criada — todo insert de lead falhava.
alter table public.leads add column if not exists email text;

-- Janela de atendimento: fora dela só template aprovado é entregue.
alter table public.leads
  add column if not exists ultima_mensagem_recebida_em timestamptz;

-- Sem unique de propósito: o mesmo número pode reaparecer em cadastro novo, e
-- unique transformaria isso em erro 500 no meio de uma conversa. Parcial em
-- `removido_em is null` porque é exatamente esse o filtro da consulta.
create index if not exists leads_whatsapp_idx
  on public.leads (whatsapp)
  where removido_em is null;

-- -----------------------------------------------------------------------------
-- mensagens_whatsapp — idempotência
-- A Meta reentrega até receber 200. `wamid` como primary key faz a segunda
-- entrega bater numa violação de unicidade em vez de virar processamento novo.
-- -----------------------------------------------------------------------------
create table if not exists public.mensagens_whatsapp (
  wamid text primary key,
  lead_id uuid references public.leads(id) on delete set null,
  recebida_em timestamptz not null default now()
);

create index if not exists mensagens_whatsapp_lead_idx
  on public.mensagens_whatsapp (lead_id, recebida_em desc);

alter table public.mensagens_whatsapp enable row level security;
alter table public.mensagens_whatsapp force row level security;
revoke all on public.mensagens_whatsapp from anon, authenticated;
