# BrewLog User Stories - Next.js Coffee Logger

## ☕ Learning Path Overview

Build a personal coffee logging app while mastering Next.js.  
Track your daily brews, rate them, and improve your coffee game.  
Each section maps directly to the official Next.js tutorial chapters.

---

## 🏗️ Phase 1: Foundation

**Tutorial Chapters 1-5: Getting Started → Navigation**

### Story 1: Set Up Coffee Dashboard

**As a** coffee enthusiast  
**I want** a dashboard homepage  
**So that** I can see my recent brews and stats

**You'll Learn:**

- Setting up Next.js with TypeScript
- Creating folder structure (`/app`, `/app/lib`, `/app/ui`, `/public`)
- Making placeholder data for coffee logs
- TypeScript types for CoffeeLog, Bean, BrewMethod
- Running the development server

**Dashboard Shows:**

- Today's brews
- This week's average rating
- Favorite brewing method
- Current bean inventory

**Acceptance Criteria:**

- [ ] Project runs on `localhost:3000`
- [ ] TypeScript types defined for coffee data
- [ ] Placeholder brew data created
- [ ] Basic dashboard displays

---

### Story 2: Style the Coffee Journal

**As a** user  
**I want** a beautiful, coffee-themed design  
**So that** logging feels enjoyable

**You'll Learn:**

- Global styles in `app/ui/global.css`
- Tailwind CSS utility classes
- CSS Modules for component styles
- Conditional styling with `clsx`
- Coffee-themed color palette

**Visual Design:**

- Brown/cream color scheme
- Brew method badges (Espresso: dark brown, V60: orange, French Press: blue)
- Rating stars (1-5 scale)
- Coffee bean icons

**Acceptance Criteria:**

- [ ] Coffee-themed colors applied
- [ ] Brew method badges styled
- [ ] Rating display styled
- [ ] Responsive layout works

---

### Story 3: Optimize Fonts and Coffee Images

**As a** coffee lover  
**I want** beautiful typography and fast-loading photos  
**So that** my coffee journal looks professional

**You'll Learn:**

- Custom fonts with `next/font/google`
- Primary font for UI, secondary for headings
- Image optimization with `next/image`
- Coffee bean/equipment photos
- Preventing layout shift

**Acceptance Criteria:**

- [ ] Custom fonts loaded
- [ ] Coffee photos optimized
- [ ] Bean package images work
- [ ] No layout shift on load

---

### Story 4: Create Layout Structure

**As a** daily coffee drinker  
**I want** consistent navigation  
**So that** I can quickly log my brews

**You'll Learn:**

- Root layout vs nested layouts
- Dashboard layout with sidebar
- Quick-add brew button
- Route organization

**Navigation Structure:**

```
/app
  /layout.tsx (root)
  /dashboard
    /layout.tsx (dashboard with sidebar)
    /page.tsx (overview)
    /brews
      /page.tsx (all logs)
      /new
      /[id]/edit
    /beans
      /page.tsx (bean inventory)
    /equipment
      /page.tsx (brewing equipment)
    /analytics
      /page.tsx (coffee stats)
```

**Acceptance Criteria:**

- [ ] Sidebar stays visible
- [ ] Quick-add button always accessible
- [ ] Layout doesn't re-render
- [ ] Mobile responsive navigation

---

### Story 5: Add Smooth Navigation

**As a** user  
**I want** instant page transitions  
**So that** logging feels fast

**You'll Learn:**

- `Link` component benefits
- Active link highlighting
- Client vs Server Components
- Prefetching behavior
- Navigation patterns

**Navigation Elements:**

- Dashboard home
- Brew logs
- Bean inventory
- Equipment setup
- Analytics/trends

**Acceptance Criteria:**

- [ ] All links use Link component
- [ ] Active page highlighted
- [ ] Breadcrumbs for context
- [ ] No full page reloads

---

## 💾 Phase 2: Database and Data Fetching

**Tutorial Chapters 6-8: Database → Rendering**

### Story 6: Set Up Coffee Database

**As a** serious coffee tracker  
**I need** permanent storage  
**So that** my logs aren't lost

**You'll Learn:**

- Vercel Postgres setup
- Database schema design
- Seeding sample data
- Environment variables
- SQL with `postgres` library

**Database Schema:**

```sql
-- Coffee Beans table
id UUID PRIMARY KEY
name VARCHAR(255)
roaster VARCHAR(255)
origin VARCHAR(255)
roast_level VARCHAR(50) -- light/medium/dark
process VARCHAR(50) -- washed/natural/honey
purchase_date DATE
price DECIMAL
rating INTEGER
notes TEXT

-- Brew Methods table
id UUID PRIMARY KEY
name VARCHAR(100) -- Espresso/V60/Chemex/FrenchPress
temperature INTEGER -- celsius
grind_size VARCHAR(50)
brew_time INTEGER -- seconds

-- Coffee Logs table
id UUID PRIMARY KEY
bean_id UUID REFERENCES beans
method_id UUID REFERENCES methods
brew_date TIMESTAMP
dose DECIMAL -- grams of coffee
yield DECIMAL -- grams of output
brew_time INTEGER -- seconds
water_temp INTEGER -- celsius
grind_setting VARCHAR(50)
rating INTEGER -- 1-5
notes TEXT
flavor_notes TEXT[] -- array of flavors

-- Equipment table
id UUID PRIMARY KEY
name VARCHAR(255)
type VARCHAR(100) -- grinder/brewer/scale
brand VARCHAR(255)
purchase_date DATE
notes TEXT
```

**Acceptance Criteria:**

- [ ] Database connected
- [ ] Tables created with relationships
- [ ] Sample data seeded
- [ ] Can query coffee logs

---

### Story 7: Fetch Coffee Statistics

**As a** coffee nerd  
**I want** to see my brewing patterns  
**So that** I can improve my technique

**You'll Learn:**

- Server Components for data
- Direct SQL queries
- Async/await in components
- Aggregation queries
- Parallel data fetching

**Dashboard Metrics:**

- Total brews this month
- Average rating by method
- Most used beans
- Optimal brew parameters
- Flavor profile trends
- Cost per cup

**Acceptance Criteria:**

- [ ] All metrics from database
- [ ] Parallel fetching with Promise.all()
- [ ] Type-safe queries
- [ ] No loading waterfalls

---

### Story 8: Optimize Page Rendering

**As a** user  
**I want** instant dashboard loads  
**But** fresh data in brew logs

**You'll Learn:**

- Static vs dynamic rendering
- When to use each
- Route segment config
- Caching strategies
- Build output analysis

**Rendering Strategy:**

- Dashboard: Static (daily revalidation)
- Individual brew logs: Dynamic
- Bean inventory: Static with on-demand revalidation
- Analytics: Dynamic (always fresh)

**Acceptance Criteria:**

- [ ] Dashboard loads instantly
- [ ] New brews appear immediately
- [ ] Build shows static pages
- [ ] Correct cache headers

---

## ⚡ Phase 3: Advanced Performance

**Tutorial Chapters 9-10: Streaming → PPR**

### Story 9: Stream Brewing Recommendations

**As a** coffee explorer  
**I want** instant page loads  
**While** recommendations calculate

**You'll Learn:**

- React Suspense
- Loading.tsx files
- Streaming SSR
- Loading skeletons
- Progressive enhancement

**Streaming Strategy:**

```tsx
// Instant display
<BrewDetails />

// Stream in after
<Suspense fallback={<RecommendationSkeleton />}>
  <BrewRecommendations />
</Suspense>

<Suspense fallback={<FlavorWheelSkeleton />}>
  <FlavorAnalysis />
</Suspense>
```

**Acceptance Criteria:**

- [ ] Core content loads first
- [ ] Recommendations stream in
- [ ] Smooth skeleton transitions
- [ ] No blocking operations

---

### Story 10: Partial Prerendering for Speed

**As a** daily user  
**I want** instant navigation  
**With** real-time statistics

**You'll Learn:**

- Partial Prerendering (PPR)
- Static shells
- Dynamic holes
- Performance benefits

**PPR Implementation:**

- Bean list shell: Static
- Brew counts: Dynamic
- Page chrome: Static
- Personal stats: Dynamic

**Acceptance Criteria:**

- [ ] Instant page shells
- [ ] Dynamic data updates
- [ ] Single HTTP request
- [ ] Improved Core Web Vitals

---

## 🔧 Phase 4: Interactivity

**Tutorial Chapters 11-12: Search/Pagination → Mutations**

### Story 11: Search and Filter Brews

**As a** coffee historian  
**I want** to find specific brews  
**And** analyze patterns

**You'll Learn:**

- URL Search Params
- useSearchParams hook
- Debouncing
- Server-side pagination
- Filter combinations

**Search Features:**

- Search by bean name
- Filter by brew method
- Filter by rating (1-5)
- Date range picker
- Pagination (10 per page)

**Filter Examples:**

```
/brews?search=ethiopia&method=v60&rating=5
/brews?date_from=2024-01&date_to=2024-12
```

**Acceptance Criteria:**

- [ ] URL updates with filters
- [ ] Debounced search (300ms)
- [ ] Multiple filters work together
- [ ] Shareable filter URLs
- [ ] Back button preserves state

---

### Story 12: Log New Brew

**As a** coffee drinker  
**I want** to quickly log my brew  
**With** all parameters tracked

**You'll Learn:**

- Server Actions
- Form handling
- FormData API
- Zod validation
- Progressive enhancement

**Brew Log Form:**

```typescript
{
  bean_id: string (required)
  method_id: string (required)
  dose: number // grams
  yield: number // grams
  brew_time: number // seconds
  water_temp: number // celsius
  grind_setting: string
  rating: 1 | 2 | 3 | 4 | 5
  notes: string
  flavor_notes: string[] // checkboxes
}
```

**Quick Log Options:**

- Repeat last brew
- Templates for methods
- Timer integration
- Photo upload

**Acceptance Criteria:**

- [ ] Form works without JS
- [ ] Validation feedback
- [ ] Redirects after save
- [ ] Stores in database
- [ ] Time auto-captured

---

### Story 13: Edit Brew Details

**As a** perfectionist  
**I want** to update my notes  
**After** tasting the coffee

**You'll Learn:**

- Dynamic routes `[id]`
- Server Actions with bind()
- Form pre-population
- Cache revalidation
- Update patterns

**Editable Fields:**

- Rating (often updated later)
- Tasting notes
- Flavor profile
- Brewing parameters
- Photos

**Acceptance Criteria:**

- [ ] Form pre-filled with data
- [ ] URL has brew ID
- [ ] Instant updates
- [ ] History preserved
- [ ] Validation on edit

---

### Story 14: Delete Old Logs

**As a** user  
**I want** to remove test brews  
**Without** losing real data

**You'll Learn:**

- Delete Server Actions
- Confirmation UX
- Soft vs hard delete
- Cache updates
- Undo patterns

**Acceptance Criteria:**

- [ ] Delete with confirmation
- [ ] No page navigation
- [ ] List updates immediately
- [ ] Can't delete last brew of a bean

---

## 🛡️ Phase 5: Production Ready

**Tutorial Chapters 13-14: Errors → Accessibility**

### Story 15: Handle Errors Gracefully

**As a** user  
**I want** helpful error messages  
**When** something goes wrong

**You'll Learn:**

- error.tsx boundaries
- not-found.tsx pages
- Form error handling
- Database error recovery
- User-friendly messages

**Error Scenarios:**

- Bean not found
- Invalid brew parameters
- Database offline
- Photo upload fails
- Duplicate log detection

**Acceptance Criteria:**

- [ ] Custom error pages
- [ ] Helpful error messages
- [ ] 404 for missing brews
- [ ] Form validation shown
- [ ] Recovery suggestions

---

### Story 16: Make It Accessible

**As a** user with disabilities  
**I want** full keyboard control  
**And** screen reader support

**You'll Learn:**

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast
- Screen reader testing

**Accessibility Features:**

- Tab through all controls
- Announce form errors
- Describe charts/graphs
- Keyboard shortcuts
- High contrast mode

**Acceptance Criteria:**

- [ ] All forms keyboard accessible
- [ ] ARIA labels on buttons
- [ ] Rating stars keyboard selectable
- [ ] Skip to main content
- [ ] Focus indicators visible

---

## 🔐 Phase 6: Authentication

**Tutorial Chapter 15: Authentication**

### Story 17: Personal Coffee Journal

**As a** coffee lover  
**I want** my private coffee log  
**Protected** with login

**You'll Learn:**

- NextAuth.js setup
- Credentials provider
- Session management
- Protected routes
- Social login options

**Auth Features:**

- Email/password login
- Google OAuth option
- Remember me
- Password reset
- Session timeout

**Acceptance Criteria:**

- [ ] Login page works
- [ ] Dashboard requires auth
- [ ] Sessions persist
- [ ] Logout clears session
- [ ] Redirect to login when needed

---

### Story 18: Share Coffee Journey

**As a** social coffee drinker  
**I want** to share some brews  
**While** keeping others private

**You'll Learn:**

- User-scoped data
- Public vs private logs
- Sharing mechanisms
- Profile pages
- Following system

**Sharing Features:**

- Public profile page
- Share individual brews
- Coffee statistics
- Favorite beans list
- Follow other coffee lovers

**Acceptance Criteria:**

- [ ] Only see own logs
- [ ] Can mark brews public
- [ ] Public profile works
- [ ] Share URLs work
- [ ] Privacy respected

---

## 🎯 Phase 7: SEO and Polish

**Tutorial Chapter 16: Metadata**

### Story 19: Beautiful Brew Shares

**As a** coffee influencer  
**I want** nice preview cards  
**When** sharing my best brews

**You'll Learn:**

- Dynamic metadata
- Open Graph images
- Twitter cards
- SEO optimization
- generateMetadata function

**Metadata Features:**

```typescript
// Dynamic brew metadata
export async function generateMetadata({ params }) {
  const brew = await fetchBrew(params.id);
  return {
    title: `${brew.bean_name} - ${brew.method}`,
    description: `Rating: ${brew.rating}/5 - ${brew.notes}`,
    openGraph: {
      images: [brew.photo_url],
    },
  };
}
```

**Share Preview Shows:**

- Coffee photo
- Bean name
- Brew method
- Rating stars
- Date

**Acceptance Criteria:**

- [ ] Each brew has metadata
- [ ] Social previews work
- [ ] Bean pages have SEO
- [ ] Profile pages indexed
- [ ] Rich snippets enabled

---

## 📊 Complete Data Model

```typescript
// Core Types
type CoffeeBean = {
  id: string;
  name: string;
  roaster: string;
  origin: string;
  roast_level: "light" | "medium" | "medium-dark" | "dark";
  process: "washed" | "natural" | "honey" | "anaerobic";
  purchase_date: string;
  price: number;
  weight_grams: number;
  rating: number;
  notes: string;
  created_at: string;
};

type BrewMethod = {
  id: string;
  name:
    | "espresso"
    | "v60"
    | "chemex"
    | "aeropress"
    | "french-press"
    | "moka-pot";
  default_temp: number;
  default_time: number;
  default_ratio: string; // "1:2" for espresso, "1:15" for filter
  grind_size: string;
  notes: string;
};

type CoffeeLog = {
  id: string;
  user_id: string;
  bean_id: string;
  method_id: string;
  brew_date: string;
  dose_grams: number;
  yield_grams: number;
  brew_time_seconds: number;
  water_temp_celsius: number;
  grind_setting: string;
  rating: 1 | 2 | 3 | 4 | 5;
  notes: string;
  flavor_notes: string[]; // ['chocolate', 'berry', 'citrus']
  photo_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

type Equipment = {
  id: string;
  user_id: string;
  name: string;
  type: "grinder" | "brewer" | "scale" | "kettle";
  brand: string;
  model: string;
  purchase_date: string;
  notes: string;
};

type FlavorProfile = {
  id: string;
  log_id: string;
  acidity: number; // 1-10
  body: number; // 1-10
  sweetness: number; // 1-10
  bitterness: number; // 1-10
  aftertaste: number; // 1-10
};
```

---

## ✅ Complete Learning Checklist

### Phase 1: Foundation

- [ ] Next.js project with TypeScript
- [ ] Coffee-themed styling
- [ ] Custom fonts working
- [ ] Images optimized
- [ ] Layouts configured
- [ ] Navigation smooth

### Phase 2: Database

- [ ] Postgres connected
- [ ] Schema created
- [ ] Data seeding works
- [ ] Queries returning data
- [ ] Rendering optimized

### Phase 3: Performance

- [ ] Streaming implemented
- [ ] Loading states smooth
- [ ] PPR configured

### Phase 4: Interactivity

- [ ] Search and filters work
- [ ] Pagination implemented
- [ ] Create brew form works
- [ ] Edit/delete functional
- [ ] Server Actions used

### Phase 5: Production

- [ ] Errors handled gracefully
- [ ] 404 pages work
- [ ] Fully accessible
- [ ] Keyboard navigable

### Phase 6: Security

- [ ] Auth implemented
- [ ] Routes protected
- [ ] Sessions work
- [ ] Data scoped to user

### Phase 7: Polish

- [ ] SEO metadata added
- [ ] Social previews work
- [ ] Shareable brew links

---

## 🚀 Getting Started Commands

```bash
# Create the project
npx create-next-app@latest brewlog --typescript --tailwind --app

# Install dependencies
npm install @vercel/postgres zod bcrypt
npm install @types/bcrypt --save-dev

# Additional packages for coffee app
npm install react-select  # For flavor selection
npm install recharts      # For brewing charts
npm install date-fns      # For date handling

# Database setup
vercel env pull .env.development.local

# Run development
npm run dev
```

---

## ☕ Coffee-Specific Features to Add Later

Once you complete the tutorial concepts, enhance with:

1. **Brew Timer** - Live timer during brewing
2. **Bean Roast Tracker** - Track age of beans
3. **Cupping Scores** - Professional scoring system
4. **Recipe Templates** - Save and share recipes
5. **Extraction Calculator** - Calculate TDS/extraction
6. **Inventory Alerts** - Low bean warnings
7. **Cost Analysis** - Price per cup tracking
8. **Export Data** - CSV export for analysis
9. **Photo Gallery** - Visual brew diary
10. **Weather Integration** - Track brewing conditions

---

## 📝 Why This Project Is Perfect

1. **Personal & Useful** - You'll actually use it daily
2. **Real Problem** - Solves actual coffee tracking needs
3. **Unique Portfolio** - Not another todo or invoice app
4. **Same Learning** - Covers all Next.js concepts
5. **Expandable** - Can grow with your coffee journey
6. **Shareable** - Other coffee lovers would use it

---

## 🔗 Resources

- [Next.js Official Tutorial](https://nextjs.org/learn)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Coffee Flavor Wheel](https://sca.coffee/research/coffee-tasters-flavor-wheel)

---

_Track every brew, improve your coffee, and master Next.js - one cup at a time._
