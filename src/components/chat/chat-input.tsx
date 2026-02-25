"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, AlertCircle } from "lucide-react";
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
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedModel, availableModels } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setRows(1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleInput = () => {
    if (!textareaRef.current) return;

    // Reset height to get the correct scrollHeight
    textareaRef.current.style.height = "auto";

    // Calculate the number of rows needed (max 6 rows)
    const newRows = Math.min(
      Math.max(1, Math.ceil((textareaRef.current.scrollHeight - 16) / 24)),
      6
    );

    setRows(newRows);
  };

  useEffect(() => {
    if (textareaRef.current) {
      handleInput();
    }
  }, [message]);

  // Find the selected model name for display
  const selectedModelName = availableModels.find(model => model.id === selectedModel)?.name || "Unknown Model";

  return (
    <div className="w-full rounded-[1.25rem] border border-border/60 bg-gradient-to-b from-background/95 via-background/90 to-background/80 shadow-[0_16px_40px_-28px_hsl(var(--foreground)/0.45)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto max-w-4xl px-3 py-3 sm:px-4 sm:py-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              {showModelPicker && <ModelPicker />}
              <span className="text-xs text-muted-foreground">
                Enter to send • Shift+Enter for new line
              </span>
            </div>
            <div className="flex items-end gap-2 rounded-2xl border border-border/70 bg-card/90 px-2.5 py-2.5 sm:px-3 sm:py-3 shadow-sm">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  placeholder="Type your message..."
                  className="min-h-[44px] max-h-[180px] w-full resize-none border-0 bg-transparent px-0 py-1 text-sm outline-none focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-16 sm:pr-20"
                  disabled={isDisabled}
                  rows={rows}
                />
                <div className="absolute right-0 bottom-0 flex items-center gap-1 pb-0.5 sm:pb-1 pr-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md"
                          disabled={isDisabled}
                        >
                          <Paperclip className="h-4 w-4" />
                          <span className="sr-only">Attach file</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Attach file</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-11 w-11 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring transition-all disabled:bg-muted disabled:text-muted-foreground"
                      disabled={isDisabled || !message.trim()}
                    >
                      {isDisabled ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span className="sr-only">Send message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="flex items-center gap-2">
                    {message.trim() ? (
                      <>
                        <span>Send with {selectedModelName}</span>
                        <Send className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>Type a message first</span>
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
