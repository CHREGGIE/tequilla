import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// Learn articles live in content/learn/<slug>.md — edit them on GitHub.
//
// Each file starts with a frontmatter block:
//   ---
//   title: What is a NOM number?
//   kind: term            # term | guide | people
//   excerpt: One or two sentences for tooltips and cards.
//   related: [additive-free-tequila, tequila-regulations]
//   order: 1
//   ---
// followed by the article body in Markdown.

export type LearnKind = "term" | "guide" | "people";

export const LEARN_KIND_LABELS: Record<LearnKind, string> = {
  guide: "Guides",
  term: "Terms",
  people: "People",
};

export const LEARN_KIND_ORDER: LearnKind[] = ["guide", "term", "people"];

export interface LearnEntry {
  slug: string;
  title: string;
  kind: LearnKind;
  excerpt: string;
  related: string[];
  order: number;
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "learn");

function parseFrontmatter(raw: string, file: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing frontmatter`);

  const data: Record<string, string | string[]> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*?)\s*(#.*)?$/);
    if (!kv) continue;
    const value = kv[2];
    data[kv[1]] = value.startsWith("[")
      ? value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : value.replace(/^["']|["']$/g, "");
  }
  return { data, body: match[2].trim() };
}

function loadEntries(): LearnEntry[] {
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, body } = parseFrontmatter(readFileSync(path.join(CONTENT_DIR, file), "utf8"), file);
      const kind = data.kind as LearnKind;
      if (!LEARN_KIND_LABELS[kind]) throw new Error(`${file}: unknown kind "${kind}"`);
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? ""),
        kind,
        excerpt: String(data.excerpt ?? ""),
        related: Array.isArray(data.related) ? data.related : [],
        order: Number(data.order ?? 99),
        body,
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

let cache: LearnEntry[] | null = null;

/** All entries, ordered by `order`. Cached per server instance outside dev. */
export function getLearnEntries(): LearnEntry[] {
  if (process.env.NODE_ENV === "development") return loadEntries();
  return (cache ??= loadEntries());
}

export function getLearnEntry(slug: string): LearnEntry | undefined {
  return getLearnEntries().find((e) => e.slug === slug);
}
