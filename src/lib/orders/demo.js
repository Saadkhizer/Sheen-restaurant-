import { sanitizeCart, lineDetails } from "../cartModel.js";
import { DEMO_ITEMS } from "../catalogue.js";
import { MIN_ORDER_PAISA, orderTotals, rupees } from "../money.js";
import { restaurant } from "../restaurantData.js";
const memory = new Map();
const prefix = "sheen.demo.order.";
export function validateCustomer(input) {
 const errors = {};
 const name = String(input.name || "").trim();
 const phone = String(input.phone || "").trim();
 const fulfilment = input.fulfilment;
 const address = String(input.address || "").trim();
 const notes = String(input.notes || "").trim();
 if(name.length < 2 || name.length > 80) errors.name = "Enter a name between 2 and 80 characters.";
 if(!/^(?:0|\+92|92)3\d{9}$/.test(phone.replace(/[\s-]/g,""))) errors.phone = "Enter a Pakistani mobile number, such as 0300 1234567.";
 if(!["delivery","takeaway"].includes(fulfilment)) errors.fulfilment = "Choose delivery or takeaway.";
 if(fulfilment === "delivery" && (address.length < 8 || address.length > 400)) errors.address = "Enter a delivery address between 8 and 400 characters.";
 if(notes.length > 500) errors.notes = "Keep notes under 500 characters.";
 return { errors, customer: {name,phone,fulfilment,address:fulfilment==="delivery"?address:"",notes} };
}
export function prepareDemoOrder(cart, input, submissionId) {
 const {errors,customer} = validateCustomer(input);
 if(Object.keys(errors).length) return {errors};
 const items = sanitizeCart(cart, DEMO_ITEMS);
 if(!items.length || items.length !== cart.length) return {error:"Your order has changed. Please review the items in your bag."};
 const totals = orderTotals(items,customer.fulfilment);
 if(totals.subtotal < MIN_ORDER_PAISA) return {error:"Add items to reach the "+rupees(MIN_ORDER_PAISA)+" minimum."};
 const existing = [...memory.values()].find(order => order.submissionId === submissionId);
 if(existing) return {order:existing};
 const order = { version:1, mode:"demo", code:"DEMO-"+crypto.randomUUID().slice(0,8).toUpperCase(), submissionId,
 createdAt:Date.now(), items, customer, ...totals };
 memory.set(order.code,order);
 try { sessionStorage.setItem(prefix+order.code,JSON.stringify(order)); } catch { /* In-memory navigation still works when storage is unavailable. */ }
 return {order};
}
export function readDemoOrder(code) {
 try {
  const candidate = memory.get(code) || JSON.parse(sessionStorage.getItem(prefix+code) || "null");
  if(!candidate || candidate.mode!=="demo" || candidate.code!==code || Date.now()-candidate.createdAt>86400000) return null;
  const {errors,customer}=validateCustomer(candidate.customer || {});
  if(Object.keys(errors).length)return null;
  const items=sanitizeCart(candidate.items,DEMO_ITEMS);
  if(!items.length || items.length!==candidate.items.length)return null;
  return {...candidate,customer,items,...orderTotals(items,customer.fulfilment)};
 } catch { return null; }
}
export function whatsappMessage(items, customer, totals) {
 return [
  "Sheen Order", "", "Fulfilment: "+(customer.fulfilment==="takeaway"?"Takeaway":"Delivery"),
  "Customer: "+(customer.name||"—"), "Phone: "+(customer.phone||"—"), "", "Items:",
  ...items.flatMap(line=>[line.qty+" × "+line.name,...lineDetails(line).map(detail=>"- "+detail),"  "+rupees(line.unitPrice*line.qty)]),
  "", "Subtotal: "+rupees(totals.subtotal), "Delivery: "+(totals.delivery?rupees(totals.delivery):"No delivery charge"),
  "Total: "+rupees(totals.total),
  ...(customer.fulfilment==="delivery"?["","Address: "+(customer.address||"—")]:[]),
  ...(customer.notes?["Notes: "+customer.notes]:[]),
  "", "Please confirm availability and the final total.",
 ].join("\n");
}
export function whatsappUrl(message) {
 const number=restaurant.whatsapp?.replace(/\D/g,"");
 return number && /^[1-9]\d{7,14}$/.test(number) ? "https://wa.me/"+number+"?text="+encodeURIComponent(message) : null;
}
