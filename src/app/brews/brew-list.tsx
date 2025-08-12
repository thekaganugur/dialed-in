import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchRecentBrews } from "@/lib/db/data";
import { brewMethodEnum } from "@/lib/db/schema";
import {
  formatBrewDateTime,
  formatBrewDuration,
  getMethodBadgeColor,
} from "@/lib/utils";
import { Bean, Clock, Coffee, Plus, Thermometer } from "lucide-react";
import Link from "next/link";

type BrewMethodValue = typeof brewMethodEnum.enumValues[number];

interface BrewListProps {
  searchQuery?: string;
  filterMethod?: BrewMethodValue | "all";
}

export async function BrewList({ searchQuery, filterMethod }: BrewListProps) {
  const recentBrews = await fetchRecentBrews(10, searchQuery, filterMethod);

  return (
    <>
      <div className="grid gap-4">
        {recentBrews.map((brew) => (
          <Card
            key={brew.log.id}
            className="focus-within:ring-ring transition-shadow focus-within:ring-2 focus-within:ring-offset-2 hover:shadow-md"
            tabIndex={0}
            role="article"
            aria-label={`Coffee brew: ${brew.bean.name}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Coffee className="h-5 w-5" />
                    {brew.bean.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {formatBrewDateTime(brew.log.brewedAt)} •{" "}
                    {brew.bean.roaster}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={getMethodBadgeColor(brew.log.method)}
                  >
                    {brew.log.method.replace("_", " ").toUpperCase()}
                  </Badge>
                  <StarRating rating={brew.log.rating} />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:grid-cols-4">
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
                <div className="text-sm">
                  <span className="text-muted-foreground">Notes:</span>{" "}
                  <span className="italic">{brew.log.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {recentBrews.length === 0 && (
          <Card className="p-12 text-center">
            <Coffee className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-medium">No brews yet</h3>
            <p className="text-muted-foreground mb-6">
              Start logging your coffee brewing journey
            </p>
            <Button asChild>
              <Link
                href="/brews/new"
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
