/* Two blooms maximum -- three turns into fog. The primary tracks the DISH's
   optical centre (68% 48%), not the viewport's; a bloom centred on the
   section reads as a generic background gradient. The second, at 6%, is what
   gives a warm palette its "fire in a dark room" quality. */
export default function Bloom() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 blur-[28px]"
        style={{
          background:
            "radial-gradient(52% 46% at 68% 48%, color-mix(in oklch, var(--accent) 26%, transparent) 0%, color-mix(in oklch, var(--accent) 9%, transparent) 42%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden blur-[38px] md:block"
        style={{
          background:
            "radial-gradient(40% 34% at 8% 14%, color-mix(in oklch, var(--accent) 6%, transparent) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
