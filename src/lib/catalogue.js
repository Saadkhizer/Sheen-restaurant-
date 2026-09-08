import { LOCAL_MENU } from "./menuData.js";
import { FALLBACK_MENU_IMAGES } from "./menuImages.js";
export function normalizeCategories(categories){
 return categories.map(category=>({...category,menu_items:(category.menu_items||[]).map(item=>({
 ...item,category_slug:category.slug,is_available:item.is_available!==false,
 image:item.image_url?.startsWith("/images/")?item.image_url.replace(".png",".webp"):item.image_url||"/images/menu/"+item.slug+".webp",
 fallbackImage:FALLBACK_MENU_IMAGES[item.slug]||null,
 }))}));
}
export const DEMO_CATEGORIES=normalizeCategories(LOCAL_MENU);
export const DEMO_ITEMS=DEMO_CATEGORIES.flatMap(category=>category.menu_items);
export const SIDE_GROUPS=[
 {slug:"sides",name:"On the side",slugs:["puff-potatoes","loaded-fries","hummus-pita","saucy-fries","plain-fries"]},
 {slug:"drinks",name:"Something to sip",slugs:["limo-soda","coke","sprite"]},
 {slug:"cookies",name:"The sweet side",slugs:["double-choc-cookie","choc-chip-cookie"]},
 {slug:"extras",name:"Sauces & extras",slugs:["garlic-sauce","chili-mayo","cheese","jalapeno"]},
];
export function displayCategories(categories){
 return categories.flatMap(category=>category.slug!=="sides"?[category]:[
 ...SIDE_GROUPS.map(group=>({id:group.slug,slug:group.slug,name:group.name,menu_items:category.menu_items.filter(item=>group.slugs.includes(item.slug))})),
 {...category,id:"other-sides",slug:"other-sides",name:"More sides",menu_items:category.menu_items.filter(item=>!SIDE_GROUPS.some(group=>group.slugs.includes(item.slug)))}
 ]).filter(category=>category.menu_items.length);
}
