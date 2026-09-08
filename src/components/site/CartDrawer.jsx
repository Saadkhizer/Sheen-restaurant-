"use client";
import Link from "next/link";
import {useCart} from "@/lib/cart";
import {buildCartLine} from "@/lib/cartModel";
import {rupees,MIN_ORDER_PAISA,DELIVERY_FEE_PAISA} from "@/lib/money";
import Dialog from "./Dialog";
import Icon from "./Icon";
import CartLines from "./CartLines";
export default function CartDrawer(){
 const {items,count,subtotal,isOpen,close,catalogue,addLine,mode}=useCart();
 const suggestion=items.some(line=>line.category==="mains")&&!items.some(line=>line.category==="sides")?catalogue.find(item=>item.slug==="plain-fries"&&item.is_available):null;
 return <Dialog open={isOpen} onClose={close} title={"Your bag"+(count?" ("+count+")":"")} id="cart-title" variant="drawer">
  {!items.length?<div className="empty-state"><div className="empty-icon"><Icon name="bag" size={36}/></div><h3>Good things go in here.</h3><p>Your next Sheen is waiting on the menu.</p><Link href="/menu" onClick={close} className="button button-teal">Explore the menu <Icon name="arrow"/></Link></div>:<>
   <div className="cart-scroll"><CartLines/>{suggestion&&<div className="side-suggestion"><div><span className="eyebrow">Something on the side?</span><p>{suggestion.name} · {rupees(suggestion.price_paisa)}</p></div><button className="icon-button" onClick={()=>addLine(buildCartLine(suggestion),false)} aria-label={"Add "+suggestion.name}><Icon name="plus"/></button></div>}</div>
   <div className="cart-summary"><div className="summary-row"><span>Subtotal</span><strong>{rupees(subtotal)}</strong></div><p className="muted small">Delivery {rupees(DELIVERY_FEE_PAISA)} · No delivery charge for takeaway.</p>
    {subtotal<MIN_ORDER_PAISA&&<p className="notice">Add {rupees(MIN_ORDER_PAISA-subtotal)} to reach the {rupees(MIN_ORDER_PAISA)} minimum.</p>}
    <Link href="/checkout" onClick={close} className="button button-orange button-wide">Continue to checkout <Icon name="arrow"/></Link>
    {mode==="demo"&&<p className="demo-note">Demo experience · No payment or order is sent.</p>}
   </div>
  </>}
 </Dialog>;
}
