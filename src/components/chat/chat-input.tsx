"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile } from "lucide-react";
import { ModelPicker } from "./model-picker";

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
    <div className="sticky bottom-0 w-full">
      <div className="mx-auto max-w-2xl px-2 py-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end gap-2 p-0 bg-transparent">
            <div className="flex items-center">
              {showModelPicker && <ModelPicker />}
            </div>
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                placeholder="Type your message..."
                className="min-h-[40px] max-h-[120px] w-full resize-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm rounded-lg shadow-none focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-700 transition-all"
                disabled={isDisabled}
                rows={rows}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md opacity-70 hover:opacity-100 transition-colors"
                  disabled={isDisabled}
                >
                  <Smile className="h-4 w-4" />
                  <span className="sr-only">Add emoji</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md opacity-70 hover:opacity-100 transition-colors"
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
              className="h-9 w-9 shrink-0 rounded-lg bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-700 transition-all disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400"
              disabled={isDisabled || !message.trim()}
            >
              {isDisabled ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}
