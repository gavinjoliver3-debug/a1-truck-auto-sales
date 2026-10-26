import type { Metadata } from "next";
import { Suspense } from "react";
import { InventoryGrid, InventoryGridFromUrl } from "@/components/InventoryGrid";
import { PageHeader } from "@/components/PageHeader";
import { getTrucks, isDemo } from "@/lib/inventory";
import { breadcrumbLd, itemListLd, JsonLd } from "@/lib/seo";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Used Commercial Trucks for Sale in Modesto, CA",
  description: "Used dump, box, service, flatbed, tow trucks and work pickups for sale at A1 Truck & Auto Sales in Modesto, CA. Price and specs on every listing.",
  alternates: { canonical: pageUrl("/inventory") },
};

export default async function Inventory() {
  const trucks = await getTrucks();

  return (
    <>
      <JsonLd data={itemListLd(trucks)} />
      <JsonLd data={breadcrumbLd([["Home", "/"], ["Inventory", "/inventory"]])} />
      <PageHeader eyebrow="Inventory" title="Trucks for sale">
        Used commercial trucks on the lot in Modesto, with the price and specs on every listing.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-10">
        {isDemo && (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
            Sample listings. Connect Supabase to show live inventory.
          </p>
        )}
        <Suspense fallback={<InventoryGrid trucks={trucks} type={null} sort="" />}>
          <InventoryGridFromUrl trucks={trucks} />
        </Suspense>
      </div>
    </>
  );
}
