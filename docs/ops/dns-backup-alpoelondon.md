# DNS backup — alpoelondon.com

**Current capture: 6 Sep 2026**, read from the authoritative servers, not a
resolver cache. An older capture from 19 Aug 2026 is kept at the bottom as
history.

> **What actually happened.** The 19 Aug capture below was taken "before moving
> nameservers from Netlify DNS to Cloudflare". That move never happened. On
> 22 Aug 2026 the site moved from Netlify to **Vercel**, and DNS moved with it
> — the registrar (Namecheap) now points at Vercel's nameservers, and Vercel
> manages the zone. Anything below the horizontal rule describes a plan that
> was abandoned; do not follow it.

## The zone as it stands

    NS    ns1.vercel-dns.com.
    NS    ns2.vercel-dns.com.

    SOA   ns1.vercel-dns.com. hostmaster.nsone.net.
          serial 1787422418  refresh 43200  retry 7200
          expire 1209600  minimum 600

    alpoelondon.com.       A   216.198.79.1
    alpoelondon.com.       A   64.29.17.1
    www.alpoelondon.com.   A   216.198.79.1
    www.alpoelondon.com.   A   64.29.17.1

    TXT   "google-site-verification=2ZkAgt4r2cXFy622uX5P08O2gx0Cg-wJ7fd8bwISjp4"

    CAA   0 issue "sectigo.com"
    CAA   0 issue "letsencrypt.org"
    CAA   0 issue "pki.goog"

**No MX. No AAAA. No CNAME.** No email runs on this domain, which removes the
single biggest risk in a nameserver migration — there is no MX record to miss.

Three things here did not exist in the August capture and are worth knowing
about before anyone edits the zone:

- **The `google-site-verification` TXT.** Search Console ownership hangs off
  it. Delete it and the property is unverified, which costs the performance
  data the SEO work reads from.
- **The CAA records.** They restrict who may issue a certificate for this
  domain to Sectigo, Let's Encrypt and Google Trust Services. If the host ever
  changes and its CA is not one of those three, certificate issuance fails with
  an error that does not obviously point at DNS. Add the new CA *before*
  migrating, not after.
- **`www` and the apex resolve to the same Vercel addresses**, and as of
  6 Sep 2026 both answer `200` with no redirect. A `www` → apex 301 now lives
  in `next.config.ts`, not in DNS. If a redirect is ever added at the Vercel
  domain layer as well, check it runs the same direction — apex→www there
  against www→apex in the app is an infinite loop.

`renders.alpoelondon.com` also resolves, to Vercel, and returns
`x-vercel-error: DEPLOYMENT_NOT_FOUND`. It is not an R2 custom domain and never
was; the ring renders are served from the `pub-….r2.dev` URL. A bare
`host renders.alpoelondon.com` looks like success and is not.

## Rollback

Rolling back to Netlify DNS means setting the registrar's nameservers to
`dns1–dns4.p07.nsone.net`. **This has almost certainly expired.** Netlify keeps
a zone only briefly after you stop pointing at it, and that was over two weeks
ago as of this capture — assume the zone is gone and that a rollback means
recreating the records above by hand at whichever provider you land on.

---

## History: capture of 19 Aug 2026

Taken from `@dns1.p07.nsone.net` while the domain was still on Netlify DNS,
in preparation for a Netlify→Cloudflare move that was abandoned in favour of
Vercel three days later.

    alpoelondon.com.       120   IN  A   63.176.8.218
    alpoelondon.com.       120   IN  A   35.157.26.135
    www.alpoelondon.com.   120   IN  A   63.176.8.218
    www.alpoelondon.com.   120   IN  A   35.157.26.135

    NS   dns1–dns4.p07.nsone.net.   (Netlify DNS)
    SOA  dns1.p01.nsone.net. domains+netlify.netlify.com.

    No MX. No TXT. No CAA. No AAAA. No other subdomains.

Those two A records were internal to Netlify DNS and are of no use anywhere
else. They are recorded only so the before/after is legible.
