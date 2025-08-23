import { z } from "zod";

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
  GITHUB_CLIENT_ID: z.string().min(1, "GitHub Client ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GitHub Client Secret is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "Better Auth Secret is required"),
  BETTER_AUTH_URL: z.url().optional(),

  DATABASE_URL: z.url("Database URL must be a valid URL"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`,
      );
      throw new Error(
        `Environment validation failed:\n${missingVars.join("\n")}`,
      );
    }
    throw error;
  }
}

export const env = validateEnv();
