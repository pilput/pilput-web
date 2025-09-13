import { Skeleton } from "../ui/skeleton";

const PostItemrPulse = () => {
  return (
    <article className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5">
        {/* Title & Content Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        {/* Metadata Skeleton */}
        <div className="mt-4 space-y-3">
          <Skeleton className="h-3 w-24" />
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostItemrPulse;
