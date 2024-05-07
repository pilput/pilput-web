"use client";
import React, { useEffect, useState } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { axiosIntence } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";


const Blog = () => {
  const [posts, setposts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [endPage, setendPage] = useState(false);

  async function fetchPosts() {
    if (endPage) return;
    setIsLoading(true);
    try {
      const { data } = await axiosIntence.get("/api/v2/posts", {
        params: { per_page: 8, page },
      });
      setposts(page === 1 ? data.data : [...posts, ...data.data]);
      setendPage(data.data.length === 0);
    } catch (error) {
      toast.error("Error checking connection");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPosts();
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
    fetchPosts();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
