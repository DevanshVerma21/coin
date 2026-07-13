"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import { buildWhatsAppUrl, buildItemInquiryMessage } from "@/lib/utils";
import Inquiry from "@/models/Inquiry";
import type { IInquiry, ActionResult, PaginatedResponse } from "@/types";

const inquirySchema = z.object({
  itemId: z.string(),
  itemTitle: z.string(),
  itemNumber: z.string(),
  itemSlug: z.string(),
  itemType: z.enum(["coin", "note"]),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  message: z.string().optional(),
});

function serialize(doc: unknown): IInquiry {
  const obj = JSON.parse(JSON.stringify(doc));
  return { ...obj, _id: obj._id?.toString() ?? obj.id };
}

// ─── Rate-limit constants ──────────────────────────────────────────────────
const DAILY_LIMIT       = 4;          // max inquiries per user per 24 h
const COOLDOWN_MS       = 5 * 60 * 1000;  // 5 min between any two requests
const WINDOW_MS         = 24 * 60 * 60 * 1000; // rolling 24-hour window

export async function createInquiry(
  data: z.infer<typeof inquirySchema>
): Promise<ActionResult<{ whatsappUrl: string }>> {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Require an authenticated session — can't be spoofed from the client.
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "You must be signed in to send an inquiry." };
  }

  const userEmail  = session.user.email;
  const userName   = session.user.name ?? parsed.data.userName;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!;
  const siteUrl        = process.env.NEXT_PUBLIC_SITE_URL!;

  await connectDB();

  // ── Rate limiting — three checks in one parallel round-trip ──────────────
  const now           = Date.now();
  const windowStart   = new Date(now - WINDOW_MS);
  const cooldownStart = new Date(now - COOLDOWN_MS);

  const [dailyCount, tooSoon, alreadyAsked] = await Promise.all([
    // 1. Has this user hit the daily cap?
    Inquiry.countDocuments({ userEmail, createdAt: { $gte: windowStart } }),

    // 2. Did they send one in the last 5 minutes?
    Inquiry.exists({ userEmail, createdAt: { $gte: cooldownStart } }),

    // 3. Did they already inquire about THIS item today?
    Inquiry.exists({ userEmail, itemId: parsed.data.itemId, createdAt: { $gte: windowStart } }),
  ]);

  if (dailyCount >= DAILY_LIMIT) {
    return {
      success: false,
      error: `Daily limit reached — you can send up to ${DAILY_LIMIT} inquiries per day. Please try again tomorrow.`,
    };
  }
  if (tooSoon) {
    return {
      success: false,
      error: "Please wait 5 minutes before sending another inquiry.",
    };
  }
  if (alreadyAsked) {
    return {
      success: false,
      error: "You have already sent an inquiry for this item today.",
    };
  }
  // ─────────────────────────────────────────────────────────────────────────

  await Inquiry.create({
    itemId:    parsed.data.itemId,
    itemTitle: parsed.data.itemTitle,
    itemNumber: parsed.data.itemNumber,
    userName,
    userEmail,
    whatsappNumber,
    status: "pending",
  });

  const itemPath = parsed.data.itemType === "coin" ? "coins" : "notes";
  const itemUrl  = `${siteUrl}/${itemPath}/${parsed.data.itemSlug}`;
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
  if (status === "closed") {
    // Closing = resolved; delete immediately so the inbox stays clean.
    await Inquiry.findByIdAndDelete(id);
  } else {
    await Inquiry.findByIdAndUpdate(id, { status });
  }
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  await connectDB();
  await Inquiry.findByIdAndDelete(id);
  revalidatePath("/admin/inquiries");
  return { success: true };
}
