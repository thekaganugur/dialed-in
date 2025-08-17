import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrewMethodValue, fetchRecentBrews } from "@/lib/db/data";
import {
  formatBrewDateTime,
  formatBrewDuration,
  getMethodBadgeColor,
} from "@/lib/utils";
import { Bean, Clock, Coffee, Plus, Thermometer } from "lucide-react";
import Link from "next/link";

interface BrewListProps {
  searchQuery?: string;
  filterMethod?: BrewMethodValue | "all";
}

export async function BrewList({ searchQuery, filterMethod }: BrewListProps) {
  const recentBrews = await fetchRecentBrews(10, searchQuery, filterMethod);

  return (
    <>
      <div className="grid gap-4 sm:gap-6">
        {recentBrews.map((brew) => (
          <Card
            key={brew.log.id}
            className="hover:border-border/60 hover:bg-muted/25 active:bg-muted/40 transition-colors"
          >
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-start justify-between gap-4 sm:items-center">
                <div className="flex-1">
                  <Link href={`/app/brews/${brew.log.id}`}>
                    <CardTitle className="truncate text-base font-medium transition-colors hover:text-blue-600">
                      {brew.bean.name}
                    </CardTitle>
                  </Link>
                  {/* <p className="text-muted-foreground mt-0.5 truncate text-sm"> */}
                  {/*   {brew.bean?.roaster} */}
                  {/* </p> */}
                  <div className="mt-1 sm:hidden">
                    <StarRating rating={brew.log.rating ?? 0} />
                  </div>
                  <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    {/* bg-amber-100  */}
                    <Badge className={getMethodBadgeColor(brew.log.method)}>
                      {brew.log.method.replace("_", " ").toUpperCase()}
                    </Badge>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        {formatBrewDateTime(brew.log.brewedAt)}
                      </span>
                      <span className="text-muted-foreground truncate text-xs sm:text-sm">
                        {brew.bean.roaster}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <StarRating rating={brew.log.rating ?? 0} />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4 md:gap-4">
                <div className="flex items-center gap-2">
                  <Bean
                    className="text-muted-foreground h-4 w-4"
                    aria-hidden="true"
                  />
                  <span
                    aria-label={`Dose: ${brew.log.doseGrams ? `${brew.log.doseGrams} grams` : "not specified"}`}
                  >
                    {brew.log.doseGrams ? `${brew.log.doseGrams}g` : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee
                    className="text-muted-foreground h-4 w-4"
                    aria-hidden="true"
                  />
                  <span
                    aria-label={`Yield: ${brew.log.yieldGrams ? `${brew.log.yieldGrams} grams` : "not specified"}`}
                  >
                    {brew.log.yieldGrams ? `${brew.log.yieldGrams}g` : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock
                    className="text-muted-foreground h-4 w-4"
                    aria-hidden="true"
                  />
                  <span
                    aria-label={`Brew time: ${brew.log.brewTimeSeconds ? `${Math.floor(brew.log.brewTimeSeconds / 60)} minutes ${brew.log.brewTimeSeconds % 60} seconds` : "not specified"}`}
                  >
                    {formatBrewDuration(brew.log.brewTimeSeconds)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer
                    className="text-muted-foreground h-4 w-4"
                    aria-hidden="true"
                  />
                  <span
                    aria-label={`Water temperature: ${brew.log.waterTempCelsius ? `${brew.log.waterTempCelsius} degrees Celsius` : "not specified"}`}
                  >
                    {brew.log.waterTempCelsius
                      ? `${brew.log.waterTempCelsius}°C`
                      : "—"}
                  </span>
                </div>
              </div>

              {brew.log.grindSetting && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Grind:</span>{" "}
                  {brew.log.grindSetting}
                </div>
              )}

              {brew.log.notes && (
                <div className="text-xs sm:text-sm">
                  <span className="text-muted-foreground">Notes:</span>{" "}
                  <span className="line-clamp-2 break-words italic">
                    {brew.log.notes}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {recentBrews.length === 0 && (
          <Card className="p-6 text-center sm:p-12">
            <Coffee className="text-muted-foreground mx-auto mb-4 h-8 w-8 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-base font-medium sm:text-lg">
              No brews yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start logging your coffee brewing journey
            </p>
            <Button asChild>
              <Link
                href="/app/brews/create"
                aria-label="Create your first coffee brew log"
              >
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Log Your First Brew
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </>
  );
}
