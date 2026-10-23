import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { TruckArt } from "@/components/TruckArt";
import { BODIES, getTruck, getTrucks, money, title } from "@/lib/inventory";
import { site } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await getTrucks()).map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const truck = await getTruck((await params).id);
  return { title: truck ? title(truck) : "Truck not found" };
}

export default async function TruckPage({ params }: Props) {
  const truck = await getTruck((await params).id);
  if (!truck) notFound();

  const specs = [
    ["Body", BODIES.find((b) => b.key === truck.body)?.label],
    ["Miles", truck.miles.toLocaleString("en-US")],
    ["Engine", truck.engine],
    ["Transmission", truck.transmission],
    ["GVWR", truck.gvwr],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/inventory" className="text-sm font-semibold text-muted hover:text-ink">
        ← All inventory
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-gradient-to-b from-ink-2 to-ink">
          {truck.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={truck.image_url} alt={title(truck)} className="h-full w-full object-cover" />
          ) : (
            <TruckArt body={truck.body} className="absolute inset-x-10 bottom-6" />
          )}
        </div>

        <div>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">{title(truck)}</h1>
          <p className="mt-4 font-display text-4xl font-extrabold text-signal">{money(truck.price)}</p>
          <dl className="mt-6 divide-y divide-line border-y border-line font-mono text-sm">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 leading-relaxed">{truck.description}</p>
          <a
            href={site.phoneHref}
            className="mt-6 flex justify-center rounded bg-ink px-6 py-3.5 font-display text-xl font-bold uppercase tracking-wide text-white transition-colors hover:bg-steel"
          >
            Call {site.phone}
          </a>
        </div>
      </div>

      <section className="mt-16 max-w-2xl">
        <h2 className="font-display text-3xl font-extrabold uppercase">Ask about this truck</h2>
        <div className="mt-6">
          <LeadForm truckId={truck.id} prompt={`I'm interested in the ${title(truck)}.`} />
        </div>
      </section>
    </div>
  );
}
