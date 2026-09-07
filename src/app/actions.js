"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMethodEnabled, startCardPayment } from "@/lib/payments";
import { DELIVERY_FEE_PAISA, MIN_ORDER_PAISA } from "@/lib/money";

/** Short, readable, and not sequential -- codes must not be guessable. */
function makeOrderCode() {
  const alphabet = "ACDEFGHJKLMNPQRTUVWXY3456789"; // no O/0, I/1, S/5
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SH-${s}`;
}

/**
 * Creates an order. Prices are re-read from the database and totals are
 * recomputed here -- the browser sends item ids and quantities only. A cart
 * that posts its own total is a cart a customer can edit in devtools.
 */
export async function placeOrder(prevState, formData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const fulfilment = String(formData.get("fulfilment") ?? "delivery");
  const addressLine = String(formData.get("address") ?? "").trim();
  const addressNotes = String(formData.get("notes") ?? "").trim();
  const method = String(formData.get("payment_method") ?? "cod");

  let cart;
  try {
    cart = JSON.parse(String(formData.get("cart") ?? "[]"));
  } catch {
    return { error: "Your cart could not be read. Please try again." };
  }

  if (!Array.isArray(cart) || cart.length === 0)
    return { error: "Your cart is empty." };
  if (name.length < 2) return { error: "Please enter your name." };
  if (!/^0?3\d{2}[- ]?\d{7}$/.test(phone.replace(/\s/g, "")))
    return { error: "Please enter a valid Pakistani mobile number, e.g. 0300 1234567." };
  if (fulfilment === "delivery" && addressLine.length < 8)
    return { error: "Please enter a delivery address." };
  if (!isMethodEnabled(method))
    return { error: "That payment method isn't available right now." };

  const supabase = createAdminClient();

  const ids = [...new Set(cart.map((l) => l.id))];
  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("id, name, price_paisa, is_available")
    .in("id", ids);

  if (menuError) return { error: "We couldn't reach the kitchen. Please try again." };

  const priced = [];
  for (const line of cart) {
    const item = menuItems?.find((m) => m.id === line.id);
    if (!item || !item.is_available)
      return { error: "Something in your cart just sold out. Please review your order." };
    const qty = Math.max(1, Math.min(50, Number(line.qty) || 1));
    priced.push({
      menu_item_id: item.id,
      name_at_time: item.name,
      price_paisa: item.price_paisa,
      quantity: qty,
    });
  }

  const subtotal = priced.reduce((n, l) => n + l.price_paisa * l.quantity, 0);
  if (subtotal < MIN_ORDER_PAISA)
    return { error: `Minimum order is Rs ${MIN_ORDER_PAISA / 100}.` };

  const delivery = fulfilment === "delivery" ? DELIVERY_FEE_PAISA : 0;
  const total = subtotal + delivery;
  const code = makeOrderCode();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      code,
      customer_name: name,
      customer_phone: phone,
      fulfilment,
      address_line: fulfilment === "delivery" ? addressLine : null,
      address_notes: addressNotes || null,
      payment_method: method,
      // COD needs nothing collected online; card sits in `awaiting` until
      // the gateway calls back. Never mark an order paid optimistically.
      payment_status: method === "cod" ? "not_required" : "awaiting",
      status: method === "cod" ? "confirmed" : "pending_payment",
      subtotal_paisa: subtotal,
      delivery_paisa: delivery,
      total_paisa: total,
    })
    .select("id, code")
    .single();

  if (orderError || !order)
    return { error: "We couldn't place your order. Please try again or call us." };

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(priced.map((l) => ({ ...l, order_id: order.id })));

  if (itemsError) {
    // Roll back rather than leave a total with no lines behind it.
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: "We couldn't save your order items. Please try again." };
  }

  if (method === "card") {
    try {
      const { redirectUrl, reference } = await startCardPayment({
        orderCode: order.code,
        amountPaisa: total,
        customer: { name, phone },
      });
      await supabase
        .from("orders")
        .update({ payment_reference: reference })
        .eq("id", order.id);
      redirect(redirectUrl);
    } catch (e) {
      await supabase
        .from("orders")
        .update({ payment_status: "failed", status: "cancelled" })
        .eq("id", order.id);
      return {
        error:
          "Card payment isn't switched on yet. Please choose cash on delivery, or call us to order.",
      };
    }
  }

  redirect(`/order/${order.code}`);
}
