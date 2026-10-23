# A1 Truck & Auto Sales

Website for A1 Truck & Auto Sales — used commercial trucks, 1400 N 9th St #10, Modesto, CA 95350 · (209) 857-0195.

Next.js (App Router) + Tailwind. Runs on sample inventory until Supabase is connected.

## Run locally

```bash
npm install
npm run dev
```

## Preview on GitHub Pages

https://gavinjoliver3-debug.github.io/a1-truck-auto-sales/ — static copy. Update it after changes with `bash scripts/deploy-pages.sh`.

## Go live (Supabase + Vercel)

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Add trucks in the `trucks` table (Table Editor). Photos: upload to a public Storage bucket and paste the URL into `image_url`.
3. Import this repo in Vercel and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).
4. Contact-form submissions land in the `leads` table.

## Still to confirm with the owner

- Full weekly hours (`lib/site.ts`)
- Real truck photos and listings (sample data lives in `lib/inventory.ts`)

## Files

- `components/Logo.tsx`, `public/logo.svg`, `app/icon.svg` — logo
- `lib/inventory.ts` — data layer (Supabase REST, falls back to sample data)
- `lib/lead.ts` — contact-form validation (`npm test`)
