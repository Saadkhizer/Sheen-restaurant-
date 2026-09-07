import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { withTimeout } from "@/lib/withTimeout";
import { rupees } from "@/lib/money";
import ClearCartOnMount from "./ClearCartOnMount";

export const metadata = { title: "Your order" };
export const dynamic = "force-dynamic";

const STATUS_COPY = {
  pending_payment: ["Waiting for payment", "caution"],
  confirmed: ["Confirmed", "positive"],
  preparing: ["Being prepared", "positive"],
  out_for_delivery: ["On its way", "positive"],
  completed: ["Delivered", "positive"],
  cancelled: ["Cancelled", "critical"],
};

/* Looked up on the SERVER with the service role, keyed by the order code.
   There is no anon select policy on orders on purpose -- if guests could
   read the table directly, one customer could pull another's phone number
   and home address just by guessing an id. */
export default async function OrderPage({ params }) {
  const { code } = await params;
  const supabase = createAdminClient();

  const result = await withTimeout(
    supabase
      .from("orders")
      .select(
        "code, customer_name, fulfilment, address_line, status, payment_method, payment_status, subtotal_paisa, delivery_paisa, total_paisa, created_at, order_items(name_at_time, price_paisa, quantity)"
      )
      .eq("code", code)
      .single(),
    { ms: 5000, fallback: null, label: "order lookup" }
  );

  if (!result || result.error || !result.data) notFound();
  const order = result.data;
  const [statusLabel, tone] = STATUS_COPY[order.status] ?? ["Received", "positive"];

  return (
    <div className="mx-auto max-w-[640px] px-6 py-16">
      <ClearCartOnMount />

      <p className="noir-label mb-4">Order {order.code}</p>
      <h1 className="mb-3 text-[clamp(2rem,4.5vw,3rem)] font-extrabold tracking-tight">
        Thanks, {order.customer_name.split(" ")[0]}.
      </h1>
      <p className="mb-8 leading-relaxed text-muted">
        {order.payment_method === "cod"
          ? "We've got your order. Please have the exact amount ready for the rider."
          : "We've got your order and are waiting on the payment to clear."}
      </p>

      <div className="mb-6 flex items-center gap-3 rounded-[var(--radius-panel)] border border-border bg-surface p-5">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-full ${
            tone === "positive"
              ? "bg-positive"
              : tone === "caution"
                ? "bg-caution"
                : "bg-critical"
          }`}
        />
        <span className="font-medium">{statusLabel}</span>
      </div>

      <div className="rounded-[var(--radius-panel)] border border-border bg-surface p-6">
        <ul className="mb-5 space-y-3">
          {(order.order_items ?? []).map((line, i) => (
            <li key={i} className="flex justify-between gap-4 text-sm">
              <span>
                {line.quantity} × {line.name_at_time}
              </span>
              <span className="tabular-nums text-muted">
                {rupees(line.price_paisa * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{rupees(order.subtotal_paisa)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="tabular-nums">
              {order.delivery_paisa ? rupees(order.delivery_paisa) : "—"}
            </dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums text-accent-text">{rupees(order.total_paisa)}</dd>
          </div>
        </dl>
      </div>

      {order.fulfilment === "delivery" && order.address_line && (
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Delivering to {order.address_line}
        </p>
      )}

      <Link
        href="/menu"
        className="mt-10 inline-flex h-12 items-center rounded-full border border-border px-7 font-semibold transition-colors hover:border-accent"
      >
        Order something else
      </Link>
    </div>
  );
}
