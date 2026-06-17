"use server";

import { connectDB } from "@/lib/db";
import Item from "@/models/Item";
import Category from "@/models/Category";
import MediaAsset from "@/models/MediaAsset";
import Inquiry from "@/models/Inquiry";
import type { DashboardStats } from "@/types";

function serializeItem(doc: unknown) {
  const obj = JSON.parse(JSON.stringify(doc));
  return { ...obj, _id: obj._id?.toString() };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const [
    totalItems,
    totalCoins,
    totalNotes,
    featuredItems,
    soldItems,
    totalCategories,
    totalMedia,
    totalInquiries,
    pendingInquiries,
    recentItems,
    recentInquiries,
  ] = await Promise.all([
    Item.countDocuments(),
    Item.countDocuments({ type: "coin" }),
    Item.countDocuments({ type: "note" }),
    Item.countDocuments({ featured: true }),
    Item.countDocuments({ sold: true }),
    Category.countDocuments(),
    MediaAsset.countDocuments(),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "pending" }),
    Item.find().sort({ createdAt: -1 }).limit(5).lean(),
    Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    totalItems,
    totalCoins,
    totalNotes,
    featuredItems,
    soldItems,
    totalCategories,
    totalMedia,
    totalInquiries,
    pendingInquiries,
    recentItems: recentItems.map(serializeItem),
    recentInquiries: recentInquiries.map(serializeItem),
  };
}
