# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dialed In is a Next.js coffee logging application that helps coffee enthusiasts track their daily brews and improve their brewing technique. Originally built as a learning project following the Next.js tutorial structure, it has evolved into a real personal project for coffee logging and analysis.

## Common Commands

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production (includes type-check and lint)
- `npm run start` - Start production server

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run type-check` - TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting
- `npm run fix` - Run lint:fix and format together

### Testing

- `npm test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI

### Database

- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Apply migrations to database
- `npm run db:studio` - Open Drizzle Studio GUI
- `docker compose up -d` - Start local PostgreSQL database (development)
- `docker compose down` - Stop local PostgreSQL database

### Utilities

- `npm run clean` - Clean build artifacts
- `npm run prebuild` - Automated pre-build checks (type-check + lint)

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type safety
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier + Husky + Commitlint

### Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── app/                      # Main application routes (prefixed with /app)
│   │   ├── beans/                # Coffee bean management
│   │   ├── brews/                # Brew logs and history with CRUD
│   │   ├── page.tsx              # Dashboard with statistics
│   │   └── layout.tsx            # Application layout with sidebar
│   ├── (marketing)/              # Route group for public pages
│   │   ├── page.tsx              # Landing page
│   │   ├── login/                # User login
│   │   └── signup/               # User registration
│   ├── share/                    # Public sharing routes
│   │   └── brew/[brewId]/        # Public brew sharing pages
│   ├── api/auth/[...all]/        # Better Auth API endpoints
│   ├── layout.tsx                # Root layout with fonts
│   ├── globals.css               # Global styles
│   └── ui/fonts.ts               # Font configuration
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── app-sidebar.tsx           # App navigation sidebar
│   ├── breadcrumb-nav.tsx        # Navigation breadcrumbs
│   ├── nav-user.tsx              # User dropdown menu
│   ├── star-rating.tsx           # Rating components
│   └── quick-rating.tsx          # Quick rating component
├── hooks/
│   └── use-mobile.ts             # Mobile detection hook
├── lib/
│   ├── db/                       # Database layer
│   │   ├── index.ts              # Drizzle client setup
│   │   ├── schema.ts             # Database schema definitions
│   │   └── data.ts               # Database queries and data fetching
│   ├── auth.ts                   # Better Auth configuration
│   ├── auth-client.ts            # Client-side auth utilities
│   ├── auth-utils.ts             # Server-side auth utilities
│   ├── definitions.ts            # Type definitions
│   └── utils.ts                  # Utility functions (cn helper)
├── middleware.ts                  # Auth middleware
components.json                    # shadcn/ui configuration
drizzle.config.ts                 # Drizzle ORM configuration
documentation/                     # Phase-based learning documentation
```

### Key Architecture Patterns

- **Server Components First**: Default to Server Components, use `"use client"` sparingly
- **Route Structure**: `/app` prefix for authenticated application routes, `(marketing)` group for public pages
- **Progressive Enhancement**: Application works without JavaScript
- **URL State Management**: Use search params for filters and state
- **Server Actions**: Prefer Server Actions over separate API routes
- **Component Composition**: Uses shadcn/ui for consistent design system
- **Auth Middleware**: Route-level protection using Next.js middleware

### Database Schema

The application uses a PostgreSQL database with the following core entities:

- **Users**: Authentication and user management using Better Auth (text IDs for compatibility)
- **Coffee Beans**: Track coffee bean purchases with roast level, origin, processing method and roastery
- **Coffee Logs**: Main entity tracking individual brews with ratings, parameters, and notes
- **Brew Methods**: Reference data for brewing equipment and default parameters

Key schema features:

- Type-safe enums for roast levels, processing methods, and brew methods
- Comprehensive constraints and indexes for performance
- Soft delete support on coffee logs with `deletedAt` timestamp
- Timezone-aware timestamps for international users
- Relations defined for type-safe joins using Drizzle

### TypeScript Configuration

- Strict type checking enabled
- Path aliases configured: `@/*` maps to `./src/*`
- ESLint enforces unused variable rules with underscore prefix exception

### Styling System

- **Base**: Tailwind CSS 4 with CSS variables
- **Components**: shadcn/ui with "new-york" style
- **Theme**: Slate base color with CSS variables
- **Icons**: Lucide React icons
- **Fonts**: Geist Sans and Geist Mono

### Development Philosophy

The project has evolved from a learning exercise to a production-ready coffee logging application. The development approach emphasizes:

- **User-centered design**: Features are built based on real coffee brewing needs
- **Progressive enhancement**: Core functionality works without JavaScript
- **Performance first**: Optimized for fast loading and smooth interactions
- **Type safety**: Comprehensive TypeScript usage throughout
- **Modern React patterns**: Server Components, Server Actions, and streaming

**Current Status**: Full-featured application with complete CRUD operations, authentication, dashboard analytics, and advanced search capabilities.

### Environment Setup

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string (required for all database operations)
  - Production: Neon PostgreSQL connection string
  - Development: Can use local Docker PostgreSQL (`postgresql://postgres:devpass@localhost:5432/appdb`)
- `BETTER_AUTH_SECRET`: Secret key for Better Auth session management (required for authentication)
- `BETTER_AUTH_URL`: Base URL for Better Auth (defaults to localhost:3000 in development)

### Local Development Database

The project includes Docker Compose for local PostgreSQL development:

- Uses PostgreSQL 16 with persistent data volume
- Default credentials: `postgres`/`devpass` on port 5432
- Database name: `appdb`
- Alternative to hosted Neon database for development

### Code Quality Standards

- Conventional commits enforced via commitlint
- Husky git hooks for pre-commit validation
- Prettier with import sorting and Tailwind class sorting
- ESLint with Next.js and TypeScript rules
- Auto-formatting on save recommended

### Testing Strategy

- Vitest for unit/integration tests
- jsdom environment for React component testing
- React Testing Library for component testing
- Test files should be co-located

### Authentication System

The app uses Better Auth for authentication:

- Email/password authentication enabled
- Drizzle adapter for database integration
- Next.js cookies plugin for session management
- User tables integrated with coffee data via foreign keys

### Data Access Patterns

All database operations use Server Actions and direct Drizzle queries:

- Actions are co-located with pages in `actions.ts` files
- Form validation uses Zod schemas in `schemas.ts` files
- No API routes - Server Actions handle all mutations
- Data fetching functions centralized in `src/lib/db/data.ts`
- Soft delete pattern implemented for coffee logs
- **Request-level caching**: Use React's `cache()` function for database queries to prevent duplicate calls within the same render pass (required for ORM/DB calls, unlike `fetch` which is automatically memoized)

### Sharing System

The application includes a public sharing feature for individual brews:

- **Private by Default**: All brews are private by default
- **Public Sharing**: Users can make individual brews public via share button
- **Public Pages**: Shared brews have dedicated public pages at `/share/brew/[brewId]`
- **No Auth Required**: Public brew pages accessible without authentication
- **Marketing Integration**: Public pages include CTAs to join the platform
- **Toggle Privacy**: Users can make public brews private again at any time
- **SEO Optimized**: Public pages include comprehensive Open Graph and Twitter Card metadata for social sharing

### Current Implementation Status

- ✅ **Authentication**: Better Auth with email/password
- ✅ **Coffee Bean Management**: Full CRUD operations
- ✅ **Brew Logging**: Create, read, update, delete with ratings
- ✅ **Dashboard**: Statistics with aggregated data
- ✅ **Search & Filtering**: Real-time search with debouncing
- ✅ **Navigation**: Breadcrumbs and sidebar navigation
- ✅ **User Context**: Uses actual user ID from Better Auth session
- ✅ **Public Sharing**: Share individual brews publicly with dedicated public pages and social media optimization

### Dependencies

Key libraries used in the project:

- **Authentication**: Better Auth with Drizzle adapter
- **Forms**: React Hook Form + Zod for validation
- **Date handling**: date-fns for date manipulation
- **Debouncing**: use-debounce for search optimization
- **Calendar**: react-day-picker for date selection
- **Notifications**: Sonner for toast notifications
- **Themes**: next-themes for dark mode support

## Rules

1. **Edge Runtime by Default** – Add `export const runtime = "edge"` to all pages and route handlers unless Node APIs are required; never import `fs`, `net`, etc.
2. **Server Components First** – Generate components as Server Components by default; add `"use client"` only to files needing interactivity or browser APIs.
3. **Styling Rules** – Use Tailwind CSS utility classes or shadcn/ui components exclusively; no custom CSS files, inline styles, or other frameworks.
4. **Database Access** – Use Drizzle ORM with typed schemas in server-only modules; import the singleton `db` instance in Server Components, Server Actions, or route handlers only.
5. **Authentication** – Implement with Better Auth’s official Next.js integration (`/api/auth/[...all]/route.ts` + `nextCookies()` plugin); use its hooks and client helpers for auth flows.
6. **Routing Structure** – Follow App Router conventions with `layout.tsx` for shared UI, route groups `(group)` for organization, and `route.ts` files for API endpoints.
7. **Mutations** – Handle create/update/delete via `'use server'` Server Actions or POST route handlers; call `revalidatePath`/`revalidateTag` after mutations.
8. **Streaming UX** – Provide `loading.tsx` in segments with async data for streaming feedback; use skeletons or placeholders.
9. **Error Boundaries** – Include `error.tsx` per route segment as a `"use client"` component with `error` and `reset` props to display fallback UI and retry.
10. **Caching & ISR** – Default to static generation with `export const revalidate = N` or fetch `{ next: { revalidate: N } }`; use `dynamic = "force-dynamic"` only when real-time data is required.
