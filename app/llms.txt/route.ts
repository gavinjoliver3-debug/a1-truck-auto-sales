import { bodyLabel, getTrucks, money, title } from "@/lib/inventory";
import { FAQS, truckUrl } from "@/lib/seo";
import { abs, pageUrl, site } from "@/lib/site";

export const dynamic = "force-static";

// llms.txt: a plain-text summary AI assistants can read to answer questions about the dealership.
export async function GET() {
  const trucks = await getTrucks();
  const text = `# ${site.name}

> Used commercial truck dealer in Modesto, California. ${site.street}, ${site.city}. Phone ${site.phone}.

## Pages
- [Inventory](${pageUrl("/inventory")}): every truck for sale, with price and specs
- [Finance Now](${pageUrl("/finance")}): pre-qualify for truck financing
- [About](${pageUrl("/about")})
- [Contact](${pageUrl("/contact")})
- [Inventory feed (JSON)](${abs("/inventory.json")})

## Trucks for sale (${trucks.length})
${trucks.map((t) => `- [${title(t)}](${truckUrl(t)}): ${bodyLabel(t.body)}, ${money(t.price)}, ${t.miles.toLocaleString("en-US")} miles`).join("\n")}

## FAQ
${FAQS.map(([q, a]) => `### ${q}\n${a}`).join("\n\n")}
`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
