"use client";

import { Button } from "@/components/ui/button";

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
  currentPage,
  totalPages,
  onLoadMore,
  isLoading = false,
  hasMore,
  totalConversations = 0,
  currentCount = 0,
}: ChatPaginationProps) {
  const canLoadMore = hasMore && !isLoading;
  const remainingConversations = totalConversations - currentCount;

  return (
    <div className="pt-1">
      {canLoadMore && (
        <div className="flex flex-col gap-1">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-center rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="mr-1.5 h-3 w-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Load {remainingConversations > 0 ? `${remainingConversations} more` : "more"}
              </>
            )}
          </Button>
        </div>
      )}

      {!hasMore && currentCount > 0 && (
        <p className="py-2 text-center text-[11px] text-muted-foreground/50">
          All {currentCount} conversations loaded
        </p>
      )}
    </div>
  );
}