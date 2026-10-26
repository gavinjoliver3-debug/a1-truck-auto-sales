// schema.org JSON-LD for search engines, answer engines and inventory scrapers (e.g. Tru Machinery Market,
// which reads the ItemList on /inventory and the Vehicle block on each truck page).
import { bodyCategory, title, type Truck } from "./inventory";
import { abs, pageUrl, site } from "./site";

const DEALER_ID = abs("/#dealer");

export const truckUrl = (t: Truck) => pageUrl(`/inventory/${t.id}`);

export function dealerLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": DEALER_ID,
    name: site.name,
    url: abs("/"),
    telephone: "+1-209-857-0195",
    image: abs("/logo.svg"),
    logo: abs("/logo.svg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      addressLocality: "Modesto",
      addressRegion: "CA",
      postalCode: "95350",
      addressCountry: "US",
    },
    areaServed: "Central Valley, California",
    hasMap: site.mapsUrl,
  };
}

export function vehicleLd(t: Truck) {
  const extra = [
    t.gvwr && { "@type": "PropertyValue", name: "GVWR", value: t.gvwr },
    { "@type": "PropertyValue", name: "Mileage", value: t.miles, unitText: "miles" },
  ].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "@id": truckUrl(t),
    url: truckUrl(t),
    name: title(t),
    description: t.description || title(t),
    sku: t.id,
    brand: { "@type": "Brand", name: t.make },
    manufacturer: t.make,
    model: t.model,
    vehicleModelDate: String(t.year),
    bodyType: bodyCategory(t.body),
    category: bodyCategory(t.body),
    itemCondition: "https://schema.org/UsedCondition",
    mileageFromOdometer: { "@type": "QuantitativeValue", value: t.miles, unitCode: "SMI" },
    ...(t.vin && { vehicleIdentificationNumber: t.vin }),
    ...(t.engine && { vehicleEngine: { "@type": "EngineSpecification", name: t.engine } }),
    ...(t.transmission && { vehicleTransmission: t.transmission }),
    ...(t.image_url && { image: [t.image_url] }),
    additionalProperty: extra,
    offers: {
      "@type": "Offer",
      url: truckUrl(t),
      priceCurrency: "USD",
      ...(t.price != null && { price: t.price }),
      availability: "https://schema.org/InStock",
      seller: { "@id": DEALER_ID },
    },
  };
}

export function itemListLd(trucks: Truck[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Used commercial trucks for sale at ${site.name}`,
    numberOfItems: trucks.length,
    itemListElement: trucks.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: truckUrl(t), name: title(t) })),
  };
}

export function breadcrumbLd(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: pageUrl(path) })),
  };
}

export function faqLd(faqs: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

// Plain-language answers, also shown on the home page. Answer engines quote these directly.
export const FAQS: [string, string][] = [
  ["Where is A1 Truck & Auto Sales?", `${site.street}, ${site.city}. Call ahead and we'll have the truck you want to see ready.`],
  ["What kinds of trucks do you sell?", "Used commercial trucks: dump trucks, box trucks, service and utility trucks, flatbeds, rollbacks and tow trucks, and work pickups."],
  ["Do you offer financing?", "Yes. You can pre-qualify online in about two minutes, and it won't affect your credit. We call you to go over options."],
  ["How do I know if a truck is still available?", `Every truck listed on the website is available. Call ${site.phone} to confirm and set up a time to see it.`],
  ["What are your hours?", `Hours vary, so please call ahead at ${site.phone} and we'll have the truck ready when you arrive.`],
];

/** Escapes `<` so listing text can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
