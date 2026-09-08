"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {readDemoOrder,whatsappMessage} from "@/lib/orders/demo";
import {lineDetails} from "@/lib/cartModel";
import {rupees} from "@/lib/money";
import Icon from "@/components/site/Icon";
import WhatsAppPreview from "@/components/site/WhatsAppPreview";
export default function DemoReceipt({code}){
 const [order,setOrder]=useState(undefined);const [preview,setPreview]=useState(false);const [step,setStep]=useState(0);
 useEffect(()=>{
  // A demo receipt exists only in this browser session, never in the server database.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setOrder(readDemoOrder(code));
 },[code]);
 if(order===undefined)return <div className="container receipt-page empty-state" role="status"><h1>Opening your demo…</h1></div>;
 if(!order)return <div className="container receipt-page empty-state"><Icon name="bag" size={36}/><h1>This demo isn’t in this tab.</h1><p>Demo receipts stay in the tab where they were prepared, for up to 24 hours. Start a new order to explore the experience.</p><Link href="/menu" className="button button-teal">Back to the menu <Icon name="arrow"/></Link></div>;
 const steps=["Order received","Preparing",order.customer.fulfilment==="delivery"?"Out for delivery":"Ready to collect"];
 return <div className="container receipt-page">
  <div className="receipt-header"><span className="receipt-check"><Icon name="check" size={34}/></span><p className="eyebrow">Your Sheen, all wrapped up</p><h1>DEMO ORDER<br/><span className="orange-text">PREPARED.</span></h1><p>Thanks, {order.customer.name.split(" ")[0]}. This is a demonstration.<br/>Nothing has been sent to Sheen and no payment has been taken.</p><div className="receipt-reference">{order.code}</div></div>
  <section className="receipt-card"><h2>Your selection</h2><ul className="receipt-items">{order.items.map(line=><li key={line.key}><div>{line.qty} × {line.name}<ul className="line-details">{lineDetails(line).map(detail=><li key={detail}>{detail}</li>)}</ul></div><strong>{rupees(line.unitPrice*line.qty)}</strong></li>)}</ul><dl className="totals"><div><dt>Subtotal</dt><dd>{rupees(order.subtotal)}</dd></div><div><dt>Delivery</dt><dd>{order.delivery?rupees(order.delivery):"No delivery charge"}</dd></div><div><dt>Total</dt><dd>{rupees(order.total)}</dd></div></dl><div className="receipt-fulfilment"><strong>{order.customer.fulfilment==="delivery"?"Delivery":"Takeaway"}</strong><p>{order.customer.address||"Collection from the restaurant"}</p>{order.customer.notes&&<p className="muted">Notes: {order.customer.notes}</p>}</div></section>
  <section className="simulation"><h2>A look at what comes next</h2><p>Simulated status preview. These are not live restaurant updates.</p><ol className="simulation-steps">{steps.map((label,index)=><li key={label} className={index<=step?"active":""} aria-current={index===step?"step":undefined}>{label}</li>)}</ol><p role="status" className="sr-only">Simulated status: {steps[step]}</p><button className="text-button" onClick={()=>setStep(value=>(value+1)%steps.length)}>{step===2?"Restart preview":"Preview next status"} →</button></section>
  <div className="receipt-actions"><button className="button button-teal" onClick={()=>setPreview(true)}><Icon name="chat"/>Preview WhatsApp order</button><Link href="/menu" className="button button-outline">Explore more <Icon name="arrow"/></Link></div>
  <WhatsAppPreview open={preview} onClose={()=>setPreview(false)} message={whatsappMessage(order.items,order.customer,order)}/>
 </div>;
}
