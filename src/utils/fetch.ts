import {
  getToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./Auth";
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
  // A single in-flight refresh shared across concurrent requests so we never
  // fire multiple `/api/auth/refresh` calls (which would break token rotation).
  let refreshPromise: Promise<string | null> | null = null;

  async function doRefresh(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }
    try {
      const res = await fetch(joinBaseUrl(baseURL, "/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      });
      if (!res.ok) {
        clearTokens();
        return null;
      }
      const json = (await parseBody(res)) as {
        data?: { access_token?: string; refresh_token?: string };
      };
      const accessToken = json?.data?.access_token;
      if (!accessToken) {
        clearTokens();
        return null;
      }
      setTokens(accessToken, json?.data?.refresh_token);
      return accessToken;
    } catch {
      return null;
    }
  }

  function refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => {
        refreshPromise = null;
      });
    }
    return refreshPromise;
  }

  async function request<T = unknown>(
    method: string,
    path: string,
    body: unknown | undefined,
    config: RequestConfig = {},
    isRetry = false,
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

    // Transparently refresh an expired access token once, then retry the
    // original request with the rotated token. Only for authenticated calls.
    if (
      response.status === 401 &&
      !isRetry &&
      headers["Authorization"] &&
      getRefreshToken()
    ) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        return request<T>(
          method,
          path,
          body,
          {
            ...config,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          },
          true,
        );
      }
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

/** API client (`NEXT_PUBLIC_API_URL`). */
export const apiClient = createClient(Config.apibaseurl);

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

/**
 * Log out: revoke the refresh-token session on the backend, then clear the
 * local token cookies. Always clears cookies even if the request fails.
 */
export async function logoutUser() {
  const token = getToken();
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await apiClient.post(
        "/api/auth/logout",
        { refresh_token: refreshToken },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      );
    }
  } catch {
    // Ignore backend errors — the session is cleared locally regardless.
  } finally {
    clearTokens();
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await apiClient.post("/api/auth/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const response = await apiClient.post("/api/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}

export function followUser(userId: string) {
  return apiClient.post(
    `/api/users/${userId}/follow`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );
}

export function unfollowUser(userId: string) {
  return apiClient.delete(`/api/users/${userId}/follow`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export type PostLikeRecord = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export async function togglePostLike(postId: string, wasLiked?: boolean): Promise<{
  liked: boolean;
  record: PostLikeRecord | undefined;
}> {
  const token = getToken();
  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  let shouldUnlike = wasLiked;
  if (shouldUnlike === undefined) {
    const { data } = await apiClient.get<{
      data?: { has_liked: boolean };
    }>(`/api/posts/${postId}/liked`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    shouldUnlike = data?.data?.has_liked ?? false;
  }

  if (shouldUnlike) {
    await apiClient.delete(`/api/posts/${postId}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { liked: false, record: undefined };
  } else {
    const { data } = await apiClient.post<{
      data?: PostLikeRecord;
    }>(
      `/api/posts/${postId}/like`,
      undefined,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const record = data?.data ?? undefined;
    return { liked: true, record };
  }
}

/** List likes for a post (no auth required per API). */
export async function getPostLikes(postId: string) {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const { data } = await apiClient.get<{
    data?: {
      likes: Array<{ id: string; created_at: string; user_id?: string; user?: any }>;
    };
  }>(`/api/posts/${postId}/likes`, {
    headers: Object.keys(headers).length > 0 ? headers : undefined,
  });
  return data?.data?.likes ?? [];
}


