import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategoryLinks() {
  return (
    <section className="py-12" style={{ background: "#f0e1c3" }}>
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Coins card */}
          <Link
            href="/coins"
            className="group relative overflow-hidden rounded flex items-center gap-5 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "#fcecce",
              border: "1px solid #d0c5af",
              boxShadow: "0 2px 8px rgba(34,27,8,0.04)",
            }}
          >
            {/* Coin SVG mark */}
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors"
              style={{
                background: "#fff8f1",
                borderColor: "#d0c5af",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                <circle cx="14" cy="14" r="12.5" stroke="#735c00" strokeWidth="1.5" fill="none" />
                <circle cx="14" cy="14" r="8" stroke="#d4af37" strokeWidth="1" fill="none" />
                <text x="14" y="18" textAnchor="middle" fontSize="9" fontWeight="700" fill="#735c00" fontFamily="serif">₹</text>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-serif font-semibold text-[22px] mb-1 group-hover:text-[#735c00] transition-colors"
                style={{ color: "#221b08" }}
              >
                Antique Coins
              </h3>
              <p
                className="text-[14px] leading-snug"
                style={{ fontFamily: "var(--font-eb-garamond)", color: "#4d4635" }}
              >
                Mughal, British India, Republic era &amp; colonial series
              </p>
            </div>
            <ArrowRight
              className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform"
              style={{ color: "#7f7663" }}
            />
          </Link>

          {/* Notes card */}
          <Link
            href="/notes"
            className="group relative overflow-hidden rounded flex items-center gap-5 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "#fcecce",
              border: "1px solid #d0c5af",
              boxShadow: "0 2px 8px rgba(34,27,8,0.04)",
            }}
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded border transition-colors"
              style={{ background: "#fff8f1", borderColor: "#d0c5af" }}
            >
              <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden>
                <rect x="1" y="1" width="26" height="16" rx="2" stroke="#735c00" strokeWidth="1.5" fill="none" />
                <rect x="4" y="4" width="9" height="6" rx="1" stroke="#d4af37" strokeWidth="1" fill="none" />
                <line x1="16" y1="5" x2="24" y2="5" stroke="#d0c5af" strokeWidth="1" />
                <line x1="16" y1="8" x2="24" y2="8" stroke="#d0c5af" strokeWidth="1" />
                <line x1="16" y1="11" x2="21" y2="11" stroke="#d0c5af" strokeWidth="1" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-serif font-semibold text-[22px] mb-1 group-hover:text-[#735c00] transition-colors"
                style={{ color: "#221b08" }}
              >
                Banknotes
              </h3>
              <p
                className="text-[14px] leading-snug"
                style={{ fontFamily: "var(--font-eb-garamond)", color: "#4d4635" }}
              >
                Colonial, RBI, Independence era &amp; rare denomination notes
              </p>
            </div>
            <ArrowRight
              className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform"
              style={{ color: "#7f7663" }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
