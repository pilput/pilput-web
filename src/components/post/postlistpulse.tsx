
const Postlistpulse = () => {
  return (
    <article className="group relative animate-pulse bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
      {/* Cover Image placeholder (16/9 aspect ratio) */}
      <div className="relative w-full aspect-[16/9] bg-gray-200 dark:bg-gray-800" />

      <div className="p-6 flex-1 flex flex-col">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="h-4 w-32 max-w-full rounded bg-gray-200 dark:bg-gray-800 mb-2" />
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Title & Content */}
        <div className="space-y-3 flex-1 mb-4">
          <div className="h-7 w-11/12 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="pt-2 space-y-2">
             <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
             <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
             <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Tags & Actions */}
        <div className="mt-auto">
             <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-800" />
             </div>
             
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-800" />
             </div>
        </div>
      </div>
    </article>
  );
};

export default Postlistpulse;
