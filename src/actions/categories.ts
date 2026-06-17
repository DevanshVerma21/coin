"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import Category from "@/models/Category";
import type { ICategory, ActionResult } from "@/types";

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["coin", "note"]),
  description: z.string().optional(),
});

function serialize(doc: unknown): ICategory {
  const obj = JSON.parse(JSON.stringify(doc));
  return { ...obj, _id: obj._id?.toString() ?? obj.id };
}

export async function getCategories(type?: "coin" | "note"): Promise<ICategory[]> {
  await connectDB();
  const filter = type ? { type } : {};
  const docs = await Category.find(filter).sort({ name: 1 }).lean();
  return docs.map(serialize);
}

export async function getCategoryBySlug(slug: string): Promise<ICategory | null> {
  await connectDB();
  const doc = await Category.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

export async function createCategory(
  formData: FormData
): Promise<ActionResult<ICategory>> {
  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    description: formData.get("description") || undefined,
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await connectDB();
  const slug = generateSlug(parsed.data.name);
  const existing = await Category.findOne({ slug });
  if (existing) {
    return { success: false, error: "A category with this name already exists" };
  }

  const doc = await Category.create({ ...parsed.data, slug });
  revalidatePath("/admin/categories");
  revalidatePath("/coins");
  revalidatePath("/notes");
  return { success: true, data: serialize(doc) };
}

export async function updateCategory(
  id: string,
  formData: FormData
): Promise<ActionResult<ICategory>> {
  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    description: formData.get("description") || undefined,
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await connectDB();
  const doc = await Category.findByIdAndUpdate(
    id,
    { ...parsed.data, slug: generateSlug(parsed.data.name) },
    { new: true }
  ).lean();

  if (!doc) return { success: false, error: "Category not found" };
  revalidatePath("/admin/categories");
  return { success: true, data: serialize(doc) };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await connectDB();
  await Category.findByIdAndDelete(id);
  revalidatePath("/admin/categories");
  return { success: true };
}
