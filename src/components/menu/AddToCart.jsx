"use client";
import {useCart} from "@/lib/cart";
import {buildCartLine} from "@/lib/cartModel";
import Icon from "@/components/site/Icon";
export default function AddToCart({item,onCustomize,customizable=false}){
 const {addLine}=useCart();
 return <button type="button" className="add-button" disabled={!item.is_available} onClick={()=>customizable?onCustomize():addLine(buildCartLine(item))} aria-label={(customizable?"Customize ":"Add ")+item.name}>
  {item.is_available?<><span>{customizable?"Choose":"Add"}</span><Icon name="plus" size={17}/></>:"Unavailable"}
 </button>;
}
