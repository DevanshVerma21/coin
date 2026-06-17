import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { validateResetToken } from "@/actions/password-reset";
import { ResetPasswordForm } from "./_reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password — NTIK Heritage Archive",
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  const validation = token
    ? await validateResetToken(token)
    : { valid: false, error: "No reset token provided." };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#f5f0e8" }}
    >
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link
            href="/"
            className="font-serif font-bold text-[28px] tracking-[0.08em] mb-2 transition-opacity hover:opacity-60"
            style={{ color: "#1a1208" }}
          >
            NTIK
          </Link>
          <p
            className="tracking-[0.16em] uppercase"
            style={{ fontFamily: "var(--font-public-sans)", fontSize: "10px", color: "#8a7560", fontWeight: 500 }}
          >
            Heritage Numismatic Archive
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(166,148,120,0.35)",
            borderRadius: "2px",
            boxShadow: "0 4px 24px rgba(26,18,8,0.07)",
          }}
        >
          <div className="px-7 py-6 text-center" style={{ borderBottom: "1px solid rgba(166,148,120,0.2)" }}>
            <h1 className="font-serif font-semibold text-[22px] mb-1" style={{ color: "#1a1208" }}>
              Set New Password
            </h1>
            <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-eb-garamond)", color: "#6b5c45" }}>
              Choose a strong password for your account.
            </p>
          </div>

          <div className="px-7 py-6">
            {validation.valid ? (
              <ResetPasswordForm token={token!} />
            ) : (
              <div className="space-y-4">
                <div
                  className="flex items-start gap-2.5 px-3.5 py-3 rounded-sm"
                  style={{ background: "rgba(186,26,26,0.06)", border: "1px solid rgba(186,26,26,0.2)" }}
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#ba1a1a" }} />
                  <p className="text-[13px]" style={{ fontFamily: "var(--font-public-sans)", color: "#ba1a1a" }}>
                    {validation.error}
                  </p>
                </div>
                <Link
                  href="/forgot-password"
                  className="flex items-center justify-center w-full h-11 text-[12px] font-semibold tracking-[0.12em] uppercase transition-all hover:opacity-90"
                  style={{ fontFamily: "var(--font-public-sans)", background: "#1a1208", color: "#f5f0e8", borderRadius: "2px" }}
                >
                  Request New Link
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/signin"
            className="text-[12px] tracking-[0.08em] uppercase transition-colors hover:text-[#1a1208]"
            style={{ fontFamily: "var(--font-public-sans)", color: "#8a7560" }}
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
