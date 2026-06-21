export default function NotesLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-16 py-8" aria-busy="true">
      <div className="flex gap-3 mb-6">
        <div className="skeleton h-9 w-32 rounded-lg" />
        <div className="skeleton h-9 w-36 rounded-lg" />
        <div className="skeleton h-9 w-28 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="rounded overflow-hidden" style={{ border: "1px solid #d0c5af" }}>
            <div className="skeleton aspect-square" />
            <div className="p-3 space-y-2" style={{ background: "#fcecce" }}>
              <div className="skeleton h-2.5 w-16 rounded" />
              <div className="skeleton h-3.5 w-full rounded" />
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-3.5 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
