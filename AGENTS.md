# Famtima Traders CRM — Agent Notes

This project is a fully independent TanStack Start (React 19) application for **Famtima Traders, Bemetara, Chhattisgarh**.
It is **not** connected to Lovable or any external editor platform.

## Dev Workflow

```sh
npm install      # install dependencies
npm run dev      # start local dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # ESLint check
```

## Environment Variables

Copy `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
DATABASE_URL=postgresql://...
```
