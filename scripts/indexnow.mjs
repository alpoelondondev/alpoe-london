#!/usr/bin/env node
/**
 * IndexNow: tell Bing (and through it Copilot, DuckDuckGo and the AI search
 * tools built on Bing's index) which URLs exist or changed.
 *
 * It does nothing for Google, which does not support IndexNow. What it buys is
 * speed on the other engines: a new page is otherwise found whenever their
 * crawler next comes round, and on a young site that can be weeks.
 *
 * Run after a deploy, once the new pages are live:
 *
 *   pnpm indexnow            list what would be sent, send nothing
 *   pnpm indexnow --send     send every URL in the live sitemap
 *
 * The key is not a secret. IndexNow works by fetching <site>/<key>.txt and
 * checking it matches, so the file lives in public/ and the key is read from
 * its name. Rotate it by replacing that file.
 *
 * Deliberately a manual step, not part of the build: a build that pinged a
 * third party on every run would announce work in progress, and a failed
 * network call must never fail a deploy.
 */

import { readdirSync } from "node:fs";
import { join } from "node:path";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alpoelondon.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const send = process.argv.includes("--send");

async function main() {
  // The key is the name of the single 32-hex-character .txt file in public/.
  const keyFiles = readdirSync(join(process.cwd(), "public")).filter((f) =>
    /^[a-f0-9]{32}\.txt$/.test(f),
  );
  if (keyFiles.length !== 1) {
    console.error(`Expected exactly one IndexNow key file in public/, found ${keyFiles.length}.`);
    return 1;
  }
  const key = keyFiles[0].replace(".txt", "");
  const keyLocation = new URL(keyFiles[0], `${SITE}/`).href;

  // The key file must be reachable on the live site before IndexNow will accept
  // anything, so check that first rather than send a batch that gets rejected.
  const check = await fetch(keyLocation);
  const served = check.ok ? (await check.text()).trim() : "";
  if (served !== key) {
    console.error(`Key file not live at ${keyLocation} (got HTTP ${check.status}). Deploy first.`);
    return 1;
  }

  const xml = await (await fetch(new URL("sitemap.xml", `${SITE}/`))).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`${urls.length} URLs in the live sitemap.`);

  if (!send) {
    console.log("Dry run. Nothing sent. Add --send to submit them.");
    return 0;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation, urlList: urls }),
  });
  console.log(`IndexNow responded HTTP ${res.status} (200 or 202 means accepted).`);
  return res.ok ? 0 : 1;
}

// Set the exit code and let the process drain rather than calling
// process.exit() straight after a fetch, which crashes Node on Windows.
process.exitCode = await main();
