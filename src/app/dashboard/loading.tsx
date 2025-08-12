import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <Skeleton className="mb-8 h-9 w-64" />

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-16" />
              <Skeleton className="h-3 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <Skeleton className="mb-2 h-5 w-40" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <span className="text-sm">•</span>
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Skeleton className="mr-2 h-5 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
