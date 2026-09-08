"use client";
import {useState} from "react";
import {useCart} from "@/lib/cart";
import {rupees} from "@/lib/money";
import {DEAL_GROUPS} from "@/lib/menuOptions";
import FoodImage from "./FoodImage";
import ItemModal from "./ItemModal";
import Icon from "@/components/site/Icon";
export default function DealCard({item,index=0}){
 const [selected,setSelected]=useState(false);
 const {open}=useCart();
 return <article className={"deal-card deal-tone-"+index%3}>
  <div className="deal-card-top"><span className="eyebrow">{DEAL_GROUPS[item.slug]||"Deals Sheels"}</span><span className="deal-number">0{index+1}</span></div>
  <h3>{item.name}</h3><p>{item.description}</p>
  <FoodImage src={item.image} fallback={item.fallbackImage} alt={item.name} className="deal-photo"/>
  <div className="deal-bottom"><div><span>The whole deal</span><strong>{rupees(item.price_paisa)}</strong></div><button className="icon-button" onClick={()=>setSelected(true)} aria-label={"Choose "+item.name}><Icon name="arrow"/></button></div>
  <ItemModal item={item} open={selected} onClose={added=>{setSelected(false);if(added)setTimeout(open,260);}}/>
 </article>;
}
