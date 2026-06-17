import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { IItemPopulated, RarityLevel } from "@/types";

interface RelatedItemsProps {
  items: IItemPopulated[];
  categoryLabel?: string;
  type: "coin" | "note";
}

const RARITY_LABEL: Record<RarityLevel, string> = {
  R: "R",
  RR: "RR",
  RRR: "RRR",
  RRRR: "RRRR",
};

export function RelatedItems({ items, categoryLabel, type }: RelatedItemsProps) {
  if (items.length === 0) return null;

  const baseHref = type === "coin" ? "/coins" : "/notes";

  return (
    <section className="mt-20 pt-16" style={{ borderTop: "1px solid #d0c5af" }}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <p
            className="mb-2 tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560", fontWeight: 500 }}
          >
            Explore More
          </p>
          <h2
            className="font-serif font-semibold"
            style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "#1a1208" }}
          >
            Related Rarities
          </h2>
        </div>
        <Link
          href={baseHref}
          className="text-[12px] font-semibold tracking-[0.1em] uppercase transition-colors hover:opacity-70"
          style={{
            fontFamily: "var(--font-public-sans)",
            color: "#735c00",
            borderBottom: "1px solid #735c00",
            paddingBottom: "2px",
          }}
        >
          View All {categoryLabel ?? (type === "coin" ? "British India" : "Banknotes")}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <Link
            key={item._id}
            href={`${baseHref}/${item.slug}`}
            className="group block"
          >
            {/* Image */}
            <div
              className="relative overflow-hidden mb-4 p-4"
              style={{
                aspectRatio: "4/3",
                border: "0.5px solid #d4af37",
                background: "#fcecce",
              }}
            >
              <Image
                src={item.frontImage}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              {/* Rarity badge */}
              {item.rarity && (
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #735c00)",
                    color: "#ffffff",
                    fontFamily: "var(--font-public-sans)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {RARITY_LABEL[item.rarity]}
                </div>
              )}
            </div>

            {/* Meta */}
            <p
              className="mb-1 tracking-[0.12em] uppercase"
              style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560", fontWeight: 500 }}
            >
              {item.year} {item.denomination ? `· ${item.denomination}` : ""}
            </p>
            <h3
              className="font-serif font-semibold mb-2 group-hover:text-[#735c00] transition-colors"
              style={{ fontSize: "20px", color: "#1a1208" }}
            >
              {item.title}
            </h3>
            <p
              className="line-clamp-2 text-[13px]"
              style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
            >
              {item.denomination && `${item.denomination}. `}
              {item.description.slice(0, 100)}
              {item.description.length > 100 ? "…" : ""}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
