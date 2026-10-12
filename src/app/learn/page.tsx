import type { Metadata } from "next";
import { getLearnEntries, LEARN_KIND_LABELS, LEARN_KIND_ORDER } from "@/lib/learn";
import { LearnCard } from "@/components/learn/learn-card";
import { AgaveMark } from "@/components/brand/icons";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "How tequila is made, what NOM numbers mean, why additives matter, and the people behind the best bottles.",
};

const KIND_INTROS = {
  guide: "Start here. The process and the label, end to end.",
  term: "The words you'll see on bottles and in tasting notes.",
  people: "The families and distillers behind the bottles.",
} as const;

export default function LearnPage() {
  const entries = getLearnEntries();

  return (
    <div>
      <section className="border-b border-card-border bg-gradient-to-b from-cream-100/70 to-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-agave-700">
            <AgaveMark className="h-4 w-4" /> Learn
          </p>
          <h1 className="max-w-3xl text-4xl leading-tight sm:text-5xl">
            Know what&apos;s in the bottle — and who made it
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Tequila marketing is loud and labels say very little. These are the basics that let you
            read past both.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6">
        {LEARN_KIND_ORDER.map((kind) => {
          const group = entries.filter((e) => e.kind === kind);
          if (group.length === 0) return null;
          return (
            <section key={kind}>
              <h2 className="text-2xl">{LEARN_KIND_LABELS[kind]}</h2>
              <p className="mt-1 mb-5 text-muted">{KIND_INTROS[kind]}</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((entry) => (
                  <LearnCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
