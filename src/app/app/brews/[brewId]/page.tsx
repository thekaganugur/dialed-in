import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBrewById } from "@/lib/db/data";
import {
  calculateBrewRatio,
  formatBrewDateTime,
  formatBrewDuration,
  getMethodBadgeColor,
} from "@/lib/utils";
import {
  Bean,
  Calendar,
  Coffee,
  Edit,
  MapPin,
  RotateCcw,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteBrewWithId } from "./actions";
import { DeleteBrewButton } from "./delete-brew-button";
import { ShareBrewButton } from "./share-brew-button";

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
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <ShareBrewButton brewId={brewId} isPublic={brew.log.isPublic} />

          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/30"
          >
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
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Coffee className="h-6 w-6" />
                  {brew.bean.name}
                </CardTitle>
                <div className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatBrewDateTime(brew.log.brewedAt)}
                </div>
                {brew.bean.roaster && (
                  <div className="text-muted-foreground text-lg">
                    by {brew.bean.roaster}
                  </div>
                )}
              </div>
              <Badge
                variant="secondary"
                className={`text-base ${getMethodBadgeColor(brew.log.method)}`}
              >
                {brew.log.method.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            {brew.log.rating && (
              <div className="flex items-center justify-center py-2">
                {/* TODO: Make it bigger */}
                <StarRating rating={brew.log.rating} />
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {(brew.log.doseGrams ||
                brew.log.yieldGrams ||
                calculateBrewRatio(
                  brew.log.doseGrams,
                  brew.log.yieldGrams,
                )) && (
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                    Core Measurements
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {brew.log.doseGrams && (
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {brew.log.doseGrams}g
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Dose
                        </div>
                      </div>
                    )}
                    {brew.log.yieldGrams && (
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {brew.log.yieldGrams}g
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Yield
                        </div>
                      </div>
                    )}
                    {calculateBrewRatio(
                      brew.log.doseGrams,
                      brew.log.yieldGrams,
                    ) && (
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {calculateBrewRatio(
                            brew.log.doseGrams,
                            brew.log.yieldGrams,
                          )}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Ratio
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {(brew.log.brewTimeSeconds ||
                brew.log.waterTempCelsius ||
                brew.log.grindSetting) && (
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                    Brewing Parameters
                  </h4>
                  <div className="grid gap-3">
                    {brew.log.brewTimeSeconds && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Brew Time:
                        </span>
                        <span className="text-lg font-semibold">
                          {formatBrewDuration(brew.log.brewTimeSeconds)}
                        </span>
                      </div>
                    )}
                    {brew.log.waterTempCelsius && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Water Temp:
                        </span>
                        <span className="text-lg font-semibold">
                          {brew.log.waterTempCelsius}°C
                        </span>
                      </div>
                    )}
                    {brew.log.grindSetting && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Grind:</span>
                        <span className="text-lg font-semibold">
                          {brew.log.grindSetting}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bean Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bean className="h-5 w-5" />
              Bean Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {brew.bean.origin && (
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">Origin:</span>
                  <span>{brew.bean.origin}</span>
                </div>
              )}
              {brew.bean.roastLevel && (
                <div className="flex items-center gap-2">
                  <Coffee className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">Roast Level:</span>
                  <span className="capitalize">
                    {brew.bean.roastLevel.replace("-", " ")}
                  </span>
                </div>
              )}
              {brew.bean.process && (
                <div className="flex items-center gap-2">
                  <Settings className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">Process:</span>
                  <span className="capitalize">{brew.bean.process}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes and Flavor Notes */}
      {(brew.log.notes || brew.log.flavorNotes) && (
        <div className="grid gap-6 md:grid-cols-2">
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
