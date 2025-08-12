import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchBeanCount,
  fetchFavoriteBrewingMethod,
  fetchRecentBrews,
  fetchTodayBrewCount,
  fetchWeeklyAverageRating,
} from "@/lib/db/data";
import { formatBrewDateTime, getMethodBadgeColor } from "@/lib/utils";

export default async function DashboardPage() {
  const [
    todayBrewsCount,
    averageRating,
    favoriteMethod,
    beancount,
    recentBrews,
  ] = await Promise.all([
    fetchTodayBrewCount(),
    fetchWeeklyAverageRating(),
    fetchFavoriteBrewingMethod(1),
    fetchBeanCount(),
    fetchRecentBrews(),
  ]);

  return (
    <main>
      <h1 className="mb-8 text-3xl font-bold">☕ Coffee Dashboard</h1>

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
            <div className="mb-2">
              <Badge className={getMethodBadgeColor(favoriteMethod[0].method)}>
                {favoriteMethod[0].method.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm">{favoriteMethod[0].brewCount} brews</p>
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
          <div className="space-y-4">
            {recentBrews.map(({ bean, log }) => {
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors"
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
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
