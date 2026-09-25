"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Crown, Loader2, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const ROLE_ICON = {
  owner: { icon: Crown, className: "text-amber-500" },
  admin: { icon: Shield, className: "text-primary" },
} as const;

function MemberRow({ member }: { member: GuildMember }) {
  const username = member.user?.username;
  const label = username ? `@${username}` : "Deleted user";
  const role = member.role === "member" ? null : ROLE_ICON[member.role];

  const content = (
    <>
      <Avatar className="h-10 w-10 border border-border">
        <AvatarImage src={getProfilePicture(member.user?.image || "")} alt="" />
        <AvatarFallback className="text-[10px] font-bold">
          {(username || "?").slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 min-w-0">
          <span
            className={
              username
                ? "text-sm font-medium truncate group-hover:text-primary transition-colors"
                : "text-sm font-medium truncate text-muted-foreground"
            }
          >
            {label}
          </span>
          {role && (
            <role.icon
              className={`w-3.5 h-3.5 shrink-0 ${role.className}`}
              aria-label={member.role}
            />
          )}
        </span>
        {member.created_at && (
          <span className="block text-xs text-muted-foreground">
            Joined {format(new Date(member.created_at), "d MMM yyyy")}
          </span>
        )}
      </div>
    </>
  );

  const className = "group flex items-center gap-3 min-w-0 rounded-xl px-2.5 py-2";
  return (
    <li>
      {username ? (
        <Link href={`/${username}`} className={`${className} hover:bg-muted/60 transition-colors`}>
          {content}
        </Link>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  );
}

function MemberGroup({ title, members }: { title: string; members: GuildMember[] }) {
  if (members.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <p className="px-2.5 text-[11px] font-medium text-muted-foreground">
        {title} — {members.length}
      </p>
      <ul className="grid gap-1 sm:grid-cols-2">
        {members.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </ul>
    </div>
  );
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
      <ul className="grid gap-1 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-2.5 py-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (members.length === 0) {
    return <p className="text-sm text-muted-foreground">No members to show yet.</p>;
  }

  const staff = members
    .filter((m) => m.role !== "member")
    .sort((a, b) => (a.role === b.role ? 0 : a.role === "owner" ? -1 : 1));
  const regular = members.filter((m) => m.role === "member");

  return (
    <div className="space-y-5">
      <MemberGroup title="Owner & admins" members={staff} />
      <MemberGroup title="Members" members={regular} />

      {hasMore && (
        <Button
          type="button"
          variant="ghost"
          className="w-full cursor-pointer text-muted-foreground"
          disabled={loadingMore}
          onClick={onLoadMore}
        >
          {loadingMore && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Show more members
        </Button>
      )}
    </div>
  );
}
