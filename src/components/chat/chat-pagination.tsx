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
    <div className="px-3 py-3 space-y-2">
      {/* Load More Button */}
      {canLoadMore && (
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            className="group relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 hover:from-primary/15 hover:via-primary/10 hover:to-primary/15 text-primary hover:text-primary border border-primary/30 hover:border-primary/40 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 group-active:scale-95 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Load More Conversations
              </>
            )}
          </Button>
          
          {/* Remaining Conversations Indicator */}
          {remainingConversations > 0 && (
            <div className="text-xs text-muted-foreground/70 bg-sidebar-accent/10 px-3 py-1 rounded-full border border-sidebar-border/30">
              <span className="font-medium text-foreground/80">{remainingConversations}</span> more conversations available
            </div>
          )}
        </div>
      )}

      {/* No More Conversations Message */}
      {!hasMore && currentCount > 0 && (
        <div className="text-xs text-muted-foreground/60 text-center bg-sidebar-accent/5 px-3 py-2 rounded-lg border border-sidebar-border/20">
          <span className="text-foreground/70 font-medium">All caught up!</span> You've viewed all {totalConversations} conversations
        </div>
      )}
      
      {/* Items Summary */}
      {totalConversations > 0 && currentCount > 0 && hasMore && (
        <div className="text-xs text-muted-foreground/60 text-center bg-sidebar-accent/5 px-3 py-1 rounded-lg">
          Viewing <span className="font-medium text-foreground/80">{currentCount}</span> of{' '}
          <span className="font-medium text-foreground/80">{totalConversations}</span> conversations
        </div>
      )}
    </div>
  );
}