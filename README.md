# Tequilla

The world's tequila catalog — browse additive-free, organic, and premium tequilas with tasting notes, recipes, and favorites.

## Stack

- **Next.js 16** (App Router)
- **Supabase** (PostgreSQL, Auth, Storage)
- **Tailwind CSS**

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open **SQL Editor** and run the migration in `supabase/migrations/001_initial_schema.sql`
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
```

### 3. Seed the database

```bash
npm run seed
```

This imports **103 tequilas** from 30 producers and **12 cocktail recipes**.

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

## Phase 2 (planned)

- Admin dashboard
- New releases feed
- Image uploads via Supabase Storage
