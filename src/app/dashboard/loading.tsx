export default function DashboardLoading() {
  return (
    <div className="w-full space-y-8 p-4 md:p-8 animate-pulse">
      {/* Header section skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-8 w-48 bg-muted rounded-lg" />
        <div className="h-4 w-72 bg-muted/60 rounded-md" />
      </div>

      {/* KPI metric cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border bg-card space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-8 rounded-lg bg-muted" />
            </div>
            <div className="h-7 w-32 bg-muted rounded" />
            <div className="h-3 w-40 bg-muted/60 rounded" />
          </div>
        ))}
      </div>

      {/* Charts skeleton grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="h-6 w-36 bg-muted rounded" />
          <div className="h-64 bg-muted/40 rounded-xl" />
        </div>
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="h-6 w-36 bg-muted rounded" />
          <div className="h-64 bg-muted/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
