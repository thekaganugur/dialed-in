import { FormSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function EditBeanLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <FormSkeleton />
    </div>
  );
}