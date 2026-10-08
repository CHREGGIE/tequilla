# Learn, Brands & Producers — Design Spec

**Date:** 2026-10-08
**Status:** Draft — pending Greg's review
**Source:** Step 4 of `docs/handoff-2026-10-08.md`

## Overview

Add the three content surfaces the data model now supports but the site doesn't show yet:

1. **Learn** — editorial hub and entry pages backed by `learn_entries` (migration 007), plus inline tooltips and contextual cards on tequila pages.
2. **Producers** — distillery pages at `/producers/[slug]` and a map of producers with coordinates (migration 005).
3. **Brands** — brand pages at `/brands/[slug]` (migration 006). These are the monetization surface, so tier-based features get hooks now even though none are sold yet.

After brand cleanup lands, the catalog switches from `source != 'crt'` to `brand_id IS NOT NULL`.

## Preconditions

| Needed | Status | Blocks |
|---|---|---|
| Migration 007 applied + `npm run learn:seed` | Pending | Learn pages, tooltip, Learn-more cards |
| `npm run brands:propose` → review → `brands:apply` | Pending (code ready) | Real data on brand pages, catalog filter switch |
| Producer lat/lng populated (86 rows per handoff) | Done | — |

Pages must render correctly while these are pending (empty states, no crashes). That lets the code ship before the data is ready.

## Non-goals

- **Rebrand.** The site still uses Geist and the dark stone/amber palette with the "Tequilla" wordmark. The locked Tequillist identity in `CLAUDE.md` (Fraunces/Inter, paper/agave/copper, "tequillist" wordmark) is a separate spec. New pages use **only the existing semantic tokens** (`bg-card`, `border-card-border`, `text-muted`, `text-accent-light`), never raw palette classes. A later token swap then restyles them for free.
- Brand claim flow, payments, or tier enforcement — hooks only (see Brands).
- Admin CRUD for learn entries, brands or producer coordinates. Supabase Studio and scripts cover this for now.
- Cache Components / `use cache`. The app doesn't enable `cacheComponents`, and every page reads the auth cookie through `createClient()`. Keep the current dynamic model and revisit caching as its own piece of work.
- Renaming `src/middleware.ts` → `proxy.ts` (separate, tiny).

## Data access

New query modules follow the `src/lib/queries/*.ts` pattern, using the server `createClient()`:

- `queries/learn.ts`
  - `getLearnEntries()` — all published entries ordered by `kind, display_order`
  - `getLearnEntry(slug)`
  - `getLearnExcerpts(slugs[])` — slug → `{title, excerpt}`. Wrapped in React `cache()` so ten tooltips on one page cost one query.
- `queries/producers.ts` — `getProducerBySlug(slug)`, `getProducerMapPins()` (view `producer_map_pins`), `getBrandsForProducer(producerId)` (view `brand_summaries`)
- `queries/brands.ts` — `getBrandBySlug(slug)`, `getBrandSummaries()`, `getExpressionsForBrand(brandId)`

`src/types/database.ts` is hand-written. Changes:
- Extend `Producer` with `slug`, `noma`, `latitude`, `longitude`, `town`, `do_region`.
- Add `Tequila.brand_id`.
- Add `Brand`, `BrandSummary`, `ProducerMapPin`, `LearnEntry` and `SubscriptionTier`.

Alternatively, generate the types from Supabase. That's a bigger diff, but it removes drift.

Shared helper in `lib/utils.ts`: `formatDoRegion(code)` maps the 7 `do_region` codes to display labels ("Jalisco — Los Altos", …).

## 1. Learn

### `/learn` — hub
- Entries grouped by `kind` under three headings: **Terms**, **Guides**, **People**, in that order. Within each group, sort by `display_order`.
- Card per entry: title + excerpt, linking to `/learn/[slug]`.
- Empty state while 007 is unapplied: "Learn is coming soon." Don't throw on a missing table; treat a query error as an empty list and log it.

### `/learn/[slug]` — entry
- Title (h1), kind label, rendered `body_md`, and "Related" cards from `related_slugs` (only those that resolve to published entries).
- Markdown: `react-markdown` (v10, React 19-compatible). Raw HTML stays disabled (the default), so nothing needs sanitizing. A `components` override routes internal links (`/…`) through `next/link` and opens external links in a new tab with `rel="noopener noreferrer"`. Prose styling is a small set of element classes in that override, so there's no new `@tailwindcss/typography` dependency.
- `generateMetadata`: title = entry title, description = excerpt.
- `notFound()` for an unknown or unpublished slug (RLS already hides unpublished rows).

### `<LearnTooltip term="nom-numbers">NOM 1146</LearnTooltip>`
Children replace the handoff's `trigger` prop, which reads more naturally in JSX.
- A server component fetches the excerpt via `getLearnExcerpts`, then renders a small client component.
- The trigger is a `<button>` with dotted underline, `aria-describedby`, and a popover on hover, focus or tap. It closes on Escape or a tap outside. The popover shows the excerpt plus a "Read more →" link to `/learn/[term]`.
- If the entry is missing, render the children as plain text: never a broken tooltip.

### `<TequilaLearnMore tequila={…} />`
A card stack placed on `/tequilas/[slug]` below the details. Rules, evaluated in order:

| Condition | Card (slug) |
|---|---|
| always | `nom-numbers` |
| always | `types-of-tequila` |
| `additive_free = true` | `additive-free-tequila` |
| `producer.noma ∈ {1139, 1579}` | `the-camarena-family` |
| `organic = true` (future) | `organic` — entry doesn't exist yet; the rule is a no-op until it does |

Cards whose entry is missing are dropped, and the section is hidden if none remain. The rule table lives in one exported constant so editorial can extend it without touching JSX.

The tequila detail page also wraps its "NOM" label in `<LearnTooltip term="nom-numbers">`.

## 2. Producers

### `/producers` — map + list
- **Map:** MapLibre GL JS with OpenFreeMap tiles (free, no API key, no usage cap). It's client-only and lazy-loaded with `next/dynamic` and `ssr: false`, so the ~200 KB bundle loads only on this route.
- Pins come from `producer_map_pins`. Clicking a pin shows a popup with name, NOM, town, tequila count and additive-free count, plus a link to `/producers/[slug]`.
- The initial view fits the pins' bounds; most will cluster in Jalisco. Enable clustering only if overlap is bad in practice.
- **List below the map:** every producer (not only those with pins), grouped by `do_region` and linked to the detail page. The list is the accessible, crawlable equivalent of the map.

### `/producers/[slug]` — distillery
- Header: name, NOM, town + `formatDoRegion(do_region)`, website.
- A small single-pin map (same component, non-interactive), shown only if there are coordinates.
- **Brands made here:** cards from `brand_summaries` where `distillery_id` = this producer. Until brands are applied this is empty, so fall back to the producer's curated tequilas (`source != 'crt'`) and show a count line: "N brands registered with the CRT at this NOM."
- Big NOMs (1438 has 330 brands) get a simple paginated or "show all" list, not 330 cards.
- `generateMetadata` with name + NOM.

The tequila detail page's producer link changes from `/tequilas?producer=…` to `/producers/[slug]` when the producer has a slug.

## 3. Brands

### `/brands/[slug]` — brand
- Header: name, logo, hero image (`next/image`; the Supabase storage host is already allowed in `next.config.ts`), founded year, website, Instagram.
- "Made at {distillery} (NOM xxxx)", linking to `/producers/[slug]`.
- Expressions: `TequilaCard`s for tequilas with this `brand_id`, ordered by type (blanco → extra añejo, cristalino last).
- Story/description if present, with a `<TequilaLearnMore>`-style card for the distillery's NOM.

**Tier hooks.** These are rendered from `subscription_tier`, with no payment logic:

| Tier | Behaviour now |
|---|---|
| `free` | Basic page. Footer line: "Is this your brand? Claim this page" → `mailto:` placeholder (no claim flow yet). |
| `verified` | "Verified by brand" badge, no claim line. |
| `premium` | As verified, plus hero image and `story` rendered. These fields are free-tier-hidden *if* we decide to gate them; see open questions. |
| `sponsored` | As premium. Placement boosts happen in listings, not on this page. |

Tier checks go through one helper, `brandFeatures(tier)` → `{ showClaimCta, showVerifiedBadge, showHero, showStory }`, so the gating policy lives in one place.

**SEO guard.** After `brands:apply` there will be roughly 700–900 brands, most with a single CRT placeholder expression. Those pages are thin. Brands with **no curated expression and no description** render with `robots: { index: false }` until enriched.

### `/brands` — index
Minimal: an A–Z list from `brand_summaries` with expression count and distillery, plus filters for additive-free count > 0 and do_region. Brands with a `featured_until` in the future sort first. That's the sponsored placement hook.

## 4. Navigation

Header gains **Learn**, **Brands** and **Producers**, for this order: Tequilas · Brands · Producers · Learn · Recipes.

## 5. Catalog filter switch (data-gated)

After `brands:apply` has run and been spot-checked:
- `getTequilas` "curated" view changes from `source != 'crt'` to `brand_id IS NOT NULL`, and the same goes for `getCatalogCounts`.
- Do this in its own commit so it can be reverted independently.
- **Lalo fix first.** Otherwise the catalog starts showing the CRT LALO row alongside the wrong-NOM curated one. See the handoff's "Lalo brand mess".

## Build order

Each step is a separate commit that builds and lints on its own:

1. Types + query modules + `formatDoRegion`, and add `react-markdown`.
2. `/learn`, `/learn/[slug]`, `LearnTooltip`, `TequilaLearnMore`, plus wiring into the tequila page.
3. `/producers` + `/producers/[slug]` + map component, and re-point the producer link.
4. `/brands/[slug]` + `/brands` + `brandFeatures`.
5. Header nav.
6. *(after data)* Catalog filter switch.

## Acceptance

- `npm run lint` and `next build` pass at every step.
- With migration 007 unapplied and `brands` empty, every new route renders an empty state (no 500s).
- With seeded data:
  - `/learn` shows 6 entries in 3 groups.
  - A Fortaleza page shows NOM, types and additive-free cards.
  - A Tapatio page also shows the Camarena card.
  - `/producers` shows the pins.
  - the NOM 1139 (La Alteña) producer page lists its brands.
- Keyboard: the tooltip opens on focus and closes on Escape, and map pins have a list equivalent.
- No raw palette classes in new components (grep for `stone-|amber-|emerald-|slate-` in new files).

## Open questions for Greg

1. **Rebrand timing.** Should it happen before these pages (one restyle) or after (as specced)? Recommendation: after. The new pages use semantic tokens only, so the swap is cheap later.
2. **Premium gating.** Should free brands lose hero and story, or should free brands get the full page while premium adds placement and media extras? Hiding content brands already have may annoy the people we want to convert. Recommendation: free shows everything we have; premium adds placement, extra media and a lead form.
3. **Claim CTA target.** Is a `mailto:` fine for now, or do you want a simple form that writes to a `brand_claims` table?
4. **Thin-page `noindex`.** Agree with noindexing CRT-only brands until enriched?
5. **Map tiles.** Is OpenFreeMap acceptable? The alternative is Mapbox, which needs a key and has usage billing.
