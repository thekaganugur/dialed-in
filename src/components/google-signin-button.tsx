"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { toast } from "sonner";

interface GoogleSignInButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
}

const callbackURL = "/app";

export function GoogleSignInButton({
  className,
  variant = "outline",
}: GoogleSignInButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      // Use Better Auth's proper error handling pattern
      const { error } = await authClient.signIn.social(
        {
          provider: "google",
          callbackURL,
        },
        {
          onError: (ctx) => {
            // Better Auth's onError callback provides detailed error context
            let errorMessage =
              "Failed to sign in with Google. Please try again.";

            // Handle specific error cases based on Better Auth error patterns
            if (ctx.error.status === 400) {
              errorMessage = "Invalid request. Please try again.";
            } else if (ctx.error.status === 401) {
              errorMessage =
                "Authentication failed. Please check your Google account.";
            } else if (ctx.error.status === 429) {
              errorMessage =
                "Too many attempts. Please wait a moment and try again.";
            } else if (
              ctx.error.message.includes("popup_closed") ||
              ctx.error.message.includes("user_cancelled")
            ) {
              errorMessage =
                "Sign-in was cancelled. Please try again if you'd like to continue.";
            } else if (
              ctx.error.message.includes("network") ||
              ctx.error.message.includes("fetch")
            ) {
              errorMessage =
                "Network error. Please check your connection and try again.";
            }

            toast.error(errorMessage);
          },
        },
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleGoogleSignIn}
      disabled={isPending}
      className={className}
    >
      <svg
        className="mr-2 h-4 w-4"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
        />
      </svg>
      {isPending ? "Signing in..." : "Continue with Google"}
    </Button>
  );
}

