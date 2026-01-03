"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, X, Sparkles, Clock3 } from "lucide-react";
import { useState } from "react";

interface BlogHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleClearSearch: () => void;
  trendingTags: string[];
  onTagClick: (tag: string) => void;
}

const BlogHero = ({
  searchQuery,
  setSearchQuery,
  handleClearSearch,
  trendingTags,
  onTagClick,
}: BlogHeroProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);

  return (
    <motion.div
      className="relative overflow-hidden border-b border-border/70 bg-background/90 backdrop-blur"
      style={{ opacity: heroOpacity, y: heroY }}
    >
      <div className="absolute inset-0 bg-grid-slate-100/[0.08] dark:bg-grid-slate-800/[0.1] bg-size-[32px_32px]" />
      <motion.div
        className="relative max-w-6xl mx-auto px-4 py-12 md:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="text-center mb-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold border border-primary/20 shadow-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Sparkles className="w-4 h-4" />
            Freshly curated for you
          </motion.div>
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Latest Stories
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Discover stories, thinking, and expertise from writers on every topic.
            Browse, search, and dive back into what matters.
          </motion.p>
        </motion.div>
        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div
            className="relative group shadow-lg shadow-primary/5 rounded-full border border-border/70 bg-card/80 backdrop-blur"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-12 pr-14 py-4 bg-transparent border border-transparent rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition"
              aria-label="Search blog posts"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
          <AnimatePresence>
            {Array.isArray(trendingTags) && trendingTags.length > 0 && (
              <motion.div
                className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <motion.span className="flex items-center gap-2 px-2 py-1 rounded-full bg-muted text-foreground/80">
                  <Clock3 className="w-4 h-4" />
                  Trending tags:
                </motion.span>
                {trendingTags.slice(0, 8).map((tag, index) => (
                  <motion.button
                    key={index}
                    onClick={() => onTagClick(tag)}
                    className="px-3 py-1.5 rounded-full border border-border/70 bg-card/80 hover:border-primary/40 hover:-translate-y-0.5 transition text-foreground"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.05, duration: 0.2 }}
                  >
                    #{tag}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BlogHero;
