import type { Metadata } from "next";
import { CuratorInquiry } from "@/components/home/curator-inquiry";

export const metadata: Metadata = {
  title: "Curators — Private Consultation",
  description:
    "Connect with NTIK's expert curators for private acquisition advice, authentication services, and archival preservation guidance.",
};

export default function CuratorsPage() {
  return (
    <div style={{ background: "#f5f0e8" }}>
      {/* Page header */}
      <div
        className="px-5 sm:px-8 py-12 sm:py-16"
        style={{ borderBottom: "1px solid rgba(166,148,120,0.3)" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <p
            className="mb-3 tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560", fontWeight: 500 }}
          >
            Expert Services
          </p>
          <h1
            className="font-serif font-bold leading-tight"
            style={{ fontSize: "clamp(30px, 5vw, 56px)", color: "#1a1208", maxWidth: "600px" }}
          >
            Our Curators
          </h1>
          <p
            className="mt-4 leading-relaxed"
            style={{
              fontFamily: "var(--font-eb-garamond)",
              fontSize: "18px",
              color: "#6b5c45",
              maxWidth: "540px",
            }}
          >
            A team of specialist numismatists with decades of combined experience in
            authentication, acquisition, and archival preservation of rare coins and currency.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <div className="px-5 sm:px-8 py-14 sm:py-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Authentication",
              body: "Third-party certified authentication for all periods — Mughal, colonial, Republic and beyond.",
            },
            {
              title: "Private Acquisition",
              body: "Discrete sourcing of specific pieces from private estates, auctions, and international dealers.",
            },
            {
              title: "Archival Preservation",
              body: "Museum-grade storage consultation, documentation, and conservation treatment recommendations.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="p-6"
              style={{ background: "#ffffff", border: "1px solid rgba(166,148,120,0.25)", borderRadius: "2px" }}
            >
              <h3
                className="font-serif font-semibold mb-3"
                style={{ fontSize: "20px", color: "#1a1208" }}
              >
                {s.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "15px", color: "#6b5c45" }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reuse the CuratorInquiry form */}
      <CuratorInquiry />
    </div>
  );
}
