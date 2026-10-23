import type { Metadata } from "next";
import { Suspense } from "react";
import { InventoryGrid } from "@/components/InventoryGrid";
import { getTrucks, isDemo } from "@/lib/inventory";

export const metadata: Metadata = { title: "Inventory" };

export default async function Inventory() {
  const trucks = await getTrucks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-5xl font-extrabold uppercase sm:text-6xl">Inventory</h1>
      {isDemo && (
        <p className="mt-3 inline-block rounded bg-amber-100 px-3 py-1 text-sm text-amber-900">
          Sample listings — connect Supabase to show live inventory.
        </p>
      )}
      <Suspense>
        <InventoryGrid trucks={trucks} />
      </Suspense>
    </div>
  );
}
