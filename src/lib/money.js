import { restaurant } from "./restaurantData.js";
export const rupees=(paisa)=>"Rs "+(paisa/100).toLocaleString("en-PK",{maximumFractionDigits:0});
export const DELIVERY_FEE_PAISA=restaurant.delivery.feePaisa;
export const MIN_ORDER_PAISA=restaurant.delivery.minimumPaisa;
export function orderTotals(items,fulfilment="delivery"){
 const subtotal=items.reduce((sum,line)=>sum+line.unitPrice*line.qty,0);
 const delivery=fulfilment==="delivery"&&items.length?DELIVERY_FEE_PAISA:0;
 return {subtotal,delivery,total:subtotal+delivery};
}
