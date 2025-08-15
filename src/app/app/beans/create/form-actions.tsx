"use client";

import { Button } from "@/components/ui/button";
import { Coffee, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

export function FormActions() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="outline"
        asChild
        className="sm:w-auto"
        disabled={pending}
      >
        <Link href="/app/beans" aria-label="Cancel bean creation and return to beans list">
          Cancel
        </Link>
      </Button>
      <Button type="submit" className="flex-1 sm:flex-initial" disabled={pending}>
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Coffee className="mr-2 h-4 w-4" />
        )}
        {pending ? "Saving..." : "Save Coffee Bean"}
      </Button>
    </div>
  );
}