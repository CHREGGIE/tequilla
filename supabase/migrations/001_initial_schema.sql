-- Tequilla catalog schema (v1)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE producers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tequilas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('blanco', 'reposado', 'anejo', 'extra_anejo', 'cristalino')),
  description TEXT,
  additive_free BOOLEAN NOT NULL DEFAULT false,
  organic BOOLEAN NOT NULL DEFAULT false,
  agave_region TEXT,
  abv NUMERIC(4, 1),
  production_volume TEXT,
  noma TEXT,
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  price_min NUMERIC(10, 2),
  price_max NUMERIC(10, 2),
  tasting_notes TEXT,
  tasting_notes_structured JSONB,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tequila_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tequila_id UUID NOT NULL REFERENCES tequilas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  limited_edition BOOLEAN NOT NULL DEFAULT false,
  release_date DATE,
  image_url TEXT
);

CREATE TABLE tequila_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tequila_id UUID NOT NULL REFERENCES tequilas(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions TEXT NOT NULL,
  image_url TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recipe_tequilas (
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  tequila_id UUID NOT NULL REFERENCES tequilas(id) ON DELETE CASCADE,
  note TEXT,
  PRIMARY KEY (recipe_id, tequila_id)
);

CREATE TABLE favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tequila_id UUID NOT NULL REFERENCES tequilas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tequila_id)
);

CREATE TABLE wishlists (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tequila_id UUID NOT NULL REFERENCES tequilas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tequila_id)
);

-- Phase 3 placeholder
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tequila_id UUID NOT NULL REFERENCES tequilas(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Phase 2 placeholder
CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tequila_id UUID REFERENCES tequilas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  release_date DATE,
  image_url TEXT,
  published_at TIMESTAMPTZ
);

CREATE INDEX tequilas_slug_idx ON tequilas(slug);
CREATE INDEX tequilas_type_idx ON tequilas(type);
CREATE INDEX tequilas_additive_free_idx ON tequilas(additive_free);
CREATE INDEX tequilas_organic_idx ON tequilas(organic);
CREATE INDEX tequilas_price_range_idx ON tequilas(price_range);
CREATE INDEX tequilas_featured_idx ON tequilas(featured);
CREATE INDEX recipes_slug_idx ON recipes(slug);

ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tequilas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tequila_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tequila_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tequilas ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read producers" ON producers FOR SELECT USING (true);
CREATE POLICY "Public read tequilas" ON tequilas FOR SELECT USING (true);
CREATE POLICY "Public read tequila_editions" ON tequila_editions FOR SELECT USING (true);
CREATE POLICY "Public read tequila_images" ON tequila_images FOR SELECT USING (true);
CREATE POLICY "Public read recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Public read recipe_tequilas" ON recipe_tequilas FOR SELECT USING (true);
CREATE POLICY "Public read releases" ON releases FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

CREATE POLICY "Users manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own wishlists" ON wishlists
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
