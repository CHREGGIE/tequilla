import Link from "next/link";
import { notFound } from "next/navigation";
import { TequilaCard } from "@/components/tequilas/tequila-card";
import { getRecipeBySlug } from "@/lib/queries/recipes";
import { isSupabaseConfigured } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RecipeDetailPage({ params }: PageProps) {
  if (!isSupabaseConfigured()) notFound();

  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-light">
          {recipe.difficulty} · Recipe
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{recipe.name}</h1>
        {recipe.description && (
          <p className="mt-4 text-lg text-muted">{recipe.description}</p>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-card-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between gap-4 text-sm">
                <span>{ingredient.item}</span>
                <span className="text-muted">
                  {ingredient.amount} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-card-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Instructions</h2>
          <p className="whitespace-pre-line leading-relaxed text-muted">
            {recipe.instructions}
          </p>
        </section>
      </div>

      {recipe.recipe_tequilas?.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-2xl font-bold">Recommended tequilas</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipe.recipe_tequilas.map(({ tequila, note }) => (
              <div key={tequila.id} className="space-y-2">
                <TequilaCard tequila={tequila} />
                {note && <p className="text-sm text-muted">{note}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link href="/recipes" className="text-sm text-accent-light hover:underline">
          ← All recipes
        </Link>
      </div>
    </div>
  );
}
