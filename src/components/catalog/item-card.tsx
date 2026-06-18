"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { IItemPopulated } from "@/types";

interface ItemCardProps {
  item: IItemPopulated;
}

export function ItemCard({ item }: ItemCardProps) {
  const [flipped, setFlipped] = useState(false);
  const href = `/${item.type === "coin" ? "coins" : "notes"}/${item.slug}`;
  const displayImage = flipped && item.backImage ? item.backImage : item.frontImage;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden transition-all duration-300",
        "hover:-translate-y-0.5"
      )}
      style={{
        background: "#ffffff",
        border: "1px solid #d0c5af",
        borderRadius: "0.25rem",
        boxShadow: "0 2px 6px rgba(34,27,8,0.06)",
      }}
    >
      {/* Featured badge */}
      {item.featured && !item.sold && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className="label-caps px-2 py-1"
            style={{
              background: "linear-gradient(135deg,#735c00,#c9a227)",
              color: "#ffffff",
              fontSize: "9px",
              borderRadius: "2px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              letterSpacing: "0.12em",
            }}
          >
            ★ Featured
          </span>
        </div>
      )}

      {/* Flip button (show back) */}
      {item.backImage && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setFlipped((v) => !v);
          }}
          className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded transition-colors"
          style={{
            background: "rgba(255,248,241,0.9)",
            border: "1px solid #d0c5af",
            color: "#7f7663",
            fontSize: "9px",
            fontFamily: "var(--font-public-sans)",
            fontWeight: "600",
          }}
          aria-label={flipped ? "Show front" : "Flip to back"}
        >
          {flipped ? "F" : "B"}
        </button>
      )}

      {/* Image */}
      <Link
        href={href}
        className="block relative aspect-square overflow-hidden"
        style={{ background: "#fff8f1" }}
      >
        <Image
          src={displayImage}
          alt={`${item.title} — ${flipped ? "back" : "front"}`}
          fill
          className={cn(
            "object-contain p-3 transition-all duration-500",
            item.sold ? "blur-[2px] scale-[1.02]" : "group-hover:scale-[1.04]"
          )}
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Sold overlay — blurred backdrop with centred stamp */}
        {item.sold && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(10,8,4,0.38)" }}
          >
            <div
              className="flex flex-col items-center gap-0.5"
              style={{
                border: "1.5px solid rgba(255,255,255,0.75)",
                padding: "6px 14px",
                borderRadius: "2px",
                transform: "rotate(-8deg)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-public-sans)",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "#ffffff",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                Sold
              </span>
            </div>
          </div>
        )}
      </Link>

      {/* Stitch surface-container divider */}
      <div style={{ height: "1px", background: "#d0c5af" }} />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-3" style={{ background: "#fcecce" }}>
        <Link href={href} className="block">
          {/* Item number — meta-data style */}
          <p
            className="mb-0.5"
            style={{
              fontFamily: "var(--font-public-sans)",
              fontSize: "10px",
              color: "#7f7663",
              letterSpacing: "0.05em",
            }}
          >
            #{item.itemNumber}
          </p>

          {/* Title — Stitch headline-sm */}
          <h3
            className="font-serif font-semibold leading-snug line-clamp-2 mb-0.5 group-hover:text-[#735c00] transition-colors"
            style={{ fontSize: "14px", color: "#221b08" }}
          >
            {item.title}
          </h3>

          {/* Year */}
          <p
            style={{
              fontFamily: "var(--font-eb-garamond)",
              fontSize: "13px",
              color: "#4d4635",
            }}
          >
            {item.year}
          </p>
        </Link>

        {/* Price + action */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span
            className="font-semibold"
            style={{
              fontFamily: "var(--font-public-sans)",
              fontSize: "14px",
              color: "#735c00",
            }}
          >
            {formatPrice(item.price)}
          </span>
          <Link
            href={href}
            className="text-[11px] font-medium tracking-wide transition-colors hover:text-[#735c00]"
            style={{
              fontFamily: "var(--font-public-sans)",
              color: "#7f7663",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
