// Absolute base URL of the live site (no trailing slash). Set NEXT_PUBLIC_SITE_URL when the site moves to its own domain.
const url = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gavinjoliver3-debug.github.io/a1-truck-auto-sales").replace(/\/$/, "");

export const site = {
  url,
  name: "A1 Truck & Auto Sales",
  phone: "(209) 857-0195",
  phoneHref: "tel:+12098570195",
  street: "1400 N 9th St #10",
  city: "Modesto, CA 95350",
  // TODO: confirm full weekly hours with the owner (Google only shows "Opens 12 PM Fri").
  hours: "Call ahead for current hours",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=1400+N+9th+St+%2310+Modesto+CA+95350",
  mapEmbed: "https://www.google.com/maps?q=1400+N+9th+St+%2310+Modesto+CA+95350&output=embed",
};

export const abs = (path: string) => `${url}${path}`;
// Canonical page URL. The GitHub Pages build serves folders, so its URLs end in "/".
export const pageUrl = (path: string) => abs(path === "/" || process.env.GITHUB_PAGES !== "true" ? path : `${path}/`);
