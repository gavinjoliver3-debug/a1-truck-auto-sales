import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { TruckArt } from "@/components/TruckArt";
import { BODIES } from "@/lib/inventory";
import { site } from "@/lib/site";
import { btn } from "@/lib/ui";

export const metadata: Metadata = {
  title: "About",
  description: "A1 Truck & Auto Sales is a used commercial truck dealer on N 9th St in Modesto, California.",
};

const steps = [
  ["Browse", "Every listing shows price, miles, engine, transmission and GVWR."],
  ["Call or stop by", "Ask questions and see the truck in person."],
  ["Test drive", "Drive it and look it over before you buy."],
  ["Finance & drive", "Pay your way or finance it, then put it to work."],
];

// TODO: replace the intro with the owner's own story (years in business, who runs the lot).
export default function About() {
  return (
    <>
      <PageHeader eyebrow="About A1" title="Trucks for people who work">
        A1 Truck &amp; Auto Sales is a used commercial truck dealer in Modesto, California, selling work trucks to contractors, landscapers,
        haulers and small fleets.
      </PageHeader>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        <div className="space-y-4 text-lg leading-relaxed text-steel">
          <SectionHeading eyebrow="What we do" title="The right truck for the job" />
          <p className="pt-2">
            A work truck is a tool. It needs the right body, the right GVWR and a price that makes sense for the jobs it&apos;ll do. That&apos;s
            what we sell: used commercial trucks, listed with the specs that matter and a straight price.
          </p>
          <p>
            You&apos;ll find us at {site.street}, just off N 9th St. Call ahead and we&apos;ll have the truck you&apos;re interested in pulled up
            and ready to look at.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-10">
          <TruckArt body="box" className="w-full text-slate-400" />
        </div>
      </section>

      <section className="border-y border-line bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Inventory" title="What we sell" />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BODIES.map((b) => (
              <li key={b.key}>
                <Link
                  href={`/inventory?type=${b.key}`}
                  className="group flex items-center justify-between rounded-xl border border-line p-4 font-semibold transition-colors hover:border-ink"
                >
                  {b.label}
                  <Icon name="arrow" className="size-4 text-signal transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading eyebrow="The process" title="How buying works" />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([h, p], i) => (
            <li key={h}>
              <span className="flex size-10 items-center justify-center rounded-full bg-red-50 font-display font-semibold text-signal">{i + 1}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{h}</h3>
              <p className="mt-2 text-muted">{p}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/inventory" className={btn.primary}>
            Browse inventory <Icon name="arrow" className="size-4" />
          </Link>
          <Link href="/contact" className={btn.secondary}>
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
