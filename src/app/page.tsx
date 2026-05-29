import Link from "next/link";
import { TequilaCard } from "@/components/tequilas/tequila-card";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { isSupabaseConfigured } from "@/lib/utils";
import { getFeaturedTequilas, getTequilaStats } from "@/lib/queries/tequilas";
import { getFeaturedRecipe } from "@/lib/queries/recipes";

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          The world&apos;s tequila catalog
        </h1>
        <p className="mt-4 text-lg text-muted">
          Connect Supabase to browse 100+ tequilas, recipes, and more.
        </p>
      </div>
    );
  }

  const [featured, stats, recipe] = await Promise.all([
    getFeaturedTequilas(4),
    getTequilaStats(),
    getFeaturedRecipe(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-dark/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-light">
            Additive-free · Organic · Premium
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Discover every tequila worth knowing
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Browse producers, compare additive-free bottles, read tasting notes, and
            find the perfect tequila for sipping or cocktails.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tequilas"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-accent-light"
            >
              Browse catalog
            </Link>
            <Link
              href="/tequilas?additive_free=true"
              className="rounded-full border border-card-border px-6 py-3 text-sm font-semibold transition hover:border-accent"
            >
              Additive-free only
            </Link>
            <Link
              href="/tequilas?organic=true"
              className="rounded-full border border-card-border px-6 py-3 text-sm font-semibold transition hover:border-accent"
            >
              Organic
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-card-border bg-card/50">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8 px-4 py-6 text-center sm:px-6">
          <div>
            <p className="text-2xl font-bold text-accent-light">{stats.total}+</p>
            <p className="text-sm text-muted">Tequilas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">{stats.additiveFree}</p>
            <p className="text-sm text-muted">Additive-free</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">{stats.organic}</p>
            <p className="text-sm text-muted">Organic</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured tequilas</h2>
            <p className="mt-1 text-muted">Hand-picked bottles for enthusiasts and shoppers</p>
          </div>
          <Link href="/tequilas" className="text-sm font-medium text-accent-light hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tequila) => (
            <TequilaCard key={tequila.id} tequila={tequila} />
          ))}
        </div>
      </section>

      {recipe && (
        <section className="border-t border-card-border bg-card/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-light">
              Recipe spotlight
            </p>
            <div className="mt-4 max-w-xl">
              <RecipeCard recipe={recipe} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
