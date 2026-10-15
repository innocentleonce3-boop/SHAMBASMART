# ShambaSmart

ShambaSmart is a Tanzania-focused farm-management MVP built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase. It uses TZS for recorded money values and includes English/Kiswahili message dictionaries.

## Vision

ShambaSmart aims to make farm management easier through accessible tools for agricultural planning, record-keeping, crop monitoring, and financial tracking. Its initial focus is practical support for farmers and farm teams in Tanzania.

The project objectives are to improve farm record organization, connect crop and activity records, support harvest and expense tracking, and make useful farm information available in English and Kiswahili. The capabilities below describe the current implementation; roadmap items are called out separately.

## Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project and its publishable key for authenticated features
- Supabase CLI only when preparing or applying database migrations

## Local setup

1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. For the configured pilot project, the URL is `https://gkysqjpblbwddfxqiejq.supabase.co`; obtain the publishable key from that project's Supabase dashboard.
4. Run `npm run dev` and open `http://localhost:3000`.

The public landing page works without Supabase configuration. Authenticated pages and data operations do not. Never use a service-role key in this application or in a `NEXT_PUBLIC_*` variable. `.env.local` is ignored by Git.

## Implemented

- Email/password registration, sign-in, sign-out, confirmation callback, and password reset/update flows.
- Supabase SSR server and browser clients, cookie-based session refresh, and protected workspace routes.
- Profile name/phone and language preference editing.
- Farm create/read/update/delete, fields, and crop-season create/read workflows backed by Supabase.
- Activity create/list/filter/status completion, crop observations, private image upload, and cautious rule-based monitoring indicators.
- Open-Meteo farm forecasts when coordinates are recorded; responses are validated and Next.js fetch caching is enabled.
- Harvest records and unit-specific totals, sales, expenses, and recorded revenue/expense summaries.
- Participant-scoped support conversations, user notifications view, and an admin aggregate/support view.
- Initial schema and access-hardening SQL migrations, private storage policies, and development crop reference seed.
- Unit tests for harvest-date estimates and crop-monitoring indicators.

## Partial or not yet verified

- The Supabase project key was not present in workspace or local VS Code settings during this setup. Live authentication, database reads/writes, storage uploads, weather requests, and RLS behavior have not been verified against the supplied project.
- The migrations have not been applied to the remote database. Review both migration files before running them.
- English/Kiswahili selection currently localizes the shared navigation and selected dashboard/settings labels; several forms and feature pages remain English.
- The dashboard shows database-backed totals and upcoming tasks, but does not yet include the planned charts, crop comparisons, or complete analytics filters.
- Notification listing exists, but scheduled reminders and unread workflows are not yet generated. Messaging works through persisted requests; Realtime is not configured.
- Administration includes aggregate counts, user listing, and support conversations; user/role management and audit-log workflows are not implemented in the UI.
- Integration and end-to-end tests have not been added. Remote authorization checks need a configured Supabase project and test accounts.

## Supabase setup

The CLI project config is `supabase/config.toml`. Migrations are ordered under `supabase/migrations/`; `supabase/seed.sql` contains public crop references only.

For a new local Supabase stack, run `supabase start` and then `supabase db reset`. For the existing hosted project, first inspect the diff and migration SQL, then link and push only after the database owner approves:

```sh
supabase login
supabase link --project-ref gkysqjpblbwddfxqiejq
supabase migration list
supabase db push --dry-run
```

After reviewing the dry run and SQL, an authorized operator can run `supabase db push`. This repository does not apply migrations automatically. Never run a database reset against the hosted project.

Configure Supabase Auth URL settings with the local callback `http://localhost:3000/auth/callback` and the production callback `https://YOUR_DOMAIN/auth/callback`. The initial migration creates the private `farm-media` bucket and RLS policies. Create the first administrator only through a trusted Supabase SQL/editor workflow after confirming the user's auth ID; registration never grants admin privileges.

See [Supabase setup](docs/supabase-setup.md), [security model](docs/security.md), and [architecture](docs/architecture.md).

## Development checks

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`

## Deployment

Deploy with Vercel using the two public Supabase variables above. Configure Auth redirect URLs for the deployed domain. Apply reviewed migrations separately through the Supabase CLI. Confirm backups and recovery procedures in Supabase before pilot data is entered.