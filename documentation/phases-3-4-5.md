# Phases 3-5: Advanced Features

## ⚡ Phase 3: Performance

**Tutorial Chapters 9-10**

### Story 9: Stream Brewing Recommendations

**Chapter 9: Streaming**

Stream in complex calculations while showing main content immediately.

```tsx
// app/dashboard/brews/[id]/page.tsx
import { Suspense } from "react";

export default async function BrewPage({ params }: { params: { id: string } }) {
  return (
    <>
      <BrewDetails id={params.id} />

      <Suspense fallback={<RecommendationSkeleton />}>
        <BrewRecommendations id={params.id} />
      </Suspense>

      <Suspense fallback={<SimilarBrewsSkeleton />}>
        <SimilarBrews id={params.id} />
      </Suspense>
    </>
  );
}
```

**Key Learning**: Different parts of the page load independently.

### Story 10: Partial Prerendering

**Chapter 10: PPR (Experimental)**

Static shell with dynamic data holes.

```tsx
// app/dashboard/beans/page.tsx
export const experimental_ppr = true;

// Shell is static, brew counts are dynamic
export default async function BeansPage() {
  return (
    <div className="static-shell">
      <h1>Bean Inventory</h1>
      <Suspense fallback={<CountSkeleton />}>
        <BrewCountPerBean /> {/* Dynamic */}
      </Suspense>
    </div>
  );
}
```

---

## 🔧 Phase 4: Interactivity

**Tutorial Chapters 11-12**

### Story 11: Search and Filter

**Chapter 11: Search and Pagination**

URL-based state management for shareable searches.

```tsx
// app/dashboard/brews/page.tsx
export default async function BrewsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    method?: string;
    rating?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const filteredBrews = await fetchFilteredBrews(query, currentPage);

  return (
    <>
      <Search placeholder="Search brews..." />
      <MethodFilter />
      <RatingFilter />
      <BrewTable brews={filteredBrews} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
```

### Story 12-14: CRUD Operations

**Chapter 12: Mutating Data**

Server Actions for creating, updating, and deleting.

```tsx
// app/lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const BrewSchema = z.object({
  bean_id: z.string(),
  method_id: z.string(),
  dose_grams: z.coerce.number(),
  yield_grams: z.coerce.number(),
  rating: z.coerce.number().min(1).max(5),
});

export async function createBrew(formData: FormData) {
  const validatedFields = BrewSchema.parse({
    bean_id: formData.get("bean_id"),
    method_id: formData.get("method_id"),
    dose_grams: formData.get("dose_grams"),
    yield_grams: formData.get("yield_grams"),
    rating: formData.get("rating"),
  });

  await sql`
    INSERT INTO coffee_logs (bean_id, method_id, dose_grams, yield_grams, rating)
    VALUES (${validatedFields.bean_id}, ...)
  `;

  revalidatePath("/dashboard/brews");
  redirect("/dashboard/brews");
}

export async function updateBrew(id: string, formData: FormData) {
  // Validation and update logic
  revalidatePath("/dashboard/brews");
  redirect("/dashboard/brews");
}

export async function deleteBrew(id: string) {
  await sql`DELETE FROM coffee_logs WHERE id = ${id}`;
  revalidatePath("/dashboard/brews");
}
```

---

## 🛡️ Phase 5: Production Ready

**Tutorial Chapters 13-16**

### Story 15: Error Handling

**Chapter 13: Handling Errors**

Graceful error boundaries and 404 pages.

```tsx
// app/dashboard/brews/[id]/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/dashboard/brews/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Brew not found</h2>
      <p>Could not find the requested brew log.</p>
    </div>
  );
}
```

### Story 16: Accessibility

**Chapter 14: Improving Accessibility**

Full keyboard navigation and screen reader support.

```tsx
// Accessible form with ARIA labels
<form action={createBrew}>
  <label htmlFor="rating" className="sr-only">
    Rating
  </label>
  <select id="rating" name="rating" aria-describedby="rating-error" required>
    <option value="">Select rating</option>
    {[1, 2, 3, 4, 5].map((num) => (
      <option key={num} value={num}>
        {num} stars
      </option>
    ))}
  </select>
  <div id="rating-error" aria-live="polite" aria-atomic="true">
    {state.errors?.rating && (
      <p className="text-red-500">{state.errors.rating}</p>
    )}
  </div>
</form>
```

### Story 17-18: Authentication

**Chapter 15: Adding Authentication**

Protect routes with NextAuth.js.

```tsx
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// middleware.ts
import { auth } from "./app/api/auth/[...nextauth]/route";

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate user credentials
        const user = await getUser(credentials.email);
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
});

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### Story 19: SEO & Metadata

**Chapter 16: Adding Metadata**

Dynamic metadata for social sharing.

```tsx
// app/dashboard/brews/[id]/page.tsx
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const brew = await fetchBrew(params.id);

  return {
    title: `${brew.bean_name} - ${brew.method}`,
    description: `Rating: ${brew.rating}/5 - ${brew.notes}`,
    openGraph: {
      title: `${brew.bean_name} Brew`,
      description: brew.notes,
      images: ["/coffee-og.jpg"],
    },
  };
}
```

---

## 🎯 Quick Reference

### Server Actions Checklist

- [ ] Use `'use server'` directive
- [ ] Validate with Zod
- [ ] Call `revalidatePath()` after mutations
- [ ] Use `redirect()` for navigation
- [ ] Handle errors with try/catch

### Performance Tips

- Use Suspense for slow components
- Stream in non-critical content
- Static for rarely changing data
- Dynamic for real-time needs
- PPR for best of both worlds

### Security Must-Haves

- [ ] Authentication on all dashboard routes
- [ ] Hash passwords with bcrypt
- [ ] Validate all form inputs
- [ ] Escape SQL queries
- [ ] CSRF protection (built-in with Server Actions)

### Accessibility Essentials

- [ ] Semantic HTML
- [ ] ARIA labels on forms
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Error announcements
- [ ] Color contrast 4.5:1

---

## 🚀 Deployment Checklist

Before going to production:

1. **Environment Variables**
   - [ ] Database URL secured
   - [ ] NextAuth secret set
   - [ ] Production URLs configured

2. **Database**
   - [ ] Migrations run
   - [ ] Indexes created
   - [ ] Backups configured

3. **Performance**
   - [ ] Images optimized
   - [ ] Fonts subset
   - [ ] Static pages identified
   - [ ] Cache headers set

4. **Security**
   - [ ] Auth required on private routes
   - [ ] Input validation everywhere
   - [ ] Rate limiting configured
   - [ ] HTTPS enforced

5. **SEO**
   - [ ] Metadata on all pages
   - [ ] Sitemap generated
   - [ ] Robots.txt configured
   - [ ] Open Graph images
