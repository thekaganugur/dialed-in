import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { BrewList } from "./brew-list";
import { BrewListSkeleton } from "./brew-list-skeleton";
import { SearchBar } from "./search-bar";

export default async function BrewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brews</h1>
          <p className="text-muted-foreground mt-2">
            Track your coffee brewing journey
          </p>
        </div>
        <Button asChild>
          <Link href="/brews/new" aria-label="Create a new coffee brew log">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Brew
          </Link>
        </Button>
      </div>

      <SearchBar placeholder="Search by bean name, roaster, or notes..." />

      <Suspense fallback={<BrewListSkeleton />}>
        <BrewList />
      </Suspense>
    </div>
  );
}
