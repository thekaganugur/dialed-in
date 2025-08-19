import { PasswordInput } from "@/components/password-input";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "./actions";
import { FormActions } from "./form-actions";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Ready to dial in your perfect cup?
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form action={signIn} className="space-y-6">
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
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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
