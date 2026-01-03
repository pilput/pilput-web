"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Bookmark } from "lucide-react";
import Link from "next/link";

interface BlogSidebarRightProps {
  trendingTags: string[];
}

const BlogSidebarRight = ({ trendingTags }: BlogSidebarRightProps) => {
  return (
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
                {Array.isArray(trendingTags) && trendingTags.length > 0 ? (
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
  );
};

export default BlogSidebarRight;
