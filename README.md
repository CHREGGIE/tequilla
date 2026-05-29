# Tequilla

The world's tequila catalog — browse additive-free, organic, and premium tequilas with tasting notes, recipes, and favorites.

## Stack

- **Next.js 16** (App Router)
- **Supabase** (PostgreSQL, Auth, Storage)
- **Tailwind CSS**

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open **SQL Editor** and run both migrations:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_storage_and_admin.sql`
3. Under **Project Settings → API**, copy your project URL and keys

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAILS=you@example.com
```

### 3. Seed the database

```bash
npm run seed
```

This imports **103 curated tequilas** from 30 producers and **12 cocktail recipes**.

### 3b. Bulk import CRT registry (optional)

Import official brand/NOM/producer records from the [CRT certified brands list](https://www.crt.org.mx/empresas-y-marcas-certificadas/) — factual data only (no reviews or images).

1. Run migration `supabase/migrations/003_crt_import_fields.sql` in Supabase SQL Editor
2. Import:

```bash
npm run import:crt
```

If the CRT site is slow, save the page as HTML in your browser and run:

```bash
npm run import:crt -- --file=./data/crt-page.html
```

Options:
- `--limit=500` — import first N records (for testing)
- Existing curated seed entries are preserved (not overwritten)

CRT imports create **brand-level** records (one per registered marca + NOM). Expression type defaults to blanco as a placeholder until you enrich via admin.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features (v1)

- Browse & filter tequilas (additive-free, organic, price, type, region, producer)
- Detail pages with tasting notes, producer info, special editions
- Recipe catalog with recommended tequila pairings
- User accounts with favorites & wishlist
- 103-bottle seed dataset
- **Admin dashboard** at `/admin` — CRUD tequilas & recipes, upload bottle images
- **Supabase Storage** for bottle photos

## Admin access

1. Add your email to `ADMIN_EMAILS` in `.env.local` (comma-separated for multiple admins)
2. Add `SUPABASE_SERVICE_ROLE_KEY` — required for admin writes and image uploads
3. Sign in, then visit [/admin](http://localhost:3000/admin)

On Vercel, add `ADMIN_EMAILS` and `SUPABASE_SERVICE_ROLE_KEY` as environment variables, then redeploy.

## Uploading bottle images

1. Go to **Admin → Tequilas → Edit** any bottle
2. Scroll to **Bottle images** and click **Upload image**
3. First upload becomes the primary catalog photo automatically

## Phase 2 (remaining)

- New releases feed
- Bulk image import
