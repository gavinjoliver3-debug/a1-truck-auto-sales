"use client";

import Link from "next/link";
import { AdminHeader, Loading } from "@/components/admin/AdminShell";
import { Icon, type IconName } from "@/components/Icon";
import { ago, leadsByWeek, SOURCE_LABELS, stats } from "@/lib/admin";
import { useStore } from "@/lib/admin-store";
import { SOURCES } from "@/lib/lead";
import { title } from "@/lib/inventory";
import { btn } from "@/lib/ui";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

function Tile({ icon, label, value, note }: { icon: IconName; label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-muted">
        <Icon name={icon} className="size-4" /> {label}
      </div>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Horizontal bar rows: label, proportional bar, value. One series, so no legend; labels carry identity. */
function BarList({ rows }: { rows: { label: React.ReactNode; value: number; display?: string; key: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="mb-1 flex justify-between gap-3 text-[15px]">
            <span className="min-w-0 truncate">{r.label}</span>
            <span className="font-semibold tabular-nums">{r.display ?? r.value}</span>
          </div>
          <div className="h-2 rounded-full bg-panel">
            <div className="h-2 rounded-full bg-steel" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const { store, reset } = useStore();
  if (!store) return <Loading />;

  const s = stats(store);
  const weeks = leadsByWeek(store.leads);
  const peak = Math.max(1, ...weeks.map((w) => w.count));
  const listed = store.trucks.filter((t) => t.status !== "sold");
  const top = [...listed].sort((a, b) => b.views - a.views).slice(0, 5);
  const recent = [...store.leads].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);

  return (
    <>
      <AdminHeader title="Dashboard" sub={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}>
        <Link href="/admin/inventory/edit" className={btn.primary}>
          <Icon name="plus" className="size-4" /> Add truck
        </Link>
      </AdminHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Tile icon="truck" label="Trucks listed" value={s.listed} note={`${s.pending} pending sale`} />
        <Tile icon="dollar" label="Inventory value" value={usd(s.value)} note="Asking prices, listed trucks" />
        <Tile icon="inbox" label="New leads" value={s.newLeads} note={`${s.leadsThisWeek} came in this week`} />
        <Tile icon="clock" label="Avg. days on lot" value={s.avgDays} note="Listed trucks" />
        <Tile icon="eye" label="Listing views" value={s.views.toLocaleString("en-US")} note="All listed trucks" />
        <Tile icon="check" label="Sold, last 30 days" value={s.sold30} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card title="Leads per week">
          <div className="relative">
            {/* recessive gridlines at the peak and halfway */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-44 border-y border-dashed border-line" />
            <div className="pointer-events-none absolute inset-x-0 top-22 border-t border-dashed border-line" />
            <ol className="relative flex h-44 items-end gap-2 sm:gap-3">
              {weeks.map((w, i) => (
                <li key={w.label} className="group relative flex h-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-[4px] transition-colors ${i === weeks.length - 1 ? "bg-signal" : "bg-steel group-hover:bg-ink"}`}
                    style={{ height: `${Math.max(2, (w.count / peak) * 100)}%` }}
                  />
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-ink px-2 py-1 text-xs font-semibold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {w.count} {w.count === 1 ? "lead" : "leads"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <ol className="mt-2 flex gap-2 text-xs text-muted sm:gap-3" aria-hidden="true">
            {weeks.map((w, i) => (
              <li key={w.label} className={`flex-1 text-center ${i % 2 ? "max-sm:invisible" : ""}`}>
                {w.label}
              </li>
            ))}
          </ol>
          <table className="sr-only">
            <caption>Leads per week, by week starting</caption>
            <tbody>
              {weeks.map((w) => (
                <tr key={w.label}>
                  <th scope="row">{w.label}</th>
                  <td>{w.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-muted">
            This week: <strong className="text-ink">{weeks.at(-1)?.count}</strong> · Weekly average:{" "}
            <strong className="text-ink">{(weeks.reduce((n, w) => n + w.count, 0) / weeks.length).toFixed(1)}</strong>
          </p>
        </Card>

        <Card title="Leads by source">
          <BarList rows={SOURCES.map((k) => ({ key: k, label: SOURCE_LABELS[k], value: store.leads.filter((l) => l.source === k).length }))} />
          <p className="mt-6 text-sm text-muted">
            Won: <strong className="text-ink">{store.leads.filter((l) => l.status === "won").length}</strong> of {store.leads.length} leads
          </p>
        </Card>

        <Card
          title="Most viewed listings"
          action={
            <Link href="/admin/inventory" className="text-sm font-semibold text-signal hover:underline">
              All listings
            </Link>
          }
        >
          <BarList
            rows={top.map((t) => ({
              key: t.id,
              value: t.views,
              display: t.views.toLocaleString("en-US"),
              label: (
                <Link href={`/admin/inventory/edit?id=${t.id}`} className="hover:text-signal">
                  {title(t)}
                </Link>
              ),
            }))}
          />
        </Card>

        <Card
          title="Recent leads"
          action={
            <Link href="/admin/leads" className="text-sm font-semibold text-signal hover:underline">
              Open inbox
            </Link>
          }
        >
          <ul className="-my-2 divide-y divide-line">
            {recent.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads?id=${l.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-signal">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{l.name}</span>
                    <span className="block text-sm text-muted">{SOURCE_LABELS[l.source]}</span>
                  </span>
                  <span className="shrink-0 text-right text-sm text-muted">
                    {l.status === "new" && <span className="mr-2 inline-block size-2 rounded-full bg-signal" aria-label="New" />}
                    {ago(l.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted">
        <p>Views are sample numbers in the preview. Live view counts start once the site is hosted with analytics.</p>
        <button onClick={() => confirm("Reset all demo listings and leads in this browser?") && reset()} className="inline-flex items-center gap-2 font-semibold hover:text-ink">
          <Icon name="refresh" className="size-4" /> Reset demo data
        </button>
      </div>
    </>
  );
}
