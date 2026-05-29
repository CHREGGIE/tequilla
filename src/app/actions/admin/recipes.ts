"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { RecipeDifficulty } from "@/types/database";

export interface RecipeFormData {
  id?: string;
  name: string;
  description: string;
  difficulty: RecipeDifficulty;
  instructions: string;
  ingredientsJson: string;
}

export async function createRecipe(data: RecipeFormData) {
  await requireAdmin();
  const supabase = createServiceClient();
  const ingredients = JSON.parse(data.ingredientsJson || "[]");
  const slug = slugify(data.name);

  const { error } = await supabase.from("recipes").insert({
    name: data.name,
    slug,
    description: data.description || null,
    difficulty: data.difficulty,
    instructions: data.instructions,
    ingredients,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/recipes");
  revalidatePath("/admin/recipes");
  redirect("/admin/recipes");
}

export async function updateRecipe(data: RecipeFormData) {
  if (!data.id) throw new Error("Missing recipe id");
  await requireAdmin();
  const supabase = createServiceClient();
  const ingredients = JSON.parse(data.ingredientsJson || "[]");

  const { error } = await supabase
    .from("recipes")
    .update({
      name: data.name,
      slug: slugify(data.name),
      description: data.description || null,
      difficulty: data.difficulty,
      instructions: data.instructions,
      ingredients,
    })
    .eq("id", data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/recipes");
  revalidatePath("/admin/recipes");
}

export async function deleteRecipe(id: string) {
  await requireAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/recipes");
  revalidatePath("/admin/recipes");
  redirect("/admin/recipes");
}

export async function getAdminRecipes() {
  await requireAdmin();
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("recipes").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminRecipe(id: string) {
  await requireAdmin();
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("recipes").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}
