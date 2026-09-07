"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** The order exists in the database now; leaving it in the cart would let a
    refresh place a duplicate. */
export default function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
