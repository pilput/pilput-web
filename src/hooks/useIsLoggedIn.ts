"use client";

import { useSyncExternalStore } from "react";
import { hasSession, subscribeAuth } from "@/utils/Auth";

/**
 * Re-check on token writes (login, refresh, logout) and when the tab regains
 * focus — another tab may have logged in or out, and cookies emit no events.
 */
const subscribe = (onChange: () => void) => {
  const unsubscribe = subscribeAuth(onChange);
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    unsubscribe();
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
};

/** The ready flag never changes after hydration. */
const noopSubscribe = () => () => {};

const serverSnapshot = () => false;
const clientReady = () => true;
const serverReady = () => false;

/**
 * Hydration-safe auth flag.
 *
 * "Logged in" means a refresh token exists, or the access JWT is still
 * unexpired — see `hasSession()`. An expired access JWT alone is not enough,
 * and a missing access JWT with a live refresh token still counts.
 *
 * The tokens live in cookies, which are unreadable while rendering on the
 * server — reading them during render makes the server markup disagree with the
 * first client render, so the nav visibly swaps labels/buttons after hydration.
 * `useSyncExternalStore` lets React use the server snapshot through hydration
 * and re-render once with the real value, and `ready` lets callers hold a
 * neutral placeholder until that happens.
 */
export function useIsLoggedIn() {
  const ready = useSyncExternalStore(noopSubscribe, clientReady, serverReady);
  const isLoggedIn = useSyncExternalStore(subscribe, hasSession, serverSnapshot);

  return { isLoggedIn, ready };
}
