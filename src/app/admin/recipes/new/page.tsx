import { RecipeForm } from "@/components/admin/recipe-form";

export default function NewRecipePage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl">Add recipe</h1>
      <RecipeForm />
    </div>
  );
}
