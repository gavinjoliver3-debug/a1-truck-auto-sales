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

## Admin (`/admin`)

Dashboard (KPIs, leads per week, leads by source, most-viewed listings), listings manager (add/edit, status, featured, delete) and a leads inbox (status, notes, CSV export).

**Preview only:** the admin runs on demo data stored in the viewer's browser (`lib/admin-store.ts`) with no login. Leads sent from the public forms land in that browser's demo inbox. Before going live, swap `lib/admin-store.ts` for Supabase calls behind Supabase Auth (the policies are already in `supabase/schema.sql`).

## SEO, AEO and scrapers

Every page is prerendered HTML (on Vercel it's server-rendered), so crawlers and scrapers see the full inventory without running JavaScript.

- `/inventory` carries a schema.org `ItemList` of every truck; each `/inventory/<id>` page carries a `Vehicle` block (brand, model, year, VIN, miles, price, availability, body type using Tru Machinery Market's category names) plus a `Description` section.
- `/inventory.json` is a JSON feed of every available truck. `/sitemap.xml`, `/robots.txt` (admin blocked) and `/llms.txt` are generated from the same data.
- The home page has an FAQ with `FAQPage` markup, and every page has a canonical URL.
- Set `NEXT_PUBLIC_SITE_URL` to the real domain when moving off GitHub Pages; all links, feeds and canonicals follow it.

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
