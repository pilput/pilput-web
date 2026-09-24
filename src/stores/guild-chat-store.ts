import { create } from "zustand";
import { toast } from "sonner";
import { isHttpError } from "@/utils/fetch";
import { getGuild, getMyGuilds, guildErrorMessage } from "@/utils/guilds";
import {
  createGuildChannel,
  deleteGuildChannel,
  deleteGuildMessage,
  editGuildMessage,
  getGuildChannels,
  getGuildMessages,
  sendGuildMessage,
  updateGuildChannel,
  type GuildStreamStatus,
} from "@/utils/guild-chat";
import {
  GUILD_MESSAGES_PAGE_SIZE,
  type CreateGuildChannelRequest,
  type Guild,
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

export const EMPTY_HISTORY: ChannelHistory = {
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
  a.position - b.position ||
  (a.created_at ?? "").localeCompare(b.created_at ?? "") ||
  byId(a, b);

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
  const done = { loading: false, error: false };
  if (fresh.length === 0) {
    return { ...existing, ...freshMeta, ...done, messages: [] };
  }
  const oldestFresh = fresh[0].id;
  const olderKept = existing.messages.filter((m) => m.id < oldestFresh);
  const newestExisting = existing.messages.at(-1)?.id;
  const gap = freshMeta.hasMore && (!newestExisting || newestExisting < oldestFresh);

  if (gap || olderKept.length === 0) {
    return { ...existing, ...freshMeta, ...done, messages: fresh };
  }
  return { ...existing, ...done, messages: [...olderKept, ...fresh] };
}

type GuildStatus = "idle" | "loading" | "ready" | "notfound";

interface GuildChatState {
  /** Guilds the viewer belongs to, for the workspace sidebar. */
  myGuilds: Guild[];
  myGuildsLoading: boolean;

  /** The guild currently open in the workspace. */
  slug: string | null;
  guild: Guild | null;
  guildStatus: GuildStatus;

  channels: GuildChannel[];
  channelsLoading: boolean;
  histories: Record<string, ChannelHistory>;
  unread: Record<string, true>;
  /** Channel on screen; its new messages never count as unread. */
  activeChannelId: string | null;
  streamStatus: GuildStreamStatus;

  loadMyGuilds: () => Promise<void>;
  /** Switch the workspace to a guild; clears everything of the previous one. */
  openGuild: (slug: string) => void;
  refreshGuild: () => Promise<void>;
  /** The server refused access (left, kicked, guild made private). */
  accessLost: () => void;

  loadChannels: () => Promise<void>;
  setActiveChannel: (channelId: string | null) => void;
  setStreamStatus: (status: GuildStreamStatus) => void;
  handleEvent: (event: GuildEvent, currentUserId?: string) => void;

  loadLatest: (channelId: string, reconcile: boolean) => Promise<void>;
  loadOlder: (channelId: string) => Promise<void>;
  send: (channelId: string, content: string, replyToId?: string) => Promise<boolean>;
  edit: (message: GuildMessage, content: string) => Promise<boolean>;
  remove: (message: GuildMessage) => Promise<boolean>;

  /** Channel create/edit dialog; `channel` null means create. */
  channelDialog: { open: boolean; channel: GuildChannel | null };
  openChannelDialog: (channel: GuildChannel | null) => void;
  closeChannelDialog: () => void;
  /** Channel awaiting delete confirmation. */
  channelToDelete: GuildChannel | null;
  requestDeleteChannel: (channel: GuildChannel | null) => void;

  createChannel: (body: CreateGuildChannelRequest) => Promise<GuildChannel | null>;
  updateChannel: (channelId: string, body: UpdateGuildChannelRequest) => Promise<boolean>;
  deleteChannel: (channel: GuildChannel) => Promise<boolean>;
}

const GUILD_RESET = {
  guild: null,
  guildStatus: "idle" as GuildStatus,
  channels: [],
  channelsLoading: true,
  histories: {},
  unread: {},
  activeChannelId: null,
  streamStatus: "connecting" as GuildStreamStatus,
};

export const useGuildChatStore = create<GuildChatState>()((set, get) => {
  const patchHistory = (
    channelId: string,
    patch: (h: ChannelHistory) => ChannelHistory,
  ) =>
    set((state) => {
      const current = state.histories[channelId];
      if (!current) return state;
      return { histories: { ...state.histories, [channelId]: patch(current) } };
    });

  /** Drop the result of a request made for a guild that is no longer open. */
  const isCurrent = (slug: string) => get().slug === slug;

  return {
    myGuilds: [],
    myGuildsLoading: true,
    slug: null,
    ...GUILD_RESET,

    channelDialog: { open: false, channel: null },
    openChannelDialog: (channel) => set({ channelDialog: { open: true, channel } }),
    closeChannelDialog: () => set((s) => ({ channelDialog: { ...s.channelDialog, open: false } })),
    channelToDelete: null,
    requestDeleteChannel: (channelToDelete) => set({ channelToDelete }),

    loadMyGuilds: async () => {
      try {
        const { guilds } = await getMyGuilds({ limit: 100, offset: 0 });
        set({ myGuilds: guilds });
      } catch {
        // Non-fatal: the sidebar just shows no guild shortcuts.
      } finally {
        set({ myGuildsLoading: false });
      }
    },

    openGuild: (slug) => {
      // Re-entering the same guild keeps what is loaded; the workspace resyncs it.
      if (get().slug !== slug) {
        set({ slug, ...GUILD_RESET, guildStatus: "loading" });
      }
      void get().refreshGuild();
    },

    refreshGuild: async () => {
      const slug = get().slug;
      if (!slug) return;
      try {
        const guild = await getGuild(slug);
        if (!isCurrent(slug)) return;
        set({ guild, guildStatus: guild ? "ready" : "notfound" });
      } catch (error) {
        if (!isCurrent(slug)) return;
        if (isHttpError(error) && error.response?.status === 404) {
          set({ guild: null, guildStatus: "notfound" });
          return;
        }
        set((s) => ({ guildStatus: s.guild ? "ready" : "notfound" }));
        toast.error(guildErrorMessage(error, "Could not load the guild."));
      }
    },

    accessLost: () => {
      toast.error("You no longer have access to this guild's channels.");
      set({ channels: [], histories: {}, unread: {} });
      void get().refreshGuild();
      void get().loadMyGuilds();
    },

    loadChannels: async () => {
      const slug = get().slug;
      if (!slug) return;
      try {
        const channels = [...(await getGuildChannels(slug))].sort(byPosition);
        if (!isCurrent(slug)) return;
        set({ channels });
      } catch (error) {
        if (!isCurrent(slug)) return;
        if (isHttpError(error) && [403, 404].includes(error.response?.status)) {
          get().accessLost();
          return;
        }
        toast.error(guildErrorMessage(error, "Could not load channels."));
      } finally {
        if (isCurrent(slug)) set({ channelsLoading: false });
      }
    },

    setActiveChannel: (channelId) =>
      set((state) => {
        if (!channelId || !state.unread[channelId]) return { activeChannelId: channelId };
        const unread = { ...state.unread };
        delete unread[channelId];
        return { activeChannelId: channelId, unread };
      }),

    setStreamStatus: (streamStatus) => set({ streamStatus }),

    handleEvent: (event, currentUserId) => {
      switch (event.type) {
        case "channel.created":
        case "channel.updated":
          set((s) => ({
            channels: [...s.channels.filter((c) => c.id !== event.data.id), event.data].sort(byPosition),
          }));
          return;
        case "channel.deleted": {
          const deletedId = event.data.id;
          set((s) => {
            const histories = { ...s.histories };
            const unread = { ...s.unread };
            delete histories[deletedId];
            delete unread[deletedId];
            return {
              channels: s.channels.filter((c) => c.id !== deletedId),
              histories,
              unread,
            };
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
            message.channel_id !== get().activeChannelId &&
            message.author_id !== currentUserId
          ) {
            set((s) => ({ unread: { ...s.unread, [message.channel_id]: true } }));
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

    loadLatest: async (channelId, reconcile) => {
      const slug = get().slug;
      if (!slug) return;
      if (!reconcile) {
        set((s) => ({ histories: { ...s.histories, [channelId]: { ...EMPTY_HISTORY } } }));
      }
      try {
        const { messages, meta } = await getGuildMessages(slug, channelId, {
          limit: GUILD_MESSAGES_PAGE_SIZE,
        });
        if (!isCurrent(slug)) return;
        set((s) => ({
          histories: {
            ...s.histories,
            [channelId]: reconcileLatest(s.histories[channelId] ?? EMPTY_HISTORY, messages, meta),
          },
        }));
      } catch (error) {
        if (!isCurrent(slug)) return;
        if (isHttpError(error) && error.response?.status === 403) {
          get().accessLost();
          return;
        }
        patchHistory(channelId, (h) => ({ ...h, loading: false, error: true }));
      }
    },

    loadOlder: async (channelId) => {
      const slug = get().slug;
      const history = get().histories[channelId];
      if (!slug || !history?.hasMore || !history.nextBefore || history.loadingOlder) return;

      patchHistory(channelId, (h) => ({ ...h, loadingOlder: true }));
      try {
        const { messages, meta } = await getGuildMessages(slug, channelId, {
          before: history.nextBefore,
          limit: GUILD_MESSAGES_PAGE_SIZE,
        });
        if (!isCurrent(slug)) return;
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
    },

    send: async (channelId, content, replyToId) => {
      const slug = get().slug;
      if (!slug) return false;
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

    edit: async (message, content) => {
      const slug = get().slug;
      if (!slug) return false;
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

    remove: async (message) => {
      const slug = get().slug;
      if (!slug) return false;
      try {
        await deleteGuildMessage(slug, message.channel_id, message.id);
        get().handleEvent({
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

    createChannel: async (body) => {
      const slug = get().slug;
      if (!slug) return null;
      try {
        const channel = await createGuildChannel(slug, body);
        if (channel) {
          get().handleEvent({ type: "channel.created", guild_id: channel.guild_id, data: channel });
        }
        return channel;
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not create the channel."));
        return null;
      }
    },

    updateChannel: async (channelId, body) => {
      const slug = get().slug;
      if (!slug) return false;
      try {
        const channel = await updateGuildChannel(slug, channelId, body);
        if (channel) {
          get().handleEvent({ type: "channel.updated", guild_id: channel.guild_id, data: channel });
        }
        return true;
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not update the channel."));
        return false;
      }
    },

    deleteChannel: async (channel) => {
      const slug = get().slug;
      if (!slug) return false;
      try {
        await deleteGuildChannel(slug, channel.id);
        get().handleEvent({ type: "channel.deleted", guild_id: channel.guild_id, data: { id: channel.id } });
        return true;
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not delete the channel."));
        return false;
      }
    },
  };
});
