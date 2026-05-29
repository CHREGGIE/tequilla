import type {
  TequilaFilters,
  TequilaWithProducer,
  TequilaDetail,
  Recipe,
} from "@/types/database";
import { createClient } from "@/lib/supabase/server";

const TEQUILA_SELECT = `
  *,
  producer:producers(*),
  tequila_images(*)
`;

export async function getTequilas(filters: TequilaFilters = {}) {
  const supabase = await createClient();

  let producerId: string | undefined;
  if (filters.producer) {
    const { data } = await supabase
      .from("producers")
      .select("id")
      .eq("name", filters.producer)
      .maybeSingle();
    producerId = data?.id;
    if (!producerId) return [];
  }

  let query = supabase
    .from("tequilas")
    .select(TEQUILA_SELECT)
    .order(
      filters.sort === "price"
        ? "price_min"
        : filters.sort === "newest"
          ? "created_at"
          : "name",
      { ascending: filters.sort === "price", nullsFirst: false },
    );

  if (filters.q) {
    query = query.or(
      `name.ilike.%${filters.q}%,description.ilike.%${filters.q}%`,
    );
  }
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.additive_free) query = query.eq("additive_free", true);
  if (filters.organic) query = query.eq("organic", true);
  if (filters.price_range) query = query.eq("price_range", filters.price_range);
  if (filters.agave_region) {
    query = query.ilike("agave_region", `%${filters.agave_region}%`);
  }
  if (producerId) {
    query = query.eq("producer_id", producerId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as TequilaWithProducer[];
}

export async function getFeaturedTequilas(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tequilas")
    .select(TEQUILA_SELECT)
    .eq("featured", true)
    .order("name")
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as TequilaWithProducer[];
}

export async function getTequilaBySlug(slug: string): Promise<TequilaDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tequilas")
    .select(`${TEQUILA_SELECT}, tequila_editions(*)`)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as TequilaDetail;
}

export async function getTequilaStats() {
  const supabase = await createClient();
  const { count: total } = await supabase
    .from("tequilas")
    .select("*", { count: "exact", head: true });
  const { count: additiveFree } = await supabase
    .from("tequilas")
    .select("*", { count: "exact", head: true })
    .eq("additive_free", true);
  const { count: organic } = await supabase
    .from("tequilas")
    .select("*", { count: "exact", head: true })
    .eq("organic", true);

  return {
    total: total ?? 0,
    additiveFree: additiveFree ?? 0,
    organic: organic ?? 0,
  };
}

export async function getFilterOptions() {
  const supabase = await createClient();

  const [regionsResult, producersResult] = await Promise.all([
    supabase.from("tequilas").select("agave_region"),
    supabase.from("producers").select("name").order("name"),
  ]);

  const regions = [
    ...new Set(
      (regionsResult.data ?? [])
        .map((row) => row.agave_region)
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort();

  const producers = (producersResult.data ?? []).map((row) => row.name);

  return { regions, producers };
}

export async function getRecipesForTequila(tequilaId: string): Promise<Recipe[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_tequilas")
    .select("recipe:recipes(*)")
    .eq("tequila_id", tequilaId);

  if (error) return [];
  return (data ?? [])
    .map((row) => (row as unknown as { recipe: Recipe | null }).recipe)
    .filter((recipe): recipe is Recipe => Boolean(recipe));
}
