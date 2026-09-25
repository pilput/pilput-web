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

// Client-side getCookie is synchronous; its Promise overload is server-only.
export function getToken() {
  return getCookie(ACCESS_TOKEN_COOKIE) as string | undefined;
}

export function getRefreshToken() {
  return getCookie(REFRESH_TOKEN_COOKIE) as string | undefined;
}

/**
 * Whether an access JWT is still within its `exp`. The signature is NOT
 * checked (the backend does that) — this only tells expired tokens apart.
 */
export function isAccessTokenFresh(
  token: string | undefined,
): token is string {
  const payload = token?.split(".")[1];
  if (!payload) {
    return false;
  }
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    // No `exp` claim: let the backend decide.
    return exp === undefined || exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/**
 * The refresh token is the source of truth for "logged in": the access JWT
 * expires after 15m but is renewed transparently while a refresh token
 * exists. Without one, the session lasts only as long as the access JWT.
 * Takes raw values so the proxy can pass request cookies.
 */
export function hasSessionCookies(
  accessToken: string | undefined,
  refreshToken: string | undefined,
): boolean {
  return Boolean(refreshToken) || isAccessTokenFresh(accessToken);
}

export function hasSession(): boolean {
  return hasSessionCookies(getToken(), getRefreshToken());
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
