"use client";

import { useTransition } from "react";
import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
  type RecipeFormData,
} from "@/app/actions/admin/recipes";
import type { RecipeDifficulty } from "@/types/database";

const difficulties: RecipeDifficulty[] = ["easy", "medium", "hard"];

interface RecipeFormProps {
  initial?: Partial<RecipeFormData> & { id?: string; ingredientsJson?: string };
}

export function RecipeForm({ initial }: RecipeFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(initial?.id);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const data: RecipeFormData = {
      id: initial?.id,
      name: form.get("name") as string,
      description: form.get("description") as string,
      difficulty: form.get("difficulty") as RecipeDifficulty,
      instructions: form.get("instructions") as string,
      ingredientsJson: form.get("ingredientsJson") as string,
    };

    startTransition(async () => {
      if (isEdit) await updateRecipe(data);
      else await createRecipe(data);
    });
  }

  function handleDelete() {
    if (!initial?.id || !confirm("Delete this recipe?")) return;
    startTransition(async () => {
      await deleteRecipe(initial.id!);
    });
  }

  const defaultIngredients = initial?.ingredientsJson ?? JSON.stringify(
    [{ item: "Blanco tequila", amount: "2", unit: "oz" }],
    null,
    2,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1 block text-sm text-muted">Name</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">Difficulty</label>
        <select
          name="difficulty"
          defaultValue={initial?.difficulty ?? "easy"}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
        >
          {difficulties.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">Description</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={initial?.description}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">
          Ingredients (JSON array: item, amount, unit)
        </label>
        <textarea
          name="ingredientsJson"
          rows={8}
          required
          defaultValue={defaultIngredients}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 font-mono text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">Instructions</label>
        <textarea
          name="instructions"
          rows={5}
          required
          defaultValue={initial?.instructions}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-stone-950 hover:bg-accent-light disabled:opacity-50"
        >
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create recipe"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="rounded-full border border-red-800 px-6 py-2 text-sm text-red-400 hover:bg-red-950/30"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
