import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getItems } from "@/actions/items";
import { formatPrice, formatDate } from "@/lib/utils";
import { DeleteItemButton } from "@/components/admin/delete-item-button";
import { ToggleSoldButton } from "@/components/admin/toggle-sold-button";
import type { CatalogFilters } from "@/types";

export const metadata: Metadata = { title: "Items — Admin" };

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AdminItemsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: CatalogFilters = {
    type: params.type as CatalogFilters["type"],
    search: params.search,
    sort: "newest",
    page: params.page ? Number(params.page) : 1,
    limit: 20,
  };

  const { data: items, meta } = await getItems(filters);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Items</h1>
          <p className="text-sm text-muted-foreground">{meta.total} items total</p>
        </div>
        <Link href="/admin/items/new">
          <Button variant="gold" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { label: "All", value: "" },
          { label: "Coins", value: "coin" },
          { label: "Notes", value: "note" },
        ].map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/items${tab.value ? `?type=${tab.value}` : ""}`}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              (params.type ?? "") === tab.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Items table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Item</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Year</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Added</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{item.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">#{item.itemNumber}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {item.year}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell font-semibold text-primary">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.featured && <Badge variant="featured" className="text-[10px]">Featured</Badge>}
                        {item.sold && <Badge variant="sold" className="text-[10px]">Sold</Badge>}
                        {!item.featured && !item.sold && (
                          <Badge variant="secondary" className="text-[10px]">Active</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/${item.type === "coin" ? "coins" : "notes"}/${item.slug}`}
                          target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
                          aria-label="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <ToggleSoldButton id={item._id} sold={item.sold} />
                        <Link
                          href={`/admin/items/${item._id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <DeleteItemButton id={item._id} title={item.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border text-sm text-muted-foreground">
            <span>
              Page {meta.page} of {meta.totalPages}
            </span>
            <div className="flex gap-2">
              {meta.hasPrev && (
                <Link
                  href={`/admin/items?${params.type ? `type=${params.type}&` : ""}page=${meta.page - 1}`}
                  className="px-3 py-1 rounded border border-border hover:bg-muted transition-colors text-xs"
                >
                  Previous
                </Link>
              )}
              {meta.hasNext && (
                <Link
                  href={`/admin/items?${params.type ? `type=${params.type}&` : ""}page=${meta.page + 1}`}
                  className="px-3 py-1 rounded border border-border hover:bg-muted transition-colors text-xs"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
