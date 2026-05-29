import { Suspense } from "react";
import { TequilaCard } from "@/components/tequilas/tequila-card";
import { TequilaFilters } from "@/components/tequilas/tequila-filters";
import { isSupabaseConfigured } from "@/lib/utils";
import { getCatalogCounts, getFilterOptions, getTequilas } from "@/lib/queries/tequilas";
import type { TequilaFilters as Filters, TequilaType, PriceRange, CatalogFilter } from "@/types/database";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function parseFilters(params: Record<string, string | undefined>): Filters {
  return {
    q: params.q,
    type: params.type as TequilaType | undefined,
    additive_free: params.additive_free === "true",
    organic: params.organic === "true",
    price_range: params.price_range as PriceRange | undefined,
    agave_region: params.agave_region,
    producer: params.producer,
    catalog: (params.catalog as CatalogFilter) || "all",
    sort: (params.sort as Filters["sort"]) ?? "name",
  };
}

export default async function TequilasPage({ searchParams }: PageProps) {
  const params = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Tequila Catalog</h1>
        <p className="mt-2 text-muted">Connect Supabase to browse the catalog.</p>
      </div>
    );
  }

  const filters = parseFilters(params);
  const [tequilas, filterOptions, catalogCounts] = await Promise.all([
    getTequilas(filters),
    getFilterOptions(),
    getCatalogCounts(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tequila Catalog</h1>
        <p className="mt-1 text-muted">
          {tequilas.length} bottle{tequilas.length === 1 ? "" : "s"} shown
          {filters.catalog === "curated" && ` · ${catalogCounts.curated} curated total`}
          {filters.catalog === "crt" && ` · ${catalogCounts.crt} CRT registry total`}
          {filters.catalog === "all" &&
            ` · ${catalogCounts.curated} curated, ${catalogCounts.crt} CRT registry`}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-card" />}>
          <TequilaFilters
            regions={filterOptions.regions}
            producers={filterOptions.producers}
          />
        </Suspense>

        {tequilas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-border p-12 text-center">
            <p className="text-lg font-medium">No tequilas match your filters</p>
            <p className="mt-2 text-muted">Try clearing filters or broadening your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {tequilas.map((tequila) => (
              <TequilaCard key={tequila.id} tequila={tequila} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
