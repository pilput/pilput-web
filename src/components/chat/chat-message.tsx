"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Edit, ThumbsDown, ThumbsUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (editedContent.trim() === "") return;
    onEdit?.(message.id, editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLike = () => {
    const next = hasLiked === true ? null : true;
    setHasLiked(next);
    onFeedback?.(message.id, next ? "like" : "none");
  };

  const handleDislike = () => {
    const next = hasLiked === false ? null : false;
    setHasLiked(next);
    onFeedback?.(message.id, next === false ? "dislike" : "none");
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  useEffect(() => {
    if (message.isStreaming && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message.content, message.isStreaming]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("group w-full px-4 py-3", className)}
    >
      <div className="mx-auto w-full max-w-3xl">
        {isAssistant ? (
          /* ── AI message ── */
          <div className="flex gap-3 items-start">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">AI Assistant</span>
                <span className="text-[11px] text-muted-foreground/60">
                  {message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="text-sm leading-relaxed text-foreground">
                {isWaitingForStream ? (
                  <div className="flex items-center gap-1.5 py-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/70" />
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="ai-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Markdown content={message.content} className="text-foreground" />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {message.isStreaming && <div ref={messageEndRef} />}

              {/* Action bar */}
              {!isWaitingForStream && !message.isStreaming && (
                <div className="flex items-center gap-0.5 pt-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={handleCopy}
                    title="Copy"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <div className="mx-1 h-4 w-px bg-border" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7 rounded-md hover:bg-accent",
                      hasLiked === true
                        ? "text-green-500"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={handleLike}
                    title="Good response"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7 rounded-md hover:bg-accent",
                      hasLiked === false
                        ? "text-destructive"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={handleDislike}
                    title="Bad response"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── User message ── */
          <div className="flex justify-end">
            <div className="max-w-[78%] space-y-1">
              <div className="flex items-center justify-end gap-2">
                <span className="text-[11px] text-muted-foreground/60">
                  {message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-xs font-semibold text-foreground">You</span>
              </div>

              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2"
                >
                  <textarea
                    ref={textareaRef}
                    value={editedContent}
                    onChange={(e) => {
                      setEditedContent(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    className="w-full resize-none overflow-hidden rounded-2xl border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSave();
                      }
                      if (e.key === "Escape") handleCancel();
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 text-xs">
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                      Save
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="group/bubble relative">
                  <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>

                  {/* Action bar */}
                  <div className="mt-1 flex items-center justify-end gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                      onClick={handleCopy}
                      title="Copy"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                      onClick={() => {
                        setEditedContent(message.content);
                        setIsEditing(true);
                      }}
                      title="Edit"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
