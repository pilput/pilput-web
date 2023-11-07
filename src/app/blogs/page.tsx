"use client";
import React, { useEffect, useRef, useState } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { axiosIntence, getData } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";

interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  creator: any;
}

const Blog = () => {
  const [posts, setposts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  async function FetchPost() {
    setIsLoading(true);
    try {
      const response = await axiosIntence.get("/api/v2/posts", {
        params: { per_page: 8, page: page },
      });
      if (page === 1) {
        setposts(response.data.data);
      } else {
        let baru = response.data.data;
        setposts((prev) => [...prev, ...baru]);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Error check your connection");
    }
  }

  useEffect(() => {
    FetchPost();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
    FetchPost();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  return (
    <>
      <Navigation />
      <div className="mx-auto p-3 max-w-7xl min-h-screen">
        <h2 className="text-2xl font-semibold">Posts</h2>
        <div className="mb-10">
          {posts.map((post: Post) => (
            <Postlist key={post.id} post={post} />
          ))}
          {isLoading && <Postlistpulse />}
        </div>
      </div>
    </>
  );
};

export default Blog;
