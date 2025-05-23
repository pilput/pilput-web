"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus, MessageSquare, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstence2 } from "@/utils/fetch";
import { getToken, logOut } from "@/utils/Auth";

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
  const [recentChats, setRecentChats] = useState<any[]>([]);

  function getConvertions() {
    axiosInstence2
      .get("/v1/chat/conversations", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res: any) => {
        setRecentChats(res.data);
      })
      .catch((err: any) => {
        logOut();
        window.location.href = "/login";
      });
  }

  useEffect(() => {
    getConvertions();
  }, []);

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
          "fixed inset-y-0 left-0 z-30 w-64 bg-neutral-950 border-r border-neutral-800 transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
          "flex flex-col h-screen"
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <h2 className="text-base font-semibold text-neutral-200">AI Chat</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-7 w-7 p-0"
            onClick={onClose}
            onMouseEnter={() => setIsHoveringClose(true)}
            onMouseLeave={() => setIsHoveringClose(false)}
          >
            {isHoveringClose ? (
              <X className="h-4 w-4 text-neutral-400" />
            ) : (
              <Menu className="h-4 w-4 text-neutral-400" />
            )}
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-3">
          <Link
            href="/chat"
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-normal text-center text-neutral-300 border border-neutral-800 rounded-md hover:bg-neutral-900"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Link>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {recentChats.length === 0 ? (
              <div className="text-center text-neutral-500 py-8 text-xs">
                No conversations yet.
              </div>
            ) : (
              recentChats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "flex items-center w-full justify-start font-normal text-sm text-left overflow-hidden text-ellipsis whitespace-nowrap rounded-md px-2 py-2 transition-colors",
                    chat.id === currentConvertations
                      ? "bg-neutral-800 text-neutral-100"
                      : "hover:bg-neutral-900 text-neutral-300"
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
        <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-950 flex flex-col gap-1">
          <div className="text-[10px] text-neutral-500 text-center">
            <p>Your conversations are saved.</p>
          </div>
          {/* Minimal User/Profile Placeholder */}
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs font-semibold">
              U
            </div>
            <span className="text-xs text-neutral-400 font-normal">User</span>
          </div>
        </div>
      </aside>
    </>
  );
}
