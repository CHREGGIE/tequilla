import "dotenv/config";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { slugify } from "../src/lib/utils";
import {
  dedupeRecords,
  parseCrtHtml,
  type CrtRecord,
} from "./lib/parse-crt";

const CRT_URL =
  "https://www.crt.org.mx/empresas-y-marcas-certificadas/";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function fetchCrtHtml(): Promise<string> {
  console.log(`Fetching CRT registry from ${CRT_URL}...`);
  const response = await fetch(CRT_URL, {
    headers: {
      "User-Agent": "TequillaCatalog/1.0 (CRT factual import)",
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(120_000),
  });

  if (!response.ok) {
    throw new Error(`CRT fetch failed: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function loadHtmlFromArgs(): string | null {
  const fileArg = process.argv.find((arg) => arg.startsWith("--file="));
  if (!fileArg) return null;
  const path = fileArg.slice("--file=".length);
  console.log(`Loading CRT HTML from ${path}...`);
  return readFileSync(path, "utf-8");
}

async function upsertProducer(record: CrtRecord): Promise<string> {
  const producerKey = slugify(record.empresa);

  const { data: existing } = await supabase
    .from("producers")
    .select("id")
    .eq("name", record.empresa)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from("producers")
    .insert({
      name: record.empresa,
      region: record.region,
      address: record.address,
      noma: record.noma,
      source: "crt",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function importRecords(records: CrtRecord[], skipExistingRich = true) {
  let producersCreated = 0;
  let tequilasCreated = 0;
  let tequilasSkipped = 0;

  const producerCache = new Map<string, string>();

  for (const record of records) {
    let producerId = producerCache.get(record.empresa);
    if (!producerId) {
      const existingBefore = await supabase
        .from("producers")
        .select("id")
        .eq("name", record.empresa)
        .maybeSingle();

      producerId = await upsertProducer(record);
      producerCache.set(record.empresa, producerId);

      if (!existingBefore.data) producersCreated++;
    }

    const slug = slugify(`${record.marca}-${record.noma}`);

    const { data: existingTequila } = await supabase
      .from("tequilas")
      .select("id, source")
      .eq("slug", slug)
      .maybeSingle();

    if (existingTequila && skipExistingRich && existingTequila.source !== "crt") {
      tequilasSkipped++;
      continue;
    }

    const payload = {
      producer_id: producerId,
      name: record.marca,
      slug,
      type: "blanco" as const,
      description: null,
      additive_free: false,
      organic: false,
      agave_region: record.region,
      noma: record.noma,
      crt_dot: record.dot || null,
      source: "crt",
      featured: false,
    };

    if (existingTequila) {
      const { error } = await supabase
        .from("tequilas")
        .update(payload)
        .eq("id", existingTequila.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("tequilas").insert(payload);
      if (error) throw error;
      tequilasCreated++;
    }
  }

  return { producersCreated, tequilasCreated, tequilasSkipped };
}

async function main() {
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : undefined;

  const html = loadHtmlFromArgs() ?? (await fetchCrtHtml());
  const parsed = dedupeRecords(parseCrtHtml(html));
  const records = limit ? parsed.slice(0, limit) : parsed;

  console.log(`Parsed ${parsed.length} unique CRT brand records`);
  console.log(`Importing ${records.length} records...`);

  const stats = await importRecords(records);

  console.log("\nDone!");
  console.log(`  Producers created: ${stats.producersCreated}`);
  console.log(`  Tequilas created:  ${stats.tequilasCreated}`);
  console.log(`  Tequilas skipped:  ${stats.tequilasSkipped} (kept existing curated data)`);

  const { count } = await supabase
    .from("tequilas")
    .select("*", { count: "exact", head: true });

  console.log(`  Total tequilas in DB: ${count ?? 0}`);
}

main().catch((error) => {
  console.error(error);
  console.error(
    "\nIf fetch timed out, save the CRT page as HTML in your browser and run:\n  npm run import:crt -- --file=path/to/crt-page.html",
  );
  process.exit(1);
});
