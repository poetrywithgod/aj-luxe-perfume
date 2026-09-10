# AJ Luxe Perfume — Admin

Internal dashboard for reviewing customer reviews and replying to
customer messages. Shares the same Supabase Postgres database as
`apps/storefront` (via the `db` workspace package) but is its own
Next.js app with its own login, session cookie, and deployment.

## First-time setup

1. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL`,
   `DIRECT_URL` (same values as `apps/storefront/.env.local`), and a
   fresh `ADMIN_SESSION_SECRET` (`openssl rand -base64 48` — **don't**
   reuse the storefront's `SESSION_SECRET`, they're deliberately separate).
2. There's no sign-up page — the only way in is an `AdminUser` row that
   already exists. Create the first one by adding
   `ADMIN_SEED_EMAIL` / `ADMIN_SEED_NAME` / `ADMIN_SEED_PASSWORD` to
   `packages/db/.env` and running:
   ```bash
   pnpm --filter db db:seed
   ```
3. `pnpm install` from the repo root, then `pnpm dev` here (or via the
   root turbo pipeline) and log in at `/login`.

## What's built

- **Reviews** (`/reviews`) — approve or reject reviews customers submit
  on product pages. Only `CONFIRMED` reviews show on the storefront.
- **Inbox** (`/inbox`) — reply to customer conversations started from
  their account page's Messages tab. Updates via polling (~5s), not a
  live subscription — fine for now, worth revisiting if volume grows.

## Not built yet

No dashboard/metrics view, no Products/Orders/Customers management —
`/` currently just redirects to `/reviews`. Those are separate,
larger pieces of work, not started here.
