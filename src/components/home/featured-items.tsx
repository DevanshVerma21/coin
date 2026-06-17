import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ItemCard } from "@/components/catalog/item-card";
import type { IItemPopulated } from "@/types";

interface FeaturedItemsProps {
  items: IItemPopulated[];
}

export function FeaturedItems({ items }: FeaturedItemsProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20" style={{ background: "#fff8f1" }}>
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="label-caps mb-2" style={{ color: "#735c00" }}>
              Handpicked Collection
            </p>
            <h2
              className="font-serif font-bold text-[28px] sm:text-[36px] leading-tight"
              style={{ color: "#221b08" }}
            >
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/coins"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium tracking-wide transition-colors hover:text-[#735c00]"
            style={{ fontFamily: "var(--font-public-sans)", color: "#7f7663" }}
          >
            View Full Archive
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Decorative divider */}
        <div
          className="h-px w-full mb-10"
          style={{ background: "linear-gradient(90deg, #d4af37, #d0c5af, transparent)" }}
        />

        {/* Grid — stagger via CSS animation-delay */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {items.slice(0, 8).map((item, i) => (
            <div
              key={item._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
