export default function Loading() {
  return (
    <div className="container-site py-16 md:py-24" aria-busy="true">
      <div className="h-12 w-2/3 max-w-xl animate-pulse bg-line/60" />
      <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] animate-pulse bg-line/40" />
            <div className="mt-4 h-4 w-1/2 animate-pulse bg-line/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
