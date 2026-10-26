import type { MetadataRoute } from "next";
import { getTrucks } from "@/lib/inventory";
import { truckUrl } from "@/lib/seo";
import { pageUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const trucks = await getTrucks();
  return [
    { url: pageUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: pageUrl("/inventory"), changeFrequency: "daily", priority: 0.9 },
    ...trucks.map((t) => ({ url: truckUrl(t), changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: pageUrl("/finance"), priority: 0.6 },
    { url: pageUrl("/about"), priority: 0.4 },
    { url: pageUrl("/contact"), priority: 0.5 },
  ];
}
