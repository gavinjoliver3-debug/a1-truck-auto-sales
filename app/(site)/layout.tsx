import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

const NAV = [
  ["/inventory", "Inventory"],
  ["/finance", "Finance Now"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" aria-label="A1 Truck & Auto Sales home">
              <Logo />
            </Link>
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {NAV.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-md px-3 py-2 font-semibold text-steel transition-colors hover:bg-panel hover:text-ink">
                  {label}
                </Link>
              ))}
            </nav>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-md bg-signal px-4 py-2.5 font-semibold text-white transition-colors hover:bg-signal-dark">
              <Icon name="phone" className="size-4" />
              <span className="hidden sm:inline">{site.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
          <nav aria-label="Main" className="flex justify-between border-t border-line px-4 md:hidden">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} className="py-3 text-[15px] font-semibold text-steel hover:text-ink">
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <main>{children}</main>

        <footer className="bg-ink text-slate-300">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo light />
              <p className="mt-4 max-w-xs text-slate-400">Used commercial trucks in Modesto, California.</p>
            </div>
            <div>
              <h2 className="font-display font-semibold text-white">Visit</h2>
              <address className="mt-3 not-italic leading-relaxed">
                {site.street}
                <br />
                {site.city}
              </address>
              <a href={site.mapsUrl} className="mt-2 inline-block font-semibold text-white hover:underline">
                Get directions
              </a>
            </div>
            <div>
              <h2 className="font-display font-semibold text-white">Contact</h2>
              <a href={site.phoneHref} className="mt-3 block text-white hover:underline">
                {site.phone}
              </a>
              <p className="mt-1">{site.hours}</p>
            </div>
            <div>
              <h2 className="font-display font-semibold text-white">Pages</h2>
              <ul className="mt-3 space-y-1.5">
                {NAV.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="border-t border-white/10 py-5 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} {site.name}
          </p>
        </footer>
    </>
  );
}
