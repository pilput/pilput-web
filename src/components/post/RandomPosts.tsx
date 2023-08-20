"use client";
import React, { useState, useEffect } from "react";
import PostItemr from "./PostItemr";
import { axiosIntence } from "@/utils/fetch";
import { toast } from "react-hot-toast";

interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  creator: any;
}

const PostsRandomList = () => {
  const [posts, setposts] = useState<Post[]>([]);

  async function GetPostsRandom() {
    try {
      const res = await axiosIntence.get("/api/v2/posts", {
        params: { random: true },
      });
      setposts(res.data);
    } catch (error) {
      toast.error("Cannot connect with server");
    }
  }

  useEffect(() => {
    GetPostsRandom();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-2xl font-semibold">Posts</div>
      <div className="grid grid-cols-3 gap-3 justify-around ">
        {posts.map((post) => (
          <PostItemr key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsRandomList;
