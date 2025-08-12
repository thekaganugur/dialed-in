# Phase 2: Database and Data Fetching

**Next.js Tutorial Chapters 6-8**

Connect your coffee logger to a real database using Neon and Drizzle ORM.

---

## Story 6: Set Up Coffee Database

**Chapter 6: Setting Up Your Database**

**As a** serious coffee tracker  
**I need** permanent storage  
**So that** my logs aren't lost

### What You'll Learn

- Neon database setup
- Drizzle ORM configuration
- Type-safe schema design
- Database migrations
- Seeding with placeholder data

### Initial Setup

```bash
# 1. Create account at neon.tech and get connection string

# 2. Install dependencies
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit

# 3. Add to .env.local
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/brewlog?sslmode=require
```

### Database Schema with Drizzle

```typescript
// app/db/schema.ts
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Type-safe enums
export const roastLevelEnum = pgEnum("roast_level", [
  "light",
  "medium",
  "dark",
]);
export const brewMethodEnum = pgEnum("brew_method", [
  "espresso",
  "v60",
  "chemex",
  "aeropress",
  "french-press",
]);

// Coffee Beans table
export const coffeeBeans = pgTable("coffee_beans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  roaster: varchar("roaster", { length: 255 }),
  origin: varchar("origin", { length: 255 }),
  roastLevel: roastLevelEnum("roast_level"),
  price: decimal("price", { precision: 10, scale: 2 }),
  rating: integer("rating"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Brew Methods table
export const brewMethods = pgTable("brew_methods", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: brewMethodEnum("name").notNull(),
  defaultTemp: integer("default_temp"),
  defaultTime: integer("default_time"),
  grindSize: varchar("grind_size", { length: 50 }),
});

// Coffee Logs table
export const coffeeLogs = pgTable("coffee_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  beanId: uuid("bean_id").references(() => coffeeBeans.id),
  methodId: uuid("method_id").references(() => brewMethods.id),
  brewDate: timestamp("brew_date").defaultNow(),
  doseGrams: decimal("dose_grams", { precision: 5, scale: 2 }),
  yieldGrams: decimal("yield_grams", { precision: 5, scale: 2 }),
  brewTimeSeconds: integer("brew_time_seconds"),
  waterTempCelsius: integer("water_temp_celsius"),
  grindSetting: varchar("grind_setting", { length: 50 }),
  rating: integer("rating").notNull(),
  notes: text("notes"),
});

// Export types (auto-generated!)
export type CoffeeBean = typeof coffeeBeans.$inferSelect;
export type NewCoffeeBean = typeof coffeeBeans.$inferInsert;
export type CoffeeLog = typeof coffeeLogs.$inferSelect;
export type NewCoffeeLog = typeof coffeeLogs.$inferInsert;
```

### Database Connection

```typescript
// app/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### Migration & Seeding

```typescript
// package.json scripts
{
  "scripts": {
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx app/db/seed.ts"
  }
}
```

```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed

# Open visual database browser
npm run db:studio
```

### ✅ Acceptance Criteria

- [x] Neon database connected
- [x] Drizzle schema created
- [x] Tables created with relationships
- [x] Sample data seeded successfully
- [x] Types auto-generated from schema

---

## Story 7: Fetch Coffee Statistics

**Chapter 7: Fetching Data**

**As a** coffee nerd  
**I want** to see my brewing patterns  
**So that** I can improve my technique

### What You'll Learn

- Server Components with Drizzle
- Type-safe database queries
- SQL query builder syntax
- Async/await in React components
- Parallel vs sequential fetching

### Dashboard Queries with Drizzle

```typescript
// app/lib/data.ts
import { db } from "@/app/db";
import { brewMethods, coffeeBeans, coffeeLogs } from "@/app/db/schema";
import { and, desc, eq, gte, sql } from "drizzle-orm";

// Get today's brew count (with type safety!)
export async function fetchTodayBrewCount() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(coffeeLogs)
    .where(gte(coffeeLogs.brewDate, today));

  return result[0]?.count || 0;
}

// Calculate weekly average rating
export async function fetchWeeklyAverageRating() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const result = await db
    .select({
      avgRating: sql<number>`avg(${coffeeLogs.rating})::float`,
    })
    .from(coffeeLogs)
    .where(gte(coffeeLogs.brewDate, weekAgo));

  return result[0]?.avgRating || 0;
}

// Get top beans with brew count
export async function fetchTopBeans() {
  return await db
    .select({
      bean: coffeeBeans,
      brewCount: sql<number>`count(${coffeeLogs.id})`,
      avgRating: sql<number>`avg(${coffeeLogs.rating})::float`,
    })
    .from(coffeeBeans)
    .leftJoin(coffeeLogs, eq(coffeeBeans.id, coffeeLogs.beanId))
    .groupBy(coffeeBeans.id)
    .orderBy(desc(sql`count(${coffeeLogs.id})`))
    .limit(5);
}

// Fetch recent brews with joins
export async function fetchRecentBrews() {
  return await db
    .select({
      log: coffeeLogs,
      bean: coffeeBeans,
      method: brewMethods,
    })
    .from(coffeeLogs)
    .leftJoin(coffeeBeans, eq(coffeeLogs.beanId, coffeeBeans.id))
    .leftJoin(brewMethods, eq(coffeeLogs.methodId, brewMethods.id))
    .orderBy(desc(coffeeLogs.brewDate))
    .limit(10);
}

// Dashboard card data - all in parallel!
export async function fetchDashboardData() {
  const [todayCount, weeklyAvg, topBeans, recentBrews] = await Promise.all([
    fetchTodayBrewCount(),
    fetchWeeklyAverageRating(),
    fetchTopBeans(),
    fetchRecentBrews(),
  ]);

  return {
    todayCount,
    weeklyAvg,
    topBeans,
    recentBrews,
  };
}
```

### Using in Server Components

```typescript
// app/dashboard/page.tsx
import { fetchDashboardData } from '@/app/lib/data';

export default async function Dashboard() {
  // Type-safe data fetching!
  const { todayCount, weeklyAvg, topBeans, recentBrews } =
    await fetchDashboardData();

  return (
    <main>
      <h1>Coffee Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <Card title="Today's Brews" value={todayCount} />
        <Card title="Week Average" value={weeklyAvg.toFixed(1)} />
      </div>

      <TopBeansChart beans={topBeans} />
      <RecentBrewsList brews={recentBrews} />
    </main>
  );
}
```

### ✅ Acceptance Criteria

- [x] All metrics fetch with Drizzle
- [x] Parallel fetching with Promise.all()
- [x] Type-safe queries (no typos!)
- [x] IntelliSense for all fields
- [x] No loading waterfalls

---

## Story 8: Optimize Page Rendering

**Chapter 8: Static and Dynamic Rendering**

**As a** user  
**I want** instant dashboard loads  
**But** fresh data in brew logs

### What You'll Learn

- Static rendering at build time
- Dynamic rendering at request time
- When Next.js prerenders
- Route segment configuration
- Caching with database queries

### Rendering Strategies with Drizzle

| Page           | Strategy            | Why                 | Implementation              |
| -------------- | ------------------- | ------------------- | --------------------------- |
| Dashboard      | Static + Revalidate | Stats update slowly | `revalidate = 3600`         |
| Brew List      | Dynamic             | Always fresh        | `dynamic = 'force-dynamic'` |
| Bean Details   | Static              | Beans rarely change | Default (static)            |
| Individual Log | Dynamic             | May be edited       | Dynamic params              |

### Static Page with Drizzle

```typescript
// app/dashboard/beans/page.tsx
import { db } from '@/app/db';
import { coffeeBeans } from '@/app/db/schema';

// This page will be static at build time
export default async function BeansPage() {
  // This query runs at BUILD TIME
  const beans = await db
    .select()
    .from(coffeeBeans)
    .orderBy(coffeeBeans.name);

  return (
    <div>
      <h1>Bean Inventory</h1>
      {beans.map(bean => (
        <BeanCard key={bean.id} bean={bean} />
      ))}
    </div>
  );
}
```

### Dynamic Page with Drizzle

```typescript
// app/dashboard/brews/page.tsx
import { db } from '@/app/db';
import { coffeeLogs, coffeeBeans, brewMethods } from '@/app/db/schema';
import { desc, eq } from 'drizzle-orm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function BrewsPage() {
  // This query runs on EVERY REQUEST
  const brews = await db
    .select({
      log: coffeeLogs,
      bean: coffeeBeans,
      method: brewMethods,
    })
    .from(coffeeLogs)
    .leftJoin(coffeeBeans, eq(coffeeLogs.beanId, coffeeBeans.id))
    .leftJoin(brewMethods, eq(coffeeLogs.methodId, brewMethods.id))
    .orderBy(desc(coffeeLogs.brewDate));

  return (
    <div>
      <h1>All Brews</h1>
      <BrewTable brews={brews} />
    </div>
  );
}
```

### Incremental Static Regeneration

```typescript
// app/dashboard/page.tsx
// Rebuild this page every hour
export const revalidate = 3600;

export default async function Dashboard() {
  const stats = await db
    .select({
      totalBrews: sql<number>`count(*)`,
      avgRating: sql<number>`avg(rating)::float`,
    })
    .from(coffeeLogs);

  // This runs at build time, then every hour
  return <DashboardStats stats={stats[0]} />;
}
```

### Build Output Analysis

```bash
npm run build

Route (app)                              Size     First Load JS
┌ ○ /                                   5.2 kB        85.3 kB
├ ○ /dashboard                          3.1 kB        83.2 kB  (ISR: 3600)
├ λ /dashboard/brews                    4.5 kB        84.6 kB
├ ○ /dashboard/beans                    2.8 kB        82.9 kB
└ λ /dashboard/brews/[id]              3.9 kB        84.0 kB

○  (Static)   prerendered with Drizzle queries at build time
λ  (Dynamic)  Drizzle queries run on each request
```

### ✅ Acceptance Criteria

- [ ] Dashboard loads instantly (static)
- [ ] New brews appear immediately
- [ ] Build shows correct rendering types
- [ ] Drizzle queries work in both modes
- [ ] Type safety maintained everywhere

---

## 📋 Phase 2 Summary

By completing Phase 2 with Drizzle, you've achieved:

- ✅ **Neon database** with branching capabilities
- ✅ **Type-safe schema** with auto-generated types
- ✅ **Drizzle ORM** for better developer experience
- ✅ **SQL knowledge** with query builder syntax
- ✅ **Optimized rendering** strategies

## 🎯 Key Concepts Learned

- **Drizzle Schema**: Define once, use everywhere
- **Type Safety**: No more SQL typos or wrong types
- **Query Builder**: SQL-like but with TypeScript
- **Server Components**: Direct database access
- **Rendering Modes**: Static vs Dynamic with Drizzle

## 💡 Drizzle Pro Tips

```typescript
// Use select for specific fields (better performance)
const beans = await db
  .select({
    id: coffeeBeans.id,
    name: coffeeBeans.name,
  })
  .from(coffeeBeans);

// Use prepared statements for repeated queries
const getBrewById = db
  .select()
  .from(coffeeLogs)
  .where(eq(coffeeLogs.id, sql.placeholder("id")))
  .prepare();

// Then use it multiple times
const brew = await getBrewById.execute({ id: brewId });
```

## 🚀 Drizzle Commands Reference

```bash
# Push schema changes (development)
npm run db:push

# Generate migrations (production)
npm run db:generate
npm run db:migrate

# Browse your data visually
npm run db:studio

# Reset and reseed
npm run db:push
npm run db:seed
```

## → Next Steps

Ready for advanced performance? [Continue to Phase 3](./phases-3-4-5.md)
