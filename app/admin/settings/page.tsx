"use client";

import { useState } from "react";
import { AdminHeader, Loading } from "@/components/admin/AdminShell";
import { Icon, type IconName } from "@/components/Icon";
import { validatePasswordChange, type Settings } from "@/lib/admin";
import { useStore } from "@/lib/admin-store";
import { abs, pageUrl } from "@/lib/site";
import { btn, field } from "@/lib/ui";

const LINKS: { label: string; url: string; note: string }[] = [
  { label: "Website", url: pageUrl("/"), note: "The live public site." },
  { label: "Inventory page", url: pageUrl("/inventory"), note: "Give this to Tru Machinery Market. It lists every truck with schema.org data on each listing." },
  { label: "Inventory feed (JSON)", url: abs("/inventory.json"), note: "Every available truck as JSON, for marketplaces and integrations." },
  { label: "Sitemap", url: abs("/sitemap.xml"), note: "Submit this in Google Search Console and Bing Webmaster Tools." },
  { label: "AI summary (llms.txt)", url: abs("/llms.txt"), note: "Plain-text summary for AI assistants and answer engines." },
];

function Section({ icon, title, sub, children }: { icon: IconName; title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-panel text-steel">
          <Icon name={icon} />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <p className="text-muted">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Input({ label, hint, ...rest }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      <span>
        {label} {hint && <span className="font-normal text-muted">{hint}</span>}
      </span>
      <input className={field} {...rest} />
    </label>
  );
}

function Saved({ text }: { text?: string }) {
  return text ? (
    <p role="status" className="flex items-center gap-2 text-sm font-semibold text-go">
      <Icon name="check" className="size-4" /> {text}
    </p>
  ) : null;
}

function CopyLink({ label, url, note }: { label: string; url: string; note: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="min-w-0">
        <p className="font-semibold">{label}</p>
        <a href={url} target="_blank" rel="noreferrer" className="block truncate font-mono text-sm text-signal hover:underline">
          {url}
        </a>
        <p className="mt-1 text-sm text-muted">{note}</p>
      </div>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className={`${btn.secondary} px-4 py-2 text-sm`}
      >
        <Icon name={copied ? "check" : "copy"} className="size-4" /> {copied ? "Copied" : "Copy"}
      </button>
    </li>
  );
}

export default function SettingsPage() {
  const { store, update } = useStore();
  if (!store) return <Loading />;
  return <SettingsForm settings={store.settings} onSave={(s) => update((st) => ({ ...st, settings: s }))} />;
}

function SettingsForm({ settings, onSave }: { settings: Settings; onSave: (s: Settings) => void }) {
  const [bizSaved, setBizSaved] = useState<string>();
  const [emailSaved, setEmailSaved] = useState<string>();
  const [pw, setPw] = useState<{ error?: string; ok?: string }>({});
  const form = (e: React.FormEvent<HTMLFormElement>) => Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

  return (
    <>
      <AdminHeader title="Settings" sub="Live links, business details and your login." />

      <div className="grid gap-6">
        <Section icon="link" title="Live links" sub="Links to share with marketplaces, search engines and partners.">
          <ul className="-my-4 divide-y divide-line">
            {LINKS.map((l) => (
              <CopyLink key={l.label} {...l} />
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-paper p-4 text-sm text-muted">
            These point at the GitHub Pages preview for now. When the site moves to its own domain, set <code className="font-mono text-ink">NEXT_PUBLIC_SITE_URL</code> in
            Vercel and every link, feed and sitemap updates on the next deploy.
          </p>
        </Section>

        <Section icon="pin" title="Business details" sub="Shown in the header, footer, contact page and search results.">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = form(e);
              onSave({ ...settings, name: f.name.trim(), phone: f.phone.trim(), street: f.street.trim(), city: f.city.trim(), hours: f.hours.trim(), banner: f.banner.trim() });
              setBizSaved("Saved");
            }}
            onInput={() => setBizSaved(undefined)}
            className="grid gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Business name" name="name" required defaultValue={settings.name} />
              <Input label="Phone" name="phone" type="tel" required defaultValue={settings.phone} />
              <Input label="Street address" name="street" required defaultValue={settings.street} />
              <Input label="City, state, ZIP" name="city" required defaultValue={settings.city} />
            </div>
            <Input label="Hours" name="hours" defaultValue={settings.hours} placeholder="Mon–Fri 8–5, Sat 9–2" />
            <Input label="Announcement banner" name="banner" hint="(optional; shows across the top of the site)" defaultValue={settings.banner} placeholder="Closed Monday for the holiday" />
            <div className="flex flex-wrap items-center gap-4">
              <button className={btn.primary}>Save details</button>
              <Saved text={bizSaved} />
            </div>
          </form>
        </Section>

        <Section icon="lock" title="Login & security" sub="The email and password you use to sign in to this admin.">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave({ ...settings, loginEmail: form(e).loginEmail.trim() });
              setEmailSaved("Saved");
            }}
            onInput={() => setEmailSaved(undefined)}
            className="flex flex-wrap items-end gap-4"
          >
            <div className="min-w-64 flex-1">
              <Input label="Login email" name="loginEmail" type="email" required autoComplete="email" defaultValue={settings.loginEmail} placeholder="you@example.com" />
            </div>
            <button className={btn.secondary}>Update email</button>
            <Saved text={emailSaved} />
          </form>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = form(e);
              const error = validatePasswordChange(f.current, f.next, f.confirm);
              // Preview: passwords are only checked, never stored. Supabase Auth handles the real change.
              setPw(error ? { error } : { ok: "Password looks good. It takes effect once staff login is connected." });
              if (!error) e.currentTarget.reset();
            }}
            className="mt-8 grid gap-4 border-t border-line pt-6"
          >
            <h3 className="font-display font-semibold">Change password</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Current password" name="current" type="password" autoComplete="current-password" />
              <Input label="New password" name="next" type="password" autoComplete="new-password" hint="(10+ characters, a number)" />
              <Input label="Confirm new password" name="confirm" type="password" autoComplete="new-password" />
            </div>
            {pw.error && (
              <p role="alert" className="text-sm font-semibold text-signal">
                {pw.error}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <button className={btn.secondary}>Change password</button>
              <Saved text={pw.ok} />
            </div>
          </form>
        </Section>

        <p className="text-sm text-muted">
          Preview: these settings save to this browser only, and the public site keeps its built-in details until Supabase is connected. Passwords are
          never stored in the preview.
        </p>
      </div>
    </>
  );
}
