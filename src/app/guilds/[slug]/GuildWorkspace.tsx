"use client";

import { useEffect, useRef } from "react";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import { authStore } from "@/stores/userStore";
import { openGuildEventStream } from "@/utils/guild-chat";
import { ChannelDialogs } from "./ChannelDialogs";

/**
 * Keeps the open guild in the shared store for as long as any of its pages is
 * on screen, and holds its one realtime stream so the sidebar can show unread
 * channels from the overview page too.
 */
export function GuildWorkspace({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const { ready } = useIsLoggedIn();
  const openGuild = useGuildChatStore((s) => s.openGuild);
  const isMember = useGuildChatStore((s) => s.slug === slug && s.guild?.is_member === true);
  const currentUserId = authStore((s) => s.data.id);

  const currentUserRef = useRef(currentUserId);
  useEffect(() => {
    currentUserRef.current = currentUserId;
  }, [currentUserId]);

  // Wait for the auth cookie so a private guild is fetched with the token.
  useEffect(() => {
    if (ready) openGuild(slug);
  }, [ready, slug, openGuild]);

  useEffect(() => {
    if (!isMember) return;
    const store = useGuildChatStore.getState;

    // Events missed while no stream was open are gone: refetch what is shown.
    const resync = () => {
      void store().loadChannels();
      for (const channelId of Object.keys(store().histories)) {
        void store().loadLatest(channelId, true);
      }
    };
    resync();

    return openGuildEventStream(slug, {
      onEvent: (event) => store().handleEvent(event, currentUserRef.current),
      onStatus: (status) => store().setStreamStatus(status),
      onForbidden: () => store().accessLost(),
      onReconnect: resync,
    });
  }, [slug, isMember]);

  return (
    <>
      {children}
      <ChannelDialogs />
    </>
  );
}
