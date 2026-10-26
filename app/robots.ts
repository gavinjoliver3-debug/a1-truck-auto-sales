import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

// Everything public is open to search engines, AI answer engines and inventory scrapers; only the admin is off-limits.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: abs("/sitemap.xml"),
  };
}
