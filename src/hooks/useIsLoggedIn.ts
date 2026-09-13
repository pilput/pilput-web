"use client";

import { useSyncExternalStore } from "react";
import { getCookie } from "cookies-next";

/** The cookie never changes under us mid-render, so there is nothing to subscribe to. */
const noopSubscribe = () => () => {};

const readToken = () => Boolean(getCookie("token"));
const serverSnapshot = () => false;
const clientReady = () => true;
const serverReady = () => false;

/**
 * Hydration-safe auth flag.
 *
 * The token lives in a cookie, which is unreadable while rendering on the
 * server — reading it during render makes the server markup disagree with the
 * first client render, so the nav visibly swaps labels/buttons after hydration.
 * `useSyncExternalStore` lets React use the server snapshot through hydration
 * and re-render once with the real value, and `ready` lets callers hold a
 * neutral placeholder until that happens.
 */
export function useIsLoggedIn() {
  const ready = useSyncExternalStore(noopSubscribe, clientReady, serverReady);
  const isLoggedIn = useSyncExternalStore(
    noopSubscribe,
    readToken,
    serverSnapshot
  );

  return { isLoggedIn, ready };
}
