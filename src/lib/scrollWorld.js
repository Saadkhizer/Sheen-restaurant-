// ============================================================================
// ADDED — scroll-world scene config  (rev8: food-rich 4-scene hero)
// ----------------------------------------------------------------------------
// The hero flies: exterior sign -> the shelf/corner -> the food spread ->
// the beef shawarma dish. The plain interior "room" scene was removed and
// food scenes added, at the client's request. Every leg is a slice of ONE
// continuous render, so seams are frame-adjacent by construction.
//
//   scroll — viewport-heights of scrolling a scene occupies (bigger = slower)
//   linger — 0..0.6, how much the camera settles mid-scene while copy peaks
// ============================================================================
const B = "/clips";

const ALL = {
 diveScroll: 1.7,
 crossfade: 0.09,
 connectors: [],
 sections: [
  {
   // leg0 — the exterior sign. Carries the page's only <h1> and both CTAs.
   id:"street", label:"The Street",
   still:`${B}/still0.jpg`, stillMobile:`${B}/still0-m.jpg`,
   clip:`${B}/leg0.mp4`, clipMobile:`${B}/leg0-m.mp4`,
   scroll:1.9, linger:.3,
   titleTag:"h1",
   eyebrow:"Bahria Enclave, Islamabad",
   title:"BIG ON<br/><em>SHAWARMA.</em>",
   body:"Meet your kind of wrap. Chicken, beef, house bread and all the good stuff in between.",
   tags:["Dine in","Takeaway","Delivery"],
   ctas:[
    {label:"Explore the menu", href:"/menu"},
    {label:"Build your order", href:"/checkout"}
   ]
  },
  {
   // leg1 — the shelf / corner (kept, per the client)
   id:"shelf", label:"The Shelf",
   still:`${B}/still1.jpg`, stillMobile:`${B}/still1-m.jpg`,
   clip:`${B}/leg1.mp4`, clipMobile:`${B}/leg1-m.mp4`,
   scroll:1.5, linger:.35,
   accent:"#087b73",
   eyebrow:"Stay a while",
   title:"Books nobody<br/>made us put there.",
   body:"Shelves of paperbacks, odd little figures, teal chairs — a corner chosen rather than bought in bulk.",
   tags:["Dine in","Wi-Fi"]
  },
  {
   // leg2 — the food spread
   id:"spread", label:"The Spread",
   still:`${B}/still2.jpg`, stillMobile:`${B}/still2-m.jpg`,
   clip:`${B}/leg2.mp4`, clipMobile:`${B}/leg2-m.mp4`,
   scroll:1.6, linger:.3,
   eyebrow:"For the table",
   title:"ORDER LIKE<br/><em>YOU MEAN IT.</em>",
   body:"Wraps, loaded fries, hummus, garlic and chilli sauce. It travels well, and it is better shared.",
   tags:["Loaded fries","Hummus","Sauces"]
  },
  {
   // leg3 — the beef shawarma dish (the finale + a direct CTA)
   id:"beef", label:"Best-seller",
   still:`${B}/still3.jpg`, stillMobile:`${B}/still3-m.jpg`,
   clip:`${B}/leg3.mp4`, clipMobile:`${B}/leg3-m.mp4`,
   scroll:1.9, linger:.5,
   eyebrow:"Beef shawarma",
   title:"COME AND<br/><em>GET IT.</em>",
   body:"Tender beef, pickles, garlic sauce and crispy fries in our house bread. Order ahead, or walk in.",
   cta:{label:"Order the Beef Sheen", href:"/menu"}
  }
 ]
};

const block = (from, to, extra) => ({...ALL, ...extra, sections: ALL.sections.slice(from, to)});

// The whole 4-scene flight is the hero now.
export const sheenWorldHero = ALL;
// Rollback alias.
export const sheenWorld = ALL;
