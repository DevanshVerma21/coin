import type { Metadata } from "next";
import { Suspense } from "react";
import { ItemGrid } from "@/components/catalog/item-grid";
import { Pagination } from "@/components/catalog/pagination";
import { Input } from "@/components/ui/input";
import { getItems } from "@/actions/items";
import type { CatalogFilters } from "@/types";
import { Search } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Search",
  description: "Search our collection of rare antique coins and banknotes.",
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const page = params.page ? Number(params.page) : 1;

  const filters: CatalogFilters = {
    search: query || undefined,
    page,
    limit: 24,
    sort: "newest",
  };

  const { data: items, meta } = await getItems(filters);

  return (
    <div className="container py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Search Collection
        </h1>

        <form method="GET" action="/search">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search by title, year, item number…"
              className="pl-9 h-11 text-base"
              autoFocus
            />
          </div>
        </form>
      </div>

      {query && (
        <p className="text-sm text-muted-foreground mb-4">
          {meta.total} result{meta.total !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      {!query ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Enter a search term to find items</p>
        </div>
      ) : (
        <>
          <ItemGrid items={items} />
          <Suspense>
            <Pagination meta={meta} />
          </Suspense>
        </>
      )}
    </div>
  );
}
