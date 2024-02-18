"use client";
import { wsbaseurl } from "@/utils/fetch";
import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToken } from "@/utils/Auth";

interface CommentData {
  id: string;
  text: string;
  repies: CommentData;
}

const Comment = ({ post_id }: { post_id: string }) => {
  const [comment, setcomment] = useState<string>("");
  const [comments, setcomments] = useState<CommentData[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(wsbaseurl + "/posts", {
      query: { post_id: post_id, token: getToken() },
    });
    if (socketRef.current) {
      socketRef.current.on("newComment", (message: CommentData[]) => {
        setcomments(message);
      });
    }
  }, []);

  function sendComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("masuk submit");

    if (socketRef.current) {
      socketRef.current.emit("sendComment", { text: comment });
      setcomment("");
    }
  }
  return (
    <div className="mx-auto border rounded-lg py-6 px-5">
      <div className="text-3xl text-gray-900 font-semibold my-6">Comments</div>
      <form onSubmit={sendComment} className="w-full flex space-x-4">
        <Input
          value={comment}
          onChange={(e) => setcomment(e.target.value)}
          placeholder="type your comment"
        />

        <Button type="submit">Submit</Button>
      </form>
      <div className="mt-3">
        {comments.map((data) => (
          <div
            key={data.id}
            className="w-full rounded-lg border px-3 py-3 flex flex-col mb-2"
          >
            <div>Unkown</div>
            <div>{data.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
