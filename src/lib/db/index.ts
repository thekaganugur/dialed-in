import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });

// Export schema types for use in components
export type {
  CoffeeBean,
  NewCoffeeBean,
  CoffeeLog,
  NewCoffeeLog,
  BrewMethod,
  User,
  NewUser,
  Session,
  NewSession,
  Account,
  NewAccount,
  Verification,
  NewVerification,
} from "./schema";
