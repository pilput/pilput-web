import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = ["/chat", "/dashboard"];
const noIndexRoutes = [
  "/login",
  "/register",
  "/account",
  "/profile",
  "/chat",
  "/dashboard",
];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get the token from cookies
    const token = request.cookies.get("token");

    // If no token is present, redirect to login with current URL for redirect after login
    if (!token) {
      const currentUrl = pathname + request.nextUrl.search;
      const redirectParam = encodeURIComponent(currentUrl);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set('redirect', redirectParam);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  if (noIndexRoutes.some((route) => matchesRoute(pathname, route))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  // Allow the request to proceed
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
