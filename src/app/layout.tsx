import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { NavProgress } from "@/components/layout/nav-progress";
import "./globals.css";

const playfair = localFont({
  src: [
    { path: "../../public/fonts/playfair_display_600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/playfair_display_700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-playfair",
  display: "swap",
});

const ebGaramond = localFont({
  src: [
    { path: "../../public/fonts/eb_garamond_400.woff2",        weight: "400", style: "normal" },
    { path: "../../public/fonts/eb_garamond_500.woff2",        weight: "500", style: "normal" },
    { path: "../../public/fonts/eb_garamond_400_italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/eb_garamond_500_italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-eb-garamond",
  display: "swap",
});

const publicSans = localFont({
  src: [
    { path: "../../public/fonts/public_sans_400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/public_sans_500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/public_sans_600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-public-sans",
  display: "swap",
});

// NEXT_PUBLIC_SITE_URL must be set in production.
// Falls back to the Render URL so OG/canonical URLs are never localhost in prod.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ntik-2hwf.onrender.com").replace(/\/$/, "");
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "NTIK Heritage Marketplace";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    "Discover rare antique coins and banknotes. A curated heritage numismatic collection with WhatsApp inquiry.",
  keywords: [
    "antique coins",
    "rare coins",
    "numismatic",
    "banknotes",
    "heritage coins",
    "coin collection",
    "Mughal coins",
    "British India coins",
  ],
  authors: [{ name: "NTIK Heritage" }],
  creator: "NTIK Heritage",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName,
    title: siteName,
    description: "Discover rare antique coins and banknotes.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Discover rare antique coins and banknotes.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#d4af37",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${ebGaramond.variable} ${publicSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Preconnect to Cloudinary CDN for LCP images */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <NavProgress />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
