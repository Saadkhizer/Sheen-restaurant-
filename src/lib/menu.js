import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/withTimeout";

/**
 * Menu for the public site. Wrapped in a timeout so an unreachable or
 * paused Supabase project renders an empty menu with a notice instead of
 * hanging the page forever with no error in the terminal.
 */
export async function getMenu() {
  const supabase = await createClient();

  const result = await withTimeout(
    supabase
      .from("menu_categories")
      .select(
        "id, slug, name, sort_order, menu_items(id, slug, name, description, price_paisa, image_url, is_popular, sort_order)"
      )
      .order("sort_order")
      .order("sort_order", { referencedTable: "menu_items" }),
    { ms: 5000, fallback: null, label: "menu" }
  );

  if (!result || result.error) return { categories: [], degraded: true };
  return { categories: result.data ?? [], degraded: false };
}

export async function getPopularItems(limit = 4) {
  const { categories, degraded } = await getMenu();
  const all = categories.flatMap((c) => c.menu_items ?? []);
  // `all` is returned too -- a popular main's Small-A size variant isn't
  // itself popular, so the homepage needs the full list to offer it as a
  // size option, not just the four cards it renders.
  return { items: all.filter((i) => i.is_popular).slice(0, limit), all, degraded };
}
