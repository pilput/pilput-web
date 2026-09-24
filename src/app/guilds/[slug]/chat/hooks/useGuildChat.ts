"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { isHttpError } from "@/utils/fetch";
import { guildErrorMessage } from "@/utils/guilds";
import {
  createGuildChannel,
  deleteGuildChannel,
  deleteGuildMessage,
  editGuildMessage,
  getGuildChannels,
  getGuildMessages,
  openGuildEventStream,
  sendGuildMessage,
  updateGuildChannel,
  type GuildStreamStatus,
} from "@/utils/guild-chat";
import {
  GUILD_MESSAGES_PAGE_SIZE,
  type CreateGuildChannelRequest,
  type GuildChannel,
  type GuildEvent,
  type GuildMessage,
  type GuildMessageCursorMeta,
  type UpdateGuildChannelRequest,
} from "@/types/guild";

export interface ChannelHistory {
  /** Oldest first, as rendered. */
  messages: GuildMessage[];
  hasMore: boolean;
  nextBefore: string | null;
  loading: boolean;
  loadingOlder: boolean;
  error: boolean;
}

const EMPTY_HISTORY: ChannelHistory = {
  messages: [],
  hasMore: false,
  nextBefore: null,
  loading: true,
  loadingOlder: false,
  error: false,
};

// UUIDv7 ids are time-ordered, so plain string order is message order.
const byId = (a: { id: string }, b: { id: string }) =>
  a.id < b.id ? -1 : a.id > b.id ? 1 : 0;

const byPosition = (a: GuildChannel, b: GuildChannel) =>
  a.position - b.position || (a.created_at ?? "").localeCompare(b.created_at ?? "") || byId(a, b);

function upsertMessages(existing: GuildMessage[], incoming: GuildMessage[]) {
  const map = new Map(existing.map((m) => [m.id, m]));
  for (const m of incoming) map.set(m.id, m);
  return [...map.values()].sort(byId);
}

/**
 * Fold a fresh latest page into what is already shown after the stream was
 * down. The fresh page is authoritative for its own range (so deletions made
 * meanwhile disappear); older messages already loaded are kept unless the gap
 * is larger than one page, in which case history restarts from the fresh page.
 */
function reconcileLatest(
  existing: ChannelHistory,
  freshDesc: GuildMessage[],
  meta: GuildMessageCursorMeta | null,
): ChannelHistory {
  const fresh = [...freshDesc].sort(byId);
  const freshMeta = {
    hasMore: meta?.has_more ?? false,
    nextBefore: meta?.next_before ?? null,
  };
  if (fresh.length === 0) {
    return { ...existing, ...freshMeta, messages: [], loading: false, error: false };
  }
  const oldestFresh = fresh[0].id;
  const olderKept = existing.messages.filter((m) => m.id < oldestFresh);
  const newestExisting = existing.messages.at(-1)?.id;
  const gap = freshMeta.hasMore && (!newestExisting || newestExisting < oldestFresh);

  if (gap || olderKept.length === 0) {
    return { ...existing, ...freshMeta, messages: fresh, loading: false, error: false };
  }
  return { ...existing, messages: [...olderKept, ...fresh], loading: false, error: false };
}

function readChannelFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("channel");
}

function writeChannelToUrl(channelId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("channel", channelId);
  window.history.replaceState(null, "", url);
}

interface UseGuildChatOptions {
  slug: string;
  /** Only members may read channels, so nothing is fetched until this is true. */
  enabled: boolean;
  currentUserId: string | undefined;
  /** The server closed the stream for good — the viewer is no longer a member. */
  onAccessLost: () => void;
}

export function useGuildChat({
  slug,
  enabled,
  currentUserId,
  onAccessLost,
}: UseGuildChatOptions) {
  const [channels, setChannels] = useState<GuildChannel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [activeChannelId, setActiveChannelIdState] = useState<string | null>(null);
  const [histories, setHistories] = useState<Record<string, ChannelHistory>>({});
  const [unread, setUnread] = useState<Set<string>>(() => new Set());
  const [streamStatus, setStreamStatus] = useState<GuildStreamStatus>("connecting");

  // The stream callbacks outlive renders; read the latest values through refs.
  const activeRef = useRef<string | null>(null);
  const historiesRef = useRef(histories);
  const currentUserRef = useRef(currentUserId);
  const onAccessLostRef = useRef(onAccessLost);
  useEffect(() => {
    activeRef.current = activeChannelId;
    historiesRef.current = histories;
    currentUserRef.current = currentUserId;
    onAccessLostRef.current = onAccessLost;
  });

  const setActiveChannelId = useCallback((channelId: string) => {
    setActiveChannelIdState(channelId);
    setUnread((prev) => {
      if (!prev.has(channelId)) return prev;
      const next = new Set(prev);
      next.delete(channelId);
      return next;
    });
    writeChannelToUrl(channelId);
  }, []);

  const patchHistory = useCallback(
    (channelId: string, patch: (h: ChannelHistory) => ChannelHistory) => {
      setHistories((prev) => {
        const current = prev[channelId];
        if (!current) return prev;
        return { ...prev, [channelId]: patch(current) };
      });
    },
    [],
  );

  const loadChannels = useCallback(async () => {
    try {
      const list = [...(await getGuildChannels(slug))].sort(byPosition);
      setChannels(list);
      setActiveChannelIdState((current) => {
        if (current && list.some((c) => c.id === current)) return current;
        const fromUrl = readChannelFromUrl();
        const next = list.find((c) => c.id === fromUrl) ?? list[0];
        return next?.id ?? null;
      });
    } catch (error) {
      if (isHttpError(error) && [403, 404].includes(error.response?.status)) {
        onAccessLostRef.current();
        return;
      }
      toast.error(guildErrorMessage(error, "Could not load channels."));
    } finally {
      setChannelsLoading(false);
    }
  }, [slug]);

  const loadLatest = useCallback(
    async (channelId: string, reconcile: boolean) => {
      if (!reconcile) {
        setHistories((prev) => ({ ...prev, [channelId]: { ...EMPTY_HISTORY } }));
      }
      try {
        const { messages, meta } = await getGuildMessages(slug, channelId, {
          limit: GUILD_MESSAGES_PAGE_SIZE,
        });
        setHistories((prev) => ({
          ...prev,
          [channelId]: reconcileLatest(prev[channelId] ?? EMPTY_HISTORY, messages, meta),
        }));
      } catch (error) {
        if (isHttpError(error) && error.response?.status === 403) {
          onAccessLostRef.current();
          return;
        }
        patchHistory(channelId, (h) => ({ ...h, loading: false, error: true }));
      }
    },
    [slug, patchHistory],
  );

  const loadOlder = useCallback(async () => {
    const channelId = activeRef.current;
    if (!channelId) return;
    const history = historiesRef.current[channelId];
    if (!history || !history.hasMore || !history.nextBefore || history.loadingOlder) return;

    patchHistory(channelId, (h) => ({ ...h, loadingOlder: true }));
    try {
      const { messages, meta } = await getGuildMessages(slug, channelId, {
        before: history.nextBefore,
        limit: GUILD_MESSAGES_PAGE_SIZE,
      });
      patchHistory(channelId, (h) => ({
        ...h,
        messages: upsertMessages(h.messages, messages),
        hasMore: meta?.has_more ?? false,
        nextBefore: meta?.next_before ?? null,
        loadingOlder: false,
      }));
    } catch (error) {
      toast.error(guildErrorMessage(error, "Could not load older messages."));
      patchHistory(channelId, (h) => ({ ...h, loadingOlder: false }));
    }
  }, [slug, patchHistory]);

  const handleEvent = useCallback(
    (event: GuildEvent) => {
      switch (event.type) {
        case "channel.created":
        case "channel.updated":
          setChannels((prev) =>
            [...prev.filter((c) => c.id !== event.data.id), event.data].sort(byPosition),
          );
          return;
        case "channel.deleted": {
          const deletedId = event.data.id;
          setChannels((prev) => prev.filter((c) => c.id !== deletedId));
          setHistories((prev) => {
            if (!(deletedId in prev)) return prev;
            const next = { ...prev };
            delete next[deletedId];
            return next;
          });
          return;
        }
        case "message.created":
        case "message.updated": {
          const message = event.data;
          patchHistory(message.channel_id, (h) => {
            // An edit of a message older than what is loaded has nothing to update.
            if (event.type === "message.updated" && !h.messages.some((m) => m.id === message.id)) {
              return h;
            }
            return { ...h, messages: upsertMessages(h.messages, [message]) };
          });
          if (
            event.type === "message.created" &&
            message.channel_id !== activeRef.current &&
            message.author_id !== currentUserRef.current
          ) {
            setUnread((prev) => new Set(prev).add(message.channel_id));
          }
          return;
        }
        case "message.deleted": {
          const { id, channel_id } = event.data;
          patchHistory(channel_id, (h) => ({
            ...h,
            messages: h.messages
              .filter((m) => m.id !== id)
              // Replies keep their text but lose the quote, as on the server.
              .map((m) => (m.reply_to_id === id ? { ...m, reply_to: null } : m)),
          }));
          return;
        }
      }
    },
    [patchHistory],
  );

  // Channels once membership is known.
  useEffect(() => {
    if (!enabled) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadChannels();
  }, [enabled, loadChannels]);

  // The open channel was deleted (here or by another admin): fall back to the first.
  useEffect(() => {
    if (!activeChannelId || channels.some((c) => c.id === activeChannelId)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveChannelIdState(channels[0]?.id ?? null);
  }, [channels, activeChannelId]);

  // History for a channel the first time it is opened.
  useEffect(() => {
    if (!enabled || !activeChannelId) return;
    if (historiesRef.current[activeChannelId]) return;
    void loadLatest(activeChannelId, false);
  }, [enabled, activeChannelId, loadLatest]);

  // One realtime stream per open guild.
  useEffect(() => {
    if (!enabled) return;
    return openGuildEventStream(slug, {
      onEvent: handleEvent,
      onStatus: setStreamStatus,
      onForbidden: () => onAccessLostRef.current(),
      onReconnect: () => {
        // Events sent while disconnected are gone: refetch what is on screen.
        void loadChannels();
        for (const channelId of Object.keys(historiesRef.current)) {
          void loadLatest(channelId, true);
        }
      },
    });
  }, [enabled, slug, handleEvent, loadChannels, loadLatest]);

  const send = useCallback(
    async (content: string, replyToId?: string) => {
      const channelId = activeRef.current;
      if (!channelId) return false;
      try {
        const message = await sendGuildMessage(slug, channelId, {
          content,
          ...(replyToId ? { reply_to_id: replyToId } : {}),
        });
        // The stream echoes it too; upsert keeps a single copy.
        if (message) {
          patchHistory(channelId, (h) => ({ ...h, messages: upsertMessages(h.messages, [message]) }));
        }
        return true;
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not send the message."));
        return false;
      }
    },
    [slug, patchHistory],
  );

  const edit = useCallback(
    async (message: GuildMessage, content: string) => {
      try {
        const updated = await editGuildMessage(slug, message.channel_id, message.id, content);
        if (updated) {
          patchHistory(message.channel_id, (h) => ({
            ...h,
            messages: upsertMessages(h.messages, [updated]),
          }));
        }
        return true;
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not edit the message."));
        return false;
      }
    },
    [slug, patchHistory],
  );

  const remove = useCallback(
    async (message: GuildMessage) => {
      try {
        await deleteGuildMessage(slug, message.channel_id, message.id);
        handleEvent({
          type: "message.deleted",
          guild_id: message.guild_id,
          data: { id: message.id, channel_id: message.channel_id },
        });
        return true;
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not delete the message."));
        return false;
      }
    },
    [slug, handleEvent],
  );

  const createChannel = useCallback(
    async (body: CreateGuildChannelRequest) => {
      try {
        const channel = await createGuildChannel(slug, body);
        if (channel) {
          handleEvent({ type: "channel.created", guild_id: channel.guild_id, data: channel });
          setActiveChannelId(channel.id);
        }
        return true;
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not create the channel."));
        return false;
      }
    },
    [slug, handleEvent, setActiveChannelId],
  );

  const updateChannel = useCallback(
    async (channelId: string, body: UpdateGuildChannelRequest) => {
      try {
        const channel = await updateGuildChannel(slug, channelId, body);
        if (channel) {
          handleEvent({ type: "channel.updated", guild_id: channel.guild_id, data: channel });
        }
        return true;
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not update the channel."));
        return false;
      }
    },
    [slug, handleEvent],
  );

  const deleteChannel = useCallback(
    async (channel: GuildChannel) => {
      try {
        await deleteGuildChannel(slug, channel.id);
        handleEvent({ type: "channel.deleted", guild_id: channel.guild_id, data: { id: channel.id } });
        return true;
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not delete the channel."));
        return false;
      }
    },
    [slug, handleEvent],
  );

  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? null;
  const activeHistory = activeChannelId ? histories[activeChannelId] ?? EMPTY_HISTORY : null;

  return {
    channels,
    channelsLoading,
    activeChannel,
    activeHistory,
    setActiveChannelId,
    unread,
    streamStatus,
    loadOlder,
    retryHistory: () => {
      if (activeChannelId) void loadLatest(activeChannelId, false);
    },
    send,
    edit,
    remove,
    createChannel,
    updateChannel,
    deleteChannel,
  };
}
