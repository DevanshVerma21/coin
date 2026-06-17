"use client";

export function DownloadButton() {
  return (
    <button
      onClick={() => window.print()}
      type="button"
      className="w-full h-14 text-[12px] font-semibold tracking-[0.14em] uppercase flex items-center justify-center gap-3 transition-all hover:bg-[#735c00]/5"
      style={{
        fontFamily: "var(--font-public-sans)",
        border: "1px solid #735c00",
        color: "#735c00",
      }}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download Catalogue Entry
    </button>
  );
}
