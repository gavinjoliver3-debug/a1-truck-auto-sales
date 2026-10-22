import type { Metadata } from "next";
import Link from "next/link";
import { TruckCard } from "@/components/TruckCard";
import { BODIES, getTrucks, isBody, isDemo } from "@/lib/inventory";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Inventory" };

export default async function Inventory({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const body = isBody(type) ? type : undefined;
  const trucks = await getTrucks(body);
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-5xl font-extrabold uppercase sm:text-6xl">Inventory</h1>
      {isDemo && (
        <p className="mt-3 inline-block rounded bg-amber-100 px-3 py-1 text-sm text-amber-900">
          Sample listings — connect Supabase to show live inventory.
        </p>
      )}

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

      {trucks.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trucks.map((t) => (
            <TruckCard key={t.id} truck={t} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-lg text-muted">
          Nothing in this category right now. Call <a href={site.phoneHref} className="font-semibold text-signal">{site.phone}</a> — we may have one coming in.
        </p>
      )}
    </div>
  );
}
