import { Skeleton } from "../ui/skeleton";

const PostItemPulse = () => {
  return (
    <article className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 animate-pulse">
      <div className="p-5">
        {/* Title & Content Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>

        {/* Metadata Skeleton */}
        <div className="mt-4 space-y-3">
          <Skeleton className="h-3 w-32 rounded" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-3 w-10 rounded" />
              <Skeleton className="h-3 w-8 rounded" />
              <Skeleton className="h-3 w-10 rounded" />
            </div>
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostItemPulse;
