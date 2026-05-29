import Link from "next/link";
import { getAdminRecipes } from "@/app/actions/admin/recipes";

export default async function AdminRecipesPage() {
  const recipes = await getAdminRecipes();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recipes</h1>
          <p className="text-muted">{recipes.length} entries</p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-stone-950 hover:bg-accent-light"
        >
          Add recipe
        </Link>
      </div>

      <div className="space-y-2">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex items-center justify-between rounded-xl border border-card-border bg-card px-4 py-3"
          >
            <div>
              <p className="font-medium">{recipe.name}</p>
              <p className="text-sm text-muted">{recipe.difficulty}</p>
            </div>
            <Link
              href={`/admin/recipes/${recipe.id}`}
              className="text-sm text-accent-light hover:underline"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
