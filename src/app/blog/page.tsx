"use client";
import React, { useEffect, useState } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { axiosInstence } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const postsPerPage = 6;

const Blog = () => {
  const [posts, setposts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const { data } = await axiosInstence.get("/v1/posts", {
          params: { limit: postsPerPage, offset: currentPage * postsPerPage },
        });

        setposts(data.data);
        // Make sure we're accessing the total count from the correct path in the response
        if (data.metadata && data.metadata.totalItems) {
          setTotalPosts(data.metadata.totalItems);
        } else if (data.total) {
          // Fallback in case the API response structure is different
          setTotalPosts(data.total);
        }
      } catch (error) {
        toast.error("Error loading posts");
      }
      setIsLoading(false);
    }
    fetchPosts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navigation />
      <div className="mx-auto max-w-7xl min-h-screen mt-5 px-4">
        <h2 className="text-2xl font-semibold mb-6">Posts</h2>
        <div className="mb-10">
          {posts.length > 0 ? (
            posts.map((post: Post) => <Postlist key={post.id} post={post} />)
          ) : !isLoading ? (
            <div className="text-center py-10">No posts found</div>
          ) : null}
          {isLoading && <Postlistpulse />}
        </div>

        {totalPages > 0 && (
          <div className="my-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="cursor-pointer"
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage === 0}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                  // Show limited page numbers with ellipsis for better UX
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    (index >= currentPage - 1 && index <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          className="cursor-pointer"
                          onClick={() => handlePageChange(index)}
                          isActive={currentPage === index}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    index === currentPage - 2 ||
                    index === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <span className="flex h-9 w-9 items-center justify-center">
                          ...
                        </span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    className="cursor-pointer"
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-disabled={currentPage >= totalPages - 1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
