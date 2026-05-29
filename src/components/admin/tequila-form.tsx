"use client";

import { useTransition } from "react";
import {
  createTequila,
  deleteTequila,
  updateTequila,
  type TequilaFormData,
} from "@/app/actions/admin/tequilas";
import type { Producer, TequilaType, PriceRange } from "@/types/database";

const types: TequilaType[] = ["blanco", "reposado", "anejo", "extra_anejo", "cristalino"];
const priceRanges: PriceRange[] = ["$", "$$", "$$$", "$$$$"];

interface TequilaFormProps {
  producers: Producer[];
  initial?: Partial<TequilaFormData> & { id?: string };
}

export function TequilaForm({ producers, initial }: TequilaFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(initial?.id);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const data: TequilaFormData = {
      id: initial?.id,
      producer_id: form.get("producer_id") as string,
      name: form.get("name") as string,
      type: form.get("type") as TequilaType,
      description: form.get("description") as string,
      additive_free: form.get("additive_free") === "on",
      organic: form.get("organic") === "on",
      agave_region: form.get("agave_region") as string,
      abv: form.get("abv") as string,
      production_volume: form.get("production_volume") as string,
      noma: form.get("noma") as string,
      price_range: form.get("price_range") as PriceRange,
      price_min: form.get("price_min") as string,
      price_max: form.get("price_max") as string,
      tasting_notes: form.get("tasting_notes") as string,
      featured: form.get("featured") === "on",
    };

    startTransition(async () => {
      if (isEdit) await updateTequila(data);
      else await createTequila(data);
    });
  }

  function handleDelete() {
    if (!initial?.id || !confirm("Delete this tequila permanently?")) return;
    startTransition(async () => {
      await deleteTequila(initial.id!);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">Name</label>
          <input
            name="name"
            required
            defaultValue={initial?.name}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Producer</label>
          <select
            name="producer_id"
            required
            defaultValue={initial?.producer_id}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          >
            {producers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Type</label>
          <select
            name="type"
            required
            defaultValue={initial?.type ?? "blanco"}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          >
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Price range</label>
          <select
            name="price_range"
            defaultValue={initial?.price_range ?? "$$"}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          >
            {priceRanges.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Price min ($)</label>
          <input
            name="price_min"
            type="number"
            step="0.01"
            defaultValue={initial?.price_min}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Price max ($)</label>
          <input
            name="price_max"
            type="number"
            step="0.01"
            defaultValue={initial?.price_max}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">ABV (%)</label>
          <input
            name="abv"
            type="number"
            step="0.1"
            defaultValue={initial?.abv}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">NOM</label>
          <input
            name="noma"
            defaultValue={initial?.noma}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Agave region</label>
          <input
            name="agave_region"
            defaultValue={initial?.agave_region}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Production volume</label>
          <input
            name="production_volume"
            defaultValue={initial?.production_volume}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">Tasting notes</label>
        <textarea
          name="tasting_notes"
          rows={3}
          defaultValue={initial?.tasting_notes}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input name="additive_free" type="checkbox" defaultChecked={initial?.additive_free} />
          Additive-free
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="organic" type="checkbox" defaultChecked={initial?.organic} />
          Organic
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="featured" type="checkbox" defaultChecked={initial?.featured} />
          Featured
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-stone-950 hover:bg-accent-light disabled:opacity-50"
        >
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create tequila"}
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
