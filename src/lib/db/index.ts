import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { env } from "../env";
import * as schema from "./schema";

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
  env.NODE_ENV === "development"
    ? createLocalDatabase(env.DATABASE_URL)
    : createNeonDatabase(env.DATABASE_URL)
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
