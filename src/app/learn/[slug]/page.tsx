import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLearnEntries, getLearnEntry, LEARN_KIND_LABELS, type LearnEntry } from "@/lib/learn";
import { Markdown } from "@/components/learn/markdown";
import { LearnCard, LearnKindBadge } from "@/components/learn/learn-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getLearnEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const entry = getLearnEntry((await params).slug);
  if (!entry) return {};
  return { title: entry.title, description: entry.excerpt };
}

export default async function LearnEntryPage({ params }: PageProps) {
  const entry = getLearnEntry((await params).slug);
  if (!entry) notFound();

  const related = entry.related
    .map((slug) => getLearnEntry(slug))
    .filter((e): e is LearnEntry => Boolean(e));

  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="mx-auto mb-8 max-w-2xl text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/learn" className="hover:text-accent">
          Learn
        </Link>
        <span className="mx-2 text-bone">/</span>
        <span>{LEARN_KIND_LABELS[entry.kind]}</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <LearnKindBadge kind={entry.kind} />
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{entry.title}</h1>
        <p className="mt-4 border-l-2 border-copper-300 pl-4 text-lg leading-relaxed text-muted">
          {entry.excerpt}
        </p>
        <div className="mt-8 text-[1.0625rem]">
          <Markdown>{entry.body}</Markdown>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-card-border pt-10">
          <h2 className="mb-5 text-2xl">Keep reading</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <LearnCard key={r.slug} entry={r} compact />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
