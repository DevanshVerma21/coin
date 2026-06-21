export default function AdminLoading() {
  return (
    <div className="p-4 sm:p-6 space-y-6" aria-busy="true">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-8 w-16 rounded" />
            <div className="skeleton h-2.5 w-28 rounded" />
          </div>
        ))}
      </div>
      {/* Table skeleton */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border"><div className="skeleton h-4 w-32 rounded" /></div>
        <div className="divide-y divide-border">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="skeleton h-10 w-10 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3.5 w-48 rounded" />
                <div className="skeleton h-2.5 w-32 rounded" />
              </div>
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
