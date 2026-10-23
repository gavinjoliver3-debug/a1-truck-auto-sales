export function LogoMark({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
      <path d="M10 0H64L54 48H0Z" fill="#DC2626" />
      <g fill="#fff" transform="translate(9 0) skewX(-12)">
        <path fillRule="evenodd" d="M6 40 16 8h8l10 32h-7l-2-7h-10l-2 7Zm11-13h6l-3-11Z" />
        <path d="M38 13 46 8h6v32h-7V16l-7 4Z" />
      </g>
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-tight">
        <span className={`block font-display text-[17px] font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>Truck &amp; Auto Sales</span>
        <span className={`block text-xs font-medium ${light ? "text-slate-400" : "text-muted"}`}>Modesto, California</span>
      </span>
    </span>
  );
}
