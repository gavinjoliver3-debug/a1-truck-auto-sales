"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { btn } from "@/lib/ui";

const MAX = 10;

// Phone photos are 3–8 MB; shrink to a web-sized JPEG before keeping them.
// shortcut: the preview keeps photos as data URLs in this browser; upload them to Supabase Storage when going live.
async function shrink(file: File, max = 1280, quality = 0.75) {
  const bmp = await createImageBitmap(file); // also applies the photo's rotation (EXIF)
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas.toDataURL("image/jpeg", quality);
}

export function PhotoPicker({ photos, onChange }: { photos: string[]; onChange: (p: string[]) => void }) {
  const library = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [dragging, setDragging] = useState(false);

  async function add(files: FileList | null) {
    const list = [...(files ?? [])].filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    const room = MAX - photos.length;
    setError(list.length > room ? `Up to ${MAX} photos per truck, so only the first ${Math.max(room, 0)} were added.` : undefined);
    setBusy(true);
    const added: string[] = [];
    for (const f of list.slice(0, Math.max(room, 0))) {
      try {
        added.push(await shrink(f));
      } catch {
        setError(`Couldn't read ${f.name}. Try a JPG or PNG.`);
      }
    }
    setBusy(false);
    if (added.length) onChange([...photos, ...added]);
  }

  const pickerProps = { type: "file", accept: "image/*", className: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => (add(e.target.files), (e.target.value = "")) } as const;

  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between text-sm font-semibold">
        <span>Photos</span>
        <span className="font-normal text-muted">
          {photos.length}/{MAX} · first photo is the cover
        </span>
      </div>

      {photos.length > 0 && (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
          {photos.map((src, i) => (
            <li key={src.slice(-40) + i} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute left-2 top-2 rounded bg-ink/85 px-2 py-0.5 text-xs font-semibold text-white">Cover</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange([src, ...photos.filter((_, j) => j !== i)])}
                    className="rounded-md bg-white/90 p-2 text-ink hover:bg-white"
                    title="Make cover photo"
                  >
                    <Icon name="star" className="size-4" />
                    <span className="sr-only">Make photo {i + 1} the cover</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange(photos.filter((_, j) => j !== i))}
                  className="rounded-md bg-white/90 p-2 text-ink hover:bg-white hover:text-signal"
                  title="Remove photo"
                >
                  <Icon name="trash" className="size-4" />
                  <span className="sr-only">Remove photo {i + 1}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div
        onDragOver={(e) => (e.preventDefault(), setDragging(true))}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => (e.preventDefault(), setDragging(false), add(e.dataTransfer.files))}
        className={`flex flex-wrap items-center justify-center gap-3 rounded-lg border-2 border-dashed p-5 text-center transition-colors ${
          dragging ? "border-ink bg-panel" : "border-slate-300 bg-paper"
        }`}
      >
        <input ref={library} multiple {...pickerProps} />
        <input ref={camera} capture="environment" {...pickerProps} />
        <button type="button" disabled={busy || photos.length >= MAX} onClick={() => library.current?.click()} className={`${btn.dark} disabled:opacity-50`}>
          <Icon name="upload" className="size-4" /> {busy ? "Adding photos…" : "Upload photos"}
        </button>
        {/* Only phones and tablets get a direct-to-camera button */}
        <span className="hidden [@media(pointer:coarse)]:contents">
          <button type="button" disabled={busy || photos.length >= MAX} onClick={() => camera.current?.click()} className={`${btn.secondary} disabled:opacity-50`}>
            <Icon name="camera" className="size-4" /> Take photo
          </button>
        </span>
        <p className="w-full text-sm text-muted [@media(pointer:coarse)]:hidden">or drag photos here</p>
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-signal">
          {error}
        </p>
      )}
    </div>
  );
}
