import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { Config } from "./getConfig";

export const ACCESS_TOKEN_COOKIE = "token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

// Refresh token cookie lifetime — long-lived so sessions can be renewed.
const REFRESH_TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
// The access token JWT itself is short-lived (enforced by the backend); the
// cookie carrying it is kept for the full refresh window so client-side auth
// checks (AuthGuard, ButtonLogged) stay "logged in" for the whole session.
// An expired JWT simply triggers a transparent refresh on the next API call.
const ACCESS_TOKEN_MAX_AGE_MS = REFRESH_TOKEN_MAX_AGE_MS;

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
}

/** Remove both the access and refresh token cookies. */
export function clearTokens() {
  if (typeof document === "undefined") {
    return;
  }
  deleteCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions());
  deleteCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions());
}

export function logOut() {
  clearTokens();
}

export function RemoveToken() {
  clearTokens();
}
