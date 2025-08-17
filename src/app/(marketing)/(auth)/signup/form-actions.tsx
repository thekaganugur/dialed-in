"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
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
          <UserPlus className="mr-2 h-4 w-4" />
        )}
        {pending ? "Creating Account..." : "Sign Up"}
      </Button>
      
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="text-primary hover:underline font-medium"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
}