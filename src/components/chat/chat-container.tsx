"use client";

import { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/stores/chat-store";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ChatContainerProps {
  currentConversation: string;
}

export function ChatContainer({ currentConversation }: ChatContainerProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    fetchMessages,
    sendMessage,
    createConversation,
    isNewConversation,
    selectedModel,
    availableModels,
    loadingStates,
  } = useChatStore();

  const isSending =
    loadingStates.sendingMessage || loadingStates.creatingConversation;
  const isFetchingMessages = loadingStates.fetchingMessages;

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!currentConversation) return;
    if (isNewConversation) return;
    fetchMessages(currentConversation);
  }, [currentConversation, isNewConversation, fetchMessages]);

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) {
      const conversationId = await createConversation("", content);
      if (conversationId) {
        router.replace("/chat/" + conversationId);
        sendMessage(content, conversationId);
      }
    } else {
      await sendMessage(content, currentConversation);
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
          <div className="flex flex-col items-center gap-2">
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
            <h2 className="text-2xl font-bold text-foreground">
              Start a New Chat
            </h2>
            <p className="text-muted-foreground text-center">
              Say hello to your AI Assistant! Type your first message below to
              begin a new conversation.
            </p>
          </div>
          <div className="w-full">
            <ChatInput
              showModelPicker={false}
              onSendMessage={handleSendMessage}
              isDisabled={isSending}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 min-h-0">
        <div ref={chatContainerRef} className="py-4">
          <div className="max-w-6xl mx-auto w-full px-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={`${message.id}-${index}`}
                message={message}
                className={index === messages.length - 1 ? "pb-20" : ""}
                showSeparator={index < messages.length - 1}
              />
            ))}
            {isFetchingMessages && (
              <div className="py-4 px-4">
                <div className="max-w-3xl mx-auto w-full">
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      </ScrollArea>

      <div className="bg-gradient-to-t from-background via-background/95 to-transparent px-2 pb-4 pt-2 sm:px-3">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {availableModels.find((m) => m.id === selectedModel)?.name ??
                "Unknown Model"}
            </Badge>
          </div>
          <ChatInput onSendMessage={handleSendMessage} isDisabled={isSending} />
        </div>
      </div>
    </div>
  );
}
