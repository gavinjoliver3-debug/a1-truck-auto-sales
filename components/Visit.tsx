import { Icon, type IconName } from "./Icon";
import { LeadForm } from "./LeadForm";
import { SectionHeading } from "./PageHeader";
import { site } from "@/lib/site";

export const contactRows: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: "pin", label: "Address", value: `${site.street}, ${site.city}`, href: site.mapsUrl },
  { icon: "phone", label: "Phone", value: site.phone, href: site.phoneHref },
  { icon: "clock", label: "Hours", value: site.hours },
];

export function Visit() {
  return (
    <section id="visit" className="scroll-mt-28 border-t border-line bg-white py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Visit" title="Come see the lot" />
          <ul className="mt-6 space-y-4">
            {contactRows.map((r) => (
              <li key={r.label} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-panel text-steel">
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
              </li>
            ))}
          </ul>
          <iframe title="Map to A1 Truck & Auto Sales" src={site.mapEmbed} loading="lazy" className="mt-8 aspect-[4/3] w-full rounded-xl border border-line" />
        </div>
        <div className="h-fit rounded-xl border border-line bg-paper p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Ask about a truck</h2>
          <p className="mt-2 mb-6 text-muted">Looking for something specific? Tell us what you need and we&apos;ll call you back.</p>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
