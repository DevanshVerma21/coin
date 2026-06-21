// Public layout loading state — shown instantly on navigation before page data resolves
export default function PublicLoading() {
  return (
    <div
      className="flex-1 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-16 py-12 w-full"
      aria-busy="true"
      aria-label="Loading…"
    >
      {/* Hero skeleton */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="skeleton h-3 w-28 rounded" />
        <div className="skeleton h-10 w-72 rounded" />
        <div className="skeleton mx-auto rounded" style={{ width: "clamp(220px,40vw,360px)", aspectRatio: "1/1" }} />
        <div className="skeleton h-4 w-64 rounded" />
        <div className="flex gap-3">
          <div className="skeleton h-11 w-36 rounded" />
          <div className="skeleton h-11 w-36 rounded" />
        </div>
      </div>
    </div>
  );
}
