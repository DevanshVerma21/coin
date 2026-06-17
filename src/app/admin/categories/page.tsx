import type { Metadata } from "next";
import { getCategories } from "@/actions/categories";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground">{categories.length} categories total</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
