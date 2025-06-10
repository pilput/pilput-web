"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus, MessageSquare, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "@/stores/chat-store";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentConvertations: string;
}

export function ChatSidebar({
  isOpen,
  onClose,
  currentConvertations,
}: ChatSidebarProps) {
  const [isHoveringClose, setIsHoveringClose] = useState(false);
  const { recentChats, fetchRecentChats } = useChatStore();

  useEffect(() => {
    fetchRecentChats();
  }, [fetchRecentChats]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r border-border transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
          "flex flex-col h-screen min-h-0"
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-background">
          <h2 className="text-base font-semibold text-foreground">AI Chat</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-7 w-7 p-0"
            onClick={onClose}
            onMouseEnter={() => setIsHoveringClose(true)}
            onMouseLeave={() => setIsHoveringClose(false)}
          >
            {isHoveringClose ? (
              <X className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Menu className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-3">
          <Link
            href="/chat"
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-normal text-center text-muted-foreground border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Link>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 px-2 h-0 min-h-0 max-h-[calc(100vh-176px)] overflow-y-auto">
          <div className="space-y-1">
            {recentChats.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-xs dark:text-muted-foreground-dark">
                No conversations yet.
              </div>
            ) : (
              recentChats.map((chat: any, idx: number) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "flex items-center w-full justify-start font-normal text-sm text-left overflow-hidden text-ellipsis whitespace-nowrap rounded-md px-2 py-2 transition-colors",
                    chat.id === currentConvertations
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 text-muted-foreground"
                  )}
                  tabIndex={0}
                  aria-current={
                    chat.id === currentConvertations ? "true" : undefined
                  }
                >
                  <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0 opacity-70" />
                  <span className="truncate">{chat.title}</span>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-background flex flex-col gap-1">
          <div className="text-[10px] text-muted-foreground text-center">
            <p>Your conversations are saved.</p>
          </div>
          {/* Minimal User/Profile Placeholder */}
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-muted-foreground text-xs font-semibold">
              U
            </div>
            <span className="text-xs text-muted-foreground font-normal">User</span>
          </div>
        </div>
      </aside>
    </>
  );
}
