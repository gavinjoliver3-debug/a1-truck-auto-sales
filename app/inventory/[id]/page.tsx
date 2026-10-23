import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { LeadForm } from "@/components/LeadForm";
import { TruckArt } from "@/components/TruckArt";
import { AvailableBadge } from "@/components/TruckCard";
import { bodyLabel, getTruck, getTrucks, money, title } from "@/lib/inventory";
import { site } from "@/lib/site";
import { btn } from "@/lib/ui";

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

  const specs: [IconName, string, string][] = [
    ["calendar", "Year", String(truck.year)],
    ["truck", "Body", bodyLabel(truck.body)],
    ["gauge", "Miles", truck.miles.toLocaleString("en-US")],
    ["bolt", "Engine", truck.engine],
    ["gears", "Transmission", truck.transmission],
    ["weight", "GVWR", truck.gvwr],
  ];

  return (
    <>
      <div className="border-b border-line bg-white">
        <nav aria-label="Breadcrumb" className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 text-[15px] text-muted">
          <Link href="/inventory" className="inline-flex items-center gap-1 font-semibold text-steel hover:text-ink">
            <Icon name="back" className="size-4" /> Inventory
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/inventory?type=${truck.body}`} className="hover:text-ink">
            {bodyLabel(truck.body)}
          </Link>
        </nav>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="rise">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-panel">
            {truck.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={truck.image_url} alt={title(truck)} className="h-full w-full object-cover" />
            ) : (
              <TruckArt body={truck.body} className="absolute inset-x-10 bottom-8 text-slate-400" />
            )}
          </div>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Specifications</h2>
            <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {specs.map(([icon, k, v]) => (
                <div key={k} className="flex items-center gap-3 bg-white p-4">
                  <Icon name={icon} className="size-5 shrink-0 text-muted" />
                  <div>
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Description</h2>
            <p className="mt-3 text-lg leading-relaxed text-steel">{truck.description}</p>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-24">
          <AvailableBadge />
          <p className="mt-4 text-muted">
            {truck.year} · {bodyLabel(truck.body)}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight tracking-tight">
            {truck.make} {truck.model}
          </h1>
          <p className="mt-4 font-display text-4xl font-semibold tabular-nums">{money(truck.price)}</p>
          <div className="mt-6 grid gap-3">
            <a href={site.phoneHref} className={btn.primary}>
              <Icon name="phone" className="size-4" /> Call {site.phone}
            </a>
            <Link href="/finance" className={btn.secondary}>
              Finance this truck
            </Link>
          </div>
          <div className="mt-8 border-t border-line pt-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Ask about this truck</h2>
            <LeadForm truckId={truck.id} prompt={`I'm interested in the ${title(truck)}.`} />
          </div>
        </aside>
      </div>
    </>
  );
}
