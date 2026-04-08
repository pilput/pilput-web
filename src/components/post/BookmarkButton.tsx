"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getToken } from "@/utils/Auth";
import { bookmarkStore } from "@/stores/bookmarkStore";
import { ErrorHandlerAPI } from "@/utils/ErrorHandler";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  postId: string;
  /** Server-side bookmark total; optional optimistic count updates on toggle. */
  initialCount?: number;
  /** When true, shows total bookmarks (compact: icon + number, like likes). */
  showCount?: boolean;
  className?: string;
  iconClassName?: string;
  variant?: "default" | "compact";
}

function normalizeBookmarkCount(value: number | undefined): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export default function BookmarkButton({
  postId,
  initialCount = 0,
  showCount = false,
  className,
  iconClassName,
  variant = "default",
}: BookmarkButtonProps) {
  const pathname = usePathname();
  const loginHref = `/login?redirect=${encodeURIComponent(pathname || "/")}`;

  const loadBookmarks = bookmarkStore((s) => s.loadBookmarks);
  const toggleBookmark = bookmarkStore((s) => s.toggleBookmark);
  const isBookmarked = bookmarkStore((s) => Boolean(s.byPostId[postId]));
  const loadingList = bookmarkStore((s) => s.loading);
  const loaded = bookmarkStore((s) => s.loaded);

  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(() => normalizeBookmarkCount(initialCount));

  useEffect(() => {
    setCount(normalizeBookmarkCount(initialCount));
  }, [initialCount, postId]);

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    void loadBookmarks().catch(() => {
      /* optional: silent fail until user interacts */
    });
  }, [loadBookmarks]);

  const onClick = async () => {
    if (!getToken()) {
      toast.error("Sign in to save posts to your reading list.");
      return;
    }
    setBusy(true);
    try {
      const action = await toggleBookmark(postId);
      setCount((c) => {
        if (action === "added") return c + 1;
        if (action === "removed") return Math.max(0, c - 1);
        return c;
      });
      toast.success(
        action === "added" ? "Saved to reading list" : "Removed from reading list",
      );
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setBusy(false);
    }
  };

  const showSpinner =
    busy || (Boolean(getToken()) && !loaded && loadingList);

  if (variant === "compact") {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              disabled={showSpinner}
              onClick={() => void onClick()}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors",
                "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                "disabled:pointer-events-none disabled:opacity-50",
                isBookmarked &&
                  "text-primary hover:bg-primary/10 hover:text-primary",
                className,
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={isBookmarked}
              aria-label={
                showCount
                  ? `${isBookmarked ? "Remove bookmark" : "Add bookmark"}, ${count} saves`
                  : isBookmarked
                    ? "Remove bookmark"
                    : "Add bookmark"
              }
            >
              <Bookmark
                className={cn(
                  "h-4 w-4 shrink-0 stroke-[1.75]",
                  isBookmarked
                    ? "fill-primary text-primary"
                    : "text-muted-foreground",
                  iconClassName,
                )}
              />
              {showCount && (
                <span className="min-w-[1ch] tabular-nums text-[13px]">
                  {count}
                </span>
              )}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {!getToken() ? (
              <span>
                Sign in to save —{" "}
                <Link href={loginHref} className="underline font-medium">
                  Log in
                </Link>
              </span>
            ) : isBookmarked ? (
              "Remove from reading list"
            ) : (
              "Save to reading list"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            disabled={showSpinner}
            onClick={() => void onClick()}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-border/80 bg-background px-3 text-sm font-medium text-muted-foreground shadow-sm transition-colors",
              "hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
              isBookmarked && "border-primary/40 text-primary",
              className,
            )}
            whileHover={{ scale: 1.01 }}
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark
              className={cn(
                "h-4 w-4 shrink-0",
                isBookmarked ? "fill-primary text-primary" : "",
                iconClassName,
              )}
            />
            {showCount && (
              <span className="tabular-nums min-w-[1ch]">{count}</span>
            )}
            {isBookmarked ? "Saved" : "Save"}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {!getToken() ? (
            <span>
              Sign in to save —{" "}
              <Link href={loginHref} className="underline font-medium">
                Log in
              </Link>
            </span>
          ) : isBookmarked ? (
            "Click to remove from your reading list"
          ) : (
            "Save this post for later"
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
