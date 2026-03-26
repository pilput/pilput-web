"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { followUser, unfollowUser } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { authStore } from "@/stores/userStore";
import { ErrorHandlerAPI } from "@/utils/ErrorHandler";
import { toast } from "sonner";
import { Edit2, Loader2, MoreHorizontal, UserPlus, Users } from "lucide-react";

interface ProfileFollowActionsProps {
  writerId: string;
  profileUsername: string;
  initialIsFollowing: boolean;
  redirectPath: string;
}

export default function ProfileFollowActions({
  writerId,
  profileUsername,
  initialIsFollowing,
  redirectPath,
}: ProfileFollowActionsProps) {
  const router = useRouter();
  const fetchAuth = authStore((s) => s.fetch);
  const me = authStore((s) => s.data);

  const [authChecked, setAuthChecked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  useEffect(() => {
    const run = async () => {
      if (!getToken()) {
        setAuthChecked(true);
        return;
      }
      await fetchAuth();
      setAuthChecked(true);
    };
    void run();
  }, [fetchAuth]);

  const isOwnProfile =
    authChecked &&
    me.username !== "loading..." &&
    me.username === profileUsername;

  const onToggleFollow = async () => {
    if (!getToken()) {
      toast.error("Please sign in to follow.");
      return;
    }
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(writerId);
        toast.success("Unfollowed");
        setIsFollowing(false);
      } else {
        await followUser(writerId);
        toast.success("Now following");
        setIsFollowing(true);
      }
      router.refresh();
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setLoading(false);
    }
  };

  const loginHref = `/login?redirect=${encodeURIComponent(redirectPath)}`;

  return (
    <div className="flex items-center gap-2">
      {authChecked && isOwnProfile ? (
        <Button variant="outline" size="sm" asChild>
          <Link href="/account">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      ) : authChecked && !isOwnProfile ? (
        getToken() ? (
          <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            disabled={loading}
            onClick={() => void onToggleFollow()}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isFollowing ? (
              <Users className="w-4 h-4 mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            {isFollowing ? "Following" : "Follow"}
          </Button>
        ) : (
          <Button variant="default" size="sm" asChild>
            <Link href={loginHref}>
              <UserPlus className="w-4 h-4 mr-2" />
              Follow
            </Link>
          </Button>
        )
      ) : (
        <Button variant="outline" size="sm" disabled className="min-w-[120px]">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          …
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="cursor-pointer">
            <Users className="w-4 h-4 mr-2" />
            Share Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-red-600">
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
