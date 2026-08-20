import type { Metadata, Viewport } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
// Splash screen temporarily disabled — re-enable by uncommenting this import
// and the <Loader /> below. Hero detects the missing #loader and reveals
// itself on mount, so nothing else needs changing either way.
// import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import SiteLDJSON from "./components/SiteLDJSON";
import { SITE, siteUrl } from "@/lib/site";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

/**
 * Open Sans carries the whole site — body, headings, labels, everything.
 *
 * It previously ran alongside Bebas Neue for display and DM Sans for body, and
 * both of those are now gone: nothing outside the logo is set in anything else,
 * so loading them would be two font families downloaded for no one. The
 * upside of the consolidation is that this is now the only UI font on the page.
 *
 * It needs the full range that the two retired faces covered between them —
 * 300 for body copy, which `body` sets as its default, up through 700 for
 * headings that used to lean on a condensed display face for their weight.
 */
const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-open-sans",
});

// The logo is the one exception. Its artwork is set in Playfair, and only
// eleven letters are, so it stays pinned to the single weight the lockup uses
// rather than loading a range.
const playfairDisplay = Playfair_Display({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-playfair-display",
  /*
   * Not preloaded. next/font preloads every family by default, which put a
   * 42KB face at the front of the queue on every page — ahead of the hero
   * poster that defines the largest contentful paint, on a connection where
   * 42KB is a third of a second. Playfair sets headings, not the first thing
   * anyone reads, and `display: swap` plus next/font's metric-adjusted
   * fallback means it arrives without moving anything (CLS stays at 0).
   */
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — Luxury Watches & Bespoke Jewellery, Hatton Garden`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  applicationName: SITE.name,
  keywords: [
    "luxury watches London",
    "Rolex Hatton Garden",
    "Patek Philippe dealer",
    "Audemars Piguet London",
    "bespoke engagement rings",
    "Hatton Garden jeweller",
    "diamond pendants London",
  ],
  alternates: { canonical: siteUrl("/") },
  /*
   * All three of these used to point at the wide rose gold lockup SVG. Two
   * problems with that. A 2187×1260 lockup shrunk into a 16px tab is an
   * illegible smear, and Safari and Android ignore SVG for the touch icon
   * outright, so the home-screen tile fell back to a screenshot. Worse,
   * nothing was serving /favicon.ico at all, so every browser's automatic
   * request for it 404'd — which is what Lighthouse was reporting as a console
   * error on every single page.
   *
   * These are rendered from the AD monogram (public/Logo), which reads at tab
   * size in a way the full lockup never could. See docs/seo.md to regenerate.
   */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl("/"),
    siteName: SITE.name,
    title: `${SITE.name} — Luxury Watches & Bespoke Jewellery`,
    description: SITE.tagline,
    images: [
      {
        url: siteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: `${SITE.name} — bespoke jewellery and luxury watches, Hatton Garden`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Luxury Watches & Bespoke Jewellery`,
    description: SITE.tagline,
    images: [siteUrl(DEFAULT_OG_IMAGE)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#131010",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${openSans.variable} ${playfairDisplay.variable}`}
    >
      {/*
        Browser extensions write attributes onto <body> before React hydrates —
        ColorZilla adds `cz-shortcut-listen`, password managers and grammar
        tools do similar — and React then reports a hydration mismatch it can
        never reconcile, because the markup genuinely differs from what the
        server sent. In development that surfaces as a full-screen error
        overlay, which makes the page look broken when nothing is wrong with it.

        `suppressHydrationWarning` is scoped to this element's own attributes
        and does not extend to its children, so our own markup is still checked
        as strictly as before. This is the case the flag exists for.
      */}
      <body suppressHydrationWarning>
        <SiteLDJSON />
        <CustomCursor />
        {/* <Loader /> */}
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
