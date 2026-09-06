#!/usr/bin/env node
/**
 * Route guard.
 *
 * Three things go wrong with routes in a Next.js app, and none of them fail
 * the build on their own:
 *
 *   1. A page is renamed or moved, and the string literals pointing at it —
 *      in the nav, the footer, a guide, the structured data — keep compiling
 *      and start 404ing. Nothing type-checks an href.
 *   2. A page is added and nothing links to it or lists it. /ourbrand shipped
 *      that way: built, given metadata, absent from the sitemap and from every
 *      link on the site, which to a crawler means it does not exist.
 *   3. A token is registered for a page that no longer exists, so the registry
 *      itself starts lying.
 *
 * This checks all three against the actual app directory, and fails the build
 * rather than reporting them after a deploy.
 *
 * Escape hatch: end a line with `// route-literal-ok` to allow a deliberate
 * literal (a redirect source, a legacy path, a doc example).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "lib", "scripts"];
const REGISTRY = join("lib", "routes.ts");

/* ── 1. Read the registry ─────────────────────────────────────────────── */

const registrySrc = readFileSync(join(ROOT, REGISTRY), "utf8");
/**
 * Parse the registry by matching braces, not by regex.
 *
 * A regex was tried and was quietly wrong: `rings: { path: "/rings", … },` is
 * written on one line, so a lazy `[\s\S]*?` looking for the closing brace ran
 * straight past it and swallowed the NEXT token whole. Five routes vanished
 * from the registry's view and the guard confidently reported them as
 * unregistered pages. A parser that silently drops entries is worse than no
 * parser, because every check downstream then runs on a subset without saying
 * so — hence the count assertion at the end.
 */
const registered = new Map(); // path -> token
const tokenBodies = new Map(); // token -> its definition text

{
  const re = /^  (\w+):\s*\{/gm;
  let m;
  while ((m = re.exec(registrySrc)) !== null) {
    const token = m[1];
    let i = m.index + m[0].length - 1; // at the opening brace
    let depth = 0;
    let endIdx = i;
    for (; i < registrySrc.length; i++) {
      const c = registrySrc[i];
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) { endIdx = i; break; }
      }
    }
    const body = registrySrc.slice(m.index, endIdx + 1);
    const pathMatch = body.match(/path:\s*"([^"]+)"/);
    if (!pathMatch) continue;
    registered.set(pathMatch[1], token);
    tokenBodies.set(token, body);
    re.lastIndex = endIdx;
  }
}

// If these disagree, the parse missed something and every check below is
// running on an incomplete registry.
// Not anchored to line start: single-line entries put `path:` mid-line.
const pathCount = (registrySrc.match(/path:\s*"/g) || []).length;
if (registered.size !== pathCount) {
  fail(
    `parsed ${registered.size} routes but ${REGISTRY} declares ${pathCount} ` +
      `\`path:\` entries. The parser is out of step with the file's shape — fix ` +
      `it before trusting any result.`,
  );
}

if (registered.size === 0) {
  fail(`Could not parse any routes out of ${REGISTRY}. Has its shape changed?`);
}

// The dynamic prefixes the builders own, so a literal underneath one is a
// hand-assembled URL rather than a registered page.
const DYNAMIC_PREFIXES = [
  ["/watches/", "ROUTES.watchBrand() / ROUTES.watchProduct()"],
  ["/jewellery/", "ROUTES.jewelleryCategory() / ROUTES.jewelleryProduct()"],
  ["/sell/", "ROUTES.sellBrand()"],
];

/* ── 2. Walk the app directory ────────────────────────────────────────── */

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const appFiles = walk(join(ROOT, "app"));

/** Turn app/guides/wedding-bands/page.tsx into /guides/wedding-bands. */
function routeOf(file) {
  const rel = relative(join(ROOT, "app"), file).split(sep);
  const leaf = rel.pop();
  if (leaf === "page.tsx" || leaf === "page.ts") {
    // Route groups — (marketing) — are organisational, not part of the URL.
    const segs = rel.filter((s) => !s.startsWith("("));
    return "/" + segs.join("/");
  }
  if (leaf === "route.ts" || leaf === "route.tsx") {
    return "/" + rel.filter((s) => !s.startsWith("(")).join("/");
  }
  if (rel.length === 0 && leaf === "sitemap.ts") return "/sitemap.xml";
  if (rel.length === 0 && leaf === "robots.ts") return "/robots.txt";
  return null;
}

const onDisk = new Set();
for (const f of appFiles) {
  const r = routeOf(f);
  // Parameterised routes are covered by the builders, not by static tokens.
  if (r !== null && !r.includes("[")) onDisk.add(r === "" ? "/" : r);
}

/* ── 3. Registry vs. filesystem ───────────────────────────────────────── */

const problems = [];

for (const route of onDisk) {
  if (!registered.has(route)) {
    problems.push(
      `Unregistered page: ${route}\n` +
        `    It exists in app/ but has no token in ${REGISTRY}, so nothing can link to it\n` +
        `    by name and the sitemap will not list it. Add it to STATIC_ROUTES.`,
    );
  }
}

// Static files served from public/ are registered on purpose (llms.txt), so
// only complain about a token whose path looks like a page and is not one.
const PUBLIC_FILES = new Set(["/llms.txt"]);
for (const [path, token] of registered) {
  if (PUBLIC_FILES.has(path)) continue;
  if (!onDisk.has(path)) {
    problems.push(
      `Dead token: ROUTES.${token} -> ${path}\n` +
        `    Nothing in app/ serves this path. Remove the token or restore the page.`,
    );
  }
}

/* ── 4. Hardcoded literals at call sites ──────────────────────────────── */

/** Remove comments and JSDoc so prose mentioning a path is not a finding. */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));
}

// next.config.ts is scanned as well: its redirect destinations are live routes,
// and a redirect pointing at a page that has since been renamed is a 404
// wearing a 308's clothes.
const EXTRA_FILES = [join(ROOT, "next.config.ts")];

const sourceFiles = [...SCAN_DIRS.flatMap((d) => walk(join(ROOT, d))), ...EXTRA_FILES].filter(
  (f) =>
    /\.(ts|tsx|mjs|js)$/.test(f) &&
    relative(ROOT, f) !== REGISTRY &&
    // The guard names the prefixes it polices, so it always matches itself.
    relative(ROOT, f) !== join("scripts", "check-routes.mjs"),
);

for (const file of sourceFiles) {
  const rel = relative(ROOT, file);
  const raw = readFileSync(file, "utf8");
  const lines = raw.split("\n");
  const scrubbed = stripComments(raw).split("\n");

  scrubbed.forEach((line, i) => {
    if (lines[i].includes("route-literal-ok")) return;

    // 4a. A literal equal to a registered path.
    for (const [path, token] of registered) {
      if (path === "/") continue; // "/" is too common to match usefully
      const re = new RegExp(`["'\`]${path.replace(/[/\-]/g, "\\$&")}["'\`]`);
      if (re.test(line)) {
        problems.push(
          `${rel}:${i + 1}  hardcoded "${path}"\n` +
            `    Use ROUTES.${token} instead.\n` +
            `    ${lines[i].trim().slice(0, 100)}`,
        );
      }
    }

    // 4b. A hand-assembled path under a dynamic prefix.
    for (const [prefix, builder] of DYNAMIC_PREFIXES) {
      const re = new RegExp(`["'\`]${prefix.replace(/\//g, "\\/")}[^"'\`]`);
      if (re.test(line)) {
        problems.push(
          `${rel}:${i + 1}  hand-built path under ${prefix}\n` +
            `    Use ${builder} instead.\n` +
            `    ${lines[i].trim().slice(0, 100)}`,
        );
      }
    }
  });
}

/* ── 4b. Builders vs. the dynamic routes they claim ───────────────────── */

/**
 * A builder is a promise that a parameterised route exists. Delete
 * app/sell/[brand]/ and `ROUTES.sellBrand()` still compiles and still returns
 * a plausible-looking string — it just addresses nothing. The static half of
 * this check would never notice, because a dynamic segment is skipped there.
 */
const BUILDERS = [
  ["watchBrand", "watches/[brand]"],
  ["watchProduct", "watches/[brand]/[slug]"],
  ["jewelleryCategory", "jewellery/[category]"],
  ["jewelleryProduct", "jewellery/[category]/[slug]"],
  ["sellBrand", "sell/[brand]"],
  ["ringShape", "rings/[shape]"],
];

for (const [builder, dir] of BUILDERS) {
  if (!registrySrc.includes(`${builder}:`)) continue;
  const page = join(ROOT, "app", ...dir.split("/"), "page.tsx");
  try {
    statSync(page);
  } catch {
    problems.push(
      `ROUTES.${builder}() has no page: app/${dir}/page.tsx is missing\n` +
        `    The builder still compiles and still returns a URL — one that` +
        ` addresses nothing.`,
    );
  }
}

/* ── 4d. Orphans: a token nothing references ──────────────────────────── */

/**
 * /ourbrand is the reason this check exists. It shipped built, metadata'd, and
 * referenced by no link and no sitemap entry — which to a crawler means the
 * page does not exist. The static-page check cannot see that, because the file
 * is present and correct; what is missing is anything pointing at it.
 *
 * A token used nowhere is the same failure in the new shape. The sitemap
 * iterates the registry wholesale and never names a token, so a page that only
 * the sitemap knows about has zero `ROUTES.<token>` references — exactly what
 * this finds. Routes that are meant to have no inbound link declare
 * `unlinked:` in the registry and are skipped.
 */

/**
 * A page names its own token — `pageMetadata({ path: ROUTES.ourBrand })`, its
 * canonical, its breadcrumb. Counting those makes every route look linked and
 * the check useless, which is what the first version of it did. So the route's
 * own implementation is excluded and the question becomes the one that matters:
 * does anything ELSE point here?
 */
const fileCache = new Map();
const readCached = (f) => {
  if (!fileCache.has(f)) fileCache.set(f, readFileSync(f, "utf8"));
  return fileCache.get(f);
};

for (const [path, token] of registered) {
  const body = tokenBodies.get(token) ?? "";
  if (/\bunlinked\s*:/.test(body)) continue;

  // Files that implement this route, which do not count as inbound links.
  const ownDir = path === "/" ? null : join(ROOT, "app", ...path.split("/").filter(Boolean));
  const external = sourceFiles.filter((f) =>
    path === "/" ? f !== join(ROOT, "app", "page.tsx") : !f.startsWith(ownDir + sep) && f !== ownDir,
  );

  const re = new RegExp(`ROUTES\\.${token}\\b`);
  if (external.some((f) => re.test(readCached(f)))) continue;
  problems.push(
    `Orphan route: ROUTES.${token} -> ${path}\n` +
      `    Only the page's own files reference this token, so nothing on the site\n` +
      `    links to it — the /ourbrand failure. Link it from a nav, footer or\n` +
      `    related section, or declare \`unlinked: "<why>"\` on it in ${REGISTRY}.`,
  );
}

/* ── 5. public/llms.txt ───────────────────────────────────────────────── */

/**
 * llms.txt is a hand-written map of the site for AI assistants, and it is the
 * one file here that no compiler and no crawler checks. A stale URL in it does
 * not break a page — it quietly teaches every assistant that reads it to cite
 * an address that 404s, which is worse than not being listed at all.
 *
 * Slugs are read out of the data files by pattern rather than imported,
 * because this runs as plain node before the bundler exists.
 */
function slugsFrom(file, listName) {
  let src;
  try {
    src = readFileSync(join(ROOT, file), "utf8");
  } catch {
    return [];
  }
  if (listName) {
    const start = src.indexOf(listName);
    if (start === -1) return [];
    // Stop at the next top-level declaration, or the slice runs on into the
    // following array and every list validates every other list's slugs.
    const rest = src.slice(start + listName.length);
    const end = rest.search(/\n(?:export |function |const )/);
    src = end === -1 ? rest : rest.slice(0, end);
  }
  return [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const watchBrands = slugsFrom("lib/taxonomy.ts", "WATCH_BRANDS");
const jewelleryCats = slugsFrom("lib/taxonomy.ts", "JEWELLERY_CATEGORIES");
const sellBrands = slugsFrom("lib/sell/brands.ts", "SELL_BRANDS");
const shapeGuides = slugsFrom("lib/rings/shapeGuides.ts", "SHAPE_GUIDES");

/* ── 4e. Retired-brand redirects must not shadow a live brand ─────────── */

/**
 * next.config.ts permanently redirects /watches/{iwc,panerai,vacheron-constantin}
 * to /watches. Its own comment warns that re-adding one of those brands to
 * lib/taxonomy.ts without deleting its redirect first would leave the brand
 * page unreachable behind a 308. That warning has been sitting there unenforced.
 */
let config = null;
try {
  config = readFileSync(join(ROOT, "next.config.ts"), "utf8");
} catch {
  // No next.config.ts. Nothing to check, and not this check's problem.
}
if (config) {
  const retired = config.match(/\[((?:\s*"[a-z-]+",?)+)\]\.map\(\(brand\)/);
  if (retired) {
    const brands = [...retired[1].matchAll(/"([a-z-]+)"/g)].map((m) => m[1]);
    for (const b of brands) {
      if (watchBrands.includes(b)) {
        problems.push(
          `Retired brand is live again: "${b}"\n` +
            `    lib/taxonomy.ts lists it in WATCH_BRANDS, but next.config.ts still\n` +
            `    redirects /watches/${b}/* to /watches. The brand page will never be\n` +
            `    reachable. Delete the redirect entry, or remove the brand.`,
        );
      }
    }
  }
}


/* ── 4c. Static routes shadowing a dynamic sibling ────────────────────── */

/**
 * A static path always wins over a dynamic segment at the same level. That is
 * what lets /rings/ready-to-ship and /rings/platinum-engagement-rings sit
 * beside /rings/[shape] — but it also means that the day a shape guide is
 * given a slug some static page already owns, the guide stops rendering. Not
 * with an error: the static page answers instead, while the sitemap goes on
 * advertising the URL as the guide. Six static children now sit under /rings
 * against ten shape slugs, so the surface for this is real and growing.
 */
const DYNAMIC_FAMILIES = [
  ["/rings", shapeGuides],
  ["/watches", watchBrands],
  ["/jewellery", jewelleryCats],
  ["/sell", sellBrands],
];

for (const [parent, familySlugs] of DYNAMIC_FAMILIES) {
  for (const slug of familySlugs) {
    const path = `${parent}/${slug}`;
    if (registered.has(path)) {
      problems.push(
        `Shadowed route: ${path}\n` +
          `    ROUTES.${registered.get(path)} is a static page at that exact path, and a` +
          ` static\n    route beats a dynamic one. The ${parent}/[dynamic] entry for` +
          ` "${slug}" will never\n    render, but the sitemap will still advertise it.` +
          ` Rename one of the two.`,
      );
    }
  }
}


const validPaths = new Set([
  ...registered.keys(),
  ...watchBrands.map((s) => `/watches/${s}`),
  ...jewelleryCats.map((s) => `/jewellery/${s}`),
  ...sellBrands.map((s) => `/sell/${s}`),
  ...shapeGuides.map((s) => `/rings/${s}`),
]);

try {
  const llms = readFileSync(join(ROOT, "public", "llms.txt"), "utf8");
  const seen = new Set();
  for (const m of llms.matchAll(/https:\/\/alpoelondon\.com(\/[^\s)\]]*)?/g)) {
    const path = m[1] || "/";
    if (seen.has(path)) continue;
    seen.add(path);
    // Individual product pages come from the catalogue sheet, not from a slug
    // list this script can read, so three-segment paths are left alone.
    if (path.split("/").filter(Boolean).length >= 3) continue;
    if (!validPaths.has(path)) {
      problems.push(
        `public/llms.txt  lists ${path}\n` +
          `    No route serves that path. Fix the URL or restore the page —` +
          ` assistants cite this file.`,
      );
    }
  }
} catch {
  // No llms.txt is fine; it is optional.
}

/* ── 6. Report ────────────────────────────────────────────────────────── */

function fail(msg) {
  console.error(`\n  route guard: ${msg}\n`);
  process.exit(1);
}

if (problems.length) {
  console.error(`\n  Route guard found ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  • ${p}\n`);
  console.error(
    `  Every internal path is named once in ${REGISTRY}. Import ROUTES from\n` +
      `  "@/lib/routes" and use the token, or append \`// route-literal-ok\` to a\n` +
      `  line where the literal is deliberate.\n`,
  );
  process.exit(1);
}

console.log(
  `  route guard: ${registered.size} routes registered, ${onDisk.size} served, no hardcoded paths.`,
);
