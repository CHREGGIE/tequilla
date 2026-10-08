-- 007_learn_entries.sql
-- Editorial content for /learn — terms (glossary), guides (long-form),
-- and people (families, figures). Each entry has a short excerpt for
-- inline use on tequila pages and a full markdown body for the
-- dedicated page.

create table public.learn_entries (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  kind            text not null check (kind in ('term', 'guide', 'people')),

  excerpt         text not null,
  body_md         text not null,

  hero_image_url  text,
  related_slugs   text[] not null default '{}',

  display_order   int  not null default 0,
  published_at    timestamptz default now(),
  updated_at      timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

comment on table public.learn_entries is
  'Editorial content. Terms = short definitional entries. Guides = long-form. People = families and figures.';
comment on column public.learn_entries.excerpt is
  '1-2 sentence condensed version. Surfaced in tooltips and tequila page Learn-more cards.';
comment on column public.learn_entries.body_md is
  'Full content as markdown. Rendered on /learn/[slug].';
comment on column public.learn_entries.related_slugs is
  'Slugs of related entries for cross-linking at the bottom of each entry page.';

create index learn_entries_kind_idx       on public.learn_entries(kind);
create index learn_entries_published_idx  on public.learn_entries(published_at)
  where published_at is not null;
create index learn_entries_display_idx    on public.learn_entries(kind, display_order);

create trigger learn_entries_set_updated_at
  before update on public.learn_entries
  for each row execute function public.tg_set_updated_at();

alter table public.learn_entries enable row level security;

create policy "learn_entries_public_read"
  on public.learn_entries for select
  using (published_at is not null);

create policy "learn_entries_admin_all"
  on public.learn_entries for all
  using      (auth.uid() in (select user_id from public.admin_users))
  with check (auth.uid() in (select user_id from public.admin_users));
