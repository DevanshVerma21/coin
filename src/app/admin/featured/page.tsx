import type { Metadata } from "next";
import { getItems } from "@/actions/items";
import { FeaturedManager } from "@/components/admin/featured-manager";

export const metadata: Metadata = { title: "Featured Items — Admin" };

export default async function AdminFeaturedPage() {
  const { data: featuredItems } = await getItems({ featured: true, limit: 50, sort: "newest" });
  const { data: allItems } = await getItems({ featured: false, sold: false, limit: 100, sort: "newest" });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Featured Items</h1>
        <p className="text-sm text-muted-foreground">
          {featuredItems.length} item{featuredItems.length !== 1 ? "s" : ""} currently featured
        </p>
      </div>
      <FeaturedManager featuredItems={featuredItems} availableItems={allItems} />
    </div>
  );
}
