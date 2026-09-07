"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "sheen.cart.v1";

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const qty = action.qty ?? 1;
      const found = state.find((l) => l.id === action.item.id);
      if (found) {
        return state.map((l) =>
          l.id === action.item.id ? { ...l, qty: Math.min(l.qty + qty, 50) } : l
        );
      }
      return [...state, { ...action.item, qty: Math.min(qty, 50) }];
    }
    case "dec":
      return state
        .map((l) => (l.id === action.id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0);
    case "remove":
      return state.filter((l) => l.id !== action.id);
    case "clear":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const skipNextPersist = useRef(true);

  // Hydrate after mount, never during render -- reading localStorage on the
  // server throws, and reading it during render causes a hydration mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {
      /* corrupt or unavailable storage: start with an empty cart */
    }
  }, []);

  useEffect(() => {
    // The mount's first run of this effect always sees the reducer's
    // initial [], one render before the hydrate effect's dispatch above
    // lands. Writing that [] here would beat the hydrate to localStorage
    // and permanently erase whatever a returning customer had in their
    // cart. Skip it once; every write after the first is a real change.
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* private mode / quota: the cart just won't survive a reload */
    }
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((n, l) => n + l.qty, 0);
    const subtotal = items.reduce((n, l) => n + l.price_paisa * l.qty, 0);
    return {
      items,
      count,
      subtotal,
      // Adding an item opens the drawer -- the confirmation IS the UI, no
      // separate toast needed.
      add: (item, qty = 1) => {
        dispatch({ type: "add", item, qty });
        setIsOpen(true);
      },
      dec: (id) => dispatch({ type: "dec", id }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
