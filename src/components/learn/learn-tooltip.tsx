import { getLearnEntry } from "@/lib/learn";
import { TooltipTrigger } from "@/components/learn/tooltip-trigger";

/**
 * Inline glossary term: <LearnTooltip term="nom-numbers">NOM 1146</LearnTooltip>.
 * Falls back to plain text if the entry doesn't exist.
 */
export function LearnTooltip({ term, children }: { term: string; children: React.ReactNode }) {
  const entry = getLearnEntry(term);
  if (!entry) return <>{children}</>;
  return (
    <TooltipTrigger slug={entry.slug} title={entry.title} excerpt={entry.excerpt}>
      {children}
    </TooltipTrigger>
  );
}
