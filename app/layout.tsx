import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import SiteLDJSON from "./components/SiteLDJSON";
import { SITE, siteUrl } from "@/lib/site";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const dmSans = DM_Sans({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
  alternates: { canonical: siteUrl() },
  icons: {
    icon: "/alpoe-london-logo-transparent.svg",
    shortcut: "/alpoe-london-logo-transparent.svg",
    apple: "/alpoe-london-logo-transparent.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl(),
    siteName: SITE.name,
    title: `${SITE.name} — Luxury Watches & Bespoke Jewellery`,
    description: SITE.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Luxury Watches & Bespoke Jewellery`,
    description: SITE.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body>
        <SiteLDJSON />
        <CustomCursor />
        <Loader />
        {children}
      </body>
    </html>
  );
}
