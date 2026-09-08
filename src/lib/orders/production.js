import "server-only";
import { normalizeCategories } from "../catalogue.js";
import { sanitizeCart } from "../cartModel.js";
// Deliberately closed until an audited transactional RPC, staff workflow,
// rate limiting and idempotency storage exist. An env variable cannot bypass it.
export const PRODUCTION_ORDERING_READY = false;
export async function reconcileProductionCart(cart, supabase) {
 if(!Array.isArray(cart)||!cart.length||cart.length>100)throw new Error("Invalid order.");
 const slugs=[...new Set(cart.flatMap(line=>[line?.slug,...(line?.extras||[]).map(extra=>extra?.slug)]))];
 if(slugs.some(slug=>typeof slug!=="string"||slug.length>100))throw new Error("Invalid product.");
 const {data,error}=await supabase.from("menu_categories").select("id, slug, name, menu_items(id, slug, name, price_paisa, is_available)");
 if(error)throw new Error("The menu is unavailable.");
 const catalogue=normalizeCategories(data||[]).flatMap(category=>category.menu_items);
 const items=sanitizeCart(cart,catalogue);
 if(items.length!==cart.length)throw new Error("Items or options have changed. Review your order.");
 return items; // Prices and UUIDs are taken from the server catalogue.
}
