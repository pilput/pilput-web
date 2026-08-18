export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading content...
        </p>
      </div>
    </div>
  );
}
