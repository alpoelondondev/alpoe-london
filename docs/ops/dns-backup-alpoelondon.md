# DNS backup — alpoelondon.com

Captured 19 Aug 2026, before moving nameservers from Netlify DNS to Cloudflare.
Read straight from the authoritative servers (`@dns1.p07.nsone.net`), not from
a resolver cache.

## Everything that exists

    alpoelondon.com.       120   IN  A   63.176.8.218
    alpoelondon.com.       120   IN  A   35.157.26.135
    www.alpoelondon.com.   120   IN  A   63.176.8.218
    www.alpoelondon.com.   120   IN  A   35.157.26.135

    NS   dns1–dns4.p07.nsone.net.   (Netlify DNS)
    SOA  dns1.p01.nsone.net. domains+netlify.netlify.com.

**No MX. No TXT. No CAA. No AAAA. No other subdomains.**

That is the whole zone. No email runs on this domain, which removes the single
biggest risk in any nameserver migration — a missed MX record silently
black-holing mail is how these go wrong, and there is none to miss.

## Note on the A records

Do not copy these two IPs into Cloudflare. They are internal to Netlify DNS.
A site on external DNS uses different values — Netlify's documented apex is
`75.2.60.5`, or better, a CNAME to the site's `*.netlify.app` name so the
address can change under us without breaking anything.

## Rollback

Set the registrar's nameservers back to:

    dns1.p07.nsone.net
    dns2.p07.nsone.net
    dns3.p07.nsone.net
    dns4.p07.nsone.net

Netlify DNS keeps the zone for a while after you stop pointing at it, so a
rollback inside a few days needs nothing but the nameserver change.
