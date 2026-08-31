"use client";

import { useEffect, useState } from "react";
import { authStore } from "@/stores/userStore";
import { apiClient } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";

interface MutualFollowUser {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  name?: string;
}

interface MutualFollowsProps {
  profileUserId: string;
  profileUsername: string;
  profileDisplayName: string;
}

function displayName(user: MutualFollowUser): string {
  const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  return name || user.name || user.username || "someone";
}

export default function MutualFollows({
  profileUserId,
  profileUsername,
  profileDisplayName,
}: MutualFollowsProps) {
  const fetchAuth = authStore((s) => s.fetch);
  const me = authStore((s) => s.data);
  const [authChecked, setAuthChecked] = useState(false);
  const [mutuals, setMutuals] = useState<MutualFollowUser[]>([]);

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
    authChecked && me.username !== "loading..." && me.username === profileUsername;

  useEffect(() => {
    if (!authChecked || isOwnProfile) {
      return;
    }
    const token = getToken();
    if (!token) {
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const { data } = await apiClient.get<{
          success: boolean;
          data: MutualFollowUser[];
        }>(`/api/users/${profileUserId}/mutual-follows`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled && data?.success && Array.isArray(data.data)) {
          setMutuals(data.data);
        }
      } catch {
        // Silently ignore — this is a small enhancement, not critical UX.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authChecked, isOwnProfile, profileUserId]);

  if (!authChecked || isOwnProfile || mutuals.length === 0) {
    return null;
  }

  const names = mutuals.map(displayName);
  let text: string;
  if (names.length === 1) {
    text = `You and ${profileDisplayName} both follow ${names[0]}.`;
  } else if (names.length === 2) {
    text = `You and ${profileDisplayName} both follow ${names[0]} and ${names[1]}.`;
  } else {
    const remaining = names.length - 2;
    text = `You and ${profileDisplayName} both follow ${names[0]}, ${names[1]} and ${remaining} other${
      remaining === 1 ? "" : "s"
    }.`;
  }

  return (
    <p className="text-xs text-muted-foreground" title={names.join(", ")}>
      {text}
    </p>
  );
}
