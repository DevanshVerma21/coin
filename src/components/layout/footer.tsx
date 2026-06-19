import React from "react";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Museum" },
  { href: "/coins", label: "Coins" },
  { href: "/notes", label: "Notes" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  return (
    <footer style={{ background: "#f5f0e8", borderTop: "1px solid rgba(166,148,120,0.3)" }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-16 py-10 sm:py-12">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link
            href="/"
            className="font-serif font-bold text-[26px] tracking-[0.08em] transition-opacity hover:opacity-60"
            style={{ color: "#1a1208" }}
            aria-label="NTIK Home"
          >
            NTIK
          </Link>
        </div>

        {/* Nav links */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8"
        >
          {footerLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-medium tracking-[0.1em] uppercase transition-colors hover:text-[#1a1208]"
              style={{ fontFamily: "var(--font-public-sans)", color: "#8a7560" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background: "rgba(166,148,120,0.25)" }} />

        {/* Copyright */}
        <p
          className="text-center text-[11px] tracking-wide"
          style={{ fontFamily: "var(--font-public-sans)", color: "#a89880" }}
        >
          © {new Date().getFullYear()} NTIK Numismatic Collections. Preserving the History of
          Currency. All rights reserved.
        </p>

        {/* Icon row — WhatsApp inquiry, email, share */}
        <div className="flex justify-center gap-5 mt-5">

          {/* WhatsApp — opens inquiry */}
          <a
            href="#inquiry"
            className="h-5 w-5 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: "#1a1208" }}
            aria-label="Contact via WhatsApp"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="5" width="16" height="11" rx="1" />
              <polyline points="2,5 10,12 18,5" />
            </svg>
          </a>

          {/* Coins catalog */}
          <Link
            href="/coins"
            className="h-5 w-5 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: "#1a1208" }}
            aria-label="Browse coins"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10" cy="10" r="7" />
              <circle cx="10" cy="10" r="4" />
            </svg>
          </Link>

          {/* Notes catalog */}
          <Link
            href="/notes"
            className="h-5 w-5 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: "#1a1208" }}
            aria-label="Browse notes"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="14" height="14" rx="1" />
              <line x1="6" y1="7" x2="14" y2="7" />
              <line x1="6" y1="10" x2="14" y2="10" />
              <line x1="6" y1="13" x2="10" y2="13" />
            </svg>
          </Link>

        </div>
      </div>
    </footer>
  );
}
