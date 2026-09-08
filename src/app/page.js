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
          Full-width split layout. Text left, full-bleed image right.
          The image breaks out of the container to fill the right edge
          of the viewport for a dramatic, modern look. */}
      <section className="relative min-h-[60vh] overflow-hidden md:min-h-[min(92vh,960px)]">
        <Bloom />

        {/* Full-bleed background image — covers the right half on desktop,
            full width on mobile with an overlay */}
        <div className="absolute inset-0 md:left-[45%]">
          <Image
            src="/images/hero-formal-sheen.png"
            alt="Formal Sheen, sliced open to show grilled chicken, pickles, garlic sauce and hummus in house-baked bread"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
          />
          {/* Gradient overlay — fades image into background on the left edge
              and darkens on mobile for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent md:via-[var(--background)]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent md:hidden" />
        </div>

        {/* Rating badge — floats over the image */}
        <div className="absolute right-6 top-24 z-[3] hidden flex-col items-center justify-center rounded-2xl bg-accent px-5 py-4 leading-none text-accent-foreground shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] md:flex">
          <span className="text-2xl font-extrabold">4.9★</span>
          <span className="text-[0.6rem] uppercase tracking-[0.12em]">68 reviews</span>
        </div>

        {/* Text content — sits on the left, over the gradient */}
        <div className="relative z-[2] mx-auto flex min-h-[60vh] max-w-[1180px] items-center px-6 md:min-h-[min(92vh,960px)]">
          <div className="max-w-xl pb-16 pt-24 md:pb-0 md:pt-0">
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

            <dl className="flex items-center justify-around gap-6 rounded-[var(--radius-panel)] border border-border bg-surface/70 px-5 py-4 backdrop-blur-xl md:inline-flex md:justify-start md:gap-7">
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
          <div className="relative order-first aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-panel)] md:order-last">
            <Image
              src="/images/signature-formal-sheen.png"
              alt="Cross-section of Sheen's house-baked bread, torn open to show grilled chicken and garlic sauce"
              fill
              sizes="(max-width: 768px) 90vw, 440px"
              className="object-cover"
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
          <div className="mb-10">
            <p className="noir-label mb-4">What keeps people ordering again</p>
            <h2 className="text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold tracking-tight">
              4.9★ from 84+ reviews
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Zohaib",
                text: "So glad that I gave this place a shot! If you like authentic shawarmas, then this is your place. I was skeptical about the pricing at first, but the shawarma was big in size.",
                rating: 5,
              },
              {
                name: "Ayesha",
                text: "I got the formal sheen and it was one of the best shawarmas I've tried in a long time. Definitely recommended!",
                rating: 5,
              },
              {
                name: "Zain",
                text: "The shawarma bread was perfect. The hummus was delicious. The fries were crunchy yet soft. Overall, it was one of the best shawarmas I have eaten in a while.",
                rating: 5,
              },
              {
                name: "Soha",
                text: "I didn't expect it to be this good!! Better than ALL shawarmas in Islamabad.",
                rating: 5,
              },
              {
                name: "Junaid",
                text: "Ordered AF Sheen — filling and bread was on spot! Fries were crispy on top. Food arrived fresh and was warm!",
                rating: 5,
              },
              {
                name: "Maamen",
                text: "Everything was delicious!! My go-to, always!",
                rating: 5,
              },
            ].map((review, i) => (
              <Reveal key={review.name} delay={i * 0.06}>
                <div className="h-full rounded-[var(--radius-panel)] border border-border bg-surface p-7">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent-text">
                      {review.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{review.name}</h3>
                      <div className="text-xs text-accent-text">
                        {"★".repeat(review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">&ldquo;{review.text}&rdquo;</p>
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

          {/* Google Maps embed */}
          <div className="mt-7 overflow-hidden rounded-[var(--radius-panel)] border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.5!2d73.09!3d33.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBahria%20Enclave%2C%20Islamabad!5e0!3m2!1sen!2spk!4v1"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sheen location on Google Maps"
              className="w-full"
            />
          </div>
          <p className="mt-3 text-center text-sm text-muted">
            <a
              href="https://maps.google.com/?q=Escape+Heights+Plaza+61+Sector+G+Avenue+1+Bahria+Enclave+Islamabad"
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent-text hover:underline"
            >
              Open in Google Maps →
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
