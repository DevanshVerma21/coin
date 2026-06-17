"use client";

import React, { useState, useTransition } from "react";
import { KeyRound, CheckCircle2, Loader2 } from "lucide-react";
import { requestPasswordReset } from "@/actions/password-reset";

export function ChangePasswordButton({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const fd = new FormData();
    fd.set("email", email);
    startTransition(async () => {
      await requestPasswordReset(fd);
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div
        className="flex items-center gap-2 h-10 px-4 text-[12px] font-semibold"
        style={{
          fontFamily: "var(--font-public-sans)",
          background: "rgba(34,140,34,0.06)",
          border: "1px solid rgba(34,140,34,0.25)",
          color: "#1a6e1a",
          borderRadius: "2px",
        }}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Reset link sent to {email}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 h-10 px-6 text-[12px] font-semibold tracking-[0.1em] uppercase transition-all text-[#1a1208] hover:bg-[#1a1208] hover:text-white disabled:opacity-60 w-full sm:w-auto"
      style={{
        fontFamily: "var(--font-public-sans)",
        border: "1px solid rgba(26,18,8,0.3)",
        borderRadius: "2px",
      }}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
      Change Password
    </button>
  );
}
