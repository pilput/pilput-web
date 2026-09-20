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
