import { bodyCategory, bodyLabel, getTrucks, photosOf, title } from "@/lib/inventory";
import { truckUrl } from "@/lib/seo";
import { abs, site } from "@/lib/site";

export const dynamic = "force-static";

// Machine-readable inventory feed for marketplaces and scrapers (Tru Machinery Market, etc.).
export async function GET() {
  const trucks = await getTrucks();
  return Response.json({
    dealer: { name: site.name, url: abs("/"), phone: site.phone, address: `${site.street}, ${site.city}` },
    generated_at: new Date().toISOString(),
    count: trucks.length,
    trucks: trucks.map((t) => ({
      id: t.id,
      url: truckUrl(t),
      title: title(t),
      year: t.year,
      make: t.make,
      model: t.model,
      category: bodyCategory(t.body),
      body: bodyLabel(t.body),
      price: t.price,
      price_type: t.price == null ? "Call" : "Firm",
      currency: "USD",
      miles: t.miles,
      vin: t.vin,
      engine: t.engine || null,
      transmission: t.transmission || null,
      gvwr: t.gvwr || null,
      description: t.description,
      images: photosOf(t),
      condition: "Used",
      availability: "Available",
    })),
  });
}
