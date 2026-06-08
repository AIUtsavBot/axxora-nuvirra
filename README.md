# Nuvirra Ops CRM

Internal Nuvirra CRM built with Next.js App Router and designed for Vercel + Supabase.

## Included modules
- Admin login (Credentials: Email: `nuvirra9@gmail.com`, Password: `Nuvirra9@`)
- Dashboard overview
- Unified inbox
- Customer 360
- Orders
- Support
- Content requests
- CSV preview/import validation
- Settings and seeded product/platform context

## Local setup
1. Install dependencies: `npm install`
2. Start in demo mode: `npm run dev`
3. Optional: copy `.env.example` to `.env.local` and add Supabase credentials for auth and writes

## Commands
- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run seed`

## Supabase
- Apply [supabase/schema.sql](/D:/Projects/Personal/axxora/nuvirra-repo/supabase/schema.sql)
- Create at least one authenticated admin user in Supabase Auth (e.g., Email: `nuvirra9@gmail.com`, Password: `Nuvirra9@`)
- Configure env vars in `.env.local`

Without Supabase env vars, the app runs in demo mode using seeded read-only data and a local session cookie.
