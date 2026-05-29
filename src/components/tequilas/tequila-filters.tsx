"use client";

import { useRouter, useSearchParams } from "next/navigation";

const types = [
  { value: "blanco", label: "Blanco" },
  { value: "reposado", label: "Reposado" },
  { value: "anejo", label: "Añejo" },
  { value: "extra_anejo", label: "Extra Añejo" },
  { value: "cristalino", label: "Cristalino" },
];

const priceRanges = [
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
  { value: "$$$$", label: "$$$$" },
];

interface TequilaFiltersProps {
  regions: string[];
  producers: string[];
}

export function TequilaFilters({ regions, producers }: TequilaFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/tequilas?${params.toString()}`);
  }

  return (
    <aside className="space-y-6 rounded-2xl border border-card-border bg-card p-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-muted">Search</label>
        <input
          type="search"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="Name or description..."
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              updateParam("q", (event.target as HTMLInputElement).value || null);
            }
          }}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted">Quick filters</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              updateParam(
                "additive_free",
                searchParams.get("additive_free") === "true" ? null : "true",
              )
            }
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              searchParams.get("additive_free") === "true"
                ? "bg-emerald-700 text-white"
                : "bg-stone-800 text-stone-300"
            }`}
          >
            Additive-Free
          </button>
          <button
            type="button"
            onClick={() =>
              updateParam(
                "organic",
                searchParams.get("organic") === "true" ? null : "true",
              )
            }
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              searchParams.get("organic") === "true"
                ? "bg-amber-700 text-white"
                : "bg-stone-800 text-stone-300"
            }`}
          >
            Organic
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted">Catalog</label>
        <div className="flex flex-col gap-1.5">
          {[
            { value: "all", label: "All bottles" },
            { value: "curated", label: "Curated only" },
            { value: "crt", label: "CRT registry only" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                updateParam(
                  "catalog",
                  option.value === "all" ? null : option.value,
                )
              }
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                (searchParams.get("catalog") ?? "all") === option.value ||
                (!searchParams.get("catalog") && option.value === "all")
                  ? "bg-accent/20 text-accent-light"
                  : "bg-stone-800/50 text-muted hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted">Type</label>
        <select
          value={searchParams.get("type") ?? ""}
          onChange={(event) => updateParam("type", event.target.value || null)}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted">Price range</label>
        <select
          value={searchParams.get("price_range") ?? ""}
          onChange={(event) => updateParam("price_range", event.target.value || null)}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Any price</option>
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted">Region</label>
        <select
          value={searchParams.get("agave_region") ?? ""}
          onChange={(event) => updateParam("agave_region", event.target.value || null)}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted">Producer</label>
        <select
          value={searchParams.get("producer") ?? ""}
          onChange={(event) => updateParam("producer", event.target.value || null)}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All producers</option>
          {producers.map((producer) => (
            <option key={producer} value={producer}>
              {producer}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted">Sort</label>
        <select
          value={searchParams.get("sort") ?? "name"}
          onChange={(event) => updateParam("sort", event.target.value)}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        >
          <option value="name">Name A–Z</option>
          <option value="price">Price (low to high)</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </aside>
  );
}
