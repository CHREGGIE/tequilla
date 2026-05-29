import { RecipeCard } from "@/components/recipes/recipe-card";
import { isSupabaseConfigured } from "@/lib/utils";
import { getRecipes } from "@/lib/queries/recipes";

export default async function RecipesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Tequila Recipes</h1>
        <p className="mt-2 text-muted">Connect Supabase to browse recipes.</p>
      </div>
    );
  }

  const recipes = await getRecipes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tequila Recipes</h1>
        <p className="mt-1 text-muted">
          Classic cocktails and modern serves — paired with recommended bottles
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
