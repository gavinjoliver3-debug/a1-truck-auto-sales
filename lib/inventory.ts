import type { Lead } from "./lead";

export const BODIES = [
  { key: "dump", label: "Dump" },
  { key: "box", label: "Box / Van" },
  { key: "service", label: "Service / Utility" },
  { key: "flatbed", label: "Flatbed / Stake" },
  { key: "tow", label: "Rollback / Tow" },
  { key: "pickup", label: "Pickups" },
] as const;

export type Body = (typeof BODIES)[number]["key"];

export type Truck = {
  id: string;
  year: number;
  make: string;
  model: string;
  body: Body;
  price: number | null;
  miles: number;
  engine: string;
  transmission: string;
  gvwr: string;
  description: string;
  image_url: string | null;
  featured: boolean;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const isDemo = !url || !key;

// Supabase's REST API directly: no client library needed for reads and one insert.
function rest(path: string, init: RequestInit = {}) {
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key!, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers },
    next: { revalidate: 60 },
  });
}

export const isBody = (v: unknown): v is Body => BODIES.some((b) => b.key === v);

export async function getTrucks(body?: Body): Promise<Truck[]> {
  if (isDemo) return SAMPLE.filter((t) => !body || t.body === body);
  const res = await rest(`trucks?status=eq.available&order=created_at.desc${body ? `&body=eq.${body}` : ""}`);
  if (!res.ok) throw new Error(`Inventory fetch failed: ${res.status}`);
  return res.json();
}

export async function getTruck(id: string): Promise<Truck | null> {
  if (isDemo) return SAMPLE.find((t) => t.id === id) ?? null;
  const res = await rest(`trucks?id=eq.${encodeURIComponent(id)}&limit=1`);
  if (!res.ok) return null;
  return (await res.json())[0] ?? null;
}

export async function saveLead(lead: Lead) {
  if (isDemo) return console.log("[demo] lead", lead);
  const res = await rest("leads", { method: "POST", body: JSON.stringify(lead), headers: { Prefer: "return=minimal" } });
  if (!res.ok) throw new Error(`Lead insert failed: ${res.status}`);
}

export const title = (t: Truck) => `${t.year} ${t.make} ${t.model}`;
export const money = (n: number | null) => (n == null ? "Call for price" : `$${n.toLocaleString("en-US")}`);

// Placeholder listings shown until Supabase is connected.
const SAMPLE: Truck[] = [
  { id: "f550-dump", year: 2017, make: "Ford", model: "F-550 XL Dump", body: "dump", price: 48900, miles: 112400, engine: "6.7L Power Stroke V8 Diesel", transmission: "Automatic", gvwr: "19,500 lb", description: "10 ft steel dump bed, 4x4, tow package. Ready for landscaping or site work.", image_url: null, featured: true },
  { id: "npr-box", year: 2019, make: "Isuzu", model: "NPR-HD 16ft Box", body: "box", price: 42500, miles: 98200, engine: "6.0L V8 Gas", transmission: "Automatic", gvwr: "14,500 lb", description: "16 ft dry van with roll-up door and ramp. Cab-over, easy to park in town.", image_url: null, featured: true },
  { id: "f450-service", year: 2016, make: "Ford", model: "F-450 Service Body", body: "service", price: 36900, miles: 134800, engine: "6.8L V10 Gas", transmission: "Automatic", gvwr: "16,500 lb", description: "Utility body with locking compartments and ladder rack.", image_url: null, featured: true },
  { id: "m2-flatbed", year: 2015, make: "Freightliner", model: "M2 106 Flatbed", body: "flatbed", price: 51900, miles: 187300, engine: "Cummins ISB 6.7L Diesel", transmission: "Allison Automatic", gvwr: "25,999 lb", description: "24 ft flatbed, non-CDL GVWR, air brakes.", image_url: null, featured: false },
  { id: "ram5500-rollback", year: 2018, make: "Ram", model: "5500 Rollback", body: "tow", price: null, miles: 121500, engine: "6.7L Cummins I6 Diesel", transmission: "Automatic", gvwr: "19,500 lb", description: "19 ft aluminum rollback with wheel lift and winch.", image_url: null, featured: false },
  { id: "silverado-2500", year: 2020, make: "Chevrolet", model: "Silverado 2500HD", body: "pickup", price: 34900, miles: 76100, engine: "6.6L V8 Gas", transmission: "Automatic", gvwr: "10,000 lb", description: "Long bed work truck, 4x4, spray-in liner.", image_url: null, featured: false },
];
