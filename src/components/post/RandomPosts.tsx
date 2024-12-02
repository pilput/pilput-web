"use client";
import React, { useState, useEffect } from "react";
import PostItemr from "./PostItemr";
import { axiosInstence } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import PostItemrPulse from "./PostItemrpulse";

interface succesResponse {
  data: Post[];
  message: string;
  success: boolean;
}

const PostsRandomList = () => {
  const [posts, setposts] = useState<Post[]>([]);
  const tempposts = [1, 2, 3, 4, 5, 6];

  const fetchRandomPosts = async () => {
    try {
      const response = await axiosInstence.get("/v1/posts/random");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-around">
        {posts.map((post) => (
          <PostItemr key={post.id} post={post} />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-3 gap-3 justify-around ">
        {tempposts.map((post) => (
          <PostItemrPulse key={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-2xl font-semibold">Posts</div>
      {content}
    </div>
  );
};

export default PostsRandomList;
