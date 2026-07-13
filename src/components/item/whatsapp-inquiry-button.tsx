"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { createInquiry } from "@/actions/inquiries";
import { toast } from "sonner";
import type { IItemPopulated } from "@/types";

interface WhatsAppInquiryButtonProps {
  item: IItemPopulated;
}

export function WhatsAppInquiryButton({ item }: WhatsAppInquiryButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleInquiry() {
    setLoading(true);
    try {
      const result = await createInquiry({
        itemId:     item._id,
        itemTitle:  item.title,
        itemNumber: item.itemNumber,
        itemSlug:   item.slug,
        itemType:   item.type,
      });
      if (result.success && result.data) {
        window.location.href = result.data.whatsappUrl;
      } else {
        toast.error(result.error ?? "Could not open WhatsApp. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (item.sold) {
    return (
      <div
        className="w-full h-14 flex items-center justify-center text-[12px] font-semibold tracking-[0.1em] uppercase"
        style={{
          fontFamily: "var(--font-public-sans)",
          background: "#f0e1c3",
          border: "1px solid #d0c5af",
          color: "#8a7560",
        }}
      >
        This Piece Has Been Sold
      </div>
    );
  }

  return (
    <button
      onClick={handleInquiry}
      disabled={loading}
      className="w-full h-14 flex items-center justify-center gap-3 text-[12px] font-semibold tracking-[0.14em] uppercase transition-all hover:opacity-90 disabled:opacity-60"
      style={{
        fontFamily: "var(--font-public-sans)",
        background: "#1a1208",
        color: "#f5f0e8",
      }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12.002 0C5.374 0 0 5.373 0 12c0 2.115.554 4.1 1.524 5.825L.057 23.285c-.083.302.197.582.499.499l5.46-1.467A11.937 11.937 0 0012.002 24C18.627 24 24 18.627 24 12S18.627 0 12.002 0zm0 21.818a9.804 9.804 0 01-5.007-1.375l-.358-.213-3.716.974.99-3.616-.232-.371A9.793 9.793 0 012.182 12c0-5.42 4.4-9.818 9.82-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
        </svg>
      )}
      {loading ? "Opening WhatsApp…" : "Inquire About This Piece"}
    </button>
  );
}
