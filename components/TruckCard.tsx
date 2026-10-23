import Link from "next/link";
import { bodyLabel, money, title, type Truck } from "@/lib/inventory";
import { Icon } from "./Icon";
import { TruckArt } from "./TruckArt";

export function AvailableBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-go ring-1 ring-emerald-200">
      <Icon name="check" className="size-3.5" /> Available
    </span>
  );
}

export function TruckCard({ truck }: { truck: Truck }) {
  return (
    <Link
      href={`/inventory/${truck.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-colors duration-150 hover:border-ink"
    >
      <div className="relative aspect-[16/10] bg-panel">
        {truck.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={truck.image_url} alt={title(truck)} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <TruckArt body={truck.body} className="absolute inset-x-6 bottom-4 text-slate-400 transition-transform duration-300 group-hover:-translate-x-1" />
        )}
        <span className="absolute left-3 top-3">
          <AvailableBadge />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-medium text-muted">
          {truck.year} · {bodyLabel(truck.body)}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug">
          {truck.make} {truck.model}
        </h3>
        <dl className="mt-4 mb-5 grid grid-cols-2 gap-3 text-[15px] text-muted">
          <div className="flex items-center gap-1.5">
            <Icon name="gauge" className="size-4 shrink-0" />
            <dt className="sr-only">Miles</dt>
            <dd>{truck.miles.toLocaleString("en-US")} mi</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="weight" className="size-4 shrink-0" />
            <dt className="sr-only">GVWR</dt>
            <dd>{truck.gvwr}</dd>
          </div>
        </dl>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <span className="font-display text-xl font-semibold tabular-nums">{money(truck.price)}</span>
          <span className="inline-flex items-center gap-1 text-[15px] font-semibold text-signal">
            Details <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
