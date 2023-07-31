"use client";
import { wsbaseurl } from "@/utils/fetch";
import useSocket from "@/utils/socketio";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";

const Comment = ({ post_id }: { post_id: string }) => {
  const [comment, setcomment] = useState("");
  const [comments, setcomments] = useState([{ id: "", text: ""}]);
  const socket = io(wsbaseurl + "/posts", { query: { post_id: post_id } });
  useEffect(() => {
    socket.on("newComment", (message) => {
      setcomments(message);
    });
  }, []);
  function refresh() {
    if (socket) {
      socket.emit("getAllComments");
    }
  }
  function sendComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("masuk submit");

    if (socket) {
      socket.emit("sendComment", { text: comment });
      setcomment("");
    }
  }
  return (
    <div className="max-w-2xl border rounded-lg py-6 px-5">
      <h1 className="text-2xl font-semibold my-6">Comments</h1>
      <form onSubmit={sendComment} className="w-full flex space-x-4">
        {/* <input className="" type="text" value={comment} onChange={} placeholder="type your comment" /> */}

        <Textarea
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
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
