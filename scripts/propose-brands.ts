// scripts/propose-brands.ts
//
// Reads all tequila rows from Supabase, extracts a candidate brand for each
// (stripping regulatory boilerplate, sub-lines and expression suffixes),
// groups them, and writes two files for human review:
//
//   data/proposed-brands.csv   — human-readable, edit this
//   data/proposed-brands.json  — machine-readable, do not edit
//
// v2: sub-line keywords ("Milenio", "1942", "Reserva"...) are stripped so
// sub-lines merge into their parent brand, and brand names registered at 3+
// NOMs are pre-set to action=skip as likely private labels/importers.
// Extraction and grouping live in scripts/lib/brand-candidates.ts.
//
// This script is read-only. Re-run it as many times as you want.
//
// Run: npm run brands:propose

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { groupBrandCandidates, type TequilaRow } from './lib/brand-candidates';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const pageSize = 1000;

async function main() {
  console.log('Fetching tequilas with producer info...');

  const rows: TequilaRow[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('tequilas')
      .select('id, name, source, producers!inner(noma)')
      .order('name')
      .range(from, from + pageSize - 1);

    if (error) {
      console.error('Query failed:', error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    for (const t of data) {
      const producer = t.producers as { noma?: string | null } | { noma?: string | null }[] | null;
      const noma = Array.isArray(producer) ? producer[0]?.noma : producer?.noma;
      rows.push({ id: t.id, name: t.name, source: t.source, noma: noma ?? null });
    }
    if (data.length < pageSize) break;
  }

  console.log(`Fetched ${rows.length} tequila rows.`);

  const { candidates, unextractable } = groupBrandCandidates(rows);
  if (unextractable > 0) {
    console.log(`Skipped ${unextractable} rows with un-extractable names.`);
  }
  const autoSkipped = candidates.filter(c => c.action === 'skip').length;
  console.log(`Grouped into ${candidates.length} candidate brands (${autoSkipped} auto-skipped).`);

  // ----- CSV (human-readable) -----
  // original_slug is the join key back to the JSON — don't edit it.
  const csvHeaders = [
    'action',
    'flag',
    'brand_name',
    'final_slug',
    'distillery_noma',
    'tequila_count',
    'example_tequila_names',
    'original_slug',
  ];

  const csvLines = [
    csvHeaders.join(','),
    ...candidates.map(c => [
      c.action,
      csvCell(c.flag),
      csvCell(c.brand_name),
      csvCell(c.original_slug),
      csvCell(c.distillery_nomas.join('|')),
      String(c.tequila_ids.length),
      csvCell(c.example_names.join(' / ')),
      csvCell(c.original_slug),
    ].join(',')),
  ];

  const outDir = 'data';
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/proposed-brands.csv`, csvLines.join('\n'), 'utf-8');

  // ----- JSON (machine) -----
  const jsonOut = {
    generated_at: new Date().toISOString(),
    total_groups: candidates.length,
    groups: candidates.map(c => ({
      original_slug: c.original_slug,
      brand_name_proposed: c.brand_name,
      distillery_nomas: c.distillery_nomas,
      tequila_ids: c.tequila_ids,
    })),
  };
  writeFileSync(`${outDir}/proposed-brands.json`, JSON.stringify(jsonOut, null, 2), 'utf-8');

  console.log('');
  console.log(`Wrote ${candidates.length} candidate brand rows.`);
  console.log(`  - ${outDir}/proposed-brands.csv   (edit this)`);
  console.log(`  - ${outDir}/proposed-brands.json  (machine, leave alone)`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Open data/proposed-brands.csv in Sheets and sort by tequila_count desc.');
  console.log('  2. For each row:');
  console.log('       action=keep   → create this brand (default)');
  console.log('       action=skip   → not a real brand (rows flagged multi-nom start as skip)');
  console.log('       brand_name    → fix capitalization or accents');
  console.log('       final_slug    → if merging two rows, set same final_slug on both');
  console.log('       distillery_noma → keep only the primary NOM (first listed = most rows)');
  console.log('       original_slug → do not edit');
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
