"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, isHttpError } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { getProfilePicture } from "@/utils/getImage";
import { Loader2, UsersRound } from "lucide-react";

export type FollowListType = "followers" | "following";

interface FollowListUser {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
}

interface FollowListResponse {
  success: boolean;
  message?: string;
  data: FollowListUser[];
  meta?: {
    total_items: number;
    offset: number;
    limit: number;
    total_pages: number;
  };
}

interface FollowListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  type: FollowListType;
}

const LIMIT = 15;

function displayName(user: FollowListUser): string {
  const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  return name || user.username || "Unknown";
}

function initialsFor(user: FollowListUser): string {
  const fromName = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`;
  if (fromName) return fromName.toUpperCase();
  return user.username?.[0]?.toUpperCase() ?? "?";
}

export default function FollowListDialog({
  open,
  onOpenChange,
  userId,
  type,
}: FollowListDialogProps) {
  const [users, setUsers] = useState<FollowListUser[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const loadedForKey = useRef<string | null>(null);

  const title = type === "followers" ? "Followers" : "Following";
  const key = `${userId}:${type}`;

  useEffect(() => {
    if (!open) {
      return;
    }
    if (loadedForKey.current === key) {
      return;
    }
    loadedForKey.current = key;
    setUsers([]);
    setOffset(0);
    setTotal(0);
    setError(false);
    void fetchPage(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, key]);

  async function fetchPage(fetchOffset: number, append: boolean) {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
      const token = getToken();
      const { data } = await apiClient.get<FollowListResponse>(
        `/api/users/${userId}/${type}`,
        {
          params: { limit: LIMIT, offset: fetchOffset },
          ...(token && {
            headers: { Authorization: `Bearer ${token}` },
          }),
        },
      );
      if (data?.success && Array.isArray(data.data)) {
        setUsers((prev) => (append ? [...prev, ...data.data] : data.data));
        setOffset(fetchOffset);
        if (data.meta) {
          setTotal(data.meta.total_items);
        }
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      if (!isHttpError(err) || err.response.status !== 401) {
        setError(true);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  const hasMore = users.length < total;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[min(60vh,420px)] pr-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Couldn&apos;t load {title.toLowerCase()}. Please try again.
            </p>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
              <UsersRound className="h-6 w-6" aria-hidden />
              <p className="text-sm">
                {type === "followers"
                  ? "No followers yet."
                  : "Not following anyone yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={user.username ? `/${user.username}` : "#"}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-md px-1.5 py-2 transition-colors hover:bg-muted/60"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={
                        user.image ? getProfilePicture(user.image) : undefined
                      }
                      alt={displayName(user)}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {initialsFor(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {displayName(user)}
                    </p>
                    {user.username && (
                      <p className="truncate text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </Link>
              ))}

              {hasMore && (
                <div className="pt-2 pb-1 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoadingMore}
                    onClick={() => void fetchPage(offset + LIMIT, true)}
                  >
                    {isLoadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Load more"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
