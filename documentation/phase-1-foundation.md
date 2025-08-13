# Phase 1: Foundation

**Next.js Tutorial Chapters 1-5**

Build the basic structure of your coffee logging app with styling and navigation.

---

## Story 1: Set Up Coffee Dashboard

**Chapter 1: Getting Started**

**As a** coffee enthusiast  
**I want** a dashboard homepage  
**So that** I can see my recent brews and stats

### What You'll Learn

- Setting up Next.js with TypeScript
- Creating folder structure (`/app`, `/app/lib`, `/app/ui`, `/public`)
- Making placeholder data for coffee logs
- TypeScript types for CoffeeLog, Bean, BrewMethod
- Running the development server

### Dashboard Components

- Today's brew count
- This week's average rating
- Favorite brewing method
- Current bean inventory

### Implementation Steps

1. Create the Next.js project with TypeScript
2. Set up folder structure matching the tutorial
3. Create `app/lib/definitions.ts` with types:

   ```typescript
   export type CoffeeBean = {
     id: string;
     name: string;
     roaster: string;
     origin: string;
     roast_level: "light" | "medium" | "dark";
   };

   export type CoffeeLog = {
     id: string;
     bean_id: string;
     method: string;
     rating: number;
     brew_date: string;
   };
   ```

4. Create placeholder data in `app/lib/placeholder-data.ts`
5. Build basic dashboard page

### ✅ Acceptance Criteria

- [x] Project runs on `localhost:3000`
- [x] TypeScript types defined for coffee data
- [x] Placeholder brew data created
- [x] Basic dashboard displays

---

## Story 2: Style the Coffee Journal

**Chapter 2: CSS Styling**

**As a** user  
**I want** a beautiful, coffee-themed design  
**So that** logging feels enjoyable

### What You'll Learn

- Global styles in `app/ui/global.css`
- Tailwind CSS utility classes
- CSS Modules for component styles
- Conditional styling with `clsx`
- Coffee-themed color palette

### Design System

```css
/* Coffee color palette */
--espresso: #3b2f2f --latte: #f5e6d3 --foam: #fefefe --robusta: #8b4513
  --arabica: #d2691e;
```

### Brew Method Badges

- **Espresso**: Dark brown badge
- **V60**: Orange badge
- **French Press**: Blue badge
- **Aeropress**: Red badge

### ✅ Acceptance Criteria

- [x] Coffee-themed colors applied
- [x] Brew method badges styled
- [x] Rating stars display (1-5)
- [x] Responsive layout works

---

## Story 3: Optimize Typography and Images

**Chapter 3: Optimizing Fonts and Images**

**As a** coffee lover  
**I want** beautiful typography and fast-loading photos  
**So that** my coffee journal looks professional

### What You'll Learn

- Custom fonts with `next/font/google`
- Font optimization and loading
- Image optimization with `next/image`
- Preventing layout shift
- Responsive images

### Font Strategy

```typescript
// app/ui/fonts.ts
import { Inter, Playfair_Display } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
});
```

### Images to Optimize

- Coffee bean photos
- Brewing equipment
- Hero image on login
- User avatars (future)

### ✅ Acceptance Criteria

- [x] Custom fonts implemented
- [x] Coffee photos optimized
- [x] Bean package images load fast
- [x] No layout shift on load

---

## Story 4: Create Layout Structure

**Chapter 4: Creating Layouts and Pages**

**As a** daily coffee drinker  
**I want** consistent navigation  
**So that** I can quickly log my brews

### What You'll Learn

- Root layout vs nested layouts
- Dashboard layout with sidebar
- Partial rendering benefits
- Route groups for organization

### Route Structure

```
/app
  /layout.tsx           # Root layout
  /page.tsx            # Landing page
  /login
    /page.tsx          # Login page
  /dashboard
    /layout.tsx        # Dashboard layout with sidebar
    /page.tsx          # Dashboard overview
    /brews
      /page.tsx        # All brew logs
      /create
        /page.tsx      # Create new brew
      /[id]
        /edit
          /page.tsx    # Edit brew
    /beans
      /page.tsx        # Bean inventory
    /analytics
      /page.tsx        # Coffee statistics
```

### Sidebar Navigation

- Dashboard (home icon)
- Brews (coffee icon)
- Beans (bean icon)
- Analytics (chart icon)
- Quick Add button (plus icon)

### ✅ Acceptance Criteria

- [x] Sidebar persists across pages
- [x] Layout doesn't re-render on navigation
- [x] Proper layout nesting
- [x] Mobile responsive navigation

---

## Story 5: Add Smooth Navigation

**Chapter 5: Navigating Between Pages**

**As a** user  
**I want** instant page transitions  
**So that** logging feels fast

### What You'll Learn

- `Link` component vs `<a>` tags
- Active link highlighting with `usePathname()`
- Client vs Server Components
- Automatic code splitting
- Prefetching behavior

### Navigation Implementation

```typescript
// app/ui/dashboard/nav-links.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            'flex items-center gap-2 p-3',
            {
              'bg-coffee-100': pathname === link.href,
            },
          )}
        >
          <link.icon />
          <p>{link.name}</p>
        </Link>
      ))}
    </>
  );
}
```

### ✅ Acceptance Criteria

- [x] All navigation uses Link component
- [x] Active page highlighted in sidebar
- [x] No full page reloads

---

## 📋 Phase 1 Summary

By completing Phase 1, you've built:

- ✅ A working Next.js app with TypeScript
- ✅ Optimized fonts and images
- ✅ Dashboard layout with sidebar
- ✅ Smooth client-side navigation

## 🎯 Key Concepts Learned

- Next.js project structure
- Server Components by default
- CSS styling options in Next.js
- Image and font optimization
- Layout system and nesting
- Client-side navigation with prefetching

## → Next Steps

Ready to add a database? [Continue to Phase 2](./phase-2-database.md)
