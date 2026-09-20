import Link from "next/link";
import { Globe, Loader2, Lock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Guild } from "@/types/guild";
import { GuildAvatar } from "./GuildAvatar";

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
    <Card className="group h-full border-border/70 bg-card/90 hover:border-primary/25 transition-all duration-300">
      <CardContent className="p-5 flex flex-col gap-4 h-full">
        <div className="flex items-start gap-3 min-w-0">
          <GuildAvatar
            name={guild.name}
            avatarUrl={guild.avatar_url}
            className="w-12 h-12 text-sm"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <Link
              href={`/guilds/${guild.slug}`}
              className="block font-bold text-base leading-snug hover:text-primary transition-colors line-clamp-1"
            >
              {guild.name}
            </Link>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {guild.member_count.toLocaleString()}{" "}
                {guild.member_count === 1 ? "member" : "members"}
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
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {guild.description || "No description yet."}
        </p>

        <div className="flex items-center justify-between gap-2 pt-1">
          {isMember ? (
            <Badge variant="secondary" className="capitalize">
              {guild.my_role ?? "Joined"}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground truncate">
              {guild.owner?.username ? `by @${guild.owner.username}` : ""}
            </span>
          )}

          {showJoin && !isMember && guild.is_public ? (
            <Button
              size="sm"
              variant="secondary"
              className="cursor-pointer"
              disabled={joining}
              onClick={() => onJoin(guild)}
            >
              {joining && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Join
            </Button>
          ) : (
            <Button size="sm" variant="ghost" asChild className="cursor-pointer">
              <Link href={`/guilds/${guild.slug}`}>View</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
