"use client";

import React, { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { requestPasswordReset } from "@/actions/password-reset";

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

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await requestPasswordReset(fd);
      if (result.success) {
        setSuccess(result.data?.message ?? "Check your email for a reset link.");
      } else {
        setError(result.error ?? "Something went wrong.");
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
          {success}
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
          htmlFor="email"
          className="block text-[11px] font-semibold tracking-[0.08em] uppercase"
          style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="collector@example.com"
          autoComplete="email"
          style={fieldStyle}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full h-11 text-[12px] font-semibold tracking-[0.12em] uppercase transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ fontFamily: "var(--font-public-sans)", background: "#1a1208", color: "#f5f0e8", borderRadius: "2px" }}
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Send Reset Link
      </button>
    </form>
  );
}
