import Link from "next/link";
import { money, title, type Truck } from "@/lib/inventory";
import { TruckArt } from "./TruckArt";

export function TruckCard({ truck }: { truck: Truck }) {
  return (
    <Link
      href={`/inventory/${truck.id}`}
      className="group flex flex-col overflow-hidden rounded-md border border-line bg-white transition-shadow duration-200 hover:shadow-[0_10px_30px_-12px_rgba(15,23,42,.35)]"
    >
      <div className="relative aspect-[16/10] bg-gradient-to-b from-ink-2 to-ink">
        {truck.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={truck.image_url} alt={title(truck)} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <TruckArt body={truck.body} className="absolute inset-x-6 bottom-3 transition-transform duration-300 group-hover:-translate-x-1" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl font-bold uppercase leading-tight">{title(truck)}</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs text-muted">
          <dt className="sr-only">Miles</dt>
          <dd>{truck.miles.toLocaleString("en-US")} mi</dd>
          <dt className="sr-only">GVWR</dt>
          <dd>GVWR {truck.gvwr}</dd>
        </dl>
        <div className="mt-auto flex items-end justify-between border-t border-line pt-3">
          <span className="font-display text-2xl font-extrabold text-ink">{money(truck.price)}</span>
          <span className="text-sm font-semibold text-signal group-hover:underline">View truck →</span>
        </div>
      </div>
    </Link>
  );
}
