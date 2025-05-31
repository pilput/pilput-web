"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, MessageSquare, User, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const params = useParams();
  const currentConversationId = params?.id as string;
  const { recentChats, fetchRecentChats } = useChatStore();
  const { toggleSidebar, state } = useSidebar();

  useEffect(() => {
    fetchRecentChats();
  }, [fetchRecentChats]);

  return (
    <Sidebar collapsible="icon" className="border-r border-neutral-800">
      {/* Header */}
      <SidebarHeader className="px-4 py-3 border-b border-neutral-800 flex flex-row items-center justify-between">
        <h2 className="text-base font-semibold text-neutral-200 group-data-[collapsible=icon]:hidden">
          AI Chat
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-6 w-6 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
        >
          {state === "expanded" ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        {/* New Chat Button */}
        <SidebarGroup>
          <SidebarGroupContent className="px-4 py-3 group-data-[collapsible=icon]:px-2">
            <Link
              href="/chat"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-normal text-center text-neutral-300 border border-neutral-800 rounded-md hover:bg-neutral-900 transition-colors",
                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
              )}
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat List */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs text-neutral-500 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
            Recent Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentChats.length === 0 ? (
                <div className="text-center text-neutral-500 py-8 text-xs px-4 group-data-[collapsible=icon]:hidden">
                  No conversations yet.
                </div>
              ) : (
                recentChats.map((chat: any) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={chat.id === currentConversationId}
                      className={cn(
                        "w-full justify-start font-normal text-sm text-left overflow-hidden text-ellipsis whitespace-nowrap",
                        chat.id === currentConversationId
                          ? "bg-neutral-800 text-neutral-100"
                          : "hover:bg-neutral-900 text-neutral-300"
                      )}
                      tooltip={chat.title}
                    >
                      <Link href={`/chat/${chat.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0 opacity-70" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">{chat.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-4 py-3 border-t border-neutral-800 group-data-[collapsible=icon]:px-2">
        <div className="flex flex-col gap-1 group-data-[collapsible=icon]:items-center">
          <div className="text-[10px] text-neutral-500 text-center group-data-[collapsible=icon]:hidden">
            <p>Your conversations are saved.</p>
          </div>
          {/* User Profile */}
          <div className="flex items-center justify-center gap-2 mt-1 group-data-[collapsible=icon]:mt-0">
            <div className="h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs font-semibold">
              <User className="h-3 w-3" />
            </div>
            <span className="text-xs text-neutral-400 font-normal group-data-[collapsible=icon]:hidden">User</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
} 