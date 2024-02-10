"use client";
import React, { useState, useEffect } from "react";
import PostItemr from "./PostItemr";
import { axiosIntence } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import PostItemrPulse from "./PostItemrpulse";

const PostsRandomList = () => {
  const [posts, setposts] = useState<Post[]>([]);
  const tempposts = [1, 2, 3, 4, 5, 6];

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

  let content;
  if (posts.length) {
    content = (
      <div className="grid grid-cols-3 gap-3 justify-around">
        {posts.map((post) => (
          <PostItemr key={post.id} post={post} />
        ))}
      </div>
    );
  } else {
    content =  <div className="grid grid-cols-3 gap-3 justify-around ">
    {tempposts.map((post) => (
      <PostItemrPulse key={post} />
  ))}
    </div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-2xl font-semibold">Posts</div>

      {content}
    </div>
  );
};

export default PostsRandomList;
