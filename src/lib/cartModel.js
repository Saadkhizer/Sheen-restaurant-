import { ADDON_SLUGS,DEAL_CHOICES,SIZE_VARIANTS } from "./menuOptions.js";
export const MAX_QUANTITY=50;
export function validQuantity(qty){return Number.isInteger(qty)&&qty>0&&qty<=MAX_QUANTITY;}
export function buildCartLine(item,{qty=1,size=null,extras=[],choices={}}={}){
 if(!item||!validQuantity(qty)||item.is_available===false)throw new Error("Please review this item.");
 const options=DEAL_CHOICES[item.slug]||[];
 if(options.some(option=>!option.options.includes(choices[option.id])))throw new Error("Choose your shawarma first.");
 const sortedExtras=[...extras].sort((a,b)=>a.slug.localeCompare(b.slug));
 const line={productId:item.id,slug:item.slug,name:item.name,image:item.image||null,category:item.category_slug,price_paisa:item.price_paisa,qty,size,
 extras:sortedExtras.map(extra=>({id:extra.id,slug:extra.slug,name:extra.name,price_paisa:extra.price_paisa})),
 choices:Object.fromEntries(options.map(option=>[option.id,choices[option.id]]))};
 line.unitPrice=line.price_paisa+line.extras.reduce((sum,extra)=>sum+extra.price_paisa,0);
 line.key=JSON.stringify([line.productId,size,line.extras.map(extra=>extra.id),line.choices]);
 return line;
}
export function sanitizeCart(value,catalogue){
 if(!Array.isArray(value))return [];
 const result=[];
 for(const candidate of value.slice(0,100)){
  try{
   if(!candidate||!validQuantity(candidate.qty))continue;
   const item=catalogue.find(product=>product.id===candidate.productId&&product.slug===candidate.slug);
   if(!item||item.is_available===false)continue;
   const allowedExtras=item.category_slug==="mains"?ADDON_SLUGS:[];
   const extraSlugs=[...new Set(Array.isArray(candidate.extras)?candidate.extras.map(extra=>extra?.slug):[])];
   if(extraSlugs.some(slug=>!allowedExtras.includes(slug)))continue;
   const extras=extraSlugs.map(slug=>catalogue.find(product=>product.slug===slug&&product.is_available!==false));
   if(extras.some(extra=>!extra))continue;
   const size=item.slug.startsWith("small-a-")?"Small-A":SIZE_VARIANTS[item.slug]?"Regular":null;
   const line=buildCartLine(item,{qty:candidate.qty,extras,size,choices:candidate.choices||{}});
   const existing=result.find(entry=>entry.key===line.key);
   if(existing)existing.qty=Math.min(MAX_QUANTITY,existing.qty+line.qty);else result.push(line);
  }catch{/* Ignore invalid stored entries; never trust their prices. */}
 }
 return result;
}
export function lineDetails(line){
 return [...(line.size?["Size: "+line.size]:[]),...Object.values(line.choices||{}),...(line.extras||[]).map(extra=>"Extra: "+extra.name)];
}
export function cartReducer(state,action){
 switch(action.type){
  case "hydrate":return action.items;
  case "add":{const found=state.find(line=>line.key===action.line.key);return found?state.map(line=>line.key===action.line.key?{...line,qty:Math.min(MAX_QUANTITY,line.qty+action.line.qty)}:line):[...state,action.line];}
  case "quantity":return state.map(line=>line.key===action.key?{...line,qty:action.qty}:line).filter(line=>line.qty>0);
  case "remove":return state.filter(line=>line.key!==action.key);
  case "complete":return state.filter(line=>!action.keys.includes(line.key));
  case "clear":return [];
  default:return state;
 }
}
