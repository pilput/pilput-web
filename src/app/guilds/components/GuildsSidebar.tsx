"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronsUpDown,
  Compass,
  Hash,
  LayoutDashboard,
  LogIn,
  LogOut,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { cn } from "@/lib/utils";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import { authStore } from "@/stores/userStore";
import { logoutUser } from "@/utils/fetch";
import { getProfilePicture } from "@/utils/getImage";
import type { Guild } from "@/types/guild";
import { GuildAvatar } from "./GuildAvatar";

/** `/guilds/<slug>/chat/<channelId>` → its parts; missing parts are undefined. */
function parseGuildPath(pathname: string) {
  const [, , slug, section, channelId] = pathname.split("/");
  return {
    slug: slug ? decodeURIComponent(slug) : undefined,
    channelId: section === "chat" ? channelId : undefined,
  };
}

const navButtonClass = cn(
  "relative font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
  "data-[active=true]:bg-primary/10 data-[active=true]:text-primary dark:data-[active=true]:bg-primary/20 data-[active=true]:font-semibold",
);

export function GuildsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, ready } = useIsLoggedIn();
  const user = authStore((s) => s.data);
  const { setOpenMobile, isMobile } = useSidebar();
  const route = parseGuildPath(pathname);

  const { myGuilds, myGuildsLoading, openSlug, openGuild } = useGuildChatStore(
    useShallow((s) => ({
      myGuilds: s.myGuilds,
      myGuildsLoading: s.myGuildsLoading,
      openSlug: s.slug,
      openGuild: s.guild,
    })),
  );

  // The mobile sheet stays open across client navigations unless closed.
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  // A public guild the viewer has not joined still gets an entry while open.
  const viewing =
    route.slug && openSlug === route.slug && openGuild && !myGuilds.some((g) => g.slug === route.slug)
      ? openGuild
      : null;

  async function handleLogout() {
    await logoutUser();
    router.push("/");
    router.refresh();
  }

  const displayName =
    user.first_name || user.last_name
      ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
      : user.username || "Account";

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="pilput Guilds" className="group/brand">
              <Link href="/guilds">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70 text-primary-foreground shadow-xs transition-transform group-hover/brand:scale-105">
                  <span className="text-sm font-black">G</span>
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="text-sm font-bold tracking-tight">
                    pilput<span className="text-primary font-black">.</span> guilds
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    Communities & conversations
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 overflow-x-hidden pt-2">
        <SidebarGroup className="py-1.5">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/guilds"}
                  tooltip="Explore"
                  className={navButtonClass}
                >
                  <Link href="/guilds">
                    <Compass />
                    <span>Explore guilds</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {viewing && (
          <SidebarGroup className="py-1.5">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Viewing
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <GuildNavItem guild={viewing} pathname={pathname} expanded={false} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {ready && isLoggedIn && (
          <SidebarGroup className="py-1.5">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Your guilds
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {myGuildsLoading && myGuilds.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  ))
                ) : myGuilds.length === 0 ? (
                  <p className="px-2 py-1.5 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    You have not joined a guild yet.
                  </p>
                ) : (
                  myGuilds.map((guild) => (
                    <GuildNavItem
                      key={guild.id}
                      guild={guild}
                      pathname={pathname}
                      expanded={guild.slug === route.slug && openSlug === route.slug}
                      activeChannelId={route.channelId}
                    />
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to pilput" className="text-muted-foreground hover:text-foreground">
              <Link href="/">
                <ArrowLeft />
                <span>Back to pilput</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {ready && !isLoggedIn && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sign in" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
                <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                  <LogIn />
                  <span>Sign in</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {ready && isLoggedIn && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    tooltip={displayName}
                    className="data-[state=open]:bg-sidebar-accent"
                  >
                    <Avatar className="h-8 w-8 rounded-lg border border-border/60">
                      <AvatarImage src={getProfilePicture(user.image)} alt="" />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                        {(user.username?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-xs leading-tight">
                      <span className="truncate font-semibold">{displayName}</span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {user.username ? `@${user.username}` : ""}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Signed in as {user.username ? `@${user.username}` : displayName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${user.username}`} className="cursor-pointer">
                      <UserIcon />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <Settings />
                      Account settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={handleLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function GuildNavItem({
  guild,
  pathname,
  expanded,
  activeChannelId,
}: {
  guild: Guild;
  pathname: string;
  /** The guild is open: list its channels underneath. */
  expanded: boolean;
  activeChannelId?: string;
}) {
  const overviewHref = `/guilds/${guild.slug}`;
  const { channels, channelsLoading, unread, openGuild, openChannelDialog, requestDeleteChannel } =
    useGuildChatStore(
      useShallow((s) => ({
        channels: s.channels,
        channelsLoading: s.channelsLoading,
        unread: s.unread,
        openGuild: s.guild,
        openChannelDialog: s.openChannelDialog,
        requestDeleteChannel: s.requestDeleteChannel,
      })),
    );

  const isMember = expanded && openGuild?.is_member === true;
  const canManage = expanded && (openGuild?.my_role === "owner" || openGuild?.my_role === "admin");
  const unreadCount = expanded ? channels.filter((c) => unread[c.id]).length : 0;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={pathname === overviewHref}
        tooltip={guild.name}
        className={navButtonClass}
      >
        <Link href={overviewHref}>
          <GuildAvatar
            name={guild.name}
            avatarUrl={guild.avatar_url}
            className="size-5 rounded-md text-[8px] group-data-[collapsible=icon]:-m-0.5"
          />
          <span>{guild.name}</span>
        </Link>
      </SidebarMenuButton>
      {unreadCount > 0 && (
        <SidebarMenuBadge className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
          {unreadCount}
        </SidebarMenuBadge>
      )}

      {expanded && (
        <SidebarMenuSub className="mr-0 pr-0">
          {!isMember ? (
            <p className="px-2 py-1 text-xs text-muted-foreground">Join to see channels.</p>
          ) : channelsLoading && channels.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuSubItem key={i}>
                <SidebarMenuSkeleton className="h-7" />
              </SidebarMenuSubItem>
            ))
          ) : (
            <>
              {channels.map((channel) => {
                const active = channel.id === activeChannelId;
                const hasUnread = !active && unread[channel.id];
                return (
                  <SidebarMenuSubItem key={channel.id} className="group/channel">
                    <SidebarMenuSubButton
                      asChild
                      isActive={active}
                      className={cn(
                        "text-muted-foreground data-[active=true]:text-primary data-[active=true]:font-medium",
                        "[&>svg]:text-current",
                        hasUnread && "font-semibold text-sidebar-foreground",
                        canManage && "pr-7",
                      )}
                    >
                      <Link href={`${overviewHref}/chat/${channel.id}`} title={channel.topic ?? undefined}>
                        <Hash />
                        <span>{channel.name}</span>
                      </Link>
                    </SidebarMenuSubButton>
                    {hasUnread && (
                      <span
                        aria-label="Unread messages"
                        className={cn(
                          "pointer-events-none absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary",
                          canManage ? "right-8 group-hover/channel:hidden" : "right-2",
                        )}
                      />
                    )}
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            aria-label={`Manage #${channel.name}`}
                            className="absolute right-1 top-1/2 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-muted-foreground opacity-0 hover:bg-sidebar-accent hover:text-foreground focus-visible:opacity-100 group-hover/channel:opacity-100 data-[state=open]:opacity-100"
                          >
                            <MoreHorizontal className="size-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="w-44">
                          <DropdownMenuItem className="cursor-pointer" onSelect={() => openChannelDialog(channel)}>
                            <Pencil />
                            Edit channel
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer"
                            onSelect={() => requestDeleteChannel(channel)}
                          >
                            <Trash2 />
                            Delete channel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </SidebarMenuSubItem>
                );
              })}
              {canManage && (
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild className="cursor-pointer text-muted-foreground hover:text-foreground">
                    <button type="button" onClick={() => openChannelDialog(null)}>
                      <Plus />
                      <span>Add channel</span>
                    </button>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )}
            </>
          )}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
