import type { Lead } from "./lead";

export const BODIES = [
  { key: "dump", label: "Dump", category: "Dump Truck" },
  { key: "box", label: "Box / Van", category: "Box Truck" },
  { key: "service", label: "Service / Utility", category: "Service / Mechanics Truck" },
  { key: "flatbed", label: "Flatbed / Stake", category: "Flatbed Truck" },
  { key: "tow", label: "Rollback / Tow", category: "Tow Truck" },
  { key: "pickup", label: "Pickups", category: "Pickup Truck" },
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
  vin: string | null;
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

export async function getTrucks(): Promise<Truck[]> {
  if (isDemo) return SAMPLE;
  const res = await rest("trucks?status=eq.available&order=created_at.desc");
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
  // Preview: lands in the admin demo inbox in this browser.
  if (isDemo) return (await import("./admin-store")).addDemoLead(lead);
  const res = await rest("leads", { method: "POST", body: JSON.stringify(lead), headers: { Prefer: "return=minimal" } });
  if (!res.ok) throw new Error(`Lead insert failed: ${res.status}`);
}

// Category names match Tru Machinery Market's truck categories so its scraper maps them 1:1.
export const bodyCategory = (b: Body) => BODIES.find((x) => x.key === b)?.category ?? "Truck";
export const bodyLabel = (b: Body) => BODIES.find((x) => x.key === b)?.label ?? b;
export const title = (t: Truck) => `${t.year} ${t.make} ${t.model}`;
export const money = (n: number | null) => (n == null ? "Call for price" : `$${n.toLocaleString("en-US")}`);

// Placeholder listings shown until Supabase is connected.
export const SAMPLE: Truck[] = [
  { id: "f550-dump", year: 2017, make: "Ford", model: "F-550 XL Dump", body: "dump", price: 48900, miles: 112400, engine: "6.7L Power Stroke V8 Diesel", transmission: "Automatic", gvwr: "19,500 lb", description: "10 ft steel dump bed, 4x4, tow package. Ready for landscaping or site work.", image_url: null, vin: null, featured: true },
  { id: "npr-box", year: 2019, make: "Isuzu", model: "NPR-HD 16ft Box", body: "box", price: 42500, miles: 98200, engine: "6.0L V8 Gas", transmission: "Automatic", gvwr: "14,500 lb", description: "16 ft dry van with roll-up door and ramp. Cab-over, easy to park in town.", image_url: null, vin: null, featured: true },
  { id: "f450-service", year: 2016, make: "Ford", model: "F-450 Service Body", body: "service", price: 36900, miles: 134800, engine: "6.8L V10 Gas", transmission: "Automatic", gvwr: "16,500 lb", description: "Utility body with locking compartments and ladder rack.", image_url: null, vin: null, featured: true },
  { id: "m2-flatbed", year: 2015, make: "Freightliner", model: "M2 106 Flatbed", body: "flatbed", price: 51900, miles: 187300, engine: "Cummins ISB 6.7L Diesel", transmission: "Allison Automatic", gvwr: "25,999 lb", description: "24 ft flatbed, non-CDL GVWR, air brakes.", image_url: null, vin: null, featured: false },
  { id: "ram5500-rollback", year: 2018, make: "Ram", model: "5500 Rollback", body: "tow", price: null, miles: 121500, engine: "6.7L Cummins I6 Diesel", transmission: "Automatic", gvwr: "19,500 lb", description: "19 ft aluminum rollback with wheel lift and winch.", image_url: null, vin: null, featured: false },
  { id: "silverado-2500", year: 2020, make: "Chevrolet", model: "Silverado 2500HD", body: "pickup", price: 34900, miles: 76100, engine: "6.6L V8 Gas", transmission: "Automatic", gvwr: "10,000 lb", description: "Long bed work truck, 4x4, spray-in liner.", image_url: null, vin: null, featured: false },
];
