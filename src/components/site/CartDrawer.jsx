"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { rupees, MIN_ORDER_PAISA } from "@/lib/money";

/* Slide-in panel, not a page. Adding an item opens it -- the panel sliding
   in IS the "added to cart" confirmation, so there's no separate toast
   fighting it for attention. Escape and the backdrop both close it; the
   body is locked so the page behind can't scroll while it's open. */
export default function CartDrawer() {
  const { items, count, subtotal, isOpen, close, add, dec, remove } = useCart();
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER_PAISA;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col bg-background shadow-[-24px_0_64px_-24px_rgba(0,0,0,0.6)] md:border-l md:border-border"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 340 }}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="text-lg font-bold tracking-tight">
                Your order
                {count > 0 && <span className="ml-2 font-normal text-muted">({count})</span>}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close cart"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6 18 18M18 6 6 18" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <p className="text-muted">Your cart is empty.</p>
                <Link
                  href="/menu"
                  onClick={close}
                  className="inline-flex h-11 items-center rounded-full bg-accent px-7 font-semibold text-accent-foreground transition-colors hover:bg-accent-deep hover:text-foreground"
                >
                  Browse the menu
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map((line) => (
                    <li key={line.id} className="flex gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-surface">
                        {line.image && (
                          <Image src={line.image} alt="" fill sizes="64px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{line.name}</p>
                        <p className="text-sm text-muted">{rupees(line.price_paisa)} each</p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => dec(line.id)}
                            aria-label={`Remove one ${line.name}`}
                            className="h-7 w-7 cursor-pointer rounded-full border border-border text-muted transition-colors hover:text-accent"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm tabular-nums">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => add(line)}
                            aria-label={`Add one more ${line.name}`}
                            className="h-7 w-7 cursor-pointer rounded-full border border-border text-muted transition-colors hover:text-accent"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(line.id)}
                            className="ml-auto cursor-pointer text-xs text-muted underline-offset-4 hover:text-critical hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4 border-t border-border px-6 py-5">
                  {belowMinimum && (
                    <p className="text-xs text-caution">
                      Add {rupees(MIN_ORDER_PAISA - subtotal)} more to reach the Rs 500 minimum.
                    </p>
                  )}
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold">Subtotal</span>
                    <span className="text-lg font-bold tabular-nums text-accent-text">
                      {rupees(subtotal)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-center font-bold text-accent-foreground transition-colors hover:bg-accent-deep hover:text-foreground"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
