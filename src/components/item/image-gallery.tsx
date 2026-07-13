"use client";

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
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
  ].slice(0, 8);

  const [selected, setSelected]           = useState(0);
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function selectImage(idx: number) {
    if (idx === selected) return;
    setTransitioning(true);
    setTimeout(() => { setSelected(idx); setTransitioning(false); }, 200);
  }

  function openLightbox(idx: number) {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const lightboxPrev = useCallback(
    () => setLightboxIndex((i) => (i - 1 + thumbnails.length) % thumbnails.length),
    [thumbnails.length]
  );
  const lightboxNext = useCallback(
    () => setLightboxIndex((i) => (i + 1) % thumbnails.length),
    [thumbnails.length]
  );

  // showModal / close — runs synchronously after DOM update so the dialog is
  // in the browser's top layer before the paint (above ALL z-indexes).
  useLayoutEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (lightboxOpen) {
      if (!d.open) { d.showModal(); d.focus(); }
    } else {
      if (d.open) d.close();
    }
  }, [lightboxOpen]);

  // Native Escape fires the dialog "cancel" event — wire it to our handler.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onCancel = (e: Event) => { e.preventDefault(); closeLightbox(); };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [closeLightbox]);

  // Arrow key navigation + block all scroll keys while lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return;
    const BLOCK = new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","PageUp","PageDown"]);
    function onKey(e: KeyboardEvent) {
      if (BLOCK.has(e.key)) { e.preventDefault(); e.stopImmediatePropagation(); }
      if (e.key === "ArrowLeft")  lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    }
    document.addEventListener("keydown", onKey, { capture: true });
    return () => document.removeEventListener("keydown", onKey, { capture: true });
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  // Scroll lock on both html + body while lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return;
    const { documentElement: html, body } = document;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => { html.style.overflow = ""; body.style.overflow = ""; };
  }, [lightboxOpen]);

  // Mouse-wheel scroll → navigate images (no visible UI needed).
  useEffect(() => {
    if (!lightboxOpen) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (e.deltaY > 0 || e.deltaX > 0) lightboxNext();
      else lightboxPrev();
    }
    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => document.removeEventListener("wheel", onWheel, { capture: true });
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  // Touch swipe left/right → navigate images.
  useEffect(() => {
    if (!lightboxOpen) return;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) { dx < 0 ? lightboxNext() : lightboxPrev(); }
    };
    document.addEventListener("touchstart", onTouchStart, { capture: true });
    document.addEventListener("touchend", onTouchEnd, { capture: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart, { capture: true });
      document.removeEventListener("touchend", onTouchEnd, { capture: true });
    };
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  return (
    <>
      {/* ── Main image ──────────────────────────────────────────────── */}
      <div
        className="relative group overflow-hidden cursor-zoom-in"
        style={{ border: "0.5px solid #d4af37", padding: "8px", background: "#ffffff" }}
        onClick={() => openLightbox(selected)}
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
          {sold && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span
                className="px-6 py-2 text-[13px] font-semibold tracking-[0.14em] uppercase"
                style={{ background: "#1a1208", color: "#f5f0e8", fontFamily: "var(--font-public-sans)" }}
              >
                Sold
              </span>
            </div>
          )}
        </div>

        {rarity && (
          <div
            className="absolute top-5 right-5 w-14 h-14 rounded-full flex flex-col items-center justify-center z-10 shadow-lg"
            style={{
              background: "linear-gradient(145deg, #d4af37, #735c00)",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.15)",
              border: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            <span className="text-[9px] font-semibold leading-tight uppercase"
              style={{ fontFamily: "var(--font-public-sans)", color: "#fff", letterSpacing: "0.05em" }}>
              RARITY
            </span>
            <span className="font-bold leading-none"
              style={{ fontFamily: "var(--font-playfair)", color: "#fff", fontSize: rarity.length > 2 ? "11px" : "14px" }}>
              {RARITY_LABEL[rarity]}
            </span>
          </div>
        )}

        <div className="absolute bottom-5 right-5 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openLightbox(selected)}
            className="w-9 h-9 flex items-center justify-center hover:opacity-80"
            style={{ background: "rgba(255,248,241,0.85)", backdropFilter: "blur(8px)", border: "0.5px solid #d4af37" }}
            aria-label="Zoom">
            <ZoomIn className="h-4 w-4" style={{ color: "#735c00" }} />
          </button>
          <button onClick={() => openLightbox(selected)}
            className="w-9 h-9 flex items-center justify-center hover:opacity-80"
            style={{ background: "rgba(255,248,241,0.85)", backdropFilter: "blur(8px)", border: "0.5px solid #d4af37" }}
            aria-label="Fullscreen">
            <Maximize2 className="h-4 w-4" style={{ color: "#735c00" }} />
          </button>
        </div>
      </div>

      {/* ── Thumbnails ──────────────────────────────────────────────── */}
      {thumbnails.length > 1 && (
        <div className="grid grid-cols-4 gap-3 mt-3">
          {thumbnails.map((src, idx) => (
            <button
              key={idx}
              onClick={() => { selectImage(idx); openLightbox(idx); }}
              className={cn(
                "relative aspect-square overflow-hidden transition-all duration-200 active:scale-95 border",
                selected === idx ? "ring-2 opacity-100" : "opacity-60 hover:opacity-90"
              )}
              style={{
                border: "0.5px solid #d4af37", padding: "6px", background: "#fcecce",
                outline: selected === idx ? "2px solid #735c00" : "none", outlineOffset: "1px",
              }}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={selected === idx}
            >
              <Image src={src} alt={`${title} thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
          {thumbnails.length < 4 &&
            Array.from({ length: 4 - thumbnails.length }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square"
                style={{ border: "0.5px solid #d0c5af", background: "#f0e1c3", opacity: 0.4 }} />
            ))}
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────────────────
           <dialog> + showModal() = browser top layer, above all z-indexes.
           The dialog itself is transparent; the inner backdrop div provides
           the dark fill so click-outside detection works cleanly.          */}
      <dialog
        ref={dialogRef}
        className="fixed inset-0 p-0 m-0 border-0 outline-none overflow-hidden"
        style={{ background: "transparent", width: "100vw", height: "100vh", maxWidth: "100vw", maxHeight: "100vh" }}
        onKeyDown={(e) => {
          const block = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","PageUp","PageDown"];
          if (block.includes(e.key)) { e.preventDefault(); e.stopPropagation(); }
          if (e.key === "ArrowLeft")  lightboxPrev();
          if (e.key === "ArrowRight") lightboxNext();
        }}
      >
        {/* Backdrop — click empty area to close */}
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          {/* Close button — only visible UI element */}
          <button
            className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center
                       bg-white/15 border border-white/20 cursor-pointer hover:bg-white/25 transition-colors"
            style={{ color: "#f5f0e8" }}
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Image — no arrows, no dots; navigate via keyboard or swipe */}
          <div className="relative w-full h-[85vh] max-w-5xl mx-auto px-4">
            <Image
              src={thumbnails[lightboxIndex]}
              alt={`${title} — image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1280px"
              priority
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
