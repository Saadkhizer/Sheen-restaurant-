"use client";
import {useCart} from "@/lib/cart";
import {lineDetails} from "@/lib/cartModel";
import {rupees} from "@/lib/money";
import FoodImage from "@/components/menu/FoodImage";
import QuantityControl from "@/components/menu/QuantityControl";
export default function CartLines(){
 const {items,setQuantity,remove}=useCart();
 return <ul className="cart-lines">{items.map(line=><li key={line.key}>
  <FoodImage src={line.image} alt={line.name} sizes="76px" className="cart-line-image"/>
  <div className="cart-line-body"><div className="cart-line-title"><h3>{line.name}</h3><strong>{rupees(line.unitPrice*line.qty)}</strong></div>
   {lineDetails(line).length>0&&<ul className="line-details">{lineDetails(line).map(detail=><li key={detail}>{detail}</li>)}</ul>}
   <div className="cart-line-actions"><QuantityControl value={line.qty} onChange={qty=>setQuantity(line.key,qty)} label={line.name}/><button type="button" className="text-button" onClick={()=>remove(line.key)} aria-label={"Remove "+line.name}>Remove</button></div>
  </div>
 </li>)}</ul>;
}
