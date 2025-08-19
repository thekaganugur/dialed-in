import { Skeleton } from "@/components/ui/skeleton";
import { BrewListSkeleton } from "./brew-list-skeleton";

export default function BrewsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-9 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />

      <BrewListSkeleton />
    </div>
  );
}

