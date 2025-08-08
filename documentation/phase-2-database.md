# Phase 2: Database with Docker PostgreSQL

**Next.js Tutorial Chapters 6-8**

Set up a local PostgreSQL database with Docker for your coffee logger.

---

## 📦 Docker Setup First

### 1. Create Docker Compose File

Create `docker-compose.yml` in your project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: brewlog-db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: brewmaster
      POSTGRES_PASSWORD: coffee123
      POSTGRES_DB: brewlog
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```

### 2. Create Initial Schema

Create `sql/init.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Coffee Beans table
CREATE TABLE coffee_beans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roaster VARCHAR(255),
  origin VARCHAR(255),
  roast_level VARCHAR(50),
  process VARCHAR(50),
  purchase_date DATE,
  price DECIMAL(10, 2),
  weight_grams INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Brew Methods table
CREATE TABLE brew_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  default_temp INTEGER,
  default_time INTEGER,
  default_ratio VARCHAR(20),
  grind_size VARCHAR(50)
);

-- Coffee Logs table
CREATE TABLE coffee_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bean_id UUID REFERENCES coffee_beans(id) ON DELETE SET NULL,
  method_id UUID REFERENCES brew_methods(id) ON DELETE SET NULL,
  brew_date TIMESTAMP DEFAULT NOW(),
  dose_grams DECIMAL(5, 2),
  yield_grams DECIMAL(5, 2),
  brew_time_seconds INTEGER,
  water_temp_celsius INTEGER,
  grind_setting VARCHAR(50),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_logs_brew_date ON coffee_logs(brew_date DESC);
CREATE INDEX idx_logs_rating ON coffee_logs(rating);
CREATE INDEX idx_logs_bean ON coffee_logs(bean_id);

-- Insert default brew methods
INSERT INTO brew_methods (name, default_temp, default_time, default_ratio, grind_size) VALUES
  ('Espresso', 93, 30, '1:2', 'Fine'),
  ('V60', 96, 150, '1:15', 'Medium-Fine'),
  ('Chemex', 96, 240, '1:15', 'Medium-Coarse'),
  ('French Press', 96, 240, '1:12', 'Coarse'),
  ('Aeropress', 85, 90, '1:12', 'Fine-Medium'),
  ('Moka Pot', 100, 300, '1:10', 'Fine-Medium');
```

### 3. Start Database

```bash
# Start PostgreSQL
docker-compose up -d

# Check if it's running
docker ps

# View logs if needed
docker logs brewlog-db

# Connect via psql (optional)
docker exec -it brewlog-db psql -U brewmaster -d brewlog
```

---

## 🔧 Story 6: Connect Next.js to Docker PostgreSQL

**Chapter 6: Setting Up Your Database**

### Install Dependencies

```bash
# Modern ORM and validation
npm install drizzle-orm postgres zod
npm install --save-dev drizzle-kit @types/node

# Alternative ORM options:
# npm install prisma @prisma/client
# npm install kysely
```

### Environment Variables

Create `.env.local`:

```bash
# Local Docker PostgreSQL
DATABASE_URL=postgresql://brewmaster:coffee123@localhost:5432/brewlog

# For production later (example)
# DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
```

### Environment Variable Validation

Create `lib/env.ts`:

```typescript
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = envSchema.parse(process.env);
```

### Database Schema with Drizzle

Create `lib/schema.ts`:

```typescript
import {
  check,
  date,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const coffeeBeans = pgTable(
  "coffee_beans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    roaster: varchar("roaster", { length: 255 }),
    origin: varchar("origin", { length: 255 }),
    roastLevel: varchar("roast_level", { length: 50 }),
    process: varchar("process", { length: 50 }),
    purchaseDate: date("purchase_date"),
    price: decimal("price", { precision: 10, scale: 2 }),
    weightGrams: integer("weight_grams"),
    rating: integer("rating"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    ratingCheck: check(
      "rating_check",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
  }),
);

export const brewMethods = pgTable("brew_methods", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  defaultTemp: integer("default_temp"),
  defaultTime: integer("default_time"),
  defaultRatio: varchar("default_ratio", { length: 20 }),
  grindSize: varchar("grind_size", { length: 50 }),
});

export const coffeeLogs = pgTable(
  "coffee_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    beanId: uuid("bean_id").references(() => coffeeBeans.id, {
      onDelete: "set null",
    }),
    methodId: uuid("method_id").references(() => brewMethods.id, {
      onDelete: "set null",
    }),
    brewDate: timestamp("brew_date").defaultNow(),
    doseGrams: decimal("dose_grams", { precision: 5, scale: 2 }),
    yieldGrams: decimal("yield_grams", { precision: 5, scale: 2 }),
    brewTimeSeconds: integer("brew_time_seconds"),
    waterTempCelsius: integer("water_temp_celsius"),
    grindSetting: varchar("grind_setting", { length: 50 }),
    rating: integer("rating"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    ratingCheck: check(
      "rating_check",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
  }),
);

// Export types for TypeScript
export type CoffeeBean = typeof coffeeBeans.$inferSelect;
export type NewCoffeeBean = typeof coffeeBeans.$inferInsert;
export type CoffeeLog = typeof coffeeLogs.$inferSelect;
export type NewCoffeeLog = typeof coffeeLogs.$inferInsert;
export type BrewMethod = typeof brewMethods.$inferSelect;
```

### Database Connection

Create `lib/db.ts`:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env";
import * as schema from "./schema";

// Create the connection
const connectionString = env.DATABASE_URL;
const sql = postgres(connectionString, {
  ssl: env.NODE_ENV === "production" ? "require" : false,
  max: 10,
  idle_timeout: 60,
});

// Create the database instance
export const db = drizzle(sql, { schema });
```

### TypeScript Definitions

Create `lib/definitions.ts`:

```typescript
export interface DashboardData {
  todayBrews: number;
  avgRating: number;
  favoriteMethod: string;
  beanCount: number;
}

export interface RecentBrew {
  id: string;
  rating: number;
  beanName: string | null;
  roaster: string | null;
  methodName: string | null;
  brewDate: Date;
  notes: string | null;
}
```

### Database Migration Setup

Create `drizzle.config.ts`:

```typescript
import type { Config } from "drizzle-kit";
import { env } from "./lib/env";

export default {
  schema: "./lib/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
```

### Seed Script with Drizzle

Create `lib/seed.ts`:

```typescript
import { sql } from "drizzle-orm";
import { db } from "./db";
import { brewMethods, coffeeBeans, coffeeLogs } from "./schema";

async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Add sample beans
    const beans = await db
      .insert(coffeeBeans)
      .values([
        {
          name: "Ethiopia Yirgacheffe",
          roaster: "Local Coffee Roasters",
          origin: "Ethiopia",
          roastLevel: "light",
          process: "washed",
          price: "24.99",
          weightGrams: 340,
        },
        {
          name: "Colombia Geisha",
          roaster: "Specialty Beans Co",
          origin: "Colombia",
          roastLevel: "medium",
          process: "honey",
          price: "45.00",
          weightGrams: 250,
        },
        {
          name: "Blue Mountain",
          roaster: "Premium Roasters",
          origin: "Jamaica",
          roastLevel: "medium",
          process: "washed",
          price: "89.99",
          weightGrams: 250,
        },
      ])
      .returning();

    console.log(`✅ Added ${beans.length} coffee beans`);

    // Get brew methods for logs
    const methods = await db.select().from(brewMethods).limit(3);

    // Add sample brew logs
    const logs = await db
      .insert(coffeeLogs)
      .values([
        {
          beanId: beans[0].id,
          methodId: methods[0].id,
          doseGrams: "18.0",
          yieldGrams: "36.0",
          brewTimeSeconds: 28,
          waterTempCelsius: 93,
          grindSetting: "Fine",
          rating: 4,
          notes: "Great espresso shot!",
        },
        {
          beanId: beans[1].id,
          methodId: methods[1].id,
          doseGrams: "15.0",
          yieldGrams: "250.0",
          brewTimeSeconds: 150,
          waterTempCelsius: 96,
          grindSetting: "Medium-Fine",
          rating: 5,
          notes: "Perfect V60 pour over",
        },
      ])
      .returning();

    console.log(`✅ Added ${logs.length} brew logs`);
    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
```

### Updated Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx lib/seed.ts",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push",
    "db:reset": "npm run db:push && npm run db:seed"
  }
}
```

---

## 📊 Story 7: Modern Server Components Data Fetching

**Chapter 7: Fetching Data with Server Components**

### Direct Database Queries in Server Components

Create `app/dashboard/page.tsx`:

```typescript
import { Suspense } from 'react'
import { db } from '@/lib/db'
import { coffeeLogs, coffeeBeans, brewMethods } from '@/lib/schema'
import { eq, sql, desc, count, avg } from 'drizzle-orm'
import type { DashboardData, RecentBrew } from '@/lib/definitions'
import { DashboardStats, RecentBrews } from './components'
import { DashboardSkeleton } from './loading'

// Direct database queries in Server Components
async function getDashboardStats(): Promise<DashboardData> {
  try {
    const [todayBrews] = await db
      .select({ count: count() })
      .from(coffeeLogs)
      .where(sql`DATE(${coffeeLogs.brewDate}) = CURRENT_DATE`)

    const [avgRating] = await db
      .select({ avgRating: avg(coffeeLogs.rating) })
      .from(coffeeLogs)
      .where(sql`${coffeeLogs.brewDate} >= CURRENT_DATE - INTERVAL '7 days'`)

    const [favoriteMethod] = await db
      .select({
        name: brewMethods.name,
        count: count()
      })
      .from(coffeeLogs)
      .leftJoin(brewMethods, eq(coffeeLogs.methodId, brewMethods.id))
      .where(sql`${coffeeLogs.brewDate} >= CURRENT_DATE - INTERVAL '30 days'`)
      .groupBy(brewMethods.id, brewMethods.name)
      .orderBy(desc(count()))
      .limit(1)

    const [beanCount] = await db
      .select({ count: count() })
      .from(coffeeBeans)
      .where(sql`${coffeeBeans.purchaseDate} >= CURRENT_DATE - INTERVAL '60 days'`)

    return {
      todayBrews: todayBrews.count,
      avgRating: Number(avgRating.avgRating) || 0,
      favoriteMethod: favoriteMethod?.name || 'None yet',
      beanCount: beanCount.count,
    }
  } catch (error) {
    console.error('Dashboard Stats Error:', error)
    throw new Error('Failed to fetch dashboard stats')
  }
}

async function getRecentBrews(limit = 5): Promise<RecentBrew[]> {
  try {
    const recentBrews = await db
      .select({
        id: coffeeLogs.id,
        rating: coffeeLogs.rating,
        beanName: coffeeBeans.name,
        roaster: coffeeBeans.roaster,
        methodName: brewMethods.name,
        brewDate: coffeeLogs.brewDate,
        notes: coffeeLogs.notes,
      })
      .from(coffeeLogs)
      .leftJoin(coffeeBeans, eq(coffeeLogs.beanId, coffeeBeans.id))
      .leftJoin(brewMethods, eq(coffeeLogs.methodId, brewMethods.id))
      .orderBy(desc(coffeeLogs.brewDate))
      .limit(limit)

    return recentBrews
  } catch (error) {
    console.error('Recent Brews Error:', error)
    throw new Error('Failed to fetch recent brews')
  }
}

// Server Component - fetches data directly
export default async function DashboardPage() {
  return (
    <div className="grid gap-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStatsSection />
      </Suspense>

      <Suspense fallback={<div>Loading recent brews...</div>}>
        <RecentBrewsSection />
      </Suspense>
    </div>
  )
}

// Separate components for better loading states
async function DashboardStatsSection() {
  const stats = await getDashboardStats()
  return <DashboardStats {...stats} />
}

async function RecentBrewsSection() {
  const brews = await getRecentBrews()
  return <RecentBrews brews={brews} />
}
```

### Loading and Error States

Create `app/dashboard/loading.tsx`:

```typescript
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <DashboardSkeleton />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
```

Create `app/dashboard/error.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-64 flex-col items-center justify-center">
      <h2 className="mb-4 text-xl font-semibold">Something went wrong!</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

### Alternative: Data Fetching Functions (if needed)

Create `lib/queries.ts` for reusable queries:

```typescript
import { avg, count, desc, eq, sql } from "drizzle-orm";
import { db } from "./db";
import { brewMethods, coffeeBeans, coffeeLogs } from "./schema";

export const queries = {
  dashboard: {
    todayBrewCount: () =>
      db
        .select({ count: count() })
        .from(coffeeLogs)
        .where(sql`DATE(${coffeeLogs.brewDate}) = CURRENT_DATE`),

    weeklyAvgRating: () =>
      db
        .select({ avgRating: avg(coffeeLogs.rating) })
        .from(coffeeLogs)
        .where(sql`${coffeeLogs.brewDate} >= CURRENT_DATE - INTERVAL '7 days'`),

    favoriteMethod: () =>
      db
        .select({
          name: brewMethods.name,
          count: count(),
        })
        .from(coffeeLogs)
        .leftJoin(brewMethods, eq(coffeeLogs.methodId, brewMethods.id))
        .where(sql`${coffeeLogs.brewDate} >= CURRENT_DATE - INTERVAL '30 days'`)
        .groupBy(brewMethods.id, brewMethods.name)
        .orderBy(desc(count()))
        .limit(1),
  },

  brews: {
    recent: (limit = 5) =>
      db
        .select({
          id: coffeeLogs.id,
          rating: coffeeLogs.rating,
          beanName: coffeeBeans.name,
          roaster: coffeeBeans.roaster,
          methodName: brewMethods.name,
          brewDate: coffeeLogs.brewDate,
          notes: coffeeLogs.notes,
        })
        .from(coffeeLogs)
        .leftJoin(coffeeBeans, eq(coffeeLogs.beanId, coffeeBeans.id))
        .leftJoin(brewMethods, eq(coffeeLogs.methodId, brewMethods.id))
        .orderBy(desc(coffeeLogs.brewDate))
        .limit(limit),
  },
};
```

---

## 🛠️ Database Management Commands

### Useful Docker Commands

```bash
# Stop database
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v

# View database logs
docker logs -f brewlog-db

# Connect to database with psql
docker exec -it brewlog-db psql -U brewmaster -d brewlog

# Backup database
docker exec brewlog-db pg_dump -U brewmaster brewlog > backup.sql

# Restore database
docker exec -i brewlog-db psql -U brewmaster brewlog < backup.sql
```

### Modern Development Workflow

```bash
# 1. Start Docker database
docker-compose up -d

# 2. Generate schema migrations
npm run db:generate

# 3. Apply migrations
npm run db:migrate

# 4. Seed with sample data
npm run db:seed

# 5. Open database studio (optional)
npm run db:studio

# 6. Reset database (migrations + seed)
npm run db:reset
```

### Common SQL Commands

```sql
-- Connect to psql
docker exec -it brewlog-db psql -U brewmaster -d brewlog

-- List all tables
\dt

-- Describe a table
\d coffee_logs

-- View recent logs
SELECT * FROM coffee_logs ORDER BY brew_date DESC LIMIT 5;

-- Check row counts
SELECT
  (SELECT COUNT(*) FROM coffee_beans) as beans,
  (SELECT COUNT(*) FROM coffee_logs) as logs,
  (SELECT COUNT(*) FROM brew_methods) as methods;

-- Exit psql
\q
```

---

## ✅ Acceptance Criteria

- [x] Docker PostgreSQL running locally
- [ ] Drizzle ORM configured with TypeScript schema
- [ ] Environment variables validated with Zod
- [ ] Database migrations working with drizzle-kit
- [ ] Sample data seeded successfully
- [ ] Server Components fetching data directly
- [ ] Loading and error states implemented
- [ ] Type-safe database queries
- [ ] No connection errors in console

---

## 🎯 Benefits of Local Docker PostgreSQL

1. **Free Forever** - No usage limits or billing surprises
2. **Fast Development** - No network latency
3. **Full SQL Access** - Learn real PostgreSQL
4. **Portable** - Same setup on any machine
5. **Production Ready** - Deploy this anywhere
6. **Version Control** - Schema in your repo
7. **Team Friendly** - Everyone gets same DB

---

## 🚀 Next Steps

Once your local database is working:

1. Continue with [Story 8: Optimize Page.//documentation/phases-3-4-5.md
   Rendering](/documentation/phase-1-foundation.md)
2. Test data fetching in your components
3. Experiment with different SQL queries
4. Add your real coffee data!

## 💡 Pro Tips

- Keep Docker running in the background
- Use TablePlus or pgAdmin for GUI access
- Commit your `sql/init.sql` to git
- Don't commit `.env.local`
- Use the same PostgreSQL version as production
