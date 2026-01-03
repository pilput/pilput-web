"use client";

import { motion, AnimatePresence } from "framer-motion";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { Paginate } from "@/components/common/Paginate";
import { Filter, X, FileQuestion, Sparkles } from "lucide-react";
import type { Post } from "@/types/post";

interface BlogPostsProps {
  posts: Post[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  postsPerPage: number;
  searchQuery: string; // This should be the active filter (debounced)
  onClearSearch: () => void;
}

const BlogPosts = ({
  posts,
  isLoading,
  total,
  currentPage,
  setCurrentPage,
  postsPerPage,
  searchQuery,
  onClearSearch,
}: BlogPostsProps) => {
  const totalPages = Math.max(1, Math.ceil(total / postsPerPage));

  return (
    <div className="flex-1">
      {/* Toolbar */}
      <motion.div
        className="sticky top-3 z-20 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="flex flex-wrap items-center gap-3 bg-card/90 border border-border/70 rounded-2xl px-4 py-3 shadow-sm backdrop-blur">
          <motion.div className="flex items-center gap-2 text-sm text-foreground font-semibold">
            <Sparkles className="w-4 h-4 text-primary" />
            {total ? `${total} stories` : "Stories"}
          </motion.div>
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground text-sm border border-border/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Filter className="w-3 h-3" />
                Searching "{searchQuery}"
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClearSearch}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear search filter"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {posts.length > 0 ? (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="mb-4"
                >
                  <Postlist post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : !isLoading ? (
            <motion.div
              key="empty"
              className="text-center py-20 px-4 bg-card/50 rounded-2xl border border-dashed border-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div className="w-20 h-20 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
                <FileQuestion className="w-10 h-10 text-muted-foreground/60" />
              </motion.div>
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
                <motion.button
                  onClick={onClearSearch}
                  className="mt-6 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear filters
                </motion.button>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <Postlistpulse />
                </motion.div>
              ))}
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      {posts.length > 0 && total > postsPerPage && (
        <div className="mt-12 flex justify-center">
          <Paginate
            prev={() => setCurrentPage(Math.max(0, currentPage - 1))}
            next={() =>
              setCurrentPage(
                Math.min(
                  Math.ceil(total / postsPerPage) - 1,
                  currentPage + 1
                )
              )
            }
            goToPage={(page) => setCurrentPage(page)}
            limit={postsPerPage}
            Offset={currentPage * postsPerPage}
            total={total}
            length={posts.length}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default BlogPosts;
