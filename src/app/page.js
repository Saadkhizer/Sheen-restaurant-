import Link from "next/link";
import styles from "./homepage.module.css";
import {getPopularItems} from "@/lib/menu";
import {restaurant,IS_DEMO} from "@/lib/restaurantData";
import {rupees,MIN_ORDER_PAISA,DELIVERY_FEE_PAISA} from "@/lib/money";
// rev 3: HeroVisual no longer used — the hero is the scroll flight now.
// import HeroVisual from "@/components/site/HeroVisual";
import SignatureExperience from "@/components/site/SignatureExperience";
import LocationSection from "@/components/site/LocationSection";
import Icon from "@/components/site/Icon";
import MenuCard from "@/components/menu/MenuCard";
import DealCard from "@/components/menu/DealCard";
import Reveal from "@/components/motion/Reveal";
// ===== ADDED: scroll-world cinematic hero =====
import ScrollWorld from "@/components/site/ScrollWorld";
import {sheenWorldHero} from "@/lib/scrollWorld"; // rev5: mid/late blocks removed
import ProductCarousel from "@/components/site/ProductCarousel"; // rev6: mid-section product carousel
// ===== END ADDED =====
export const metadata={alternates:{canonical:"/"}};
export default async function HomePage(){
 const {items,all}=await getPopularItems(3);
 const formal=all.find(item=>item.slug==="formal-sheen");
 const deals=["solo-sheen","double-sawari","family-sheen"].map(slug=>all.find(item=>item.slug===slug)).filter(Boolean);
 // ===== ADDED (rev6): items for the mid-section product carousel =====
 // Real menu products (with images + real prices) first, then the food photos
 // the client sent as showcase cards (no price shown for those).
 const carouselItems=[
  ...all.filter(i=>i.image_url).map(i=>({img:i.image_url,name:i.name,price:rupees(i.price_paisa)})),
  {img:"/images/gallery/gallery-3-loaded-fries.jpg",name:"Loaded Fries"},
  {img:"/images/gallery/gallery-4-choc-chip-cookies.jpg",name:"Choc Chip Cookies"},
  {img:"/images/gallery/gallery-6-icecream.jpg",name:"Ice Cream"},
  {img:"/images/gallery/gallery-5-dark-cookies.jpg",name:"Double Choc"},
 ];
 // ===== END ADDED =====
 return <div className={styles.page}>
  {/* ===== ADDED (rev 3): scroll-world block 1 of 3 — THE HERO =========
      This replaced the old static hero entirely. Scene 0 carries the page's
      <h1> and both CTAs; scene 1 moves inside. The static hero that used to
      sit below is gone — see the REMOVED note underneath.
      To restore the old single 8-screen block: use <ScrollWorld
      config={sheenWorld}/> here and delete blocks 2 and 3 below.
      ================================================================== */}
  <ScrollWorld config={sheenWorldHero}/>
  {/* ===== END block 1 ===== */}
  {/* ===== REMOVED (rev 3): the old static hero ======================
      <section className="hero"> lived here: the "BIG ON SHAWARMA."
      headline, hero-grid, HeroVisual, the two CTAs, the services row
      and the hero-bottom-line strip.
      All of it now lives in scene 0 of sheenWorldHero above, which
      renders the <h1> and both CTAs over the moving footage.
      Git has the original: `git diff src/app/page.js` to see it, or
      `git checkout src/app/page.js` to put it all back.
      ============================================================= */}
  {/* ===== ADDED: scroll-reveal motion on the header-area category shortcuts =====
      The category strip below the hero now slides/fades in on scroll via <Reveal>
      (same motion language as the rest of the page). Per-card hover lift lives in
      globals.css. The 3-column grid structure is untouched, so the dividers and
      padding stay exactly as before.
      ========================================================================= */}
  <Reveal>
  <section className="service-strip"><div className="container service-grid"><Link href="/menu"><Icon name="bag"/><span><strong>A wrap for every mood</strong><small>Explore shawarmas, sides & more</small></span><Icon name="arrow" size={18}/></Link><Link href="/menu#deals"><Icon name="spark"/><span><strong>Good things come together</strong><small>Solo, sharing & family deals</small></span><Icon name="arrow" size={18}/></Link><Link href="/checkout"><Icon name="chat"/><span><strong>Your order, your way</strong><small>{IS_DEMO?"Try the order & WhatsApp preview":"Delivery or takeaway"}</small></span><Icon name="arrow" size={18}/></Link></div></section>
  </Reveal>
  {/* ===== END ADDED ===== */}
  <section className="section-pad picks-section" id="picks"><div className="container"><div className="section-heading"><div><p className="eyebrow">A good place to start</p><h2>MEET THE<br/><span className="orange-text">SHEEN PICKS.</span></h2></div><div><p>Different fillings. Same Sheen energy.<br/>Pick one, then make it yours.</p><Link href="/menu" className="text-link">See the whole menu <Icon name="arrow"/></Link></div></div>
  <div className="picks-grid">{items.map((item,index)=><Reveal key={item.id} delay={index*.06}><MenuCard item={item} featured={index===0}/></Reveal>)}</div>{!items.length&&<p className="notice">Our menu is unavailable at the moment. <a href={restaurant.links.foodpanda} target="_blank" rel="noopener noreferrer">Find Sheen on Foodpanda.</a></p>}</div></section>
  {/* ===== REMOVED (rev 5): mid-page scroll-world block ================
      This inline block sat between the picks and the deals but left a big
      empty band, and no animation was coming through — removed at the
      client's request. The scroll flight now lives ONLY in the hero.
      To restore: re-add <ScrollWorld config={sheenWorldMid} className="sw-inline"/>
      here and re-import sheenWorldMid from @/lib/scrollWorld.
      ================================================================== */}
  <section className="deals-section section-pad"><div className="container"><div className="section-heading"><div><p className="eyebrow">Bring your appetite. Or your people.</p><h2>DEALS.<br/><span className="orange-text">SHEELS.</span></h2></div><div><p>A little for you. A little for the whole crew.</p><Link href="/menu#deals" className="text-link">Explore all deals <Icon name="arrow"/></Link></div></div><div className="deals-grid">{deals.map((item,index)=><Reveal key={item.id} delay={index*.06}><DealCard item={item} index={index}/></Reveal>)}</div></div></section>
  {/* ===== ADDED (rev6): modern product carousel in the mid-section ===== */}
  <ProductCarousel items={carouselItems}/>
  {/* ===== END ADDED (rev6) ===== */}
  {/* ===== ADDED: scroll-reveal on the signature (photo) section =====
      The whole photo section now slides/fades in on scroll (same <Reveal>
      motion as the rest of the page). The two collage images inside it also
      float on their own — see SignatureExperience.jsx.
      ============================================================== */}
  <Reveal><SignatureExperience item={formal}/></Reveal>
  {/* ===== END ADDED ===== */}
  <section className="brand-interlude"><div className="container"><Icon name="spark" size={48}/><p>GOOD FOOD.<br/>GOOD COMPANY.<br/><span>THAT’S A SHEEN THING.</span></p><Icon name="spark" size={48}/></div></section>
  <LocationSection/>
  {/* ===== REMOVED (rev 5): late-page scroll-world block ===============
      Removed together with the mid block so the page below the hero has no
      heavy scroll-video sections (they caused the empty bands). Restore with
      <ScrollWorld config={sheenWorldLate} className="sw-inline"/> + its import.
      ================================================================== */}
  <section className="final-cta"><div className="container"><div><p className="eyebrow">Still thinking about that wrap?</p><h2>MAKE IT A SHEEN.</h2></div><Link href="/menu" className="button button-cream">Find your favourite <Icon name="arrow"/></Link></div></section>
  <div className="business-note container">{IS_DEMO&&<span>Menu and listing information shown for demonstration; subject to restaurant confirmation.</span>}<span>Delivery {rupees(DELIVERY_FEE_PAISA)} · Minimum {rupees(MIN_ORDER_PAISA)}</span></div>
 </div>;
}
