import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;