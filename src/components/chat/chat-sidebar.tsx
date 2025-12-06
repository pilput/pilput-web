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
    deleteConversation
  } = useChatStore();
  const { toggleSidebar, state } = useSidebar();
  const { fetch: fetchUser, data: userData } = authStore();

  useEffect(() => {
    fetchConversations(0, 15);
    fetchUser();
  }, [isNewConversation]);

  // console.log(userData);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/70 bg-card/90 text-foreground shadow-lg shadow-border/20 backdrop-blur"
    >
      <SidebarHeader className="px-3 py-3 border-b border-border/60 bg-card/80 flex flex-row items-center justify-between group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
        <h2 className="text-xl font-bold group-data-[collapsible=icon]:hidden text-foreground">
          AI Chat
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 rounded-full border border-transparent group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7"
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
              className="w-full justify-start gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:px-3 rounded-xl border-border/70 bg-card hover:bg-primary/10 hover:text-primary"
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
              {conversations.length === 0 ? (
                <div className="text-center text-muted-foreground/60 py-8 text-sm px-3 flex flex-col items-center gap-3 bg-muted rounded-xl border border-dashed border-border/50">
                  <MessageSquare className="w-10 h-10 opacity-40 text-muted-foreground/50" />
                  <p className="font-medium">No conversations yet.</p>
                  <p className="text-xs text-muted-foreground/70">Start a new chat to get started!</p>
                </div>
              ) : (
                <>
                  {conversations.map((chat: any) => (
                    <SidebarMenuItem key={chat.id}>
                      <div className="relative group/item flex items-center">
                        <SidebarMenuButton
                          asChild
                          isActive={chat.id === currentConversationId}
                          className={cn(
                            "flex-1 justify-start font-normal text-sm text-left overflow-hidden text-ellipsis whitespace-nowrap rounded-xl transition-all duration-200 group hover:scale-[1.01]",
                            chat.id === currentConversationId
                              ? "bg-primary/10 text-primary border border-primary/30 shadow-md shadow-primary/10"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground hover:border hover:border-border/60"
                          )}
                          tooltip={chat.title}
                        >
                          <Link href={`/chat/${chat.id}`} className="flex items-center gap-3 px-3 py-2 pr-8">
                            <MessageSquare className={cn(
                              "h-4 w-4 flex-shrink-0 transition-all duration-200",
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
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover/item:opacity-100 hover:bg-muted transition-all duration-200 rounded-md"
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
                  ))}
                  
                  {/* Chat Pagination */}
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
      <SidebarFooter className="px-3 py-3 border-t border-border/60 bg-card/80 backdrop-blur group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
        <div className="flex flex-col gap-3 group-data-[collapsible=icon]:items-center">
          <div className="flex items-center justify-center gap-3 mt-1 p-2 rounded-xl bg-muted hover:bg-muted/80 transition-all duration-200 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:hover:scale-105 border border-border/60">
            <Avatar className="h-8 w-8 ring-2 ring-primary/30 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7 shadow-sm">
              <AvatarImage src={userData.image} alt={userData.username} />
              <AvatarFallback className="text-xs font-semibold group-data-[collapsible=icon]:text-[10px] bg-primary/10 text-primary">
                {userData.username ? userData.username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground font-semibold group-data-[collapsible=icon]:hidden">
              {userData.username}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
