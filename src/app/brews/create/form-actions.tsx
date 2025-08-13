"use client";

import { Button } from "@/components/ui/button";
import { Coffee, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

export function FormActions() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
      <Button type="submit" className="flex-1" disabled={pending}>
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Coffee className="mr-2 h-4 w-4" />
        )}
        {pending ? "Saving..." : "Save Brew Log"}
      </Button>
      <Button
        type="button"
        variant="outline"
        asChild
        className="sm:w-auto"
        disabled={pending}
      >
        <Link href="/brews">Cancel</Link>
      </Button>
    </div>
  );
}