"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";

interface ChatPaginationProps {
  currentPage: number;
  totalPages: number;
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore: boolean;
  totalConversations?: number;
  currentCount?: number;
}

export function ChatPagination({
  onLoadMore,
  isLoading = false,
  hasMore,
  totalConversations = 0,
  currentCount = 0,
}: ChatPaginationProps) {
  const canLoadMore = hasMore && !isLoading;
  const remainingConversations = Math.max(0, totalConversations - currentCount);

  return (
    <div className="pt-1 pb-2">
      {canLoadMore && (
        <Button
          onClick={onLoadMore}
          disabled={isLoading}
          variant="ghost"
          size="sm"
          className="h-8 w-full justify-center gap-1.5 rounded-lg border border-sidebar-border/50 bg-sidebar/50 text-xs font-medium text-muted-foreground transition-colors hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>
                Load {remainingConversations > 0 ? `${remainingConversations} more` : "more"}
              </span>
            </>
          )}
        </Button>
      )}

      {!hasMore && currentCount > 0 && (
        <p className="py-1 text-center text-[11px] text-muted-foreground/50">
          All {currentCount} conversations loaded
        </p>
      )}
    </div>
  );
}