-- 006_brands.sql
-- Introduces brands as a first-class entity, distinct from distilleries.
--
-- Tequila has three real layers:
--   1. Distillery (NOM operator)   — stored in public.producers (kept as-is)
--   2. Brand (consumer-facing)     — NEW: public.brands
--   3. Expression (SKU)            — stored in public.tequilas (gains brand_id)
--
-- After this migration runs, brand_id is nullable on tequilas. The propose +
-- apply scripts fill it in. A later migration can add NOT NULL once all rows
-- are linked.

create extension if not exists unaccent;

-- ---------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------

create table public.brands (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,

  -- Primary distillery (NOM operator). A brand can change distilleries over
  -- time; this stores the current/primary one. Null allowed (some brands are
  -- aspirational placeholders until we confirm production).
  distillery_id       uuid references public.producers(id) on delete set null,

  description         text,
  story               text,
  logo_url            text,
  hero_image_url      text,
  website             text,
  instagram           text,

  founded_year        smallint,
  country             text default 'Mexico',

  subscription_tier   text not null default 'free'
    check (subscription_tier in ('free', 'verified', 'premium', 'sponsored')),
  claimed_by_user_id  uuid references auth.users(id) on delete set null,
  claimed_at          timestamptz,
  featured_until      timestamptz,

  source              text default 'manual',

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.brands is
  'Consumer-facing tequila brand. The marketable entity. Primary subject of /brands/[slug] pages and target customer for paid memberships.';
comment on column public.brands.distillery_id is
  'Primary NOM operator (producer). Brands can switch distilleries; this is the current/primary one.';
comment on column public.brands.subscription_tier is
  'free = default catalog entry. verified = claimed by brand. premium = paid subscription. sponsored = paid placement.';
comment on column public.brands.source is
  '"manual" = curated, "crt-derived" = generated from CRT tequila names by apply-brands script.';

create index brands_slug_idx        on public.brands(slug);
create index brands_distillery_idx  on public.brands(distillery_id);
create index brands_tier_idx        on public.brands(subscription_tier)
  where subscription_tier != 'free';
create index brands_claimed_idx     on public.brands(claimed_by_user_id)
  where claimed_by_user_id is not null;

-- ---------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------

create or replace function public.tg_set_updated_at()
  returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger brands_set_updated_at
  before update on public.brands
  for each row execute function public.tg_set_updated_at();

-- ---------------------------------------------------------------
-- Tequila linkage
-- ---------------------------------------------------------------

alter table public.tequilas
  add column if not exists brand_id uuid references public.brands(id) on delete set null;

comment on column public.tequilas.brand_id is
  'Consumer-facing brand. Links each expression (this row) to its brand. Producer_id still stores the distillery.';

create index if not exists tequilas_brand_idx on public.tequilas(brand_id);

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------

alter table public.brands enable row level security;

create policy "brands_public_read"
  on public.brands for select
  using (true);

create policy "brands_admin_all"
  on public.brands for all
  using      (auth.uid() in (select user_id from public.admin_users))
  with check (auth.uid() in (select user_id from public.admin_users));

create policy "brands_owner_update"
  on public.brands for update
  using      (auth.uid() = claimed_by_user_id)
  with check (auth.uid() = claimed_by_user_id);

-- ---------------------------------------------------------------
-- Convenience view: brands with rolled-up stats
-- ---------------------------------------------------------------

create or replace view public.brand_summaries
with (security_invoker = true)
as
select
  b.id,
  b.slug,
  b.name,
  b.distillery_id,
  b.subscription_tier,
  b.logo_url,
  b.hero_image_url,
  p.name                                                            as distillery_name,
  p.noma                                                            as distillery_noma,
  p.town                                                            as distillery_town,
  p.do_region                                                       as distillery_do_region,
  count(t.id)::int                                                  as expression_count,
  count(t.id) filter (where t.additive_free = true)::int            as additive_free_count,
  count(t.id) filter (where t.organic = true)::int                  as organic_count,
  array_agg(distinct t.type order by t.type) filter (where t.type is not null) as types
from public.brands b
left join public.producers p on p.id = b.distillery_id
left join public.tequilas t  on t.brand_id = b.id
group by b.id, p.id;

comment on view public.brand_summaries is
  'Brands joined with distillery info and rolled-up tequila stats. Powers /brands index page and brand cards.';
