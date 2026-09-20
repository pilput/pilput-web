"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfilePicture } from "@/utils/getImage";
import type { GuildMember } from "@/types/guild";

interface MemberListProps {
  members: GuildMember[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function MemberList({
  members,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
}: MemberListProps) {
  if (loading) {
    return (
      <ul className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No members to show yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {members.map((member) => {
          const username = member.user?.username;
          const label = username ? `@${username}` : "Deleted user";
          return (
            <li key={member.id} className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage
                  src={getProfilePicture(member.user?.image || "")}
                  alt=""
                />
                <AvatarFallback className="text-[10px] font-bold">
                  {(username || "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                {username ? (
                  <Link
                    href={`/${username}`}
                    className="block text-sm font-medium truncate hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                ) : (
                  <span className="block text-sm font-medium truncate text-muted-foreground">
                    {label}
                  </span>
                )}
                {member.created_at && (
                  <span className="text-xs text-muted-foreground">
                    Joined {format(new Date(member.created_at), "d MMM yyyy")}
                  </span>
                )}
              </div>
              <Badge
                variant={member.role === "member" ? "secondary" : "default"}
                className="capitalize shrink-0"
              >
                {member.role}
              </Badge>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <Button
          type="button"
          variant="secondary"
          className="w-full cursor-pointer"
          disabled={loadingMore}
          onClick={onLoadMore}
        >
          {loadingMore && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Load more members
        </Button>
      )}
    </div>
  );
}
