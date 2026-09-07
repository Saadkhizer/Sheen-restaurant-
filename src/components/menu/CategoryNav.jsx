"use client";

import { useEffect, useState } from "react";

/* Sticky quick-nav most menu pages have and this one didn't -- jump to a
   category, and see which one you're scrolled into without hunting. */
export default function CategoryNav({ categories }) {
  const [active, setActive] = useState(categories[0]?.slug);

  useEffect(() => {
    const sections = categories.map((c) => document.getElementById(c.slug)).filter(Boolean);
    if (sections.length === 0) return;

    const onScroll = () => {
      const y = window.scrollY + 150;
      let current = sections[0].id;
      for (const el of sections) {
        if (el.offsetTop <= y) current = el.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-16 z-30 -mx-6 mb-12 overflow-x-auto border-b border-border bg-background/90 px-6 py-3 backdrop-blur-lg"
    >
      <div className="flex w-max gap-2">
        {categories.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
              active === c.slug
                ? "bg-accent text-accent-foreground"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
