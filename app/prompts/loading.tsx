export default function PromptsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        </div>

        {/* Filters skeleton */}
        <div className="flex gap-4">
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
          <div className="h-10 w-24 animate-pulse rounded bg-muted" />
        </div>

        {/* Cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-lg border p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                <div className="h-6 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
