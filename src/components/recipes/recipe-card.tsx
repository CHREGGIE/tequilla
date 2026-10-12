import Link from "next/link";
import type { Recipe } from "@/types/database";

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card transition hover:border-accent/50"
    >
      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-copper-300/40 to-cream-100">
        <span className="text-4xl">🍹</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-cream-100 px-2 py-0.5 text-xs font-medium text-oak-700">
          {difficultyLabels[recipe.difficulty]}
        </span>
        <h3 className="font-semibold group-hover:text-accent">{recipe.name}</h3>
        <p className="line-clamp-2 text-sm text-muted">{recipe.description}</p>
      </div>
    </Link>
  );
}
