import { Skeleton } from "@/components/ui/skeleton";

export default function BeanDetailLoadingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      <Skeleton className="h-32 w-full" />

      <div className="grid gap-4 md:gap-5 xl:grid-cols-2 xl:gap-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>

      <Skeleton className="h-64 w-full" />
    </div>
  );
}
