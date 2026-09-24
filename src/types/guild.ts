/** Viewer-relative guild role, as returned in `my_role`. */
export type GuildRole = "owner" | "admin" | "member";

/** Brief user shape shared by guild owner/member payloads (dto.UserBrief). */
export interface GuildUserBrief {
  id: string;
  username: string | null;
  image: string | null;
}

/** Guild from GET /api/guilds, /api/guilds/me and /api/guilds/:slug. */
export interface Guild {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  is_public: boolean;
  member_count: number;
  owner_id: string;
  owner?: GuildUserBrief | null;
  /** Only present for authenticated callers — absent means "unknown", not false. */
  is_member?: boolean;
  my_role?: GuildRole;
  created_at: string | null;
  updated_at: string | null;
}

/** Membership row from GET /api/guilds/:slug/members. */
export interface GuildMember {
  id: string;
  guild_id: string;
  user_id: string;
  role: GuildRole;
  user?: GuildUserBrief | null;
  created_at: string | null;
}

export interface CreateGuildRequest {
  name: string;
  slug?: string;
  description?: string;
  avatar_url?: string;
  is_public?: boolean;
}

export interface UpdateGuildRequest {
  name?: string;
  description?: string;
  avatar_url?: string;
  is_public?: boolean;
}

/** `meta` of a paginated guild response (response.PaginationMeta). */
export interface GuildPaginationMeta {
  total_items: number;
  offset: number;
  limit: number;
  total_pages: number;
}

export interface GuildListResult {
  guilds: Guild[];
  meta: GuildPaginationMeta | null;
}

export const GUILDS_PAGE_SIZE = 12;
export const GUILD_MEMBERS_PAGE_SIZE = 24;

/** Text channel from GET /api/guilds/:slug/channels. */
export interface GuildChannel {
  id: string;
  guild_id: string;
  name: string;
  topic: string | null;
  position: number;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateGuildChannelRequest {
  name: string;
  topic?: string;
  position?: number;
}

export interface UpdateGuildChannelRequest {
  name?: string;
  topic?: string;
  position?: number;
}

/** Parent message quoted above a reply; content is cut to 200 runes. */
export interface GuildMessageReply {
  id: string;
  author_id: string;
  author?: GuildUserBrief | null;
  content: string;
}

/** Channel message. Ids are UUIDv7, so they sort chronologically. */
export interface GuildMessage {
  id: string;
  guild_id: string;
  channel_id: string;
  author_id: string;
  author?: GuildUserBrief | null;
  content: string;
  reply_to_id: string | null;
  /** Absent once the parent message has been deleted. */
  reply_to?: GuildMessageReply | null;
  edited_at: string | null;
  created_at: string | null;
}

export interface CreateGuildMessageRequest {
  content: string;
  reply_to_id?: string;
}

/** `meta` of a channel history page: pass `next_before` as `?before=`. */
export interface GuildMessageCursorMeta {
  limit: number;
  has_more: boolean;
  next_before?: string | null;
}

/** One realtime event from GET /api/guilds/:slug/events. */
export type GuildEvent =
  | { type: "channel.created" | "channel.updated"; guild_id: string; channel_id?: string; data: GuildChannel }
  | { type: "channel.deleted"; guild_id: string; channel_id?: string; data: { id: string } }
  | { type: "message.created" | "message.updated"; guild_id: string; channel_id?: string; data: GuildMessage }
  | { type: "message.deleted"; guild_id: string; channel_id?: string; data: { id: string; channel_id: string } };

export const GUILD_MESSAGES_PAGE_SIZE = 50;
export const GUILD_MESSAGE_MAX_LENGTH = 4000;
