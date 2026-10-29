# Database & Migration Setup

This folder holds all database schemas, table definitions, and migrations for the Famtima Traders CRM.

## Directory Structure
- `migrations/` : Supabase / PostgreSQL SQL migration files containing table creations, indexes, RLS policies, and triggers.
- `expenses_payroll_schema.sql` : Standalone schema script for expenses and payroll module.
- `drizzle/` : Drizzle ORM schema and configurations (if using Drizzle Kit).
- `config.toml` : Local Supabase CLI configuration.

## Connecting to Database

### For Frontend (`frontend/.env`):
```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
```
