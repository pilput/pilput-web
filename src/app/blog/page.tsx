"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import TrendingPosts from "@/components/post/TrendingPosts";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  TrendingUp,
  Bookmark,
  X,
  Sparkles,
  Clock3,
  FileQuestion,
  Filter,
  ArrowUp,
} from "lucide-react";
import { Paginate } from "@/components/common/Paginate";
import { axiosInstence3 } from "@/utils/fetch";
import type { Post } from "@/types/post";

const postsPerPage = 10;

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);

  const totalPages = Math.max(1, Math.ceil(total / postsPerPage));

  const handleTagClick = useCallback((tag: string) => {
    setSearchQuery(tag);
    setCurrentPage(0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setCurrentPage(0);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setShowScrollTop(latest > 400);
    });
    return unsubscribe;
  }, [scrollY]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(0); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const params: any = {
          limit: postsPerPage,
          offset: currentPage * postsPerPage,
        };

        if (debouncedSearchQuery.trim()) {
          params.search = debouncedSearchQuery.trim();
        }

        const { data } = await axiosInstence3.get("/v1/posts", { params });
        const response = data;
        if (response.data) {
          setPosts(response.data);
          if (response.meta && response.meta.total_items) {
            setTotal(response.meta.total_items);
          } else if (response.total) {
            setTotal(response.total);
          }
        } else {
          toast.error("Error loading posts");
        }
      } catch (error) {
        toast.error("Error loading posts");
      }
      setIsLoading(false);
    }
    fetchPosts();
  }, [currentPage, debouncedSearchQuery]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await axiosInstence3.get("/v1/tags");
        console.log(response.data);
        
        setTrendingTags(response.data.data.map((tag: any) => tag.name));
      } catch (error) {
        console.error("Error fetching tags:", error);
        // Fallback to default tags if API fails
        setTrendingTags([
          "ai",
          "nextjs",
          "typescript",
          "webdev",
          "react",
          "javascript",
        ]);
      }
    }
    fetchTags();
  }, []);

  useEffect(() => {
    async function fetchTrendingPosts() {
      setIsTrendingLoading(true);
      try {
        const { data } = await axiosInstence3.get("/v1/posts/trending", {
          params: { limit: 5 }
        });
        const response = data;
        if (response.data) {
          setTrendingPosts(response.data);
        } else {
          console.error("No trending posts data received");
        }
      } catch (error) {
        console.error("Error fetching trending posts:", error);
        toast.error("Error loading trending posts");
      }
      setIsTrendingLoading(false);
    }
    fetchTrendingPosts();
  }, []);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        {/* Hero / search */}
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
                Discover stories, thinking, and expertise from writers on every topic. Browse, search, and dive back into what matters.
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
                    <motion.span 
                      className="flex items-center gap-2 px-2 py-1 rounded-full bg-muted text-foreground/80"
                    >
                      <Clock3 className="w-4 h-4" />
                      Trending tags:
                    </motion.span>
                    {trendingTags.slice(0, 8).map((tag, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleTagClick(tag)}
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

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Main Content Area */}
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left Sidebar - Trending Posts */}
            <motion.div 
              className="xl:w-72 order-first xl:order-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card className="bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Trending Posts
                  </h3>
                  <TrendingPosts posts={trendingPosts} isLoading={isTrendingLoading} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Posts Feed */}
            <div className="flex-1">
              {/* Toolbar */}
              <motion.div 
                className="sticky top-3 z-20 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex flex-wrap items-center gap-3 bg-card/90 border border-border/70 rounded-2xl px-4 py-3 shadow-sm backdrop-blur">
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-foreground font-semibold"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    {total ? `${total} stories` : "Stories"}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                  <AnimatePresence>
                    {debouncedSearchQuery && (
                      <motion.div 
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground text-sm border border-border/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Filter className="w-3 h-3" />
                        Searching "{debouncedSearchQuery}"
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleClearSearch}
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
                      <motion.div 
                        className="w-20 h-20 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center"
                      >
                        <FileQuestion className="w-10 h-10 text-muted-foreground/60" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {debouncedSearchQuery ? `No results for "${debouncedSearchQuery}"` : "No posts found"}
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {debouncedSearchQuery
                          ? "We couldn't find any articles matching your search. Try different keywords or browse our trending topics."
                          : "There are no stories published yet. Check back soon for new content."
                        }
                      </p>
                      {debouncedSearchQuery && (
                        <motion.button 
                          onClick={handleClearSearch}
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

            {/* Sidebar */}
            <motion.div 
              className="xl:w-80"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="space-y-4">
                {/* Trending Topics */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                >
                  <Card className="bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-muted-foreground" />
                        Trending now
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(trendingTags) &&
                        trendingTags.length > 0 ? (
                          trendingTags.slice(0, 10).map((tag, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.1 + index * 0.03, duration: 0.2 }}
                            >
                              <Link
                                href={`/tags/${tag}`}
                                className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/60 block"
                              >
                                #{tag}
                              </Link>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No trending topics yet
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Reading List */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="mt-4"
                >
                  <Card className="bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-muted-foreground" />
                        Reading List
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Save articles for later and never miss great content
                      </p>
                      <motion.button 
                        className="w-full px-4 py-2 rounded-lg border border-primary/60 bg-primary text-primary-foreground hover:shadow-md transition-colors text-sm font-medium"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        Create reading list
                      </motion.button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl border border-primary/60 backdrop-blur-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Blog;
