"use client";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React from "react";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="h-screen w-full bg-gray-900 text-gray-100 flex overflow-hidden">
      {/* Mobile sidebar toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-20 lg:hidden h-10 w-10"
        onClick={() => {}}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      {/* Sidebar */}
      <ChatSidebar
        isOpen={false}
        onClose={() => {}}
        currentConvertations={""}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full min-h-0">
        <div className="flex-1 flex flex-col min-h-0">{children}</div>

        {/* Minimal Footer */}
        <div className="border-t border-gray-800 py-3 px-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} pilput. An AI-powered conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
