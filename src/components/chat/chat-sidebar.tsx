"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
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
import { authStore } from "@/stores/userStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ChatSidebar() {
  const params = useParams();
  const currentConversationId = params?.id as string;
  const { recentChats, fetchRecentChats, isNewConversation } = useChatStore();
  const { toggleSidebar, state } = useSidebar();
  const { fetch: fetchUser, data: userData } = authStore();

  useEffect(() => {
    fetchRecentChats();
    fetchUser();
  }, [isNewConversation]);

  // console.log(userData);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar bg-gradient-to-b from-sidebar to-sidebar/95 text-sidebar-foreground shadow-lg"
    >
      {/* Header */}
      <SidebarHeader className="px-4 py-4 border-b border-sidebar-border/50 bg-sidebar-accent/20 backdrop-blur-sm flex flex-row items-center justify-between group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <h2 className="text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text">
          AI Chat
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60 hover:scale-110 transition-all duration-200 rounded-full group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7"
        >
          {state === "expanded" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        {/* New Chat Button */}
        <SidebarGroup>
          <SidebarGroupContent className="px-4 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
            <Link
              href="/chat"
              className={cn(
                "flex items-center gap-3 px-6 py-4 text-sm font-semibold text-center bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground border-0 rounded-xl hover:from-primary/90 hover:via-primary/95 hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 group relative overflow-hidden",
                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-4 group-data-[collapsible=icon]:py-4 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:shadow-xl group-data-[collapsible=icon]:hover:shadow-2xl group-data-[collapsible=icon]:hover:shadow-primary/30 group-data-[collapsible=icon]:hover:scale-110"
              )}
              title="New Chat"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Plus className="w-5 h-5 flex-shrink-0 group-hover:rotate-180 transition-transform duration-300 relative z-10 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5" />
              <span className="group-data-[collapsible=icon]:hidden relative z-10">
                New Chat
              </span>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat List */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="px-4 text-xs text-muted-foreground/70 uppercase tracking-wider font-semibold">
            Recent Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {recentChats.length === 0 ? (
                <div className="text-center text-muted-foreground/50 py-12 text-sm px-4 flex flex-col items-center gap-2">
                  <MessageSquare className="w-8 h-8 opacity-30" />
                  <p>No conversations yet.</p>
                  <p className="text-xs">Start a new chat to get started!</p>
                </div>
              ) : (
                recentChats.map((chat: any) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={chat.id === currentConversationId}
                      className={cn(
                        "w-full justify-start font-normal text-sm text-left overflow-hidden text-ellipsis whitespace-nowrap rounded-lg mx-2 transition-all duration-200 group",
                        chat.id === currentConversationId
                          ? "bg-primary/20 text-primary border border-primary/30 shadow-md"
                          : "hover:bg-sidebar-accent/80 text-muted-foreground hover:text-sidebar-accent-foreground hover:shadow-sm"
                      )}
                      tooltip={chat.title}
                    >
                      <Link href={`/chat/${chat.id}`} className="flex items-center gap-3 px-3 py-2">
                        <MessageSquare className={cn(
                          "h-4 w-4 flex-shrink-0 transition-all duration-200",
                          chat.id === currentConversationId
                            ? "opacity-90 text-primary"
                            : "opacity-60 group-hover:opacity-90"
                        )} />
                        <span className="truncate">
                          {chat.title}
                        </span>
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
      <SidebarFooter className="px-4 py-4 border-t border-sidebar-border/50 bg-sidebar-accent/10 backdrop-blur-sm group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <div className="flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
          <div className="text-[10px] text-muted-foreground/60 text-center group-data-[collapsible=icon]:hidden">
            <p>🔒 Your conversations are saved securely.</p>
          </div>
          {/* User Profile */}
          <div className="flex items-center justify-center gap-3 mt-2 p-2 rounded-lg bg-sidebar-accent/20 hover:bg-sidebar-accent/30 transition-all duration-200 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:hover:bg-sidebar-accent/40 group-data-[collapsible=icon]:hover:scale-105">
            <Avatar className="h-7 w-7 ring-2 ring-sidebar-accent/50 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
              <AvatarImage src={userData.image} alt={userData.username} />
              <AvatarFallback className="text-xs font-semibold group-data-[collapsible=icon]:text-[10px]">
                {userData.username ? userData.username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-sidebar-foreground font-medium group-data-[collapsible=icon]:hidden">
              {userData.username}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
