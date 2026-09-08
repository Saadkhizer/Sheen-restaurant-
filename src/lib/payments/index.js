import "server-only";
export const PAYMENT_METHODS = [
 {id:"cod",label:"Cash",hint:"Payment is not collected in this demonstration.",enabled:true},
 {id:"card",label:"Card payment",hint:"Not connected",enabled:false},
];
export function isMethodEnabled(id){return PAYMENT_METHODS.some(method=>method.id===id&&method.enabled);}
export async function startCardPayment(){throw new Error("No supported payment provider is connected.");}
