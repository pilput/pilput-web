"use client";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import React from "react";

interface ChatLayoutClientProps {
  children: React.ReactNode;
}

export default function ChatLayoutClient({ children }: ChatLayoutClientProps) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="h-screen w-full bg-background text-foreground flex overflow-hidden">
          <ChatSidebar />

          <div className="flex-1 flex flex-col h-full min-h-0 bg-background">
            <div className="lg:hidden shrink-0 border-b border-border/60 bg-background/85 px-3 py-2 backdrop-blur">
              <SidebarTrigger />
            </div>

            <div className="flex-1 flex flex-col min-h-0">{children}</div>

            <div className="shrink-0 border-t border-border/60 bg-card/80 px-4 py-2 text-center backdrop-blur">
              <p className="text-xs text-muted-foreground">
                (c) {new Date().getFullYear()} pilput. AI-powered conversation.
              </p>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
