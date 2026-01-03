"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import TrendingPosts from "@/components/post/TrendingPosts";
import { axiosInstence3 } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import type { Post } from "@/types/post";
import { motion } from "framer-motion";

const BlogSidebarLeft = () => {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingPosts() {
      setIsTrendingLoading(true);
      try {
        const { data } = await axiosInstence3.get("/v1/posts/trending", {
          params: { limit: 5 },
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
  );
};

export default BlogSidebarLeft;
