import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "./_forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password — NTIK Heritage Archive",
  description: "Reset your NTIK Heritage account password.",
};

export default function ForgotPasswordPage() {
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
              Forgot Password
            </h1>
            <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-eb-garamond)", color: "#6b5c45" }}>
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <div className="px-7 py-6">
            <ForgotPasswordForm />
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
