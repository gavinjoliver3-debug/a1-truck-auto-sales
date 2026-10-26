import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { Visit } from "@/components/Visit";
import { pageUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Call (209) 857-0195 or visit A1 Truck & Auto Sales at 1400 N 9th St #10, Modesto, CA 95350.",
  alternates: { canonical: pageUrl("/contact") },
};

const cards: { icon: IconName; label: string; value: string; href: string; cta: string }[] = [
  { icon: "phone", label: "Call", value: site.phone, href: site.phoneHref, cta: "Tap to call" },
  { icon: "pin", label: "Visit", value: site.street, href: site.mapsUrl, cta: "Get directions" },
  { icon: "clock", label: "Hours", value: site.hours, href: site.phoneHref, cta: "Call to confirm" },
];

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Contact us">
        Questions about a truck, financing or a trade? Call, stop by, or send a message and we&apos;ll get back to you.
      </PageHeader>

      <div className="stagger mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-3">
        {cards.map((c) => (
          <a key={c.label} href={c.href} className="group rounded-xl border border-line bg-white p-6 transition-colors hover:border-ink">
            <span className="flex size-11 items-center justify-center rounded-lg bg-red-50 text-signal">
              <Icon name={c.icon} />
            </span>
            <span className="mt-4 block text-sm text-muted">{c.label}</span>
            <span className="mt-1 block font-display text-lg font-semibold">{c.value}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-[15px] font-semibold text-signal">
              {c.cta} <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        ))}
      </div>

      <Visit />
    </>
  );
}
