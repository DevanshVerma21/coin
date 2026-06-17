import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { IItemPopulated } from "@/types";

interface ArchiveSelectionProps {
  coinSample?: IItemPopulated | null;
  noteSample?: IItemPopulated | null;
  coinCount: number;
  noteCount: number;
}

export function ArchiveSelection({ coinSample: _coinSample, noteSample: _noteSample, coinCount, noteCount }: ArchiveSelectionProps) {
  const COIN_IMG = "https://res.cloudinary.com/djprgnsae/image/upload/v1781638333/ntik-heritage/ntik-heritage/AB6AXuCA52vlYlCmUaTbBwhJToWjA8sYQIMVATqm.jpg";
  const NOTE_IMG = "https://res.cloudinary.com/djprgnsae/image/upload/v1781638335/ntik-heritage/ntik-heritage/AB6AXuD8QZUtXqCCVzPvQndjB-7CrrGHJswqFryq.jpg";

  const cards = [
    {
      title: "Rare Coins",
      badge: "NT",
      description: "From the punch-marked silver of the Mauryas to the sovereign gold of the British Raj.",
      image: COIN_IMG,
      imageAlt: "Rare coins collection",
      count: coinCount,
      href: "/coins",
    },
    {
      title: "Antique Notes",
      badge: "NT",
      description: "Paper currency featuring the earliest portrait series and bank signatures of the 19th century.",
      image: NOTE_IMG,
      imageAlt: "Antique banknotes collection",
      count: noteCount,
      href: "/notes",
    },
  ];

  return (
    <section className="w-full py-14 sm:py-16 px-5 sm:px-8" style={{ background: "#f5f0e8" }}>
      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <p
              className="mb-2 tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560", fontWeight: 500 }}
            >
              Curated Galleries
            </p>
            <h2
              className="font-serif font-semibold leading-tight"
              style={{ fontSize: "clamp(24px, 3.5vw, 38px)", color: "#1a1208" }}
            >
              The Archive Selection
            </h2>
          </div>
          <Link
            href="/coins"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.1em] uppercase transition-colors hover:text-[#1a1208] whitespace-nowrap"
            style={{ fontFamily: "var(--font-public-sans)", color: "#8a7560" }}
          >
            Explore All
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: "rgba(166,148,120,0.3)" }} />

        {/* Gallery cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,18,8,0.1)]"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(166,148,120,0.3)",
                borderRadius: "2px",
              }}
            >
              {/* Card top: title + badge */}
              <div className="flex items-start justify-between p-5 pb-3">
                <div>
                  <h3
                    className="font-serif font-semibold mb-2"
                    style={{ fontSize: "20px", color: "#1a1208" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="leading-snug"
                    style={{
                      fontFamily: "var(--font-eb-garamond)",
                      fontSize: "14px",
                      color: "#6b5c45",
                      maxWidth: "280px",
                    }}
                  >
                    {card.description}
                  </p>
                </div>
                {/* NT Badge */}
                <div
                  className="flex-shrink-0 ml-4 flex h-7 w-7 items-center justify-center rounded-sm text-[10px] font-bold"
                  style={{
                    background: "#c9a227",
                    color: "#ffffff",
                    fontFamily: "var(--font-public-sans)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {card.badge}
                </div>
              </div>

              {/* Image area */}
              <div
                className="mx-5 mb-0 overflow-hidden relative"
                style={{
                  height: "clamp(160px, 22vw, 220px)",
                  background: "#1a1208",
                  borderRadius: "1px",
                }}
              >
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 90vw, 45vw"
                />
              </div>

              {/* Card footer */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderTop: "1px solid rgba(166,148,120,0.2)" }}
              >
                <span
                  className="tracking-[0.14em] uppercase"
                  style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560", fontWeight: 500 }}
                >
                  {card.count > 0 ? `${card.count.toLocaleString()} Artifacts` : "Coming Soon"}
                </span>
                <span
                  className="text-[12px] font-semibold tracking-[0.1em] uppercase group-hover:text-[#735c00] transition-colors"
                  style={{ fontFamily: "var(--font-public-sans)", color: "#1a1208" }}
                >
                  View Gallery →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
