"use client";
import {useState} from "react";
import {useCart} from "@/lib/cart";
import {rupees} from "@/lib/money";
import {DEAL_CHOICES} from "@/lib/menuOptions";
import FoodImage from "./FoodImage";
import AddToCart from "./AddToCart";
import ItemModal from "./ItemModal";
export default function MenuCard({item,featured=false}){
 const [customizing,setCustomizing]=useState(false);
 const {open}=useCart();
 const customizable=item.category_slug==="mains"||Boolean(DEAL_CHOICES[item.slug]);
 return <article className={"menu-card"+(featured?" featured":"")}>
  <button className="card-image-button" onClick={()=>setCustomizing(true)} aria-label={"View "+item.name} disabled={!item.is_available}>
   <FoodImage src={item.image} fallback={item.fallbackImage} alt={item.name}/>
   {item.is_popular&&<span className="product-badge">Sheen pick</span>}
  </button>
  <div className="card-body"><h3><button onClick={()=>setCustomizing(true)}>{item.name}</button></h3><p>{item.description}</p>
   <div className="card-bottom"><strong>{rupees(item.price_paisa)}</strong><AddToCart item={item} customizable={customizable} onCustomize={()=>setCustomizing(true)}/></div>
  </div>
  <ItemModal item={item} open={customizing} onClose={added=>{setCustomizing(false);if(added)setTimeout(open,260);}}/>
 </article>;
}
