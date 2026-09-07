"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { placeOrder } from "@/app/actions";
import { rupees, DELIVERY_FEE_PAISA, MIN_ORDER_PAISA } from "@/lib/money";

const field =
  "w-full rounded-[var(--radius-panel)] border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none";

export default function CheckoutForm({ methods }) {
  const { items, subtotal, add, dec, remove, count } = useCart();
  const [fulfilment, setFulfilment] = useState("delivery");
  const [method, setMethod] = useState("cod");
  const [state, formAction, pending] = useActionState(placeOrder, {});

  const delivery = fulfilment === "delivery" ? DELIVERY_FEE_PAISA : 0;
  const total = subtotal + delivery;
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER_PAISA;

  if (count === 0) {
    return (
      <div className="rounded-[var(--radius-panel)] border border-border bg-surface p-8 text-center">
        <p className="mb-5 text-muted">Your cart is empty.</p>
        <Link
          href="/menu"
          className="inline-flex h-12 items-center rounded-full bg-accent px-7 font-semibold text-accent-foreground transition-colors hover:bg-accent-deep hover:text-foreground"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* The cart is sent as ids + quantities only. The server re-reads every
          price from the database and recomputes the total, so the figures
          below are a preview -- not the source of truth. */}
      <input
        type="hidden"
        name="cart"
        value={JSON.stringify(items.map((l) => ({ id: l.id, qty: l.qty })))}
      />

      <section className="rounded-[var(--radius-panel)] border border-border bg-surface p-6">
        <h2 className="mb-5 text-lg font-semibold">Your order</h2>
        <ul className="space-y-4">
          {items.map((line) => (
            <li key={line.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{line.name}</p>
                <p className="text-sm text-muted">{rupees(line.price_paisa)} each</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {/* Stepper: circular surface buttons either side of the count */}
                <button
                  type="button"
                  onClick={() => dec(line.id)}
                  aria-label={`Remove one ${line.name}`}
                  className="h-9 w-9 cursor-pointer rounded-full border border-border text-muted transition-colors hover:text-accent"
                >
                  −
                </button>
                <span className="w-5 text-center tabular-nums">{line.qty}</span>
                <button
                  type="button"
                  onClick={() => add(line)}
                  aria-label={`Add one ${line.name}`}
                  className="h-9 w-9 cursor-pointer rounded-full border border-border text-muted transition-colors hover:text-accent"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => remove(line.id)}
                  className="cursor-pointer text-sm text-muted underline-offset-4 hover:text-critical hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">How should we get it to you?</h2>
        <div className="flex gap-3">
          {[
            ["delivery", "Delivery"],
            ["takeaway", "Takeaway"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFulfilment(id)}
              className={`h-12 cursor-pointer rounded-full px-6 font-semibold transition-colors ${
                fulfilment === id
                  ? "bg-accent text-background"
                  : "border border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input type="hidden" name="fulfilment" value={fulfilment} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-muted">Your name</span>
            <input name="name" required className={field} placeholder="Saad" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">Mobile number</span>
            <input
              name="phone"
              required
              inputMode="tel"
              className={field}
              placeholder="0300 1234567"
            />
          </label>
        </div>

        {fulfilment === "delivery" && (
          <>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Delivery address</span>
              <input
                name="address"
                required
                className={field}
                placeholder="House 12, Street 4, Sector G, Bahria Enclave"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">
                Notes for the rider (optional)
              </span>
              <input name="notes" className={field} placeholder="Gate code, landmark…" />
            </label>
          </>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Payment</h2>
        {methods.map((m) => (
          <label
            key={m.id}
            className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-panel)] border p-4 transition-colors ${
              method === m.id ? "border-accent bg-surface" : "border-border bg-surface"
            } ${m.enabled ? "" : "cursor-not-allowed opacity-55"}`}
          >
            <input
              type="radio"
              name="payment_method"
              value={m.id}
              checked={method === m.id}
              disabled={!m.enabled}
              onChange={() => setMethod(m.id)}
              className="mt-1 accent-[var(--accent)]"
            />
            <span>
              <span className="block font-medium">{m.label}</span>
              <span className="block text-sm text-muted">
                {m.enabled ? m.hint : "Not available yet — coming soon."}
              </span>
            </span>
          </label>
        ))}
      </section>

      <section className="rounded-[var(--radius-panel)] border border-border bg-surface p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{rupees(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="tabular-nums">{delivery ? rupees(delivery) : "—"}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums text-accent-text">{rupees(total)}</dd>
          </div>
        </dl>
      </section>

      {belowMinimum && (
        <p className="rounded-[var(--radius-panel)] border border-caution/40 bg-surface p-4 text-sm text-caution">
          Minimum order is {rupees(MIN_ORDER_PAISA)}. Add {rupees(MIN_ORDER_PAISA - subtotal)}{" "}
          more to check out.
        </p>
      )}

      {state?.error && (
        <p
          role="alert"
          className="rounded-[var(--radius-panel)] border border-critical/40 bg-surface p-4 text-sm text-critical"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || belowMinimum}
        className="h-13 w-full cursor-pointer rounded-full bg-accent py-4 font-bold text-accent-foreground transition-colors hover:bg-accent-deep hover:text-foreground disabled:cursor-not-allowed disabled:opacity-55"
      >
        {pending ? "Placing your order…" : `Place order · ${rupees(total)}`}
      </button>
    </form>
  );
}
