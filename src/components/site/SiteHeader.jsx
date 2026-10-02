"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
/* rev10: premium header — useEffect for scroll state */
import {useState,useEffect} from "react";
/* /rev10 */
import {useCart} from "@/lib/cart";
import {restaurant} from "@/lib/restaurantData";
import Logo from "./Logo";
import Icon from "./Icon";
import Dialog from "./Dialog";
const links=[["Home","/"],["Menu","/menu"],["Deals","/menu#deals"],["Find us","/#find"]];
export default function SiteHeader(){
 const pathname=usePathname();
 const {count,open}=useCart();
 const [navOpen,setNavOpen]=useState(false);
 /* rev10: premium header — track "scrolled" so the bar turns frosted + gains depth (height stays fixed → no layout jump) */
 const [scrolled,setScrolled]=useState(false);
 useEffect(()=>{
  let raf=0;
  const read=()=>{raf=0;setScrolled(window.scrollY>12);};
  const onScroll=()=>{if(!raf)raf=requestAnimationFrame(read);};
  read();
  window.addEventListener("scroll",onScroll,{passive:true});
  return()=>{window.removeEventListener("scroll",onScroll);if(raf)cancelAnimationFrame(raf);};
 },[]);
 /* /rev10 */
 return <>
  {/* rev10: data-scrolled drives the frosted state */}
  <header className="site-header" data-scrolled={scrolled?"true":"false"}><div className="container header-inner">
   <Link href="/" className="brand-lockup" aria-label="Sheen home"><Logo/><span>SHAWARMA & MORE</span></Link>
   <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label,href])=><Link key={label} href={href} aria-current={pathname===href?"page":undefined}>{label}</Link>)}</nav>
   <div className="header-actions"><Link className="button button-teal header-order" href="/menu">Order your Sheen <Icon name="arrow" size={17}/></Link>
    <button className="cart-trigger" onClick={open} aria-label={"Open cart, "+count+" items"}><Icon name="bag"/><span className="cart-label">Bag</span><span className="cart-count">{count}</span></button>
    <button className="icon-button mobile-menu-trigger" onClick={()=>setNavOpen(true)} aria-label="Open navigation" aria-expanded={navOpen} aria-controls="mobile-navigation"><Icon name="menu"/></button>
   </div>
  </div></header>
  <Dialog open={navOpen} onClose={()=>setNavOpen(false)} title="Explore Sheen" id="mobile-navigation" variant="drawer">
   <nav className="mobile-drawer-links" aria-label="Mobile navigation">{links.map(([label,href],index)=><Link key={label} href={href} style={{"--i":index}} /* rev10: stagger index */ onClick={()=>setNavOpen(false)} aria-current={pathname===href?"page":undefined}><span>0{index+1}</span>{label}<Icon name="arrow"/></Link>)}</nav>
   <div className="mobile-drawer-footer"><p>{restaurant.shortAddress}</p><Link className="button button-orange" href="/menu" onClick={()=>setNavOpen(false)}>Find your favourite <Icon name="arrow"/></Link></div>
  </Dialog>
  <nav className="mobile-action-bar" aria-label="Quick restaurant actions">
   <Link href="/menu" aria-current={pathname==="/menu"?"page":undefined}><Icon name="food"/><span>Menu</span></Link>
   <Link href="/menu#deals"><Icon name="spark"/><span>Deals</span></Link>
   <Link href="/#find"><Icon name="pin"/><span>Find us</span></Link>
   <button onClick={open} aria-label={"Open cart, "+count+" items"}><Icon name="bag"/><span>Bag {count>0?"("+count+")":""}</span></button>
  </nav>
 </>;
}
