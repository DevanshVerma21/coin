import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 7 days on the server
    minimumCacheTTL: 604800,
    // Limit device sizes to avoid generating too many variants
    deviceSizes: [640, 828, 1080, 1280],
    imageSizes: [32, 64, 128, 256],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Optimise CSS output
    optimizeCss: true,
  },

  // Compress responses
  compress: true,

  async headers() {
    return [
      // ── Security headers on every response ─────────────────────────────────
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "X-XSS-Protection",         value: "1; mode=block" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
        ],
      },
      // ── Immutable cache for Next.js static chunks (JS/CSS bundles) ─────────
      // These have content-hash filenames — safe to cache forever
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // ── Long cache for public static assets (images, fonts, favicon) ───────
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2|ttf|otf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      // ── Next.js optimised images — cache for 7 days ─────────────────────────
      {
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" },
        ],
      },
    ];
  },
};

export default nextConfig;
