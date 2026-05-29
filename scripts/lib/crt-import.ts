import { readFileSync } from "fs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { slugify } from "../../src/lib/utils";
import type { CrtRecord } from "./crt-types";
import { CRT_URL } from "./crt-types";
import type { ExistingCrtTequila } from "./crt-sync";

export async function fetchCrtHtml(): Promise<string> {
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

export function loadHtmlFromArgs(argv = process.argv): string | null {
  const fileArg = argv.find((arg) => arg.startsWith("--file="));
  if (!fileArg) return null;
  const path = fileArg.slice("--file=".length);
  console.log(`Loading CRT HTML from ${path}...`);
  return readFileSync(path, "utf-8");
}

async function upsertProducer(
  supabase: SupabaseClient,
  record: CrtRecord,
): Promise<string> {
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

export async function importCrtRecords(
  supabase: SupabaseClient,
  records: CrtRecord[],
  skipExistingRich = true,
) {
  let producersCreated = 0;
  let tequilasCreated = 0;
  let tequilasUpdated = 0;
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

      producerId = await upsertProducer(supabase, record);
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
      tequilasUpdated++;
    } else {
      const { error } = await supabase.from("tequilas").insert(payload);
      if (error) throw error;
      tequilasCreated++;
    }
  }

  return { producersCreated, tequilasCreated, tequilasUpdated, tequilasSkipped };
}

export async function loadExistingCrtTequilas(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("tequilas")
    .select(
      "id, slug, name, noma, crt_dot, agave_region, producer:producers(name, address)",
    )
    .eq("source", "crt");

  if (error) throw error;

  return (data ?? []).map((row) => {
    const producer = Array.isArray(row.producer) ? row.producer[0] : row.producer;
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      noma: row.noma,
      crt_dot: row.crt_dot,
      agave_region: row.agave_region,
      producer: producer
        ? { name: producer.name, address: producer.address }
        : null,
    } satisfies ExistingCrtTequila;
  });
}
