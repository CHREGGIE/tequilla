// scripts/propose-brands.ts
//
// Reads all tequila rows from Supabase, extracts a candidate brand for each
// (stripping regulatory boilerplate and expression suffixes), groups them,
// and writes two files for human review:
//
//   data/proposed-brands.csv   — human-readable, edit this
//   data/proposed-brands.json  — machine-readable, do not edit
//
// This script is read-only. Re-run it as many times as you want.
//
// Run: npm run brands:propose

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

// Strip expression keywords and proof/abv suffixes
const EXPRESSION_TAIL = /\s*\b(extra\s+a[ñn]ejo|cristalino|reposado|a[ñn]ejo|blanco|plata|silver|joven|gold)\b.*$/i;
const PROOF_TAIL      = /\s*\d+\s*proof\b.*$/i;
const ABV_TAIL        = /\s*\d+\s*%?\s*alc.*$/i;
const VOL_TAIL        = /\s*\d+\s*ml\b.*$/i;

// Strip regulatory boilerplate
const REG_NOISE = [
  /\bhecho\s+en\s+mexico\b/gi,
  /\b100\s*%?\s+puro\s+de\s+agave\b/gi,
  /\b100\s*%?\s+blue\s+agave\b/gi,
  /\b100\s*%?\s+de\s+agave\b/gi,
  /\bdba\s+.*/gi,
  /,?\s*(s\.\s*a\.\s*de\s+c\.\s*v\.|s\.\s*de\s+r\.\s*l\.\s*de\s+c\.\s*v\.|s\.\s*a\.|s\.\s*de\s+r\.\s*l\.|inc\.?|llc|ltd\.?|corp\.?|co\.?\s+ltd\.?).*$/gi,
];

function extractBrandCandidate(rawName: string): string {
  let s = rawName.trim();
  for (const re of REG_NOISE) s = s.replace(re, '');
  s = s.replace(EXPRESSION_TAIL, '');
  s = s.replace(PROOF_TAIL, '');
  s = s.replace(ABV_TAIL, '');
  s = s.replace(VOL_TAIL, '');
  s = s.replace(/[,;]+\s*$/, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const LOWER_WORDS = new Set(['de', 'la', 'el', 'los', 'las', 'y', 'del', 'al', 'a', 'en']);

function titleCase(s: string): string {
  const words = s.toLowerCase().split(/\s+/);
  return words
    .map((w, i) => {
      if (i > 0 && LOWER_WORDS.has(w)) return w;
      if (/^\d/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ')
    .replace(/\banos\b/gi, 'Años')
    .replace(/\banejo\b/gi, 'Añejo');
}

type Group = {
  original_slug: string;
  brand_name_proposed: string;
  distillery_nomas: Set<string>;
  distillery_names: Set<string>;
  tequila_ids: string[];
  sample_names: string[];
  sources: Set<string>;
};

async function main() {
  console.log('Fetching tequilas with producer info...');

  const pageSize = 1000;
  let from = 0;
  const allTequilas: {
    id: string;
    name: string;
    source: string | null;
    producers: unknown;
  }[] = [];

  while (true) {
    const { data, error } = await supabase
      .from('tequilas')
      .select('id, name, type, source, producer_id, producers!inner(id, name, noma)')
      .order('name')
      .range(from, from + pageSize - 1);

    if (error) {
      console.error('Query failed:', error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    allTequilas.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  console.log(`Fetched ${allTequilas.length} tequila rows.`);

  const groups = new Map<string, Group>();
  let skippedShort = 0;

  for (const t of allTequilas) {
    const candidate = extractBrandCandidate(t.name);
    if (!candidate || candidate.length < 2) {
      skippedShort++;
      continue;
    }

    const slug = slugify(candidate);
    if (!slug) {
      skippedShort++;
      continue;
    }

    const brandName = titleCase(candidate);
    let g = groups.get(slug);
    if (!g) {
      g = {
        original_slug: slug,
        brand_name_proposed: brandName,
        distillery_nomas: new Set(),
        distillery_names: new Set(),
        tequila_ids: [],
        sample_names: [],
        sources: new Set(),
      };
      groups.set(slug, g);
    }

    g.tequila_ids.push(t.id);
    if (g.sample_names.length < 4) g.sample_names.push(t.name);
    const producer = t.producers as { name?: string; noma?: string } | null;
    if (producer?.noma) g.distillery_nomas.add(producer.noma);
    if (producer?.name) g.distillery_names.add(producer.name);
    if (t.source) g.sources.add(t.source);
  }

  if (skippedShort > 0) {
    console.log(`Skipped ${skippedShort} rows with un-extractable names.`);
  }

  const sorted = Array.from(groups.values()).sort(
    (a, b) => b.tequila_ids.length - a.tequila_ids.length
  );

  console.log(`Grouped into ${sorted.length} candidate brands.`);

  // ----- CSV (human-readable) -----
  const csvHeaders = [
    'action',
    'original_slug',
    'final_slug',
    'brand_name',
    'distillery_noma',
    'distillery_name',
    'tequila_count',
    'sample_names',
    'sources',
  ];

  const csvLines = [
    csvHeaders.join(','),
    ...sorted.map(g => csvHeaders.map(h => {
      switch (h) {
        case 'action':            return 'keep';
        case 'original_slug':     return csvCell(g.original_slug);
        case 'final_slug':        return csvCell(g.original_slug);
        case 'brand_name':        return csvCell(g.brand_name_proposed);
        case 'distillery_noma':   return csvCell(Array.from(g.distillery_nomas).join('|'));
        case 'distillery_name':   return csvCell(Array.from(g.distillery_names).join('|').slice(0, 120));
        case 'tequila_count':     return String(g.tequila_ids.length);
        case 'sample_names':      return csvCell(g.sample_names.join(' / '));
        case 'sources':           return csvCell(Array.from(g.sources).join(','));
        default:                  return '';
      }
    }).join(',')),
  ];

  const outDir = 'data';
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/proposed-brands.csv`, csvLines.join('\n'), 'utf-8');

  // ----- JSON (machine) -----
  const jsonOut = {
    generated_at: new Date().toISOString(),
    total_groups: sorted.length,
    groups: sorted.map(g => ({
      original_slug: g.original_slug,
      brand_name_proposed: g.brand_name_proposed,
      distillery_nomas: Array.from(g.distillery_nomas),
      tequila_ids: g.tequila_ids,
    })),
  };
  writeFileSync(`${outDir}/proposed-brands.json`, JSON.stringify(jsonOut, null, 2), 'utf-8');

  console.log('');
  console.log(`Wrote ${sorted.length} candidate brand rows.`);
  console.log(`  - ${outDir}/proposed-brands.csv   (edit this)`);
  console.log(`  - ${outDir}/proposed-brands.json  (machine, leave alone)`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Open data/proposed-brands.csv in Excel, Google Sheets, or a CSV editor.');
  console.log('  2. For each row:');
  console.log('       action=keep   → create this brand (default)');
  console.log('       action=skip   → not a real brand, skip it (contract bottlers, holding cos, etc.)');
  console.log('       brand_name    → fix capitalization or accents');
  console.log('       final_slug    → if merging two rows, set same final_slug on both');
  console.log('       distillery_noma → if grouping has multiple NOMs, keep only the right one');
  console.log('  3. Save the file.');
  console.log('  4. Run: npm run brands:apply');
}

function csvCell(v: unknown): string {
  const s = String(v ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
