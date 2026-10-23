import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { LeadForm } from "@/components/LeadForm";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";
import { field } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Finance Now",
  description: "Get pre-qualified for financing on a used commercial truck at A1 Truck & Auto Sales in Modesto, CA.",
};

const steps = [
  ["Send the form", "About two minutes. Tell us about your business and the truck you need."],
  ["We call you", "We go over your options and what a lender will need. No surprises."],
  ["Drive it to work", "Once you're approved, sign the paperwork and take the truck."],
];

function Choice({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      <select name={label} defaultValue="" className={field}>
        <option value="">Choose one</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function Finance() {
  return (
    <>
      <PageHeader eyebrow="Financing" title="Finance your next truck">
        Tell us about your business and the truck you need, and we&apos;ll call you to go over financing options. Owner-operators and growing
        fleets welcome.
      </PageHeader>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-6 space-y-6">
            {steps.map(([h, p], i) => (
              <li key={h} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 font-display font-semibold text-signal">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{h}</h3>
                  <p className="text-muted">{p}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex items-start gap-3 rounded-xl border border-line bg-white p-5">
            <Icon name="phone" className="mt-0.5 size-5 shrink-0 text-signal" />
            <p className="text-muted">
              Prefer to talk it through?{" "}
              <a href={site.phoneHref} className="font-semibold text-ink hover:text-signal">
                Call {site.phone}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Get pre-qualified</h2>
          <p className="mt-2 mb-6 flex items-start gap-2 text-[15px] text-muted">
            <Icon name="check" className="mt-0.5 size-4 shrink-0 text-go" />
            This isn&apos;t a credit application and won&apos;t affect your credit. Please don&apos;t enter your SSN or bank details here.
          </p>
          <LeadForm>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">
                <span>
                  Business name <span className="font-normal text-muted">(optional)</span>
                </span>
                <input name="Business name" autoComplete="organization" className={field} />
              </label>
              <Choice label="Time in business" options={["Just starting", "Under 2 years", "2–5 years", "5+ years"]} />
              <label className="grid gap-1 text-sm font-semibold">
                Truck you&apos;re interested in
                <input name="Truck" placeholder="e.g. 2017 Ford F-550 Dump" className={field} />
              </label>
              <Choice label="Down payment" options={["Under $2,500", "$2,500–$5,000", "$5,000–$10,000", "$10,000+"]} />
              <Choice label="Credit" options={["Excellent", "Good", "Fair", "Rebuilding", "Not sure"]} />
              <Choice label="Best time to call" options={["Morning", "Afternoon", "Evening"]} />
            </div>
          </LeadForm>
        </div>
      </div>
    </>
  );
}
