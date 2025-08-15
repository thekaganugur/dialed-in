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
import {
  Calendar,
  Coffee,
  Package,
  Plus,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
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

  const brewCountChange = todayBrewsCount - yesterdayBrewsCount;

  return (
    <main>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your coffee brewing activity and statistics
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/app/brews/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Brew
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/beans/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Bean
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Brew Count */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Today&apos;s Brews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todayBrewsCount}</p>
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
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Coffee className="h-4 w-4" />
              Favorite Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteMethod.length > 0 ? (
              <>
                <div className="mb-2">
                  <Badge
                    className={getMethodBadgeColor(favoriteMethod[0].method)}
                  >
                    {favoriteMethod[0].method.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm">{favoriteMethod[0].brewCount} brews</p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Bean Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4" />
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
                    href={`/app/brews/${log.id}`}
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
                    <StarRating rating={log.rating ?? 0} />
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
