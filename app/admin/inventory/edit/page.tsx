"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AdminHeader, Loading } from "@/components/admin/AdminShell";
import { PhotoPicker } from "@/components/admin/PhotoPicker";
import { Icon } from "@/components/Icon";
import { TruckCard } from "@/components/TruckCard";
import { parseTruck, TRUCK_STATUSES, type AdminTruck } from "@/lib/admin";
import { useStore } from "@/lib/admin-store";
import { BODIES, photosOf, title, type Truck } from "@/lib/inventory";
import { btn, field } from "@/lib/ui";

// Static hosting can't prerender unknown ids, so the truck to edit comes from ?id=.
export default function EditPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Edit />
    </Suspense>
  );
}

function Edit() {
  const id = useSearchParams().get("id");
  const { store, update } = useStore();
  if (!store) return <Loading />;
  const truck = id ? store.trucks.find((t) => t.id === id) : undefined;
  if (id && !truck)
    return (
      <p className="py-20 text-center text-muted">
        That truck isn&apos;t in the listings.{" "}
        <Link href="/admin/inventory" className="font-semibold text-signal">
          Back to listings
        </Link>
      </p>
    );
  return <TruckForm key={id ?? "new"} truck={truck} onSave={update} />;
}

function Field({ label, name, hint, ...rest }: { label: string; name: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      <span>
        {label} {hint && <span className="font-normal text-muted">{hint}</span>}
      </span>
      <input name={name} className={field} {...rest} />
    </label>
  );
}

function TruckForm({ truck, onSave }: { truck?: AdminTruck; onSave: ReturnType<typeof useStore>["update"] }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [preview, setPreview] = useState<Truck | undefined>(truck);
  const [photos, setPhotos] = useState<string[]>(truck ? photosOf(truck) : []);
  const read = (form: HTMLFormElement) => parseTruck(Object.fromEntries(new FormData(form)) as Record<string, string>);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { truck: parsed, error } = read(e.currentTarget);
    if (!parsed) return setError(error);
    const data = { ...parsed, photos, image_url: photos[0] ?? null };
    const now = new Date().toISOString();
    const saved = onSave((s) =>
      truck
        ? {
            ...s,
            trucks: s.trucks.map((t) =>
              t.id === truck.id ? { ...t, ...data, sold_at: data.status === "sold" ? (t.sold_at ?? now) : null } : t,
            ),
          }
        : { ...s, trucks: [{ ...data, id: crypto.randomUUID(), created_at: now, sold_at: data.status === "sold" ? now : null, views: 0 }, ...s.trucks] },
    );
    if (!saved) return setError("This browser's preview storage is full. Remove a few photos (here or on other trucks) and save again.");
    router.push("/admin/inventory");
  }

  return (
    <>
      <Link href="/admin/inventory" className="mb-4 inline-flex items-center gap-1 text-[15px] font-semibold text-steel hover:text-ink">
        <Icon name="back" className="size-4" /> Listings
      </Link>
      <AdminHeader title={truck ? `Edit ${title(truck)}` : "Add a truck"} />

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <form
          onSubmit={onSubmit}
          onInput={(e) => {
            const { truck: t } = read(e.currentTarget);
            if (t) setPreview({ ...t, id: truck?.id ?? "preview" });
          }}
          className="grid gap-5 rounded-xl border border-line bg-white p-6"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Year" name="year" inputMode="numeric" required defaultValue={truck?.year} />
            <Field label="Make" name="make" required defaultValue={truck?.make} placeholder="Ford" />
            <Field label="Model" name="model" required defaultValue={truck?.model} placeholder="F-550 XL Dump" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1 text-sm font-semibold">
              Body type
              <select name="body" required defaultValue={truck?.body ?? ""} className={field}>
                <option value="" disabled>
                  Choose one
                </option>
                {BODIES.map((b) => (
                  <option key={b.key} value={b.key}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Price" name="price" hint="(blank = call)" inputMode="numeric" defaultValue={truck?.price ?? ""} placeholder="48900" />
            <Field label="Miles" name="miles" inputMode="numeric" required defaultValue={truck?.miles} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Engine" name="engine" defaultValue={truck?.engine} placeholder="6.7L Diesel" />
            <Field label="Transmission" name="transmission" defaultValue={truck?.transmission} placeholder="Automatic" />
            <Field label="GVWR" name="gvwr" defaultValue={truck?.gvwr} placeholder="19,500 lb" />
          </div>
          <Field label="VIN" name="vin" hint="(optional; helps marketplaces match the truck)" maxLength={17} defaultValue={truck?.vin ?? ""} className={`${field} uppercase`} />
          <label className="grid gap-1 text-sm font-semibold">
            Description
            <textarea name="description" rows={4} defaultValue={truck?.description} className={field} />
          </label>
          <PhotoPicker photos={photos} onChange={setPhotos} />
          <div className="flex flex-wrap items-end gap-6">
            <label className="grid gap-1 text-sm font-semibold">
              Status
              <select name="status" defaultValue={truck?.status ?? "available"} className={`${field} w-auto`}>
                {TRUCK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 pb-3 font-semibold">
              <input type="checkbox" name="featured" defaultChecked={truck?.featured} className="size-5 accent-signal" />
              Feature on home page
            </label>
          </div>
          {error && (
            <p role="alert" className="text-sm font-semibold text-signal">
              {error}
            </p>
          )}
          <div className="flex gap-3 border-t border-line pt-5">
            <button className={btn.primary}>{truck ? "Save changes" : "Add truck"}</button>
            <Link href="/admin/inventory" className={btn.secondary}>
              Cancel
            </Link>
          </div>
        </form>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Website preview</h2>
          {preview ? (
            <div className="pointer-events-none">
              <TruckCard truck={{ ...preview, image_url: photos[0] ?? null }} />
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-muted">Fill in the form to see the listing card.</p>
          )}
        </div>
      </div>
    </>
  );
}
