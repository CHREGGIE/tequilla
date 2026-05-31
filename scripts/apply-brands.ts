// scripts/apply-brands.ts
//
// Reads the reviewed CSV at data/proposed-brands.csv (paired with
// data/proposed-brands.json from the propose step) and:
//   1. Upserts brand records for rows where action != 'skip'
//   2. Links each tequila to its brand_id
//
// Idempotent: brand upsert uses ON CONFLICT on slug; tequila linking is
// re-runnable. Multiple CSV rows can share a final_slug to merge brands.
//
// Run: npm run brands:apply

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(l => l.length > 0);
  if (lines.length === 0) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const cells = parseCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']));
  });
}

function parseCSVLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else current += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { cells.push(current); current = ''; }
      else current += c;
    }
  }
  cells.push(current);
  return cells;
}

type JsonGroup = {
  original_slug: string;
  brand_name_proposed: string;
  distillery_nomas: string[];
  tequila_ids: string[];
};

type JsonShape = {
  generated_at: string;
  total_groups: number;
  groups: JsonGroup[];
};

async function main() {
  const csvText = readFileSync('data/proposed-brands.csv', 'utf-8');
  const jsonText = readFileSync('data/proposed-brands.json', 'utf-8');

  const rows = parseCSV(csvText);
  const json = JSON.parse(jsonText) as JsonShape;

  console.log(`CSV: ${rows.length} rows. JSON: ${json.groups.length} groups.`);

  const tequilasBySlug = new Map<string, string[]>();
  for (const g of json.groups) tequilasBySlug.set(g.original_slug, g.tequila_ids);

  const kept = rows.filter(r => (r.action ?? 'keep').toLowerCase() !== 'skip');
  const skipped = rows.length - kept.length;
  console.log(`Skipping ${skipped} rows. Applying ${kept.length} rows.`);

  // Group rows by final_slug to support merges (multiple CSV rows -> one brand)
  const byFinal = new Map<string, { rows: Record<string, string>[]; tequila_ids: Set<string> }>();
  for (const r of kept) {
    const finalSlug = (r.final_slug?.trim() || r.original_slug?.trim());
    if (!finalSlug) continue;
    let bucket = byFinal.get(finalSlug);
    if (!bucket) { bucket = { rows: [], tequila_ids: new Set() }; byFinal.set(finalSlug, bucket); }
    bucket.rows.push(r);
    const tids = tequilasBySlug.get(r.original_slug ?? '') ?? [];
    for (const id of tids) bucket.tequila_ids.add(id);
  }

  console.log(`Distinct final_slugs (= brand records to create): ${byFinal.size}`);

  // Resolve distillery NOMAs -> producer IDs in one shot
  const allNomas = new Set<string>();
  for (const [, bucket] of byFinal) {
    for (const r of bucket.rows) {
      const primary = r.distillery_noma?.split('|')[0]?.trim();
      if (primary) allNomas.add(primary);
    }
  }

  let nomaToProducerId = new Map<string, string>();
  if (allNomas.size > 0) {
    const { data: producers, error: pErr } = await supabase
      .from('producers')
      .select('id, noma')
      .in('noma', Array.from(allNomas));
    if (pErr) { console.error('Failed to fetch producers:', pErr.message); process.exit(1); }
    nomaToProducerId = new Map((producers ?? []).map(p => [p.noma as string, p.id as string]));
  }

  let brandsCreated = 0;
  let brandsExisting = 0;
  let tequilasLinked = 0;
  let errors = 0;

  for (const [finalSlug, bucket] of byFinal) {
    const firstRow = bucket.rows[0];
    const brandName = firstRow.brand_name?.trim() || finalSlug;
    const primaryNoma = firstRow.distillery_noma?.split('|')[0]?.trim();
    const distilleryId = primaryNoma ? nomaToProducerId.get(primaryNoma) : undefined;

    // Check if brand already exists
    const { data: existing } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle();

    let brandId: string;
    if (existing?.id) {
      brandId = existing.id;
      brandsExisting++;
    } else {
      const { data: created, error: bErr } = await supabase
        .from('brands')
        .insert({
          slug: finalSlug,
          name: brandName,
          distillery_id: distilleryId ?? null,
          source: 'crt-derived',
        })
        .select('id')
        .single();

      if (bErr || !created) {
        console.error(`Failed to create brand "${finalSlug}":`, bErr?.message);
        errors++;
        continue;
      }
      brandId = created.id;
      brandsCreated++;
    }

    // Link tequilas in batches of 500 (Supabase IN clause limit)
    const tequilaIds = Array.from(bucket.tequila_ids);
    for (let i = 0; i < tequilaIds.length; i += 500) {
      const batch = tequilaIds.slice(i, i + 500);
      const { error: linkErr, count } = await supabase
        .from('tequilas')
        .update({ brand_id: brandId })
        .in('id', batch)
        .select('id', { count: 'exact', head: true });
      if (linkErr) {
        console.error(`Failed to link tequilas to "${finalSlug}":`, linkErr.message);
        errors++;
      } else {
        tequilasLinked += count ?? batch.length;
      }
    }
  }

  console.log('');
  console.log('Summary');
  console.log(`  Brands created:  ${brandsCreated}`);
  console.log(`  Brands existing: ${brandsExisting} (updated link only)`);
  console.log(`  Tequilas linked: ${tequilasLinked}`);
  console.log(`  Errors:          ${errors}`);
  console.log('');
  if (errors > 0) {
    console.log('Some operations failed. Re-running is safe — it will skip what succeeded.');
  } else {
    console.log('Done. Spot-check a few brand records in Supabase to verify.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
