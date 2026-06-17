import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ItemForm } from "@/components/admin/item-form";
import { getCategories } from "@/actions/categories";

export const metadata: Metadata = { title: "Add Item — Admin" };

export default async function NewItemPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/items"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Add New Item</h1>
          <p className="text-sm text-muted-foreground">Create a new coin or banknote listing</p>
        </div>
      </div>

      <ItemForm categories={categories} mode="create" />
    </div>
  );
}
