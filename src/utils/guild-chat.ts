import { getToken } from "./Auth";
import { apiClient } from "./fetch";
import { Config } from "./getConfig";
import type {
  CreateGuildChannelRequest,
  CreateGuildMessageRequest,
  GuildChannel,
  GuildEvent,
  GuildMessage,
  GuildMessageCursorMeta,
  UpdateGuildChannelRequest,
} from "@/types/guild";

type Envelope<T, M = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: M;
};

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${getToken()}` };
}

function guildPath(slug: string) {
  return `/api/guilds/${encodeURIComponent(slug)}`;
}

function channelPath(slug: string, channelId: string) {
  return `${guildPath(slug)}/channels/${encodeURIComponent(channelId)}`;
}

/** Channels ordered by position, then creation time. */
export async function getGuildChannels(slug: string): Promise<GuildChannel[]> {
  const { data } = await apiClient.get<Envelope<GuildChannel[]>>(
    `${guildPath(slug)}/channels`,
    { headers: authHeaders() },
  );
  return data?.data ?? [];
}

/** Owner or admin only. */
export async function createGuildChannel(
  slug: string,
  body: CreateGuildChannelRequest,
): Promise<GuildChannel | null> {
  const { data } = await apiClient.post<Envelope<GuildChannel>>(
    `${guildPath(slug)}/channels`,
    body,
    { headers: authHeaders() },
  );
  return data?.data ?? null;
}

/** Owner or admin only. */
export async function updateGuildChannel(
  slug: string,
  channelId: string,
  body: UpdateGuildChannelRequest,
): Promise<GuildChannel | null> {
  const { data } = await apiClient.patch<Envelope<GuildChannel>>(
    channelPath(slug, channelId),
    body,
    { headers: authHeaders() },
  );
  return data?.data ?? null;
}

/** Owner or admin only. Hard delete — every message in it goes too. */
export function deleteGuildChannel(slug: string, channelId: string) {
  return apiClient.delete(channelPath(slug, channelId), {
    headers: authHeaders(),
  });
}

/**
 * One page of channel history, newest first. Pass the previous page's
 * `next_before` as `before` to scroll back.
 */
export async function getGuildMessages(
  slug: string,
  channelId: string,
  params: { before?: string; limit?: number } = {},
): Promise<{ messages: GuildMessage[]; meta: GuildMessageCursorMeta | null }> {
  const query: Record<string, unknown> = {};
  if (params.before) query.before = params.before;
  if (params.limit) query.limit = params.limit;
  const { data } = await apiClient.get<
    Envelope<GuildMessage[], GuildMessageCursorMeta>
  >(`${channelPath(slug, channelId)}/messages`, {
    params: query,
    headers: authHeaders(),
  });
  return { messages: data?.data ?? [], meta: data?.meta ?? null };
}

export async function sendGuildMessage(
  slug: string,
  channelId: string,
  body: CreateGuildMessageRequest,
): Promise<GuildMessage | null> {
  const { data } = await apiClient.post<Envelope<GuildMessage>>(
    `${channelPath(slug, channelId)}/messages`,
    body,
    { headers: authHeaders() },
  );
  return data?.data ?? null;
}

/** Author only — not even the guild owner may edit someone else's message. */
export async function editGuildMessage(
  slug: string,
  channelId: string,
  messageId: string,
  content: string,
): Promise<GuildMessage | null> {
  const { data } = await apiClient.patch<Envelope<GuildMessage>>(
    `${channelPath(slug, channelId)}/messages/${encodeURIComponent(messageId)}`,
    { content },
    { headers: authHeaders() },
  );
  return data?.data ?? null;
}

/** The author, or a guild owner/admin. */
export function deleteGuildMessage(
  slug: string,
  channelId: string,
  messageId: string,
) {
  return apiClient.delete(
    `${channelPath(slug, channelId)}/messages/${encodeURIComponent(messageId)}`,
    { headers: authHeaders() },
  );
}

export type GuildStreamStatus = "connecting" | "open" | "reconnecting" | "closed";

interface GuildEventStreamOptions {
  onEvent: (event: GuildEvent) => void;
  onStatus?: (status: GuildStreamStatus) => void;
  /**
   * Called when a dropped stream is re-established. Events sent while it was
   * down are lost, so the caller should refetch what it shows.
   */
  onReconnect?: () => void;
  /** The server refused the stream for good (403/404: not a member any more). */
  onForbidden?: () => void;
}

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

/**
 * Keep the guild's SSE stream open until `close()` is called, reconnecting with
 * backoff whenever it drops. The endpoint authenticates with a Bearer header,
 * so this reads the stream with `fetch` rather than the native `EventSource`.
 */
export function openGuildEventStream(
  slug: string,
  { onEvent, onStatus, onReconnect, onForbidden }: GuildEventStreamOptions,
): () => void {
  const controller = new AbortController();
  let attempt = 0;
  let everConnected = false;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const url = `${Config.apibaseurl}${guildPath(slug)}/events`;

  /** `token` overrides the cookie right after a refresh. */
  const connect = async (token?: string, refreshed = false) => {
    onStatus?.(everConnected ? "reconnecting" : "connecting");

    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${token ?? getToken() ?? ""}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });
    } catch {
      scheduleReconnect();
      return;
    }

    if (response.status === 401 && !refreshed) {
      const fresh = await apiClient.refreshAccessToken();
      if (controller.signal.aborted) return;
      if (fresh) {
        void connect(fresh, true);
        return;
      }
    }
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      onStatus?.("closed");
      onForbidden?.();
      return;
    }
    if (!response.ok || !response.body) {
      scheduleReconnect();
      return;
    }

    attempt = 0;
    onStatus?.("open");
    if (everConnected) onReconnect?.();
    everConnected = true;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const frame = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          dispatchFrame(frame);
          boundary = buffer.indexOf("\n\n");
        }
      }
    } catch {
      // Network drop or abort — handled below.
    }
    scheduleReconnect();
  };

  const dispatchFrame = (frame: string) => {
    // Comment lines (": connected", ": ping") carry no data.
    const data = frame
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data) return;
    try {
      onEvent(JSON.parse(data) as GuildEvent);
    } catch {
      // Ignore malformed frames rather than dropping the stream.
    }
  };

  function scheduleReconnect() {
    if (controller.signal.aborted) return;
    onStatus?.("reconnecting");
    const delay = Math.min(RECONNECT_BASE_MS * 2 ** attempt, RECONNECT_MAX_MS);
    attempt += 1;
    retryTimer = setTimeout(() => void connect(), delay);
  }

  void connect();

  return () => {
    controller.abort();
    if (retryTimer) clearTimeout(retryTimer);
  };
}
