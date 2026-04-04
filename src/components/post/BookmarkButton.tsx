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
  className?: string;
  iconClassName?: string;
  variant?: "default" | "compact";
}

export default function BookmarkButton({
  postId,
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
                "p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50",
                isBookmarked && "text-primary",
                className,
              )}
              whileHover={{ scale: 1.05 }}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark
                className={cn(
                  "w-4 h-4",
                  isBookmarked ? "fill-primary text-primary" : "text-muted-foreground",
                  iconClassName,
                )}
              />
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
              "inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/80 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50",
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
