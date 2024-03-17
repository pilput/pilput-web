"use client";
import { wsbaseurl } from "@/utils/getCofig";
import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToken } from "@/utils/Auth";
import { getProfilePicture } from "@/utils/getImage";
import Days from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

interface CommentData {
  id: string;
  text: string;
  repies: CommentData;
  created_at: string;
  creator: any;
}

const Comment = ({ postId }: { postId: string }) => {
  dayjs.extend(relativeTime);
  const [comment, setcomment] = useState<string>("");
  const [comments, setcomments] = useState<CommentData[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(wsbaseurl + "/posts", {
      query: { post_id: postId, token: getToken() },
      extraHeaders: {
        Authorization: `Bearer ${getToken()}`,
      }
    });
    if (socketRef.current) {
      socketRef.current.on("newComment", (message: CommentData[]) => {
        setcomments(message);
      });
    }
  }, []);

  function sendComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (socketRef.current) {
      socketRef.current.emit("sendComment", { text: comment });
      setcomment("");
    }
  }
  return (
    <div className="mx-auto border rounded-lg py-6 px-5">
      <div className="text-3xl text-gray-900 font-semibold my-6">Comments</div>

      <div className="mt-3">
        {comments.length === 0 && (
          <div className="text-gray-500 py-4">No comments</div>
        )}
        {comments.map((data) => (
          <div
            key={data.id}
            className="w-full rounded-lg border px-3 py-3 mb-2"
          >
            {data.creator?.first_name ? (
              <div className="flex gap-2 items-center">
                <img
                  className="rounded-full object-cover h-7 w-7"
                  src={getProfilePicture(data.creator?.image)}
                  width={20}
                  height={20}
                  alt={data.creator?.first_name}
                />
                <div>
                  <div>
                    {data.creator?.first_name} {data.creator?.last_name}
                  </div>
                  <div className="text-gray-500">
                    {Days(data.created_at).fromNow()}
                  </div>
                </div>
              </div>
            ) : (
              <div>Anonymous</div>
            )}
            <div>{data.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendComment} className="w-full flex space-x-4">
        <Input
          value={comment}
          required
          onChange={(e) => setcomment(e.target.value)}
          placeholder="type your comment"
        />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default Comment;
