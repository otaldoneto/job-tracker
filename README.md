# Job Tracker

A Kanban board for tracking job applications, built as a full-stack Next.js app. Add a company and a role, then
drag the card across columns as the process moves along — applied, interview, offer, rejected.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **PostgreSQL** — persistence
- **Prisma 7** — ORM, with the PostgreSQL driver adapter
- **@dnd-kit** — drag-and-drop
- **Tailwind CSS** — styling

## Running it locally

Requires Docker and Node.

```bash
docker compose up -d
npm install
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

## API

| Method | Path                        | Description                          |
|--------|-----------------------------|----------------------------------------|
| GET    | `/api/applications`         | List all applications                 |
| POST   | `/api/applications`         | Create an application                 |
| PATCH  | `/api/applications/{id}`    | Update an application (status, etc.)  |
| DELETE | `/api/applications/{id}`    | Delete an application                 |

## Technical decisions

**Random (`cuid`) IDs instead of sequential ones.** Same reasoning as this portfolio's
[url-shortener](https://github.com/otaldoneto/url-shortener): a sequential ID is enumerable, revealing how many
records exist. Prisma generates these by default; here that default is kept rather than reinvented.

**A Server Component fetches data; a Client Component owns the board's interactivity.** `page.tsx` queries Prisma
directly — no need to call its own API over HTTP when it's already running in the same process with database
access. Only the board itself, which needs state and event handlers for dragging, is a Client Component
(`"use client"`).

**PATCH, not PUT, for updates.** Dragging a card only changes its `status`; the request body only needs that one
field, not the whole record. PATCH is the semantically correct choice for a partial update.

**Optimistic UI updates.** When a card is dropped on a new column, the screen updates immediately, before the
`PATCH` request to persist it even resolves. This keeps the board feeling responsive; the trade-off is that a
failed request wouldn't currently roll back the visual change — acceptable here, not attempted in production code
without a real user base to justify the complexity.

**dnd-kit disabled during server-side rendering.** `@dnd-kit` generates internal accessibility IDs
(`aria-describedby`) using a counter that increments differently between the server and the browser, which produces
a React hydration mismatch. The board is loaded via `next/dynamic` with `{ ssr: false }` (through a small Client
Component wrapper, since that option isn't allowed directly inside a Server Component) so it only ever renders in
the browser, sidestepping the mismatch entirely.

**Prisma 7's driver adapter.** As of Prisma 7, `new PrismaClient()` no longer connects to the database on its own
from just a schema URL — it requires an explicit driver adapter (`@prisma/adapter-pg` for PostgreSQL) passed to its
constructor. The generated client also no longer lives in `node_modules/@prisma/client` by default; the generator
is configured to output to `src/generated/prisma` instead.

## Limitations

This is a personal tool, not a multi-user product:
- No authentication — anyone with access to the running instance can see and edit everything.
- No reordering within a column (only moving between columns is implemented).
- Optimistic updates don't roll back on a failed request (see above).
