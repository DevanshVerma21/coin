import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { IItemPopulated } from "@/types";

interface HistoricalHighlightsProps {
  items: IItemPopulated[];
}

const PLACEHOLDER_ITEMS = [
  {
    title: "Silver Rupee, 1542",
    subtitle: "Sher Shah Suri Dynasty | Mint: Agra",
    type: "Authenticated Private",
    status: "coin",
  },
  {
    title: "Empress Gold Sovereign",
    subtitle: "British Raj | Year: 1877",
    type: "Private Collection",
    status: "coin",
  },
  {
    title: "1000 Rupee Archival Note",
    subtitle: "Post-Independence Series | Signature: F...",
    type: "Museum Grade",
    status: "note",
  },
];

export function HistoricalHighlights({ items }: HistoricalHighlightsProps) {
  const showPlaceholders = items.length === 0;
  const displayItems = items.slice(0, 3);

  return (
    <section
      className="w-full py-14 sm:py-16 px-5 sm:px-8"
      style={{ background: "#faf6ef" }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <div className="text-center mb-10">
          <p
            className="mb-3 tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560", fontWeight: 500 }}
          >
            Current Exhibition
          </p>
          <h2
            className="font-serif font-semibold"
            style={{ fontSize: "clamp(26px, 3.5vw, 38px)", color: "#1a1208" }}
          >
            Historical Highlights
          </h2>
        </div>

        {/* 3-column grid — 1 col mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {showPlaceholders
            ? PLACEHOLDER_ITEMS.map((p, i) => (
                <PlaceholderCard key={i} item={p} />
              ))
            : displayItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
        </div>
      </div>
    </section>
  );
}

function ItemCard({ item }: { item: IItemPopulated }) {
  const href = `/${item.type === "coin" ? "coins" : "notes"}/${item.slug}`;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(166,148,120,0.25)",
        borderRadius: "2px",
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "4/3", background: "#f5f0e8" }}
      >
        <Image
          src={item.frontImage}
          alt={item.title}
          fill
          className="object-contain p-4"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <p
          className="mb-1 tracking-[0.12em] uppercase"
          style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", fontWeight: 600, color: "#1a1208" }}
        >
          {item.title}
        </p>
        <p
          className="mb-3 leading-snug"
          style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "13px", color: "#8a7560" }}
        >
          {item.year} · #{item.itemNumber}
        </p>

        {/* Collection indicator */}
        <div className="flex items-center gap-1.5 mb-5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: item.sold ? "#ba1a1a" : "#4a7c59" }}
          />
          <span
            style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560" }}
          >
            {item.sold ? "Sold" : "Available · " + formatPrice(item.price)}
          </span>
        </div>

        {/* View Details button */}
        <Link
          href={href}
          className="mt-auto inline-flex items-center justify-center h-9 text-[11px] font-semibold tracking-[0.12em] uppercase transition-all duration-200 text-[#1a1208] hover:bg-[#1a1208] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(212,175,55,0.12)]"
          style={{
            fontFamily: "var(--font-public-sans)",
            border: "1px solid rgba(26,18,8,0.3)",
            borderRadius: "2px",
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function PlaceholderCard({ item }: { item: typeof PLACEHOLDER_ITEMS[0] }) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(166,148,120,0.25)",
        borderRadius: "2px",
      }}
    >
      {/* Placeholder image */}
      <div
        className="relative flex items-center justify-center"
        style={{ aspectRatio: "4/3", background: "#f5f0e8" }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "#e8dfc8", border: "1px solid #d0c5af" }}
        >
          {item.status === "coin" ? (
            <svg viewBox="0 0 40 40" width="36" height="36" fill="none" aria-hidden>
              <circle cx="20" cy="20" r="18" fill="#c9a227" opacity="0.5" />
              <circle cx="20" cy="20" r="13" stroke="#735c00" strokeWidth="1" fill="none" opacity="0.7" />
            </svg>
          ) : (
            <svg viewBox="0 0 50 30" width="44" height="28" fill="none" aria-hidden>
              <rect x="1" y="1" width="48" height="28" rx="2" fill="#c9a227" opacity="0.4" />
              <rect x="4" y="4" width="16" height="22" rx="1" fill="#a07c14" opacity="0.5" />
            </svg>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <p
          className="mb-1 tracking-[0.12em] uppercase"
          style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", fontWeight: 600, color: "#1a1208" }}
        >
          {item.title}
        </p>
        <p
          className="mb-3 leading-snug"
          style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "13px", color: "#8a7560" }}
        >
          {item.subtitle}
        </p>

        <div className="flex items-center gap-1.5 mb-5">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#c9a227" }} />
          <span style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560" }}>
            {item.type}
          </span>
        </div>

        <Link
          href="/coins"
          className="mt-auto inline-flex items-center justify-center h-9 text-[11px] font-semibold tracking-[0.12em] uppercase transition-all duration-200 text-[#1a1208] hover:bg-[#1a1208] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(212,175,55,0.12)]"
          style={{
            fontFamily: "var(--font-public-sans)",
            border: "1px solid rgba(26,18,8,0.3)",
            borderRadius: "2px",
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
