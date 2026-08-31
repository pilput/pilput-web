"use client";

import { useState } from "react";
import { AtSign, FileText, UsersRound } from "lucide-react";
import FollowListDialog, {
  type FollowListType,
} from "@/components/writer/FollowListDialog";

interface ProfileStatsProps {
  writerId: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export default function ProfileStats({
  writerId,
  followersCount,
  followingCount,
  postsCount,
}: ProfileStatsProps) {
  const [openList, setOpenList] = useState<FollowListType | null>(null);

  const stats: Array<{
    label: string;
    value: number;
    icon: typeof UsersRound;
    type: FollowListType | null;
  }> = [
    { label: "Followers", value: followersCount, icon: UsersRound, type: "followers" },
    { label: "Following", value: followingCount, icon: AtSign, type: "following" },
    { label: "Posts", value: postsCount, icon: FileText, type: null },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const clickable = stat.type !== null && stat.value > 0;

          const content = (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <Icon className="h-3.5 w-3.5 text-primary/70" aria-hidden />
              </div>
              <div className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {stat.value.toLocaleString()}
              </div>
            </>
          );

          if (clickable) {
            return (
              <button
                key={stat.label}
                type="button"
                onClick={() => setOpenList(stat.type)}
                className="rounded-lg border border-border/60 bg-muted/25 px-3 py-3 text-left transition-colors hover:bg-muted/50 sm:px-4"
              >
                {content}
              </button>
            );
          }

          return (
            <div
              key={stat.label}
              className="rounded-lg border border-border/60 bg-muted/25 px-3 py-3 sm:px-4"
            >
              {content}
            </div>
          );
        })}
      </div>

      {openList && (
        <FollowListDialog
          open={openList !== null}
          onOpenChange={(open) => setOpenList(open ? openList : null)}
          userId={writerId}
          type={openList}
        />
      )}
    </>
  );
}
