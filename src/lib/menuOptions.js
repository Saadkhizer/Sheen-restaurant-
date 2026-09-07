/**
 * Regular main -> its "Small-A" counterpart, keyed by slug. Both already
 * exist as independent, real, priced menu_items -- this just lets the item
 * modal offer them as a single size choice instead of two unrelated cards.
 */
export const SIZE_VARIANTS = {
  "formal-sheen": "small-a-formal",
  "kf-sheen": "small-a-kf",
  "af-sheen": "small-a-af",
  "beef-sheen": "small-a-beef",
};

/**
 * Real Sides items offered as quick-add extras on a main's modal. Adding
 * one just adds that same menu_item as its own cart line -- no fabricated
 * pricing, no schema change.
 */
export const ADDON_SLUGS = ["cheese", "jalapeno", "garlic-sauce", "chili-mayo"];
