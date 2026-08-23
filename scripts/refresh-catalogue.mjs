#!/usr/bin/env node
/**
 * Pull the published Google Sheet into data/catalogue.csv.
 *
 * The site used to fetch the sheet itself, at request time, on a ten-minute
 * revalidate — which meant an edit to a spreadsheet changed the live site with
 * nobody reviewing it, and meant every page that showed a listing was a page
 * that could not be served as static HTML. See the note at the top of
 * lib/catalogue.ts.
 *
 * This is the replacement: fetch deliberately, look at the diff, commit it. The
 * deploy is what publishes the change, which is the same rule every other piece
 * of content on the site follows.
 *
 *     pnpm refresh:catalogue          # writes data/catalogue.csv
 *     git diff --stat data/catalogue.csv
 *
 * Set NEXT_PUBLIC_CATALOGUE_CSV_URL to point at a different sheet.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CSV_URL =
  process.env.NEXT_PUBLIC_CATALOGUE_CSV_URL ??
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU-BOtAETP_4U3y1C0g-2Tb4QSFj9GUAWOBddqJeByRQyO0gl5aFVSc8m_9cUtwBN4CdmiLZT1PVGC/pub?output=csv";

const OUT = join(process.cwd(), "data", "catalogue.csv");

const res = await fetch(CSV_URL, { signal: AbortSignal.timeout(30_000) });
if (!res.ok) {
  console.error(`sheet responded ${res.status} — data/catalogue.csv left alone`);
  process.exit(1);
}

const text = await res.text();
// A published sheet that has been unshared answers 200 with an HTML login page,
// which would otherwise land in the CSV and empty the catalogue on next build.
if (!text.includes(",") || /^\s*<!doctype html/i.test(text)) {
  console.error("sheet returned something that is not a CSV — nothing written");
  process.exit(1);
}

const before = (() => {
  try {
    return readFileSync(OUT, "utf8");
  } catch {
    return "";
  }
})();

if (before === text) {
  console.log("catalogue.csv already matches the sheet");
  process.exit(0);
}

writeFileSync(OUT, text);
const rows = (s) => Math.max(0, s.trim().split("\n").length - 1);
console.log(
  `catalogue.csv written: ${rows(before)} rows -> ${rows(text)}. Review the diff before committing.`,
);
