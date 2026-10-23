import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { SectionHeading } from "@/components/PageHeader";
import { TruckArt } from "@/components/TruckArt";
import { TruckCard } from "@/components/TruckCard";
import { contactRows, Visit } from "@/components/Visit";
import { BODIES, getTrucks } from "@/lib/inventory";
import { site } from "@/lib/site";
import { btn } from "@/lib/ui";

const reasons: [IconName, string, string][] = [
  ["dollar", "Straight pricing", "Most trucks list the asking price right on the page. No games, no hidden e-price."],
  ["file", "Specs up front", "GVWR, engine, transmission and miles on every listing, so you know it fits the job."],
  ["check", "Easy financing", "Pre-qualify online in two minutes. It won't affect your credit."],
  ["pin", "Local lot", "Right off N 9th St in Modesto. Call ahead and we'll have the truck ready to see."],
];

export default async function Home() {
  const trucks = await getTrucks();
  const picks = trucks.filter((t) => t.featured);
  const featured = (picks.length ? picks : trucks).slice(0, 3);
  const count = (body: string) => trucks.filter((t) => t.body === body).length;

  return (
    <>
      {/* Hero: pitch on the left, truck finder on the right */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="rise flex flex-col justify-center">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-sm font-medium text-steel">
              <Icon name="pin" className="size-4 text-signal" /> Used commercial trucks · Modesto, CA
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-6xl">
              Work trucks, priced straight and <span className="text-signal">ready to work.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Dump, box, service, flatbed and tow trucks with the price and specs on every listing. Financing available. Stop by the lot or give us
              a call.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/inventory" className={btn.primary}>
                Browse inventory <Icon name="arrow" className="size-4" />
              </Link>
              <Link href="/finance" className={btn.secondary}>
                Get pre-qualified
              </Link>
            </div>
          </div>

          <div className="rise rounded-2xl border border-line bg-paper p-5 [animation-delay:120ms] sm:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-lg font-semibold">Find your truck</h2>
              <span className="text-sm text-muted">{trucks.length} in stock</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {BODIES.map((b) => (
                <Link key={b.key} href={`/inventory?type=${b.key}`} className="group rounded-lg border border-line bg-white p-3 transition-colors hover:border-ink">
                  <TruckArt body={b.key} className="w-full text-slate-400 transition-colors group-hover:text-steel" />
                  <span className="mt-2 flex items-center justify-between gap-2 text-[15px] font-semibold">
                    {b.label}
                    <span className="font-normal text-muted tabular-nums">{count(b.key)}</span>
                  </span>
                </Link>
              ))}
            </div>
            <Link href="/inventory" className={`${btn.dark} mt-4 w-full`}>
              View all inventory <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-3">
        {contactRows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-signal">
              <Icon name={r.icon} />
            </span>
            <span>
              <span className="block text-sm text-muted">{r.label}</span>
              {r.href ? (
                <a href={r.href} className="font-semibold hover:text-signal">
                  {r.value}
                </a>
              ) : (
                <span className="font-semibold">{r.value}</span>
              )}
            </span>
          </div>
        ))}
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="On the lot" title="Featured trucks" />
          <Link href="/inventory" className="inline-flex items-center gap-1 font-semibold text-signal hover:underline">
            See all {trucks.length} trucks <Icon name="arrow" className="size-4" />
          </Link>
        </div>
        <div className="stagger mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => (
            <TruckCard key={t.id} truck={t} />
          ))}
        </div>
      </section>

      {/* Why A1 */}
      <section className="border-y border-line bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Why A1" title="Buying a work truck shouldn't be work" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(([icon, h, p]) => (
              <div key={h}>
                <span className="flex size-11 items-center justify-center rounded-lg bg-red-50 text-signal">
                  <Icon name={icon} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{h}</h3>
                <p className="mt-2 text-muted">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Finance CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-8 rounded-2xl bg-ink p-8 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Need financing?</h2>
            <p className="mt-3 max-w-lg text-lg text-slate-300">
              Tell us about your business and the truck you need. We&apos;ll call you to go over options. Owner-operators and new businesses
              welcome.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/finance" className={btn.primary}>
              Get pre-qualified
            </Link>
            <a href={site.phoneHref} className={`${btn.secondary} border-white/30 bg-transparent text-white hover:border-white`}>
              <Icon name="phone" className="size-4" /> {site.phone}
            </a>
          </div>
        </div>
      </section>

      <Visit />
    </>
  );
}
