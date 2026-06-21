export default function SigninLoading() {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-10 sm:py-14"
      style={{ minHeight: "calc(100vh - 60px)", background: "#f5f0e8" }}
      aria-busy="true"
    >
      <div className="w-full max-w-[420px]">
        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(166,148,120,0.35)",
            borderRadius: "2px",
          }}
        >
          {/* Tab row */}
          <div className="grid grid-cols-2" style={{ borderBottom: "1px solid rgba(166,148,120,0.2)" }}>
            <div className="py-4 flex justify-center"><div className="skeleton h-3 w-14 rounded" /></div>
            <div className="py-4 flex justify-center" style={{ background: "#faf6ef" }}><div className="skeleton h-3 w-24 rounded" /></div>
          </div>
          {/* Body */}
          <div className="px-7 py-6 space-y-4">
            <div className="skeleton h-11 w-full rounded" />
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(166,148,120,0.3)" }} />
              <div className="skeleton h-2.5 w-4 rounded" />
              <div className="flex-1 h-px" style={{ background: "rgba(166,148,120,0.3)" }} />
            </div>
            <div className="space-y-1">
              <div className="skeleton h-2.5 w-24 rounded" />
              <div className="skeleton h-10 w-full rounded" />
            </div>
            <div className="space-y-1">
              <div className="skeleton h-2.5 w-16 rounded" />
              <div className="skeleton h-10 w-full rounded" />
            </div>
            <div className="skeleton h-11 w-full rounded" />
          </div>
          <div className="px-7 py-4" style={{ background: "#faf6ef" }}>
            <div className="skeleton h-3 w-full rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
