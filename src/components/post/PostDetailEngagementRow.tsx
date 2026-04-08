"use client";

import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";
import BookmarkButton from "@/components/post/BookmarkButton";
import { LikeDetailDefaultButton } from "@/components/post/LikeButton";
import { usePostLike } from "@/components/post/usePostLike";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostDetailEngagementRowProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  createdAt: string;
  viewCount: number;
}

export function PostDetailEngagementRow({
  postId,
  initialLiked,
  initialCount,
  createdAt,
  viewCount,
}: PostDetailEngagementRowProps) {
  const { liked, count, busy, onToggle } = usePostLike(
    postId,
    initialLiked,
    initialCount,
  );

  const actionBtnClass =
    "h-9 min-w-9 shrink-0 rounded-md border border-border/80 bg-background px-2 shadow-sm";

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-3",
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground",
        )}
      >
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                tabIndex={0}
                className="cursor-default rounded-sm tabular-nums outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span className="text-muted-foreground/40" aria-hidden>
          ·
        </span>

        <span className="inline-flex items-center gap-1.5 tabular-nums">
          <Eye
            className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80"
            aria-hidden
          />
          <span>{viewCount.toLocaleString()}</span>
          <span className="font-normal">views</span>
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <LikeDetailDefaultButton
          liked={liked}
          count={count}
          busy={busy}
          onToggle={onToggle}
          showCount
          className={cn(actionBtnClass, "gap-1.5 px-2.5")}
        />
        <BookmarkButton
          postId={postId}
          variant="compact"
          className={cn(
            actionBtnClass,
            "inline-flex w-9 items-center justify-center p-0",
          )}
        />
      </div>
    </div>
  );
}
