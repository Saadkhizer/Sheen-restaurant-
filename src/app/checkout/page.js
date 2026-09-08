import CheckoutForm from "./CheckoutForm";
import {IS_DEMO} from "@/lib/restaurantData";
export const metadata={title:"Your Order",description:"Review your Sheen order, choose delivery or takeaway, and preview the order message.",robots:{index:false,follow:false}};
export default function CheckoutPage(){
 return <div className="container checkout-page"><div className="page-intro"><p className="eyebrow">One step closer to your Sheen</p><h1>LET’S WRAP<br/><span className="orange-text">THIS UP.</span></h1><p>{IS_DEMO?"Try the complete order experience. No payment is collected and no order is sent.":"Review your bag. Direct ordering is not connected yet."}</p></div><CheckoutForm/></div>;
}
