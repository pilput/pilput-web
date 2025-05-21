"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  isDisabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div className="sticky bottom-0 w-full bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700 shadow-[0_-2px_16px_0_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="mx-auto max-w-3xl p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                placeholder="Message AI Assistant..."
                className="min-h-[60px] max-h-[200px] w-full resize-none pr-14 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary/70 transition-all shadow-sm"
                disabled={isDisabled}
                rows={rows}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  disabled={isDisabled}
                >
                  <Smile className="h-4 w-4" />
                  <span className="sr-only">Add emoji</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  disabled={isDisabled}
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 shrink-0 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/70 transition-all flex items-center justify-center disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-400"
              disabled={isDisabled || !message.trim()}
            >
              {isDisabled ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-primary" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          AI Assistant can make mistakes. Consider checking important
          information.
        </p>
      </div>
    </div>
  );
}
