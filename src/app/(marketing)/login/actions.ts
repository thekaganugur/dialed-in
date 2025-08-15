"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signInFormSchema } from "./schemas";

export async function signIn(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validation = signInFormSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.issues.map((err) => err.message).join(", ");
    throw new Error(errors);
  }

  const { email, password } = validation.data;

  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (
      errorMessage.includes("Invalid credentials") ||
      errorMessage.includes("User not found")
    ) {
      throw new Error("Invalid email or password");
    }
    throw new Error(`Failed to sign in: ${errorMessage}`);
  }

  redirect("/");
}

