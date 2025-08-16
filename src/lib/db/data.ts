import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { brewMethodEnum, coffeeBeans, coffeeLogs, user } from "@/lib/db/schema";
import { endOfDay, startOfDay, subDays } from "date-fns";
import {
  and,
  avg,
  count,
  desc,
  eq,
  gte,
  ilike,
  isNull,
  lt,
  or,
} from "drizzle-orm";
import { z } from "zod";

export type BrewMethodValue = (typeof brewMethodEnum.enumValues)[number];

// Get today's brew count for the authenticated user
export async function fetchTodayBrewCount(date = new Date()): Promise<number> {
  const session = await requireAuth();
  const todayStart = startOfDay(date);
  const todayEnd = endOfDay(date);

  const result = await db
    .select({ count: count() })
    .from(coffeeLogs)
    .where(
      and(
        eq(coffeeLogs.userId, session.user.id),
        gte(coffeeLogs.brewedAt, todayStart),
        lt(coffeeLogs.brewedAt, todayEnd),
        isNull(coffeeLogs.deletedAt),
      ),
    );

  return result[0]?.count || 0;
}

// Calculate weekly average rating for the authenticated user
export async function fetchWeeklyAverageRating(): Promise<number> {
  const session = await requireAuth();
  const weekAgo = subDays(new Date(), 7);

  const result = await db
    .select({ avgRating: avg(coffeeLogs.rating) })
    .from(coffeeLogs)
    .where(
      and(
        eq(coffeeLogs.userId, session.user.id),
        gte(coffeeLogs.brewedAt, weekAgo),
        isNull(coffeeLogs.deletedAt),
      ),
    );

  return Number(result[0]?.avgRating) || 0;
}

export async function fetchFavoriteBrewingMethod(limit: number = 5) {
  const session = await requireAuth();

  return await db
    .select({
      method: coffeeLogs.method,
      brewCount: count(coffeeLogs.id),
    })
    .from(coffeeLogs)
    .where(
      and(eq(coffeeLogs.userId, session.user.id), isNull(coffeeLogs.deletedAt)),
    )
    .groupBy(coffeeLogs.method)
    .orderBy(desc(count(coffeeLogs.id)))
    .limit(limit);
}

// Get total bean count for the authenticated user's inventory
export async function fetchBeanCount(): Promise<number> {
  const session = await requireAuth();

  const result = await db
    .select({ count: count() })
    .from(coffeeBeans)
    .where(eq(coffeeBeans.userId, session.user.id));

  return result[0]?.count || 0;
}

// Get top beans with brew count for the authenticated user
export async function fetchTopBeans(limit: number = 5) {
  const session = await requireAuth();

  return await db
    .select({
      bean: coffeeBeans,
      brewCount: count(coffeeLogs.id),
    })
    .from(coffeeBeans)
    .leftJoin(
      coffeeLogs,
      and(
        eq(coffeeLogs.beanId, coffeeBeans.id),
        eq(coffeeLogs.userId, session.user.id),
        isNull(coffeeLogs.deletedAt),
      ),
    )
    .where(eq(coffeeBeans.userId, session.user.id))
    .groupBy(coffeeBeans.id)
    .orderBy(desc(count(coffeeLogs.id)))
    .limit(limit);
}

// Fetch all coffee beans for the authenticated user (for form selects)
export async function fetchCoffeeBeans() {
  const session = await requireAuth();

  return await db
    .select({
      id: coffeeBeans.id,
      name: coffeeBeans.name,
      roaster: coffeeBeans.roaster,
      origin: coffeeBeans.origin,
      roastLevel: coffeeBeans.roastLevel,
    })
    .from(coffeeBeans)
    .where(eq(coffeeBeans.userId, session.user.id))
    .orderBy(coffeeBeans.name);
}

// Fetch recent brews for the authenticated user
export async function fetchRecentBrews(
  limit: number = 10,
  searchQuery?: string,
  filterMethod?: BrewMethodValue | "all",
) {
  const session = await requireAuth();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const conditions = [
    eq(coffeeLogs.userId, session.user.id),
    isNull(coffeeLogs.deletedAt),
  ];

  // Add search conditions if query provided
  if (searchQuery && searchQuery.trim()) {
    const searchTerm = `%${searchQuery.trim()}%`;
    conditions.push(
      or(
        ilike(coffeeBeans.name, searchTerm),
        ilike(coffeeBeans.roaster, searchTerm),
        ilike(coffeeLogs.notes, searchTerm),
      )!,
    );
  }

  // Add method filter if provided
  if (filterMethod && filterMethod !== "all") {
    conditions.push(eq(coffeeLogs.method, filterMethod));
  }

  return await db
    .select({
      log: coffeeLogs,
      bean: coffeeBeans,
    })
    .from(coffeeLogs)
    .innerJoin(
      coffeeBeans,
      and(
        eq(coffeeLogs.beanId, coffeeBeans.id),
        eq(coffeeBeans.userId, session.user.id),
      ),
    )
    .where(and(...conditions))
    .orderBy(desc(coffeeLogs.brewedAt))
    .limit(limit);
}

// Fetch single brew by ID for the authenticated user
export async function fetchBrewById(id: string) {
  const session = await requireAuth();

  const result = await db
    .select({
      log: coffeeLogs,
      bean: coffeeBeans,
    })
    .from(coffeeLogs)
    .innerJoin(
      coffeeBeans,
      and(
        eq(coffeeLogs.beanId, coffeeBeans.id),
        eq(coffeeBeans.userId, session.user.id),
      ),
    )
    .where(
      and(
        eq(coffeeLogs.id, id),
        eq(coffeeLogs.userId, session.user.id),
        isNull(coffeeLogs.deletedAt),
      ),
    )
    .limit(1);

  return result[0] || null;
}

// Fetch public brew by ID (no authentication required)
export async function fetchPublicBrewById(id: string) {
  const brewIdSchema = z.string().uuid();
  const validatedId = brewIdSchema.safeParse(id);
  
  if (!validatedId.success) {
    return null;
  }

  const result = await db
    .select({
      log: coffeeLogs,
      bean: coffeeBeans,
      user: {
        id: user.id,
        name: user.name,
      },
    })
    .from(coffeeLogs)
    .innerJoin(coffeeBeans, eq(coffeeLogs.beanId, coffeeBeans.id))
    .innerJoin(user, eq(coffeeLogs.userId, user.id))
    .where(
      and(
        eq(coffeeLogs.id, validatedId.data),
        eq(coffeeLogs.isPublic, true),
        isNull(coffeeLogs.deletedAt),
      ),
    )
    .limit(1);

  return result[0] || null;
}
