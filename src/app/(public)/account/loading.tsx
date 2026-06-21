export default function AccountLoading() {
  return (
    <div className="min-h-screen px-5 sm:px-8" style={{ background: "#f5f0e8" }} aria-busy="true">
      <div className="max-w-[580px] mx-auto py-12 sm:py-16 space-y-6">
        <div className="skeleton h-3 w-28 rounded" />
        <div className="skeleton h-9 w-48 rounded" />
        <div style={{ background: "#ffffff", border: "1px solid rgba(166,148,120,0.3)", borderRadius: "2px" }}>
          <div className="flex items-center gap-4 p-6" style={{ borderBottom: "1px solid rgba(166,148,120,0.2)" }}>
            <div className="skeleton h-16 w-16 rounded-full flex-shrink-0" />
            <div className="space-y-2">
              <div className="skeleton h-5 w-36 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          </div>
          <div className="p-6 space-y-5">
            {[0,1,2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="skeleton h-9 w-9 rounded-full flex-shrink-0" />
                <div className="space-y-1.5">
                  <div className="skeleton h-2.5 w-20 rounded" />
                  <div className="skeleton h-4 w-48 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 p-6" style={{ borderTop: "1px solid rgba(166,148,120,0.2)" }}>
            <div className="skeleton h-10 w-36 rounded" />
            <div className="skeleton h-10 w-28 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
