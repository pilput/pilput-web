import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const PostItemPulse = () => {
  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-lg" />
      </CardHeader>
      
      <CardContent className="pb-3 grow space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostItemPulse;
