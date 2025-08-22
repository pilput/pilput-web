"use client";
import React, { useEffect, useState } from "react";
import { getToken } from "@/utils/Auth";
import { getProfilePicture } from "@/utils/getImage";
import { formatDistanceToNow } from "date-fns";
import {
  MessageCircle,
  User,
  Edit3,
  LogIn,
  Wifi,
  WifiOff,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { axiosInstence } from "@/utils/fetch";
import { useSocket } from "@/utils/socketio";

interface CommentData {
  id: string;
  text: string;
  replies: CommentData[];
  created_at: string;
  creator: {
    first_name: string;
    last_name: string;
    image: string;
  };
}

const Comment = ({ postId }: { postId: string }) => {
  const [comment, setcomment] = useState<string>("");
  const [comments, setcomments] = useState<CommentData[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  const { socket, isConnected, isReconnecting, reconnect } = useSocket({
    token: token || undefined,
    postId,
  });

  useEffect(() => {
    const fetchTokenAndComments = async () => {
      try {
        const authToken = await getToken();
        const tokenString = Array.isArray(authToken) ? authToken[0] : authToken;
        setToken(tokenString || "");
        setIsLoggedIn(!!tokenString);
      } catch (error) {
        console.error("Error getting token:", error);
        setToken("");
        setIsLoggedIn(false);
      }

      // Fetch comments from API on component mount
      try {
        const response = await axiosInstence.get(
          `/v1/posts/${postId}/comments`
        );
        if (response.data.success) {
          setcomments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchTokenAndComments();
  }, [postId]);

  // Set up socket event listeners when socket is available and connected
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log("Setting up socket event listeners for postId:", postId);

    // Listen for new comments
    const handleNewComment = (message: CommentData[]) => {
      console.log("Received new comment event:", message);
      setcomments(message);
    };

    // Listen for new replies
    const handleNewReply = (message: CommentData[]) => {
      console.log("Received new reply event:", message);
      setcomments(message);
    };

    // Listen for comment updates
    const handleCommentUpdated = (message: CommentData[]) => {
      console.log("Comments updated event:", message);
      setcomments(message);
    };

    // Remove any existing listeners first to prevent duplicates
    socket.off("newComment");
    socket.off("newReply");
    socket.off("commentUpdated");

    // Add new listeners
    socket.on("newComment", handleNewComment);
    socket.on("newReply", handleNewReply);
    socket.on("commentUpdated", handleCommentUpdated);

    console.log("Socket event listeners attached successfully");

    // Cleanup function
    return () => {
      console.log("Cleaning up socket event listeners");
      socket.off("newComment", handleNewComment);
      socket.off("newReply", handleNewReply);
      socket.off("commentUpdated", handleCommentUpdated);
    };
  }, [socket, isConnected, postId]);

  function sendComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isLoggedIn) {
      console.warn("User not logged in, cannot send comment");
      return;
    }

    if (!comment.trim()) {
      console.warn("Comment is empty");
      return;
    }

    // Check if socket is connected
    if (socket && socket.connected) {
      try {
        socket.emit("sendComment", {
          text: comment.trim(),
          post_id: postId
        });
        console.log("Comment sent successfully");
        setcomment("");
      } catch (error) {
        console.error("Error sending comment:", error);
        // If sending fails, try to reconnect
        reconnect();
      }
    } else {
      console.warn("Socket not connected. Attempting to reconnect...");

      // Try to reconnect
      reconnect();

      // Wait for reconnection and try again
      setTimeout(() => {
        if (socket && socket.connected) {
          try {
            socket.emit("sendComment", {
              text: comment.trim(),
              post_id: postId
            });
            console.log("Comment sent after reconnection");
            setcomment("");
          } catch (error) {
            console.error("Failed to send comment after reconnection:", error);
            // You could show a toast notification here
            alert("Failed to send comment. Please try again.");
          }
        } else {
          console.error("Failed to reconnect. Please refresh the page and try again.");
          alert("Connection lost. Please refresh the page and try again.");
        }
      }, 3000);
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Discussion
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Share your thoughts and join the conversation
            </p>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            {/* Add a comment button for logged-in users */}
            {isLoggedIn ? (
              <button
                onClick={() =>
                  document
                    .getElementById("comment-input")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium rounded-lg transition-colors mb-4"
              >
                Add Comment
              </button>
            ) : null}
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
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {data.creator?.first_name
                        ? `${data.creator.first_name} ${data.creator.last_name}`
                        : "Anonymous User"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(data.created_at, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    {data.text}

                    {data.replies && data.replies.length > 0 && (
                      <div className="ml-8 mt-4 space-y-4">
                        {data.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex gap-4">
                              {/* Avatar */}
                              <div className="flex-shrink-0">
                                {reply.creator?.first_name ? (
                                  <img
                                    className="w-8 h-8 rounded-full object-cover"
                                    src={getProfilePicture(
                                      reply.creator?.image
                                    )}
                                    width={32}
                                    height={32}
                                    alt={`${reply.creator?.first_name} ${reply.creator?.last_name}`}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                  </div>
                                )}
                              </div>

                              {/* Reply Content */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {reply.creator?.first_name
                                      ? `${reply.creator.first_name} ${reply.creator.last_name}`
                                      : "Anonymous User"}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDistanceToNow(reply.created_at, {
                                      addSuffix: true,
                                    })}
                                  </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-2">
                                  {reply.text}
                                </p>

                                {/* Reply Actions */}
                                {isLoggedIn && (
                                  <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-1 px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs">
                                      <span>👏</span>
                                      <span>0</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </p>

                  {/* Actions */}
                  {isLoggedIn && (
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm">
                        <span>👏</span>
                        <span>0</span>
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
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Comment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share your thoughts
              </p>
            </div>

            {/* Connection Status Indicator */}
            <div className="flex items-center gap-2">
              {isReconnecting ? (
                <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-medium">Reconnecting...</span>
                </div>
              ) : isConnected ? (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-xs font-medium">Disconnected</span>
                </div>
              )}
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
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Be respectful and constructive
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !comment.trim() || !isConnected || isReconnecting
                    }
                    title={
                      !isConnected
                        ? "Cannot post comment while disconnected"
                        : isReconnecting
                        ? "Reconnecting..."
                        : "Post your comment"
                    }
                  >
                    {isReconnecting ? "Reconnecting..." : "Post Comment"}
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
              Please log in to share your thoughts and engage with the
              community.
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
