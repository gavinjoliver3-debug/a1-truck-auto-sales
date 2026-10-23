"use client";

import { useState } from "react";
import { saveLead } from "@/lib/inventory";
import { validateLead } from "@/lib/lead";

const field = "w-full rounded border border-line bg-white px-3 py-2.5 text-base outline-none focus:border-ink";

// Posts straight to Supabase from the browser so it also works on static hosting (GitHub Pages).
// The anon key is public by design; RLS only allows inserting leads, and the table enforces lengths.
export function LeadForm({ truckId, prompt }: { truckId?: string; prompt?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { lead, error } = validateLead(Object.fromEntries(new FormData(e.currentTarget)));
    if (!lead) return setError(error);
    setError(undefined);
    setStatus("sending");
    try {
      await saveLead(lead);
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please call us instead.");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="rounded border border-line bg-white p-5 font-medium">
        Thanks — we got your message and will call you back soon.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {truckId && <input type="hidden" name="truck_id" value={truckId} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          Name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Phone
          <input name="phone" type="tel" required autoComplete="tel" className={field} />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        <span>
          Email <span className="font-normal text-muted">(optional)</span>
        </span>
        <input name="email" type="email" autoComplete="email" className={field} />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Message
        <textarea name="message" rows={4} defaultValue={prompt} className={field} />
      </label>
      {error && (
        <p role="alert" className="text-sm font-semibold text-signal">
          {error}
        </p>
      )}
      <button
        disabled={status === "sending"}
        className="cursor-pointer justify-self-start rounded bg-signal px-6 py-3 font-display text-lg font-bold uppercase tracking-wide text-white transition-colors hover:bg-signal-dark disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
