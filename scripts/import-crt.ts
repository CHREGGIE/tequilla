import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { dedupeRecords, parseCrtHtml } from "./lib/parse-crt";
import { fetchCrtHtml, importCrtRecords, loadHtmlFromArgs } from "./lib/crt-import";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : undefined;

  const html = loadHtmlFromArgs() ?? (await fetchCrtHtml());
  const parsed = dedupeRecords(parseCrtHtml(html));
  const records = limit ? parsed.slice(0, limit) : parsed;

  console.log(`Parsed ${parsed.length} unique CRT brand records`);
  console.log(`Importing ${records.length} records...`);

  const stats = await importCrtRecords(supabase, records);

  console.log("\nDone!");
  console.log(`  Producers created: ${stats.producersCreated}`);
  console.log(`  Tequilas created:  ${stats.tequilasCreated}`);
  console.log(`  Tequilas updated:  ${stats.tequilasUpdated}`);
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
