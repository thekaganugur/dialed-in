import { BeanDetails } from "@/components/bean-details";
import { BrewMetrics } from "@/components/brew-metrics";
import { ModeSwitcher } from "@/components/mode-switcher";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPublicBrewById } from "@/lib/db/data";
import {
  formatBrewDateTime,
  formatMethod,
  getMethodBadgeColor,
} from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

interface PublicBrewPageProps {
  params: Promise<{ brewId: string }>;
}

const getCachedPublicBrew = cache(async (brewId: string) => {
  return await fetchPublicBrewById(brewId);
});

export async function generateMetadata({ params }: PublicBrewPageProps) {
  const { brewId } = await params;
  const brew = await getCachedPublicBrew(brewId);

  if (!brew) {
    return {
      title: "Brew Not Found",
      description: "This brew is no longer available or has been made private.",
    };
  }

  const buildDescription = (brewData: {
    bean: { name: string; roaster?: string | null };
    log: { method: string; rating?: number | null };
    user: { name: string | null };
  }) =>
    [
      brewData.bean.roaster,
      brewData.bean.name,
      `brewed using ${formatMethod(brewData.log.method)} method`,
      brewData.log.rating && `(${brewData.log.rating}/5 stars)`,
      `Shared by ${brewData.user.name} on Dialed In`,
    ]
      .filter(Boolean)
      .join(" - ");

  const title = `${brew.bean.name} ${formatMethod(brew.log.method)} Recipe`;
  const description = buildDescription(brew);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || "https://dialed-in.app"}/share/brew/${brewId}`;

  return {
    title: `${title} | Dialed In`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "Dialed In",
      publishedTime: brew.log.brewedAt.toISOString(),
      authors: [brew.user.name],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PublicBrewPage({ params }: PublicBrewPageProps) {
  const { brewId } = await params;
  const brew = await getCachedPublicBrew(brewId);

  if (!brew) {
    notFound();
  }

  return (
    <div className="">
      <div className="container mx-auto px-6">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b">
          <Link
            href="/"
            className="transition-opacity hover:opacity-80"
            aria-label="Return to Dialed In homepage"
          >
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-xl font-bold text-transparent">
              Dialed In
            </span>
          </Link>
          <div className="flex gap-5">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ExternalLink className="mr-2 h-4 w-4" />
                Join Dialed In
              </Link>
            </Button>
            <ModeSwitcher />
          </div>
        </header>
      </div>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          <section className="space-y-6">
            <div className="space-y-4 text-center">
              <div className="mb-4 flex justify-center">
                <Badge
                  variant="secondary"
                  className={`text-base ${getMethodBadgeColor(brew.log.method)}`}
                >
                  {formatMethod(brew.log.method).toUpperCase()}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold">{brew.bean.name}</h1>

              {brew.bean.roaster && (
                <p className="text-muted-foreground text-xl">
                  by {brew.bean.roaster}
                </p>
              )}

              <p className="text-muted-foreground">
                Shared by {brew.user.name} •{" "}
                {formatBrewDateTime(brew.log.brewedAt)}
              </p>

              {brew.log.rating && (
                <div className="flex justify-center py-2">
                  <StarRating rating={brew.log.rating} />
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <BrewMetrics brewLog={brew.log} />
            <BeanDetails bean={brew.bean} />
          </div>

          {(brew.log.notes || brew.log.flavorNotes) && (
            <div className="grid gap-6 md:grid-cols-2">
              {brew.log.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <h2>Notes</h2>
                    </CardTitle>
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
                    <CardTitle>
                      <h2>Flavor Notes</h2>
                    </CardTitle>
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

          {/* Contextual CTA */}
          <Card className="border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 text-center dark:border-orange-800 dark:from-orange-950/50 dark:to-amber-950/50">
            <CardHeader>
              <CardTitle className="text-xl">
                Want to recreate this{" "}
                {formatMethod(brew.log.method).toLowerCase()} recipe?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mx-auto max-w-lg">
                Join Dialed In to save recipes like this one, track your brewing
                progress, and share your own coffee discoveries with the
                community.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/">Start Your Coffee Journey</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Browse More Recipes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
