import Link from "next/link";
import styles from "./homepage.module.css";
import {getPopularItems} from "@/lib/menu";
import {restaurant,IS_DEMO} from "@/lib/restaurantData";
import {rupees,MIN_ORDER_PAISA,DELIVERY_FEE_PAISA} from "@/lib/money";
import HeroVisual from "@/components/site/HeroVisual";
import SignatureExperience from "@/components/site/SignatureExperience";
import LocationSection from "@/components/site/LocationSection";
import Icon from "@/components/site/Icon";
import MenuCard from "@/components/menu/MenuCard";
import DealCard from "@/components/menu/DealCard";
import Reveal from "@/components/motion/Reveal";
export const metadata={alternates:{canonical:"/"}};
export default async function HomePage(){
 const {items,all}=await getPopularItems(3);
 const formal=all.find(item=>item.slug==="formal-sheen");
 const deals=["solo-sheen","double-sawari","family-sheen"].map(slug=>all.find(item=>item.slug===slug)).filter(Boolean);
 return <div className={styles.page}>
  <section className="hero"><div className="container hero-grid"><div className="hero-copy">
   <p className="eyebrow"><span className="small-star">✳</span> {restaurant.locality}, {restaurant.city}</p>
   <h1>BIG ON<br/><span>SHAWARMA.</span></h1><p className="hero-description">Meet your kind of wrap. Chicken, beef, house bread and all the good stuff in between.</p>
   <div className="hero-actions"><Link href="/menu" className="button button-orange">Explore the menu <Icon name="arrow"/></Link><Link href="/checkout" className="hero-secondary"><Icon name="chat"/>Build your order</Link></div>
   <div className="hero-services"><span><Icon name="food" size={16}/>Dine in</span><span>Takeaway</span><span>Delivery</span></div>
  </div><HeroVisual item={formal}/></div><div className="hero-bottom-line"><div className="container"><span>YOUR CRAVING. YOUR SHEEN.</span><Link href="#picks">Scroll for the good stuff <span>↓</span></Link></div></div></section>
  <section className="service-strip"><div className="container service-grid"><Link href="/menu"><Icon name="bag"/><span><strong>A wrap for every mood</strong><small>Explore shawarmas, sides & more</small></span><Icon name="arrow" size={18}/></Link><Link href="/menu#deals"><Icon name="spark"/><span><strong>Good things come together</strong><small>Solo, sharing & family deals</small></span><Icon name="arrow" size={18}/></Link><Link href="/checkout"><Icon name="chat"/><span><strong>Your order, your way</strong><small>{IS_DEMO?"Try the order & WhatsApp preview":"Delivery or takeaway"}</small></span><Icon name="arrow" size={18}/></Link></div></section>
  <section className="section-pad picks-section" id="picks"><div className="container"><div className="section-heading"><div><p className="eyebrow">A good place to start</p><h2>MEET THE<br/><span className="orange-text">SHEEN PICKS.</span></h2></div><div><p>Different fillings. Same Sheen energy.<br/>Pick one, then make it yours.</p><Link href="/menu" className="text-link">See the whole menu <Icon name="arrow"/></Link></div></div>
  <div className="picks-grid">{items.map((item,index)=><Reveal key={item.id} delay={index*.06}><MenuCard item={item} featured={index===0}/></Reveal>)}</div>{!items.length&&<p className="notice">Our menu is unavailable at the moment. <a href={restaurant.links.foodpanda} target="_blank" rel="noopener noreferrer">Find Sheen on Foodpanda.</a></p>}</div></section>
  <section className="deals-section section-pad"><div className="container"><div className="section-heading"><div><p className="eyebrow">Bring your appetite. Or your people.</p><h2>DEALS.<br/><span className="orange-text">SHEELS.</span></h2></div><div><p>A little for you. A little for the whole crew.</p><Link href="/menu#deals" className="text-link">Explore all deals <Icon name="arrow"/></Link></div></div><div className="deals-grid">{deals.map((item,index)=><Reveal key={item.id} delay={index*.06}><DealCard item={item} index={index}/></Reveal>)}</div></div></section>
  <SignatureExperience item={formal}/>
  <section className="brand-interlude"><div className="container"><Icon name="spark" size={48}/><p>GOOD FOOD.<br/>GOOD COMPANY.<br/><span>THAT’S A SHEEN THING.</span></p><Icon name="spark" size={48}/></div></section>
  <LocationSection/>
  <section className="final-cta"><div className="container"><div><p className="eyebrow">Still thinking about that wrap?</p><h2>MAKE IT A SHEEN.</h2></div><Link href="/menu" className="button button-cream">Find your favourite <Icon name="arrow"/></Link></div></section>
  <div className="business-note container">{IS_DEMO&&<span>Menu and listing information shown for demonstration; subject to restaurant confirmation.</span>}<span>Delivery {rupees(DELIVERY_FEE_PAISA)} · Minimum {rupees(MIN_ORDER_PAISA)}</span></div>
 </div>;
}
