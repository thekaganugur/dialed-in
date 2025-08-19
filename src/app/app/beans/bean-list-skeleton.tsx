import { SimpleCardSkeleton } from "@/components/ui/skeleton";

export function BeanListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <SimpleCardSkeleton key={i} />
      ))}
    </div>
  );
}