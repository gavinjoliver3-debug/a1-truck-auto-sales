"use server";

import { saveLead } from "@/lib/inventory";
import { validateLead } from "@/lib/lead";

export async function submitLead(_: unknown, form: FormData) {
  const values = Object.fromEntries(form) as Record<string, string>;
  const { lead, error } = validateLead(values);
  // Echo values back: React resets the form after every action.
  if (!lead) return { error, values };
  try {
    await saveLead(lead);
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong. Please call us instead." };
  }
}
