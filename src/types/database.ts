export type TequilaType =
  | "blanco"
  | "reposado"
  | "anejo"
  | "extra_anejo"
  | "cristalino";

export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export type RecipeDifficulty = "easy" | "medium" | "hard";

export interface Producer {
  id: string;
  name: string;
  region: string | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
}

export interface Tequila {
  id: string;
  producer_id: string;
  name: string;
  slug: string;
  type: TequilaType;
  description: string | null;
  additive_free: boolean;
  organic: boolean;
  agave_region: string | null;
  abv: number | null;
  production_volume: string | null;
  noma: string | null;
  price_range: PriceRange | null;
  price_min: number | null;
  price_max: number | null;
  tasting_notes: string | null;
  tasting_notes_structured: {
    nose?: string;
    palate?: string;
    finish?: string;
  } | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface TequilaEdition {
  id: string;
  tequila_id: string;
  name: string;
  description: string | null;
  limited_edition: boolean;
  release_date: string | null;
  image_url: string | null;
}

export interface TequilaImage {
  id: string;
  tequila_id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface RecipeIngredient {
  item: string;
  amount: string;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ingredients: RecipeIngredient[];
  instructions: string;
  image_url: string | null;
  difficulty: RecipeDifficulty;
  created_at: string;
}

export interface TequilaWithProducer extends Tequila {
  producer: Producer;
  tequila_images: TequilaImage[];
}

export interface TequilaDetail extends TequilaWithProducer {
  tequila_editions: TequilaEdition[];
}

export interface RecipeWithTequilas extends Recipe {
  recipe_tequilas: Array<{
    note: string | null;
    tequila: TequilaWithProducer;
  }>;
}

export interface TequilaFilters {
  q?: string;
  type?: TequilaType;
  additive_free?: boolean;
  organic?: boolean;
  price_range?: PriceRange;
  agave_region?: string;
  producer?: string;
  sort?: "name" | "price" | "newest";
}
