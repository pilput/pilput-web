"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen w-full bg-background text-foreground flex overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col h-full min-h-0">
          {/* Mobile sidebar trigger */}
          <div className="lg:hidden p-4">
            <SidebarTrigger />
          </div>

          <div className="flex-1 flex flex-col min-h-0">{children}</div>

          {/* Minimal Footer */}
          <div className="border-t border-border py-3 px-4 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} pilput. An AI-powered conversation.
            </p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
