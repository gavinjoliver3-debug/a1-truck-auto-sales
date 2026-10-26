// Pure admin logic: types, demo seed, stats, form parsing, CSV. No browser APIs, so it's testable with `npm test`.
import { isBody, type Truck } from "./inventory.ts";
import type { Lead, Source } from "./lead.ts";
import { site } from "./site.ts";

export const TRUCK_STATUSES = ["available", "pending", "sold"] as const;
export type TruckStatus = (typeof TRUCK_STATUSES)[number];
export type AdminTruck = Truck & { status: TruckStatus; created_at: string; sold_at: string | null; views: number };

export const LEAD_STATUSES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number]["key"];
export type AdminLead = Lead & { id: string; created_at: string; status: LeadStatus; notes: string };

export const SOURCE_LABELS: Record<Source, string> = { truck: "Truck inquiry", finance: "Finance", contact: "General" };

export type Settings = { name: string; phone: string; street: string; city: string; hours: string; banner: string; loginEmail: string };
export const DEFAULT_SETTINGS: Settings = {
  name: site.name,
  phone: site.phone,
  street: site.street,
  city: site.city,
  hours: site.hours,
  banner: "",
  loginEmail: "",
};

export type Store = { trucks: AdminTruck[]; leads: AdminLead[]; settings: Settings };

const DAY = 864e5;
export const daysAgo = (iso: string, now = Date.now()) => Math.max(0, Math.floor((now - Date.parse(iso)) / DAY));

export function ago(iso: string, now = Date.now()) {
  const d = daysAgo(iso, now);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return d < 30 ? `${d}d ago` : new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Demo data, dated relative to `now` so the preview always looks current. Phone numbers use the fictional 555-01xx range.
const NAMES = ["Luis Ortega", "Dana Whitfield", "Mike Bains", "Rosa Delgado", "Tom Nguyen", "Priya Sandhu", "Jake Morales", "Kim Alvarez", "Sam Patel", "Carlos Reyes", "Erin Walsh", "Ben Ochoa", "Maria Cruz", "Dave Hollis", "Ana Ruiz", "Greg Tran"];

const LEAD_DAYS = [1, 2, 5, 8, 9, 12, 16, 17, 19, 24, 29, 33, 34, 40, 46, 53];

export function seed(trucks: Truck[], now = Date.now()): Store {
  const iso = (days: number) => new Date(now - days * DAY).toISOString();
  const lot = [12, 34, 21, 58, 9, 76];
  const views = [412, 288, 197, 154, 133, 96];
  const listed: AdminTruck[] = trucks.map((t, i) => ({
    ...t,
    status: i === 4 ? "pending" : "available",
    created_at: iso(lot[i % lot.length]),
    sold_at: null,
    views: views[i % views.length],
  }));
  const base = { engine: "", transmission: "Automatic", description: "", image_url: null, vin: null, featured: false };
  const sold: AdminTruck[] = [
    { ...base, id: "demo-sold-1", year: 2014, make: "Ford", model: "F-450 Flatbed", body: "flatbed", price: 27500, miles: 168000, gvwr: "16,500 lb", status: "sold", created_at: iso(70), sold_at: iso(18), views: 341 },
    { ...base, id: "demo-sold-2", year: 2016, make: "Hino", model: "195 Box Truck", body: "box", price: 38900, miles: 141200, gvwr: "19,500 lb", status: "sold", created_at: iso(55), sold_at: iso(6), views: 266 },
  ];
  const sources: Source[] = ["truck", "finance", "contact", "truck", "finance", "truck"];
  const statuses: LeadStatus[] = ["contacted", "won", "contacted", "lost"];
  const leads: AdminLead[] = NAMES.map((name, i) => {
    const source = sources[i % sources.length];
    const t = trucks[i % trucks.length];
    const message =
      source === "truck"
        ? `I'm interested in the ${t.year} ${t.make} ${t.model}. Is it still available? Can I come see it this week?`
        : source === "finance"
          ? `Business name: ${name.split(" ")[1]} Hauling\nTime in business: ${i % 2 ? "Under 2 years" : "5+ years"}\nDown payment: $5,000–$10,000\nCredit: ${i % 2 ? "Fair" : "Good"}`
          : "Looking for a 26 ft box truck under $40k. Let me know if anything comes in.";
    return {
      id: `demo-lead-${i + 1}`,
      created_at: iso(LEAD_DAYS[i]),
      name,
      phone: `(209) 555-01${String(10 + i)}`,
      email: i % 3 ? "" : `${name.split(" ")[0].toLowerCase()}@example.com`,
      truck_id: source === "truck" ? t.id : null,
      source,
      message,
      status: i < 4 ? "new" : statuses[i % statuses.length],
      notes: i === 5 ? "Wants to bring his mechanic Saturday." : "",
    };
  });
  return { trucks: [...listed, ...sold], leads, settings: DEFAULT_SETTINGS };
}

export function stats({ trucks, leads }: Store, now = Date.now()) {
  const listed = trucks.filter((t) => t.status !== "sold");
  return {
    listed: listed.length,
    pending: listed.filter((t) => t.status === "pending").length,
    value: listed.reduce((n, t) => n + (t.price ?? 0), 0),
    avgDays: listed.length ? Math.round(listed.reduce((n, t) => n + daysAgo(t.created_at, now), 0) / listed.length) : 0,
    views: listed.reduce((n, t) => n + t.views, 0),
    newLeads: leads.filter((l) => l.status === "new").length,
    leadsThisWeek: leads.filter((l) => daysAgo(l.created_at, now) < 7).length,
    sold30: trucks.filter((t) => t.sold_at && daysAgo(t.sold_at, now) < 30).length,
  };
}

/** Lead counts per 7-day bucket, oldest first. */
export function leadsByWeek(leads: AdminLead[], weeks = 8, now = Date.now()) {
  return Array.from({ length: weeks }, (_, i) => {
    const b = weeks - 1 - i;
    const start = new Date(now - (b * 7 + 6) * DAY);
    return {
      label: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: leads.filter((l) => Math.floor(daysAgo(l.created_at, now) / 7) === b).length,
    };
  });
}

export function parseTruck(f: Record<string, string>): { truck?: Omit<AdminTruck, "id" | "created_at" | "sold_at" | "views">; error?: string } {
  const num = (v = "") => Number(v.replace(/[$,\s]/g, ""));
  const year = num(f.year);
  const miles = num(f.miles);
  const price = f.price?.trim() ? num(f.price) : null;
  if (!f.make?.trim() || !f.model?.trim()) return { error: "Make and model are required." };
  if (!Number.isInteger(year) || year < 1980 || year > new Date().getFullYear() + 1) return { error: "Enter a valid year." };
  if (!f.miles?.trim() || !Number.isFinite(miles) || miles < 0) return { error: "Enter the miles as a number." };
  if (price !== null && (!Number.isFinite(price) || price < 0)) return { error: "Enter the price as a number, or leave it blank for “Call for price”." };
  if (!isBody(f.body)) return { error: "Pick a body type." };
  const vin = f.vin?.trim().toUpperCase() || null;
  if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return { error: "A VIN is 17 letters and numbers (no I, O or Q)." };
  const status = TRUCK_STATUSES.find((s) => s === f.status) ?? "available";
  return {
    truck: {
      year,
      make: f.make.trim(),
      model: f.model.trim(),
      body: f.body,
      price,
      miles: Math.round(miles),
      engine: f.engine?.trim() ?? "",
      transmission: f.transmission?.trim() ?? "",
      gvwr: f.gvwr?.trim() ?? "",
      description: f.description?.trim() ?? "",
      image_url: f.image_url?.trim() || null,
      vin,
      featured: f.featured === "on",
      status,
    },
  };
}

// Leading = + - @ would run as a formula when the file is opened in Excel.
const cell = (v: unknown) => {
  const s = String(v ?? "").replace(/^([=+\-@])/, "'$1");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
}

export function validatePasswordChange(current: string, next: string, confirm: string): string | undefined {
  if (!current) return "Enter your current password.";
  if (next.length < 10) return "Use at least 10 characters for the new password.";
  if (!/[a-z]/i.test(next) || !/\d/.test(next)) return "Use at least one letter and one number.";
  if (next === current) return "The new password must be different from the current one.";
  if (next !== confirm) return "The new passwords don't match.";
}
