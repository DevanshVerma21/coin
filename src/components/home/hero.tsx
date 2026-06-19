import React from "react";
import Link from "next/link";
import Image from "next/image";

const HERO_IMG =
  "https://res.cloudinary.com/djprgnsae/image/upload/v1781638332/ntik-heritage/ntik-heritage/AB6AXuD4YXq5--RR7gaBhG6CM9iNv-sOJWN7msF7.jpg";

interface HeroProps {
  featuredImageUrl?: string;
}

export function Hero({ featuredImageUrl }: HeroProps) {
  const imgSrc = featuredImageUrl ?? HERO_IMG;

  return (
    <section
      className="w-full py-12 sm:py-16 lg:py-20 px-5 sm:px-8"
      style={{ background: "#f5f0e8" }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Established label */}
        <p
          className="text-center mb-5 tracking-[0.22em] uppercase animate-fade-in-up"
          style={{
            fontFamily: "var(--font-public-sans)",
            fontSize: "11px",
            color: "#8a7560",
            fontWeight: 500,
            animationDelay: "0ms",
          }}
        >
          Established 1924
        </p>

        {/* Main headline */}
        <h1
          className="text-center font-serif font-bold leading-none tracking-tight mb-8 animate-fade-in-up"
          style={{
            fontSize: "clamp(32px, 6vw, 72px)",
            color: "#1a1208",
            letterSpacing: "-0.01em",
            animationDelay: "80ms",
          }}
        >
          Preserving Tactile History
        </h1>

        {/* Spotlight coin image */}
        <div
          className="mx-auto mb-8 relative overflow-hidden animate-fade-in-scale"
          style={{
            width: "clamp(220px, 40vw, 360px)",
            aspectRatio: "1 / 1",
            borderRadius: "4px",
            background: "radial-gradient(ellipse at 45% 40%, #3d2c0e 0%, #1a1208 50%, #0d0a06 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15)",
            animationDelay: "150ms",
          }}
        >
          <Image
            src={imgSrc}
            alt="Featured numismatic piece"
            fill
            className="object-contain p-6"
            priority
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 40vw, 360px"
          />
        </div>

        {/* Italic subtitle */}
        <p
          className="text-center italic mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{
            fontFamily: "var(--font-eb-garamond)",
            fontSize: "clamp(14px, 1.8vw, 17px)",
            color: "#6b5c45",
            maxWidth: "480px",
            animationDelay: "250ms",
          }}
        >
          &ldquo;The Premier Destination for Rare Numismatics. Discover the legacy of dynasties
          through the metals that built them.&rdquo;
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "350ms" }}
        >
          <Link
            href="/coins"
            className="inline-flex items-center justify-center h-11 px-8 text-[12px] font-semibold tracking-[0.12em] uppercase transition-all hover:opacity-90 hover:-translate-y-0.5 w-full sm:w-auto"
            style={{
              fontFamily: "var(--font-public-sans)",
              background: "#1a1208",
              color: "#f5f0e8",
              borderRadius: "2px",
            }}
          >
            View Collection
          </Link>
          <Link
            href="#inquiry"
            className="inline-flex items-center justify-center h-11 px-8 text-[12px] font-semibold tracking-[0.12em] uppercase transition-all text-[#1a1208] hover:bg-[#1a1208] hover:text-[#f5f0e8] w-full sm:w-auto"
            style={{
              fontFamily: "var(--font-public-sans)",
              border: "1px solid #1a1208",
              borderRadius: "2px",
            }}
          >
            Private Inquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
