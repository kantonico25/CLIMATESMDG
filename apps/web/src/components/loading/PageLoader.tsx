type PageLoaderProps = {
  label?: string;
};

export default function PageLoader({ label = "Loading content..." }: PageLoaderProps) {
  return (
    <div className="py-14 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 h-8 w-52 rounded-xl skeleton" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-56 rounded-2xl skeleton" />
          <div className="h-56 rounded-2xl skeleton" />
          <div className="h-56 rounded-2xl skeleton" />
        </div>
        <p className="mt-8 text-center text-sm text-slate-500 animate-pulse">{label}</p>
      </div>
    </div>
  );
}
