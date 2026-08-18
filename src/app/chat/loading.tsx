export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex w-72 flex-col border-r border-border bg-card p-4 space-y-4">
        <div className="h-9 w-full bg-muted rounded-lg" />
        <div className="space-y-2 pt-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-full bg-muted/60 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main Chat Area Skeleton */}
      <div className="flex-1 flex flex-col justify-between p-4 md:p-6 bg-background">
        <div className="space-y-6 max-w-3xl w-full mx-auto pt-8">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
            <div className="h-16 w-3/4 bg-muted/60 rounded-2xl" />
          </div>
          <div className="flex gap-3 justify-end">
            <div className="h-12 w-2/3 bg-muted rounded-2xl" />
            <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
          </div>
        </div>

        <div className="max-w-3xl w-full mx-auto">
          <div className="h-14 w-full bg-muted/60 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
