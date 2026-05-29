import * as cheerio from "cheerio";
import type { CrtRecord } from "./crt-types";
import { parseRegionFromAddress, stripHtml } from "./crt-types";
export function parseCrtHtml(html: string): CrtRecord[] {
  const $ = cheerio.load(html);
  const records: CrtRecord[] = [];

  $("table tr").each((_, row) => {
    const cells = $(row)
      .find("td")
      .map((__, cell) => stripHtml($(cell).html() ?? ""))
      .get()
      .filter(Boolean);

    if (cells.length < 5) return;

    const [empresa, address, noma, dot, marca] = cells;
    if (!empresa || !marca || !noma || empresa === "Empresa") return;
    if (!/^\d+$/.test(noma)) return;

    records.push({
      empresa,
      address,
      noma,
      dot,
      marca,
      region: parseRegionFromAddress(address),
    });
  });

  return records;
}

export function dedupeRecords(records: CrtRecord[]): CrtRecord[] {
  const seen = new Set<string>();
  const result: CrtRecord[] = [];

  for (const record of records) {
    const key = `${record.noma}::${record.marca.toUpperCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(record);
  }

  return result;
}

export type { CrtRecord } from "./crt-types";
export { parseRegionFromAddress, stripHtml } from "./crt-types";
