import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Authentication utility functions to ensure secure access patterns
 * These functions prevent data leakage by enforcing user context
 */

/**
 * Get authenticated user session or throw error
 * Use this for Server Actions and API routes that require authentication
 */
export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  return session;
}

/**
 * Get authenticated user session or redirect to login
 * Use this for page components that require authentication
 */
export async function requireAuthOrRedirect() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

/**
 * Get current user ID safely
 * Returns null if not authenticated - use for optional auth scenarios
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.id || null;
  } catch {
    return null;
  }
}

/**
 * Verify user owns a resource by comparing user IDs
 * Throws error if not authorized
 */
export function verifyOwnership(resourceUserId: string, currentUserId: string) {
  if (resourceUserId !== currentUserId) {
    throw new Error("Unauthorized: You can only access your own data");
  }
}