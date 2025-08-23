import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUserId } from "@/lib/auth-utils";
import { Shield, Users } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = {
  title: "Join Dialed In",
  description:
    "Join the coffee community and start dialing in your perfect brew. Track brewing parameters, rate your cups, and improve your technique.",
};

export default async function AuthPage() {
  const id = await getCurrentUserId();
  if (id) {
    redirect("/app");
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Join Dialed In
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your perfect cup is waiting. Start tracking and improving your
            brews.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground mb-4 flex items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure authentication
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Join coffee lovers
              </span>
            </div>

            <AuthForm />

            <div className="bg-muted/50 mt-6 rounded-lg p-4">
              <p className="mb-2 text-sm font-medium">What you&apos;ll get:</p>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>✓ Track your daily brews and parameters</li>
                <li>✓ Rate and improve your brewing technique</li>
                <li>✓ Discover your coffee preferences over time</li>
                <li>✓ Share your best brews with the community</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
