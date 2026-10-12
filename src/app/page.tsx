import Link from "next/link";
import { TequilaCard } from "@/components/tequilas/tequila-card";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { isSupabaseConfigured } from "@/lib/utils";
import { getFeaturedTequilas, getTequilaStats } from "@/lib/queries/tequilas";
import { getFeaturedRecipe } from "@/lib/queries/recipes";
import { getLearnEntry, type LearnEntry } from "@/lib/learn";
import { LearnCard } from "@/components/learn/learn-card";
import { AgaveMark, ArrowRightIcon, BottleIcon, LeafIcon, PureDropIcon } from "@/components/brand/icons";

const HOME_LEARN = ["how-to-read-a-tequila-label", "additive-free-tequila", "nom-numbers"];

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-4xl tracking-tight sm:text-5xl">
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
  const learn = HOME_LEARN.map((slug) => getLearnEntry(slug)).filter((e): e is LearnEntry => Boolean(e));

  return (
    <>
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <AgaveMark className="pointer-events-none absolute -right-10 bottom-0 hidden h-[26rem] w-[26rem] text-agave-100 lg:block" />
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-agave-700">
            <AgaveMark className="h-4 w-4" /> The world&apos;s tequila catalog
          </p>
          <h1 className="max-w-3xl text-5xl leading-[1.05] sm:text-7xl">
            Every tequila worth knowing.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Who makes it, where, and how — every certified distillery, the brands they make,
            and which bottles skip the additives.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tequilas"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-paper transition hover:bg-accent-hover"
            >
              Browse the catalog <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/tequilas?additive_free=true"
              className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-6 py-3 text-sm font-semibold transition hover:border-accent"
            >
              <PureDropIcon className="h-4 w-4 text-agave-700" /> Additive-free only
            </Link>
            <Link
              href="/tequilas?organic=true"
              className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-6 py-3 text-sm font-semibold transition hover:border-accent"
            >
              <LeafIcon className="h-4 w-4 text-agave-700" /> Organic
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-card-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-card-border px-4 sm:px-6">
          {[
            { icon: BottleIcon, value: `${stats.total.toLocaleString()}`, label: "Tequilas tracked" },
            { icon: PureDropIcon, value: stats.additiveFree.toLocaleString(), label: "Additive-free" },
            { icon: LeafIcon, value: stats.organic.toLocaleString(), label: "Organic" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-6 text-center sm:flex-row sm:justify-center sm:gap-3">
              <Icon className="h-6 w-6 text-copper-500" />
              <div>
                <p className="font-display text-2xl font-semibold">{value}</p>
                <p className="text-sm text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl">Featured tequilas</h2>
            <p className="mt-1 text-muted">Hand-picked bottles for enthusiasts and shoppers</p>
          </div>
          <Link href="/tequilas" className="text-sm font-medium text-accent hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tequila) => (
            <TequilaCard key={tequila.id} tequila={tequila} />
          ))}
        </div>
      </section>

      {learn.length > 0 && (
        <section className="border-t border-card-border bg-cream-100/50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl">Read past the label</h2>
                <p className="mt-1 text-muted">Three things every tequila drinker should know.</p>
              </div>
              <Link href="/learn" className="shrink-0 text-sm font-medium text-accent hover:underline">
                All of Learn →
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {learn.map((entry) => (
                <LearnCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      )}

      {recipe && (
        <section className="border-t border-card-border bg-card/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
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
