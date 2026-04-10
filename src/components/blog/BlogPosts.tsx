"use client";

import PostList from "@/components/post/PostList";
import PostListPulse from "@/components/post/PostListPulse";
import { Paginate } from "@/components/common/Paginate";
import { Filter, X, FileQuestion, Sparkles, Rss } from "lucide-react";
import type { Post } from "@/types/post";

interface BlogPostsProps {
  posts: Post[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  postsPerPage: number;
  searchQuery: string; // This should be the active filter (debounced)
  onClearSearch: () => void;
  /** "feed" = compact home feed; "blog" = full blog toolbar copy */
  variant?: "blog" | "feed";
  /** Pagination link query builder (1-based `page`, optional `q`) */
  getPageHref?: (pageIndex: number) => string;
}

const BlogPosts = ({
  posts,
  isLoading,
  total,
  currentPage,
  onPageChange,
  postsPerPage,
  searchQuery,
  onClearSearch,
  variant = "blog",
  getPageHref,
}: BlogPostsProps) => {
  const totalPages = Math.max(1, Math.ceil(total / postsPerPage));
  const isFeed = variant === "feed";

  return (
    <div className="flex-1">
      {/* Toolbar */}
      <div className="sticky top-3 z-20 mb-4">
        <div
          className={
            isFeed
              ? "flex flex-wrap items-center gap-3 border-b border-border/60 pb-4"
              : "flex flex-wrap items-center gap-3 bg-card/90 border border-border/70 rounded-2xl px-4 py-3 shadow-sm backdrop-blur"
          }
        >
          <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
            {isFeed ? (
              <Rss className="w-4 h-4 text-primary" />
            ) : (
              <Sparkles className="w-4 h-4 text-primary" />
            )}
            {isFeed
              ? total
                ? `${total} posts`
                : "Feed"
              : total
                ? `${total} stories`
                : "Stories"}
          </div>
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          {searchQuery && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground text-sm border border-border/60">
                <Filter className="w-3 h-3" />
                Searching &quot;{searchQuery}&quot;
                <button
                  onClick={onClearSearch}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear search filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="space-y-4">
          {posts.length > 0 ? (
            <div key="posts">
              {posts.map((post, index) => (
                <div key={post.id} className="mb-4">
                  <PostList post={post} />
                </div>
              ))}
            </div>
          ) : !isLoading ? (
            <div
              key="empty"
              className="text-center py-20 px-4 bg-card/50 rounded-2xl border border-dashed border-border"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
                <FileQuestion className="w-10 h-10 text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "No posts found"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery
                  ? "We couldn't find any articles matching your search. Try different keywords or browse our trending topics."
                  : "There are no stories published yet. Check back soon for new content."}
              </p>
              {searchQuery && (
                <button
                  onClick={onClearSearch}
                  className="mt-6 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : null}
        {isLoading && (
          <div key="loading">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <PostListPulse />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {posts.length > 0 && total > postsPerPage && (
        <div className="mt-12 flex justify-center">
          <Paginate
            prev={() => onPageChange(Math.max(0, currentPage - 1))}
            next={() =>
              onPageChange(
                Math.min(
                  Math.ceil(total / postsPerPage) - 1,
                  currentPage + 1
                )
              )
            }
            goToPage={(page) => onPageChange(page)}
            limit={postsPerPage}
            offset={currentPage * postsPerPage}
            total={total}
            length={posts.length}
            currentPage={currentPage}
            getPageHref={getPageHref}
          />
        </div>
      )}
    </div>
  );
};

export default BlogPosts;
