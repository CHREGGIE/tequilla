-- 004_flavors.sql
-- Adds the flavor wheel taxonomy and tequila-to-flavor tagging.
--
-- Tables:
--   flavors           — hierarchical, 2 levels (1 = family, 2 = note)
--   tequila_flavors   — many-to-many join, with intensity 1-3
--
-- Seeds:
--   6 flavor families + 34 notes (Tequillist tasting framework)

-- ---------------------------------------------------------------
-- Schema
-- ---------------------------------------------------------------

create table public.flavors (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid references public.flavors(id) on delete cascade,
  slug          text not null unique,
  name          text not null,
  level         smallint not null check (level in (1, 2)),
  display_order int not null default 0,
  description   text,
  created_at    timestamptz not null default now()
);

comment on table public.flavors is
  'Flavor wheel taxonomy. Level 1 = family (top branch). Level 2 = note (leaf). parent_id null for families.';
comment on column public.flavors.level is
  '1 = family (Cooked agave, Citrus & fruit, etc.); 2 = note (Lime, Vanilla, etc.)';

create index flavors_parent_idx        on public.flavors(parent_id);
create index flavors_level_idx         on public.flavors(level);
create index flavors_display_order_idx on public.flavors(level, display_order);

create table public.tequila_flavors (
  tequila_id uuid not null references public.tequilas(id) on delete cascade,
  flavor_id  uuid not null references public.flavors(id)  on delete cascade,
  intensity  smallint not null default 2 check (intensity between 1 and 3),
  created_at timestamptz not null default now(),
  primary key (tequila_id, flavor_id)
);

comment on table public.tequila_flavors is
  'Which flavor notes apply to which tequilas, with intensity 1-3.';
comment on column public.tequila_flavors.intensity is
  '1 = trace, 2 = present, 3 = prominent';

create index tequila_flavors_flavor_idx  on public.tequila_flavors(flavor_id);
create index tequila_flavors_tequila_idx on public.tequila_flavors(tequila_id);

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------

alter table public.flavors         enable row level security;
alter table public.tequila_flavors enable row level security;

create policy "flavors_public_read"
  on public.flavors for select
  using (true);

create policy "tequila_flavors_public_read"
  on public.tequila_flavors for select
  using (true);

create policy "flavors_admin_write"
  on public.flavors for all
  using      (auth.uid() in (select user_id from public.admin_users))
  with check (auth.uid() in (select user_id from public.admin_users));

create policy "tequila_flavors_admin_write"
  on public.tequila_flavors for all
  using      (auth.uid() in (select user_id from public.admin_users))
  with check (auth.uid() in (select user_id from public.admin_users));

-- ---------------------------------------------------------------
-- Seed: 6 families
-- ---------------------------------------------------------------

insert into public.flavors (slug, name, level, display_order) values
  ('cooked-agave',  'Cooked agave',    1, 1),
  ('citrus-fruit',  'Citrus & fruit',  1, 2),
  ('floral',        'Floral',          1, 3),
  ('herbs-spice',   'Herbs & spice',   1, 4),
  ('sweet-caramel', 'Sweet & caramel', 1, 5),
  ('wood-smoke',    'Wood & smoke',    1, 6)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------
-- Seed: 34 notes (children of the families)
-- ---------------------------------------------------------------

with notes(family_slug, slug, name, ord) as (values
  ('cooked-agave',  'roasted-agave',     'Roasted agave',   1),
  ('cooked-agave',  'cooked-agave-note', 'Cooked agave',    2),
  ('cooked-agave',  'mineral',           'Mineral',         3),
  ('cooked-agave',  'salt',              'Salt',            4),
  ('cooked-agave',  'clay',              'Clay',            5),

  ('citrus-fruit',  'lime',              'Lime',            1),
  ('citrus-fruit',  'grapefruit',        'Grapefruit',      2),
  ('citrus-fruit',  'orange',            'Orange',          3),
  ('citrus-fruit',  'pineapple',         'Pineapple',       4),
  ('citrus-fruit',  'green-apple',       'Green apple',     5),
  ('citrus-fruit',  'pear',              'Pear',            6),
  ('citrus-fruit',  'stone-fruit',       'Stone fruit',     7),

  ('floral',        'rose',              'Rose',            1),
  ('floral',        'jasmine',           'Jasmine',         2),
  ('floral',        'orange-blossom',    'Orange blossom',  3),
  ('floral',        'honeysuckle',       'Honeysuckle',     4),

  ('herbs-spice',   'black-pepper',      'Black pepper',    1),
  ('herbs-spice',   'cinnamon',          'Cinnamon',        2),
  ('herbs-spice',   'anise',             'Anise',           3),
  ('herbs-spice',   'clove',             'Clove',           4),
  ('herbs-spice',   'mint',              'Mint',            5),
  ('herbs-spice',   'eucalyptus',        'Eucalyptus',      6),

  ('sweet-caramel', 'vanilla',           'Vanilla',         1),
  ('sweet-caramel', 'caramel',           'Caramel',         2),
  ('sweet-caramel', 'honey',             'Honey',           3),
  ('sweet-caramel', 'butterscotch',      'Butterscotch',    4),
  ('sweet-caramel', 'chocolate',         'Chocolate',       5),
  ('sweet-caramel', 'maple',             'Maple',           6),

  ('wood-smoke',    'oak',               'Oak',             1),
  ('wood-smoke',    'toasted-oak',       'Toasted oak',     2),
  ('wood-smoke',    'coconut',           'Coconut',         3),
  ('wood-smoke',    'leather',           'Leather',         4),
  ('wood-smoke',    'tobacco',           'Tobacco',         5),
  ('wood-smoke',    'smoke',             'Smoke',           6)
)
insert into public.flavors (parent_id, slug, name, level, display_order)
select f.id, n.slug, n.name, 2, n.ord
from notes n
join public.flavors f
  on f.slug = n.family_slug and f.level = 1
on conflict (slug) do nothing;
