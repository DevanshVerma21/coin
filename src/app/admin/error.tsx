"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div
        className="w-full max-w-lg rounded-xl p-6 text-left mb-6"
        style={{ background: "#fff2db", border: "1px solid #d4af37" }}
      >
        <p
          className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-2"
          style={{ fontFamily: "var(--font-public-sans)", color: "#735c00" }}
        >
          Admin Error
        </p>
        <p
          className="font-serif font-bold text-[20px] mb-3"
          style={{ color: "#1a1208" }}
        >
          {error.message || "Something went wrong"}
        </p>
        {process.env.NODE_ENV === "development" && error.stack && (
          <pre
            className="text-[11px] overflow-auto max-h-40 p-3 rounded"
            style={{
              background: "#1a1208",
              color: "#f5f0e8",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {error.stack}
          </pre>
        )}
        {error.digest && (
          <p
            className="text-[11px] mt-2"
            style={{ fontFamily: "var(--font-public-sans)", color: "#8a7560" }}
          >
            Digest: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="h-10 px-5 text-[12px] font-semibold tracking-[0.1em] uppercase text-white transition-opacity hover:opacity-90"
          style={{ background: "#1a1208", fontFamily: "var(--font-public-sans)" }}
        >
          Try Again
        </button>
        <Link
          href="/admin"
          className="h-10 px-5 flex items-center text-[12px] font-semibold tracking-[0.1em] uppercase transition-colors hover:bg-black/5"
          style={{
            border: "1px solid #d0c5af",
            color: "#1a1208",
            fontFamily: "var(--font-public-sans)",
          }}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
