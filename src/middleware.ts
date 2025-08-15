import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/"],
};

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  // If user is authenticated, rewrite to dashboard
  if (session?.user) {
    const dashboardURL = new URL("/dashboard", request.url);
    return NextResponse.rewrite(dashboardURL);
  }

  // If not authenticated, let it fall through to (marketing)/page.tsx
  // No rewrite needed - the (marketing) route group handles "/" by default
  return NextResponse.next();
}
