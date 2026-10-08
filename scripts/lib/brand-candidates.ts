// Pure logic for scripts/propose-brands.ts — no Supabase access, so it can be
// exercised offline against sample names.

// Sub-line and expression keywords. A match anywhere after the first word cuts
// the name there ("1800 Milenio" → "1800", "Don Julio 1942" → "Don Julio",
// "Jose Cuervo Reserva de la Familia Platino" → "Jose Cuervo"). A match at the
// very start is left alone so brands like "Reserva del Señor" survive.
const SUB_LINE_KEYWORDS = [
  'Reserva de la Familia',
  'Añejo Cristalino',
  'Reserva Especial',
  'Edición Limitada',
  'Edicion Limitada',
  'Single Barrel',
  'Barrel Blend',
  'Gran Reserva',
  'Extra Añejo',
  'Extra Anejo',
  'Tradicional',
  'Colección',
  'Coleccion',
  'Selección',
  'Seleccion',
  'Cristalino',
  'Reposado',
  'Milenio',
  'Reserva',
  'Blanco',
  'Silver',
  'Añejo',
  'Anejo',
  'Plata',
  'Joven',
  'Gold',
  '1942',
];

// Longest first so "Reserva de la Familia" wins over "Reserva".
const SUB_LINE_RE = new RegExp(
  '(?<![\\p{L}\\p{N}])(' +
    [...SUB_LINE_KEYWORDS]
      .sort((a, b) => b.length - a.length)
      .map(k => k.replace(/\s+/g, '\\s+'))
      .join('|') +
    ')(?![\\p{L}\\p{N}])',
  'iu',
);

const PROOF_TAIL = /\s*\d+\s*proof\b.*$/i;
const ABV_TAIL   = /\s*\d+\s*%?\s*alc.*$/i;
const VOL_TAIL   = /\s*\d+\s*ml\b.*$/i;

// Regulatory boilerplate and company suffixes
const REG_NOISE = [
  /\bhecho\s+en\s+mexico\b/gi,
  /\b100\s*%?\s+puro\s+de\s+agave\b/gi,
  /\b100\s*%?\s+blue\s+agave\b/gi,
  /\b100\s*%?\s+de\s+agave\b/gi,
  /\bdba\s+.*/gi,
  /,?\s*(s\.\s*a\.\s*de\s+c\.\s*v\.|s\.\s*de\s+r\.\s*l\.\s*de\s+c\.\s*v\.|s\.\s*a\.|s\.\s*de\s+r\.\s*l\.|inc\.?|llc|ltd\.?|corp\.?|co\.?\s+ltd\.?).*$/gi,
];

// Brands that bottle at many NOMs under one label — never a single brand page.
const KNOWN_PRIVATE_LABELS = ["Member's Mark", 'Compoveda', 'J. Borrajo', 'Kirkland Signature'];

// A brand name registered at this many distinct NOMs is auto-skipped.
export const MULTI_NOM_SKIP_THRESHOLD = 3;

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const KNOWN_PRIVATE_LABEL_SLUGS = new Set(KNOWN_PRIVATE_LABELS.map(slugify));

export function stripSubLine(name: string): { base: string; stripped: string | null } {
  const m = SUB_LINE_RE.exec(name);
  if (!m || m.index === 0) return { base: name, stripped: null };
  const base = name.slice(0, m.index).replace(/[\s,;\-–]+$/, '');
  if (!base) return { base: name, stripped: null };
  return { base, stripped: name.slice(m.index).trim() };
}

export function extractBrandCandidate(rawName: string): string {
  let s = rawName.trim();
  for (const re of REG_NOISE) s = s.replace(re, '');
  s = s.replace(PROOF_TAIL, '');
  s = s.replace(ABV_TAIL, '');
  s = s.replace(VOL_TAIL, '');
  s = s.replace(/\s+/g, ' ').trim();
  s = stripSubLine(s).base;
  s = s.replace(/[,;]+\s*$/, '');
  return s.replace(/\s+/g, ' ').trim();
}

const LOWER_WORDS = new Set(['de', 'la', 'el', 'los', 'las', 'y', 'del', 'al', 'a', 'en']);

export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => {
      if (i > 0 && LOWER_WORDS.has(w)) return w;
      if (/^\d/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ')
    .replace(/\banos\b/gi, 'Años')
    .replace(/\banejo\b/gi, 'Añejo');
}

export type TequilaRow = {
  id: string;
  name: string;
  source: string | null;
  noma: string | null;
};

export type BrandCandidate = {
  action: 'keep' | 'skip';
  flag: string;
  original_slug: string;
  brand_name: string;
  distillery_nomas: string[];
  tequila_ids: string[];
  example_names: string[];
  sources: string[];
};

export function groupBrandCandidates(rows: TequilaRow[]): {
  candidates: BrandCandidate[];
  unextractable: number;
} {
  const groups = new Map<
    string,
    {
      brand_name: string;
      nomas: Map<string, number>;
      tequila_ids: string[];
      example_names: string[];
      sources: Set<string>;
    }
  >();
  let unextractable = 0;

  for (const row of rows) {
    const candidate = extractBrandCandidate(row.name);
    const slug = candidate.length >= 2 ? slugify(candidate) : '';
    if (!slug) {
      unextractable++;
      continue;
    }

    let g = groups.get(slug);
    if (!g) {
      g = {
        brand_name: titleCase(candidate),
        nomas: new Map(),
        tequila_ids: [],
        example_names: [],
        sources: new Set(),
      };
      groups.set(slug, g);
    }
    g.tequila_ids.push(row.id);
    if (g.example_names.length < 4 && !g.example_names.includes(row.name)) {
      g.example_names.push(row.name);
    }
    if (row.noma) g.nomas.set(row.noma, (g.nomas.get(row.noma) ?? 0) + 1);
    if (row.source) g.sources.add(row.source);
  }

  const candidates: BrandCandidate[] = [];
  for (const [slug, g] of groups) {
    // Most-used NOM first so apply-brands picks it as the primary distillery.
    const nomas = [...g.nomas.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n);

    let action: BrandCandidate['action'] = 'keep';
    let flag = '';
    if (KNOWN_PRIVATE_LABEL_SLUGS.has(slug)) {
      action = 'skip';
      flag = 'known private label';
    } else if (nomas.length >= MULTI_NOM_SKIP_THRESHOLD) {
      action = 'skip';
      flag = `multi-nom (${nomas.length}): likely private label or importer`;
    } else if (nomas.length === 2) {
      flag = '2 NOMs: confirm primary';
    }

    candidates.push({
      action,
      flag,
      original_slug: slug,
      brand_name: g.brand_name,
      distillery_nomas: nomas,
      tequila_ids: g.tequila_ids,
      example_names: g.example_names,
      sources: [...g.sources],
    });
  }

  candidates.sort((a, b) => b.tequila_ids.length - a.tequila_ids.length);
  return { candidates, unextractable };
}
