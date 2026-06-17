import type { Metadata } from "next";
import { Suspense } from "react";
import { ItemGrid } from "@/components/catalog/item-grid";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Pagination } from "@/components/catalog/pagination";
import { getItems, getItemYears } from "@/actions/items";
import { getCategories } from "@/actions/categories";
import type { CatalogFilters as Filters } from "@/types";

export const metadata: Metadata = {
  title: "Antique Coins Collection",
  description:
    "Browse our curated collection of rare antique coins — Mughal, British India, Republic India and more.",
};

// ISR: cache catalog for up to 10 minutes, rebuild in background on next request
export const revalidate = 600;

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function CoinsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: Filters = {
    type: "coin",
    search: params.search,
    category: params.category,
    year: params.year,
    sort: params.sort as Filters["sort"],
    page: params.page ? Number(params.page) : 1,
    limit: 24,
  };

  const [{ data: items, meta }, categories, years] = await Promise.all([
    getItems(filters),
    getCategories("coin"),
    getItemYears("coin"),
  ]);

  return (
    <div className="min-h-screen" style={{ background: "#fff8f1" }}>
      {/* Page hero banner */}
      <div style={{ background: "#f0e1c3", borderBottom: "1px solid #d0c5af" }}>
        <div className="container py-8 sm:py-10">
          <p className="label-caps mb-2" style={{ color: "#735c00" }}>
            Archive
          </p>
          <h1
            className="font-serif font-bold"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "#221b08" }}
          >
            Antique Coins
          </h1>
          <p
            className="mt-2 text-[15px]"
            style={{ fontFamily: "var(--font-eb-garamond)", color: "#4d4635" }}
          >
            {meta.total} piece{meta.total !== 1 ? "s" : ""} in the archive
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters */}
        <div className="mb-6">
          <Suspense>
            <CatalogFilters categories={categories} years={years} />
          </Suspense>
        </div>

        <ItemGrid items={items} />

        <Suspense>
          <Pagination meta={meta} />
        </Suspense>
      </div>
    </div>
  );
}
