export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="border-b border-line bg-white">
      <div className="rise mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-signal">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-signal">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {children && <p className="mt-3 max-w-xl text-lg text-muted">{children}</p>}
    </div>
  );
}
