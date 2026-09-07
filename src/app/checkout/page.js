import CheckoutForm from "./CheckoutForm";
import { PAYMENT_METHODS } from "@/lib/payments";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  // Read on the server so the enabled/disabled state of card payment comes
  // from the actual environment, not from a guess in the browser.
  const methods = PAYMENT_METHODS.map(({ id, label, hint, enabled }) => ({
    id,
    label,
    hint,
    enabled,
  }));

  return (
    <div className="mx-auto max-w-[720px] px-6 py-16">
      <h1 className="mb-8 text-[clamp(2rem,4.5vw,3rem)] font-extrabold tracking-tight">
        Checkout
      </h1>
      <CheckoutForm methods={methods} />
    </div>
  );
}
