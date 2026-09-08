import { getMenu } from "@/lib/menu";
import MenuCard from "@/components/menu/MenuCard";
import CategoryNav from "@/components/menu/CategoryNav";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export const metadata = { title: "Menu" };

export default async function MenuPage() {
  const { categories, degraded } = await getMenu();
  const allItems = categories.flatMap((c) => c.menu_items ?? []);
  const popularItems = allItems.filter((item) => item.is_popular);

  /* Add a virtual "Popular" entry at the start for the nav */
  const navCategories = popularItems.length > 0
    ? [{ id: "cat-popular", slug: "popular", name: "Popular", sort_order: 0 }, ...categories]
    : categories;

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-16">
      <p className="noir-label mb-4">Bahria Enclave, Islamabad</p>
      <h1 className="mb-4 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold tracking-tight">
        The menu
      </h1>
      <p className="mb-12 max-w-[52ch] leading-relaxed text-muted">
        Rs 99 delivery, Rs 500 minimum order. Prices include everything —
        no separate charges at checkout.
      </p>

      {degraded && (
        <p className="rounded-[var(--radius-panel)] border border-border bg-surface p-5 text-muted">
          The menu couldn&apos;t be loaded. Please refresh, or call the shop to order.
        </p>
      )}

      <CategoryNav categories={navCategories} />

      {/* Popular section */}
      {popularItems.length > 0 && (
        <section id="popular" className="mb-16 scroll-mt-24">
          <h2 className="mb-3 text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold tracking-tight">
            Popular
          </h2>
          <p className="mb-7 text-sm text-muted">Most ordered right now</p>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularItems.map((item) => (
              <StaggerItem key={item.id}>
                <MenuCard item={item} allItems={allItems} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {categories.map((cat) => (
        <section key={cat.id} id={cat.slug} className="mb-16 scroll-mt-24">
          <h2 className="mb-7 text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold tracking-tight">
            {cat.name}
          </h2>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(cat.menu_items ?? []).map((item) => (
              <StaggerItem key={item.id}>
                <MenuCard item={item} allItems={allItems} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ))}
    </div>
  );
}
