"use client";

import { axiosInstence } from "@/utils/fetch";
import { useEffect, useState } from "react";
import Postlist from "../post/Postlist";

function Posts(props: { usename: string }) {
  const [posts, setposts] = useState<Post[]>([]);

  useEffect(() => {
    async function getPosts() {
      try {
        const { data } = await axiosInstence.get(
          `/v1/posts/username/${props.usename}`
        );
        setposts(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    getPosts();
  }, [props.usename]);

  return (
    <div>
      <div>Posts</div>
      {posts.map((post) => (
        <Postlist key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
