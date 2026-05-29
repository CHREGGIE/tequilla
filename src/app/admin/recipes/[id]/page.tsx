import { notFound } from "next/navigation";
import { getAdminRecipe } from "@/app/actions/admin/recipes";
import { RecipeForm } from "@/components/admin/recipe-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getAdminRecipe(id);
  if (!recipe) notFound();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Edit recipe</h1>
      <RecipeForm
        initial={{
          id: recipe.id,
          name: recipe.name,
          description: recipe.description ?? "",
          difficulty: recipe.difficulty,
          instructions: recipe.instructions,
          ingredientsJson: JSON.stringify(recipe.ingredients, null, 2),
        }}
      />
    </div>
  );
}
