/**
 * Fallback photography for menu items that don't have image_url set in
 * Supabase yet. Keyed by item slug so it works regardless of DB state --
 * once real (or better) photography is uploaded to Supabase Storage and
 * image_url is set, that takes priority (see MenuCard).
 */
export const FALLBACK_MENU_IMAGES = {
  "formal-sheen": "/images/menu-formal-sheen.png",
  "af-sheen": "/images/menu-af-sheen.png",
  "beef-sheen": "/images/menu-beef-sheen.png",
};
