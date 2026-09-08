"use server";
import { IS_DEMO } from "@/lib/restaurantData";
export async function placeOrder() {
 return {error:IS_DEMO
  ? "This is a demonstration. Prepare your demo order in the checkout."
  : "Direct ordering is not connected yet. Please use the restaurant's Foodpanda listing."};
}
// Real writes must be implemented through one transactional, idempotent RPC.
// The former multi-insert/card redirect path is intentionally not executable.
