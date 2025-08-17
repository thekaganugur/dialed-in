import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateBrewLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-5 w-96" />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Essential Fields Skeleton */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Rating skeleton */}
              <div className="flex py-2">
                <Skeleton className="h-8 w-60" />
              </div>
            </div>

            {/* Collapsible section skeleton */}
            <Skeleton className="h-12 w-full rounded-lg" />

            {/* Action buttons skeleton */}
            <div className="flex justify-end gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

