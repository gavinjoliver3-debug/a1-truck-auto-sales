import type { Metadata } from "next";
import Link from "next/link";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";
import "./globals.css";

const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "500", "600"] });
const condensed = Barlow_Condensed({ variable: "--font-barlow-condensed", subsets: ["latin"], weight: ["600", "700", "800"] });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: { default: "A1 Truck & Auto Sales | Used Commercial Trucks in Modesto, CA", template: "%s | A1 Truck & Auto Sales" },
  description: "Used dump, box, service, flatbed and tow trucks for sale in Modesto, California. Call (209) 857-0195.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${condensed.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/95 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" aria-label="A1 Truck & Auto Sales home">
              <Logo light />
            </Link>
            <div className="flex items-center gap-1 sm:gap-6">
              <Link href="/inventory" className="hidden px-2 py-2 font-semibold text-white/80 hover:text-white sm:block">
                Inventory
              </Link>
              <Link href="/#visit" className="hidden px-2 py-2 font-semibold text-white/80 hover:text-white sm:block">
                Visit
              </Link>
              <a
                href={site.phoneHref}
                className="rounded bg-signal px-4 py-2.5 font-display text-lg font-bold tracking-wide text-white transition-colors hover:bg-signal-dark"
              >
                {site.phone}
              </a>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="bg-ink text-white/70">
          <div className="hazard h-2" />
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
            <Logo light />
            <address className="not-italic leading-relaxed">
              {site.street}
              <br />
              {site.city}
              <br />
              <a href={site.phoneHref} className="text-white hover:underline">
                {site.phone}
              </a>
            </address>
            <ul className="space-y-1">
              <li><Link href="/inventory" className="hover:text-white">Inventory</Link></li>
              <li><a href={site.mapsUrl} className="hover:text-white">Directions</a></li>
              <li><Link href="/#visit" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <p className="border-t border-white/10 py-5 text-center text-sm">
            © {new Date().getFullYear()} {site.name}. Used commercial trucks in Modesto, CA.
          </p>
        </footer>
      </body>
    </html>
  );
}
