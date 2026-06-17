"use server";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { sendPasswordResetEmail, sendPasswordChangedEmail } from "@/lib/email";
import type { ActionResult } from "@/types";

const ONE_HOUR = 60 * 60 * 1000;

// Generic success message — never reveal whether an email exists (security)
const SAFE_MSG =
  "If an account with that email exists, a password reset link has been sent. Check your inbox (and spam folder).";

// ── Request a password reset ─────────────────────────────────────────────────
export async function requestPasswordReset(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  const email = (formData.get("email") as string ?? "").toLowerCase().trim();

  if (!z.string().email().safeParse(email).success) {
    return { success: false, error: "Please enter a valid email address." };
  }

  await connectDB();

  // Look up user — if not found, still return safe message
  const user = await User.findOne({ email });
  if (!user) return { success: true, data: { message: SAFE_MSG } };

  // Invalidate any existing unused tokens for this email
  await PasswordReset.updateMany(
    { email, used: false },
    { $set: { used: true } }
  );

  // Generate cryptographically secure 64-char hex token
  const rawToken = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + ONE_HOUR);

  await PasswordReset.create({ email, token: rawToken, expires, used: false });

  try {
    await sendPasswordResetEmail(email, rawToken);
  } catch (err) {
    console.error("[password-reset] email send failed:", err);
    return { success: false, error: "Failed to send email. Please try again later." };
  }

  return { success: true, data: { message: SAFE_MSG } };
}

// ── Validate a token (called when user lands on /reset-password?token=xxx) ──
export async function validateResetToken(
  token: string
): Promise<{ valid: boolean; email?: string; error?: string }> {
  if (!token || token.length !== 64) {
    return { valid: false, error: "Invalid or malformed reset link." };
  }

  await connectDB();

  const record = await PasswordReset.findOne({ token, used: false });
  if (!record) {
    return { valid: false, error: "This reset link is invalid or has already been used." };
  }

  if (record.expires < new Date()) {
    return { valid: false, error: "This reset link has expired. Please request a new one." };
  }

  return { valid: true, email: record.email };
}

// ── Set the new password ─────────────────────────────────────────────────────
export async function resetPassword(
  formData: FormData
): Promise<ActionResult> {
  const token = (formData.get("token") as string ?? "").trim();
  const password = (formData.get("password") as string ?? "");
  const confirm = (formData.get("confirmPassword") as string ?? "");

  // Validate password strength
  const pwResult = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .safeParse(password);

  if (!pwResult.success) {
    return { success: false, error: pwResult.error.issues[0].message };
  }

  if (password !== confirm) {
    return { success: false, error: "Passwords do not match." };
  }

  await connectDB();

  const record = await PasswordReset.findOne({ token, used: false });
  if (!record || record.expires < new Date()) {
    return { success: false, error: "Reset link is invalid or expired. Please request a new one." };
  }

  // Hash with bcrypt (12 rounds — OWASP recommended minimum)
  const hashed = await bcrypt.hash(password, 12);

  // Update user password
  const updated = await User.findOneAndUpdate(
    { email: record.email },
    { $set: { password: hashed, updatedAt: new Date() } }
  );

  if (!updated) {
    return { success: false, error: "Account not found." };
  }

  // Mark token as used
  await PasswordReset.findByIdAndUpdate(record._id, { $set: { used: true } });

  // Send confirmation email (fire-and-forget — don't block the response)
  sendPasswordChangedEmail(record.email).catch((e) =>
    console.error("[password-reset] confirmation email failed:", e)
  );

  return { success: true };
}
