# Architecture

ShambaSmart uses Next.js App Router server components for data-backed pages and server actions for writes. Authenticated queries use the session cookie and Supabase's publishable key; database RLS is the authorization boundary. Client components are limited to interactive forms and the responsive navigation.

## Source areas

- `src/app`: routes, layouts, auth callback, and page composition.
- `src/features`: validated server actions for farm, crop, field, activity, observation, finance, and messaging writes.
- `src/components`: reusable forms and navigation.
- `src/lib/supabase`: SSR/browser clients and database types.
- `src/lib/calculations`: harvest-date estimate and crop-monitoring indicator logic.
- `supabase/migrations`: versioned schema, constraints, storage setup, and RLS.

## Data flow

Server actions validate submitted `FormData` with Zod, verify the current Supabase user, then issue typed queries. Queries rely on RLS and show explicit empty/error states. The dashboard aggregates the authenticated user's visible records; activity costs are not added to finance expenses to avoid duplicate totals. Weather uses Open-Meteo and farm coordinates, with a validated response and Next.js fetch revalidation.

## Current boundaries

There is no service-role client in the application. Administrative reads use a role check plus a restricted aggregate RPC. Messaging Realtime, scheduled jobs, chart analytics, and broad translation coverage are not implemented yet.