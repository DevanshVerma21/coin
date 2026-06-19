import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ImageGallery } from "@/components/item/image-gallery";
import { WhatsAppInquiryButton } from "@/components/item/whatsapp-inquiry-button";
import { DownloadButton } from "@/components/item/download-button";
import { RelatedItems } from "@/components/item/related-items";
import { getItemBySlug, getRelatedItems } from "@/actions/items";
import { formatPrice } from "@/lib/utils";

// Revalidate at most once per hour — enables ISR for fast responses
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: "Not Found" };
  return {
    title: item.title,
    description: item.description.slice(0, 160),
    openGraph: {
      title: item.title,
      description: item.description.slice(0, 160),
      images: [{ url: item.frontImage, width: 800, height: 800, alt: item.title }],
    },
  };
}

export default async function CoinDetailPage({ params }: PageProps) {
  // Require login to view item details
  const session = await auth();
  if (!session?.user) {
    const { slug } = await params;
    redirect(`/signin?callbackUrl=/coins/${slug}`);
  }

  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item || item.type !== "coin") notFound();

  const categoryIds = item.categories.map((c) =>
    typeof c === "object" ? c._id : c
  );
  const categoryLabel =
    item.categories.length > 0 && typeof item.categories[0] === "object"
      ? item.categories[0].name
      : "British India";

  const [relatedItems] = await Promise.all([
    getRelatedItems(item._id, categoryIds, "coin", 3),
  ]);

  const specs = [
    { label: "MINTAGE YEAR", value: `${item.year} AD` },
    { label: "DENOMINATION", value: item.denomination ?? "—" },
    { label: "COMPOSITION", value: item.composition ?? "—" },
    { label: "WEIGHT", value: item.weight ?? "—" },
    { label: "MINT", value: item.mint ?? "—" },
    { label: "DIAMETER", value: item.diameter ?? "—" },
  ].filter((s) => s.value !== "—");

  const hasProvenance = item.provenance && item.provenance.length > 0;

  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh" }}>
      <main className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-16 pt-10 pb-20">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2">
          {[
            { href: "/coins", label: "COLLECTIONS" },
            ...(categoryLabel ? [{ href: `/coins?category=${categoryIds[0] ?? ""}`, label: categoryLabel.toUpperCase() }] : []),
            { href: null, label: item.title.toUpperCase().slice(0, 40) },
          ].map((crumb, i, arr) => (
            <React.Fragment key={i}>
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[11px] font-semibold tracking-[0.1em] transition-colors hover:text-[#735c00]"
                  style={{ fontFamily: "var(--font-public-sans)", color: "#8a7560" }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="text-[11px] font-semibold tracking-[0.1em]"
                  style={{ fontFamily: "var(--font-public-sans)", color: "#735c00" }}
                >
                  {crumb.label}
                </span>
              )}
              {i < arr.length - 1 && (
                <span className="text-[11px]" style={{ color: "#d0c5af" }}>›</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">

          {/* Gallery — 7 cols */}
          <div className="lg:col-span-7">
            <ImageGallery
              frontImage={item.frontImage}
              backImage={item.backImage}
              additionalImages={item.additionalImages ?? []}
              title={item.title}
              rarity={item.rarity}
              sold={item.sold}
            />
          </div>

          {/* Content — 5 cols */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Header */}
            <div className="mb-8">
              <p
                className="mb-3 tracking-[0.2em] uppercase block"
                style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#6e5a50", fontWeight: 600 }}
              >
                Historical Artifact No. {item.itemNumber}
              </p>
              <h1
                className="font-serif font-bold leading-tight mb-3"
                style={{ fontSize: "clamp(28px, 4vw, 48px)", color: "#1a1208", letterSpacing: "-0.01em" }}
              >
                {item.title}
              </h1>
              {(item.denomination ?? item.mint) && (
                <p
                  className="font-serif font-semibold"
                  style={{ fontSize: "22px", color: "#7b5735" }}
                >
                  {item.denomination && item.mint
                    ? `${item.denomination} | ${item.mint}`
                    : item.denomination ?? item.mint}
                </p>
              )}
            </div>

            {/* Archival Specifications */}
            {specs.length > 0 && (
              <div
                className="mb-10 p-6 sm:p-8"
                style={{
                  border: "0.5px solid #d4af37",
                  background: "#fff2db",
                }}
              >
                <h3
                  className="tracking-[0.16em] uppercase pb-4 mb-6"
                  style={{
                    fontFamily: "var(--font-public-sans)",
                    fontSize: "11px",
                    color: "#6b5c45",
                    fontWeight: 600,
                    borderBottom: "1px solid #d0c5af",
                  }}
                >
                  Archival Specifications
                </h3>
                <div className="grid grid-cols-2 gap-y-5">
                  {specs.map((spec) => (
                    <div key={spec.label}>
                      <p
                        className="mb-1 tracking-[0.1em] uppercase"
                        style={{ fontFamily: "var(--font-public-sans)", fontSize: "10px", color: "#8a7560", fontWeight: 500 }}
                      >
                        {spec.label}
                      </p>
                      <p
                        className="font-semibold"
                        style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "17px", color: "#1a1208" }}
                      >
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            {!item.sold && (
              <div className="mb-8">
                <p
                  className="mb-1 tracking-[0.1em] uppercase"
                  style={{ fontFamily: "var(--font-public-sans)", fontSize: "10px", color: "#8a7560", fontWeight: 500 }}
                >
                  Asking Price
                </p>
                <p
                  className="font-serif font-bold"
                  style={{ fontSize: "32px", color: "#735c00" }}
                >
                  {formatPrice(item.price)}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3 mt-auto">
              <WhatsAppInquiryButton item={item} />
              <DownloadButton />
            </div>
          </div>
        </div>

        {/* Lower sections */}
        <div
          className="pt-16"
          style={{ borderTop: "1px solid #d0c5af" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* Historical Context + Provenance */}
            <div className="lg:col-span-8 space-y-14">

              {/* Description / Historical Context */}
              <section>
                <h2
                  className="font-serif font-semibold mb-8 flex items-center gap-4"
                  style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "#1a1208" }}
                >
                  <span className="inline-block w-8 h-px" style={{ background: "#735c00" }} />
                  Historical Context
                </h2>
                <div className="space-y-5">
                  {(item.historicalContext ?? item.description)
                    .split("\n\n")
                    .filter(Boolean)
                    .map((para, i) => (
                      <p
                        key={i}
                        style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "18px", color: "#4d4635", lineHeight: "1.7" }}
                      >
                        {para}
                      </p>
                    ))}
                </div>
              </section>

              {/* Provenance timeline */}
              {hasProvenance && (
                <section>
                  <h2
                    className="font-serif font-semibold mb-8 flex items-center gap-4"
                    style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "#1a1208" }}
                  >
                    <span className="inline-block w-8 h-px" style={{ background: "#735c00" }} />
                    Provenance
                  </h2>
                  <div
                    className="relative p-8 sm:p-10 overflow-hidden"
                    style={{
                      border: "0.5px solid #d4af37",
                      background: "#f0e1c3",
                    }}
                  >
                    {/* Decorative watermark */}
                    <div className="absolute -top-8 -right-8 opacity-[0.06] pointer-events-none select-none" aria-hidden>
                      <svg viewBox="0 0 160 160" width="160" height="160" fill="none">
                        <path d="M40 80 Q60 40 80 80 Q100 120 120 80" stroke="#735c00" strokeWidth="2" fill="none" />
                        <circle cx="80" cy="80" r="60" stroke="#735c00" strokeWidth="1" fill="none" />
                      </svg>
                    </div>
                    <ul className="space-y-8 relative z-10">
                      {item.provenance!.map((entry, i) => (
                        <li key={i} className="flex gap-5 sm:gap-7">
                          <div
                            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-serif font-semibold text-[15px]"
                            style={{ border: "1px solid #735c00", color: "#735c00", background: "#fff8f1" }}
                          >
                            {i + 1}
                          </div>
                          <div>
                            <h4
                              className="mb-1.5 tracking-[0.1em] uppercase"
                              style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#7b5735", fontWeight: 600 }}
                            >
                              {entry.period}
                            </h4>
                            <p style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "15px", color: "#4d4635", lineHeight: "1.6" }}>
                              {entry.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">

                {/* Curator's note */}
                <div
                  className="p-6 sm:p-7"
                  style={{ borderLeft: "3px solid #735c00", background: "#fff2db" }}
                >
                  <p
                    className="mb-3 tracking-[0.1em] uppercase"
                    style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#7b5735", fontWeight: 600 }}
                  >
                    Curator&apos;s Note
                  </p>
                  <p
                    className="italic leading-relaxed mb-5"
                    style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "15px", color: "#4d4635" }}
                  >
                    &ldquo;{item.description.slice(0, 220)}{item.description.length > 220 ? "…" : ""}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ background: "#735c00" }}
                    >
                      NT
                    </div>
                    <div>
                      <p
                        className="font-bold tracking-[0.08em] uppercase text-[11px]"
                        style={{ fontFamily: "var(--font-public-sans)", color: "#1a1208" }}
                      >
                        NTIK Archives
                      </p>
                      <p style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560" }}>
                        Senior Numismatist
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certification */}
                {(item.grade ?? item.gradeType) && (
                  <div>
                    <p
                      className="mb-4 tracking-[0.1em] uppercase"
                      style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560", fontWeight: 500 }}
                    >
                      Certification
                    </p>
                    <div className="space-y-3">
                      {item.grade && (
                        <div
                          className="flex items-center justify-between px-4 py-3"
                          style={{ border: "0.5px solid #d4af37", background: "#fff8f1" }}
                        >
                          <span
                            className="text-[11px] font-semibold tracking-[0.1em] uppercase"
                            style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
                          >
                            NGC GRADE
                          </span>
                          <span
                            className="font-serif font-bold text-[20px]"
                            style={{ color: "#735c00" }}
                          >
                            {item.grade}
                          </span>
                        </div>
                      )}
                      {item.gradeType && (
                        <div
                          className="flex items-center justify-between px-4 py-3"
                          style={{ border: "0.5px solid #d4af37", background: "#fff8f1" }}
                        >
                          <span
                            className="text-[11px] font-semibold tracking-[0.1em] uppercase"
                            style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
                          >
                            STRIKE
                          </span>
                          <span
                            className="font-serif font-bold text-[14px]"
                            style={{ color: "#735c00" }}
                          >
                            {item.gradeType.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Category tags */}
                {item.categories.length > 0 && (
                  <div>
                    <p
                      className="mb-3 tracking-[0.1em] uppercase"
                      style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560", fontWeight: 500 }}
                    >
                      Collection
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.categories.map((cat) => {
                        const name = typeof cat === "object" ? cat.name : cat;
                        const id = typeof cat === "object" ? cat._id : cat;
                        return (
                          <Link
                            key={id}
                            href={`/coins?category=${id}`}
                            className="px-3 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors text-[#735c00] hover:bg-[#d4af37] hover:text-white"
                            style={{
                              fontFamily: "var(--font-public-sans)",
                              border: "0.5px solid #d4af37",
                              background: "#fff8f1",
                            }}
                          >
                            {name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related items */}
          <RelatedItems items={relatedItems} categoryLabel={categoryLabel} type="coin" />
        </div>
      </main>
    </div>
  );
}
