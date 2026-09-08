"use client";
import {useId,useState} from "react";
import {useCart} from "@/lib/cart";
import {buildCartLine} from "@/lib/cartModel";
import {ADDON_SLUGS,DEAL_CHOICES,SIZE_VARIANTS} from "@/lib/menuOptions";
import {rupees} from "@/lib/money";
import Dialog from "@/components/site/Dialog";
import Icon from "@/components/site/Icon";
import FoodImage from "./FoodImage";
import QuantityControl from "./QuantityControl";
export default function ItemModal({item,open,onClose}){
 const {catalogue,addLine}=useCart();
 const id=useId();
 const variant=catalogue.find(product=>product.slug===SIZE_VARIANTS[item.slug]&&product.is_available);
 const [selectedId,setSelectedId]=useState(item.id);
 const [qty,setQty]=useState(1);
 const [extraIds,setExtraIds]=useState([]);
 const [choices,setChoices]=useState({});
 const [error,setError]=useState("");
 const selected=catalogue.find(product=>product.id===selectedId)||item;
 const extras=item.category_slug==="mains"?catalogue.filter(product=>ADDON_SLUGS.includes(product.slug)&&product.is_available):[];
 const chosenExtras=extras.filter(extra=>extraIds.includes(extra.id));
 const requiredChoices=DEAL_CHOICES[item.slug]||[];
 const ready=requiredChoices.every(option=>option.options.includes(choices[option.id]));
 const total=(selected.price_paisa+chosenExtras.reduce((sum,extra)=>sum+extra.price_paisa,0))*qty;
 function add(){
  try{
   const line=buildCartLine(selected,{qty,size:selected.slug.startsWith("small-a-")?"Small-A":variant?"Regular":null,extras:chosenExtras,choices});
   if(!addLine(line,false))throw new Error("This item is unavailable. Please choose another.");
   onClose(true);
  }catch(err){setError(err.message);}
 }
 return <Dialog open={open} onClose={()=>onClose(false)} title="Make it your Sheen" id={id}>
  <div className="product-sheet-scroll">
   <FoodImage key={selected.image} src={selected.image} fallback={selected.fallbackImage} alt={selected.name} sizes="(max-width: 639px) 100vw, 540px" className="sheet-photo"/>
   <div className="sheet-content"><div className="eyebrow">{item.category_slug==="deals"?"A little more to share":"Your order, your way"}</div><div className="sheet-title"><h3>{item.name}</h3><span>{rupees(selected.price_paisa)}</span></div><p className="muted">{item.description}</p>
    {variant&&<fieldset className="option-group"><legend>Choose your size</legend><div className="size-options">{[item,variant].map(option=><label key={option.id} className={selectedId===option.id?"option selected":"option"}><input type="radio" name={id+"size"} checked={selectedId===option.id} onChange={()=>setSelectedId(option.id)}/><span>{option.id===item.id?"Regular":"Small-A"}<small>{rupees(option.price_paisa)}</small></span><Icon name="check"/></label>)}</div></fieldset>}
    {requiredChoices.map(choice=><fieldset className="option-group" key={choice.id}><legend>{choice.label} <span className="required-label">Required</span></legend><div className="size-options">{choice.options.map(option=><label className={choices[choice.id]===option?"option selected":"option"} key={option}><input type="radio" name={id+choice.id} checked={choices[choice.id]===option} onChange={()=>setChoices(prev=>({...prev,[choice.id]:option}))}/><span>{option}</span></label>)}</div></fieldset>)}
    {extras.length>0&&<fieldset className="option-group"><legend>A little extra? <span className="optional-label">Per wrap</span></legend><div className="extras-list">{extras.map(extra=><label key={extra.id} className={extraIds.includes(extra.id)?"extra-option selected":"extra-option"}><input type="checkbox" checked={extraIds.includes(extra.id)} onChange={()=>setExtraIds(prev=>prev.includes(extra.id)?prev.filter(value=>value!==extra.id):[...prev,extra.id])}/><span>{extra.name}</span><strong>+ {rupees(extra.price_paisa)}</strong></label>)}</div></fieldset>}
    <div className="quantity-row"><span>How many?</span><QuantityControl value={qty} onChange={setQty} label={selected.name}/></div>
    {error&&<p className="form-error" role="alert">{error}</p>}
   </div>
  </div>
  <div className="sheet-bottom"><button className="button button-orange button-wide" onClick={add} disabled={!ready||!item.is_available}><Icon name="bag"/>{ready?"Add to bag":"Choose your shawarma"}<span className="button-price">{rupees(total)}</span></button></div>
 </Dialog>;
}
