"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { getToken } from "@/utils/Auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePostLike } from "@/components/post/usePostLike";

interface LikeButtonProps {
  postId: string;
  /** From post payload when API sends `is_liked_by_current_user`. */
  initialLiked?: boolean;
  initialCount: number;
  className?: string;
  iconClassName?: string;
  variant?: "default" | "compact" | "inline";
}

/** Default (bordered) like control — shared with detail meta row. */
export function LikeDetailDefaultButton({
  liked,
  count,
  busy,
  onToggle,
  className,
  iconClassName,
  /** When false, only the heart is shown (count is shown elsewhere, e.g. meta row). */
  showCount = true,
}: {
  liked: boolean;
  count: number;
  busy: boolean;
  onToggle: (e: MouseEvent) => void;
  className?: string;
  iconClassName?: string;
  showCount?: boolean;
}) {
  const pathname = usePathname();
  const loginHref = `/login?redirect=${encodeURIComponent(pathname || "/")}`;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            disabled={busy}
            onClick={(e) => void onToggle(e)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-border/80 bg-background px-3 text-sm font-medium shadow-sm transition-colors",
              "disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-foreground",
              liked ? "border-red-500/30 text-red-500" : "text-muted-foreground",
              className,
            )}
            whileHover={{ scale: 1.01 }}
            aria-pressed={liked}
            aria-label={
              showCount
                ? `${liked ? "Unlike" : "Like"}, ${count} ${count === 1 ? "like" : "likes"}`
                : liked
                  ? "Unlike"
                  : "Like"
            }
          >
            <Heart
              className={cn(
                "h-4 w-4 shrink-0",
                liked ? "fill-current text-red-500" : "",
                iconClassName,
              )}
            />
            {showCount && (
              <span className="tabular-nums min-w-[1ch]">{count}</span>
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {!getToken() ? (
            <span>
              Sign in to like —{" "}
              <Link href={loginHref} className="underline font-medium">
                Log in
              </Link>
            </span>
          ) : liked ? (
            "Remove your like"
          ) : (
            "Like this post"
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function LikeButton({
  postId,
  initialLiked = false,
  initialCount,
  className,
  iconClassName,
  variant = "default",
}: LikeButtonProps) {
  const pathname = usePathname();
  const loginHref = `/login?redirect=${encodeURIComponent(pathname || "/")}`;

  const { liked, count, busy, onToggle } = usePostLike(
    postId,
    initialLiked,
    initialCount,
  );

  if (variant === "inline") {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              disabled={busy}
              onClick={(e) => void onToggle(e)}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50",
                liked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500",
                className,
              )}
              whileHover={{ scale: 1.02 }}
              aria-pressed={liked}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                className={cn(
                  "w-4 h-4 shrink-0",
                  liked ? "fill-current" : "",
                  iconClassName,
                )}
              />
              <span className="tabular-nums min-w-[1ch]">{count}</span>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {!getToken() ? (
              <span>
                Sign in to like —{" "}
                <Link href={loginHref} className="underline font-medium">
                  Log in
                </Link>
              </span>
            ) : liked ? (
              "Unlike"
            ) : (
              "Like"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "compact") {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              disabled={busy}
              onClick={(e) => void onToggle(e)}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg p-2 transition-colors disabled:opacity-50 hover:bg-muted",
                liked ? "text-red-500" : "text-muted-foreground",
                className,
              )}
              whileHover={{ scale: 1.05 }}
              aria-pressed={liked}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  liked ? "fill-current" : "",
                  iconClassName,
                )}
              />
              <span className="min-w-[1ch] text-xs font-medium tabular-nums">
                {count}
              </span>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {!getToken() ? (
              <span>
                Sign in to like —{" "}
                <Link href={loginHref} className="underline font-medium">
                  Log in
                </Link>
              </span>
            ) : liked ? (
              "Unlike"
            ) : (
              "Like"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <LikeDetailDefaultButton
      liked={liked}
      count={count}
      busy={busy}
      onToggle={onToggle}
      className={className}
      iconClassName={iconClassName}
      showCount
    />
  );
}
