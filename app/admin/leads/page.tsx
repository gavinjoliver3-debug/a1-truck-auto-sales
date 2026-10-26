"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AdminHeader, Loading, Tabs } from "@/components/admin/AdminShell";
import { Icon } from "@/components/Icon";
import { ago, LEAD_STATUSES, SOURCE_LABELS, toCsv, type AdminLead, type LeadStatus } from "@/lib/admin";
import { useStore } from "@/lib/admin-store";
import { title } from "@/lib/inventory";
import { btn, field } from "@/lib/ui";

const TONE: Record<LeadStatus, string> = {
  new: "bg-red-50 text-signal ring-red-200",
  contacted: "bg-amber-50 text-amber-900 ring-amber-200",
  won: "bg-emerald-50 text-go ring-emerald-200",
  lost: "bg-panel text-steel ring-line",
};
const statusLabel = (k: LeadStatus) => LEAD_STATUSES.find((s) => s.key === k)!.label;

export default function LeadsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Leads />
    </Suspense>
  );
}

function Leads() {
  const router = useRouter();
  const selectedId = useSearchParams().get("id");
  const { store, update } = useStore();
  const [tab, setTab] = useState<"all" | LeadStatus>("all");
  const [q, setQ] = useState("");
  if (!store) return <Loading />;

  const sorted = [...store.leads].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const needle = q.trim().toLowerCase();
  const rows = sorted.filter(
    (l) => (tab === "all" || l.status === tab) && (!needle || `${l.name} ${l.phone} ${l.email}`.toLowerCase().includes(needle)),
  );
  const selected = store.leads.find((l) => l.id === selectedId);
  const select = (id?: string) => router.replace(id ? `/admin/leads?id=${id}` : "/admin/leads", { scroll: false });
  const patch = (id: string, p: Partial<AdminLead>) => update((s) => ({ ...s, leads: s.leads.map((l) => (l.id === id ? { ...l, ...p } : l)) }));

  function exportCsv() {
    const csv = toCsv(
      rows.map((l) => ({
        date: l.created_at.slice(0, 10),
        name: l.name,
        phone: l.phone,
        email: l.email,
        source: SOURCE_LABELS[l.source],
        truck: store!.trucks.find((t) => t.id === l.truck_id)?.model ?? "",
        status: statusLabel(l.status),
        message: l.message,
        notes: l.notes,
      })),
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `a1-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <AdminHeader title="Leads" sub="Messages from the contact, truck and finance forms.">
        <button onClick={exportCsv} disabled={!rows.length} className={`${btn.secondary} disabled:opacity-50`}>
          <Icon name="download" className="size-4" /> Export CSV
        </button>
      </AdminHeader>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { key: "all", label: "All", count: store.leads.length },
            ...LEAD_STATUSES.map((s) => ({ key: s.key, label: s.label, count: store.leads.filter((l) => l.status === s.key).length })),
          ]}
        />
        <label className="mb-6 w-full sm:w-64">
          <span className="sr-only">Search leads</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone" className={`${field} py-2`} />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <ul className={`divide-y divide-line overflow-hidden rounded-xl border border-line bg-white ${selected ? "max-lg:hidden" : ""}`}>
          {rows.length ? (
            rows.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => select(l.id)}
                  aria-current={l.id === selectedId ? "true" : undefined}
                  className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-paper ${l.id === selectedId ? "bg-panel" : ""}`}
                >
                  <span className={`mt-2 size-2 shrink-0 rounded-full ${l.status === "new" ? "bg-signal" : "bg-transparent"}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className={`truncate ${l.status === "new" ? "font-bold" : "font-semibold"}`}>{l.name}</span>
                      <span className="shrink-0 text-sm text-muted">{ago(l.created_at)}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[15px] text-muted">{l.message.split("\n")[0] || "No message"}</span>
                    <span className="mt-2 flex gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-panel px-2 py-0.5 text-steel">{SOURCE_LABELS[l.source]}</span>
                      <span className={`rounded-full px-2 py-0.5 ring-1 ${TONE[l.status]}`}>{statusLabel(l.status)}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="p-10 text-center text-muted">No leads match.</li>
          )}
        </ul>

        {selected ? (
          <LeadDetail
            key={selected.id}
            lead={selected}
            truck={store.trucks.find((t) => t.id === selected.truck_id)}
            onClose={() => select()}
            onPatch={(p) => patch(selected.id, p)}
            onDelete={() => {
              if (!confirm(`Delete the lead from ${selected.name}?`)) return;
              update((s) => ({ ...s, leads: s.leads.filter((l) => l.id !== selected.id) }));
              select();
            }}
          />
        ) : (
          <div className="hidden items-center justify-center rounded-xl border border-dashed border-slate-300 p-10 text-center text-muted lg:flex">
            Select a lead to see the details.
          </div>
        )}
      </div>
    </>
  );
}

function LeadDetail({
  lead,
  truck,
  onClose,
  onPatch,
  onDelete,
}: {
  lead: AdminLead;
  truck?: Parameters<typeof title>[0];
  onClose: () => void;
  onPatch: (p: Partial<AdminLead>) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes);
  return (
    <article className="h-fit rounded-xl border border-line bg-white p-6 lg:sticky lg:top-6">
      <button onClick={onClose} className="mb-4 inline-flex items-center gap-1 text-[15px] font-semibold text-steel hover:text-ink lg:hidden">
        <Icon name="back" className="size-4" /> All leads
      </button>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{lead.name}</h2>
          <p className="mt-1 text-sm text-muted">
            {SOURCE_LABELS[lead.source]} ·{" "}
            {new Date(lead.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
        <button onClick={onDelete} title="Delete lead" className="rounded-md p-2.5 text-steel hover:bg-red-50 hover:text-signal">
          <Icon name="trash" className="size-5" />
          <span className="sr-only">Delete lead</span>
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className={`${btn.primary} px-4 py-2.5`}>
          <Icon name="phone" className="size-4" /> {lead.phone}
        </a>
        {lead.email && (
          <a href={`mailto:${lead.email}`} className={`${btn.secondary} px-4 py-2.5`}>
            <Icon name="mail" className="size-4" /> Email
          </a>
        )}
      </div>

      {truck && (
        <p className="mt-5 text-[15px]">
          Asking about:{" "}
          <Link href={`/admin/inventory/edit?id=${truck.id}`} className="font-semibold text-signal hover:underline">
            {title(truck)}
          </Link>
        </p>
      )}

      <h3 className="mt-6 text-sm font-semibold text-muted">Message</h3>
      <p className="mt-1 whitespace-pre-line rounded-lg bg-paper p-4 leading-relaxed">{lead.message || "No message."}</p>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-muted">Status</legend>
        <div className="mt-2 grid grid-cols-4 gap-1 rounded-lg bg-panel p-1">
          {LEAD_STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => onPatch({ status: s.key })}
              aria-pressed={lead.status === s.key}
              className={`rounded-md px-2 py-2 text-sm font-semibold transition-colors ${lead.status === s.key ? "bg-white text-ink shadow-sm" : "text-steel hover:text-ink"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 grid gap-1 text-sm font-semibold text-muted">
        Notes <span className="font-normal">(saved when you click away)</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== lead.notes && onPatch({ notes })} rows={3} className={`${field} text-ink`} placeholder="Called, left voicemail…" />
      </label>
    </article>
  );
}
