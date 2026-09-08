import "server-only";
import { DEMO_CATEGORIES,normalizeCategories } from "./catalogue.js";
import { IS_DEMO } from "./restaurantData.js";
import { withTimeout } from "./withTimeout.js";
export async function getMenu(){
 if(IS_DEMO)return {categories:DEMO_CATEGORIES,degraded:false,mode:"demo"};
 try{
  const {createClient}=await import("./supabase/server.js");
  const supabase=await createClient();
  const result=await withTimeout(supabase.from("menu_categories").select("id, slug, name, sort_order, menu_items(id, slug, name, description, price_paisa, image_url, is_popular, is_available, sort_order)").order("sort_order").order("sort_order",{referencedTable:"menu_items"}),{ms:5000,fallback:null,label:"menu"});
  if(!result||result.error)throw new Error("Menu unavailable");
  return {categories:normalizeCategories(result.data||[]),degraded:false,mode:"production"};
 }catch{
  // Never silently substitute local slug IDs into production UUID ordering.
  return {categories:[],degraded:true,mode:"production"};
 }
}
export async function getPopularItems(limit=4){
 const result=await getMenu();
 const all=result.categories.flatMap(category=>category.menu_items);
 return {...result,all,items:all.filter(item=>item.is_popular).slice(0,limit)};
}
