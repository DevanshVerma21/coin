export default function NoteDetailLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-16 py-10" aria-busy="true">
      <div className="flex gap-2 mb-10">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-3 rounded" />
        <div className="skeleton h-3 w-32 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
        <div className="lg:col-span-7 space-y-3">
          <div className="skeleton aspect-square rounded" style={{ border: "0.5px solid #d4af37" }} />
          <div className="grid grid-cols-4 gap-3">
            {[0,1,2,3].map(i => <div key={i} className="skeleton aspect-square rounded" />)}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-5">
          <div className="skeleton h-3 w-36 rounded" />
          <div className="skeleton h-10 w-full rounded" />
          <div className="skeleton h-6 w-48 rounded" />
          <div className="skeleton rounded p-6 space-y-4" style={{ border: "0.5px solid #d4af37", background: "#fff2db" }}>
            <div className="skeleton h-3 w-40 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className="space-y-1">
                  <div className="skeleton h-2.5 w-20 rounded" />
                  <div className="skeleton h-4 w-28 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="skeleton h-14 w-full rounded" />
          <div className="skeleton h-14 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
