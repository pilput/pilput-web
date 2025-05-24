"use client";

import { useRef, useEffect, useCallback } from "react";
import { useChatStore } from '@/stores/chat-store';
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { useRouter } from "next/navigation";

interface ChatContainerProps {
  currentConvertations: string;
}

export function ChatContainer({ currentConvertations }: ChatContainerProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, fetchMessages, sendMessage, editMessage } = useChatStore();

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  // Handle new messages being added
  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);
  // fetchMessages is now handled via Zustand store

  useEffect(() => {
    if (!currentConvertations) return;
    fetchMessages(currentConvertations);
  }, [currentConvertations, fetchMessages]);

  const handleSendMessage = (content: string) => {
    sendMessage(content, currentConvertations, router);
  };

  if (currentConvertations === "") {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
          <div className="flex flex-col items-center gap-2">
            {/* Illustration */}
            <div className="rounded-full bg-primary/10 p-4 mb-2">
              <svg
                width="48"
                height="48"
                fill="none"
                viewBox="0 0 48 48"
                className="text-primary"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="24"
                  fill="currentColor"
                  fillOpacity=".2"
                />
                <path
                  d="M24 14a7 7 0 0 0-7 7v2a7 7 0 0 0 14 0v-2a7 7 0 0 0-7-7Zm-5 9v-2a5 5 0 1 1 10 0v2a5 5 0 1 1-10 0Zm-2 10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H18a1 1 0 0 1-1-1v-1Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Start a New Chat
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Say hello to your AI Assistant! Type your first message below to
              begin a new conversation.
            </p>
          </div>
          <div className="w-full">
            <ChatInput
              onSendMessage={handleSendMessage}
              isDisabled={isLoading}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
        {/* Messages area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden py-4 min-h-0"
        >
          <div className="max-w-5xl mx-auto w-full px-4 h-full">
            {messages.map((message, index) => (
              <ChatMessage
                key={`${message.id}-${index}`}
                message={message}
                className={index === messages.length - 1 ? "pb-20" : ""}
                onEdit={editMessage}
                onFeedback={(id, type) => {
                  // Handle feedback (e.g., send to analytics)
                  console.log(`Feedback for message ${id}: ${type}`);
                }}
              />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input area - fixed at bottom */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-3xl mx-auto w-full p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              isDisabled={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }
}
