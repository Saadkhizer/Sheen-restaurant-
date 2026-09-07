"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import Logo from "./Logo";

/* Transparent over the hero, frosted past 80px. The BACKGROUND transitions,
   never the height -- nav bars that shrink on scroll cause layout jank. */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { count, open } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        scrolled
          ? "border-border bg-surface/85 backdrop-blur-lg"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Sheen home">
          <Logo className="text-2xl" />
        </Link>

        <nav className="hidden gap-8 md:flex">
          {[
            ["Menu", "/menu"],
            ["Deals", "/menu#deals"],
            ["Reviews", "/#reviews"],
            ["Find us", "/#find"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-xs uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={open}
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-deep hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8h12l-1.2 12.5a1 1 0 0 1-1 .5H8.2a1 1 0 0 1-1-.5L6 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          Cart
          <AnimatePresence mode="popLayout">
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 400 }}
                className="rounded-full bg-accent-foreground/15 px-2 py-0.5 text-xs tabular-nums"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
