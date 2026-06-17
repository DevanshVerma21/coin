import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ItemForm } from "@/components/admin/item-form";
import { getItemById } from "@/actions/items";
import { getCategories } from "@/actions/categories";

export const metadata: Metadata = { title: "Edit Item — Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: PageProps) {
  const { id } = await params;
  const [item, categories] = await Promise.all([getItemById(id), getCategories()]);

  if (!item) notFound();

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
          <h1 className="font-serif text-2xl font-bold text-foreground">Edit Item</h1>
          <p className="text-sm text-muted-foreground font-mono">#{item.itemNumber}</p>
        </div>
      </div>

      <ItemForm item={item} categories={categories} mode="edit" />
    </div>
  );
}
