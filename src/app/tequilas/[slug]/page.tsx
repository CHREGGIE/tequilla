import Link from "next/link";
import { notFound } from "next/navigation";
import { TequilaGallery } from "@/components/tequilas/tequila-gallery";
import { SaveButtons } from "@/components/tequilas/save-buttons";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { createClient } from "@/lib/supabase/server";
import { getRecipesForTequila, getTequilaBySlug } from "@/lib/queries/tequilas";
import { getUserListStatus } from "@/lib/queries/user-lists";
import {
  formatPriceRange,
  formatTequilaType,
  isSupabaseConfigured,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TequilaDetailPage({ params }: PageProps) {
  if (!isSupabaseConfigured()) notFound();

  const { slug } = await params;
  const tequila = await getTequilaBySlug(slug);
  if (!tequila) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [listStatus, relatedRecipes] = await Promise.all([
    getUserListStatus(user?.id, tequila.id),
    getRecipesForTequila(tequila.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <TequilaGallery name={tequila.name} images={tequila.tequila_images ?? []} />

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-stone-800 px-3 py-1 text-xs font-medium">
                {formatTequilaType(tequila.type)}
              </span>
              {tequila.additive_free && (
                <span className="rounded-full bg-emerald-900/60 px-3 py-1 text-xs font-medium text-emerald-200">
                  Additive-Free
                </span>
              )}
              {tequila.organic && (
                <span className="rounded-full bg-amber-900/60 px-3 py-1 text-xs font-medium text-amber-200">
                  Organic
                </span>
              )}
              {tequila.source === "crt" && (
                <span className="rounded-full bg-slate-700/60 px-3 py-1 text-xs font-medium text-slate-200">
                  CRT Registry
                </span>
              )}
              {tequila.price_range && (
                <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-light">
                  {formatPriceRange(tequila.price_range)}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">{tequila.name}</h1>
            <Link
              href={`/tequilas?producer=${encodeURIComponent(tequila.producer.name)}`}
              className="mt-1 inline-block text-lg text-accent-light hover:underline"
            >
              {tequila.producer.name}
            </Link>
          </div>

          {tequila.description && (
            <p className="leading-relaxed text-muted">{tequila.description}</p>
          )}

          {tequila.source === "crt" && (
            <p className="rounded-xl border border-slate-700/50 bg-slate-900/40 px-4 py-3 text-sm text-muted">
              Official CRT registry entry — factual producer and brand data only.
              {tequila.crt_dot && (
                <>
                  {" "}
                  <a
                    href={`https://www.crt.org.mx/empresas-y-marcas-certificadas/?dot=${tequila.crt_dot}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-light hover:underline"
                  >
                    View on CRT
                  </a>
                </>
              )}
            </p>
          )}

          <SaveButtons
            tequilaId={tequila.id}
            isFavorite={listStatus.isFavorite}
            isWishlisted={listStatus.isWishlisted}
            isLoggedIn={Boolean(user)}
          />

          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-card-border bg-card p-5 text-sm">
            <div>
              <dt className="text-muted">Producer region</dt>
              <dd className="font-medium">{tequila.producer.region ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Agave region</dt>
              <dd className="font-medium">{tequila.agave_region ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">NOM</dt>
              <dd className="font-medium">{tequila.noma ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">ABV</dt>
              <dd className="font-medium">{tequila.abv ? `${tequila.abv}%` : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Production volume</dt>
              <dd className="font-medium">{tequila.production_volume ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Price range</dt>
              <dd className="font-medium">
                {tequila.price_min && tequila.price_max
                  ? `$${tequila.price_min}–$${tequila.price_max}`
                  : formatPriceRange(tequila.price_range)}
              </dd>
            </div>
          </dl>

          {tequila.tasting_notes && (
            <section>
              <h2 className="mb-2 text-lg font-semibold">Tasting notes</h2>
              <p className="leading-relaxed text-muted">{tequila.tasting_notes}</p>
            </section>
          )}

          {tequila.producer.description && (
            <section>
              <h2 className="mb-2 text-lg font-semibold">About the producer</h2>
              <p className="leading-relaxed text-muted">{tequila.producer.description}</p>
              {tequila.producer.website && (
                <a
                  href={tequila.producer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-accent-light hover:underline"
                >
                  Visit website →
                </a>
              )}
            </section>
          )}
        </div>
      </div>

      {tequila.tequila_editions?.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-2xl font-bold">Special editions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tequila.tequila_editions.map((edition) => (
              <div
                key={edition.id}
                className="rounded-2xl border border-card-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{edition.name}</h3>
                  {edition.limited_edition && (
                    <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent-light">
                      Limited
                    </span>
                  )}
                </div>
                {edition.description && (
                  <p className="mt-2 text-sm text-muted">{edition.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {relatedRecipes.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-2xl font-bold">Recipes with this tequila</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedRecipes.map((recipe) =>
              recipe ? <RecipeCard key={recipe.id} recipe={recipe} /> : null,
            )}
          </div>
        </section>
      )}
    </div>
  );
}
