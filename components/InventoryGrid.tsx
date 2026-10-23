"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BODIES, isBody, type Truck } from "@/lib/inventory";
import { site } from "@/lib/site";
import { TruckCard } from "./TruckCard";

// Filters in the browser so the page can be prerendered for static hosting.
export function InventoryGrid({ trucks }: { trucks: Truck[] }) {
  const type = useSearchParams().get("type");
  const body = isBody(type) ? type : undefined;
  const shown = body ? trucks.filter((t) => t.body === body) : trucks;
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`;

  return (
    <>
      <nav aria-label="Filter by body type" className="mt-8 flex flex-wrap gap-2">
        <Link href="/inventory" className={chip(!body)} aria-current={!body ? "page" : undefined}>
          All
        </Link>
        {BODIES.map((b) => (
          <Link key={b.key} href={`/inventory?type=${b.key}`} className={chip(body === b.key)} aria-current={body === b.key ? "page" : undefined}>
            {b.label}
          </Link>
        ))}
      </nav>

      {shown.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((t) => (
            <TruckCard key={t.id} truck={t} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-lg text-muted">
          Nothing in this category right now. Call <a href={site.phoneHref} className="font-semibold text-signal">{site.phone}</a> — we may have one coming in.
        </p>
      )}
    </>
  );
}
