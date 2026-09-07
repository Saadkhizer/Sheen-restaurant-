import "server-only";

/**
 * Payment provider adapter.
 *
 * Cash on delivery is fully implemented -- it needs no third party, which is
 * why it is the default and why the site takes real orders today.
 *
 * Card is deliberately an adapter with one unimplemented method rather than
 * a half-finished integration. Stripe does not serve Pakistani merchants, so
 * the realistic options are Safepay, PayFast (PK) or a bank gateway, and
 * every one of them needs a merchant account, live credentials and a signed
 * webhook secret that only the client can obtain. Wiring the redirect and
 * the callback is roughly a day's work ONCE those exist.
 *
 * Until then startCardPayment throws, checkout shows a clear message, and no
 * order is left in a state where money might have moved without a record.
 */

export const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay the rider when your order arrives.",
    enabled: true,
  },
  {
    id: "card",
    label: "Card payment",
    hint: "Debit or credit card via our payment partner.",
    enabled: Boolean(process.env.PAYMENT_PROVIDER),
  },
];

export function isMethodEnabled(id) {
  return PAYMENT_METHODS.some((m) => m.id === id && m.enabled);
}

/** Returns { redirectUrl, reference } for the gateway hand-off. */
export async function startCardPayment(input) {
  switch (process.env.PAYMENT_PROVIDER) {
    // case "safepay": return startSafepay(input);   // implement ./safepay.js
    // case "payfast": return startPayFast(input);   // implement ./payfast.js
    default:
      throw new Error(
        "No payment provider configured. Set PAYMENT_PROVIDER and its credentials, then implement the matching adapter in src/lib/payments/."
      );
  }
}
