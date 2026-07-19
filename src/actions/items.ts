"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { generateSlug, generateItemNumber } from "@/lib/utils";
import Item from "@/models/Item";
import Category from "@/models/Category";
import type { IItem, IItemPopulated, CatalogFilters, ActionResult, PaginatedResponse } from "@/types";

const provenanceEntrySchema = z.object({
  period: z.string().min(1),
  description: z.string().min(1),
});

const itemSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(["coin", "note"]),
  year: z.string().min(1).max(20),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
  frontImage: z.string().url(),
  backImage: z.string().url().optional().or(z.literal("")),
  additionalImages: z.array(z.string().url()).default([]),
  categories: z.array(z.string()).default([]),
  featured: z.coerce.boolean().default(false),
  featuredUntil: z.string().optional(),
  sold: z.coerce.boolean().default(false),
  // Archival fields
  denomination: z.string().optional(),
  composition: z.string().optional(),
  weight: z.string().optional(),
  mint: z.string().optional(),
  diameter: z.string().optional(),
  rarity: z.enum(["R", "RR", "RRR", "RRRR"]).optional(),
  grade: z.string().optional(),
  gradeType: z.string().optional(),
  historicalContext: z.string().optional(),
  provenance: z.array(provenanceEntrySchema).default([]),
});

function serialize(doc: unknown): IItem {
  const obj = JSON.parse(JSON.stringify(doc));
  return {
    ...obj,
    _id: obj._id?.toString() ?? obj.id,
    categories: Array.isArray(obj.categories)
      ? obj.categories.map((c: unknown) =>
          typeof c === "object" && c !== null && "_id" in c
            ? { ...(c as object), _id: (c as { _id: unknown })._id?.toString() }
            : c
        )
      : [],
  };
}

// Fields required for catalog card display. Excludes description, historicalContext,
// provenance, and other archival detail that is only needed on the item detail page.
const CATALOG_PROJECTION =
  "itemNumber slug title type year price frontImage categories sold featured rarity createdAt";

export async function getItems(
  filters: CatalogFilters = {}
): Promise<PaginatedResponse<IItemPopulated>> {
  await connectDB();

  const {
    type,
    category,
    year,
    minPrice,
    maxPrice,
    featured,
    sold,
    search,
    sort = "newest",
    page = 1,
    limit = 24,
  } = filters;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = {};
  if (type) query.type = type;
  if (year) query.year = year;
  if (featured !== undefined) query.featured = featured;
  if (sold !== undefined) query.sold = sold;
  if (category) query.categories = category;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }
  if (search) query.$text = { $search: search };

  const sortMap: Record<string, [string, 1 | -1][]> = {
    newest: [["createdAt", -1]],
    oldest: [["createdAt", 1]],
    "price-asc": [["price", 1]],
    "price-desc": [["price", -1]],
    "year-asc": [["year", 1]],
    "year-desc": [["year", -1]],
  };

  const [docs, total] = await Promise.all([
    Item.find(query)
      .select(CATALOG_PROJECTION)
      .populate("categories", "name slug type")
      .sort(sortMap[sort] ?? [["createdAt", -1]])
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Item.countDocuments(query),
  ]);

  return {
    data: docs.map(serialize) as unknown as IItemPopulated[],
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

export async function getFeaturedItems(limit = 8): Promise<IItemPopulated[]> {
  await connectDB();
  const now = new Date();
  const docs = await Item.find({
    featured: true,
    // sold items are still shown — a sold piece is still worth showcasing
    $or: [{ featuredUntil: { $gt: now } }, { featuredUntil: null }],
  })
    .select(CATALOG_PROJECTION)
    .populate("categories", "name slug type")
    .sort([["createdAt", -1]])
    .limit(limit)
    .lean();
  return docs.map(serialize) as unknown as IItemPopulated[];
}

export async function getItemBySlug(slug: string): Promise<IItemPopulated | null> {
  await connectDB();
  const doc = await Item.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("categories")
    .lean();
  return doc ? (serialize(doc) as unknown as IItemPopulated) : null;
}

export async function getItemById(id: string): Promise<IItem | null> {
  await connectDB();
  const doc = await Item.findById(id).lean();
  return doc ? serialize(doc) : null;
}

export async function getRelatedItems(
  itemId: string,
  categories: string[],
  type: "coin" | "note",
  limit = 3
): Promise<IItemPopulated[]> {
  await connectDB();
  const docs = await Item.find({
    _id: { $ne: itemId },
    type,
    $or: [
      { categories: { $in: categories } },
      { type },
    ],
  })
    .select(CATALOG_PROJECTION)
    .populate("categories", "name slug type")
    .sort([["featured", -1], ["createdAt", -1]])
    .limit(limit)
    .lean();
  return docs.map(serialize) as unknown as IItemPopulated[];
}

function parseFormData(formData: FormData) {
  const additionalImagesRaw = formData.getAll("additionalImages") as string[];
  const categoriesRaw = formData.getAll("categories") as string[];

  // Parse provenance from JSON string
  let provenance: Array<{ period: string; description: string }> = [];
  try {
    const raw = formData.get("provenance") as string;
    if (raw) provenance = JSON.parse(raw);
  } catch {
    provenance = [];
  }

  return {
    title: formData.get("title"),
    type: formData.get("type"),
    year: formData.get("year"),
    description: formData.get("description"),
    price: formData.get("price"),
    frontImage: formData.get("frontImage"),
    backImage: formData.get("backImage") || undefined,
    additionalImages: additionalImagesRaw.filter(Boolean),
    categories: categoriesRaw,
    featured: formData.get("featured") === "true",
    featuredUntil: formData.get("featuredUntil") || undefined,
    sold: formData.get("sold") === "true",
    denomination: formData.get("denomination") || undefined,
    composition: formData.get("composition") || undefined,
    weight: formData.get("weight") || undefined,
    mint: formData.get("mint") || undefined,
    diameter: formData.get("diameter") || undefined,
    rarity: formData.get("rarity") || undefined,
    grade: formData.get("grade") || undefined,
    gradeType: formData.get("gradeType") || undefined,
    historicalContext: formData.get("historicalContext") || undefined,
    provenance,
  };
}

export async function createItem(formData: FormData): Promise<ActionResult<IItem>> {
  const raw = parseFormData(formData);
  const parsed = itemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await connectDB();
  const count = await Item.countDocuments({ type: parsed.data.type });
  const itemNumber = generateItemNumber(parsed.data.type, count + 1);
  const slug = generateSlug(`${parsed.data.title}-${itemNumber}`);

  const doc = await Item.create({
    ...parsed.data,
    itemNumber,
    slug,
    backImage: parsed.data.backImage || undefined,
  });

  await Category.updateMany(
    { _id: { $in: parsed.data.categories } },
    { $inc: { itemCount: 1 } }
  );

  revalidatePath("/admin/items");
  revalidatePath("/coins");
  revalidatePath("/notes");
  revalidatePath("/");
  return { success: true, data: serialize(doc) };
}

export async function updateItem(
  id: string,
  formData: FormData
): Promise<ActionResult<IItem>> {
  const raw = parseFormData(formData);
  const parsed = itemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await connectDB();
  const existing = await Item.findById(id);
  if (!existing) return { success: false, error: "Item not found" };

  const oldCats = existing.categories.map(String);
  const newCats = parsed.data.categories;
  const removed = oldCats.filter((c) => !newCats.includes(c));
  const added = newCats.filter((c) => !oldCats.includes(c));

  if (removed.length) await Category.updateMany({ _id: { $in: removed } }, { $inc: { itemCount: -1 } });
  if (added.length) await Category.updateMany({ _id: { $in: added } }, { $inc: { itemCount: 1 } });

  const doc = await Item.findByIdAndUpdate(
    id,
    { ...parsed.data, backImage: parsed.data.backImage || undefined },
    { new: true }
  ).lean();

  revalidatePath("/admin/items");
  revalidatePath(`/admin/items/${id}`);
  revalidatePath(`/coins/${existing.slug}`);
  revalidatePath(`/notes/${existing.slug}`);
  revalidatePath("/coins");
  revalidatePath("/notes");
  revalidatePath("/");
  return { success: true, data: serialize(doc) };
}

export async function deleteItem(id: string): Promise<ActionResult> {
  await connectDB();
  const doc = await Item.findByIdAndDelete(id);
  if (!doc) return { success: false, error: "Item not found" };
  await Category.updateMany({ _id: { $in: doc.categories } }, { $inc: { itemCount: -1 } });
  revalidatePath("/admin/items");
  revalidatePath("/coins");
  revalidatePath("/notes");
  revalidatePath("/");
  return { success: true };
}

export async function toggleFeatured(id: string): Promise<ActionResult> {
  await connectDB();
  const doc = await Item.findById(id);
  if (!doc) return { success: false, error: "Item not found" };

  // Enforce a maximum of 3 featured items
  if (!doc.featured) {
    const featuredCount = await Item.countDocuments({ featured: true });
    if (featuredCount >= 3) {
      return { success: false, error: "Maximum of 3 featured items allowed. Remove one before adding another." };
    }
  }

  await Item.findByIdAndUpdate(id, { featured: !doc.featured });
  revalidatePath("/admin/items");
  revalidatePath("/admin/featured");
  revalidatePath("/");
  return { success: true };
}

export async function toggleSold(id: string): Promise<ActionResult> {
  await connectDB();
  const doc = await Item.findById(id);
  if (!doc) return { success: false, error: "Item not found" };
  await Item.findByIdAndUpdate(id, { sold: !doc.sold });
  revalidatePath("/admin/items");
  return { success: true };
}

export async function getItemYears(type?: "coin" | "note"): Promise<string[]> {
  await connectDB();
  const filter = type ? { type } : {};
  const years = await Item.distinct("year", filter);
  return (years as string[]).sort((a, b) => Number(b) - Number(a));
}
