import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Item from "@/models/Item";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ntik-2hwf.onrender.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,               lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/coins`,          lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/notes`,          lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/signin`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/forgot-password`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
  ];

  // Dynamic item routes
  try {
    await connectDB();
    const items = await Item.find({}, { slug: 1, type: 1, updatedAt: 1 }).lean();
    const dynamicRoutes: MetadataRoute.Sitemap = items.map((item) => ({
      url: `${BASE}/${item.type === "coin" ? "coins" : "notes"}/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt as Date) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    // If DB is unavailable at build time, return static routes only
    return staticRoutes;
  }
}
