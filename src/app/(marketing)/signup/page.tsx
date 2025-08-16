import { PasswordInput } from "@/components/password-input";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signUp } from "./actions";
import { FormActions } from "./form-actions";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col gap-12">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            aria-label="Return to Dialed In homepage"
          >
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-xl font-bold text-transparent">
              Dialed In
            </span>
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Sign Up</h1>
            <p className="text-muted-foreground mt-2">
              Join the community and start dialing in your perfect brew
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form action={signUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <PasswordInput
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    required
                    minLength={8}
                    aria-describedby="password-hint"
                  />
                  <p
                    id="password-hint"
                    className="text-muted-foreground text-xs"
                  >
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>

                <FormActions />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

