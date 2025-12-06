"use client";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen w-full bg-background text-foreground flex overflow-hidden">
        <ChatSidebar />

        <div className="flex-1 flex flex-col h-full min-h-0 bg-background">
          <div className="lg:hidden p-4">
            <SidebarTrigger />
          </div>

          <div className="flex-1 flex flex-col min-h-0">{children}</div>

          <div className="border-t border-border py-3 px-4 text-center bg-card/80 backdrop-blur">
            <p className="text-xs text-muted-foreground">
              (c) {new Date().getFullYear()} pilput. AI-powered conversation.
            </p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
