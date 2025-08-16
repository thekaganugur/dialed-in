import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

function createNeonDatabase(connectionString: string) {
  const neonClient = neon(connectionString);
  return drizzleHttp(neonClient, { schema });
}

function createLocalDatabase(connectionString: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pg = require("pg");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/node-postgres");

  const pool = new pg.Pool({ connectionString });
  return drizzle(pool, { schema });
}

const db = (
  process.env.NODE_ENV === "development"
    ? createLocalDatabase(process.env.DATABASE_URL)
    : createNeonDatabase(process.env.DATABASE_URL)
) as NeonHttpDatabase<typeof schema>;

export { db };

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
