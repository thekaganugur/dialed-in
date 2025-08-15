import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/"],
};

export async function middleware(request: NextRequest) {
  // Check for session cookie to determine if user is authenticated
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // If user has session cookie, rewrite to dashboard
  if (sessionCookie?.value) {
    const dashboardURL = new URL("/dashboard", request.url);
    return NextResponse.rewrite(dashboardURL);
  }

  // If not authenticated, let it fall through to (marketing)/page.tsx
  return NextResponse.next();
}