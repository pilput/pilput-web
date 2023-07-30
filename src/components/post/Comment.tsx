"use client";
import { wsbaseurl } from "@/utils/fetch";
import useSocket from "@/utils/socketio";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Comment = ({ post_id }: { post_id: string }) => {
  const [comment, setcomment] = useState("");
  const [comments, setcomments] = useState([{ id: "", text: "" }]);
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
      setcomment("")
    }
  }
  return (
    <>
      <h1>Comments</h1>
      <button onClick={refresh}>Refresh</button>
      <form onSubmit={sendComment}>
        <input type="text" value={comment} onChange={(e) => setcomment(e.target.value)} placeholder="type your comment" />
        <button type="submit">Submit</button>
      </form>
      <div>
        {comments.map((data) => (
          <div key={data.id}>{data.text}</div>
        ))}
      </div>
    </>
  );
};

export default Comment;
