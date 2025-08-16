export default function MarketinLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="container mx-auto">
      <main className="p-6">{children}</main>
    </div>
  );
}
