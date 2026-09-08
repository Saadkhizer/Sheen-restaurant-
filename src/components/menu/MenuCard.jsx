"use client";

import { useState } from "react";
import Image from "next/image";
import { rupees } from "@/lib/money";
import { FALLBACK_MENU_IMAGES } from "@/lib/menuImages";
import { SIZE_VARIANTS, ADDON_SLUGS } from "@/lib/menuOptions";
import AddToCart from "./AddToCart";
import ItemModal from "./ItemModal";

/* Lift on hover, never scale -- scaling food photos looks cheap. The image
   bleeds to the card edge; an inset image with a visible margin is a 2016
   card. Menu-card images stay in their original frame (only the hero dish
   is a cut-out) because cutting out every image flattens the page. */
export default function MenuCard({ item, featured = false, allItems = [] }) {
  const [customizing, setCustomizing] = useState(false);
  const image = item.image_url || FALLBACK_MENU_IMAGES[item.slug];

  // Only mains with a real Small-A counterpart get the "select option"
  // flow -- a canned soda has no size or extras to choose, so it keeps
  // the plain quick-add instead of an empty, pointless modal.
  const variantSlug = SIZE_VARIANTS[item.slug];
  const variantItem = variantSlug ? allItems.find((i) => i.slug === variantSlug) : null;
  const hasOptions = Boolean(variantItem);
  const addonItems = hasOptions
    ? allItems.filter((i) => ADDON_SLUGS.includes(i.slug))
    : [];

  return (
    <article
      className={`overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-[transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-accent/40 ${
        featured
          ? "shadow-[0_0_0_1px_color-mix(in_oklch,var(--accent)_30%,transparent),0_8px_32px_-12px_color-mix(in_oklch,var(--accent)_25%,transparent)]"
          : ""
      }`}
    >
      {(() => {
        const media = image ? (
          <div className="relative h-40 w-full">
            <Image
              src={image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-40 flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_60%,color-mix(in_srgb,var(--accent)_16%,var(--surface))_0%,var(--surface)_72%)]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent/50"
            >
              <path d="M8 3v6a2 2 0 0 1-4 0V3" />
              <path d="M6 9v12" />
              <path d="M17 3c-1.5 0-3 2-3 5s1.5 4 3 4" />
              <path d="M17 3v16" />
            </svg>
            <span className="text-[0.6rem] uppercase tracking-[0.16em] text-muted/70">
              {item.name}
            </span>
          </div>
        );

        return hasOptions ? (
          <button
            type="button"
            onClick={() => setCustomizing(true)}
            className="block w-full cursor-pointer text-left"
            aria-label={`Customise ${item.name}`}
          >
            {media}
          </button>
        ) : (
          media
        );
      })()}

      {customizing && (
        <ItemModal
          item={item}
          variantItem={variantItem}
          addonItems={addonItems}
          image={image}
          onClose={() => setCustomizing(false)}
        />
      )}

      <div className="p-5">
        <h3 className="mb-1.5 text-lg font-semibold tracking-tight">{item.name}</h3>
        {item.description && (
          <p className="mb-4 text-sm leading-relaxed text-muted">{item.description}</p>
        )}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[1.05rem] font-bold text-accent-text">
            {rupees(item.price_paisa)}
          </span>
          <AddToCart item={item} />
        </div>
      </div>
    </article>
  );
}
