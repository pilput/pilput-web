"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessage, type Message } from "./chat-message";
import { axiosInstence2 } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { useRouter } from "next/navigation";

interface ChatContainerProps {
  currentConvertations: string;
}

export function ChatContainer({ currentConvertations }: ChatContainerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now().toString(),
      content: "message",
      role: "user",
      createdAt: new Date(),
      isStreaming: false,
    },
  ]);

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
  function fetchMessages() {
    axiosInstence2(`/v1/chat/conversations/${currentConvertations}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if needed
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;
        setMessages(
          data.messages.map((message: any) => ({
            ...message,
            createdAt: new Date(message.createdAt),
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }

  useEffect(() => {
    if (!currentConvertations) return;
    fetchMessages();
  }, [currentConvertations]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const newmessage = {
      id: Date.now().toString(),
      content: content,
      role: "user" as const,
      createdAt: new Date(),
      isStreaming: false,
    };

    setMessages((prev) => [...prev, newmessage]);

    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      let endpoint: string;
      let data: any;
      if (currentConvertations === "") {
        endpoint = `/v1/chat/conversations`;
        data = {
          title: content.slice(0, 15) + (content.length > 15 ? "" : ""),
          message: content,
        };
      } else {
        endpoint = `/v1/chat/conversations/${currentConvertations}/messages`;
        data = {
          content: content,
        };
      }

      const response = await axiosInstence2(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if needed
          Authorization: `Bearer ${getToken()}`,
        },
        data,
      });

      clearTimeout(timeoutId);

      if (response.status !== 201) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (currentConvertations === "") {
        router.replace("/chat/" + response.data.id);
      } else {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the temporary message and add an error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== newmessage.id);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          createdAt: new Date(),
          isStreaming: false,
        };
        return [...filtered, errorMessage];
      });
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
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
                onEdit={(id, content) => {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === id ? { ...msg, content } : msg
                    )
                  );
                }}
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
