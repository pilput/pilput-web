"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  PanelLeftClose,
  PanelLeftOpen,
  SquarePen,
  Search,
  X,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  Check,
  Sparkles,
  User,
  Settings,
  Home,
  Sun,
  Moon,
  LogOut,
  MessageSquareDashed,
  SearchX,
  ChevronDown,
} from "lucide-react";
import { cn } from "cn";
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
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { authStore } from "@/stores/userStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { logoutUser } from "@/utils/fetch";
import { getProfilePicture } from "@/utils/getImage";
import { ChatPagination } from "./chat-pagination";

export function ChatSidebar() {
  const params = useParams();
  const router = useRouter();
  const currentConversationId = params?.id as string;
  const {
    conversations,
    fetchConversations,
    conversationsPagination,
    loadMoreConversations,
    isNewConversation,
    deleteConversation,
    updateConversation,
    loadingStates,
  } = useChatStore();
  const { toggleSidebar } = useSidebar();
  const { fetch: fetchUser, data: userData } = authStore();
  const { resolvedTheme, setTheme } = useTheme();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [chatToDelete, setChatToDelete] = useState<Conversation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConversations(0, 15);
    fetchUser();
  }, [isNewConversation, fetchConversations, fetchUser]);

  // Keyboard shortcut Ctrl+K to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSaveRename = async (id: string) => {
    if (editTitle.trim()) {
      const originalTitle = conversations.find((c) => c.id === id)?.title;
      if (editTitle.trim() !== originalTitle) {
        await updateConversation(id, { title: editTitle.trim() });
      }
    }
    setEditingId(null);
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) return;
    setIsDeleting(true);
    const id = chatToDelete.id;
    try {
      await deleteConversation(id);
      if (currentConversationId === id) {
        router.push("/chat");
      }
    } finally {
      setIsDeleting(false);
      setChatToDelete(null);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
    router.refresh();
  };

  // Filter conversations based on search
  const isSearching = searchQuery.trim().length > 0;
  const filteredConversations = useMemo(() => {
    if (!isSearching) return conversations;
    const query = searchQuery.toLowerCase().trim();
    return conversations.filter((c) => c.title.toLowerCase().includes(query));
  }, [conversations, isSearching, searchQuery]);

  // Pinned conversations
  const pinnedConversations = useMemo(() => {
    return filteredConversations
      .filter((c) => c.is_pinned)
      .sort(
        (a, b) =>
          new Date(b.updated_at || b.created_at).getTime() -
          new Date(a.updated_at || a.created_at).getTime()
      );
  }, [filteredConversations]);

  // Unpinned conversations
  const unpinnedConversations = useMemo(() => {
    return filteredConversations
      .filter((c) => !c.is_pinned)
      .sort(
        (a, b) =>
          new Date(b.updated_at || b.created_at).getTime() -
          new Date(a.updated_at || a.created_at).getTime()
      );
  }, [filteredConversations]);

  // Date-based grouping for unpinned items
  const dateGroups = useMemo(() => {
    if (isSearching) {
      return [{ label: "Conversations", items: unpinnedConversations }];
    }

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOfLast7Days = startOfToday - 6 * 86400000;
    const startOfLast30Days = startOfToday - 29 * 86400000;

    const groups: {
      today: Conversation[];
      yesterday: Conversation[];
      last7Days: Conversation[];
      last30Days: Conversation[];
      older: Conversation[];
    } = {
      today: [],
      yesterday: [],
      last7Days: [],
      last30Days: [],
      older: [],
    };

    for (const item of unpinnedConversations) {
      const time = new Date(item.updated_at || item.created_at).getTime();
      if (time >= startOfToday) {
        groups.today.push(item);
      } else if (time >= startOfYesterday) {
        groups.yesterday.push(item);
      } else if (time >= startOfLast7Days) {
        groups.last7Days.push(item);
      } else if (time >= startOfLast30Days) {
        groups.last30Days.push(item);
      } else {
        groups.older.push(item);
      }
    }

    return [
      { label: "Today", items: groups.today },
      { label: "Yesterday", items: groups.yesterday },
      { label: "Last 7 days", items: groups.last7Days },
      { label: "Last 30 days", items: groups.last30Days },
      { label: "Older", items: groups.older },
    ].filter((group) => group.items.length > 0);
  }, [unpinnedConversations, isSearching]);

  // Render a conversation item in the list
  const renderConversationItem = (chat: Conversation) => {
    const isActive = chat.id === currentConversationId;

    return (
      <SidebarMenuItem key={chat.id}>
        {editingId === chat.id ? (
          <div className="flex w-full items-center gap-1 px-1 py-1">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveRename(chat.id);
                if (e.key === "Escape") setEditingId(null);
              }}
              className="h-7 w-full flex-1 rounded-md border border-primary/60 bg-background px-2 text-xs text-foreground outline-none ring-1 ring-primary/30 focus:border-primary"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveRename(chat.id);
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-primary hover:bg-primary/10 transition-colors"
              title="Save (Enter)"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditingId(null);
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              title="Cancel (Esc)"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="group/item relative flex items-center w-full">
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={cn(
                "relative h-8.5 w-full flex-1 rounded-lg px-2.5 text-xs font-normal transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-xs before:absolute before:inset-y-1.5 before:left-0 before:w-1 before:rounded-r-full before:bg-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
              tooltip={chat.title}
            >
              <Link
                href={`/chat/${chat.id}`}
                className="flex items-center pr-7 w-full gap-2"
              >
                {chat.is_pinned ? (
                  <Pin className="h-3 w-3 shrink-0 text-primary rotate-45" />
                ) : (
                  <MessageSquare className="h-3 w-3 shrink-0 text-muted-foreground/60 group-hover/item:text-foreground/70" />
                )}
                <span className="truncate flex-1 text-left">{chat.title}</span>
              </Link>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md transition-opacity",
                    "text-muted-foreground hover:bg-background/80 hover:text-foreground",
                    isActive
                      ? "opacity-80 group-hover/item:opacity-100"
                      : "opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100"
                  )}
                  title="Options"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  <span className="sr-only">Conversation options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 shadow-lg">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    updateConversation(chat.id, { is_pinned: !chat.is_pinned });
                  }}
                  className="cursor-pointer text-xs"
                >
                  {chat.is_pinned ? (
                    <>
                      <PinOff className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>Unpin</span>
                    </>
                  ) : (
                    <>
                      <Pin className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>Pin chat</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(chat.id);
                    setEditTitle(chat.title);
                  }}
                  className="cursor-pointer text-xs"
                >
                  <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatToDelete(chat);
                  }}
                  className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5 text-destructive" />
                  <span>Delete conversation</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarMenuItem>
    );
  };

  // User Dropdown Content Component
  const renderUserMenuContent = () => (
    <>
      <DropdownMenuLabel className="font-normal py-2">
        <div className="flex flex-col space-y-0.5">
          <p className="text-xs font-semibold leading-none text-foreground truncate">
            {userData.first_name
              ? `${userData.first_name} ${userData.last_name || ""}`.trim()
              : userData.username || "User"}
          </p>
          <p className="text-[11px] leading-none text-muted-foreground truncate">
            {userData.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {userData.username && (
        <DropdownMenuItem asChild className="cursor-pointer text-xs">
          <Link href={`/${userData.username}`}>
            <User className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem asChild className="cursor-pointer text-xs">
        <Link href="/account">
          <Settings className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Account Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer text-xs">
        <Link href="/">
          <Home className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Home</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="cursor-pointer text-xs"
      >
        {resolvedTheme === "dark" ? (
          <>
            <Sun className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>Dark Mode</span>
          </>
        )}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleLogout}
        className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
      >
        <LogOut className="mr-2 h-3.5 w-3.5 text-destructive" />
        <span>Log out</span>
      </DropdownMenuItem>
    </>
  );

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-sidebar-border/60 bg-sidebar text-sidebar-foreground shadow-[12px_0_36px_-30px_rgba(0,0,0,0.5)] backdrop-blur-xl dark:border-white/[0.08]"
      >
        {/* Header */}
        <SidebarHeader className="p-2">
          {/* Expanded State */}
          <div className="flex items-center justify-between px-2 py-1.5 group-data-[collapsible=icon]:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 group/brand transition-opacity hover:opacity-90"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs shadow-primary/20 transition-transform group-hover/brand:scale-105">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  pilput
                </span>
                <span className="rounded-md border border-primary/25 bg-primary/10 px-1 py-0.2 text-[10px] font-bold tracking-wider text-primary uppercase">
                  AI
                </span>
              </div>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-7 w-7 shrink-0 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                  <span className="sr-only">Close sidebar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Close sidebar (Ctrl+B)</TooltipContent>
            </Tooltip>
          </div>

          {/* Collapsed (Icon) State */}
          <div className="hidden group-data-[collapsible=icon]:flex w-full items-center justify-center py-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer"
                  aria-label="Open sidebar"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Open sidebar (Ctrl+B)</TooltipContent>
            </Tooltip>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 pt-1 group-data-[collapsible=icon]:px-1">
          {/* New Chat Button */}
          <SidebarGroup className="py-1 group-data-[collapsible=icon]:py-1">
            <SidebarGroupContent>
              {/* Expanded New Chat */}
              <Button
                asChild
                className="h-9 w-full justify-between rounded-lg bg-primary text-primary-foreground px-3 shadow-xs hover:bg-primary/90 transition-all cursor-pointer group-data-[collapsible=icon]:hidden"
              >
                <Link href="/chat" title="New Conversation">
                  <div className="flex items-center gap-2">
                    <SquarePen className="h-4 w-4" />
                    <span className="text-xs font-semibold">New Conversation</span>
                  </div>
                  <kbd className="pointer-events-none hidden rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground sm:inline-block">
                    ⌘K
                  </kbd>
                </Link>
              </Button>

              {/* Collapsed New Chat */}
              <div className="hidden group-data-[collapsible=icon]:flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-lg border-sidebar-border bg-sidebar hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-xs cursor-pointer"
                    >
                      <Link href="/chat" aria-label="New Conversation">
                        <SquarePen className="h-4 w-4" />
                        <span className="sr-only">New Conversation</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">New Conversation</TooltipContent>
                </Tooltip>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Search Filter Input (Expanded Only) */}
          <div className="px-2 pt-1 pb-2 group-data-[collapsible=icon]:hidden">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="h-8 w-full rounded-lg border border-sidebar-border/80 bg-sidebar-accent/30 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/50 focus:bg-background focus:ring-1 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
                  title="Clear filter"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Loading Skeletons */}
          {loadingStates.fetchingChats && conversations.length === 0 ? (
            <div className="space-y-2 px-2 py-3 group-data-[collapsible=icon]:hidden">
              {[...Array(6)].map((_, i) => (
                <SidebarMenuSkeleton key={i} showIcon />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            /* Empty State */
            <SidebarGroup className="group-data-[collapsible=icon]:hidden py-4">
              <SidebarGroupContent>
                <div className="flex flex-col items-center gap-2.5 px-3 py-10 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
                    <MessageSquareDashed className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      No conversations yet
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Start a new conversation with AI now.
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-2 h-7 rounded-lg text-xs cursor-pointer"
                  >
                    <Link href="/chat">Start Chat</Link>
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : isSearching && filteredConversations.length === 0 ? (
            /* Search Not Found State */
            <SidebarGroup className="group-data-[collapsible=icon]:hidden py-4">
              <SidebarGroupContent>
                <div className="flex flex-col items-center gap-2 px-3 py-10 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
                    <SearchX className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    No results
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    No chat found with title &quot;{searchQuery}&quot;
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="mt-1 h-7 text-xs text-primary hover:bg-primary/10 cursor-pointer"
                  >
                    Clear search
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <>
              {/* Pinned Group */}
              {pinnedConversations.length > 0 && (
                <SidebarGroup className="group-data-[collapsible=icon]:hidden py-1">
                  <SidebarGroupLabel className="mb-0.5 px-2 text-[11px] font-semibold text-muted-foreground/80 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Pin className="h-3 w-3 text-primary rotate-45" />
                      Pinned
                    </span>
                    <span className="rounded-full bg-sidebar-accent px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                      {pinnedConversations.length}
                    </span>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-0.5">
                      {pinnedConversations.map(renderConversationItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {/* Categorized Unpinned Groups */}
              {dateGroups.map((group) => (
                <SidebarGroup
                  key={group.label}
                  className="group-data-[collapsible=icon]:hidden py-1"
                >
                  <SidebarGroupLabel className="mb-0.5 px-2 text-[11px] font-semibold text-muted-foreground/80">
                    {group.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-0.5">
                      {group.items.map(renderConversationItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}

              {/* Pagination */}
              {!isSearching && (
                <div className="px-2 pt-1 pb-2 group-data-[collapsible=icon]:hidden">
                  <ChatPagination
                    currentPage={conversationsPagination.page}
                    totalPages={Math.ceil(
                      conversationsPagination.total /
                        conversationsPagination.limit
                    )}
                    onLoadMore={loadMoreConversations}
                    hasMore={conversationsPagination.hasMore}
                    totalConversations={conversationsPagination.total}
                    currentCount={conversations.length}
                  />
                </div>
              )}
            </>
          )}
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="m-2 border-t border-sidebar-border/60 px-0 pt-2 group-data-[collapsible=icon]:m-1 group-data-[collapsible=icon]:pt-1">
          {/* Expanded Footer User Menu */}
          <div className="group-data-[collapsible=icon]:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                  aria-label="Account menu"
                >
                  <Avatar className="h-8 w-8 shrink-0 ring-1 ring-sidebar-border/70">
                    <AvatarImage
                      src={getProfilePicture(userData.image)}
                      alt={userData.username || "User"}
                    />
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {userData.username ? userData.username[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-foreground truncate leading-tight">
                      {userData.first_name || userData.username || "Account"}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                      {userData.email}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                className="w-56 shadow-lg mb-1"
              >
                {renderUserMenuContent()}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Collapsed Footer User Menu */}
          <div className="hidden group-data-[collapsible=icon]:flex justify-center py-1">
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                      aria-label="Account menu"
                    >
                      <Avatar className="h-7 w-7 ring-1 ring-sidebar-border hover:ring-primary/40 transition-all">
                        <AvatarImage
                          src={getProfilePicture(userData.image)}
                          alt={userData.username || "User"}
                        />
                        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                          {userData.username
                            ? userData.username[0].toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {userData.username || "Account"}
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                align="end"
                side="right"
                className="w-52 shadow-lg ml-1"
              >
                {renderUserMenuContent()}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!chatToDelete}
        onOpenChange={(open) => !open && setChatToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Conversation?</DialogTitle>
            <DialogDescription>
              Conversation{" "}
              <strong className="text-foreground">
                &quot;{chatToDelete?.title}&quot;
              </strong>{" "}
              will be permanently deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setChatToDelete(null)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete Conversation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
