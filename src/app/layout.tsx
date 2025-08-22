import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { inter } from "./ui/fonts";

export const metadata: Metadata = {
  title: { template: "%s | Dialed In", default: "Dialed In" },
  description:
    "Track brewing parameters, rate your cups, and discover what makes the perfect coffee. Join coffee enthusiasts who've improved their technique one brew at a time.",
  authors: [{ name: "Kagan", url: "https://github.com/thekaganugur" }],
  alternates: {
    canonical: "https://dialed-in.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background flex min-h-screen flex-col font-sans antialiased",
          inter.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
