"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, MessageSquare, PanelLeftClose, PanelLeftOpen, Trash2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore, type Conversation } from "@/stores/chat-store";
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
import { ChatPagination } from "./chat-pagination";

export function ChatSidebar() {
  const params = useParams();
  const currentConversationId = params?.id as string;
  const {
    conversations,
    fetchConversations,
    conversationsPagination,
    loadMoreConversations,
    isNewConversation,
    deleteConversation,
  } = useChatStore();
  const { toggleSidebar, state } = useSidebar();
  const { fetch: fetchUser, data: userData } = authStore();

  useEffect(() => {
    fetchConversations(0, 15);
    fetchUser();
  }, [isNewConversation, fetchConversations, fetchUser]);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-sidebar text-sidebar-foreground"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-border/50">
        {/* Expanded state */}
        <div className="flex items-center justify-between px-4 py-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              pilput <span className="text-primary font-bold">AI</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
            <span className="sr-only">Collapse sidebar</span>
          </Button>
        </div>

        {/* Collapsed (icon) state — clicking expands sidebar */}
        <button
          onClick={toggleSidebar}
          title="Expand sidebar"
          className="hidden group-data-[collapsible=icon]:flex w-full flex-col items-center gap-3 py-3 px-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-1">
        {/* New Chat Button */}
        <SidebarGroup className="py-2 group-data-[collapsible=icon]:py-1">
          <SidebarGroupContent>
            {/* Expanded */}
            <Button
              asChild
              className="w-full justify-start gap-2 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm group-data-[collapsible=icon]:hidden"
            >
              <Link href="/chat" title="New Chat">
                <Plus className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">New Chat</span>
              </Link>
            </Button>

            {/* Collapsed — icon only, centered */}
            <div className="hidden group-data-[collapsible=icon]:flex justify-center">
              <Button
                asChild
                size="icon"
                className="h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                title="New Chat"
              >
                <Link href="/chat">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat List — only in expanded mode */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden py-1">
          <SidebarGroupLabel className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 px-3 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <MessageSquare className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground/60">Start a new chat above</p>
                </div>
              ) : (
                <>
                  {conversations.map((chat: Conversation) => {
                    const isActive = chat.id === currentConversationId;
                    return (
                      <SidebarMenuItem key={chat.id}>
                        <div className="group/item relative flex items-center">
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={cn(
                              "h-9 w-full flex-1 rounded-lg px-3 text-sm transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground font-normal"
                            )}
                            tooltip={chat.title}
                          >
                            <Link href={`/chat/${chat.id}`} className="flex items-center gap-2.5 pr-6">
                              <MessageSquare
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0",
                                  isActive ? "text-primary" : "text-muted-foreground/60"
                                )}
                              />
                              <span className="truncate">{chat.title}</span>
                            </Link>
                          </SidebarMenuButton>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md opacity-0 group-hover/item:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                                title="Delete conversation"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConversation(chat.id);
                                }}
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete conversation
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </SidebarMenuItem>
                    );
                  })}

                  <ChatPagination
                    currentPage={conversationsPagination.page}
                    totalPages={Math.ceil(conversationsPagination.total / conversationsPagination.limit)}
                    onLoadMore={loadMoreConversations}
                    hasMore={conversationsPagination.hasMore}
                    totalConversations={conversationsPagination.total}
                    currentCount={conversations.length}
                  />
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border/50 p-2 group-data-[collapsible=icon]:p-1">
        {/* Expanded */}
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent transition-colors cursor-default group-data-[collapsible=icon]:hidden">
          <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border">
            <AvatarImage src={userData.image} alt={userData.username} />
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {userData.username ? userData.username[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate leading-tight">
              {userData.username}
            </span>
            <span className="text-[11px] text-muted-foreground truncate leading-tight">
              {userData.email}
            </span>
          </div>
        </div>

        {/* Collapsed — avatar only, centered */}
        <div className="hidden group-data-[collapsible=icon]:flex justify-center py-1">
          <Avatar className="h-7 w-7 ring-1 ring-border">
            <AvatarImage src={userData.image} alt={userData.username} />
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {userData.username ? userData.username[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
