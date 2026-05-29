import { createClient } from "@/lib/supabase/server";
import type { RecipeWithTequilas } from "@/types/database";

export async function getRecipes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedRecipe() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function getRecipeBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      recipe_tequilas(
        note,
        tequila:tequilas(
          *,
          producer:producers(*),
          tequila_images(*)
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as RecipeWithTequilas;
}
