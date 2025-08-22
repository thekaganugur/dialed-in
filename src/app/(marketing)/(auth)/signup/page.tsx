import { GoogleSignInButton } from "@/components/google-signin-button";
import { PasswordInput } from "@/components/password-input";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Metadata } from "next";
import { signUp } from "./actions";
import { FormActions } from "./form-actions";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Join the coffee community and start dialing in your perfect brew. Track brewing parameters, rate your cups, and improve your technique.",
};

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Sign Up</h1>
          <p className="text-muted-foreground mt-2">
            Join the community and start dialing in your perfect brew
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <GoogleSignInButton className="w-full" />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>
            <form action={signUp} className="space-y-6 mt-6">
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
                <p id="password-hint" className="text-muted-foreground text-xs">
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
  );
}
