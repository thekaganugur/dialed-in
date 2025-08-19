import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CardSkeleton, Skeleton } from "@/components/ui/skeleton";

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-8 w-16" />
        <Skeleton className="h-3 w-12" />
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <main>
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-9 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        <CardSkeleton />
      </div>
    </main>
  );
}
