"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Compass,
  Hash,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  User as UserIcon,
  X,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { cn } from "cn";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import { authStore } from "@/stores/userStore";
import { logoutUser } from "@/utils/fetch";
import { getProfilePicture } from "@/utils/getImage";
import type { Guild, GuildChannel } from "@/types/guild";
import { GuildAvatar } from "./GuildAvatar";
import { useGuildsShell } from "./GuildsShell";

const PANEL_WIDTH = "w-60";

/** `/guilds/<slug>/chat/<channelId>` → its parts; missing parts are undefined. */
function parseGuildPath(pathname: string) {
  const [, , slug, section, channelId] = pathname.split("/");
  return {
    slug: slug ? decodeURIComponent(slug) : undefined,
    channelId: section === "chat" ? channelId : undefined,
  };
}

/**
 * The guild workspace navigation in two layers: a narrow rail of guild icons,
 * and beside it a panel for whatever the rail selected — the open guild's
 * channels, or the home list when no guild is open. On desktop only the panel
 * collapses (the rail stays); on mobile both slide in as one drawer.
 */
export function GuildsSidebar() {
  const pathname = usePathname();
  const { desktopOpen, mobileOpen, setMobileOpen } = useGuildsShell();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close the drawer after navigating from it.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    drawerRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, setMobileOpen]);

  return (
    <>
      <aside aria-label="Guild navigation" className="hidden md:flex shrink-0">
        <GuildRail />
        <div
          inert={!desktopOpen}
          className={cn(
            "overflow-hidden transition-[width,opacity] duration-300 ease-out",
            desktopOpen ? `${PANEL_WIDTH} opacity-100` : "w-0 opacity-0",
          )}
        >
          <div className={cn("h-full", PANEL_WIDTH)}>
            <SidebarPanel />
          </div>
        </div>
      </aside>

      <div className={cn("fixed inset-0 z-50 md:hidden", !mobileOpen && "pointer-events-none")} inert={!mobileOpen}>
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Guild navigation"
          tabIndex={-1}
          className={cn(
            "absolute inset-y-0 left-0 flex max-w-[90vw] border-r border-sidebar-border bg-sidebar outline-none transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <GuildRail />
          <div className={cn("min-w-0", PANEL_WIDTH)}>
            <SidebarPanel onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}

/** The guild currently in the URL, as far as the store knows it yet. */
function useRouteGuild() {
  const pathname = usePathname();
  const route = parseGuildPath(pathname);
  const { myGuilds, openSlug, openGuild } = useGuildChatStore(
    useShallow((s) => ({ myGuilds: s.myGuilds, openSlug: s.slug, openGuild: s.guild })),
  );
  const guild = !route.slug
    ? null
    : openSlug === route.slug && openGuild
      ? openGuild
      : (myGuilds.find((g) => g.slug === route.slug) ?? null);
  return { pathname, route, guild };
}

/** Layer one: home, then one icon per guild. */
function GuildRail() {
  const { isLoggedIn, ready } = useIsLoggedIn();
  const { pathname, route, guild: routeGuild } = useRouteGuild();
  const { myGuilds, myGuildsLoading } = useGuildChatStore(
    useShallow((s) => ({ myGuilds: s.myGuilds, myGuildsLoading: s.myGuildsLoading })),
  );

  // A guild the viewer has not joined still gets an icon while it is open.
  const viewing = routeGuild && !myGuilds.some((g) => g.slug === routeGuild.slug) ? routeGuild : null;

  return (
    <TooltipProvider delayDuration={200}>
      <nav
        aria-label="Guilds"
        className="flex h-full w-16 shrink-0 flex-col items-center gap-2 overflow-y-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <RailItem href="/guilds" label="Explore guilds" active={!route.slug && pathname === "/guilds"}>
          <span className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background transition-[border-radius] group-hover/rail:rounded-lg">
            <Compass className="size-5" />
          </span>
        </RailItem>

        <div aria-hidden className="h-px w-8 shrink-0 bg-sidebar-border" />

        {viewing && <GuildRailItem guild={viewing} active />}

        {ready &&
          isLoggedIn &&
          (myGuildsLoading && myGuilds.length === 0
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="size-10 shrink-0 rounded-xl" />)
            : myGuilds.map((guild) => (
                <GuildRailItem key={guild.id} guild={guild} active={guild.slug === route.slug} />
              )))}
      </nav>
    </TooltipProvider>
  );
}

function GuildRailItem({ guild, active }: { guild: Guild; active: boolean }) {
  return (
    <RailItem href={`/guilds/${guild.slug}`} label={guild.name} active={active}>
      <GuildAvatar
        name={guild.name}
        avatarUrl={guild.avatar_url}
        className={cn(
          "size-10 text-xs transition-[border-radius] group-hover/rail:rounded-lg",
          active && "rounded-lg border-foreground/20",
        )}
      />
    </RailItem>
  );
}

function RailItem({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group/rail relative flex w-full shrink-0 justify-center">
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-r-full bg-foreground transition-all duration-200",
          active ? "h-8" : "h-0 group-hover/rail:h-4",
        )}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            {children}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </div>
  );
}

/** Layer two: the open guild's channels, or the home list. */
function SidebarPanel({ onClose }: { onClose?: () => void }) {
  const { pathname, route, guild } = useRouteGuild();

  return (
    <div className="flex h-full flex-col border-l border-sidebar-border text-sm text-sidebar-foreground">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        {guild ? (
          <Link
            href={`/guilds/${guild.slug}`}
            className="min-w-0 flex-1 truncate font-semibold tracking-tight hover:underline underline-offset-2"
          >
            {guild.name}
          </Link>
        ) : (
          <Link href="/guilds" className="flex min-w-0 flex-1 items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-5 items-center justify-center rounded bg-foreground text-[11px] font-black text-background">
              g
            </span>
            guilds
          </Link>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
        {guild ? (
          <GuildChannels guild={guild} pathname={pathname} activeChannelId={route.channelId} />
        ) : (
          <HomeList pathname={pathname} />
        )}
      </nav>

      <UserRow />
    </div>
  );
}

/** With no guild open: Explore, plus the joined guilds by name. */
function HomeList({ pathname }: { pathname: string }) {
  const { isLoggedIn, ready } = useIsLoggedIn();
  const [query, setQuery] = useState("");
  const { myGuilds, myGuildsLoading } = useGuildChatStore(
    useShallow((s) => ({ myGuilds: s.myGuilds, myGuildsLoading: s.myGuildsLoading })),
  );

  const q = query.trim().toLowerCase();
  const shownGuilds = q ? myGuilds.filter((g) => g.name.toLowerCase().includes(q)) : myGuilds;

  return (
    <>
      <Row href="/guilds" active={pathname === "/guilds"} icon={<Compass />}>
        Explore
      </Row>

      {ready && isLoggedIn && (
        <Group label="Your guilds">
          {myGuilds.length > 6 && (
            <div className="mb-1 flex h-7 items-center gap-2 rounded-md px-2 text-muted-foreground focus-within:bg-sidebar-accent">
              <Search className="size-3.5 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter"
                aria-label="Filter guilds"
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}
          {myGuildsLoading && myGuilds.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex h-7 items-center gap-2 px-2">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))
          ) : myGuilds.length === 0 ? (
            <p className="px-2 py-1 text-xs text-muted-foreground">No guilds yet. Explore to find one.</p>
          ) : shownGuilds.length === 0 ? (
            <p className="px-2 py-1 text-xs text-muted-foreground">No match.</p>
          ) : (
            shownGuilds.map((guild) => (
              <Link key={guild.id} href={`/guilds/${guild.slug}`} className={rowClass(false)}>
                <GuildAvatar
                  name={guild.name}
                  avatarUrl={guild.avatar_url}
                  className="size-4 rounded border-0 text-[7px]"
                  iconClassName="size-2.5"
                />
                <span className="min-w-0 flex-1 truncate">{guild.name}</span>
              </Link>
            ))
          )}
        </Group>
      )}
    </>
  );
}

function Group({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <div className="mb-0.5 flex h-6 items-center pl-2 pr-1">
        <p className="min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground">{label}</p>
        {action}
      </div>
      <div className="space-y-px">{children}</div>
    </div>
  );
}

const rowClass = (active: boolean) =>
  cn(
    "flex h-7 items-center gap-2 rounded-md px-2 transition-colors [&>svg]:size-4 [&>svg]:shrink-0",
    active
      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
  );

function Row({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(rowClass(active), "[&>svg]:text-muted-foreground")}
    >
      {icon}
      <span className="truncate">{children}</span>
    </Link>
  );
}

/** The open guild: its overview, then its channels. */
function GuildChannels({
  guild,
  pathname,
  activeChannelId,
}: {
  guild: Guild;
  pathname: string;
  activeChannelId?: string;
}) {
  const overviewHref = `/guilds/${guild.slug}`;
  const { openSlug, channels, channelsLoading, unread, liveGuild, openChannelDialog, requestDeleteChannel } =
    useGuildChatStore(
      useShallow((s) => ({
        openSlug: s.slug,
        channels: s.channels,
        channelsLoading: s.channelsLoading,
        unread: s.unread,
        liveGuild: s.guild,
        openChannelDialog: s.openChannelDialog,
        requestDeleteChannel: s.requestDeleteChannel,
      })),
    );

  // Channels in the store belong to the guild the store has open.
  const loaded = openSlug === guild.slug && liveGuild != null;
  const isMember = loaded && liveGuild.is_member === true;
  const canManage = loaded && (liveGuild.my_role === "owner" || liveGuild.my_role === "admin");

  return (
    <>
      <Row href={overviewHref} active={pathname === overviewHref} icon={<Home />}>
        Overview
      </Row>

      <Group
        label="Channels"
        action={
          canManage && (
            <button
              type="button"
              onClick={() => openChannelDialog(null)}
              aria-label="Add channel"
              title="Add channel"
              className="flex size-5 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-sidebar-border hover:text-foreground"
            >
              <Plus className="size-3.5" />
            </button>
          )
        }
      >
        {!loaded || (channelsLoading && channels.length === 0) ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex h-7 items-center px-2">
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))
        ) : !isMember ? (
          <p className="px-2 py-1 text-xs text-muted-foreground">Join to see channels</p>
        ) : channels.length === 0 ? (
          <p className="px-2 py-1 text-xs text-muted-foreground">No channels yet.</p>
        ) : (
          channels.map((channel) => (
            <ChannelRow
              key={channel.id}
              href={`${overviewHref}/chat/${channel.id}`}
              channel={channel}
              active={channel.id === activeChannelId}
              unread={channel.id !== activeChannelId && Boolean(unread[channel.id])}
              canManage={canManage}
              onEdit={() => openChannelDialog(channel)}
              onDelete={() => requestDeleteChannel(channel)}
            />
          ))
        )}
      </Group>
    </>
  );
}

function ChannelRow({
  href,
  channel,
  active,
  unread,
  canManage,
  onEdit,
  onDelete,
}: {
  href: string;
  channel: GuildChannel;
  active: boolean;
  unread: boolean;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group/channel relative">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        title={channel.topic ?? undefined}
        className={cn(
          rowClass(active),
          "[&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          unread && "font-medium text-sidebar-foreground",
          canManage && "pr-7",
        )}
      >
        <Hash />
        <span className="min-w-0 flex-1 truncate">{channel.name}</span>
        {unread && (
          <span
            aria-label="Unread messages"
            className={cn("size-1.5 shrink-0 rounded-full bg-foreground", canManage && "group-hover/channel:hidden")}
          />
        )}
      </Link>
      {canManage && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Manage #${channel.name}`}
              className="absolute right-1 top-1/2 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-muted-foreground opacity-0 hover:bg-sidebar-border hover:text-foreground focus-visible:opacity-100 group-hover/channel:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-40">
            <DropdownMenuItem className="cursor-pointer" onSelect={onEdit}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" className="cursor-pointer" onSelect={onDelete}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

function UserRow() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, ready } = useIsLoggedIn();
  const user = authStore((s) => s.data);

  if (!ready) return <div className="h-13 shrink-0" />;

  if (!isLoggedIn) {
    return (
      <div className="shrink-0 space-y-px border-t border-sidebar-border p-2">
        <Row href={`/login?redirect=${encodeURIComponent(pathname)}`} active={false} icon={<LogIn />}>
          Sign in
        </Row>
        <Row href="/" active={false} icon={<ArrowLeft />}>
          Back to pilput
        </Row>
      </div>
    );
  }

  const displayName =
    user.first_name || user.last_name
      ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
      : user.username || "Account";

  async function handleLogout() {
    await logoutUser();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="shrink-0 border-t border-sidebar-border p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left transition-colors hover:bg-sidebar-accent/60 data-[state=open]:bg-sidebar-accent"
          >
            <Avatar className="size-6 rounded-md">
              <AvatarImage className="rounded-md" src={getProfilePicture(user.image)} alt="" />
              <AvatarFallback className="rounded-md text-[10px] font-semibold">
                {(user.username?.[0] || "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate font-medium">{displayName}</span>
            <Settings className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={6}
          className="w-(--radix-dropdown-menu-trigger-width) min-w-52"
        >
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {user.username ? `@${user.username}` : displayName}
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
          <DropdownMenuItem asChild>
            <Link href="/" className="cursor-pointer">
              <ArrowLeft />
              Back to pilput
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={handleLogout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
