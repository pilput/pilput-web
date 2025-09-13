"use client";

import { axiosInstence } from "@/utils/fetch";
import { useEffect, useState } from "react";
import Postlist from "../post/Postlist";
import type { Post } from "@/types/post";

function Posts(props: { username: string }) {
  const [posts, setposts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPosts() {
      try {
        setLoading(true);
        const { data } = await axiosInstence.get(
          `/v1/posts/username/${props.username}`
        );
        setposts(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getPosts();
  }, [props.username]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Posts</h2>
          <div className="text-sm text-muted-foreground">
            Loading posts...
          </div>
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Posts</h2>
        <div className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
          <p className="text-muted-foreground">This writer hasn&apos;t published any posts yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Postlist key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Posts;
