import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  LucideIcon,
  Scale,
  Star,
  Thermometer,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Perfect Your Coffee Brewing Journey",
};

function FeatureCard({
  icon,
  title,
  description,
  id,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  id: string;
}) {
  const Icon = icon;
  return (
    <div
      className="group relative overflow-hidden rounded-lg border p-6"
      role="article"
      aria-labelledby={id}
    >
      <div
        className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg"
        aria-hidden="true"
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 id={id} className="mt-4 text-lg font-semibold">
        {title}
      </h3>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-24 lg:gap-32">
      <main className="container flex flex-col gap-10 md:gap-20">
        <section className="flex flex-col items-center justify-center space-y-8 py-12 md:py-24 lg:py-32">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="outline" className="text-sm">
              Perfect Your Coffee Journey
            </Badge>
            <h1 className="text-3xl leading-tight font-bold tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
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
              <Link href="/auth">
                <TrendingUp className="mr-1 h-4 w-4" />
                Start Brewing Better Coffee
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-muted/50 mx-auto flex max-w-4xl flex-col gap-3 rounded-lg mask-conic-to-neutral-700 p-8 text-center">
          <h2 className="text-xl font-semibold">
            Built for Coffee Enthusiasts
          </h2>
          <p className="text-muted-foreground">
            A passion project combining modern web development with real coffee
            brewing needs. Track your journey from beginner to expert, one cup
            at a time.
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
        </section>

        <section>
          <div className="mx-auto flex flex-col items-center gap-4 text-center">
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

          <div className="mx-auto grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Thermometer}
              title="Track Brew Parameters"
              description="Log water temperature, grind size, brewing time, and ratios to find your perfect formula"
              id="track-brew-parameters"
            />

            <FeatureCard
              icon={Star}
              title="Rate & Review"
              description="Rate every cup and add tasting notes to remember what made each brew special"
              id="rate-review"
            />

            <FeatureCard
              icon={BarChart3}
              title="Discover Trends"
              description="Analyze which beans, ratios, and methods consistently produce your highest-rated cups"
              id="discover-trends"
            />

            <FeatureCard
              icon={Scale}
              title="Bean Inventory"
              description="Keep track of your coffee beans, roast dates, and origins to never lose track of favorites"
              id="bean-inventory"
            />

            <FeatureCard
              icon={Timer}
              title="Brewing Timer"
              description="Built-in timers for different brewing methods to ensure consistent extraction every time"
              id="brewing-timer"
            />

            <FeatureCard
              icon={Users}
              title="Share Discoveries"
              description="Share your best brews publicly and discover new techniques from the coffee community"
              id="share-discoveries"
            />
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex min-h-16 items-center md:min-h-24">
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
