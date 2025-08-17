"use client";

import { Button } from "@/components/ui/button";
import { LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

export function FormActions() {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-4">
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-4 w-4" />
        )}
        {pending ? "Signing In..." : "Sign In"}
      </Button>
      
      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link 
          href="/signup" 
          className="text-primary hover:underline font-medium"
        >
          Sign up here
        </Link>
      </div>
    </div>
  );
}