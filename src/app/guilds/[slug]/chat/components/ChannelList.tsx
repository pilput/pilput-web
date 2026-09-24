"use client";

import Link from "next/link";
import { ArrowLeft, Hash, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Guild, GuildChannel } from "@/types/guild";
import { GuildAvatar } from "../../../components/GuildAvatar";

interface ChannelListProps {
  guild: Guild;
  channels: GuildChannel[];
  loading: boolean;
  activeChannelId: string | null;
  unread: Set<string>;
  canManage: boolean;
  onSelect: (channelId: string) => void;
  onCreate: () => void;
  onEdit: (channel: GuildChannel) => void;
  onDelete: (channel: GuildChannel) => void;
}

export function ChannelList({
  guild,
  channels,
  loading,
  activeChannelId,
  unread,
  canManage,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: ChannelListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border/60 p-3 space-y-3">
        <Link
          href={`/guilds/${guild.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Guild page
        </Link>
        <div className="flex items-center gap-2.5 min-w-0">
          <GuildAvatar
            name={guild.name}
            avatarUrl={guild.avatar_url}
            className="w-9 h-9 text-xs shrink-0"
          />
          <p className="font-bold truncate">{guild.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pt-4 pb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Text channels
        </span>
        {canManage && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="cursor-pointer"
            aria-label="Create channel"
            onClick={onCreate}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto px-2 pb-3" aria-label="Channels">
        {loading ? (
          <div className="space-y-2 px-1 pt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full" />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <p className="px-2 py-2 text-sm text-muted-foreground">No channels yet.</p>
        ) : (
          <ul className="space-y-0.5">
            {channels.map((channel) => {
              const active = channel.id === activeChannelId;
              const hasUnread = !active && unread.has(channel.id);
              return (
                <li key={channel.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelect(channel.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-left cursor-pointer transition-colors",
                      active
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                      hasUnread && "text-foreground font-semibold",
                      canManage && "pr-8",
                    )}
                  >
                    <Hash className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="truncate">{channel.name}</span>
                    {hasUnread && (
                      <span
                        className="ml-auto h-2 w-2 shrink-0 rounded-full bg-primary"
                        aria-label="Unread messages"
                      />
                    )}
                  </button>
                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Manage #${channel.name}`}
                          className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onSelect={() => onEdit(channel)}>
                          <Pencil className="w-4 h-4" />
                          Edit channel
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer"
                          onSelect={() => onDelete(channel)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete channel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </div>
  );
}
