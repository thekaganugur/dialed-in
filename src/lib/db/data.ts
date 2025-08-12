import { db } from "@/lib/db";
import { coffeeBeans, coffeeLogs } from "@/lib/db/schema";
import { and, avg, count, desc, eq, gte, isNull, lt } from "drizzle-orm";

// Get today's brew count (with type safety!)
export async function fetchTodayBrewCount(): Promise<number> {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  const result = await db
    .select({ count: count() })
    .from(coffeeLogs)
    .where(
      and(
        gte(coffeeLogs.brewedAt, startOfDay),
        lt(coffeeLogs.brewedAt, endOfDay),
        isNull(coffeeLogs.deletedAt),
      ),
    );

  return result[0]?.count || 0;
}

// Calculate weekly average rating
export async function fetchWeeklyAverageRating(): Promise<number> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const result = await db
    .select({ avgRating: avg(coffeeLogs.rating) })
    .from(coffeeLogs)
    .where(
      and(gte(coffeeLogs.brewedAt, weekAgo), isNull(coffeeLogs.deletedAt)),
    );

  return Number(result[0]?.avgRating) || 0;
}

export async function fetchFavoriteBrewingMethod(limit: number = 5) {
  return await db
    .select({
      method: coffeeLogs.method,
      brewCount: count(coffeeLogs.id),
    })
    .from(coffeeLogs)
    .where(isNull(coffeeLogs.deletedAt))
    .groupBy(coffeeLogs.method)
    .orderBy(desc(count(coffeeLogs.id)))
    .limit(limit);
}

// Get total bean count for inventory
export async function fetchBeanCount(): Promise<number> {
  const result = await db.select({ count: count() }).from(coffeeBeans);

  return result[0]?.count || 0;
}

// Get top beans with brew count
export async function fetchTopBeans(limit: number = 5) {
  return await db
    .select({
      bean: coffeeBeans,
      brewCount: count(coffeeLogs.id),
    })
    .from(coffeeBeans)
    .leftJoin(
      coffeeLogs,
      and(eq(coffeeLogs.beanId, coffeeBeans.id), isNull(coffeeLogs.deletedAt)),
    )
    .groupBy(coffeeBeans.id)
    .orderBy(desc(count(coffeeLogs.id)))
    .limit(limit);
}

// Fetch recent brews
export async function fetchRecentBrews(limit: number = 10) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return await db
    .select({
      log: coffeeLogs,
      bean: coffeeBeans,
    })
    .from(coffeeLogs)
    .innerJoin(coffeeBeans, eq(coffeeLogs.beanId, coffeeBeans.id))
    .where(isNull(coffeeLogs.deletedAt))
    .orderBy(desc(coffeeLogs.brewedAt))
    .limit(limit);
}
