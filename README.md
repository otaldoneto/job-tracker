# Job Tracker

A Kanban board for tracking job applications, built as a full-stack Next.js app. Add a company and a role, then
drag the card across columns as the process moves along — applied, interview, offer, rejected — and reorder cards
within a column to prioritize.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **PostgreSQL** — persistence
- **Prisma 7** — ORM, with the PostgreSQL driver adapter
- **@dnd-kit** — drag-and-drop, including sortable lists
- **Recharts** — charts on the stats page
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

## Features

- Kanban board with drag-and-drop, both between columns and to reorder within a column
- Create, edit and delete applications inline on the card
- A "days since applied" badge and a color accent per status
- A `/stats` page with charts: applications by status and by week

## API

| Method | Path                          | Description                                  |
|--------|-------------------------------|-----------------------------------------------|
| GET    | `/api/applications`           | List all applications                        |
| POST   | `/api/applications`           | Create an application                        |
| PATCH  | `/api/applications/{id}`      | Update an application (whitelisted fields)   |
| DELETE | `/api/applications/{id}`      | Delete an application                        |
| POST   | `/api/applications/reorder`   | Persist a column's new card order/status     |

## Technical decisions

**Random (`cuid`) IDs instead of sequential ones.** Same reasoning as this portfolio's
[url-shortener](https://github.com/otaldoneto/url-shortener): a sequential ID is enumerable, revealing how many
records exist. Prisma generates these by default; here that default is kept rather than reinvented.

**A Server Component fetches data; a Client Component owns the board's interactivity.** `page.tsx` queries Prisma
directly — no need to call its own API over HTTP when it's already running in the same process with database
access. Only the board itself, which needs state and event handlers for dragging, is a Client Component
(`"use client"`).

**PATCH accepts an explicit whitelist of fields, not the raw request body.** An earlier version passed the entire
JSON body straight into Prisma's `update`, which let a client overwrite any column — including `id` or `createdAt`
— and crashed with a 500 on an invalid `status` instead of a proper `400`. The route now validates `status` against
the enum and only forwards known fields; `PATCH`/`DELETE` on a non-existent id also return a `404` instead of an
unhandled error.

**Optimistic UI updates.** When a card is dropped on a new column or reordered, the screen updates immediately,
before the request to persist it even resolves. This keeps the board feeling responsive; the trade-off is that a
failed request wouldn't currently roll back the visual change — acceptable here, not attempted in production code
without a real user base to justify the complexity.

**dnd-kit disabled during server-side rendering.** `@dnd-kit` generates internal accessibility IDs
(`aria-describedby`) using a counter that increments differently between the server and the browser, which produces
a React hydration mismatch. The board is loaded via `next/dynamic` with `{ ssr: false }` (through a small Client
Component wrapper, since that option isn't allowed directly inside a Server Component) so it only ever renders in
the browser, sidestepping the mismatch entirely.

**Reordering within a column goes through a dedicated endpoint, not several PATCH calls.** A drag-and-drop reorder
changes the `position` of every card in the affected column at once. Doing that as N separate `PATCH` requests risks
a partial failure leaving inconsistent positions (two cards with the same value, no way to roll back cleanly). The
`/api/applications/reorder` endpoint instead takes the column's full new id order and applies it inside a single
Prisma `$transaction`, so it's all-or-nothing.

**Prisma 7's driver adapter.** As of Prisma 7, `new PrismaClient()` no longer connects to the database on its own
from just a schema URL — it requires an explicit driver adapter (`@prisma/adapter-pg` for PostgreSQL) passed to its
constructor. The generated client also no longer lives in `node_modules/@prisma/client` by default; the generator
is configured to output to `src/generated/prisma` instead.

## Limitations

This is a personal tool, not a multi-user product:
- No authentication — anyone with access to the running instance can see and edit everything.
- Optimistic updates don't roll back on a failed request (see above).
