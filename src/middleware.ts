import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("better-auth.session_token");
  const isAuthenticated = !!(cookie && cookie.value);
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/app/", request.url));
  }

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/signup"],
};
