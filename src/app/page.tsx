import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Github, TrendingUp, BarChart3, Clock, Star, Database, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center space-y-8 py-12 md:py-24 lg:py-32">
        <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="text-sm">
            Open Source Coffee Tracking
          </Badge>
          
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            An example app built using{" "}
            <span className="text-gradient bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Next.js 15
            </span>{" "}
            server components
          </h1>
          
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Track your coffee brewing journey with BrewLog. Built with modern React patterns,
            server components, and a focus on performance. Includes authentication, database,
            and a beautiful UI.
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <Coffee className="mr-2 h-4 w-4" />
              Get Started
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/kgnugur/dialed-in" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
            Features
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            This project showcases modern web development practices and Next.js capabilities
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Database</h3>
            <p className="mt-2 text-muted-foreground">
              Powered by Neon PostgreSQL with Drizzle ORM for type-safe database operations
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Performance</h3>
            <p className="mt-2 text-muted-foreground">
              Built with Next.js 15 server components and streaming for optimal performance
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Analytics</h3>
            <p className="mt-2 text-muted-foreground">
              Track brewing statistics, ratings, and improve your coffee technique over time
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Modern UI</h3>
            <p className="mt-2 text-muted-foreground">
              Beautiful interface built with Tailwind CSS and shadcn/ui components
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Real-time</h3>
            <p className="mt-2 text-muted-foreground">
              Server components with streaming and suspense for instant loading states
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">TypeScript</h3>
            <p className="mt-2 text-muted-foreground">
              Fully typed with strict TypeScript for better developer experience and reliability
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/kgnugur"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              kgnugur
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/kgnugur/dialed-in"
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
