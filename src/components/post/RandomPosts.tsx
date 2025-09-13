"use client";
import React, { useState, useEffect } from "react";
import PostItemr from "./PostItemr";
import { axiosInstence } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import PostItemrPulse from "./PostItemrpulse";
import Link from "next/link";
import { BookOpen } from "lucide-react";
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

  let content;
  if (posts.length) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostItemr key={post.id} post={post} />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tempposts.map((post) => (
          <PostItemrPulse key={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Posts</h2>
            <p className="text-muted-foreground">Discover interesting articles from our community</p>
          </div>
        </div>
        <Link
          href="/blog"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View All →
        </Link>
      </div>
      {content}
    </div>
  );
};

export default PostsRandomList;
