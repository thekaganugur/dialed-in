import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BeanList } from "./bean-list";
import { BeanListSkeleton } from "./bean-list-skeleton";

export const metadata: Metadata = {
  title: "Coffee Beans",
};

export default async function BeansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beans</h1>
          <p className="text-muted-foreground mt-2">
            Manage your coffee bean collection
          </p>
        </div>
        <Button asChild>
          <Link href="/app/beans/create" aria-label="Add new coffee beans">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Create Beans
          </Link>
        </Button>
      </div>

      <Suspense fallback={<BeanListSkeleton />}>
        <BeanList />
      </Suspense>
    </div>
  );
}
