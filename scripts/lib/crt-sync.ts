import type { CrtRecord } from "./crt-types";
import { slugify } from "../../src/lib/utils";

export function crtRecordKey(record: CrtRecord): string {
  return `${record.noma}::${record.marca.toUpperCase()}`;
}

export function crtRecordSlug(record: CrtRecord): string {
  return slugify(`${record.marca}-${record.noma}`);
}

export interface ExistingCrtTequila {
  id: string;
  slug: string;
  name: string;
  noma: string | null;
  crt_dot: string | null;
  agave_region: string | null;
  producer: {
    name: string;
    address: string | null;
  } | null;
}

export interface CrtRecordChange {
  key: string;
  slug: string;
  before: ExistingCrtTequila;
  after: CrtRecord;
  fields: string[];
}

export interface CrtSyncReport {
  fetchedAt: string;
  totalParsed: number;
  existingCrtCount: number;
  newRecords: CrtRecord[];
  updatedRecords: CrtRecordChange[];
  removedRecords: ExistingCrtTequila[];
  unchangedCount: number;
  warnings: string[];
}

function recordFromExisting(existing: ExistingCrtTequila): CrtRecord {
  return {
    empresa: existing.producer?.name ?? "",
    address: existing.producer?.address ?? "",
    noma: existing.noma ?? "",
    dot: existing.crt_dot ?? "",
    marca: existing.name,
    region: existing.agave_region,
  };
}

function changedFields(before: CrtRecord, after: CrtRecord): string[] {
  const fields: string[] = [];
  if (before.empresa !== after.empresa) fields.push("empresa");
  if (before.address !== after.address) fields.push("address");
  if (before.noma !== after.noma) fields.push("noma");
  if (before.dot !== after.dot) fields.push("dot");
  if (before.marca !== after.marca) fields.push("marca");
  if (before.region !== after.region) fields.push("region");
  return fields;
}

export function buildCrtSyncReport(
  parsed: CrtRecord[],
  existing: ExistingCrtTequila[],
): CrtSyncReport {
  const warnings: string[] = [];
  const parsedByKey = new Map(parsed.map((record) => [crtRecordKey(record), record]));
  const parsedSlugs = new Set(parsed.map(crtRecordSlug));
  const existingBySlug = new Map(existing.map((row) => [row.slug, row]));

  const newRecords: CrtRecord[] = [];
  const updatedRecords: CrtRecordChange[] = [];
  let unchangedCount = 0;

  for (const record of parsed) {
    const slug = crtRecordSlug(record);
    const existingRow = existingBySlug.get(slug);

    if (!existingRow) {
      newRecords.push(record);
      continue;
    }

    const before = recordFromExisting(existingRow);
    const fields = changedFields(before, record);
    if (fields.length === 0) {
      unchangedCount++;
      continue;
    }

    updatedRecords.push({
      key: crtRecordKey(record),
      slug,
      before: existingRow,
      after: record,
      fields,
    });
  }

  let removedRecords: ExistingCrtTequila[] = existing.filter(
    (row) => !parsedSlugs.has(row.slug),
  );

  if (
    existing.length > 0 &&
    parsed.length < existing.length * 0.9
  ) {
    warnings.push(
      `Parsed ${parsed.length} records but ${existing.length} CRT rows exist in DB — skipping removal detection (possible incomplete fetch).`,
    );
    removedRecords = [];
  }

  return {
    fetchedAt: new Date().toISOString(),
    totalParsed: parsed.length,
    existingCrtCount: existing.length,
    newRecords,
    updatedRecords,
    removedRecords,
    unchangedCount,
    warnings,
  };
}

export function printSyncReport(report: CrtSyncReport) {
  console.log(`\nCRT sync report (${report.fetchedAt})`);
  console.log(`  Parsed from CRT:     ${report.totalParsed}`);
  console.log(`  CRT rows in DB:      ${report.existingCrtCount}`);
  console.log(`  New:                 ${report.newRecords.length}`);
  console.log(`  Updated:             ${report.updatedRecords.length}`);
  console.log(`  Possibly removed:    ${report.removedRecords.length}`);
  console.log(`  Unchanged:           ${report.unchangedCount}`);

  for (const warning of report.warnings) {
    console.log(`\n  ⚠ ${warning}`);
  }

  if (report.newRecords.length > 0) {
    console.log("\nNew listings:");
    for (const record of report.newRecords.slice(0, 20)) {
      console.log(`  + NOM ${record.noma} · ${record.marca} (${record.empresa})`);
    }
    if (report.newRecords.length > 20) {
      console.log(`  … and ${report.newRecords.length - 20} more`);
    }
  }

  if (report.updatedRecords.length > 0) {
    console.log("\nUpdated listings:");
    for (const change of report.updatedRecords.slice(0, 20)) {
      console.log(
        `  ~ NOM ${change.after.noma} · ${change.after.marca} [${change.fields.join(", ")}]`,
      );
    }
    if (report.updatedRecords.length > 20) {
      console.log(`  … and ${report.updatedRecords.length - 20} more`);
    }
  }

  if (report.removedRecords.length > 0) {
    console.log("\nPossibly delisted (in DB but missing from latest CRT fetch):");
    for (const row of report.removedRecords.slice(0, 20)) {
      console.log(`  - NOM ${row.noma ?? "?"} · ${row.name}`);
    }
    if (report.removedRecords.length > 20) {
      console.log(`  … and ${report.removedRecords.length - 20} more`);
    }
  }
}
