import type { Metadata } from "next";
import { Suspense } from "react";
import { InventoryGrid } from "@/components/InventoryGrid";
import { PageHeader } from "@/components/PageHeader";
import { getTrucks, isDemo } from "@/lib/inventory";

export const metadata: Metadata = { title: "Inventory" };

export default async function Inventory() {
  const trucks = await getTrucks();

  return (
    <>
      <PageHeader eyebrow="Inventory" title="Trucks for sale">
        Used commercial trucks on the lot in Modesto, with the price and specs on every listing.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-10">
        {isDemo && (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
            Sample listings. Connect Supabase to show live inventory.
          </p>
        )}
        <Suspense>
          <InventoryGrid trucks={trucks} />
        </Suspense>
      </div>
    </>
  );
}
