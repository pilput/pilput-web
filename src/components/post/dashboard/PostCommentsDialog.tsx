"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Trash2, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, isHttpError } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { getProfilePicture } from "@/utils/getImage";
import { toast } from "sonner";
import type { Comment, Post } from "@/types/post";

const PostCommentsDialog = ({
  post,
  open,
  onOpenChange,
}: {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: Comment[];
      }>(`/api/posts/${post.id}/comments`);
      setComments(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      toast.error("Failed to load comments");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [post.id]);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, fetchComments]);

  const onDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment? This action cannot be undone.")) {
      return;
    }

    setDeletingId(commentId);
    const toastId = toast.loading("Deleting comment...");
    try {
      await apiClient.delete(`/api/posts/${post.id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Comment deleted", { id: toastId });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      const message = isHttpError(error)
        ? (error.response?.data as { message?: string })?.message ??
          "Failed to delete comment"
        : "Failed to delete comment";
      toast.error(message, { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </DialogTitle>
          <DialogDescription className="truncate">
            {post.title || "Untitled post"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No comments yet</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
              >
                <Avatar className="shrink-0">
                  <AvatarImage
                    src={getProfilePicture(comment.user?.image ?? "")}
                    alt={comment.user?.username || "Anonymous"}
                  />
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-medium text-sm">
                      {comment.user?.username
                        ? `@${comment.user.username}`
                        : "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {comment.created_at
                        ? format(new Date(comment.created_at), "MMM dd, yyyy HH:mm")
                        : ""}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground/90">
                    {comment.text}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                  disabled={deletingId === comment.id}
                  onClick={() => onDeleteComment(comment.id)}
                >
                  <span className="sr-only">Delete comment</span>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCommentsDialog;
