/**
 * Money is stored and passed around as PAISA (integer minor units) and only
 * ever converted to a display string at the edge. Floating point rupees are
 * how rounding errors get into an order total.
 */
export const rupees = (paisa) =>
  `Rs ${(paisa / 100).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

export const DELIVERY_FEE_PAISA = 9900;   // Rs 99
export const MIN_ORDER_PAISA = 50000;     // Rs 500
