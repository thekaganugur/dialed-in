# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BrewLog is a Next.js coffee logging application built as a learning project following the official Next.js tutorial structure. The app helps coffee enthusiasts track their daily brews, improve technique, and master Next.js fundamentals through a phased approach.

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
│   ├── (dashboard)/              # Route group for authenticated pages
│   │   ├── dashboard/            # Main dashboard with statistics
│   │   ├── brews/                # Brew logs and history with CRUD
│   │   ├── beans/                # Coffee bean management
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── (marketing)/              # Route group for public pages
│   │   ├── page.tsx              # Landing page
│   │   └── signup/               # User registration
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
- **Route Groups**: `(dashboard)` and `(marketing)` for different layouts without affecting URLs
- **Progressive Enhancement**: Application works without JavaScript
- **URL State Management**: Use search params for filters and state
- **Server Actions**: Prefer Server Actions over separate API routes
- **Component Composition**: Uses shadcn/ui for consistent design system
- **Auth Middleware**: Route-level protection using Next.js middleware

### Database Schema

The application uses a PostgreSQL database with the following core entities:

- **Users**: Authentication and user management using Better Auth (text IDs for compatibility)
- **Coffee Beans**: Track coffee bean purchases with roast level, origin, processing method
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

The project follows a phased learning approach based on the Next.js tutorial:

1. **Phase 1**: Foundation (styling, navigation, layouts) ✅ Completed
2. **Phase 2**: Database integration and data fetching 🚧 In Progress
3. **Phase 3**: Performance optimization and streaming
4. **Phase 4**: Interactivity and CRUD operations
5. **Phase 5**: Production features (auth, SEO, accessibility)

**Current Status**: Phase 4+ in progress - Full CRUD operations implemented with Server Actions, authentication with Better Auth, individual brew detail pages with edit/delete functionality.

### Environment Setup

Required environment variables:

- `DATABASE_URL`: Neon PostgreSQL connection string (required for all database operations)
- `BETTER_AUTH_SECRET`: Secret key for Better Auth session management (required for authentication)
- `BETTER_AUTH_URL`: Base URL for Better Auth (defaults to localhost:3000 in development)

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

### Current Implementation Status

- ✅ **Authentication**: Better Auth with email/password
- ✅ **Coffee Bean Management**: Full CRUD operations
- ✅ **Brew Logging**: Create, read, update, delete with ratings
- ✅ **Dashboard**: Statistics with aggregated data
- ✅ **Search & Filtering**: Real-time search with debouncing
- ✅ **Navigation**: Breadcrumbs and sidebar navigation
- ✅ **User Context**: Uses actual user ID from Better Auth session

### Dependencies

Key libraries used in the project:

- **Authentication**: Better Auth with Drizzle adapter
- **Forms**: React Hook Form + Zod for validation
- **Date handling**: date-fns for date manipulation
- **Debouncing**: use-debounce for search optimization
- **Calendar**: react-day-picker for date selection
