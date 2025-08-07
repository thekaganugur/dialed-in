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

### Utilities

- `npm run clean` - Clean build artifacts
- `npm run prebuild` - Automated pre-build checks (type-check + lint)

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type safety
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier + Husky + Commitlint

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
components.json             # shadcn/ui configuration
documentation/              # Phase-based learning documentation
```

### Key Architecture Patterns

- **Server Components First**: Default to Server Components, use `"use client"` sparingly
- **Progressive Enhancement**: Application works without JavaScript
- **URL State Management**: Use search params for filters and state
- **Server Actions**: Prefer Server Actions over separate API routes
- **Component Composition**: Uses shadcn/ui for consistent design system

### TypeScript Configuration

- Strict type checking enabled
- Path aliases configured: `@/components`, `@/lib`, `@/utils`, `@/ui`, `@/hooks`
- ESLint enforces unused variable rules with underscore prefix exception

### Styling System

- **Base**: Tailwind CSS 4 with CSS variables
- **Components**: shadcn/ui with "new-york" style
- **Theme**: Slate base color with CSS variables
- **Icons**: Lucide React icons
- **Fonts**: Geist Sans and Geist Mono

### Development Philosophy

The project follows a phased learning approach based on the Next.js tutorial:

1. **Phase 1**: Foundation (styling, navigation, layouts)
2. **Phase 2**: Database integration and data fetching
3. **Phase 3**: Performance optimization and streaming
4. **Phase 4**: Interactivity and CRUD operations
5. **Phase 5**: Production features (auth, SEO, accessibility)

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
