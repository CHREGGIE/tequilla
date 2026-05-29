import "dotenv/config";
import { writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { dedupeRecords, parseCrtHtml } from "./lib/parse-crt";
import {
  fetchCrtHtml,
  importCrtRecords,
  loadExistingCrtTequilas,
  loadHtmlFromArgs,
} from "./lib/crt-import";
import { buildCrtSyncReport, printSyncReport } from "./lib/crt-sync";

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
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const reportArg = process.argv.find((arg) => arg.startsWith("--report="));
  const limit = limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : undefined;

  const html = loadHtmlFromArgs() ?? (await fetchCrtHtml());
  const parsed = dedupeRecords(parseCrtHtml(html));
  const records = limit ? parsed.slice(0, limit) : parsed;

  const existing = await loadExistingCrtTequilas(supabase);
  const report = buildCrtSyncReport(records, existing);
  printSyncReport(report);

  if (reportArg) {
    const reportPath = reportArg.slice("--report=".length);
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nWrote report to ${reportPath}`);
  }

  const hasChanges =
    report.newRecords.length > 0 ||
    report.updatedRecords.length > 0 ||
    report.removedRecords.length > 0;

  if (dryRun) {
    console.log("\nDry run — no database changes applied.");
    process.exit(hasChanges ? 0 : 0);
  }

  if (!hasChanges) {
    console.log("\nNo changes to apply.");
    return;
  }

  console.log(`\nApplying sync for ${records.length} CRT records...`);
  const stats = await importCrtRecords(supabase, records);

  console.log("\nSync applied!");
  console.log(`  Producers created: ${stats.producersCreated}`);
  console.log(`  Tequilas created:  ${stats.tequilasCreated}`);
  console.log(`  Tequilas updated:  ${stats.tequilasUpdated}`);
  console.log(`  Tequilas skipped:  ${stats.tequilasSkipped} (kept existing curated data)`);

  if (report.removedRecords.length > 0) {
    console.log(
      "\nNote: Possibly delisted rows were NOT deleted automatically. Review them in admin if needed.",
    );
  }
}

main().catch((error) => {
  console.error(error);
  console.error(
    "\nIf fetch timed out, save the CRT page as HTML and run:\n  npm run sync:crt -- --file=path/to/crt-page.html",
  );
  process.exit(1);
});
