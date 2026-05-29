# Tequilla Catalog — Design Spec

**Date:** 2026-05-29  
**Status:** Draft — pending user review

## Overview

A tequila reference site for enthusiasts and shoppers. Browse ~100 imported bottles with rich detail pages, filter by additive-free/organic/price, save favorites and wishlists, and explore cocktail recipes. Backed by Supabase; admin dashboard and new releases deferred to phase 2; user reviews deferred to phase 3.

## Goals

| Audience | Needs |
|---|---|
| Enthusiasts | Deep bottle profiles, producer history, special editions, tasting notes |
| Shoppers | Quick filters (additive-free, organic, price range), comparison-friendly cards |

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js App (Vercel)               │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Catalog  │ │ Recipes  │ │ Auth (login)   │  │
│  │ browse   │ │ browse   │ │ favorites      │  │
│  │ filter   │ │ detail   │ │ wishlist       │  │
│  │ detail   │ │          │ │                │  │
│  └────┬─────┘ └────┬─────┘ └───────┬────────┘  │
└───────┼────────────┼───────────────┼────────────┘
        │            │               │
        ▼            ▼               ▼
┌─────────────────────────────────────────────────┐
│                   Supabase                      │
│  PostgreSQL  │  Auth  │  Storage (images)      │
└─────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SEO, server components, API routes for seed script |
| Styling | Tailwind CSS | Fast iteration, responsive filters/cards |
| Backend | Supabase | Postgres, Auth, Storage, RLS in one service |
| Hosting | Vercel | Native Next.js deployment |
| Search | Postgres full-text + filters | Sufficient for ~100 bottles; upgrade path to Typesense/Meilisearch later |

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # seed script + server-only writes
```

## Database Schema

### Core Tables (v1)

**producers**
- `id` uuid PK
- `name` text NOT NULL
- `region` text (e.g. Highlands, Lowlands)
- `description` text
- `website` text
- `logo_url` text

**tequilas**
- `id` uuid PK
- `producer_id` uuid FK → producers
- `name` text NOT NULL
- `slug` text UNIQUE NOT NULL
- `type` text — `blanco | reposado | anejo | extra_anejo | cristalino`
- `description` text
- `additive_free` boolean DEFAULT false
- `organic` boolean DEFAULT false
- `agave_region` text
- `abv` numeric
- `production_volume` text (e.g. "12,000 L/year", "Small batch")
- `noma` text (CRT registry number)
- `price_range` text — `$ | $$ | $$$ | $$$$`
- `price_min` numeric (optional)
- `price_max` numeric (optional)
- `tasting_notes` text
- `tasting_notes_structured` jsonb (optional: nose, palate, finish)
- `featured` boolean DEFAULT false
- `created_at` timestamptz
- `updated_at` timestamptz

**tequila_editions** (special/limited releases)
- `id` uuid PK
- `tequila_id` uuid FK → tequilas
- `name` text NOT NULL
- `description` text
- `limited_edition` boolean DEFAULT false
- `release_date` date
- `image_url` text

**tequila_images**
- `id` uuid PK
- `tequila_id` uuid FK → tequilas
- `url` text NOT NULL (Supabase Storage path)
- `alt_text` text
- `is_primary` boolean DEFAULT false
- `sort_order` int DEFAULT 0

**recipes**
- `id` uuid PK
- `name` text NOT NULL
- `slug` text UNIQUE NOT NULL
- `description` text
- `ingredients` jsonb (array of { item, amount, unit })
- `instructions` text
- `image_url` text
- `difficulty` text — `easy | medium | hard`
- `created_at` timestamptz

**recipe_tequilas** (many-to-many)
- `recipe_id` uuid FK → recipes
- `tequila_id` uuid FK → tequilas
- `note` text (e.g. "Use a additive-free blanco")
- PRIMARY KEY (recipe_id, tequila_id)

**favorites**
- `user_id` uuid FK → auth.users
- `tequila_id` uuid FK → tequilas
- `created_at` timestamptz
- PRIMARY KEY (user_id, tequila_id)

**wishlists**
- `user_id` uuid FK → auth.users
- `tequila_id` uuid FK → tequilas
- `created_at` timestamptz
- PRIMARY KEY (user_id, tequila_id)

### Future Tables (schema only, no v1 UI)

**reviews** (phase 3)
- `id` uuid PK
- `user_id` uuid FK → auth.users
- `tequila_id` uuid FK → tequilas
- `rating` int CHECK (1–5)
- `title` text
- `body` text
- `created_at` timestamptz
- `updated_at` timestamptz

**releases** (phase 2 — new releases feed)
- `id` uuid PK
- `tequila_id` uuid FK → tequilas (nullable)
- `title` text NOT NULL
- `description` text
- `release_date` date
- `image_url` text
- `published_at` timestamptz

### Row Level Security

| Table | Policy |
|---|---|
| producers, tequilas, editions, images, recipes, recipe_tequilas | Public SELECT |
| favorites, wishlists | Users SELECT/INSERT/DELETE own rows only |
| All catalog writes | Service role only (v1); admin role in phase 2 |

## Data Import (Seed ~100 Bottles)

1. **CRT public registry** — producer names, NOM numbers, brand names
2. **Additive-free cross-reference** — Tequila Matchmaker verified brands, manual flagging
3. **Seed script** (`scripts/seed.ts`) — normalizes CSV/JSON, upserts into Supabase via service role
4. **Manual enrichment** — images, tasting notes, price range, production volume via Supabase Studio until admin dashboard ships

Target: 100 bottles across blanco/reposado/añejo mix, prioritizing additive-free and organic brands for shopper appeal.

## Pages & UI

**Visual direction:** Premium spirits catalog — dark amber/gold palette, clean typography, large bottle photography.

### v1 Routes

| Route | Purpose |
|---|---|
| `/` | Hero search, filter chips, featured tequilas, recipe spotlight, stats |
| `/tequilas` | Filterable catalog grid |
| `/tequilas/[slug]` | Full bottle detail page |
| `/recipes` | Recipe grid |
| `/recipes/[slug]` | Recipe detail with linked tequilas |
| `/account` | Favorites + wishlist (auth required) |
| `/login` | Supabase Auth (email magic link or email/password) |

### Catalog Filters (v1)

- Type (blanco, reposado, añejo, extra añejo, cristalino)
- Additive-free (boolean)
- Organic (boolean)
- Price range ($–$$$$)
- Agave region
- Producer

### Sort Options

- Name A–Z
- Price (low → high)
- Newest

### Detail Page Sections

1. Image gallery (primary + editions)
2. Badges: additive-free, organic, type, price range
3. Info grid: producer, NOM, region, ABV, production volume
4. Tasting notes
5. Special editions list
6. Related recipes
7. Favorite / wishlist actions

## Phasing

### Phase 1 (this build)

- [ ] Supabase project setup (DB, Auth, Storage)
- [ ] Database migrations + RLS policies
- [ ] Seed script + ~100 bottle import
- [ ] Next.js app scaffold
- [ ] Catalog browse, filter, search, detail pages
- [ ] Recipe pages (~10–15 seed recipes)
- [ ] Supabase Auth + favorites/wishlist
- [ ] Responsive UI (mobile-first filters)
- [ ] Deploy to Vercel

### Phase 2

- [ ] Admin dashboard (CRUD tequilas, recipes, upload images)
- [ ] New releases feed (`/releases`)
- [ ] Expand catalog beyond 100 bottles

### Phase 3

- [ ] User reviews and ratings
- [ ] Social features (optional)

## Error Handling

- Missing bottle image → placeholder silhouette with brand initials
- Empty filter results → friendly message + suggest clearing filters
- Auth errors → inline toast, redirect to login for protected actions
- Supabase downtime → cached static pages where possible (ISR on catalog)

## Testing (v1)

- Seed script idempotency (re-run without duplicates)
- RLS policy verification (users cannot read others' favorites)
- Filter combinations return expected results
- Auth flow: sign up, add favorite, view on account page
- Responsive layout on mobile viewport

## Out of Scope (v1)

- Admin dashboard
- New releases section
- User reviews
- E-commerce / purchase links
- Community submissions
- Advanced search (faceted search engine)
