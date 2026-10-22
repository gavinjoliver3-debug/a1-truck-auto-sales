import type { Body } from "@/lib/inventory";

// Stand-in illustration until real photos are uploaded.
const BODY: Record<Body, React.ReactNode> = {
  dump: <path d="M118 52H300L292 100H124Z" />,
  box: <rect x="116" y="20" width="186" height="80" rx="3" />,
  service: (
    <>
      <rect x="116" y="52" width="186" height="48" rx="2" />
      <path d="M116 44h186v4H116z" />
    </>
  ),
  flatbed: (
    <>
      <rect x="116" y="88" width="186" height="12" />
      <rect x="116" y="44" width="7" height="44" />
    </>
  ),
  tow: (
    <>
      <path d="M116 80 302 92v8L116 92Z" />
      <rect x="116" y="50" width="7" height="34" />
    </>
  ),
  pickup: <path d="M116 62h150v38H116z" />,
};

export function TruckArt({ body, className = "" }: { body: Body; className?: string }) {
  return (
    <svg viewBox="0 0 320 140" className={className} aria-hidden="true">
      <g fill="#cbd5e1">
        {BODY[body]}
        <path d="M24 100V72q2-12 14-14l20-18q4-4 10-4h42v64Z" />
        <rect x="20" y="98" width={body === "pickup" ? 250 : 286} height="9" rx="2" />
      </g>
      <path d="M62 46h42v20H44Z" fill="#0f172a" opacity=".55" />
      <rect x="24" y="78" width="86" height="5" fill="#DC2626" />
      {[68, body === "pickup" ? 226 : 244].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="112" r="19" fill="#0b1120" />
          <circle cx={cx} cy="112" r="8" fill="#94a3b8" />
        </g>
      ))}
    </svg>
  );
}
