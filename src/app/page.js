import Image from "next/image";
import Link from "next/link";
import { getPopularItems } from "@/lib/menu";
import MenuCard from "@/components/menu/MenuCard";
import Bloom from "@/components/site/Bloom";
import Reveal from "@/components/motion/Reveal";

export default async function HomePage() {
  const { items, all, degraded } = await getPopularItems(4);

  return (
    <>
      {/* ---------------- HERO ----------------
          Asymmetric .85/1.15, never centred. The left column stops at five
          items -- label, headline, paragraph, actions, stats -- because the
          whitespace between the headline and the button is doing real work. */}
      <section className="relative mx-auto grid max-w-[1180px] items-center gap-8 overflow-clip px-6 md:min-h-[min(88vh,900px)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Bloom />

        {/* On mobile the dish moves ABOVE the headline -- food first -- and
            breaks vertically instead of horizontally, since there's nowhere
            sideways to break to. */}
        <div className="relative z-[1] order-first flex items-center justify-center md:order-last">
          <div className="relative aspect-square w-[min(104%,420px)] rounded-full border border-foreground/20 bg-[radial-gradient(circle_at_38%_34%,color-mix(in_srgb,var(--accent)_30%,var(--surface))_0%,color-mix(in_srgb,var(--accent-deep)_26%,var(--surface))_46%,var(--surface)_78%)] md:w-[118%] md:max-w-none md:translate-x-[6%]">
            {/* Shot on solid black, composited with mix-blend-lighten so the
                black drops out against the dark ground -- a true alpha
                cut-out is the eventual upgrade once real photography or a
                background-removal pass is available. */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <Image
                src="/images/hero-formal-sheen.png"
                alt="Formal Sheen, sliced open to show grilled chicken, pickles, garlic sauce and hummus in house-baked bread"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 480px"
                className="object-cover mix-blend-lighten"
              />
            </div>
            {/* Contact shadow -- without it a cut-out reads as clip art. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[12%] -bottom-[3%] h-[9%] rounded-[50%] bg-black/35 blur-[26px]"
            />
            <div className="absolute -right-1 top-4 z-[2] flex flex-col items-center justify-center rounded-full bg-accent px-4 py-3 leading-none text-accent-foreground shadow-[0_10px_28px_-10px_rgba(0,0,0,0.6)] md:right-3 md:top-8">
              <span className="text-lg font-extrabold">4.9★</span>
              <span className="text-[0.55rem] uppercase tracking-[0.1em]">68 reviews</span>
            </div>
          </div>
        </div>

        <div className="relative z-[2] pb-10 md:pb-0">
          <p className="noir-label mb-5">Shawarma · Bahria Enclave, Islamabad</p>
          <h1 className="mb-5 font-extrabold [font-size:var(--display-size)] [letter-spacing:var(--display-tracking)] [line-height:var(--display-leading)]">
            Big flavour.
            <br />
            No <span className="text-accent">shortcuts.</span>
          </h1>
          <p className="mb-7 max-w-[44ch] leading-relaxed text-muted">
            Bread, hummus and sauces made in house, every day. That&apos;s the whole
            reason it costs what it costs.
          </p>
          <div className="mb-8 flex flex-wrap gap-3.5">
            <Link
              href="/menu"
              className="inline-flex h-12 items-center rounded-full bg-accent px-7 font-semibold text-accent-foreground transition-colors hover:bg-accent-deep hover:text-foreground md:h-11"
            >
              Order now
            </Link>
            <Link
              href="/#find"
              className="inline-flex h-12 items-center rounded-full border border-border px-7 font-semibold transition-colors hover:border-accent md:h-11"
            >
              Find us
            </Link>
          </div>
          {/* Frosted glass earns its place here only because the bloom is
              genuinely behind it. Over a flat background it is just a lighter
              card with extra GPU cost. */}
          <dl className="flex items-center justify-around gap-6 rounded-[var(--radius-panel)] border border-border bg-surface/70 px-5 py-4 backdrop-blur-xl md:justify-start md:gap-7 md:rounded-none md:border-0 md:border-t md:border-t-border md:bg-transparent md:px-0 md:pb-0 md:pt-5 md:backdrop-blur-none">
            {[
              ["4.9", "68 reviews"],
              ["2–12", "Open daily"],
              ["Rs 500", "Min. order"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-xl font-bold tracking-tight">{value}</dd>
                <dd className="text-[0.72rem] uppercase tracking-[0.1em] text-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- HOW TO GET IT ---------------- */}
      <section className="pb-[var(--section-gap)]">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-border bg-border sm:grid-cols-3">
            {[
              {
                title: "Delivery",
                body: "Rs 99 flat, Rs 500 minimum order.",
                href: "/menu",
                cta: "Start an order",
                icon: (
                  <path d="M3 11.5 20 4l-6.5 17-3-7-7-2.5Z" />
                ),
              },
              {
                title: "Takeaway",
                body: "Order ahead, skip the line at Escape Heights.",
                href: "/menu",
                cta: "Start an order",
                icon: (
                  <>
                    <path d="M6 8h12l-1.2 12.5a1 1 0 0 1-1 .5H8.2a1 1 0 0 1-1-.5L6 8Z" />
                    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                  </>
                ),
              },
              {
                title: "Dine-in",
                body: "Walk in daily from 2pm — Friday from 3pm.",
                href: "/#find",
                cta: "Get directions",
                icon: (
                  <>
                    <path d="M8 3v6a2 2 0 0 1-4 0V3" />
                    <path d="M6 9v12" />
                    <path d="M17 3c-1.5 0-3 2-3 5s1.5 4 3 4" />
                    <path d="M17 3v16" />
                  </>
                ),
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group flex flex-col gap-3 bg-surface p-7 transition-colors hover:bg-surface/60"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7 text-accent-text"
                  aria-hidden="true"
                >
                  {service.icon}
                </svg>
                <h3 className="text-lg font-semibold tracking-tight">{service.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{service.body}</p>
                <span className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-accent-text group-hover:underline">
                  {service.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- POPULAR ---------------- */}
      <section className="py-[var(--section-gap)]">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-5">
            <h2 className="text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold tracking-tight">
              Most ordered
            </h2>
            <Link href="/menu" className="font-semibold text-accent-text hover:underline">
              Full menu →
            </Link>
          </div>

          {degraded && (
            <p className="rounded-[var(--radius-panel)] border border-border bg-surface p-5 text-muted">
              We couldn&apos;t load the menu just now. Please refresh, or call the
              shop to order.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.06}>
                <MenuCard item={item} featured={i === 0} allItems={all} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHY IT COSTS WHAT IT COSTS ---------------- */}
      <section className="py-[var(--section-gap)]">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-[var(--radius-panel)] border border-border">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/menu-beef-sheen.png"
                alt="Beef Sheen shawarma wrap sliced open next to a side of fries"
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <p className="noir-label mb-4">Why it costs what it costs</p>
            <h2 className="mb-5 text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold leading-[1.05] tracking-tight">
              Made in house.
              <br />
              Every day.
            </h2>
            <p className="mb-7 max-w-[46ch] leading-relaxed text-muted">
              Bread, hummus and sauces aren&apos;t shipped in — they&apos;re made in the
              shop, every day. It&apos;s slower and it costs more. That&apos;s the trade
              we make so the wrap holds together to the last bite.
            </p>
            <ul className="mb-8 space-y-3">
              {[
                "Flatbread baked through the day, never held over",
                "Hummus made fresh, not from a tub",
                "Garlic sauce and chili mayo, made in house",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm leading-relaxed">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-text"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/menu"
              className="inline-flex h-11 items-center rounded-full border border-border px-7 font-semibold transition-colors hover:border-accent"
            >
              See the full menu
            </Link>
          </div>
        </div>
      </section>

      {/* -------- SIGNATURE: the accent goes full-bleed exactly ONCE.
           Twice and it stops being an accent. Curved seams top and bottom --
           a straight seam is the other big template tell. -------- */}
      <svg
        className="-mb-px block h-24 w-full"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,96 L0,44 C280,-14 560,86 820,48 C1050,15 1250,6 1440,30 L1440,96 Z"
          fill="var(--accent-deep)"
        />
      </svg>
      <section className="bg-accent-deep">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="order-last md:order-first">
            <p className="noir-label mb-4 !text-foreground/70">The one to order first</p>
            <h2 className="mb-4 text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-none tracking-tight">
              The house bread
              <br />
              is the whole point.
            </h2>
            <p className="mb-6 max-w-[46ch] leading-relaxed text-foreground/85">
              Baked through the day, never held over. It&apos;s what people notice
              before the filling, and it&apos;s why the wrap holds together to the
              last bite.
            </p>
            <Link
              href="/menu"
              className="inline-flex h-12 items-center rounded-full bg-foreground px-7 font-semibold text-accent-deep transition-colors hover:bg-background hover:text-foreground md:h-11"
            >
              Order a Formal Sheen
            </Link>
          </div>
          <div className="relative order-first aspect-square w-[min(72%,300px)] justify-self-center rounded-full border border-foreground/25 bg-[radial-gradient(circle_at_40%_36%,color-mix(in_srgb,var(--foreground)_16%,transparent)_0%,transparent_68%)] md:order-last md:w-full">
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <Image
                src="/images/signature-formal-sheen.png"
                alt="Cross-section of Sheen's house-baked bread, torn open to show grilled chicken and garlic sauce"
                fill
                sizes="(max-width: 768px) 60vw, 340px"
                className="object-cover mix-blend-lighten"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-x-[12%] -bottom-[3%] h-[9%] rounded-[50%] bg-black/40 blur-[26px]"
            />
          </div>
        </div>
      </section>
      <svg
        className="-mt-px block h-24 w-full"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,0 L0,52 C300,110 620,10 900,44 C1120,70 1280,86 1440,62 L1440,0 Z"
          fill="var(--background)"
        />
      </svg>

      {/* ---------------- REVIEWS ---------------- */}
      <section id="reviews" className="py-[var(--section-gap)]">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="noir-label mb-4">What keeps people ordering again</p>
              <h2 className="text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold tracking-tight">
                4.9★ from 68 reviews
              </h2>
            </div>
            <a
              href="https://www.foodpanda.pk/restaurant/wgrb/sheen-wgrb"
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-accent-text hover:underline"
            >
              Read them on foodpanda →
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [
                "The bread",
                "Baked fresh through the day, never held over — the first thing regulars mention.",
              ],
              [
                "The portions",
                "Loaded, not garnished. Reviewers consistently call out how much you get.",
              ],
              [
                "The hummus",
                "Creamy, made in house, and the reason the wrap holds together to the last bite.",
              ],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="h-full rounded-[var(--radius-panel)] border border-border bg-surface p-7">
                  <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FIND US: the quietest section ---------------- */}
      <section id="find" className="py-[var(--section-gap)]">
        <div className="mx-auto max-w-[1180px] px-6">
          <h2 className="mb-8 text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold tracking-tight">
            Find us
          </h2>
          <div className="grid gap-7 rounded-[var(--radius-panel)] border border-border bg-surface p-9 sm:grid-cols-3">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Address
              </h3>
              <p className="leading-relaxed">
                Shop 1, Escape Heights, Plaza 61
                <br />
                Sector G, Avenue 1, Bahria Enclave
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Hours
              </h3>
              <p className="leading-relaxed">Mon–Thu, Sat, Sun · 2pm – 12am</p>
              <p className="text-sm text-muted">Friday from 3pm</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Order
              </h3>
              <p className="leading-relaxed">Dine-in · Takeaway · Delivery</p>
              <p className="text-sm text-muted">Rs 99 delivery · Rs 500 minimum</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
