# Plan

## Brews

Missing Key Features 🚧

1. CRUD Operations

- Create brew form (/brews/create - button links here but doesn't exist)
- Edit brew functionality
- Delete brew capability
- Individual brew detail pages (/brews/[id])

2. Data Management

- Sorting (by date, rating, method)
- Pagination (currently shows all, could be performance issue)

3. Advanced Features

- Photo display (schema has photoUrl field unused - src/lib/db/schema.ts:144)
- Flavor notes (schema has flavorNotes field unused - src/lib/db/schema.ts:143)
- Export functionality (CSV, JSON for brew data)
- Bulk operations (delete multiple, mark favorites)

4. Enhanced UX

- Quick actions menu (edit/delete/duplicate from card)
- Brew comparison tool
- Brewing statistics/analytics page
- Public brew sharing (schema has isPublic field - src/lib/db/schema.ts:146)

The foundation is solid with good patterns established. The main gaps are the missing CRUD operations and enhanced data
management features that would make this a fully functional brew logging system.
