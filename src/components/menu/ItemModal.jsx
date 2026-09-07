"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { rupees } from "@/lib/money";

/* Centred dialog, not a page -- the "select option" pattern most
   restaurant sites use before a main goes in the cart: pick a size, add
   real extras, set a quantity, see the total update live. Every option
   here is a real, separately priced menu_item; nothing is fabricated. */
export default function ItemModal({ item, variantItem, addonItems, image, onClose }) {
  const { add } = useCart();
  const [sizeId, setSizeId] = useState(item.id);
  const [qty, setQty] = useState(1);
  const [addonIds, setAddonIds] = useState([]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const sizeOptions = variantItem ? [item, variantItem] : [item];
  const selected = sizeOptions.find((o) => o.id === sizeId) ?? item;
  const selectedAddons = addonItems.filter((a) => addonIds.includes(a.id));
  const total = selected.price_paisa * qty + selectedAddons.reduce((n, a) => n + a.price_paisa, 0);

  const toggleAddon = (id) =>
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleAdd = () => {
    add({ id: selected.id, name: selected.name, price_paisa: selected.price_paisa, image }, qty);
    for (const addon of selectedAddons) {
      add({ id: addon.id, name: addon.name, price_paisa: addon.price_paisa, image: null }, 1);
    }
    onClose();
  };

  // Portalled to <body> -- MenuCard sits inside Reveal/Stagger wrappers
  // that animate via CSS transform, and a transformed ancestor becomes the
  // containing block for `position: fixed` descendants. Rendered in place,
  // this dialog would be pinned to that card's box instead of the
  // viewport. The cart drawer doesn't need this: it's mounted directly
  // under <body> in layout.js with no transformed ancestor in between.
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        key="sheet"
        className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-6"
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] border border-border bg-background md:rounded-[var(--radius-panel)]"
          initial={{ y: "100%", opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0.6 }}
          transition={{ type: "spring", damping: 32, stiffness: 340 }}
        >
          {image && (
            <div className="relative h-52 w-full shrink-0 sm:h-64">
              <Image src={image} alt={item.name} fill sizes="512px" className="object-cover" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6 18 18M18 6 6 18" />
                </svg>
              </button>
            </div>
          )}

          <div className="p-6">
            <h2 className="text-xl font-bold tracking-tight">{item.name}</h2>
            {item.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
            )}

            {variantItem && (
              <fieldset className="mt-6">
                <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                  Size
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  {sizeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSizeId(opt.id)}
                      className={`cursor-pointer rounded-[var(--radius-panel)] border p-3 text-left transition-colors ${
                        sizeId === opt.id
                          ? "border-accent bg-surface"
                          : "border-border hover:border-accent/40"
                      }`}
                    >
                      <span className="block font-medium">
                        {opt.id === item.id ? "Regular" : "Small-A"}
                      </span>
                      <span className="text-sm text-muted">{rupees(opt.price_paisa)}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {addonItems.length > 0 && (
              <fieldset className="mt-6">
                <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                  Add extras
                </legend>
                <div className="space-y-2">
                  {addonItems.map((addon) => (
                    <label
                      key={addon.id}
                      className="flex cursor-pointer items-center justify-between rounded-[var(--radius-panel)] border border-border p-3 transition-colors hover:border-accent/40"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addonIds.includes(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                          className="h-4 w-4 accent-[var(--accent)]"
                        />
                        {addon.name}
                      </span>
                      <span className="text-sm text-muted">+{rupees(addon.price_paisa)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                Qty
              </span>
              <div className="flex items-center gap-3 rounded-full border border-border px-1.5 py-1.5">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:text-accent"
                >
                  −
                </button>
                <span className="w-5 text-center tabular-nums">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(50, q + 1))}
                  aria-label="Increase quantity"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:text-accent"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent font-bold text-accent-foreground transition-colors hover:bg-accent-deep hover:text-foreground"
            >
              Add to cart · {rupees(total)}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
