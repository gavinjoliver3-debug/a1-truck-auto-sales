"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader, Loading, Tabs } from "@/components/admin/AdminShell";
import { Icon } from "@/components/Icon";
import { TruckArt } from "@/components/TruckArt";
import { daysAgo, TRUCK_STATUSES, type TruckStatus } from "@/lib/admin";
import { useStore } from "@/lib/admin-store";
import { bodyLabel, money, title } from "@/lib/inventory";
import { btn } from "@/lib/ui";

const LABEL: Record<TruckStatus, string> = { available: "Available", pending: "Pending", sold: "Sold" };
const TONE: Record<TruckStatus, string> = {
  available: "border-emerald-200 bg-emerald-50 text-go",
  pending: "border-amber-200 bg-amber-50 text-amber-900",
  sold: "border-line bg-panel text-steel",
};

export default function Listings() {
  const { store, update } = useStore();
  const [tab, setTab] = useState<"all" | TruckStatus>("all");
  if (!store) return <Loading />;

  const rows = store.trucks.filter((t) => tab === "all" || t.status === tab);
  const setStatus = (id: string, status: TruckStatus) =>
    update((s) => ({
      ...s,
      trucks: s.trucks.map((t) => (t.id === id ? { ...t, status, sold_at: status === "sold" ? (t.sold_at ?? new Date().toISOString()) : null } : t)),
    }));
  const toggleFeatured = (id: string) => update((s) => ({ ...s, trucks: s.trucks.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t)) }));
  const remove = (id: string, name: string) =>
    confirm(`Delete the ${name} listing? This can't be undone.`) && update((s) => ({ ...s, trucks: s.trucks.filter((t) => t.id !== id) }));

  return (
    <>
      <AdminHeader title="Listings" sub="Trucks on the website. Featured trucks show on the home page.">
        <Link href="/admin/inventory/edit" className={btn.primary}>
          <Icon name="plus" className="size-4" /> Add truck
        </Link>
      </AdminHeader>

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "all", label: "All", count: store.trucks.length },
          ...TRUCK_STATUSES.map((k) => ({ key: k, label: LABEL[k], count: store.trucks.filter((t) => t.status === k).length })),
        ]}
      />

      {rows.length ? (
        <div className="relative overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[820px] text-left text-[15px]">
            <thead className="border-b border-line bg-paper text-sm text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Truck</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Miles</th>
                <th className="px-4 py-3 font-semibold">On lot</th>
                <th className="px-4 py-3 font-semibold">Views</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((t) => (
                <tr key={t.id} className="hover:bg-paper">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-20 shrink-0 items-end overflow-hidden rounded-md bg-panel px-1.5 pb-1">
                        {t.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <TruckArt body={t.body} className="w-full text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/inventory/edit?id=${t.id}`} className="block font-semibold hover:text-signal">
                          {title(t)}
                        </Link>
                        <span className="text-sm text-muted">{bodyLabel(t.body)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold tabular-nums">{money(t.price)}</td>
                  <td className="px-4 py-3 tabular-nums text-muted">{t.miles.toLocaleString("en-US")}</td>
                  <td className="px-4 py-3 tabular-nums text-muted">{daysAgo(t.created_at)}d</td>
                  <td className="px-4 py-3 tabular-nums text-muted">{t.views.toLocaleString("en-US")}</td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Status of ${title(t)}`}
                      value={t.status}
                      onChange={(e) => setStatus(t.id, e.target.value as TruckStatus)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${TONE[t.status]}`}
                    >
                      {TRUCK_STATUSES.map((k) => (
                        <option key={k} value={k}>
                          {LABEL[k]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => toggleFeatured(t.id)}
                        aria-pressed={t.featured}
                        title={t.featured ? "Featured on home page" : "Feature on home page"}
                        className={`rounded-md p-2.5 transition-colors hover:bg-panel ${t.featured ? "text-amber-500 [&_svg]:fill-current" : "text-slate-400 hover:text-ink"}`}
                      >
                        <Icon name="star" className="size-5" />
                        <span className="sr-only">{t.featured ? "Unfeature" : "Feature"} {title(t)}</span>
                      </button>
                      <Link href={`/admin/inventory/edit?id=${t.id}`} title="Edit" className="rounded-md p-2.5 text-steel hover:bg-panel hover:text-ink">
                        <Icon name="pencil" className="size-5" />
                        <span className="sr-only">Edit {title(t)}</span>
                      </Link>
                      <button onClick={() => remove(t.id, title(t))} title="Delete" className="rounded-md p-2.5 text-steel hover:bg-red-50 hover:text-signal">
                        <Icon name="trash" className="size-5" />
                        <span className="sr-only">Delete {title(t)}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-muted">No trucks here.</p>
      )}
    </>
  );
}
