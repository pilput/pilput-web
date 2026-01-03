"use client";

import { useState } from "react";
import { Search, X, Sparkles, Clock3 } from "lucide-react";

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

  return (
    <div
      className="relative overflow-hidden border-b border-border/70 bg-background/90 backdrop-blur"
    >
      <div className="absolute inset-0 bg-grid-slate-100/[0.08] dark:bg-grid-slate-800/[0.1] bg-size-[32px_32px]" />
      <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold border border-primary/20 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Freshly curated for you
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Latest Stories
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover stories, thinking, and expertise from writers on every topic.
            Browse, search, and dive back into what matters.
          </p>
        </div>
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group shadow-lg shadow-primary/5 rounded-full border border-border/70 bg-card/80 backdrop-blur">
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
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {Array.isArray(trendingTags) && trendingTags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2 px-2 py-1 rounded-full bg-muted text-foreground/80">
                  <Clock3 className="w-4 h-4" />
                  Trending tags:
                </span>
                {trendingTags.slice(0, 8).map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => onTagClick(tag)}
                    className="px-3 py-1.5 rounded-full border border-border/70 bg-card/80 hover:border-primary/40 hover:-translate-y-0.5 transition text-foreground"
                  >
                    #{tag}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
