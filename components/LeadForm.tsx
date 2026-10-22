"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/actions";

const field = "w-full rounded border border-line bg-white px-3 py-2.5 text-base outline-none focus:border-ink";

export function LeadForm({ truckId, prompt }: { truckId?: string; prompt?: string }) {
  const [state, action, pending] = useActionState(submitLead, null);

  const v = state && "values" in state ? state.values : undefined;

  if (state?.ok) {
    return (
      <p role="status" className="rounded border border-line bg-white p-5 font-medium">
        Thanks — we got your message and will call you back soon.
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      {truckId && <input type="hidden" name="truck_id" value={truckId} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          Name
          <input name="name" defaultValue={v?.name} required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Phone
          <input name="phone" type="tel" defaultValue={v?.phone} required autoComplete="tel" className={field} />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        <span>
          Email <span className="font-normal text-muted">(optional)</span>
        </span>
        <input name="email" type="email" defaultValue={v?.email} autoComplete="email" className={field} />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Message
        <textarea name="message" rows={4} defaultValue={v?.message ?? prompt} className={field} />
      </label>
      {state?.error && (
        <p role="alert" className="text-sm font-semibold text-signal">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="cursor-pointer justify-self-start rounded bg-signal px-6 py-3 font-display text-lg font-bold uppercase tracking-wide text-white transition-colors hover:bg-signal-dark disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
