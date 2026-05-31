-- 005_producer_pages.sql
-- Enables producer detail pages and the producer map.
--
-- Adds to public.producers:
--   slug         — URL slug for /producers/[slug] routing
--   latitude     — decimal degrees, 6 digit precision (~10cm)
--   longitude    — decimal degrees, 6 digit precision
--   town         — city/municipality within the DO region
--   do_region    — Denomination of Origin region (constrained enum)
--
-- Adds view:
--   producer_map_pins — producers with valid coords + rolled-up tequila counts

create extension if not exists unaccent;

-- ---------------------------------------------------------------
-- Columns
-- ---------------------------------------------------------------

alter table public.producers
  add column if not exists slug      text unique,
  add column if not exists latitude  numeric(9, 6),
  add column if not exists longitude numeric(9, 6),
  add column if not exists town      text,
  add column if not exists do_region text;

comment on column public.producers.slug is
  'URL slug. Lowercase, hyphen-separated, accent-stripped. Used in /producers/[slug] routes.';
comment on column public.producers.do_region is
  'Denomination of Origin region. Constrained to the 5 Mexican states permitted by CRT (Jalisco split into Los Altos / Valles / Other).';
comment on column public.producers.town is
  'City or municipality within the DO region (Tequila, Arandas, Atotonilco el Alto, Amatitán, Arenal, etc.).';

-- ---------------------------------------------------------------
-- Constraint: DO region must be one of the official values
-- ---------------------------------------------------------------

alter table public.producers
  drop constraint if exists producers_do_region_check;

alter table public.producers
  add constraint producers_do_region_check
  check (do_region is null or do_region in (
    'jalisco-los-altos',
    'jalisco-valles',
    'jalisco-other',
    'nayarit',
    'tamaulipas',
    'michoacan',
    'guanajuato'
  ));

-- ---------------------------------------------------------------
-- Backfill slugs from name
-- ---------------------------------------------------------------

update public.producers
set slug = trim(both '-' from regexp_replace(
  lower(unaccent(name)),
  '[^a-z0-9]+', '-', 'g'
))
where slug is null;

-- ---------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------

create index if not exists producers_slug_idx
  on public.producers(slug);

create index if not exists producers_do_region_idx
  on public.producers(do_region)
  where do_region is not null;

create index if not exists producers_geo_idx
  on public.producers(latitude, longitude)
  where latitude is not null;

-- ---------------------------------------------------------------
-- View: producer_map_pins
-- Returns producers with valid coords + tequila count rollups
-- for rendering map markers and pin tooltips.
-- ---------------------------------------------------------------

create or replace view public.producer_map_pins
with (security_invoker = true)
as
select
  p.id,
  p.slug,
  p.name,
  p.latitude,
  p.longitude,
  p.town,
  p.do_region,
  p.noma,
  p.website,
  p.logo_url,
  count(t.id)::int                                            as tequila_count,
  count(t.id) filter (where t.additive_free = true)::int      as additive_free_count,
  count(t.id) filter (where t.organic = true)::int            as organic_count
from public.producers p
left join public.tequilas t on t.producer_id = p.id
where p.latitude is not null
  and p.longitude is not null
group by p.id;

comment on view public.producer_map_pins is
  'Producers with valid coordinates, joined with rolled-up tequila counts. Powers map markers and tooltips.';
