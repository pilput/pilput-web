import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { Config } from "./getConfig";

export const ACCESS_TOKEN_COOKIE = "token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

// Mirrors the backend's REFRESH_TOKEN_EXPIRY (default 72h). That window is
// *sliding*: the server moves its deadline forward on every rotation, and
// because setTokens() runs on each one, these cookies slide with it. Keep this
// in step with the backend — a cookie that outlives the session leaves the UI
// claiming the user is logged in until the first API call proves otherwise.
const REFRESH_TOKEN_MAX_AGE_MS = 72 * 60 * 60 * 1000; // 72 hours
// The access JWT itself is valid 15m (enforced by the backend). Its cookie is
// deliberately kept for the ENTIRE refresh window so client-side auth checks
// (AuthGuard, ButtonLogged) stay "logged in"; an expired JWT triggers a
// transparent refresh on the next API call, keeping the session alive.
const ACCESS_TOKEN_MAX_AGE_MS = REFRESH_TOKEN_MAX_AGE_MS;
// Not mirrored here: the backend also caps a login at REFRESH_TOKEN_ABSOLUTE_EXPIRY
// (default 30d) regardless of activity. A sliding cookie cannot express that,
// so a very long-lived session ends with a 401 rather than a vanished cookie.

function cookieOptions(expiresInMs: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + expiresInMs);
  return {
    expires,
    path: "/",
    domain: `.${Config.maindomain}`,
    sameSite: "none" as const,
    secure: true,
  };
}

function clearCookieOptions() {
  return {
    path: "/",
    domain: `.${Config.maindomain}`,
    sameSite: "none" as const,
    secure: true,
  };
}

export function getToken() {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken() {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

/**
 * Whether an access JWT is still within its `exp`. The signature is NOT
 * checked (the backend does that) — this only tells expired tokens apart.
 * Works in both the browser and the edge runtime (proxy).
 */
export function isAccessTokenFresh(token: string | undefined | null): boolean {
  if (!token) {
    return false;
  }
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return false;
    }
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const { exp } = JSON.parse(atob(padded)) as { exp?: number };
    // No `exp` claim: let the backend decide.
    return typeof exp !== "number" || exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/**
 * Session check from raw cookie values. The refresh token is the source of
 * truth for "logged in": the access JWT expires after 15m but is renewed
 * transparently as long as a refresh token exists. Without a refresh token
 * the session only lasts while the access JWT itself is unexpired.
 */
export function hasSessionCookies(
  accessToken: string | undefined | null,
  refreshToken: string | undefined | null,
): boolean {
  return Boolean(refreshToken) || isAccessTokenFresh(accessToken);
}

/** Client-side "is the user logged in" check (access OR refresh token). */
export function hasSession(): boolean {
  // Client-side getCookie is synchronous; the Promise form is server-only.
  return hasSessionCookies(
    getToken() as string | undefined,
    getRefreshToken() as string | undefined,
  );
}

// Cookies emit no change events, so token writes notify subscribers directly
// (e.g. useIsLoggedIn re-renders when a failed refresh clears the session).
const authListeners = new Set<() => void>();

export function subscribeAuth(listener: () => void) {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}

function notifyAuthChange() {
  authListeners.forEach((listener) => listener());
}

/**
 * Persist the access token (and, when provided, the rotated refresh token)
 * returned by login / OAuth exchange / refresh endpoints.
 */
export function setTokens(accessToken: string, refreshToken?: string) {
  setCookie(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    cookieOptions(ACCESS_TOKEN_MAX_AGE_MS),
  );
  if (refreshToken) {
    setCookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      cookieOptions(REFRESH_TOKEN_MAX_AGE_MS),
    );
  }
  notifyAuthChange();
}

/** Remove both the access and refresh token cookies. */
export function clearTokens() {
  if (typeof document === "undefined") {
    return;
  }
  deleteCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions());
  deleteCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions());
  notifyAuthChange();
}

export function logOut() {
  clearTokens();
}

export function RemoveToken() {
  clearTokens();
}
