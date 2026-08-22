/**
 * Where the site's large static assets are served from.
 *
 * Video is roughly 95% of every byte this site sends: a desktop visit to the
 * homepage is ~20MB, of which the hero film and the five category loops are
 * ~18MB. Those used to ship from `public/`, which meant every play counted
 * against the host's data-transfer allowance and every deployment carried
 * 50MB of footage it would never change. They now live on object storage
 * with free egress — the same bucket as the ring renders, under `site/` —
 * and this is the one place that base URL is written down.
 *
 * The contract is the same as `lib/ring/renders.ts`: unset, every path is
 * returned untouched and resolves against `public/`, so a fresh clone with no
 * env file still works if the files are there. Set, the path is prefixed.
 * Nothing else changes shape, which is why callers pass the same root-relative
 * string they always did.
 *
 * `.env.production` pins the bucket for every production build so a deploy
 * cannot silently fall back to `public/` — which no longer holds the videos —
 * because an env var was forgotten in a dashboard. A host-level variable of
 * the same name still wins if one is set.
 *
 * Objects are uploaded with `Cache-Control: immutable` and a year's max-age,
 * so a re-exported video MUST go up under a new filename (or a `?v=` query,
 * as `lockupModel.ts` does): the old URL will be served from cache for as long
 * as anyone has it.
 */
const BASE = process.env.NEXT_PUBLIC_ASSETS_URL?.replace(/\/$/, "");

/** Prefix a root-relative `/path` with the assets origin, when one is set. */
export function asset(path: string): string {
  if (!BASE) return path;
  return path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`;
}

/**
 * Origin for a `<link rel="preconnect">`. Undefined when unset, so the tag is
 * omitted rather than preconnecting to nothing.
 */
export function assetsOrigin(): string | undefined {
  if (!BASE) return undefined;
  try {
    return new URL(BASE).origin;
  } catch {
    return undefined;
  }
}
