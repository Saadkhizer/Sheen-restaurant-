/* Recreates the client's own storefront/Instagram wordmark: "SH" + a teal
   glyph (three rounded prongs on a shared base, ringed with six dot-circles)
   + "N". Vector, not a photo of the sign, so it stays crisp at favicon size
   and at hero size from the same source. Colours come from globals.css --
   the letters reuse --accent, the glyph is --brand-teal. */
function SheenGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 66 106" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="10" cy="16" r="6.5" />
      <circle cx="50" cy="8" r="7" />
      <circle cx="41" cy="18" r="7" />
      <circle cx="59" cy="19" r="7" />
      <rect x="2" y="28" width="15" height="62" rx="7" />
      <rect x="25" y="28" width="15" height="62" rx="7" />
      <rect x="48" y="28" width="15" height="62" rx="7" />
      <rect x="2" y="82" width="61" height="13" rx="6" />
      <circle cx="18" cy="99" r="6.5" />
      <circle cx="34" cy="99" r="6.5" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-[0.06em] font-extrabold tracking-tighter text-accent ${className}`}
    >
      SH
      <SheenGlyph className="h-[0.68em] w-auto shrink-0 translate-y-[0.03em] text-brand-teal" />
      N
    </span>
  );
}
