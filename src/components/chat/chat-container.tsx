"use client";

import { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/stores/chat-store";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Zap, BookOpen, Code2, PenLine } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: Zap,
    label: "Explain a concept",
    prompt: "Explain quantum computing in simple terms",
  },
  {
    icon: Code2,
    label: "Help with code",
    prompt: "Help me write a React hook for debouncing input",
  },
  {
    icon: PenLine,
    label: "Write something",
    prompt: "Write a short professional bio for a software developer",
  },
  {
    icon: BookOpen,
    label: "Summarize",
    prompt: "Summarize the key principles of clean code",
  },
];

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
      <div className="flex h-full flex-col items-center justify-center bg-background px-4 py-10">
        <div className="flex w-full max-w-2xl flex-col items-center gap-8">
          {/* Hero */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                pilput <span className="text-primary">AI</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask anything — I&apos;m here to help you think, write, and build.
              </p>
            </div>
          </div>

          {/* Suggestion prompts */}
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
            {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => handleSendMessage(prompt)}
                disabled={isSending}
                className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm disabled:pointer-events-none disabled:opacity-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">
                    {prompt}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="w-full">
            <ChatInput
              showModelPicker={true}
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
          <div className="mx-auto w-full max-w-3xl px-2">
            {isFetchingMessages ? (
              <div className="space-y-6 px-4 py-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`flex gap-3 ${i % 2 !== 0 ? "flex-row-reverse" : ""}`}>
                    <Skeleton className="h-7 w-7 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage
                  key={`${message.id}-${index}`}
                  message={message}
                  className={index === messages.length - 1 ? "pb-4" : ""}
                />
              ))
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border/50 bg-background/95 px-3 pb-4 pt-3 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput onSendMessage={handleSendMessage} isDisabled={isSending} />
        </div>
      </div>
    </div>
  );
}
