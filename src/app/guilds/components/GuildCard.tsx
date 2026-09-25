import Link from "next/link";
import { Check, Globe, Loader2, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Guild } from "@/types/guild";
import { GuildAvatar } from "./GuildAvatar";
import { GuildBanner } from "./GuildBanner";

interface GuildCardProps {
  guild: Guild;
  /**
   * The list endpoints never fill in `is_member` (they are public), so the
   * caller resolves membership from the viewer's own guilds instead.
   */
  isMember: boolean;
  /** Hidden when the viewer is signed out — joining requires an account. */
  showJoin: boolean;
  joining: boolean;
  onJoin: (guild: Guild) => void;
}

export function GuildCard({
  guild,
  isMember,
  showJoin,
  joining,
  onJoin,
}: GuildCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <GuildBanner guildId={guild.id} className="h-20 sm:h-20" />

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="-mt-7 flex items-end justify-between gap-2">
          <GuildAvatar
            name={guild.name}
            avatarUrl={guild.avatar_url}
            className="relative w-14 h-14 text-base rounded-xl border-4 border-card"
          />
          {isMember && (
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium capitalize text-primary">
              <Check className="w-3 h-3" />
              {guild.my_role ?? "Joined"}
            </span>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          {/* Stretched link: the whole card opens the guild. */}
          <Link
            href={`/guilds/${guild.slug}`}
            className="block font-bold text-base leading-snug line-clamp-1 transition-colors group-hover:text-primary after:absolute after:inset-0 after:content-['']"
          >
            {guild.name}
          </Link>
          <p className="text-xs text-muted-foreground truncate">
            {guild.owner?.username ? `by @${guild.owner.username}` : `/${guild.slug}`}
          </p>
        </div>

        <p className="flex-1 text-sm text-muted-foreground line-clamp-2">
          {guild.description || "No description yet."}
        </p>

        <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span className="tabular-nums">{guild.member_count.toLocaleString()}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              {guild.is_public ? (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Private
                </>
              )}
            </span>
          </div>

          {showJoin && !isMember && guild.is_public && (
            <Button
              size="sm"
              className="relative z-10 h-7 cursor-pointer rounded-full px-3"
              disabled={joining}
              onClick={() => onJoin(guild)}
            >
              {joining && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
              Join
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
