"use client";
import {useState} from "react";
import {motion,useReducedMotion} from "framer-motion";
import {useCart} from "@/lib/cart";
import ItemModal from "@/components/menu/ItemModal";
import FoodImage from "@/components/menu/FoodImage";
import Icon from "./Icon";
export default function SignatureExperience({item}){
 const [active,setActive]=useState(0);const [open,setOpen]=useState(false);const cart=useCart();const reduce=useReducedMotion();
 if(!item)return null;
 const details=[
  {name:"The bread",title:"IT STARTS WITH\nTHE WRAP.",copy:"The house bread brings the Formal Sheen together."},
  {name:"The filling",title:"CHICKEN.\nFRONT & CENTRE.",copy:"Grilled chicken and pickles, tucked into the Formal Sheen."},
  {name:"The finish",title:"A LITTLE\nSAUCE ENERGY.",copy:"Garlic sauce and hummus finish this combination."},
 ];
 return <section className="signature-section section-pad"><div className="container signature-grid">
  <div className="signature-media"><motion.div animate={{rotate:reduce?0:[-2,0,2][active],scale:reduce?1:[1,1.03,1.05][active]}} transition={{duration:.5}}><FoodImage src={item.image} fallback={item.fallbackImage} alt={item.name} sizes="(max-width: 767px) 100vw, 50vw"/></motion.div><span className="signature-index" aria-hidden="true">0{active+1} / 03</span></div>
  <div className="signature-copy"><p className="eyebrow">Inside the Formal Sheen</p><h2>{details[active].title}</h2><p className="signature-description" aria-live="polite">{details[active].copy}</p>
   <div className="ingredient-tabs" role="group" aria-label="Explore the ingredients">{details.map((detail,index)=><button key={detail.name} aria-pressed={active===index} onClick={()=>setActive(index)}><span>0{index+1}</span>{detail.name}</button>)}</div>
   <button className="button button-orange" onClick={()=>setOpen(true)}>Make this your order <Icon name="arrow"/></button>
  </div>
 </div><ItemModal item={item} open={open} onClose={added=>{setOpen(false);if(added)setTimeout(cart.open,260);}}/></section>;
}
