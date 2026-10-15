# Supabase Setup

## Environment

Copy `.env.example` to `.env.local`, then set:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://gkysqjpblbwddfxqiejq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-project-publishable-key
```

The publishable key was not found in local configuration during this audit. Retrieve it from Supabase Project Settings → API Keys. Do not substitute a secret/service-role key.

## Migrations

The ordered migrations create profiles, farms/memberships, fields, crops/seasons, activities, observations, weather cache, harvests, finance, conversations, messages, notifications, settings, audit log, RLS, and the private `farm-media` bucket. The second migration adds same-farm constraints and support/admin policies.

Review the SQL and a CLI dry run before applying. To connect the CLI to the provided hosted project, use project ref `gkysqjpblbwddfxqiejq`; do not run `db reset` against it. Remote migrations have not been applied or verified.

## Dashboard configuration

In Supabase Auth URL Configuration, set the local Site URL to `http://localhost:3000` and allow `http://localhost:3000/auth/callback`. Add the production domain callback before deployment. Configure email confirmation and password reset email templates to return through the callback route.

For the first administrator, create and verify an account first, then assign the `admin` role from a trusted Supabase SQL/editor context using that account's auth UUID. Never expose the service-role key to the app and never allow public registration to assign roles.