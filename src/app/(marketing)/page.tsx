import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Scale,
  Star,
  Target,
  Thermometer,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      {/* Hero Section */}
      <main id="main-content" role="main">
        <section
          className="container flex flex-col items-center justify-center space-y-8 py-12 md:py-24 lg:py-32"
          aria-labelledby="hero-heading"
        >
          <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
            <Badge variant="outline" className="text-sm">
              Perfect Your Coffee Journey
            </Badge>

            <h1
              id="hero-heading"
              className="text-3xl leading-tight font-bold tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]"
            >
              Master Your Coffee Brewing with{" "}
              <span className="text-gradient bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Dialed In
              </span>
            </h1>

            <p className="text-muted-foreground max-w-[750px] text-lg sm:text-xl">
              Track brewing parameters, rate your cups, and discover what makes
              the perfect coffee. Join coffee enthusiasts who have improved
              their technique one brew at a time.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                <TrendingUp className="mr-1 h-4 w-4" />
                Start Brewing Better Coffee
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild>
              <Link href="/login">
                <Target className="mr-1 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          </div>
        </section>

        {/* Project Story Section */}
        <section className="container py-12">
          <div className="mx-auto max-w-4xl">
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <h2 className="mb-3 text-xl font-semibold">
                Built for Coffee Enthusiasts
              </h2>
              <p className="text-muted-foreground mb-4">
                A passion project combining modern web development with real
                coffee brewing needs. Track your journey from beginner to
                expert, one cup at a time.
              </p>
              <div className="flex justify-center gap-8 text-sm">
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Open Source
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Community Driven
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="container py-12 md:py-24 lg:py-32"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h2
              id="features-heading"
              className="text-3xl leading-tight font-bold tracking-tighter md:text-5xl"
            >
              Everything You Need to Brew Better
            </h2>
            <p className="text-muted-foreground max-w-[750px] text-lg sm:text-xl">
              Track every detail that matters, from grind size to water
              temperature, and discover your perfect cup
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
            <div
              className="group relative overflow-hidden rounded-lg border p-6"
              role="article"
              aria-labelledby="track-parameters"
            >
              <div
                className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg"
                aria-hidden="true"
              >
                <Thermometer className="h-6 w-6" />
              </div>
              <h3 id="track-parameters" className="mt-4 text-lg font-semibold">
                Track Brew Parameters
              </h3>
              <p className="text-muted-foreground mt-2">
                Log water temperature, grind size, brewing time, and ratios to
                find your perfect formula
              </p>
            </div>

            <div
              className="group relative overflow-hidden rounded-lg border p-6"
              role="article"
              aria-labelledby="rate-review"
            >
              <div
                className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg"
                aria-hidden="true"
              >
                <Star className="h-6 w-6" />
              </div>
              <h3 id="rate-review" className="mt-4 text-lg font-semibold">
                Rate & Review
              </h3>
              <p className="text-muted-foreground mt-2">
                Rate every cup and add tasting notes to remember what made each
                brew special
              </p>
            </div>

            <div
              className="group relative overflow-hidden rounded-lg border p-6"
              role="article"
              aria-labelledby="discover-trends"
            >
              <div
                className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg"
                aria-hidden="true"
              >
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 id="discover-trends" className="mt-4 text-lg font-semibold">
                Discover Trends
              </h3>
              <p className="text-muted-foreground mt-2">
                Analyze which beans, ratios, and methods consistently produce
                your highest-rated cups
              </p>
            </div>

            <div
              className="group relative overflow-hidden rounded-lg border p-6"
              role="article"
              aria-labelledby="bean-inventory"
            >
              <div
                className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg"
                aria-hidden="true"
              >
                <Scale className="h-6 w-6" />
              </div>
              <h3 id="bean-inventory" className="mt-4 text-lg font-semibold">
                Bean Inventory
              </h3>
              <p className="text-muted-foreground mt-2">
                Keep track of your coffee beans, roast dates, and origins to
                never lose track of favorites
              </p>
            </div>

            <div
              className="group relative overflow-hidden rounded-lg border p-6"
              role="article"
              aria-labelledby="brewing-timer"
            >
              <div
                className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg"
                aria-hidden="true"
              >
                <Timer className="h-6 w-6" />
              </div>
              <h3 id="brewing-timer" className="mt-4 text-lg font-semibold">
                Brewing Timer
              </h3>
              <p className="text-muted-foreground mt-2">
                Built-in timers for different brewing methods to ensure
                consistent extraction every time
              </p>
            </div>

            <div
              className="group relative overflow-hidden rounded-lg border p-6"
              role="article"
              aria-labelledby="share-discoveries"
            >
              <div
                className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg"
                aria-hidden="true"
              >
                <Users className="h-6 w-6" />
              </div>
              <h3 id="share-discoveries" className="mt-4 text-lg font-semibold">
                Share Discoveries
              </h3>
              <p className="text-muted-foreground mt-2">
                Share your best brews publicly and discover new techniques from
                the coffee community
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/thekaganugur"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Kagan
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/thekaganugur/dialed-in"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
