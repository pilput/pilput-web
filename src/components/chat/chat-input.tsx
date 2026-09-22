"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, AlertCircle, CornerDownLeft } from "lucide-react";
import { ModelPicker } from "./model-picker";
import { useChatStore } from "@/stores/chat-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
  showModelPicker?: boolean;
}

export function ChatInput({
  onSendMessage,
  isDisabled = false,
  showModelPicker = true,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedModel, availableModels } = useChatStore();

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      handleInput();
    }
  }, [message]);

  // Find the selected model name for display
  const selectedModelName = availableModels.find(model => model.id === selectedModel)?.name || "Unknown Model";

  return (
    <div className="w-full rounded-[1.25rem] border border-border/70 bg-card/90 shadow-[0_20px_45px_-32px_rgba(0,0,0,0.55)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/75 dark:border-white/[0.08] dark:bg-card/95">
      <div className="mx-auto max-w-4xl p-2.5 sm:p-3">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 px-1">
              {showModelPicker && <ModelPicker />}
              <span className="hidden text-[11px] text-muted-foreground sm:inline">
                Shift + Enter for a new line
              </span>
            </div>
            <div className="flex items-end gap-2 rounded-xl bg-muted/45 px-3 py-2 sm:px-3.5 dark:bg-black/15">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  placeholder="Write your message..."
                  aria-label="Chat message"
                  className="min-h-[44px] max-h-[180px] w-full resize-none border-0 bg-transparent px-0 py-1.5 text-sm leading-6 shadow-none outline-none focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isDisabled}
                  rows={1}
                />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring transition-all disabled:bg-transparent disabled:text-muted-foreground"
                      disabled={isDisabled || !message.trim()}
                    >
                      {isDisabled ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      ) : (
                        <Send className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">Send message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="flex items-center gap-2">
                    {message.trim() ? (
                      <>
                        <span>Send with {selectedModelName}</span>
                        <CornerDownLeft className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>Write a message first</span>
                      </>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
