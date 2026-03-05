export default function RouteLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm">
        <div className="h-3 w-28 rounded-full skeleton" />
        <div className="mt-4 h-9 w-4/5 rounded-xl skeleton" />
        <div className="mt-3 h-9 w-3/5 rounded-xl skeleton" />
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="h-14 rounded-xl skeleton" />
          <div className="h-14 rounded-xl skeleton" />
          <div className="h-14 rounded-xl skeleton" />
        </div>
      </div>
    </div>
  );
}
