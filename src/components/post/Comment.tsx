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
import { Config } from "@/utils/getConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

  const { socket, isConnected, isReconnecting } = useSocket({
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
        console.log("Response data:", response.data);

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
    const handleNewComment = (data: any) => {
      console.log("Received new comment event:", data);
      // Add the new comment to the comments state
      setcomments(data);
    };

    // Listen for new replies
    const handleNewReply = (data: any) => {
      console.log("Received new reply event:", data);
      // not handle yet
    };

    // Listen for comment errors
    const handleCommentError = (error: any) => {
      console.error("Comment error:", error);
    };

    // Listen for successful comment send confirmation
    const handleCommentSent = (data: any) => {
      console.log("Comment sent successfully:", data);
      // Clear the comment input
      setcomment("");
      // Refresh comments to show the new comment
      fetchComments();
    };

    // Helper function to fetch comments
    const fetchComments = async () => {
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

    // Remove any existing listeners first to prevent duplicates
    socket.off("newComment");
    socket.off("newReply");
    socket.off("commentUpdated");
    socket.off("commentError");
    socket.off("commentSent");

    // Add new listeners
    socket.on("newComment", handleNewComment);
    socket.on("newReply", handleNewReply);
    socket.on("commentError", handleCommentError);
    socket.on("commentSent", handleCommentSent);

    console.log("Socket event listeners attached successfully");

    // Cleanup function
    return () => {
      console.log("Cleaning up socket event listeners");
      socket.off("newComment", handleNewComment);
      socket.off("newReply", handleNewReply);
      socket.off("commentError", handleCommentError);
      socket.off("commentSent", handleCommentSent);
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
        console.log("Sending comment:", {
          text: comment.trim(),
          post_id: postId,
        });

        socket.emit("sendComment", {
          text: comment.trim(),
          post_id: postId,
        });

        console.log("Comment emit sent to server");

        setcomment("");
        // Don't clear comment here - let the socket event handler do it
      } catch (error) {
        console.error("Error sending comment:", error);
        alert("Failed to send comment. Please try again.");
      }
    } else {
      console.warn("Socket not connected. Current status:", {
        socket: !!socket,
        connected: socket?.connected,
        isConnected,
        isReconnecting,
      });
      alert("Connection lost. Please refresh the page and try again.");
    }
  }
  return (
    <div>
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">
                Discussion
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Share your thoughts and join the conversation
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              {/* Add a comment button for logged-in users */}
              {isLoggedIn ? (
                <Button
                  onClick={() =>
                    document
                      .getElementById("comment-input")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mb-4"
                >
                  Add Comment
                </Button>
              ) : null}
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="mb-2">
                No comments yet
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Be the first to share your thoughts about this article.
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((data) => (
            <Card key={data.id} className="mb-4">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className="flex-shrink-0">
                    <AvatarImage
                      src={getProfilePicture(data.creator?.image)}
                      alt={`${data.creator?.first_name} ${data.creator?.last_name}`}
                    />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>

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
                          <Card key={reply.id} className="ml-8 mt-4 bg-muted">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                {/* Avatar */}
                                <Avatar className="flex-shrink-0 w-8 h-8">
                                  <AvatarImage
                                    src={getProfilePicture(reply.creator?.image)}
                                    alt={`${reply.creator?.first_name} ${reply.creator?.last_name}`}
                                  />
                                  <AvatarFallback>
                                    <User className="w-4 h-4" />
                                  </AvatarFallback>
                                </Avatar>

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
                                    <Button variant="ghost" size="sm">
                                      <span>👏</span>
                                      <span className="ml-1">0</span>
                                    </Button>
                                  </div>
                                )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </p>

                  {/* Actions */}
                  {isLoggedIn && (
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Socket Debug Info - Remove this in production */}
      {process.env.NODE_ENV === "development" && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">🔍 Socket Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-1 text-muted-foreground">
              <div>
                Status:{" "}
                <span className={isConnected ? "text-green-600" : "text-red-600"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div>
                Reconnecting:{" "}
                <span
                  className={isReconnecting ? "text-yellow-600" : "text-gray-500"}
                >
                  {isReconnecting ? "Yes" : "No"}
                </span>
              </div>
              <div>
                Token:{" "}
                <span className={token ? "text-green-600" : "text-red-600"}>
                  {token ? "Present" : "Missing"}
                </span>
              </div>
              <div>Post ID: {postId}</div>
              <div>WS URL: {Config.wsbaseurl}</div>
              <div>Socket ID: {socket?.id || "None"}</div>
            </div>
            <Button
              onClick={() => {
                console.log("🔍 Manual socket debug:");
                console.log("Socket object:", socket);
                console.log("Socket connected:", socket?.connected);
                console.log("Socket ID:", socket?.id);
                if (socket?.connected) {
                  socket.emit("ping", { timestamp: Date.now() });
                  console.log("Sent ping to server");
                }
              }}
              className="mt-2"
              size="sm"
            >
              Debug Socket
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comment Input Form or Login Prompt */}
      {isLoggedIn ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">
                  Add Comment
                </CardTitle>
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
          </CardHeader>
          <CardContent>
            <form onSubmit={sendComment} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="flex-shrink-0">
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={comment}
                    required
                    onChange={(e) => setcomment(e.target.value)}
                    placeholder="Write your comment..."
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-muted-foreground">
                      Be respectful and constructive
                    </span>
                    <Button
                      type="submit"
                      disabled={!comment.trim() || !isConnected || isReconnecting}
                      title={
                        !isConnected
                          ? "Cannot post comment while disconnected"
                          : isReconnecting
                          ? "Reconnecting..."
                          : "Post your comment"
                      }
                    >
                      {isReconnecting ? "Reconnecting..." : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">
              Join the Discussion
            </CardTitle>
            <p className="text-muted-foreground text-sm mb-6">
              Please log in to share your thoughts and engage with the community.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/login">
                  Log In
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">
                  Sign Up
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Comment;
