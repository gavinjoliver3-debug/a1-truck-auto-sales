export type Lead = { name: string; phone: string; email: string; message: string; truck_id: string | null };

// Trust boundary: everything here comes straight from a public form.
export function validateLead(input: Record<string, unknown>): { lead?: Lead; error?: string } {
  const s = (k: string, max: number) => String(input[k] ?? "").trim().slice(0, max);
  const lead: Lead = {
    name: s("name", 100),
    phone: s("phone", 30),
    email: s("email", 200),
    message: s("message", 2000),
    truck_id: s("truck_id", 64) || null,
  };
  if (!lead.name) return { error: "Please add your name." };
  if (lead.phone.replace(/\D/g, "").length < 10) return { error: "Please add a phone number we can call back." };
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { error: "That email doesn't look right." };
  return { lead };
}
