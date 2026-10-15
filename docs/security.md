# Security

- Keep `.env.local` out of Git. Only the Supabase URL and publishable key are used by the app; never add a service-role key to client code or `NEXT_PUBLIC_*` variables.
- Auth sessions use `@supabase/ssr`, HTTP cookies, and `auth.getUser()` checks. Protected routes also verify access in server-rendered pages/actions.
- Sensitive tables enable RLS. Farm membership policies scope records; database constraints prevent cross-farm crop/field/harvest relationships.
- New profiles are forced to the `farmer` role. Profile update grants exclude the role column. Administrator operations require an existing trusted admin role.
- Storage uses a private bucket, MIME/size validation in the upload action, and farm-membership path policies.
- Weather responses are provider data, not observations. Client roles cannot write the weather cache; avoid adding write privileges without a trusted validation path.
- Risk indicators are rules-based monitoring prompts, not diagnoses. Users are directed to agricultural extension support.

Before pilot use, apply and test migrations in a non-production Supabase project, test RLS with distinct farmer/manager/admin accounts, configure Auth redirect URLs, and establish backup/recovery procedures. The remote policies have not been executed from this workspace.