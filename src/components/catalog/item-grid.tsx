import React from "react";
import { ItemCard } from "./item-card";
import type { IItemPopulated } from "@/types";

interface ItemGridProps {
  items: IItemPopulated[];
}

export function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center rounded"
        style={{ border: "1px solid #d0c5af", background: "#fcecce" }}
      >
        <svg
          width="48" height="48" viewBox="0 0 48 48" fill="none"
          className="mb-4 opacity-40" aria-hidden
        >
          <circle cx="24" cy="24" r="22" stroke="#735c00" strokeWidth="1.5" fill="none" />
          <circle cx="24" cy="24" r="14" stroke="#d4af37" strokeWidth="1" fill="none" />
          <text x="24" y="29" textAnchor="middle" fontSize="14" fontWeight="700" fill="#735c00" fontFamily="serif">₹</text>
        </svg>
        <p
          className="font-serif font-semibold text-[18px]"
          style={{ color: "#4d4635" }}
        >
          No items found
        </p>
        <p
          className="text-[14px] mt-1"
          style={{ fontFamily: "var(--font-eb-garamond)", color: "#7f7663" }}
        >
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}
