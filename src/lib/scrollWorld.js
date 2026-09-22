// ============================================================================
// ADDED — scroll-world scene config  (new file)
// ----------------------------------------------------------------------------
// Six scenes, one per clip in /public/clips/. Built from Sheen's own photographs.
//
// Defined at module scope ON PURPOSE: the engine remounts whenever this object
// changes identity, so building it inside a component would restart the flight
// on every render.
//
// Two knobs per scene control pacing:
//   scroll — viewport-heights of scrolling that scene occupies (longer = slower)
//   linger — 0..0.6, how much the camera settles mid-scene while the copy peaks
// ============================================================================
const B = "/clips";

const ALL = {
 // No brand label: the site header already shows the Sheen logo over the hero.
 diveScroll: 1.35,
 crossfade: 0.09,

 // Architecture A — one continuous forward take. No connectors: the six legs
 // are slices of a single render, so every seam is frame-adjacent by
 // construction (measured 36-40 dB PSNR).
 connectors: [],

 sections: [
  {
   id:"street", label:"The Street",
   still:`${B}/still0.jpg`, stillMobile:`${B}/still0-m.jpg`,
   clip:`${B}/leg0.mp4`, clipMobile:`${B}/leg0-m.mp4`,
   scroll:2.4, linger:.3,  // rev5: slowed hero (was 1.5) — less fast
   // ===== ADDED (rev 3): this scene IS the hero now =====================
   // The old <section className="hero"> was removed from page.js, so this
   // scene carries what that section carried: the page's only <h1>, the
   // primary menu CTA and the secondary order link. Dropping the <h1>
   // entirely would cost local search ranking, which matters more to a
   // Bahria Enclave restaurant than any animation.
   titleTag:"h1",
   eyebrow:"Bahria Enclave, Islamabad",
   title:"BIG ON<br/><em>SHAWARMA.</em>",
   body:"Meet your kind of wrap. Chicken, beef, house bread and all the good stuff in between.",
   tags:["Dine in","Takeaway","Delivery"],
   ctas:[
    {label:"Explore the menu", href:"/menu"},
    {label:"Build your order", href:"/checkout"}
   ]
   // ===== END rev 3 =====================================================
  },
  {
   id:"inside", label:"Inside",
   still:`${B}/still1.jpg`, stillMobile:`${B}/still1-m.jpg`,
   clip:`${B}/leg1.mp4`, clipMobile:`${B}/leg1-m.mp4`,
   scroll:2.0, linger:.22,  // rev5: slowed hero (was 1.25) — less fast
   eyebrow:"The room",
   title:"Not a counter you queue at.",
   body:"Teal and orange chairs, proper tables, a mural on the wall. Somewhere to actually sit down.",
   tags:["Table seating","Wi-Fi"]
  },
  {
   id:"corner", label:"The Corner",
   still:`${B}/still2.jpg`, stillMobile:`${B}/still2-m.jpg`,
   clip:`${B}/leg2.mp4`, clipMobile:`${B}/leg2-m.mp4`,
   scroll:1.3, linger:.4,
   // the one scene that shifts to the teal half of the brand
   accent:"#087b73",
   eyebrow:"The shelf",
   title:"Books nobody made us put there.",
   body:"Shelves of paperbacks, odd little figures, a lamp that has clearly been chosen rather than bought in bulk.",
   tags:["Stay a while"]
  },
  {
   id:"spread", label:"The Spread",
   still:`${B}/still3.jpg`, stillMobile:`${B}/still3-m.jpg`,
   clip:`${B}/leg3.mp4`, clipMobile:`${B}/leg3-m.mp4`,
   scroll:1.35, linger:.3,
   eyebrow:"For the table",
   title:"Order like you mean it.",
   body:"Wraps, loaded fries, hummus, garlic and chilli sauce. It travels well, and it is better shared.",
   tags:["Hummus","Loaded fries","Sauces"]
  },
  {
   id:"bread", label:"The Bread",
   still:`${B}/still4.jpg`, stillMobile:`${B}/still4-m.jpg`,
   clip:`${B}/leg4.mp4`, clipMobile:`${B}/leg4-m.mp4`,
   scroll:1.3, linger:.42,
   eyebrow:"The difference",
   title:"The bread is ours.",
   body:"Made in house, not bought in. It is the one thing you notice first and the reason the second bite is better than the first.",
   tags:["In-house bread","Chicken & beef"]
  },
  {
   id:"order", label:"Order",
   still:`${B}/still5.jpg`, stillMobile:`${B}/still5-m.jpg`,
   clip:`${B}/leg5.mp4`, clipMobile:`${B}/leg5-m.mp4`,
   scroll:1.7, linger:.5,
   eyebrow:"Beef shawarma",
   title:"Come and get it.",
   body:"Order online, or walk in and take whatever table is open. Both work.",
   // points at the existing menu route rather than a phone dial, so the
   // cinematic hands straight over to the ordering flow the site already has
   cta:{label:"Explore the menu", href:"/menu"}
  }
 ]
};

// ============================================================================
// ADDED (revision 2) — the flight split into three page blocks
// ----------------------------------------------------------------------------
// Originally all six scenes played as one 8-screen block at the top of the page,
// which buried the menu CTA and left the rest of the page static. Splitting the
// same six legs into three shorter blocks spreads the motion through the page
// and keeps each block to ~2-3 screens.
//
// Seams still hold: they only need to be frame-adjacent WITHIN a block, and
// each block keeps consecutive legs together (0-1, 2-3, 4-5).
//
// rail:false  — a two-dot rail says nothing; off on short blocks.
// hint:false  — only the first block should say "Scroll".
// ============================================================================
const block = (from, to, extra) => ({
 ...ALL,
 ...extra,
 sections: ALL.sections.slice(from, to)
});

// Top of the page: the arrival — street sign, then inside.
export const sheenWorldHero = block(0, 2);

// Mid page: the corner shelf and the table spread.
export const sheenWorldMid = block(2, 4, {hint: false});

// Late: the bread, then the order CTA.
export const sheenWorldLate = block(4, 6, {hint: false});

// Kept so the whole flight can be restored in one line if the split is not
// wanted: <ScrollWorld config={sheenWorld}/>
export const sheenWorld = ALL;
