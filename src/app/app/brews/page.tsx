import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import z from "zod";
import { BrewFilters } from "./brew-filters";
import { BrewList } from "./brew-list";
import { BrewListSkeleton } from "./brew-list-skeleton";
import { SearchBar } from "./search-bar";

const ParamsScheme = z.object({
  query: z.string().optional(),
});

type Props = {
  searchParams: Promise<z.infer<typeof ParamsScheme>>;
};

export default async function BrewsPage({ searchParams }: Props) {
  const { query } = ParamsScheme.parse(await searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brews</h1>
          <p className="text-muted-foreground mt-2">
            Track your coffee brewing journey
          </p>
        </div>
        <Button asChild className="sm:shrink-0">
          <Link
            href="/app/brews/create"
            aria-label="Create a new coffee brew log"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Create Brew
          </Link>
        </Button>
      </div>

      <SearchBar placeholder="Search by bean name, roaster, or notes..." />
      <BrewFilters />

      <Suspense key={query || "default"} fallback={<BrewListSkeleton />}>
        <BrewList searchQuery={query} />
      </Suspense>
    </div>
  );
}
