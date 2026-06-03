import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PostListPulse = () => {
  return (
    <Card className="h-full border-border/70 bg-card shadow-sm flex flex-col overflow-hidden">
      {/* Cover Image placeholder (16/9 aspect ratio) */}
      <Skeleton className="relative w-full aspect-video rounded-none" />

      <CardHeader className="space-y-4 pb-3">
        {/* Author Info */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32 max-w-full rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-11/12 rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </div>
      </CardHeader>

      <CardContent className="pb-3 grow space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/55 mt-auto flex flex-col items-stretch gap-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4.5 w-8 rounded" />
            <Skeleton className="h-4.5 w-8 rounded" />
          </div>
          <Skeleton className="h-4.5 w-8 rounded" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostListPulse;
