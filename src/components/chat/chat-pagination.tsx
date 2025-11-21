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
    <div className="px-2 py-2">
      {/* Load More Button */}
      {canLoadMore && (
        <div className="flex flex-col gap-2">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="w-full justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Load More
              </>
            )}
          </Button>

          {/* Remaining Conversations Indicator */}
          {remainingConversations > 0 && (
            <div className="text-xs text-muted-foreground text-center">
              {remainingConversations} more available
            </div>
          )}
        </div>
      )}

      {/* No More Conversations Message */}
      {!hasMore && currentCount > 0 && (
        <div className="text-xs text-muted-foreground text-center py-1">
          All conversations loaded
        </div>
      )}
    </div>
  );
}