import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchCurrentStreak,
  fetchFavoriteBrewingMethod,
  fetchRecentBrews,
  fetchTodayBrewCount,
  fetchWeeklyAverageRating,
} from "@/lib/db/data";
import { formatBrewDateTime, getMethodBadgeColor } from "@/lib/utils";
import { subDays } from "date-fns";
import {
  Calendar,
  Coffee,
  Flame,
  Plus,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const [
    todayBrewsCount,
    averageRating,
    favoriteMethod,
    currentStreak,
    recentBrews,
    yesterdayBrewsCount,
  ] = await Promise.all([
    fetchTodayBrewCount(),
    fetchWeeklyAverageRating(),
    fetchFavoriteBrewingMethod(1),
    fetchCurrentStreak(),
    fetchRecentBrews(),
    fetchTodayBrewCount(subDays(new Date(), 1)),
  ]);

  const brewCountChange = todayBrewsCount - yesterdayBrewsCount;

  return (
    <main>
      <div className="mb-6 space-y-4 sm:mb-8 sm:flex sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-base sm:mt-2">
            Overview of your coffee brewing activity and statistics
          </p>
        </div>
        <div className="flex gap-3 sm:gap-2">
          <Button className="flex-1 sm:flex-none" asChild>
            <Link href="/app/brews/create">
              <Plus className="mr-2 h-4 w-4" />
              <span className="sm:hidden">Brew</span>
              <span className="hidden sm:inline">Create Brew</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none" asChild>
            <Link href="/app/beans/create">
              <Plus className="mr-2 h-4 w-4" />
              <span className="sm:hidden">Bean</span>
              <span className="hidden sm:inline">Create Bean</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Brew Count */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Today&apos;s Brews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-bold sm:text-3xl">{todayBrewsCount}</p>
            {brewCountChange !== 0 && (
              <div className="flex items-center gap-1 text-sm">
                {brewCountChange > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">
                      +{brewCountChange} vs yesterday
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">
                      {brewCountChange} vs yesterday
                    </span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* This Week's Average Rating */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Star className="h-4 w-4" />
              Week Avg
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <StarRating rating={averageRating} />
              <p className="text-muted-foreground text-xs sm:text-sm">
                {averageRating.toFixed(1)} stars avg
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Brewing Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Coffee className="h-4 w-4" />
              Top Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {favoriteMethod.length > 0 ? (
              <div className="space-y-2">
                <Badge
                  className={getMethodBadgeColor(favoriteMethod[0].method)}
                >
                  {favoriteMethod[0].method.toUpperCase()}
                </Badge>
                <p className="text-muted-foreground text-sm">
                  {favoriteMethod[0].brewCount} brews
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Flame className="h-4 w-4" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-bold sm:text-3xl">{currentStreak}</p>
            <p className="text-muted-foreground text-sm">
              {currentStreak === 1 ? "day" : "days"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Brews */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent Brews</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBrews.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {recentBrews.map(({ bean, log }) => {
                return (
                  <Card
                    key={log.id}
                    className="hover:border-border/60 hover:bg-muted/25 active:bg-muted/40 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/app/brews/${log.id}`}
                            aria-label={`View brew details for ${bean?.name} by ${bean?.roaster}`}
                          >
                            <CardTitle className="truncate text-base font-medium transition-colors hover:text-blue-600">
                              {bean?.name}
                            </CardTitle>
                          </Link>
                          <p className="text-muted-foreground mt-0.5 truncate text-sm">
                            {bean?.roaster}
                          </p>
                          <div className="mt-2 sm:hidden">
                            <StarRating rating={log.rating ?? 0} />
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            {/* bg-amber-100 */}
                            <Badge className={getMethodBadgeColor(log.method)}>
                              {log.method.replace("_", " ").toUpperCase()}
                            </Badge>
                            <span className="text-muted-foreground text-sm">
                              {formatBrewDateTime(log.brewedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <StarRating rating={log.rating ?? 0} />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center sm:py-8">
              <Coffee className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">No brews yet</h3>
              <p className="text-muted-foreground mb-4">
                Start logging your coffee journey
              </p>
              <Button asChild>
                <Link href="/app/brews/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Log Your First Brew
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
