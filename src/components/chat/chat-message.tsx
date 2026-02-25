"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Edit, ThumbsDown, ThumbsUp, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  isStreaming: boolean;
}

interface ChatMessageProps {
  message: Message;
  className?: string;
  onEdit?: (id: string, content: string) => void;
  onFeedback?: (id: string, type: "like" | "dislike" | "none") => void;
}

export function ChatMessage({
  message,
  className,
  onEdit,
  onFeedback,
}: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const isWaitingForStream =
    isAssistant && message.isStreaming && !message.content.trim();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [hasLiked, setHasLiked] = useState<boolean | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEdit = () => {
    if (editedContent.trim() === "") return;
    onEdit?.(message.id, editedContent);
    setIsEditing(false);
  };

  const handleSave = () => {
    handleEdit();
  };

  const handleCancel = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const handleLike = () => {
    const newLikeState = hasLiked === true ? null : true;
    setHasLiked(newLikeState);
    onFeedback?.(message.id, newLikeState ? "like" : "none");
  };

  const handleDislike = () => {
    const newDislikeState = hasLiked === false ? null : false;
    setHasLiked(newDislikeState);
    onFeedback?.(message.id, newDislikeState === false ? "dislike" : "none");
  };

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Auto-scroll to bottom when streaming
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message.isStreaming && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message.content, message.isStreaming]);

  return (
    <div className={cn("group relative w-full px-4 py-2", className)}>
      <div className={cn("mx-auto w-full max-w-4xl", isEditing ? "pb-16" : "")}>
        <div
          className={cn(
            "flex gap-4",
            isAssistant ? "items-start" : "items-start justify-end"
          )}
        >
          {isAssistant && (
            <div className="shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          <div className={cn("min-w-0", isAssistant ? "flex-1" : "max-w-[80%]")}>
            <div
              className={cn(
                "mb-1 flex items-center gap-2",
                isAssistant ? "" : "justify-end"
              )}
            >
              {!isAssistant && <User className="h-3.5 w-3.5 text-muted-foreground" />}
              <span className="text-sm font-medium">
                {isAssistant ? "AI Assistant" : "You"}
              </span>
              <span className="text-xs text-muted-foreground">
                {message.createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div
              className={cn(
                "text-sm text-foreground",
                isAssistant ? "w-full" : "rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3"
              )}
            >
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit-mode"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <textarea
                      ref={textareaRef}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background p-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-primary"
                      rows={4}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSave();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Save changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-mode"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full"
                  >
                    <div className="relative">
                      <div className="space-y-2">
                        {isWaitingForStream ? (
                          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
                            <span className="sr-only">
                              AI is preparing a response
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                            </div>
                            <span>AI is typing...</span>
                          </div>
                        ) : (
                          <Markdown
                            content={message.content}
                            className="text-foreground"
                          />
                        )}
                        {message.isStreaming && (
                          <div ref={messageEndRef} className="h-4" />
                        )}
                        <div
                          className={cn(
                            "flex items-center gap-1 pt-2 opacity-0 transition-opacity group-hover:opacity-100",
                            isAssistant ? "" : "justify-end"
                          )}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy message</span>
                          </Button>
                          {message.role === "user" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setEditedContent(message.content);
                                setIsEditing(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit message</span>
                            </Button>
                          )}
                          {isAssistant && (
                            <>
                              <div className="mx-1 h-6 w-px bg-border" />
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-8 w-8",
                                  hasLiked === true
                                    ? "text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={handleLike}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span className="sr-only">Like</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-8 w-8",
                                  hasLiked === false
                                    ? "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={handleDislike}
                              >
                                <ThumbsDown className="h-4 w-4" />
                                <span className="sr-only">Dislike</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
