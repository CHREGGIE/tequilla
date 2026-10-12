import Link from "next/link";
import type { LearnEntry, LearnKind } from "@/lib/learn";
import { AgaveMark, ArrowRightIcon, BookIcon } from "@/components/brand/icons";

const KIND_STYLE: Record<LearnKind, { label: string; className: string }> = {
  guide: { label: "Guide", className: "bg-copper-300/40 text-copper-700" },
  term: { label: "Term", className: "bg-agave-100 text-agave-700" },
  people: { label: "People", className: "bg-cream-100 text-oak-700" },
};

export function LearnKindBadge({ kind }: { kind: LearnKind }) {
  const style = KIND_STYLE[kind];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.className}`}>
      {kind === "guide" ? <BookIcon className="h-3.5 w-3.5" /> : <AgaveMark className="h-3.5 w-3.5" />}
      {style.label}
    </span>
  );
}

export function LearnCard({ entry, compact = false }: { entry: LearnEntry; compact?: boolean }) {
  return (
    <Link
      href={`/learn/${entry.slug}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-card-border bg-card p-5 transition hover:border-copper-500 hover:shadow-sm"
    >
      <LearnKindBadge kind={entry.kind} />
      <h3 className={compact ? "text-lg leading-snug" : "text-xl leading-snug"}>{entry.title}</h3>
      <p className={`text-sm leading-relaxed text-muted ${compact ? "line-clamp-3" : ""}`}>{entry.excerpt}</p>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-accent">
        Read <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
