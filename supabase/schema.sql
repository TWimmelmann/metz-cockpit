-- Metz Cockpit – Supabase/Postgres-skema
-- Kør hele filen i Supabase → SQL Editor. Kan køres igen uden at slette data.

create extension if not exists pgcrypto;

-- ---------- Team ----------
create table if not exists public.members (
  email       text primary key check (email = lower(email)),
  name        text not null,
  role        text not null default 'saelger' check (role in ('saelger','leder')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Hjælpefunktioner (security definer, så de kan læse members uden RLS-rekursion)
create or replace function public.my_email() returns text
language sql stable as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) $$;

create or replace function public.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members where email = my_email() and active)
$$;

create or replace function public.is_leader() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members where email = my_email() and active and role = 'leder')
$$;

create or replace function public.my_name() returns text
language sql stable security definer set search_path = public as $$
  select name from members where email = my_email() and active
$$;

-- ---------- Deals og ordrer ----------
create table if not exists public.deals (
  id            text primary key default gen_random_uuid()::text,
  company       text not null default 'Uden navn',
  legal_name    text,
  title         text,
  type          text check (type in ('studio','adhoc','') or type is null),
  segment       text,
  track         text,
  stage         text not null default 'lead' check (stage in ('lead','dialog','mode','tilbud','vundet','tabt')),
  revenue       numeric(14,2),
  value         numeric(14,2),            -- DB (dækningsbidrag)
  est           boolean not null default false,
  owner         text,
  source        text,
  contact       text,
  email         text,
  phone         text,
  next_step     text,
  next_date     date,
  note          text,
  fav           boolean not null default false,
  won_date      date,
  order_status  text check (order_status in ('bekraeftet','produktion','afsendt','leveret','faktureret') or order_status is null),
  order_no      text,
  deadline      date,
  log           jsonb not null default '[]'::jsonb,
  extra         jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index if not exists deals_order_no_key on public.deals (order_no) where order_no is not null and order_no <> '';
create index if not exists deals_stage_idx on public.deals (stage);
create index if not exists deals_won_date_idx on public.deals (won_date);
create index if not exists deals_owner_idx on public.deals (owner);

-- ---------- Metz Studio ----------
create table if not exists public.studio_shops (
  id            text primary key default gen_random_uuid()::text,
  company       text not null default 'Uden navn',
  contact       text,
  email         text,
  deal_id       text references public.deals(id) on delete set null,
  status        text not null default 'onboarding' check (status in ('onboarding','live','pause')),
  start_date    date,
  go_live       date,
  setup_fee     numeric(14,2),
  shop_revenue  numeric(14,2),
  owner         text,
  note          text,
  steps         jsonb not null default '[]'::jsonb,
  info          jsonb not null default '[]'::jsonb,
  log           jsonb not null default '[]'::jsonb,
  extra         jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------- Team-projekter og idéer ----------
create table if not exists public.projects (
  id           text primary key default gen_random_uuid()::text,
  title        text not null default 'Uden navn',
  owner        text,
  status       text,
  priority     text,
  deadline     date,
  goal         text,
  description  text,
  tasks        jsonb not null default '[]'::jsonb,
  extra        jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.ideas (
  id          text primary key default gen_random_uuid()::text,
  title       text not null default 'Uden titel',
  problem     text,
  solution    text,
  status      text,
  impact      smallint,
  effort      smallint,
  category    text,
  gainer      text,
  author      text,
  extra       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- Indstillinger ----------
-- key = 'studio' (fælles Studio-skabelon) eller 'main:<email>' (personlige mål og indstillinger)
create table if not exists public.settings (
  key         text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ---------- updated_at ----------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

do $$ declare t text; begin
  foreach t in array array['deals','studio_shops','projects','ideas','settings'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------- Row Level Security ----------
alter table public.members      enable row level security;
alter table public.deals        enable row level security;
alter table public.studio_shops enable row level security;
alter table public.projects     enable row level security;
alter table public.ideas        enable row level security;
alter table public.settings     enable row level security;

-- members: alle i teamet kan se teamet, kun lederen kan ændre det
drop policy if exists members_read  on public.members;
drop policy if exists members_write on public.members;
create policy members_read  on public.members for select to authenticated using (is_member());
create policy members_write on public.members for all    to authenticated using (is_leader()) with check (is_leader());

-- deals: hele teamet ser alt. Sælgere opretter og redigerer egne deals, lederen alle.
drop policy if exists deals_read   on public.deals;
drop policy if exists deals_insert on public.deals;
drop policy if exists deals_update on public.deals;
drop policy if exists deals_delete on public.deals;
create policy deals_read   on public.deals for select to authenticated using (is_member());
create policy deals_insert on public.deals for insert to authenticated with check (is_member());
create policy deals_update on public.deals for update to authenticated
  using (is_leader() or (is_member() and (owner = my_name() or owner is null or owner = '')))
  with check (is_member());
create policy deals_delete on public.deals for delete to authenticated
  using (is_leader() or (is_member() and owner = my_name()));

-- Studio, projekter og idéer: fælles for teamet
do $$ declare t text; begin
  foreach t in array array['studio_shops','projects','ideas'] loop
    execute format('drop policy if exists %1$s_all on public.%1$s', t);
    execute format('create policy %1$s_all on public.%1$s for all to authenticated using (is_member()) with check (is_member())', t);
  end loop;
end $$;

-- settings: fælles nøgler læses af alle i teamet; personlige nøgler kun af ejeren
drop policy if exists settings_read  on public.settings;
drop policy if exists settings_write on public.settings;
create policy settings_read on public.settings for select to authenticated
  using (is_member() and (key not like 'main:%' or key = 'main:' || my_email() or is_leader()));
create policy settings_write on public.settings for all to authenticated
  using (is_member() and (key = 'main:' || my_email() or (key not like 'main:%' and is_leader()) or (key = 'studio')))
  with check (is_member() and (key = 'main:' || my_email() or (key not like 'main:%' and is_leader()) or (key = 'studio')));

-- ---------- Realtime ----------
do $$ declare t text; begin
  foreach t in array array['deals','studio_shops','projects','ideas','settings','members'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- ---------- Rapport-view: omsætning og DB pr. måned og sælger ----------
create or replace view public.order_report with (security_invoker = true) as
select date_trunc('month', won_date)::date as month,
       owner,
       count(*)                                         as orders,
       sum(revenue) filter (where not est)              as revenue,
       sum(value)   filter (where not est)              as db,
       round(100 * sum(value) filter (where not est) / nullif(sum(revenue) filter (where not est), 0), 1) as dg_pct,
       sum(revenue) filter (where est)                  as expected_revenue,
       sum(value)   filter (where est)                  as expected_db
from public.deals
where stage = 'vundet' and won_date is not null
group by 1, 2;
