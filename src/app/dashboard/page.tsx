import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchBeanCount,
  fetchFavoriteBrewingMethod,
  fetchRecentBrews,
  fetchTodayBrewCount,
  fetchWeeklyAverageRating,
} from "@/lib/db/data";
import { formatBrewDateTime, getMethodBadgeColor } from "@/lib/utils";
import { subDays } from "date-fns";
import { Coffee, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [
    todayBrewsCount,
    averageRating,
    favoriteMethod,
    beancount,
    recentBrews,
    yesterdayBrewsCount,
  ] = await Promise.all([
    fetchTodayBrewCount(),
    fetchWeeklyAverageRating(),
    fetchFavoriteBrewingMethod(1),
    fetchBeanCount(),
    fetchRecentBrews(),
    fetchTodayBrewCount(subDays(new Date(), 1)),
  ]);

  return (
    <main>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">☕ Coffee Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/brews/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Brew
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/beans/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Bean
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Brew Count */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Today&apos;s Brews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todayBrewsCount}</p>
            {todayBrewsCount !== yesterdayBrewsCount && (
              <p className="text-muted-foreground text-sm">
                {todayBrewsCount > yesterdayBrewsCount ? "+" : ""}
                {todayBrewsCount - yesterdayBrewsCount} vs yesterday
              </p>
            )}
          </CardContent>
        </Card>

        {/* This Week's Average Rating */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Weekly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StarRating rating={averageRating} />
          </CardContent>
        </Card>

        {/* Favorite Brewing Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Favorite Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteMethod.length > 0 ? (
              <>
                <div className="mb-2">
                  <Badge className={getMethodBadgeColor(favoriteMethod[0].method)}>
                    {favoriteMethod[0].method.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm">{favoriteMethod[0].brewCount} brews</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Bean Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Bean Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{beancount}</p>
            <p className="text-sm">varieties</p>
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
            <div className="space-y-4">
              {recentBrews.map(({ bean, log }) => {
                return (
                  <Link
                    key={log.id}
                    href={`/brews/${log.id}`}
                    className="hover:bg-muted/50 hover:border-primary/20 flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{bean?.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className={getMethodBadgeColor(log.method)}>
                          {log.method.toUpperCase()}
                        </Badge>
                        <span className="text-sm">•</span>
                        <span className="text-sm">
                          {formatBrewDateTime(log.brewedAt)}
                        </span>
                      </div>
                    </div>
                    <StarRating rating={log.rating} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Coffee className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">No brews yet</h3>
              <p className="text-muted-foreground mb-4">
                Start logging your coffee journey
              </p>
              <Button asChild>
                <Link href="/brews/new">
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
