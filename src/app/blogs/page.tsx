"use client";
import React, { useEffect, useState } from "react";
import Navigation from "@/components/header/Navbar";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { getData } from "@/utils/fetch";

interface Post {
  id: string;
  title: string;
  desc: string;
}

const Blog = () => {
  const [posts, setposts] = useState<Post[]>([]);
  async function getPosts() {
    const response = await getData("/api/v2/posts");
    setposts(response.data.data);
  }
  useEffect(() => {
    getPosts();
  }, []);

  let postsshow;
  if (posts.length) {
    postsshow = posts.map((post) => <Postlist key={post.id} post={post} />);
  } else {
    postsshow = <Postlistpulse />;
  }
  return (
    <div className="bg-white">
      <Navigation />
      <div className="mx-auto  p-3 max-w-7xl min-h-screen">
        <h2 className="text-2xl font-semibold">Post</h2>
        <div className="mb-10"></div>
        {postsshow}
      </div>
    </div>
  );
};

export default Blog;
