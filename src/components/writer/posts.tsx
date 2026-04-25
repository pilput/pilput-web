"use client";

import { Paginate } from "@/components/common/Paginate";
import { postsPerPage } from "@/lib/blog-feed-data";
import { apiClient } from "@/utils/fetch";
import { useCallback, useEffect, useState } from "react";
import PostList from "../post/PostList";
import type { Post } from "@/types/post";

interface AuthorPostsResponse {
  data: Post[];
  meta?: { total_items: number };
  total?: number;
}

function Posts(props: {
  username: string;
  /** When false, only the list / empty state is shown (parent provides section title). */
  showHeading?: boolean;
}) {
  const showHeading = props.showHeading !== false;
  const [posts, setposts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function getPosts() {
      try {
        setLoading(true);
        const { data } = await apiClient.get<AuthorPostsResponse>(
          `/v1/posts/author/${props.username}`,
          {
            params: {
              limit: postsPerPage,
              offset: currentPage * postsPerPage,
            },
          },
        );
        if (cancelled) {
          return;
        }
        setposts(data.data ?? []);
        setTotal(data.meta?.total_items ?? data.total ?? 0);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setposts([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    getPosts();
    return () => {
      cancelled = true;
    };
  }, [props.username, currentPage]);

  const postCount = Math.max(total, posts.length);

  if (loading) {
    return (
      <div className="space-y-4">
        <div
          className={`flex items-center ${showHeading ? "justify-between" : "justify-end"}`}
        >
          {showHeading ? (
            <h2 className="text-2xl font-bold text-foreground">Posts</h2>
          ) : (
            <span className="sr-only">Posts</span>
          )}
          <div className="text-sm text-muted-foreground">Loading posts...</div>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48 mb-4"></div>
              <div className="space-y-2">
                <div className="bg-muted rounded h-4 w-3/4"></div>
                <div className="bg-muted rounded h-4 w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        {showHeading ? (
          <h2 className="text-2xl font-bold text-foreground">Posts</h2>
        ) : (
          <span className="sr-only">Posts</span>
        )}
        <div
          className={
            showHeading
              ? "text-sm text-muted-foreground"
              : "ml-auto text-sm font-medium text-muted-foreground"
          }
        >
          {postCount.toLocaleString()}{" "}
          {postCount === 1 ? "post" : "posts"}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No posts yet
          </h3>
          <p className="text-muted-foreground">
            This writer hasn&apos;t published any posts yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostList key={post.id} post={post} />
            ))}
          </div>
          {total > postsPerPage && (
            <div className="flex justify-center pt-2">
              <Paginate
                currentPage={currentPage}
                total={total}
                limit={postsPerPage}
                offset={currentPage * postsPerPage}
                prev={() => handlePageChange(Math.max(0, currentPage - 1))}
                next={() =>
                  handlePageChange(
                    Math.min(
                      Math.ceil(total / postsPerPage) - 1,
                      currentPage + 1,
                    ),
                  )
                }
                goToPage={(page) => handlePageChange(page)}
                length={posts.length}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Posts;
