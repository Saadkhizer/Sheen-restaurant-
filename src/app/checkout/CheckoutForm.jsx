"use client";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useCart} from "@/lib/cart";
import {IS_DEMO,restaurant} from "@/lib/restaurantData";
import {orderTotals,MIN_ORDER_PAISA,rupees} from "@/lib/money";
import {prepareDemoOrder,validateCustomer,whatsappMessage} from "@/lib/orders/demo";
import Icon from "@/components/site/Icon";
import CartLines from "@/components/site/CartLines";
import WhatsAppPreview from "@/components/site/WhatsAppPreview";
export default function CheckoutForm(){
 const cart=useCart();const router=useRouter();const form=useRef(null);const submitting=useRef(false);const submissionId=useRef(null);
 const [fulfilment,setFulfilment]=useState("delivery");const [errors,setErrors]=useState({});const [error,setError]=useState("");
 const [pending,setPending]=useState(false);const [preview,setPreview]=useState(false);const [message,setMessage]=useState("");
 const totals=orderTotals(cart.items,fulfilment);const belowMinimum=totals.subtotal<MIN_ORDER_PAISA;
 function details(){
  const data=Object.fromEntries(new FormData(form.current));data.fulfilment=fulfilment;
  return validateCustomer(data);
 }
 function displayErrors(fieldErrors){
  setErrors(fieldErrors);setError("");
  const first=Object.keys(fieldErrors)[0];
  if(first)form.current.elements.namedItem(first)?.focus();
 }
 function openPreview(){
  const result=details();
  if(Object.keys(result.errors).length){displayErrors(result.errors);return;}
  setErrors({});setMessage(whatsappMessage(cart.items,result.customer,totals));setPreview(true);
 }
 function submit(event){
  event.preventDefault();
  if(submitting.current)return;
  const result=details();
  if(Object.keys(result.errors).length){displayErrors(result.errors);return;}
  if(!IS_DEMO){setError("Direct ordering is not connected. Please use Sheen’s Foodpanda listing.");return;}
  submitting.current=true;setPending(true);setErrors({});setError("");
  try{
   submissionId.current ||= crypto.randomUUID();
   const prepared=prepareDemoOrder(cart.items,result.customer,submissionId.current);
   if(prepared.error||prepared.errors){
    setError(prepared.error||"Please check your details.");setErrors(prepared.errors||{});submitting.current=false;setPending(false);return;
   }
   cart.complete(prepared.order.items.map(line=>line.key));
   router.push("/order/"+prepared.order.code);
  }catch{
   setError("We couldn’t prepare the demo. Your bag is still here; please try again.");
   submitting.current=false;setPending(false);
  }
 }
 if(!cart.ready||pending)return <div className="empty-state" role="status"><Icon name="bag" size={34}/><h2>{pending?"Preparing your demo…":"Opening your bag…"}</h2><p>{pending?"No order or payment is being sent.":"Your saved picks will be here in a moment."}</p></div>;
 if(!cart.items.length)return <div className="empty-state"><div className="empty-icon"><Icon name="bag" size={36}/></div><h2>Your bag is still hungry.</h2><p>Choose a shawarma, explore the deals, or add a little something on the side.</p><Link href="/menu" className="button button-teal">Explore the menu <Icon name="arrow"/></Link></div>;
 return <>
 <form ref={form} onSubmit={submit} noValidate className="checkout-layout">
  <div className="checkout-fields">
   <section className="checkout-panel"><h2><span>01</span>How would you like it?</h2><fieldset className="fulfilment-options"><legend className="sr-only">Fulfilment</legend>{[["delivery","Delivery"],["takeaway","Takeaway"]].map(([value,label])=><label key={value}><input type="radio" name="fulfilment" value={value} checked={fulfilment===value} onChange={()=>setFulfilment(value)}/><Icon name={value==="delivery"?"pin":"bag"} size={19}/>{label}</label>)}</fieldset><p className="field-hint">{fulfilment==="takeaway"?"Collect from "+restaurant.shortAddress+".":"Delivery details are demonstrated using listing information."}</p></section>
   <section className="checkout-panel"><h2><span>02</span>A few details</h2><div className="field-grid">
    <label className="field"><span id="name-label">Your name</span><input name="name" aria-labelledby="name-label" autoComplete="name" maxLength={80} required placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name?"name-error":undefined}/>{errors.name&&<small id="name-error" className="field-error">{errors.name}</small>}</label>
    <label className="field"><span id="phone-label">Mobile number</span><input name="phone" aria-labelledby="phone-label" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} required placeholder="0300 1234567" aria-invalid={!!errors.phone} aria-describedby={errors.phone?"phone-error":undefined}/>{errors.phone&&<small id="phone-error" className="field-error">{errors.phone}</small>}</label>
   </div>
   {fulfilment==="delivery"&&<label className="field"><span id="address-label">Delivery address</span><textarea name="address" aria-labelledby="address-label" autoComplete="street-address" required maxLength={400} placeholder="House, street, sector and a nearby landmark" aria-invalid={!!errors.address} aria-describedby={errors.address?"address-error":undefined}/>{errors.address&&<small id="address-error" className="field-error">{errors.address}</small>}</label>}
   <label className="field"><span id="notes-label">Anything else? <span className="muted">(optional)</span></span><textarea name="notes" aria-labelledby="notes-label" maxLength={500} placeholder={fulfilment==="delivery"?"Landmark or delivery instructions":"Collection notes"} aria-invalid={!!errors.notes} aria-describedby={errors.notes?"notes-error":undefined}/>{errors.notes&&<small id="notes-error" className="field-error">{errors.notes}</small>}</label>
   {IS_DEMO&&<p className="field-hint">For this demonstration, use sample details. They stay in this browser session.</p>}
   </section>
   <section className="checkout-panel"><h2><span>03</span>{IS_DEMO?"A preview, not a payment":"Ordering options"}</h2><p className="small muted">{IS_DEMO?"Prepare a demo receipt and explore the WhatsApp handoff. No card details, payment, or real restaurant order.":"Online payment and direct ordering are not connected. You can review your order or continue to Foodpanda."}</p></section>
  </div>
  <aside className="checkout-panel checkout-aside"><h2>Your Sheen selection</h2><CartLines/><dl className="totals"><div><dt>Subtotal</dt><dd>{rupees(totals.subtotal)}</dd></div><div><dt>{fulfilment==="delivery"?"Delivery":"Takeaway"}</dt><dd>{totals.delivery?rupees(totals.delivery):"No delivery charge"}</dd></div><div><dt>Total</dt><dd>{rupees(totals.total)}</dd></div></dl>
   {belowMinimum&&<p className="notice">Add {rupees(MIN_ORDER_PAISA-totals.subtotal)} to reach the {rupees(MIN_ORDER_PAISA)} minimum.</p>}
   {Object.keys(errors).length>0&&<p role="alert" className="form-error">Please check the highlighted details.</p>}
   {error&&<p role="alert" className="form-error">{error}</p>}
   {IS_DEMO?<button type="submit" className="button button-orange button-wide checkout-submit" disabled={belowMinimum}>Prepare demo order <Icon name="arrow"/></button>:<a className="button button-orange button-wide" href={restaurant.links.foodpanda} target="_blank" rel="noreferrer">Order on Foodpanda <Icon name="arrow"/></a>}
   <button type="button" className="button button-outline button-wide mt-3" onClick={openPreview}><Icon name="chat"/>Preview WhatsApp order</button>
   <p className="demo-note">{IS_DEMO?"Demo only · Nothing is sent to the restaurant.":"Final availability and price require restaurant confirmation."}</p>
  </aside>
 </form><WhatsAppPreview open={preview} onClose={()=>setPreview(false)} message={message}/>
 </>;
}
