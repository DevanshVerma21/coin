"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { buildWhatsAppUrl, buildItemInquiryMessage } from "@/lib/utils";
import Inquiry from "@/models/Inquiry";
import type { IInquiry, ActionResult, PaginatedResponse } from "@/types";

const inquirySchema = z.object({
  itemId: z.string(),
  itemTitle: z.string(),
  itemNumber: z.string(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  message: z.string().optional(),
});

function serialize(doc: unknown): IInquiry {
  const obj = JSON.parse(JSON.stringify(doc));
  return { ...obj, _id: obj._id?.toString() ?? obj.id };
}

export async function createInquiry(
  data: z.infer<typeof inquirySchema>
): Promise<ActionResult<{ whatsappUrl: string }>> {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  await connectDB();
  await Inquiry.create({
    ...parsed.data,
    whatsappNumber,
    status: "pending",
  });

  const itemUrl = `${siteUrl}/coins/${parsed.data.itemId}`;
  const message = parsed.data.message
    ? `${buildItemInquiryMessage(parsed.data.itemTitle, parsed.data.itemNumber, itemUrl)}\n\nNote: ${parsed.data.message}`
    : buildItemInquiryMessage(parsed.data.itemTitle, parsed.data.itemNumber, itemUrl);

  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, message);

  revalidatePath("/admin/inquiries");
  return { success: true, data: { whatsappUrl } };
}

export async function getInquiries(
  page = 1,
  limit = 20,
  status?: string
): Promise<PaginatedResponse<IInquiry>> {
  await connectDB();
  const filter = status ? { status } : {};

  const [docs, total] = await Promise.all([
    Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Inquiry.countDocuments(filter),
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

export async function updateInquiryStatus(
  id: string,
  status: "pending" | "contacted" | "closed"
): Promise<ActionResult> {
  await connectDB();
  await Inquiry.findByIdAndUpdate(id, { status });
  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  await connectDB();
  await Inquiry.findByIdAndDelete(id);
  revalidatePath("/admin/inquiries");
  return { success: true };
}
