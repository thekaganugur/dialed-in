import { BeanDetails } from "@/components/bean-details";
import { BrewMetrics } from "@/components/brew-metrics";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBrewById } from "@/lib/db/data";
import { formatBrewDateTime, getMethodBadgeColor } from "@/lib/utils";
import { Calendar, Coffee, Edit, RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteBrewWithId } from "./actions";
import { DeleteBrewButton } from "./delete-brew-button";
import { ShareBrewButton } from "./share-brew-button";

export const metadata: Metadata = {
  title: "Brew Details",
};

interface BrewDetailPageProps {
  params: Promise<{ brewId: string }>;
}

export default async function BrewDetailPage({ params }: BrewDetailPageProps) {
  const { brewId } = await params;
  const brew = await fetchBrewById(brewId);

  if (!brew) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
          <ShareBrewButton brewId={brewId} isPublic={brew.log.isPublic} />
          <Button variant="outline" size="sm" asChild>
            <Link href={`/app/brews/create?duplicate=${brewId}`}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Duplicate
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/app/brews/${brewId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeleteBrewButton brewId={brewId} deleteAction={deleteBrewWithId} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <Coffee className="h-5 w-5 sm:h-6 sm:w-6" />
                  {brew.bean.name}
                </CardTitle>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {formatBrewDateTime(brew.log.brewedAt)}
                </div>
                {brew.bean.roaster && (
                  <div className="text-muted-foreground text-base sm:text-lg">
                    by {brew.bean.roaster}
                  </div>
                )}
              </div>
              <Badge
                variant="secondary"
                className={`text-sm sm:text-base ${getMethodBadgeColor(brew.log.method)}`}
              >
                {brew.log.method.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            {brew.log.rating && (
              <div className="flex items-center justify-center py-4">
                <div className="scale-125 sm:scale-150">
                  <StarRating rating={brew.log.rating} />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:gap-5 xl:grid-cols-2 xl:gap-6">
        <BrewMetrics brewLog={brew.log} />
        <BeanDetails bean={brew.bean} />
      </div>

      {/* Notes and Flavor Notes */}
      {(brew.log.notes || brew.log.flavorNotes) && (
        <div className="grid gap-4 md:gap-5 xl:grid-cols-2 xl:gap-6">
          {brew.log.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {brew.log.notes}
                </p>
              </CardContent>
            </Card>
          )}
          {brew.log.flavorNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Flavor Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {brew.log.flavorNotes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
