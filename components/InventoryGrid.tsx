"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BODIES, isBody, type Truck } from "@/lib/inventory";
import { site } from "@/lib/site";
import { field } from "@/lib/ui";
import { TruckCard } from "./TruckCard";

const SORTS = [
  ["", "Newest"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
];

/** Reads ?type= and ?sort= from the URL. Rendered inside <Suspense> whose fallback is the unfiltered grid,
 *  so the server HTML always lists every truck (search engines and scrapers see the full inventory). */
export function InventoryGridFromUrl({ trucks }: { trucks: Truck[] }) {
  const params = useSearchParams();
  return <InventoryGrid trucks={trucks} type={params.get("type")} sort={params.get("sort") ?? ""} />;
}

export function InventoryGrid({ trucks, type, sort }: { trucks: Truck[]; type: string | null; sort: string }) {
  const router = useRouter();
  const body = isBody(type) ? type : undefined;

  const href = (t = body as string | undefined, s = sort) => {
    const p = new URLSearchParams();
    if (t) p.set("type", t);
    if (s) p.set("sort", s);
    return `/inventory${p.size ? `?${p}` : ""}`;
  };

  // Trucks without a price ("Call for price") sort last either way.
  const shown = trucks.filter((t) => !body || t.body === body);
  if (sort === "price-asc") shown.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (sort === "price-desc") shown.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));

  const item = (active: boolean) =>
    `flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-[15px] font-semibold transition-colors lg:border-transparent ${
      active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink lg:bg-transparent lg:hover:bg-white"
    }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Filter by body type">
        <h2 className="mb-3 hidden font-display font-semibold lg:block">Body type</h2>
        <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {[{ key: undefined, label: "All trucks" }, ...BODIES].map((b) => {
            const active = body === b.key;
            const n = b.key ? trucks.filter((t) => t.body === b.key).length : trucks.length;
            return (
              <li key={b.label}>
                <Link href={href(b.key)} className={item(active)} aria-current={active ? "page" : undefined}>
                  {b.label}
                  <span className={`tabular-nums ${active ? "text-white/70" : "text-muted"}`}>{n}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold" aria-live="polite">
            {shown.length} {shown.length === 1 ? "truck" : "trucks"}
          </p>
          <label className="flex items-center gap-2 text-[15px] text-muted">
            Sort
            <select value={sort} onChange={(e) => router.replace(href(body, e.target.value), { scroll: false })} className={`${field} w-auto py-2`}>
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>

        {shown.length ? (
          <div className="stagger grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((t) => (
              <TruckCard key={t.id} truck={t} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-display text-lg font-semibold">Nothing in this category right now</p>
            <p className="mt-2 text-muted">
              Call{" "}
              <a href={site.phoneHref} className="font-semibold text-signal">
                {site.phone}
              </a>{" "}
              — we may have one coming in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
