import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { TruckArt } from "@/components/TruckArt";
import { TruckCard } from "@/components/TruckCard";
import { BODIES, getTrucks } from "@/lib/inventory";
import { site } from "@/lib/site";

export default async function Home() {
  const trucks = await getTrucks();
  const featured = trucks.filter((t) => t.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-0 pt-16 md:grid-cols-[1.1fr_1fr] md:pt-24">
          <div className="rise pb-10 md:pb-24">
            <p className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-white/60">Used commercial trucks · Modesto, CA</p>
            <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
              Work trucks
              <br />
              <span className="text-signal">ready to work.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/75">
              Dump, box, service, flatbed and tow trucks — priced straight, with the specs up front. Stop by the lot on N 9th St or give us a call.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/inventory"
                className="rounded bg-signal px-7 py-3.5 font-display text-xl font-bold uppercase tracking-wide transition-colors hover:bg-signal-dark"
              >
                Browse inventory
              </Link>
              <a
                href={site.mapsUrl}
                className="rounded border border-white/30 px-7 py-3.5 font-display text-xl font-bold uppercase tracking-wide transition-colors hover:border-white"
              >
                Get directions
              </a>
            </div>
          </div>
          <div className="rise relative self-end [animation-delay:150ms]">
            <TruckArt body="dump" className="relative z-10 w-full drop-shadow-2xl" />
            <div className="hazard -mx-4 h-3 md:mr-[calc(50%-50vw)]" />
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="border-b border-line bg-white">
        <dl className="mx-auto grid max-w-6xl divide-line px-4 sm:grid-cols-3 sm:divide-x">
          {[
            ["Call", <a key="p" href={site.phoneHref} className="hover:text-signal">{site.phone}</a>],
            ["Lot", <a key="a" href={site.mapsUrl} className="hover:text-signal">{site.street}, Modesto</a>],
            ["Hours", site.hours],
          ].map(([label, value]) => (
            <div key={label as string} className="py-5 sm:px-6 first:sm:pl-0">
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">{label}</dt>
              <dd className="mt-1 font-display text-2xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display text-4xl font-extrabold uppercase sm:text-5xl">Shop by body type</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {BODIES.map((b) => (
            <Link
              key={b.key}
              href={`/inventory?type=${b.key}`}
              className="group flex flex-col justify-between gap-4 rounded-md border border-line bg-white p-5 transition-colors hover:border-ink"
            >
              <TruckArt body={b.key} className="w-full [&_g]:fill-steel/80 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="flex items-center justify-between font-display text-xl font-bold uppercase">
                {b.label}
                <span className="text-signal" aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-ink-2/[0.04] py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl font-extrabold uppercase sm:text-5xl">On the lot now</h2>
              <Link href="/inventory" className="font-semibold text-signal hover:underline">
                See all {trucks.length} trucks →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((t) => (
                <TruckCard key={t.id} truck={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-3">
        {[
          ["01", "Price on the listing", "No “call for e-price” games on trucks we've priced. You see what we're asking."],
          ["02", "Specs up front", "GVWR, engine, transmission and miles on every truck, so you know if it fits the job before you drive out."],
          ["03", "Local & easy to reach", "Right off N 9th St in Modesto. Call, text or stop by to see a truck in person."],
        ].map(([n, h, p]) => (
          <div key={n} className="border-t-4 border-ink pt-5">
            <span className="font-mono text-sm text-signal">{n}</span>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase">{h}</h3>
            <p className="mt-2 text-muted">{p}</p>
          </div>
        ))}
      </section>

      {/* Visit + contact */}
      <section id="visit" className="scroll-mt-20 border-t border-line bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-extrabold uppercase sm:text-5xl">Visit the lot</h2>
            <p className="mt-3 text-lg text-muted">
              {site.street}, {site.city} · <a href={site.phoneHref} className="font-semibold text-ink hover:text-signal">{site.phone}</a>
            </p>
            <iframe
              title="Map to A1 Truck & Auto Sales"
              src={site.mapEmbed}
              loading="lazy"
              className="mt-6 aspect-[4/3] w-full rounded-md border border-line grayscale-[0.4]"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl font-extrabold uppercase sm:text-5xl">Ask about a truck</h2>
            <p className="mt-3 mb-6 text-lg text-muted">Looking for something specific? Tell us what you need and we&apos;ll call you back.</p>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
