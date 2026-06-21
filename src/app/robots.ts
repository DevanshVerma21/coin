import type { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ntik-2hwf.onrender.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/coins", "/notes"],
        disallow: ["/admin/", "/api/", "/account", "/signin", "/reset-password", "/forgot-password"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
