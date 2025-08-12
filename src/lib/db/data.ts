import { db } from "@/lib/db";
import { coffeeBeans, coffeeLogs, brewMethodEnum } from "@/lib/db/schema";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { and, avg, count, desc, eq, gte, ilike, isNull, lt, or } from "drizzle-orm";

// Type-safe brew method type
type BrewMethodValue = typeof brewMethodEnum.enumValues[number];

// Get today's brew count (with type safety!)
export async function fetchTodayBrewCount(): Promise<number> {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const result = await db
    .select({ count: count() })
    .from(coffeeLogs)
    .where(
      and(
        gte(coffeeLogs.brewedAt, todayStart),
        lt(coffeeLogs.brewedAt, todayEnd),
        isNull(coffeeLogs.deletedAt),
      ),
    );

  return result[0]?.count || 0;
}

// Calculate weekly average rating
export async function fetchWeeklyAverageRating(): Promise<number> {
  const weekAgo = subDays(new Date(), 7);

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
export async function fetchRecentBrews(
  limit: number = 10,
  searchQuery?: string,
  filterMethod?: BrewMethodValue | "all",
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const conditions = [isNull(coffeeLogs.deletedAt)];
  
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
    .innerJoin(coffeeBeans, eq(coffeeLogs.beanId, coffeeBeans.id))
    .where(and(...conditions))
    .orderBy(desc(coffeeLogs.brewedAt))
    .limit(limit);
}
