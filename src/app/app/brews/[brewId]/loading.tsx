import { Skeleton } from "@/components/ui/skeleton";

export default function BrewDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-45 w-full" />

      <div className="grid gap-4 md:gap-5 xl:grid-cols-2 xl:gap-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

