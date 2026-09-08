"use client";
import Icon from "@/components/site/Icon";
export default function QuantityControl({value,onChange,label,min=1}){
 return <div className="quantity-control" aria-label={"Quantity for "+label}>
  <button type="button" disabled={value<=min} onClick={()=>onChange(value-1)} aria-label={"Decrease quantity of "+label}><Icon name="minus" size={16}/></button>
  <output aria-live="polite">{value}</output>
  <button type="button" disabled={value>=50} onClick={()=>onChange(value+1)} aria-label={"Increase quantity of "+label}><Icon name="plus" size={16}/></button>
 </div>;
}
