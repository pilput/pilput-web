import { getToken } from "./Auth";
import { apiClient, isHttpError } from "./fetch";
import type {
  CreateGuildRequest,
  Guild,
  GuildListResult,
  GuildMember,
  GuildPaginationMeta,
  UpdateGuildRequest,
} from "@/types/guild";

type Envelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: GuildPaginationMeta;
};

/** Auth header for endpoints that require a signed-in caller. */
function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${getToken()}` };
}

/**
 * Header for the `OptionalAuth` endpoints (guild detail, members): sending an
 * empty bearer would be rejected, so anonymous callers send nothing and simply
 * get a response without the viewer-relative fields.
 */
function optionalAuthHeaders(): Record<string, string> | undefined {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

type ListParams = { limit?: number; offset?: number; search?: string };

function listParams({ limit, offset, search }: ListParams) {
  const params: Record<string, unknown> = {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;
  if (search) params.search = search;
  return params;
}

/** Public guild directory — no auth, private guilds are never listed. */
export async function getGuilds(params: ListParams = {}): Promise<GuildListResult> {
  const { data } = await apiClient.get<Envelope<Guild[]>>("/api/guilds", {
    params: listParams(params),
  });
  return { guilds: data?.data ?? [], meta: data?.meta ?? null };
}

/** Guilds the signed-in user belongs to, including private ones. */
export async function getMyGuilds(
  params: Omit<ListParams, "search"> = {},
): Promise<GuildListResult> {
  const { data } = await apiClient.get<Envelope<Guild[]>>("/api/guilds/me", {
    params: listParams(params),
    headers: authHeaders(),
  });
  return { guilds: data?.data ?? [], meta: data?.meta ?? null };
}

/**
 * Single guild by slug. A private guild answers 404 for anyone who is not a
 * member, so callers must treat "not found" as "not visible to you".
 */
export async function getGuild(slug: string): Promise<Guild | null> {
  const { data } = await apiClient.get<Envelope<Guild>>(
    `/api/guilds/${encodeURIComponent(slug)}`,
    { headers: optionalAuthHeaders() },
  );
  return data?.data ?? null;
}

export async function getGuildMembers(
  slug: string,
  params: Omit<ListParams, "search"> = {},
): Promise<{ members: GuildMember[]; meta: GuildPaginationMeta | null }> {
  const { data } = await apiClient.get<Envelope<GuildMember[]>>(
    `/api/guilds/${encodeURIComponent(slug)}/members`,
    { params: listParams(params), headers: optionalAuthHeaders() },
  );
  return { members: data?.data ?? [], meta: data?.meta ?? null };
}

export async function createGuild(body: CreateGuildRequest): Promise<Guild | null> {
  const { data } = await apiClient.post<Envelope<Guild>>("/api/guilds", body, {
    headers: authHeaders(),
  });
  return data?.data ?? null;
}

/** The slug is immutable server-side, so it is not part of the update body. */
export async function updateGuild(
  slug: string,
  body: UpdateGuildRequest,
): Promise<Guild | null> {
  const { data } = await apiClient.patch<Envelope<Guild>>(
    `/api/guilds/${encodeURIComponent(slug)}`,
    body,
    { headers: authHeaders() },
  );
  return data?.data ?? null;
}

/** Owner only. Cascades to every membership row. */
export function deleteGuild(slug: string) {
  return apiClient.delete(`/api/guilds/${encodeURIComponent(slug)}`, {
    headers: authHeaders(),
  });
}

export async function joinGuild(slug: string): Promise<GuildMember | null> {
  const { data } = await apiClient.post<Envelope<GuildMember>>(
    `/api/guilds/${encodeURIComponent(slug)}/join`,
    undefined,
    { headers: authHeaders() },
  );
  return data?.data ?? null;
}

/** The owner cannot leave their own guild — the API answers 400. */
export function leaveGuild(slug: string) {
  return apiClient.delete(`/api/guilds/${encodeURIComponent(slug)}/leave`, {
    headers: authHeaders(),
  });
}

/**
 * Message for a failed guild call. The guild endpoints answer with a helpful
 * `message` for every domain error (slug taken, already a member, owner cannot
 * leave, ...), so prefer it over a generic toast.
 */
export function guildErrorMessage(error: unknown, fallback: string): string {
  if (isHttpError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;
    return data?.message || data?.error || fallback;
  }
  return fallback;
}
