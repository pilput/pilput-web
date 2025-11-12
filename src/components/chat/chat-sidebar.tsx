"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, MessageSquare, ChevronLeft, ChevronRight, MoreVertical, Trash2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ChatSidebar() {
  const params = useParams();
  const currentConversationId = params?.id as string;
  const { recentChats, fetchRecentChats, isNewConversation, deleteConversation } = useChatStore();
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
      className="border-r border-sidebar-border/60 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/90 text-sidebar-foreground shadow-xl shadow-sidebar-border/20 backdrop-blur-sm"
    >
      {/* Header */}
      <SidebarHeader className="px-3 py-3 border-b border-sidebar-border/40 bg-gradient-to-r from-sidebar-accent/30 via-sidebar-accent/20 to-sidebar-accent/30 backdrop-blur-md flex flex-row items-center justify-between group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2 shadow-sm">
        <h2 className="text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden bg-gradient-to-r from-sidebar-foreground via-sidebar-foreground/90 to-sidebar-foreground/70 bg-clip-text text-transparent">
          AI Chat
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/70 hover:scale-110 transition-all duration-250 rounded-full shadow-sm hover:shadow-md border border-transparent hover:border-sidebar-border/30 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7"
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
          <SidebarGroupContent className="px-3 py-3 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:px-3"
            >
              <Link href="/chat" title="New Chat">
                <Plus className="w-5 h-5 flex-shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  New Chat
                </span>
              </Link>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat List */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="px-3 text-xs text-muted-foreground/80 uppercase tracking-wider font-semibold mb-2">
            Recent Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-1">
              {recentChats.length === 0 ? (
                <div className="text-center text-muted-foreground/60 py-8 text-sm px-3 flex flex-col items-center gap-3 bg-sidebar-accent/10 rounded-xl border border-dashed border-sidebar-border/30">
                  <MessageSquare className="w-10 h-10 opacity-40 text-muted-foreground/50" />
                  <p className="font-medium">No conversations yet.</p>
                  <p className="text-xs text-muted-foreground/70">Start a new chat to get started!</p>
                </div>
              ) : (
                recentChats.map((chat: any) => (
                  <SidebarMenuItem key={chat.id}>
                    <div className="relative group/item flex items-center">
                      <SidebarMenuButton
                        asChild
                        isActive={chat.id === currentConversationId}
                        className={cn(
                          "flex-1 justify-start font-normal text-sm text-left overflow-hidden text-ellipsis whitespace-nowrap rounded-xl transition-all duration-250 group hover:scale-[1.01]",
                          chat.id === currentConversationId
                            ? "bg-gradient-to-r from-primary/25 via-primary/20 to-primary/15 text-primary border border-primary/40 shadow-lg shadow-primary/20"
                            : "hover:bg-sidebar-accent/70 text-muted-foreground hover:text-sidebar-foreground hover:shadow-md hover:border hover:border-sidebar-border/50"
                        )}
                        tooltip={chat.title}
                      >
                        <Link href={`/chat/${chat.id}`} className="flex items-center gap-3 px-3 py-2 pr-8">
                          <MessageSquare className={cn(
                            "h-4 w-4 flex-shrink-0 transition-all duration-250",
                            chat.id === currentConversationId
                              ? "opacity-100 text-primary scale-110"
                              : "opacity-70 group-hover:opacity-100 group-hover:scale-105"
                          )} />
                          <span className="truncate font-medium">
                            {chat.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover/item:opacity-100 hover:bg-sidebar-accent/80 transition-all duration-200 rounded-md"
                            title="More options"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(chat.id);
                            }}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-3 py-3 border-t border-sidebar-border/40 bg-gradient-to-t from-sidebar-accent/20 via-sidebar-accent/10 to-sidebar-accent/5 backdrop-blur-md group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2 shadow-inner">
        <div className="flex flex-col gap-3 group-data-[collapsible=icon]:items-center">
          {/* User Profile */}
          <div className="flex items-center justify-center gap-3 mt-1 p-2 rounded-xl bg-gradient-to-r from-sidebar-accent/30 via-sidebar-accent/20 to-sidebar-accent/30 hover:from-sidebar-accent/40 hover:via-sidebar-accent/30 hover:to-sidebar-accent/40 transition-all duration-300 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:hover:bg-sidebar-accent/50 group-data-[collapsible=icon]:hover:scale-105 shadow-sm hover:shadow-md border border-sidebar-border/30">
            <Avatar className="h-8 w-8 ring-2 ring-sidebar-accent/60 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7 shadow-sm">
              <AvatarImage src={userData.image} alt={userData.username} />
              <AvatarFallback className="text-xs font-semibold group-data-[collapsible=icon]:text-[10px] bg-gradient-to-br from-primary/20 to-primary/10">
                {userData.username ? userData.username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-sidebar-foreground font-semibold group-data-[collapsible=icon]:hidden">
              {userData.username}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
