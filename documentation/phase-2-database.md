# Phase 2: Database and Data Fetching

**Next.js Tutorial Chapters 6-8**

Connect your coffee logger to a real database and learn data fetching patterns.

---

## Story 6: Set Up Coffee Database

**Chapter 6: Setting Up Your Database**

**As a** serious coffee tracker  
**I need** permanent storage  
**So that** my logs aren't lost

### What You'll Learn

- Vercel Postgres setup
- Database schema creation
- Seeding with placeholder data
- Environment variables
- SQL with `postgres` library

### Database Schema

```sql
CREATE TABLE coffee_beans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roaster VARCHAR(255),
  origin VARCHAR(255),
  roast_level VARCHAR(50),
  process VARCHAR(50),
  purchase_date DATE,
  price DECIMAL(10, 2),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT
);

CREATE TABLE brew_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  default_temp INTEGER,
  default_time INTEGER,
  grind_size VARCHAR(50)
);

CREATE TABLE coffee_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bean_id UUID REFERENCES coffee_beans(id),
  method_id UUID REFERENCES brew_methods(id),
  brew_date TIMESTAMP DEFAULT NOW(),
  dose_grams DECIMAL(5, 2),
  yield_grams DECIMAL(5, 2),
  brew_time_seconds INTEGER,
  water_temp_celsius INTEGER,
  grind_setting VARCHAR(50),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT
);
```

### Seed Data Script

```typescript
// app/lib/seed.ts
async function seedBeans(sql) {
  await sql`
    INSERT INTO coffee_beans (name, roaster, origin, roast_level)
    VALUES 
      ('Ethiopia Yirgacheffe', 'Local Roaster', 'Ethiopia', 'light'),
      ('Colombia Geisha', 'Specialty Coffee Co', 'Colombia', 'medium'),
      ('House Espresso', 'Daily Grind', 'Blend', 'dark')
  `;
}
```

### ✅ Acceptance Criteria

- [ ] Vercel Postgres connected
- [ ] Tables created with relationships
- [ ] Sample data seeded successfully
- [ ] Environment variables configured
- [ ] Can query coffee logs

---

## Story 7: Fetch Coffee Statistics

**Chapter 7: Fetching Data**

**As a** coffee nerd  
**I want** to see my brewing patterns  
**So that** I can improve my technique

### What You'll Learn

- Server Components for data fetching
- Direct SQL queries in components
- Async/await in React components
- SQL aggregation queries
- Parallel vs sequential fetching

### Dashboard Queries

```typescript
// app/lib/data.ts
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

export async function fetchBrewCount() {
  const data = await sql`
    SELECT COUNT(*) as count 
    FROM coffee_logs 
    WHERE DATE(brew_date) = CURRENT_DATE
  `;
  return data[0].count;
}

export async function fetchAverageRating() {
  const data = await sql`
    SELECT AVG(rating) as avg_rating 
    FROM coffee_logs 
    WHERE brew_date >= NOW() - INTERVAL '7 days'
  `;
  return data[0].avg_rating;
}

export async function fetchTopBeans() {
  return sql`
    SELECT b.name, COUNT(l.id) as brew_count
    FROM coffee_beans b
    LEFT JOIN coffee_logs l ON b.id = l.bean_id
    GROUP BY b.id, b.name
    ORDER BY brew_count DESC
    LIMIT 5
  `;
}
```

### Parallel Fetching Pattern

```typescript
// app/dashboard/page.tsx
export default async function Dashboard() {
  const [brewCount, avgRating, topBeans] = await Promise.all([
    fetchBrewCount(),
    fetchAverageRating(),
    fetchTopBeans(),
  ]);

  // Render with data...
}
```

### ✅ Acceptance Criteria

- [ ] All metrics fetch from database
- [ ] Parallel fetching with Promise.all()
- [ ] Type-safe database queries
- [ ] No loading waterfalls
- [ ] Error handling in place

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
- Caching behavior

### Rendering Strategies

| Page           | Strategy                  | Why                      |
| -------------- | ------------------------- | ------------------------ |
| Dashboard      | Static (revalidate daily) | Stats don't change often |
| Brew List      | Dynamic                   | Need fresh data          |
| Bean Details   | Static                    | Beans rarely change      |
| Individual Log | Dynamic                   | May be edited            |
| Analytics      | Dynamic                   | Real-time insights       |

### Route Configuration

```typescript
// app/dashboard/page.tsx
// Static with daily revalidation
export const revalidate = 86400; // 24 hours

// app/dashboard/brews/page.tsx
// Always dynamic
export const dynamic = "force-dynamic";

// app/dashboard/beans/page.tsx
// Static by default
// No configuration needed
```

### Build Output Analysis

```bash
Route (app)                              Size     First Load JS
┌ ○ /                                   5.2 kB        85.3 kB
├ ○ /dashboard                          3.1 kB        83.2 kB  (ISR: 86400)
├ λ /dashboard/brews                    4.5 kB        84.6 kB
├ ○ /dashboard/beans                    2.8 kB        82.9 kB
└ λ /dashboard/brews/[id]              3.9 kB        84.0 kB

○  (Static)   prerendered as static HTML
λ  (Dynamic)  server-rendered on demand
```

### ✅ Acceptance Criteria

- [ ] Dashboard loads instantly (static)
- [ ] New brews appear immediately
- [ ] Build output shows correct rendering
- [ ] Proper cache headers set
- [ ] Revalidation works as expected

---

## 📋 Phase 2 Summary

By completing Phase 2, you've implemented:

- ✅ PostgreSQL database with relationships
- ✅ Direct SQL queries in Server Components
- ✅ Parallel data fetching patterns
- ✅ Static vs dynamic rendering strategies
- ✅ Optimized caching configuration

## 🎯 Key Concepts Learned

- Server Components can query databases directly
- No API layer needed for data fetching
- Parallel fetching prevents waterfalls
- Static rendering for performance
- Dynamic rendering for fresh data
- Route segment configuration

## 💡 Pro Tips

- Use `Promise.all()` for parallel queries
- Choose rendering strategy based on data freshness needs
- Static pages are cached at CDN edge
- Dynamic pages run on each request
- Revalidation updates static pages

## → Next Steps

Ready for advanced performance? [Continue to Phase 3](./phases-3-4-5.md)
