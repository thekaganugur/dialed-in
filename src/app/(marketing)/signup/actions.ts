"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signUpFormSchema } from "./schemas";

export async function signUp(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validation = signUpFormSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.issues.map((err) => err.message).join(", ");
    throw new Error(errors);
  }

  const { name, email, password } = validation.data;

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (errorMessage.includes("User already exists")) {
      throw new Error("An account with this email already exists");
    }
    throw new Error(`Failed to create account: ${errorMessage}`);
  }

  redirect("/app");
}

