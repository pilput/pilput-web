"use client";
import React, { useEffect, useState } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { getData } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";

interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
}

const Blog = () => {
  const [posts, setposts] = useState([]);
  async function FetchPost() {
    const response = await getData("/posts");
    if (response.status == 200) {
      setposts(response.data.data);
    } else {
      toast.error("Error check your connection");
    }
  }
  useEffect(() => {
    FetchPost();
  }, []);

  let postsshow;
  if (posts.length) {
    postsshow = posts.map((post: Post) => (
      <Postlist key={post.id} post={post} />
    ));
  } else {
    postsshow = <Postlistpulse />;
  }
  return (
    <>
      <Navigation />
      <div className="mx-auto p-3 max-w-7xl min-h-screen">
        <h2 className="text-2xl font-semibold">Posts</h2>
        <div className="mb-10"></div>
        {postsshow}
      </div>
    </>
  );
};

export default Blog;
