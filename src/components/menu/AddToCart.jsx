"use client";

import { useCart } from "@/lib/cart";
import { FALLBACK_MENU_IMAGES } from "@/lib/menuImages";

export default function AddToCart({ item, label = "+" }) {
  const { add } = useCart();
  const image = item.image_url || FALLBACK_MENU_IMAGES[item.slug] || null;
  return (
    <button
      type="button"
      onClick={() =>
        add({ id: item.id, name: item.name, price_paisa: item.price_paisa, image })
      }
      aria-label={`Add ${item.name} to cart`}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-accent text-lg font-bold leading-none text-accent-foreground transition-colors hover:bg-accent-deep hover:text-foreground"
    >
      {label}
    </button>
  );
}
