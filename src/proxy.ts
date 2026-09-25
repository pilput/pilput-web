import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  hasSessionCookies,
} from "@/utils/Auth";

/**
 * Sends logged-in visitors to the feed while keeping "/" as the visible URL,
 * so the homepage itself can stay a fully static guest landing page (good
 * for caching, TTFB, and what crawlers see) instead of opting the whole
 * route into per-request dynamic rendering just to branch on a cookie.
 */
export function proxy(request: NextRequest) {
  const loggedIn = hasSessionCookies(
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value,
    request.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
  );

  if (loggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/feed-home";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
