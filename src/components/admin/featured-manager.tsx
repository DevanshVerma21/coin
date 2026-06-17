"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Star, StarOff, Loader2 } from "lucide-react";
import { toggleFeatured } from "@/actions/items";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import type { IItemPopulated } from "@/types";

interface FeaturedManagerProps {
  featuredItems: IItemPopulated[];
  availableItems: IItemPopulated[];
}

export function FeaturedManager({ featuredItems, availableItems }: FeaturedManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function handleToggle(id: string, currentlyFeatured: boolean) {
    setTogglingId(id);
    startTransition(async () => {
      const result = await toggleFeatured(id);
      if (result.success) {
        toast.success(currentlyFeatured ? "Removed from featured" : "Added to featured");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed");
      }
      setTogglingId(null);
    });
  }

  function ItemRow({ item, isFeatured }: { item: IItemPopulated; isFeatured: boolean }) {
    return (
      <div className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors rounded-lg">
        <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden border border-border bg-muted/30">
          <Image
            src={item.frontImage}
            alt={item.title}
            fill
            className="object-contain p-0.5"
            sizes="40px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{item.title}</p>
          <p className="text-xs text-muted-foreground font-mono">#{item.itemNumber} · {item.year}</p>
        </div>
        <span className="text-sm font-semibold text-primary shrink-0 hidden sm:block">
          {formatPrice(item.price)}
        </span>
        <button
          onClick={() => handleToggle(item._id, isFeatured)}
          disabled={pending || togglingId === item._id}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors shrink-0 ${
            isFeatured
              ? "border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
          aria-label={isFeatured ? "Remove from featured" : "Add to featured"}
        >
          {togglingId === item._id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isFeatured ? (
            <StarOff className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Currently featured */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-amber-50/50">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            Currently Featured ({featuredItems.length})
          </h2>
        </div>
        <div className="p-2 max-h-[500px] overflow-y-auto">
          {featuredItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No featured items. Add some from the right.
            </p>
          ) : (
            featuredItems.map((item) => (
              <ItemRow key={item._id} item={item} isFeatured />
            ))
          )}
        </div>
      </div>

      {/* Available to feature */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-sm">Available Items ({availableItems.length})</h2>
        </div>
        <div className="p-2 max-h-[500px] overflow-y-auto">
          {availableItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No available items
            </p>
          ) : (
            availableItems.map((item) => (
              <ItemRow key={item._id} item={item} isFeatured={false} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
