"use server";

import { connectDB } from "@/lib/db";
import Item from "@/models/Item";

export async function getCatalogCounts(): Promise<{ coins: number; notes: number }> {
  await connectDB();
  const [coins, notes] = await Promise.all([
    Item.countDocuments({ type: "coin" }),
    Item.countDocuments({ type: "note" }),
  ]);
  return { coins, notes };
}
