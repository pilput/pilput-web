
const Postlistpulse = () => {
  return (
    <article className="group relative animate-pulse bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
      {/* Cover Image placeholder (shorter height) */}
      <div className="relative h-24 w-full overflow-hidden bg-gray-200 dark:bg-gray-800" />

      <div className="p-5 flex-1 flex flex-col">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="h-3 w-40 max-w-full rounded bg-gray-200 dark:bg-gray-800 mb-1.5" />
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-2.5 w-14 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>

        {/* Title & Content */}
        <div className="space-y-2.5 flex-1">
          <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-9/12 rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Tags & Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <div className="h-6 w-14 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-10 rounded-lg bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default Postlistpulse;
