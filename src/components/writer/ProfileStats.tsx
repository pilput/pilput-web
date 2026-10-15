"use client";

import { useState } from "react";
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
    type: FollowListType | null;
  }> = [
    { label: "Followers", value: followersCount, type: "followers" },
    { label: "Following", value: followingCount, type: "following" },
    { label: "Posts", value: postsCount, type: null },
  ];

  return (
    <>
      <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
        {stats.map((stat) => {
          const clickable = stat.type !== null && stat.value > 0;

          const content = (
            <>
              <dd className="text-base font-semibold tabular-nums text-foreground">
                {stat.value.toLocaleString()}
              </dd>
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            </>
          );

          return clickable ? (
            <button
              key={stat.label}
              type="button"
              onClick={() => setOpenList(stat.type)}
              className="flex cursor-pointer items-baseline gap-1.5 underline-offset-4 hover:underline"
            >
              {content}
            </button>
          ) : (
            <div key={stat.label} className="flex items-baseline gap-1.5">
              {content}
            </div>
          );
        })}
      </dl>

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
