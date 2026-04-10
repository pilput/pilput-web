import { getToken } from "./Auth";
import { ErrorHandlerAPI } from "./ErrorHandler";
import { Config } from "./getConfig";

export class HttpError extends Error {
  readonly response: {
    status: number;
    data: unknown;
    statusText: string;
  };

  constructor(message: string, response: HttpError["response"]) {
    super(message);
    this.name = "HttpError";
    this.response = response;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

export type RequestConfig = {
  /** Query string parameters (any JSON-serializable values are stringified). */
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  cache?: RequestCache;
};

export type HttpResponse<T = unknown> = {
  data: T;
  status: number;
  statusText: string;
};

function joinBaseUrl(baseURL: string, path: string): string {
  const base = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function buildUrl(
  baseURL: string,
  path: string,
  params?: RequestConfig["params"],
): string {
  const url = joinBaseUrl(baseURL, path);
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  const u = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      u.searchParams.set(key, String(value as string | number | boolean));
    }
  }
  return u.toString();
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function createClient(baseURL: string) {
  async function request<T = unknown>(
    method: string,
    path: string,
    body: unknown | undefined,
    config: RequestConfig = {},
  ): Promise<HttpResponse<T>> {
    const url = buildUrl(baseURL, path, config.params);
    const headers: Record<string, string> = { ...(config.headers ?? {}) };

    let requestBody: BodyInit | undefined;
    if (body === undefined || body === null) {
      requestBody = undefined;
    } else if (body instanceof FormData) {
      requestBody = body;
    } else if (typeof body === "string") {
      requestBody = body;
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "text/plain;charset=UTF-8";
      }
    } else {
      requestBody = JSON.stringify(body);
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers:
          Object.keys(headers).length > 0 ? headers : undefined,
        body:
          method === "GET" || method === "HEAD"
            ? undefined
            : requestBody,
        signal: config.signal,
        cache: config.cache ?? "no-store",
      });
    } catch (e) {
      throw e;
    }

    const data = (await parseBody(response)) as T;

    if (!response.ok) {
      throw new HttpError(`Request failed with status ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        data,
      });
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  return {
    get: <T = any>(path: string, config?: RequestConfig) =>
      request<T>("GET", path, undefined, config),

    post: <T = any>(path: string, body?: unknown, config?: RequestConfig) =>
      request<T>("POST", path, body, config),

    put: <T = any>(path: string, body?: unknown, config?: RequestConfig) =>
      request<T>("PUT", path, body, config),

    patch: <T = any>(path: string, body?: unknown, config?: RequestConfig) =>
      request<T>("PATCH", path, body, config),

    delete: <T = any>(path: string, config?: RequestConfig) =>
      request<T>("DELETE", path, undefined, config),
  };
}

/** Main API (`NEXT_PUBLIC_API_URL`) — public posts, tags, uploads, views. */
export const apiClient = createClient(Config.apibaseurl);



/** App API (`NEXT_PUBLIC_API_URL_2`) — auth, users, chat, holdings, feed. */
export const apiClientApp = createClient(Config.apibaseurl2);

export async function getDataExternal(
  url: string,
  params: Record<string, unknown>,
) {
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        u.searchParams.set(k, String(v));
      }
    }
    const response = await fetch(u.toString(), { cache: "no-store" });
    const data = await parseBody(response);
    if (!response.ok) {
      throw new HttpError(`Request failed with status ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        data,
      });
    }
    return data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await apiClientApp.post("/v1/auth/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const response = await apiClientApp.post("/v1/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export function followUser(userId: string) {
  return apiClientApp.post(
    `/v1/users/${userId}/follow`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );
}

export function unfollowUser(userId: string) {
  return apiClientApp.delete(`/v1/users/${userId}/follow`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

/** Like record from `POST /v1/likes/:post_id` (toggle). */
export type PostLikeRecord = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

type LikesToggleEnvelope = {
  success?: boolean;
  data: PostLikeRecord | null | undefined;
};

/**
 * Toggle like on a post. Requires a Bearer token.
 * When the like is removed, `data` may be null — treat that as unliked.
 */
export async function togglePostLike(postId: string): Promise<{
  liked: boolean;
  record: PostLikeRecord | undefined;
}> {
  const token = getToken();
  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }
  const { data } = await apiClientApp.post<LikesToggleEnvelope>(
    `/v1/likes/${postId}`,
    undefined,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const record = data?.data ?? undefined;
  const liked = record != null;
  return { liked, record };
}

/** List likes for a post (auth required per API). */
export async function getPostLikes(postId: string) {
  const token = getToken();
  if (!token) {
    return null;
  }
  const { data } = await apiClientApp.get<{
    success?: boolean;
    data: Array<{ id: string; created_at: string; user_id?: string }>;
  }>(`/v1/likes/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data ?? [];
}
