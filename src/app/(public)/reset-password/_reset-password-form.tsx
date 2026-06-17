"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { resetPassword } from "@/actions/password-reset";

const fieldStyle: React.CSSProperties = {
  width: "100%",
  height: "40px",
  padding: "0 12px",
  fontFamily: "var(--font-public-sans)",
  fontSize: "13px",
  color: "#1a1208",
  background: "#ffffff",
  border: "1px solid rgba(166,148,120,0.5)",
  borderRadius: "2px",
  outline: "none",
};

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("token", token);
    startTransition(async () => {
      const result = await resetPassword(fd);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/signin"), 2500);
      } else {
        setError(result.error ?? "Failed to reset password.");
      }
    });
  }

  if (success) {
    return (
      <div
        className="flex items-start gap-3 px-4 py-4 rounded-sm"
        style={{ background: "rgba(34,140,34,0.06)", border: "1px solid rgba(34,140,34,0.2)" }}
      >
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#1a6e1a" }} />
        <p className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-public-sans)", color: "#1a6e1a" }}>
          Password updated successfully! Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="flex items-start gap-2.5 px-3.5 py-3 rounded-sm"
          style={{ background: "rgba(186,26,26,0.06)", border: "1px solid rgba(186,26,26,0.2)" }}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#ba1a1a" }} />
          <p className="text-[13px]" style={{ fontFamily: "var(--font-public-sans)", color: "#ba1a1a" }}>
            {error}
          </p>
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-[11px] font-semibold tracking-[0.08em] uppercase"
          style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPw ? "text" : "password"}
            required
            minLength={8}
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            autoComplete="new-password"
            style={{ ...fieldStyle, paddingRight: "40px" }}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7560] hover:text-[#1a1208] transition-colors"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="confirmPassword"
          className="block text-[11px] font-semibold tracking-[0.08em] uppercase"
          style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPw ? "text" : "password"}
          required
          placeholder="••••••••"
          autoComplete="new-password"
          style={fieldStyle}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full h-11 text-[12px] font-semibold tracking-[0.12em] uppercase transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{
          fontFamily: "var(--font-public-sans)",
          background: "linear-gradient(135deg,#735c00,#d4af37)",
          color: "#ffffff",
          borderRadius: "2px",
        }}
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Update Password
      </button>
    </form>
  );
}
