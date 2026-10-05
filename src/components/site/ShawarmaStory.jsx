"use client";
// ============================================================================
// ADDED (rev11): ShawarmaStory — the scroll-driven food story hero
// ----------------------------------------------------------------------------
// Replaces the 4-video scroll flight (ScrollWorld) at the top of the homepage.
// One story, four chapters, driven by scroll position only:
//   1. Entrance    — the real Sheen shop front, slow push toward the door
//   2. Inside      — crossfade into the real dining room / counter
//   3. Ingredients — the Formal Sheen's real ingredients arrive one by one
//                    (house bread, grilled chicken, pickles, garlic sauce,
//                    hummus — straight from the menu description)
//   4. Assembled   — the ingredients pull into the finished wrap, glow blooms,
//                    headline + order buttons
//
// Why no video: phones seek video frames slowly, which is what made the old
// hero feel heavy. This is ~0.7MB of images + transform/opacity only (GPU),
// using framer-motion, which the project already ships. No new dependency.
//
// Scroll is never hijacked: the section is simply tall and its stage is
// sticky. Reduced-motion users get a complete static hero (see the CSS).
//
// ===== rev12: the Formal Sheen is now TAKEN APART on scroll ================
// The finished wrap appears, then dismantles: its five real ingredients fly
// out along dotted trails, each wearing its name tag, while the "camera"
// (a gentle 3D tilt + push-in on the whole composition) drifts around them
// and a numbered ingredient list on the left ticks along. At the end they
// spiral back into the centre and the wrap re-forms with a shockwave ring.
// Pure transform/opacity + one SVG line per ingredient — still no video,
// no new dependency, nothing paid. (The "scrubbed fly-through" idea from the
// scroll-world technique, minus the generated video.)
// =============================================================================
//
// To roll back: in src/app/page.js swap <ShawarmaStory/> for
// <ScrollWorld config={sheenWorldHero}/> — those files are untouched.
// ============================================================================
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Icon from "./Icon";
import s from "./ShawarmaStory.module.css";

const B = "/images/story";

// x/y: where each ingredient rests, in % of the composition box from its centre.
// Copy only claims what the Formal Sheen menu entry says it contains.
const INGREDIENTS = [
  {
    id: "bread",
    name: "House bread",
    note: "Soft, blistered, and built to hold everything in.",
    x: -34,
    y: -31,
  },
  {
    id: "chicken",
    name: "Grilled chicken",
    note: "Grilled, sliced and piled in generously.",
    x: 34,
    y: -33,
  },
  {
    id: "pickles",
    name: "Pickles",
    note: "A sharp, crunchy bite to cut through the richness.",
    x: 41,
    y: 12,
  },
  {
    id: "garlic",
    name: "Garlic sauce",
    note: "Our signature garlic sauce. Creamy, no apologies.",
    x: 14,
    y: 33, // rev12: 40 → 33 so its name tag never collides with the caption / rail
  },
  {
    id: "hummus",
    name: "Hummus",
    note: "Smooth hummus, spread through every bite.",
    x: -39,
    y: 22,
  },
];

// ---- the timeline, as fractions of the whole section's scroll -------------
const T = {
  introOut: [0.08, 0.14], // headline leaves
  exterior: [0, 0.24], // push toward the door
  inside: [0.17, 0.24, 0.35, 0.42], // in, hold, out
  food: 0.42, // first ingredient lands
  step: 0.07, // one ingredient per step
  gather: [0.8, 0.9], // ingredients pull into the wrap
  final: [0.86, 0.93], // headline + CTAs arrive
};

// framer-motion needs strictly increasing input stops
function mono(stops) {
  const out = [...stops];
  for (let i = 1; i < out.length; i++)
    if (out[i] <= out[i - 1]) out[i] = out[i - 1] + 0.0001;
  return out;
}

function Ingredient({ p, item, i }) {
  const last = i === INGREDIENTS.length - 1;
  const t0 = T.food + i * T.step;
  const g0 = T.gather[0] + i * 0.012,
    g1 = T.gather[1] - (INGREDIENTS.length - 1 - i) * 0.008;
  const dir = i % 2 ? -1 : 1; // alternate spin direction
  // rev12: fly OUT from the wrapper's centre (pull 0 → 1), hold, spiral back IN (→ 0)
  const stops = mono([t0 - 0.015, t0 + 0.05, g0, g1]);
  const pull = useTransform(p, stops, [0, 1, 1, 0]);
  // arrive → stay bright while it is the one being talked about → settle dimmer → gather
  const oIn = last
    ? mono([t0 - 0.01, t0 + 0.03, g0, g1 - 0.01, g1])
    : mono([t0 - 0.01, t0 + 0.03, t0 + T.step, t0 + T.step + 0.03, g0, g1 - 0.01, g1]);
  const oOut = last ? [0, 1, 1, 1, 0] : [0, 1, 1, 0.7, 0.7, 0.7, 0];
  const opacity = useTransform(p, oIn, oOut);
  // gentle depth drift while the camera moves (each ingredient at its own depth)
  const drift = useTransform(p, mono([T.food, T.gather[0]]), [0, (i % 2 ? 1 : -1) * (10 + i * 4)]);
  const x = useTransform(pull, (v) => `${item.x * v}%`);
  const y = useTransform([pull, drift], ([v, d]) => `calc(${item.y * v}% + ${d * v}px)`);
  const scale = useTransform(p, stops, [0.3, 1, 1, 0.3]);
  const rotate = useTransform(p, stops, [-70 * dir, 0, 0, 200 * dir]);
  const ring = useTransform(
    p,
    mono([t0 + 0.02, t0 + 0.045, t0 + T.step - 0.01, t0 + T.step + 0.01]),
    [0, 1, 1, last ? 1 : 0],
  );
  const ringFade = useTransform(p, [T.gather[0] - 0.02, T.gather[0]], [1, 0]);
  const ringO = useTransform([ring, ringFade], ([a, b]) => a * b);
  const trailO = useTransform(p, mono([t0, t0 + 0.05, g0, g1]), [0, 0.55, 0.55, 0]);
  return (
    <>
      {/* dotted trail from the centre to this ingredient (% of the same box the slot uses) */}
      <svg className={s.layer} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <motion.line
          x1="50"
          y1="50"
          x2={50 + item.x}
          y2={50 + item.y}
          className={s.trail}
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: pull, opacity: trailO }}
        />
      </svg>
      <motion.div
        className={`${s.layer} ${s.ingSlot}`}
        style={{ x, y, "--x": item.x, "--y": item.y }}
        aria-hidden="true"
      >
        <motion.div className={s.ing} style={{ opacity, scale }}>
          <motion.span className={s.spin} style={{ rotate }}>
            <img
              src={`${B}/${item.id}.webp`}
              alt=""
              width={420}
              height={420}
              loading="eager"
              decoding="async"
            />
          </motion.span>
          <motion.span className={s.ingRing} style={{ opacity: ringO }} />
          {/* rev12: the name tag that travels with the ingredient */}
          <span className={s.tag}>
            <b>{String(i + 1).padStart(2, "0")}</b> {item.name}
          </span>
        </motion.div>
      </motion.div>
    </>
  );
}

// rev12: the numbered ingredient list on the left — ticks along as you scroll
function TrackerItem({ p, item, i }) {
  const t0 = T.food + i * T.step;
  const opacity = useTransform(p, mono([t0 - 0.01, t0 + 0.02, t0 + T.step, t0 + T.step + 0.03]), [0.28, 1, 1, 0.62]);
  const x = useTransform(p, mono([t0 - 0.01, t0 + 0.03]), [-10, 0]);
  const tick = useTransform(p, mono([t0 + T.step - 0.005, t0 + T.step + 0.02]), [0, 1]);
  const dot = useTransform(p, mono([t0, t0 + 0.02, t0 + T.step, t0 + T.step + 0.02]), [0.35, 1, 1, 0]);
  return (
    <motion.li style={{ opacity, x }}>
      <span className={s.trackNum}>{String(i + 1).padStart(2, "0")}</span>
      <span className={s.trackName}>{item.name}</span>
      <span className={s.trackMark}>
        <motion.i style={{ opacity: dot }} />
        <motion.svg viewBox="0 0 12 12" style={{ opacity: tick }}>
          <path d="M2 6.4 4.8 9 10 3.2" />
        </motion.svg>
      </span>
    </motion.li>
  );
}

function Caption({ p, item, i }) {
  const t0 = T.food + i * T.step,
    t1 = t0 + T.step;
  const end = i === INGREDIENTS.length - 1 ? T.gather[0] : t1;
  const opacity = useTransform(
    p,
    mono([t0, t0 + 0.02, end - 0.015, end]),
    [0, 1, 1, 0],
  );
  const y = useTransform(p, mono([t0, t0 + 0.03]), [14, 0]);
  const visibility = useTransform(opacity, (v) =>
    v > 0.02 ? "visible" : "hidden",
  );
  return (
    <motion.div className={s.caption} style={{ opacity, y, visibility }}>
      <span className={s.count}>
        {String(i + 1).padStart(2, "0")} /{" "}
        {String(INGREDIENTS.length).padStart(2, "0")}
      </span>
      <p className={s.capName}>{item.name}</p>
      <p className={s.capNote}>{item.note}</p>
    </motion.div>
  );
}

export default function ShawarmaStory({ price }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // chapter 1 — entrance
  const extScale = useTransform(p, T.exterior, [1, 1.32]);
  const extO = useTransform(p, [0.17, 0.24], [1, 0]);
  const introO = useTransform(p, [0, ...T.introOut], [1, 1, 0]);
  const introY = useTransform(p, [0, T.introOut[1]], [0, -40]);
  const introVis = useTransform(introO, (v) =>
    v > 0.02 ? "visible" : "hidden",
  );
  const hintO = useTransform(p, [0, 0.03], [1, 0]);
  // chapter 2 — inside
  const insO = useTransform(p, T.inside, [0, 1, 1, 0]);
  const insScale = useTransform(p, [T.inside[0], T.inside[3]], [1.16, 1.02]);
  const insCopyO = useTransform(p, [0.2, 0.25, 0.33, 0.38], [0, 1, 1, 0]);
  const insCopyVis = useTransform(insCopyO, (v) =>
    v > 0.02 ? "visible" : "hidden",
  );
  // chapter 3 — ingredients
  const foodEyebrowO = useTransform(p, [0.38, 0.44, 0.78, 0.82], [0, 1, 1, 0]);
  // rev12: the whole wrap shows first, DISMANTLES (fades as its ingredients fly out),
  // stays gone while the ingredients are shown, then RE-FORMS at the merge
  const wrapO = useTransform(p, [0.36, 0.41, 0.43, 0.5, 0.86, 0.92], [0, 1, 1, 0, 0, 1]);
  const wrapScale = useTransform(p, [0.36, 0.43, 0.5, 0.86, 0.92], [0.88, 1, 1.07, 0.7, 1]);
  const wrapRot = useTransform(p, [0.43, 0.5, 0.86, 0.92], [0, -4, 6, 0]);
  // rev12: "camera" — a slow 3D tilt + push-in over the whole composition
  const camRotY = useTransform(p, [0.42, 0.62, 0.8, 0.88], [-10, 8, 0, 0]);
  const camRotX = useTransform(p, [0.42, 0.62, 0.8, 0.88], [6, -4, 0, 0]);
  const camScale = useTransform(p, [0.42, 0.7, 0.88, 0.94], [1, 1.07, 1, 1]);
  // rev12: shockwave ring when the wrap re-forms
  const burstO = useTransform(p, [0.86, 0.89, 0.95], [0, 0.9, 0]);
  const burstS = useTransform(p, [0.86, 0.95], [0.3, 1.55]);
  const trackO = useTransform(p, [0.38, 0.44, 0.8, 0.85], [0, 1, 1, 0]);
  // chapter 4 — assembled (signature move: the glow blooms, the wrap stays put)
  const glowO = useTransform(p, [0.36, 0.46], [0, 1]);
  const glowScale = useTransform(p, [0.42, 1], [0.9, 1.18]);
  const finalO = useTransform(p, T.final, [0, 1]);
  const finalY = useTransform(p, T.final, [24, 0]);
  const finalVis = useTransform(finalO, (v) =>
    v > 0.02 ? "visible" : "hidden",
  );
  const scrimO = useTransform(p, [0.36, 0.42], [1, 0]);
  // progress rail
  const bar = useTransform(p, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      className={s.story}
      aria-label="Sheen — from the street to your Sheen"
    >
      <div className={s.stage}>
        {/* food backdrop: lives under the photos, revealed as they fade */}
        <div className={s.foodBg} aria-hidden="true" />

        {/* chapter 1: the real shop front */}
        <motion.div
          className={s.photo}
          style={{ opacity: extO }}
          aria-hidden="true"
        >
          <motion.picture
            className={s.photoInner}
            style={{ scale: extScale }}
            data-origin="door"
          >
            <source
              media="(max-width: 767px)"
              srcSet={`${B}/exterior-m.webp`}
            />
            <img
              src={`${B}/exterior.webp`}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </motion.picture>
        </motion.div>
        {/* chapter 2: the real room */}
        <motion.div
          className={s.photo}
          style={{ opacity: insO }}
          aria-hidden="true"
        >
          <motion.picture className={s.photoInner} style={{ scale: insScale }}>
            <source media="(max-width: 767px)" srcSet={`${B}/inside-m.webp`} />
            <img src={`${B}/inside.webp`} alt="" decoding="async" />
          </motion.picture>
        </motion.div>
        <motion.div
          className={s.scrim}
          style={{ opacity: scrimO }}
          aria-hidden="true"
        />

        <div className={s.layout}>
          {/* composition: the wrap + its ingredients */}
          <div className={s.comp}>
            <motion.div
              className={s.cam}
              style={{ rotateX: camRotX, rotateY: camRotY, scale: camScale }}
            >
              <motion.div
                className={s.glow}
                style={{ opacity: glowO, scale: glowScale }}
                aria-hidden="true"
              />
              <motion.span
                className={s.burst}
                style={{ opacity: burstO, scale: burstS }}
                aria-hidden="true"
              />
              <motion.img
                className={s.wrap}
                src={`${B}/wrap.webp`}
                alt="Formal Sheen — grilled chicken, pickles, garlic sauce and hummus in Sheen house bread"
                width={900}
                height={1012}
                decoding="async"
                style={{ opacity: wrapO, scale: wrapScale, rotate: wrapRot }}
              />
              {INGREDIENTS.map((item, i) => (
                <Ingredient key={item.id} p={p} item={item} i={i} />
              ))}
            </motion.div>
          </div>

          {/* copy: every chapter's words share one spot, one at a time */}
          <div className={s.copy}>
            <motion.div
              className={`${s.block} ${s.intro}`}
              style={{ opacity: introO, y: introY, visibility: introVis }}
            >
              <p className={s.eyebrow}>
                <Icon name="pin" size={15} /> Bahria Enclave, Islamabad
              </p>
              <h1 className={s.title}>
                BIG ON
                <br />
                <em>SHAWARMA.</em>
              </h1>
              <p className={s.body}>
                Meet your kind of wrap. Chicken, beef, house bread and all the
                good stuff in between.
              </p>
              <div className={s.ctas}>
                <Link className="button button-orange" href="/menu">
                  Explore the menu <Icon name="arrow" size={17} />
                </Link>
                <Link className={s.ghost} href="/checkout">
                  Build your order
                </Link>
              </div>
            </motion.div>

            <motion.div
              className={`${s.block} ${s.insideBlock}`}
              style={{ opacity: insCopyO, visibility: insCopyVis }}
              aria-hidden="true"
            >
              <p className={s.eyebrow}>Step inside</p>
              <p className={s.titleSm}>
                Teal chairs, full shelves,
                <br />
                <em>wraps on the way.</em>
              </p>
            </motion.div>

            <div className={s.foodCopy} aria-hidden="true">
              <motion.p className={s.eyebrow} style={{ opacity: foodEyebrowO }}>
                The Formal Sheen, taken apart
              </motion.p>
              <div className={s.captions}>
                {INGREDIENTS.map((item, i) => (
                  <Caption key={item.id} p={p} item={item} i={i} />
                ))}
              </div>
              {/* rev12: numbered ingredient list that ticks along */}
              <motion.ol className={s.tracker} style={{ opacity: trackO }}>
                {INGREDIENTS.map((item, i) => (
                  <TrackerItem key={item.id} p={p} item={item} i={i} />
                ))}
              </motion.ol>
            </div>

            <motion.div
              className={`${s.block} ${s.final}`}
              style={{ opacity: finalO, y: finalY, visibility: finalVis }}
            >
              <p className={s.eyebrow}>
                The Formal Sheen{price ? ` · ${price}` : ""}
              </p>
              <h2 className={s.title}>
                ALL IN.
                <br />
                <em>ONE SHEEN.</em>
              </h2>
              <p className={s.body}>
                Grilled chicken, pickles, garlic sauce and hummus, rolled in our
                house bread.
              </p>
              <div className={s.ctas}>
                <Link className="button button-orange" href="/menu">
                  Order your Sheen <Icon name="arrow" size={17} />
                </Link>
                <Link className={s.ghost} href="/menu#deals">
                  See the deals
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.p
          className={s.hint}
          style={{ opacity: hintO }}
          aria-hidden="true"
        >
          <span />
          Scroll
        </motion.p>
        <div className={s.rail} aria-hidden="true">
          <motion.span className={s.railFill} style={{ scaleX: bar }} />
          <ol>
            <li>Street</li>
            <li>Inside</li>
            <li>Ingredients</li>
            <li>Your Sheen</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
// ===== END rev11 / rev12 =====
