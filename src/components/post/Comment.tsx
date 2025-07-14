"use client";
import { Config } from "@/utils/getCofig";
import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { getToken } from "@/utils/Auth";
import { getProfilePicture } from "@/utils/getImage";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, User, Edit3, LogIn } from "lucide-react";
import Link from "next/link";

interface CommentData {
  id: string;
  text: string;
  repies: CommentData;
  created_at: string;
  creator: any;
}

const Comment = ({ postId }: { postId: string }) => {
  const [comment, setcomment] = useState<string>("");
  const [comments, setcomments] = useState<Comment[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
    
    socketRef.current = io(Config.wsbaseurl + "/posts", {
      query: { post_id: postId, token: token },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (socketRef.current) {
      socketRef.current.on("newComment", (message: Comment[]) => {
        setcomments(message);
      });
    }
  }, []);

  function sendComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isLoggedIn) {
      return;
    }

    if (socketRef.current) {
      socketRef.current.emit("sendComment", { text: comment });
      setcomment("");
    }
  }
  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "inherit" }}
            >
              Discussion
            </h2>
            <p
              className="text-gray-600 dark:text-gray-400 text-sm"
              style={{ fontFamily: "inherit" }}
            >
              Share your thoughts and join the conversation
            </p>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No comments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Be the first to share your thoughts about this article.
            </p>
          </div>
        ) : (
          comments.map((data) => (
            <div
              key={data.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {data.creator?.first_name ? (
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={getProfilePicture(data.creator?.image)}
                      width={40}
                      height={40}
                      alt={`${data.creator?.first_name} ${data.creator?.last_name}`}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="font-semibold text-gray-900 dark:text-white"
                      style={{ fontFamily: "inherit" }}
                    >
                      {data.creator?.first_name
                        ? `${data.creator.first_name} ${data.creator.last_name}`
                        : "Anonymous User"}
                    </span>
                    <span
                      className="text-sm text-gray-500 dark:text-gray-400"
                      style={{ fontFamily: "inherit" }}
                    >
                      {formatDistanceToNow(new Date(data.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p
                    className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3"
                    style={{ fontFamily: "inherit" }}
                  >
                    {data.text}
                  </p>

                  {/* Actions */}
                  {isLoggedIn && (
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm">
                        <span>👏</span>
                        <span>12</span>
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm">
                        <MessageCircle className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input Form or Login Prompt */}
      {isLoggedIn ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Comment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share your thoughts
              </p>
            </div>
          </div>

          <form onSubmit={sendComment} className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={comment}
                  required
                  onChange={(e) => setcomment(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none"
                  style={{ fontFamily: "inherit" }}
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Be respectful and constructive
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!comment.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Join the Discussion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Please log in to share your thoughts and engage with the community.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/login"
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
