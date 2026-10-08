@AGENTS.md

# Tequillist — Project Context for Claude Code

The world's tequila catalog. Browse additive-free, organic, and premium tequilas with tasting notes, producer context, and editorial.

**Live:** [tequilla-ten.vercel.app](https://tequilla-ten.vercel.app)
**Repo:** github.com/CHREGGIE/tequilla
**Brand:** "Tequillist" — pronounced "te-KILL-ist"

---

## Stack

- Next.js 16.2.6 (App Router) + React 19
- Supabase (Postgres, Auth, Storage) via SSR helpers
- Tailwind CSS 4 (no UI library — pure Tailwind, design tokens below)
- TypeScript strict
- Deployed on Vercel

**Supabase project ID:** `awltikkhnrhzebtcwhaf` (us-west-2)
**Vercel project:** `prj_DAr2v6Gk2RcQuEXyChHklWJBIggY` · team `team_IDqo1dKdd7ZMfPNoPwDmqs2L`

---

## Working style

- **Discerning, critical feedback — no reflexive praise.** Push back when something's weak.
- **Spec-first.** Workflow uses `docs/superpowers/specs/`. Write the spec, then build.
- **Greg edits on GitHub too.** Always `git pull` before `npm` commands.
- **Terminal:** Greg works locally on Windows + MINGW (account for path quirks); Claude Code cloud sessions run on Linux.
- **Scripts for data work.** Prefer TypeScript scripts in `scripts/` run via `tsx --env-file=.env.local` over one-off SQL.

---

## Data model (3-tier — critical to understand)

The flat producer→tequila model is wrong. Real structure:

1. **Distillery** = `public.producers` — the NOM operator (physical plant)
2. **Brand** = `public.brands` — consumer-facing label (monetization target)
3. **Expression** = `public.tequilas` — SKU, has `brand_id` FK to brands

**Why this matters:** One NOM runs many brands (NOM 1438 runs 330). One brand sells many expressions (blanco/reposado/añejo). Brand owners — not distilleries — pay for enhanced listings. The catalog, filters, URLs, and monetization all key off `brands`, not `tequilas`.

**Current table state:**
- `producers` — all CRT NOMs present (~150)
- `brands` — table exists, cleanup pending (0 rows as of last session)
- `tequilas` — ~3,015 rows (103 curated with full data, rest `source='crt'` placeholders)
- `flavors` — 6 families + 34 notes seeded
- `learn_entries` — editorial content (NOM explainers, additive-free guide, etc.) — **pending** migration 007 + `npm run learn:seed`

**Source column convention:**
- `source='seed'` — curated with tasting notes, price, ABV, images
- `source='crt'` — brand-level placeholder from CRT registry, `type='blanco'` default
- `source='manual'` — hand-added, mixed quality

**Catalog filter:** `/tequilas` currently filters `source != 'crt'`. Lift this to `brand_id IS NOT NULL` after brand cleanup.

---

## Brand identity (locked)

### Typography
- **Fraunces** (display, serif) — Google Fonts via `next/font/google`
- **Inter** (UI, sans) — Google Fonts via `next/font/google`

### Color tokens (Tailwind)
Neutrals: `paper #F7F2E8`, `cream-50 #FBF8F0`, `cream-100 #EFE7D4`, `bone #D7CCB4`, `oak-400 #8C7250`, `oak-700 #4F3823`, `espresso #1F1410`
Accents: `agave-100/300/500/700 #E2E7C8/#BFCC8E/#7A8E3A/#495220`, `copper-300/500/700 #DDB89A/#B97649/#6B3F23`, `rosa-300 #D7A99B`
Dark mode palette defined separately.

### Logo
Lowercase "tequillist" wordmark + 9-leaf agave glyph.

### Voice
Knowledgeable, not snobby. Opinionated, not preachy. Spanish vocabulary used naturally with inline tooltips/glossary. Insider tone — assume reader is curious, not clueless.

---

## Monetization

`brands.subscription_tier` enum: `free | verified | premium | sponsored`

- **Free:** basic brand page, no claim
- **Verified:** brand owner has claimed the page
- **Premium:** paid tier — featured placement, enhanced media
- **Sponsored:** paid category/filter promotion

`brands.claimed_by_user_id` tracks ownership.

---

## CRT data pipeline

**Source:** `crt.org.mx/empresas-y-marcas-certificadas/` (server-rendered HTML, Cheerio-scrapable).
**NOT scrapable:** `crt.org.mx/EstadisticasCRTweb/` — Power BI embed, JS-only.

**Scripts:**
- `scripts/import-crt.ts` — one-time bulk import
- `scripts/sync-crt.ts` — delta detection (`--dry-run` previews, no flag applies)

**Automation:** `.github/workflows/crt-sync.yml` runs Mondays 06:00 UTC. Needs `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in GitHub secrets.

**Nuance:** CRT imports create brand-level rows, not real expressions. One registered "marca" at a NOM = one `tequilas` row with `type='blanco'` as placeholder. Real expression breakdown happens via admin enrichment or future scraping of Tequila Matchmaker.

---

## NOM anchors (memorize these)

| NOM | Distillery | Notes |
|-----|------------|-------|
| 1068 | Agroindustria Guadalajara | |
| 1102 | Casa Sauza | 15 brands |
| 1122 | Casa Cuervo | 56 brands |
| 1137 | La Cofradia | ~71 brands |
| 1139 | La Alteña | Camarena family (El Tesoro, Tapatio) |
| 1146 | La Fortaleza | ⚠️ seed data has wrong assignments to this NOM |
| 1414 | Feliciano Vivanco | |
| 1438 | Destiladora del Valle | 330 brands (Cuervo contract arm) |
| 1468 | Lalo's actual NOM | ⚠️ seed data has Lalo at wrong NOM |
| 1492 | Hacienda Patrón | |
| 1499 | Casa Tequilera de Arandas | 46 brands, includes Mijenta |
| 1574 | Destiladora Marava | |
| 1579 | El Pandillo | Camarena family (G4, Pasote) |

---

## Scripts (package.json)

```json
"brands:propose": "tsx --env-file=.env.local scripts/propose-brands.ts",
"brands:apply": "tsx --env-file=.env.local scripts/apply-brands.ts",
"learn:seed": "tsx --env-file=.env.local scripts/seed-learn.ts",
"import:crt": "tsx --env-file=.env.local scripts/import-crt.ts",
"sync:crt": "tsx --env-file=.env.local scripts/sync-crt.ts",
"seed": "tsx --env-file=.env.local scripts/seed.ts"
```

---

## Industry context

- ~4,000 active tequila brands in the US market
- ~140-150 licensed distilleries in Mexico
- Tequila Matchmaker tracks ~1,716 brands (~1,196 currently active per CRT)
- Tequila Matchmaker is the closest thing to a competitor — their angle is reviews and additive-free verification, Tequillist's angle is editorial depth, brand-tier monetization, and producer-page memberships

---

## Session handoffs

Session-specific state lives in `docs/handoff-YYYY-MM-DD.md`. Read the newest one at the start of a session to pick up where the last one left off. Delete handoff files once their action items are done.
