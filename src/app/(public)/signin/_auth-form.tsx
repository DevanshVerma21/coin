"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { signUpWithCredentials } from "@/actions/auth-credentials";

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

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

interface AuthFormProps {
  googleAction: (fd: FormData) => Promise<void>;
  credSignInAction: (fd: FormData) => Promise<{ error?: string } | undefined>;
  oauthError?: string | null;
  callbackUrl: string;
}

export function AuthForm({
  googleAction,
  credSignInAction,
  oauthError,
  callbackUrl,
}: AuthFormProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(oauthError ?? null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // ── Credentials sign-in ─────────────────────────────────────────────────────
  function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await credSignInAction(fd);
      if (result?.error) setError(result.error);
      // On success, signIn throws NEXT_REDIRECT — page navigates automatically
    });
  }

  // ── Credentials sign-up ─────────────────────────────────────────────────────
  function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const pw = (e.currentTarget.elements.namedItem("password") as HTMLInputElement)?.value ?? "";
    const confirm = (e.currentTarget.elements.namedItem("confirmPassword") as HTMLInputElement)?.value ?? "";
    if (pw !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUpWithCredentials(fd);
      if (!result.success) {
        setError(result.error ?? "Sign-up failed.");
      } else {
        setSuccess("Account created! Signing you in…");
        // Auto sign-in after signup
        const signInFd = new FormData();
        signInFd.set("email", fd.get("email") as string);
        signInFd.set("password", fd.get("password") as string);
        const signinResult = await credSignInAction(signInFd);
        if (signinResult?.error) {
          setSuccess(null);
          setError("Account created! Please sign in below.");
          setTab("signin");
        }
      }
    });
  }

  function switchTab(t: "signin" | "signup") {
    setTab(t);
    setError(null);
    setSuccess(null);
  }

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(166,148,120,0.35)",
        borderRadius: "2px",
        boxShadow: "0 4px 24px rgba(26,18,8,0.07)",
      }}
    >
      {/* Tab switcher */}
      <div
        className="grid grid-cols-2"
        style={{ borderBottom: "1px solid rgba(166,148,120,0.2)" }}
      >
        {(["signin", "signup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            type="button"
            className="py-4 text-[12px] font-semibold tracking-[0.1em] uppercase transition-colors"
            style={{
              fontFamily: "var(--font-public-sans)",
              color: tab === t ? "#1a1208" : "#8a7560",
              background: tab === t ? "#ffffff" : "#faf6ef",
              borderBottom: tab === t ? "2px solid #1a1208" : "2px solid transparent",
            }}
          >
            {t === "signin" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      <div className="px-7 py-6 space-y-4">
        {/* Error / Success */}
        {error && (
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-sm"
            style={{ background: "rgba(186,26,26,0.06)", border: "1px solid rgba(186,26,26,0.2)" }}
            role="alert"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#ba1a1a" }} />
            <p className="text-[13px]" style={{ fontFamily: "var(--font-public-sans)", color: "#ba1a1a" }}>
              {error}
            </p>
          </div>
        )}
        {success && (
          <div
            className="px-3.5 py-3 rounded-sm text-[13px]"
            style={{
              background: "rgba(34,140,34,0.06)",
              border: "1px solid rgba(34,140,34,0.2)",
              fontFamily: "var(--font-public-sans)",
              color: "#1a6e1a",
            }}
          >
            {success}
          </div>
        )}

        {/* Google button */}
        <form action={googleAction}>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <button
            type="submit"
            className="flex items-center justify-center gap-3 w-full h-11 text-[13px] font-semibold tracking-wide transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            style={{
              fontFamily: "var(--font-public-sans)",
              background: "#ffffff",
              border: "1px solid rgba(166,148,120,0.4)",
              borderRadius: "2px",
              color: "#1a1208",
              boxShadow: "0 1px 4px rgba(26,18,8,0.08)",
            }}
          >
            {GOOGLE_SVG}
            Continue with Google
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(166,148,120,0.3)" }} />
          <span className="text-[11px] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-public-sans)", color: "#a89880" }}>
            or
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(166,148,120,0.3)" }} />
        </div>

        {/* ── Sign In form ──────────────────────────────────────────────────────── */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="si-email"
                className="block text-[11px] font-semibold tracking-[0.08em] uppercase"
                style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
              >
                Email Address
              </label>
              <input
                id="si-email"
                name="email"
                type="email"
                required
                placeholder="collector@example.com"
                autoComplete="email"
                style={fieldStyle}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="si-password"
                  className="block text-[11px] font-semibold tracking-[0.08em] uppercase"
                  style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold underline transition-colors hover:text-[#1a1208]"
                  style={{ fontFamily: "var(--font-public-sans)", color: "#735c00" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="si-password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={pending}
              className="w-full h-11 text-[12px] font-semibold tracking-[0.12em] uppercase transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              style={{
                fontFamily: "var(--font-public-sans)",
                background: "#1a1208",
                color: "#f5f0e8",
                borderRadius: "2px",
              }}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In
            </button>

            <p
              className="text-center text-[12px]"
              style={{ fontFamily: "var(--font-public-sans)", color: "#8a7560" }}
            >
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchTab("signup")}
                className="font-semibold underline transition-colors hover:text-[#1a1208]"
                style={{ color: "#735c00" }}
              >
                Create one
              </button>
            </p>
          </form>
        )}

        {/* ── Sign Up form ──────────────────────────────────────────────────────── */}
        {tab === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="su-name"
                className="block text-[11px] font-semibold tracking-[0.08em] uppercase"
                style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
              >
                Full Name
              </label>
              <input
                id="su-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                autoComplete="name"
                style={fieldStyle}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="su-email"
                className="block text-[11px] font-semibold tracking-[0.08em] uppercase"
                style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
              >
                Email Address
              </label>
              <input
                id="su-email"
                name="email"
                type="email"
                required
                placeholder="collector@example.com"
                autoComplete="email"
                style={fieldStyle}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="su-password"
                className="block text-[11px] font-semibold tracking-[0.08em] uppercase"
                style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="su-password"
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
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="su-confirm"
                className="block text-[11px] font-semibold tracking-[0.08em] uppercase"
                style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
              >
                Confirm Password
              </label>
              <input
                id="su-confirm"
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
              className="w-full h-11 text-[12px] font-semibold tracking-[0.12em] uppercase transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              style={{
                fontFamily: "var(--font-public-sans)",
                background: "linear-gradient(135deg,#735c00,#d4af37)",
                color: "#ffffff",
                borderRadius: "2px",
              }}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </button>

            <p
              className="text-center text-[12px]"
              style={{ fontFamily: "var(--font-public-sans)", color: "#8a7560" }}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchTab("signin")}
                className="font-semibold underline transition-colors hover:text-[#1a1208]"
                style={{ color: "#735c00" }}
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-7 py-4 text-center"
        style={{ borderTop: "1px solid rgba(166,148,120,0.2)", background: "#faf6ef" }}
      >
        <p
          className="text-[11px] leading-relaxed"
          style={{ fontFamily: "var(--font-public-sans)", color: "#a89880" }}
        >
          By continuing you agree to our Terms of Service and Privacy Policy. All data saved securely.
        </p>
      </div>
    </div>
  );
}
