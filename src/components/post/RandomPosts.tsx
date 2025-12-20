"use client";
import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import { axiosInstence } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import PostItemPulse from "./PostItemPulse";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/types/post";

interface succesResponse {
  data: Post[];
  message: string;
  success: boolean;
}

const PostsRandomList = () => {
  const [posts, setposts] = useState<Post[]>([]);
  const tempposts = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const fetchRandomPosts = async () => {
    try {
      const response = await axiosInstence.get("/v1/posts/random?limit=9");
      const result = response.data as succesResponse;
      setposts(result.data);
    } catch {
      toast.error("Failed to fetch random posts");
    }
  };

  useEffect(() => {
    fetchRandomPosts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0
          ? posts.map((post) => <PostItem key={post.id} post={post} />)
          : tempposts.map((post) => <PostItemPulse key={post} />)}
      </div>
      
      <div className="flex justify-center pt-4">
        <Link href="/blog">
          <Button variant="outline" size="lg" className="rounded-full px-8 border-border/60 bg-background/50 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-300">
            Explore More Community Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PostsRandomList;
