"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { uploadImageToStorage, deleteFromStorage } from "@/lib/storage";
import MediaAsset from "@/models/MediaAsset";
import type { IMediaAsset, ActionResult, PaginatedResponse } from "@/types";

function serialize(doc: unknown): IMediaAsset {
  const obj = JSON.parse(JSON.stringify(doc));
  return { ...obj, _id: obj._id?.toString() ?? obj.id };
}

export async function getMediaAssets(
  page = 1,
  limit = 24,
  search?: string
): Promise<PaginatedResponse<IMediaAsset>> {
  await connectDB();

  const filter = search
    ? { $or: [{ originalName: { $regex: search, $options: "i" } }, { tags: search }] }
    : {};

  const [docs, total] = await Promise.all([
    MediaAsset.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    MediaAsset.countDocuments(filter),
  ]);

  return {
    data: docs.map(serialize),
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

export async function uploadMedia(formData: FormData): Promise<ActionResult<IMediaAsset>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;
  if (!file) return { success: false, error: "No file provided" };

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed" };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { success: false, error: "File size must be under 10MB" };
  }

  try {
    await connectDB();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(
      `[media] Upload started: "${file.name}" (${(file.size / 1024).toFixed(1)} KB, ${file.type}) by ${session.user.email}`
    );

    const result = await uploadImageToStorage(buffer, file.name, file.type);

    const tagsRaw = formData.get("tags") as string | null;
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

    const doc = await MediaAsset.create({
      ...result,
      originalName: file.name,
      uploadedBy: session.user.email,
      tags,
    });

    console.log(`[media] Upload complete: "${file.name}" → ${result.url}`);

    revalidatePath("/admin/media");
    return { success: true, data: serialize(doc) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown upload error";
    console.error(`[media] Upload FAILED for "${file.name}":`, err);
    return { success: false, error: `Upload failed: ${message}` };
  }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  await connectDB();
  const doc = await MediaAsset.findByIdAndDelete(id);
  if (!doc) return { success: false, error: "Asset not found" };

  await deleteFromStorage(doc.gcsPath);
  revalidatePath("/admin/media");
  return { success: true };
}

export async function updateMediaTags(id: string, tags: string[]): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  await connectDB();
  await MediaAsset.findByIdAndUpdate(id, { tags });
  revalidatePath("/admin/media");
  return { success: true };
}
