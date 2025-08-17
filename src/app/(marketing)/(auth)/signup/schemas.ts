import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;