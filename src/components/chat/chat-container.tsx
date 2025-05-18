"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessage, type Message } from "./chat-message";
import { axiosInstence2 } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";

interface ChatContainerProps {
  currentConvertations: string;
  onUpdateCurrentConvertations: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

interface sendMessageResponse {
  id: string;
  content: string;
}

export function ChatContainer({
  currentConvertations,
  onUpdateCurrentConvertations,
  onUpdateTitle,
}: ChatContainerProps) {
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
        onUpdateTitle(response.data.id, content);
        onUpdateCurrentConvertations(response.data.id);
      }

      fetchMessages();
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

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Messages area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 min-h-0"
      >
        <div className="max-w-3xl mx-auto w-full px-4 h-full">
          {messages.map((message, index) => (
            <ChatMessage
              key={`${message.id}-${index}`}
              message={message}
              className={index === messages.length - 1 ? "pb-20" : ""}
              onEdit={(id, content) => {
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === id ? { ...msg, content } : msg))
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
          <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            AI Assistant may produce inaccurate information about people,
            places, or facts.
          </p>
        </div>
      </div>
    </div>
  );
}
