"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Edit, ThumbsDown, ThumbsUp, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  showSeparator?: boolean;
}

export function ChatMessage({
  message,
  className,
  onEdit,
  onFeedback,
  showSeparator = false,
}: ChatMessageProps) {
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
    <div
      className={cn(
        "group relative py-2 px-4 w-full",
        className
      )}
    >
      <div
        className={cn(
          "max-w-3xl mx-auto w-full",
          isEditing ? "pb-16" : ""
        )}
      >
        <Card className="border-0 shadow-none bg-transparent hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {message.role === "assistant" ? "AI Assistant" : "You"}
              </span>
              <span className="text-xs text-muted-foreground">
                {message.createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="text-sm text-foreground">
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
                      className="w-full p-3 border rounded-lg bg-muted dark:border-border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                        className="bg-blue-500 hover:bg-blue-600 text-white"
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
                        <Markdown
                          content={message.content}
                          isStreaming={message.isStreaming}
                          className={
                            message.role === "assistant"
                              ? "text-foreground"
                              : "text-foreground"
                          }
                        />
                        {message.isStreaming && (
                          <div ref={messageEndRef} className="h-4" />
                        )}
                        <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
                              // You might want to add a toast notification here
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
                          <div className="h-6 w-px bg-border mx-1" />
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
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action buttons have been moved below the message content */}
          </div>
        </CardContent>
      </Card>
      {showSeparator && <Separator className="my-4" />}
    </div>
  </div>
);
}
