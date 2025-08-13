"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFormStatus } from "react-dom";

export function FormActions() {
  const { pending } = useFormStatus();
  const params = useParams();
  const brewId = params.brewId as string;

  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
      <Button type="submit" className="flex-1" disabled={pending}>
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {pending ? "Updating..." : "Update Brew Log"}
      </Button>
      <Button
        type="button"
        variant="outline"
        asChild
        className="sm:w-auto"
        disabled={pending}
      >
        <Link href={`/brews/${brewId}`}>Cancel</Link>
      </Button>
    </div>
  );
}