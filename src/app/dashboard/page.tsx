import { coffeeBeans, coffeeLogs } from "@/lib/placeholder-data";
import { renderStars } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Calculate today's brews
const today = new Date().toISOString().split("T")[0];
const todaysBrews = coffeeLogs.filter((log) => log.brew_date === today);

// Calculate this week's average rating
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);
const thisWeeksLogs = coffeeLogs.filter(
  (log) => new Date(log.brew_date) >= weekAgo,
);
const averageRating =
  thisWeeksLogs.length > 0
    ? thisWeeksLogs.reduce((sum, log) => sum + log.rating, 0) /
      thisWeeksLogs.length
    : 0;

// Find favorite brewing method
const methodCounts = coffeeLogs.reduce(
  (counts, log) => {
    counts[log.method] = (counts[log.method] || 0) + 1;
    return counts;
  },
  {} as Record<string, number>,
);

const favoriteMethod = Object.entries(methodCounts).reduce((a, b) =>
  methodCounts[a[0]] > methodCounts[b[0]] ? a : b,
)[0];

export default function DashboardPage() {
  return (
    <main className="from-latte/20 via-foam to-latte/30 min-h-screen p-6">
      <h1 className="mb-8 text-3xl font-bold">☕ Coffee Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Brew Count */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today&apos;s Brews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todaysBrews.length}</p>
          </CardContent>
        </Card>

        {/* This Week's Average Rating */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-arabica mb-1 text-2xl font-bold">
              {renderStars(averageRating)}
            </p>
            <p className="text-sm">{averageRating.toFixed(1)}/5</p>
          </CardContent>
        </Card>

        {/* Favorite Brewing Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Favorite Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <Badge variant="secondary">{favoriteMethod}</Badge>
            </div>
            <p className="text-sm">{methodCounts[favoriteMethod]} brews</p>
          </CardContent>
        </Card>

        {/* Bean Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bean Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{coffeeBeans.length}</p>
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
            {coffeeLogs
              .slice(-5)
              .reverse()
              .map((log) => {
                const bean = coffeeBeans.find((b) => b.id === log.bean_id);
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{bean?.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline">{log.method}</Badge>
                        <span className="text-sm">•</span>
                        <span className="text-sm">{log.brew_date}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-arabica mr-2 text-lg">
                        {renderStars(log.rating)}
                      </span>
                      <span className="text-sm">{log.rating}/5</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}