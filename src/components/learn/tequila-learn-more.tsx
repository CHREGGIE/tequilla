import { getLearnEntry, type LearnEntry } from "@/lib/learn";
import { LearnCard } from "@/components/learn/learn-card";

interface TequilaFacts {
  additive_free: boolean;
  organic: boolean;
  noma: string | null;
}

// Which Learn entries to show on a tequila page. Order = display order.
// Entries that don't exist yet are skipped, so rules can be added ahead of content.
export const LEARN_MORE_RULES: { slug: string; when: (t: TequilaFacts) => boolean }[] = [
  { slug: "nom-numbers", when: () => true },
  { slug: "types-of-tequila", when: () => true },
  { slug: "additive-free-tequila", when: (t) => t.additive_free },
  { slug: "organic-tequila", when: (t) => t.organic },
  { slug: "the-camarena-family", when: (t) => t.noma === "1139" || t.noma === "1579" },
];

export function TequilaLearnMore({ tequila }: { tequila: TequilaFacts }) {
  const entries = LEARN_MORE_RULES.filter((rule) => rule.when(tequila))
    .map((rule) => getLearnEntry(rule.slug))
    .filter((e): e is LearnEntry => Boolean(e));

  if (entries.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-1 text-2xl">Know what you&apos;re drinking</h2>
      <p className="mb-5 text-muted">The background behind this bottle.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map((entry) => (
          <LearnCard key={entry.slug} entry={entry} compact />
        ))}
      </div>
    </section>
  );
}
