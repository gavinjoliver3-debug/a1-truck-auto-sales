"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { Logo } from "@/components/Logo";

const NAV: [string, string, IconName][] = [
  ["/admin", "Dashboard", "home"],
  ["/admin/inventory", "Listings", "truck"],
  ["/admin/leads", "Leads", "inbox"],
  ["/admin/settings", "Settings", "sliders"],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname().replace(/\/$/, "");
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="bg-ink text-slate-300 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5 lg:py-6">
          <Link href="/admin" aria-label="Admin dashboard">
            <Logo light />
          </Link>
          <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-semibold text-white lg:hidden">Admin</span>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:pb-0">
          {NAV.map(([href, label, icon]) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 font-semibold transition-colors ${
                active(href) ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon name={icon} className="size-5" />
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="m-3 hidden items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white lg:flex">
          <Icon name="external" className="size-4" /> View website
        </Link>
      </aside>

      <div className="min-w-0">
        <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 lg:px-10">
          <strong>Preview.</strong> Demo data saved in this browser only, with no sign-in yet. Live data and staff login turn on when Supabase is
          connected.
        </p>
        <main className="mx-auto max-w-6xl px-4 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

export function AdminHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-muted">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Loading() {
  return <p className="py-20 text-center text-muted">Loading…</p>;
}

/** Status filter tabs with counts, shared by Listings and Leads. */
export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { key: T; label: string; count: number }[] }) {
  return (
    <div role="tablist" className="mb-6 flex flex-wrap gap-2">
      {items.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-semibold transition-colors ${
            value === t.key ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
          }`}
        >
          {t.label}
          <span className={`tabular-nums ${value === t.key ? "text-white/70" : "text-muted"}`}>{t.count}</span>
        </button>
      ))}
    </div>
  );
}
