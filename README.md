# ☕ Dialed In - Next.js Coffee Logger

A personal coffee logging app built while learning Next.js fundamentals.  
Track your daily brews, improve your technique, and master Next.js.

## 📚 Project Structure

This project follows the official Next.js tutorial structure, divided into digestible phases:

| Phase                | Tutorial Chapters | What You'll Build                        | File                                               |
| -------------------- | ----------------- | ---------------------------------------- | -------------------------------------------------- |
| **1. Foundation**    | Ch 1-5            | Basic app structure, styling, navigation | [→ Phase 1](./documentation/phase-1-foundation.md) |
| **2. Database**      | Ch 6-8            | Database setup, data fetching, rendering | [→ Phase 2](./documentation/phase-2-database.md)   |
| **3. Performance**   | Ch 9-10           | Streaming, Partial Prerendering          | [→ Phase 3](./documentation/phases-3-4-5.md)       |
| **4. Interactivity** | Ch 11-12          | Search, CRUD operations                  | [→ Phase 4](./documentation/phases-3-4-5.md)       |
| **5. Production**    | Ch 13-16          | Errors, a11y, auth, SEO                  | [→ Phase 5](./documentation/phases-3-4-5.md)       |

## 📊 Data Model Overview

The app tracks four main entities:

- **Coffee Beans** - Your bean inventory
- **Brew Methods** - Espresso, V60, Chemex, etc.
- **Coffee Logs** - Individual brew records
- **Equipment** - Your coffee gear

See [data-model.md](./documentation/data-model.md) for complete schema.

## ✅ Learning Checklist

Track your progress through each phase:

- [ ] **Phase 1**: App structure, styling, navigation
- [ ] **Phase 2**: Database, data fetching
- [ ] **Phase 3**: Streaming, PPR
- [ ] **Phase 4**: Search, CRUD with Server Actions
- [ ] **Phase 5**: Production features

## 🚀 How to Use This Guide

1. **Start with Phase 1** - Build the foundation
2. **Complete each story in order** - They build on each other
3. **Check off acceptance criteria** - Know when you're done
4. **Compare with the tutorial** - Ensure you're learning the concepts
5. **Test after each story** - Make sure everything works

## 💡 Key Learning Goals

By the end of this project, you'll understand:

- **Server vs Client Components** - When to use each
- **Data Fetching Patterns** - Direct SQL in components
- **Server Actions** - Forms without API routes
- **Rendering Strategies** - Static, dynamic, streaming, PPR
- **Production Features** - Auth, SEO, accessibility

## 🎨 What Makes This Special

Unlike generic tutorial projects, BrewLog is:

- **Personal** - You'll actually use it daily
- **Unique** - Stand out in your portfolio
- **Practical** - Solves a real problem
- **Expandable** - Grow it with your coffee journey

## 📝 Project Conventions

- **TypeScript** - Type safety throughout
- **Server Components by default** - Use `"use client"` sparingly
- **Server Actions** - No separate API routes
- **URL state** - Search params for filters
- **Progressive Enhancement** - Works without JavaScript

Ready to start? [→ Begin with Phase 1](./documentation/phase-1-foundation.md)
