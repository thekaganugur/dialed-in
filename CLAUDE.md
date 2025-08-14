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
- `npm run seed` - Seed database with placeholder data

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
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Main dashboard with statistics
│   ├── brews/             # Brew logs and history
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   └── app-sidebar.tsx    # App navigation
├── lib/
│   ├── db/                # Database layer
│   │   ├── index.ts       # Drizzle client setup
│   │   ├── schema.ts      # Database schema definitions
│   │   └── data.ts        # Database queries and data fetching
│   ├── utils.ts           # Utility functions (cn helper)
│   └── definitions.ts     # Type definitions
components.json             # shadcn/ui configuration
drizzle.config.ts          # Drizzle ORM configuration
documentation/              # Phase-based learning documentation
```

### Key Architecture Patterns

- **Server Components First**: Default to Server Components, use `"use client"` sparingly
- **Progressive Enhancement**: Application works without JavaScript
- **URL State Management**: Use search params for filters and state
- **Server Actions**: Prefer Server Actions over separate API routes
- **Component Composition**: Uses shadcn/ui for consistent design system

### Database Schema

The application uses a PostgreSQL database with the following core entities:

- **Users**: Authentication and user management (text IDs for NextAuth compatibility)
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

**Current Status**: Phase 3 in progress - implementing individual brew detail pages with streaming, Server Actions for CRUD operations, and performance optimizations.

### Environment Setup

Required environment variables:
- `DATABASE_URL`: Neon PostgreSQL connection string (required for all database operations)

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

### Dependencies

Key libraries used in the project:
- **Forms**: React Hook Form + Zod for validation
- **Date handling**: date-fns for date manipulation
- **Debouncing**: use-debounce for search optimization
- **Calendar**: react-day-picker for date selection
