"use client";
import {useEffect,useMemo,useState} from "react";
import {displayCategories} from "@/lib/catalogue";
import {restaurant} from "@/lib/restaurantData";
import {rupees,DELIVERY_FEE_PAISA,MIN_ORDER_PAISA} from "@/lib/money";
import Icon from "@/components/site/Icon";
import CategoryNav from "./CategoryNav";
import MenuCard from "./MenuCard";
import DealCard from "./DealCard";
export default function MenuExplorer({categories,degraded}){
 const groups=useMemo(()=>displayCategories(categories),[categories]);
 const [active,setActive]=useState("all");
 const [query,setQuery]=useState("");
 useEffect(()=>{
  const sync=()=>{const slug=window.location.hash.slice(1);if(groups.some(group=>group.slug===slug))setActive(slug);else setActive("all");};
  sync();window.addEventListener("hashchange",sync);return()=>window.removeEventListener("hashchange",sync);
 },[groups]);
 const filtered=groups.filter(group=>active==="all"||group.slug===active).map(group=>({...group,menu_items:group.menu_items.filter(item=>(item.name+" "+item.description).toLowerCase().includes(query.trim().toLowerCase()))})).filter(group=>group.menu_items.length);
 const count=filtered.reduce((sum,group)=>sum+group.menu_items.length,0);
 function changeCategory(slug){setActive(slug);window.history.replaceState(null,"",slug==="all"?"/menu":"/menu#"+slug);}
 return <div className="menu-page">
  <div className="container"><div className="menu-intro"><div><p className="eyebrow">The Sheen menu</p><h1>FIND YOUR<br/><span className="orange-text">NEXT FAVOURITE.</span></h1><p>Shawarmas, sides, something to share. Make it yours.</p></div><div className="menu-service-note"><Icon name="bag" size={28}/><span>Delivery {rupees(DELIVERY_FEE_PAISA)}<br/><small>{rupees(MIN_ORDER_PAISA)} minimum · Takeaway available</small></span></div></div>
  <div className="search-field" role="search"><Icon name="search"/><label className="sr-only" htmlFor="menu-search">Search the menu</label><input id="menu-search" type="search" placeholder="What are you craving?" value={query} onChange={event=>setQuery(event.target.value)}/>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="Clear search"><Icon name="close"/></button>}<span className="search-shortcut" aria-hidden="true">Find your Sheen</span></div>
  </div>
  <div className="menu-sticky"><div className="container"><CategoryNav categories={groups} active={active} onChange={changeCategory}/></div></div>
  <div className="container menu-results"><p role="status" className="result-count">{count} {count===1?"item":"items"}{query?' matching “'+query+'”':" to explore"}</p>
   {degraded?<div className="empty-state"><Icon name="food" size={32}/><h2>The menu is taking a moment.</h2><p>Please try again, or browse Sheen on Foodpanda.</p><a className="button button-teal" href={restaurant.links.foodpanda} target="_blank" rel="noreferrer">Open Foodpanda <Icon name="arrow"/></a></div>
    :!count?<div className="empty-state"><Icon name="search" size={36}/><h2>{query?"No bites found.":"Nothing here just yet."}</h2><p>{query?"Try “chicken”, “fries”, or a different category.":"The menu will be available here."}</p><button className="button button-teal" onClick={()=>{setQuery("");changeCategory("all");}}>See the whole menu</button></div>
    :filtered.map(group=><section className="menu-category" key={group.slug} id={group.slug}><div className="category-heading"><h2>{group.name}</h2><span>{String(group.menu_items.length).padStart(2,"0")}</span></div><div className={group.slug==="deals"?"deals-grid":"menu-grid"}>{group.menu_items.map((item,index)=>group.slug==="deals"?<DealCard key={item.id} item={item} index={index}/>:<MenuCard key={item.id} item={item}/>)}</div></section>)}
  </div>
 </div>;
}
