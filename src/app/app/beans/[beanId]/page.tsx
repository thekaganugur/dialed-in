import { BeanDetails } from "@/components/bean-details";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchBeanById,
  fetchBeanStats,
  fetchBrewsByBeanId,
} from "@/lib/db/data";
import { formatBrewDateTime, formatMethodDisplay, formatRoastLevel, getMethodBadgeColor } from "@/lib/utils";
import { Bean, Calendar, Coffee, Edit } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteBeanWithId } from "./actions";
import { DeleteBeanButton } from "./delete-bean-button";

export const metadata: Metadata = {
  title: "Bean Details",
};

interface BeanDetailPageProps {
  params: Promise<{ beanId: string }>;
}

export default async function BeanDetailPage({ params }: BeanDetailPageProps) {
  const { beanId } = await params;
  const [bean, brews, stats] = await Promise.all([
    fetchBeanById(beanId),
    fetchBrewsByBeanId(beanId, 10),
    fetchBeanStats(beanId),
  ]);

  if (!bean) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/app/beans/${beanId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeleteBeanButton
            beanId={beanId}
            beanName={bean.name}
            brewCount={stats.totalBrews}
            deleteAction={deleteBeanWithId}
          />
        </div>
      </div>

      {/* Bean Header */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <Bean className="h-5 w-5 sm:h-6 sm:w-6" />
                  {bean.name}
                </CardTitle>
                {bean.roaster && (
                  <div className="text-muted-foreground text-base sm:text-lg">
                    by {bean.roaster}
                  </div>
                )}
                {bean.roastDate && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Roasted: {new Date(bean.roastDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {bean.roastLevel && (
                  <Badge variant="secondary" className="capitalize">
                    {formatRoastLevel(bean.roastLevel)}
                  </Badge>
                )}
                {bean.process && (
                  <Badge variant="outline" className="capitalize">
                    {bean.process}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        {bean.notes && (
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-medium">Notes</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {bean.notes}
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Stats and Bean Details Grid */}
      <div className="grid gap-4 md:gap-5 xl:grid-cols-2 xl:gap-6">
        {/* Bean Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                <span className="text-muted-foreground font-medium">
                  Total Brews
                </span>
                <span className="font-semibold">{stats.totalBrews}</span>
              </div>
              {stats.averageRating && (
                <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                  <span className="text-muted-foreground font-medium">
                    Avg Rating
                  </span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <StarRating rating={Math.round(stats.averageRating)} />
                    <span className="text-muted-foreground text-xs">
                      ({stats.averageRating.toFixed(1)})
                    </span>
                  </div>
                </div>
              )}
              {stats.firstBrewedAt && (
                <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                  <span className="text-muted-foreground font-medium">
                    First Brew
                  </span>
                  <span className="font-semibold">
                    {formatBrewDateTime(stats.firstBrewedAt)}
                  </span>
                </div>
              )}
              {stats.lastBrewedAt && (
                <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                  <span className="text-muted-foreground font-medium">
                    Last Brew
                  </span>
                  <span className="font-semibold">
                    {formatBrewDateTime(stats.lastBrewedAt)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bean Details */}
        <BeanDetails bean={bean} />
      </div>

      {/* Recent Brews */}
      {brews.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Brews</CardTitle>
            {stats.totalBrews > 10 && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/app/brews?bean=${beanId}`}>
                  View All ({stats.totalBrews})
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {brews.map(({ log }) => (
                <div
                  key={log.id}
                  className="hover:bg-muted/50 rounded-lg border p-4 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={`text-xs font-medium ${getMethodBadgeColor(log.method)}`}
                        >
                          {formatMethodDisplay(log.method)}
                        </Badge>
                        <span className="text-muted-foreground text-sm">
                          {formatBrewDateTime(log.brewedAt)}
                        </span>
                      </div>
                      {log.rating && (
                        <div className="flex items-center gap-2">
                          <StarRating rating={log.rating} />
                          <span className="text-muted-foreground text-xs">
                            ({log.rating}/5)
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="shrink-0"
                    >
                      <Link href={`/app/brews/${log.id}`}>View Details</Link>
                    </Button>
                  </div>
                  {log.notes && (
                    <p className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-relaxed">
                      {log.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
