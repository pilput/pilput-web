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
  const limit = 10; // This should match the limit used in fetchRecentChats

  return (
    <div className="px-3 py-3 space-y-2">
      {/* Load More Button */}
      {canLoadMore && (
        <Button
          onClick={onLoadMore}
          disabled={isLoading}
          className="w-full bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-sidebar-foreground border border-sidebar-border/40"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Load More Conversations
            </>
          )}
        </Button>
      )}

      {/* Pagination Info */}
      <div className="text-xs text-muted-foreground/70 text-center">
        Page {currentPage + 1} of {totalPages || 1}
      </div>
      
      {/* Items Info */}
      {totalConversations > 0 && currentCount > 0 && (
        <div className="text-xs text-muted-foreground/60 text-center">
          Showing {(currentPage * 10) + 1} - {Math.min((currentPage + 1) * 10, totalConversations)} of {totalConversations} conversations
        </div>
      )}
    </div>
  );
}