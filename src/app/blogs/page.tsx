"use client";
import React, { useEffect, useState } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { axiosIntence } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";

const Blog = () => {
  const [posts, setposts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [endPage, setendPage] = useState(false);

  async function fetchPosts() {
    if (endPage) return;
    setIsLoading(true);
    try {
      const { data } = await axiosIntence.get("/api/v2/posts", {
        params: { limit: 5, offset: page * 5 },
      });
      setposts(page === 0 ? data.data : [...posts, ...data.data]);
      setendPage(data.total === posts.length);
    } catch (error) {
      toast.error("Error checking connection");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  const loadMore = () => {
    if (page === 0) {
      console.log("pagenya satu");
      setPage(1);
    } else {
      console.log("pagenya bukan satu");
      setPage((prevPage) => prevPage + 1);
    }

    fetchPosts();
  };

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
          {!endPage && (
            <div className="flex justify-center mt-5">
              <button
                className="flex flex-col items-center group hover:gap-1"
                onClick={loadMore}
              >
                <span className="group-hover:underline">Load More</span>{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 group-hover:mt-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
