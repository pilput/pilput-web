"use client";
import React, { useEffect, useState } from "react";
import { getToken } from "@/utils/Auth";
import { getProfilePicture } from "@/utils/getImage";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, User, Edit3, LogIn, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { axiosInstence3 } from "@/utils/fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";

interface CommentData {
  id: string;
  text: string;
  post_id: string;
  parent_comment_id: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    image: string;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const Comment = ({ postId }: { postId: string }) => {
  const [comment, setcomment] = useState<string>("");
  const [comments, setcomments] = useState<CommentData[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const COMMENTS_PER_PAGE = 20;

  // Fetch comments from API with pagination
  const fetchComments = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      const response = await axiosInstence3.get(
        `/v1/comments/post/${postId}?page=${page}&limit=${COMMENTS_PER_PAGE}`
      );
      console.log("Response data:", response.data);

      if (response.data.success) {
        // Ensure data is an array
        const commentsData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        console.log("Comments array:", commentsData);
        setcomments(commentsData);
        
        // Set pagination metadata
        if (response.data.meta) {
          setPagination(response.data.meta);
        }
      } else {
        setcomments([]);
        setPagination(null);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
      setcomments([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

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

      // Fetch comments on component mount or page change
      await fetchComments(currentPage);
    };

    fetchTokenAndComments();
  }, [postId, currentPage]);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchComments(currentPage);
    setIsRefreshing(false);
    toast.success("Comments refreshed");
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  async function sendComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please log in to comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstence3.post(
        `/v1/comments`,
        {
          text: comment.trim(),
          post_id: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Comment posted successfully");
        setcomment("");
        // Reset to page 1 and refresh comments to show the new comment
        setCurrentPage(1);
        await fetchComments(1);
      } else {
        toast.error(response.data.message || "Failed to post comment");
      }
    } catch (error: any) {
      console.error("Error sending comment:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to post comment. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Discussion</CardTitle>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Share your thoughts and join the conversation
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                Loading comments...
              </p>
            </CardContent>
          </Card>
        ) : comments.length === 0 ? (
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
              <CardTitle className="mb-2">No comments yet</CardTitle>
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
                  <Avatar className="shrink-0">
                    <AvatarImage
                      src={getProfilePicture(data.user?.image)}
                      alt={`${data.user?.first_name} ${data.user?.last_name}`}
                    />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {data.user?.first_name
                          ? `${data.user.first_name} ${data.user.last_name}`
                          : "Anonymous User"}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(data.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      {data.text}
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total comments)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                
                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isLoading}
                        className="w-9 h-9 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comment Input Form or Login Prompt */}
      {isLoggedIn ? (
        <Card id="comment-input">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">Add Comment</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share your thoughts
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={sendComment} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="shrink-0">
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
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-muted-foreground">
                      Be respectful and constructive
                    </span>
                    <Button
                      type="submit"
                      disabled={!comment.trim() || isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post Comment"}
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
            <CardTitle className="mb-2">Join the Discussion</CardTitle>
            <p className="text-muted-foreground text-sm mb-6">
              Please log in to share your thoughts and engage with the
              community.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Comment;
