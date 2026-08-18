export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-40 bg-muted rounded" />

        {/* Title skeleton */}
        <div className="space-y-3">
          <div className="h-10 w-full bg-muted rounded-xl" />
          <div className="h-10 w-3/4 bg-muted rounded-xl" />
        </div>

        {/* Date / reading time */}
        <div className="h-4 w-48 bg-muted/60 rounded" />

        {/* Author info row */}
        <div className="flex items-center gap-4 py-4 border-y border-border">
          <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted/60 rounded" />
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full aspect-video rounded-2xl bg-muted" />

        {/* Body content lines */}
        <div className="space-y-4 pt-4">
          <div className="h-4 w-full bg-muted/80 rounded" />
          <div className="h-4 w-full bg-muted/80 rounded" />
          <div className="h-4 w-5/6 bg-muted/70 rounded" />
          <div className="h-4 w-full bg-muted/80 rounded" />
          <div className="h-4 w-2/3 bg-muted/60 rounded" />
        </div>
      </div>
    </div>
  );
}
