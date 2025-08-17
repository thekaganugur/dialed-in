import Link from "next/link";

export default function MarketinLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col gap-12">
      <div className="container mx-auto px-6">
        <header className="flex min-h-16 items-center border-b">
          <Link
            href="/"
            className="transition-opacity hover:opacity-80"
            aria-label="Return to Dialed In homepage"
          >
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-xl font-bold text-transparent">
              Dialed In
            </span>
          </Link>
        </header>
      </div>
      <main className="p-6">{children}</main>
    </div>
  );
}
