"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, AlertCircle } from "lucide-react";
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
    <div className="sticky bottom-0 w-full bg-background/90 backdrop-blur-lg border-t border-border/50">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end gap-2">
            {showModelPicker && <ModelPicker />}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                placeholder="Type your message..."
                className="min-h-[44px] max-h-[140px] w-full resize-none border border-input bg-background px-4 py-3 text-sm rounded-xl shadow-sm focus-visible:ring-2 focus-visible:ring-ring transition-all pr-20"
                disabled={isDisabled}
                rows={rows}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md opacity-70 hover:opacity-100 transition-colors"
                        disabled={isDisabled}
                      >
                        <Smile className="h-4 w-4" />
                        <span className="sr-only">Add emoji</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add emoji</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md opacity-70 hover:opacity-100 transition-colors"
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
                    className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring transition-all disabled:bg-muted disabled:text-muted-foreground"
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
        </form>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          AI can make mistakes. Please verify important information. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
