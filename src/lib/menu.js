import { LOCAL_MENU } from "@/lib/menuData";

let createClient, withTimeout;
try {
  createClient = (await import("@/lib/supabase/server")).createClient;
  withTimeout = (await import("@/lib/withTimeout")).withTimeout;
} catch {
  /* Supabase deps may not be configured — local fallback handles it */
}

/**
 * Menu for the public site. Tries Supabase first, falls back to local
 * data so the menu always renders with real products even without a
 * database connection.
 */
export async function getMenu() {
  /* If Supabase env vars aren't set, go straight to local data */
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !createClient
  ) {
    return { categories: LOCAL_MENU, degraded: false };
  }

  try {
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

    if (!result || result.error) return { categories: LOCAL_MENU, degraded: false };
    return { categories: result.data ?? [], degraded: false };
  } catch {
    return { categories: LOCAL_MENU, degraded: false };
  }
}

export async function getPopularItems(limit = 4) {
  const { categories, degraded } = await getMenu();
  const all = categories.flatMap((c) => c.menu_items ?? []);
  // `all` is returned too -- a popular main's Small-A size variant isn't
  // itself popular, so the homepage needs the full list to offer it as a
  // size option, not just the four cards it renders.
  return { items: all.filter((i) => i.is_popular).slice(0, limit), all, degraded };
}
