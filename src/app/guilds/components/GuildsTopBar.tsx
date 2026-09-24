"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronRight, Hash, Moon, Sun } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "cn";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import type { GuildStreamStatus } from "@/utils/guild-chat";
import { GuildAvatar } from "./GuildAvatar";
import { SidebarToggle } from "./GuildsShell";

const STATUS: Record<GuildStreamStatus, { label: string; dot: string; pill: string }> = {
  open: {
    label: "Live",
    dot: "bg-emerald-500",
    pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  connecting: {
    label: "Connecting",
    dot: "bg-amber-500 animate-pulse",
    pill: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  reconnecting: {
    label: "Reconnecting",
    dot: "bg-amber-500 animate-pulse",
    pill: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  closed: {
    label: "Offline",
    dot: "bg-destructive",
    pill: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

export function GuildsTopBar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [, , routeSlug, section, channelId] = pathname.split("/");

  const { slug, guild, channels, streamStatus } = useGuildChatStore(
    useShallow((s) => ({
      slug: s.slug,
      guild: s.guild,
      channels: s.channels,
      streamStatus: s.streamStatus,
    })),
  );

  const inGuild = Boolean(routeSlug) && slug === routeSlug && guild !== null;
  const channel = section === "chat" && channelId ? channels.find((c) => c.id === channelId) : undefined;
  const status = STATUS[streamStatus];

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-3 backdrop-blur sm:px-4">
      <SidebarToggle className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4! opacity-60" />

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex min-w-0 items-center gap-1 text-sm">
          <li className={cn("shrink-0", inGuild && "hidden sm:block")}>
            {inGuild ? (
              <Link href="/guilds" className="text-muted-foreground hover:text-foreground transition-colors">
                Guilds
              </Link>
            ) : (
              <span className="font-semibold">Explore guilds</span>
            )}
          </li>
          {inGuild && guild && (
            <>
              <ChevronRight aria-hidden className="hidden sm:block size-3.5 shrink-0 text-muted-foreground/60" />
              <li className="min-w-0 shrink">
                <Link
                  href={`/guilds/${guild.slug}`}
                  className={cn(
                    "flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-muted",
                    channel ? "text-muted-foreground hover:text-foreground" : "font-semibold",
                  )}
                  aria-current={channel ? undefined : "page"}
                >
                  <GuildAvatar name={guild.name} avatarUrl={guild.avatar_url} className="size-5 rounded-md text-[8px]" />
                  <span className="truncate">{guild.name}</span>
                </Link>
              </li>
            </>
          )}
          {inGuild && channel && (
            <>
              <ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground/60" />
              <li className="flex min-w-0 items-center gap-1 font-semibold" aria-current="page">
                <Hash className="size-4 shrink-0 text-primary" />
                <span className="truncate">{channel.name}</span>
                {channel.topic && (
                  <span
                    className="ml-2 hidden truncate border-l border-border pl-3 text-xs font-normal text-muted-foreground lg:inline"
                    title={channel.topic}
                  >
                    {channel.topic}
                  </span>
                )}
              </li>
            </>
          )}
        </ol>
      </nav>

      <div className="flex shrink-0 items-center gap-1.5">
        {inGuild && guild?.is_member && (
          <span
            role="status"
            title={`Realtime: ${status.label}`}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
              status.pill,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            <span className="hidden sm:inline">{status.label}</span>
          </span>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="relative cursor-pointer text-muted-foreground"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}
