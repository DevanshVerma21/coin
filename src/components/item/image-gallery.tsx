"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RarityLevel } from "@/types";

interface ImageGalleryProps {
  frontImage: string;
  backImage?: string;
  additionalImages?: string[];
  title: string;
  rarity?: RarityLevel;
  sold?: boolean;
}

const RARITY_LABEL: Record<RarityLevel, string> = {
  R: "R",
  RR: "RR",
  RRR: "RRR",
  RRRR: "RRRR",
};

export function ImageGallery({
  frontImage,
  backImage,
  additionalImages = [],
  title,
  rarity,
  sold,
}: ImageGalleryProps) {
  const thumbnails = [
    frontImage,
    ...(backImage ? [backImage] : []),
    ...additionalImages,
  ].slice(0, 4);

  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  function selectImage(idx: number) {
    if (idx === selected) return;
    setTransitioning(true);
    setTimeout(() => {
      setSelected(idx);
      setTransitioning(false);
    }, 200);
  }

  return (
    <>
      {/* Main image */}
      <div
        className="relative group overflow-hidden"
        style={{
          border: "0.5px solid #d4af37",
          padding: "8px",
          background: "#ffffff",
        }}
      >
        <div
          className={cn(
            "relative w-full aspect-square transition-opacity duration-200",
            transitioning ? "opacity-0" : "opacity-100"
          )}
        >
          <Image
            src={thumbnails[selected]}
            alt={`${title} — ${selected === 0 ? "obverse" : selected === 1 && backImage ? "reverse" : "detail"}`}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-700"
            priority={selected === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Sold overlay */}
          {sold && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span
                className="px-6 py-2 text-[13px] font-semibold tracking-[0.14em] uppercase"
                style={{
                  background: "#1a1208",
                  color: "#f5f0e8",
                  fontFamily: "var(--font-public-sans)",
                }}
              >
                Sold
              </span>
            </div>
          )}
        </div>

        {/* Rarity badge — wax seal style */}
        {rarity && (
          <div
            className="absolute top-5 right-5 w-14 h-14 rounded-full flex flex-col items-center justify-center z-10 shadow-lg"
            style={{
              background: "linear-gradient(145deg, #d4af37, #735c00)",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.15)",
              border: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            <span
              className="text-[9px] font-semibold leading-tight uppercase"
              style={{ fontFamily: "var(--font-public-sans)", color: "#ffffff", letterSpacing: "0.05em" }}
            >
              RARITY
            </span>
            <span
              className="font-bold leading-none"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "#ffffff",
                fontSize: rarity.length > 2 ? "11px" : "14px",
              }}
            >
              {RARITY_LABEL[rarity]}
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-5 right-5 flex flex-col gap-2">
          <button
            onClick={() => setLightboxOpen(true)}
            className="w-9 h-9 flex items-center justify-center transition-colors hover:opacity-80"
            style={{
              background: "rgba(255,248,241,0.85)",
              backdropFilter: "blur(8px)",
              border: "0.5px solid #d4af37",
            }}
            aria-label="Zoom"
          >
            <ZoomIn className="h-4 w-4" style={{ color: "#735c00" }} />
          </button>
          <button
            onClick={() => setLightboxOpen(true)}
            className="w-9 h-9 flex items-center justify-center transition-colors hover:opacity-80"
            style={{
              background: "rgba(255,248,241,0.85)",
              backdropFilter: "blur(8px)",
              border: "0.5px solid #d4af37",
            }}
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" style={{ color: "#735c00" }} />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {thumbnails.length > 1 && (
        <div className="grid grid-cols-4 gap-3 mt-3">
          {thumbnails.map((src, idx) => (
            <button
              key={idx}
              onClick={() => selectImage(idx)}
              className={cn(
                "relative aspect-square overflow-hidden transition-all duration-200 active:scale-95",
                "border",
                selected === idx
                  ? "ring-2 opacity-100"
                  : "opacity-60 hover:opacity-90"
              )}
              style={{
                border: "0.5px solid #d4af37",
                padding: "6px",
                background: "#fcecce",
                ...(selected === idx ? { ringColor: "#735c00" } : {}),
                outline: selected === idx ? "2px solid #735c00" : "none",
                outlineOffset: "1px",
              }}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={selected === idx}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
          {/* Empty placeholders to fill 4 cols */}
          {Array.from({ length: Math.max(0, 4 - thumbnails.length) }, (_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square"
              style={{ border: "0.5px solid #d0c5af", background: "#f0e1c3", opacity: 0.4 }}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(10,8,4,0.92)" }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.1)", color: "#f5f0e8" }}
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative max-w-2xl w-full aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={thumbnails[selected]}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
              loading="lazy"
            />
          </div>
          {thumbnails.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {thumbnails.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelected(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    selected === idx ? "scale-125" : "opacity-50"
                  )}
                  style={{ background: selected === idx ? "#d4af37" : "#ffffff" }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
