import React from "react";
import Link from "next/link";

const footerLinks = [
  { href: "/consignment", label: "Consignment" },
  { href: "/coins", label: "Authentication" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/curators", label: "Contact Curator" },
];

export function Footer() {
  return (
    <footer style={{ background: "#f5f0e8", borderTop: "1px solid rgba(166,148,120,0.3)" }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-16 py-12">

        {/* Logo centered */}
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

        {/* Social-like icons row (static, matches image) */}
        <div className="flex justify-center gap-5 mt-5">
          {["share", "mail", "location"].map((icon) => (
            <div
              key={icon}
              className="h-5 w-5 flex items-center justify-center opacity-40"
              style={{ color: "#1a1208" }}
              aria-hidden
            >
              {icon === "share" && (
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                  <circle cx="15" cy="3" r="2" /><circle cx="3" cy="10" r="2" /><circle cx="15" cy="17" r="2" />
                  <line x1="13" y1="4.3" x2="5" y2="8.7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <line x1="13" y1="15.7" x2="5" y2="11.3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              )}
              {icon === "mail" && (
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="5" width="16" height="11" rx="1" />
                  <polyline points="2,5 10,12 18,5" />
                </svg>
              )}
              {icon === "location" && (
                <svg viewBox="0 0 20 20" width="14" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5z" />
                  <circle cx="10" cy="7" r="1.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
