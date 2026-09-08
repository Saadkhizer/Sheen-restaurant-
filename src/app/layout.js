import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { ThemeProvider } from "@/lib/theme";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CartDrawer from "@/components/site/CartDrawer";

/* Deliberately no next/font/google. That loader fetches font files from
   Google's servers during compilation, and on any network that can't reach
   fonts.googleapis.com quickly the dev server prints "Ready" and then never
   answers the first request -- with no error. If Sheen supplies a brand
   typeface, use next/font/local with the file committed to the repo. */

export const metadata = {
  title: {
    default: "Sheen - Shawarma in Bahria Enclave, Islamabad",
    template: "%s · Sheen",
  },
  description:
    "House bread, hummus and sauces made fresh daily. Order shawarma for delivery or takeaway in Bahria Enclave, Islamabad.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#100D0C",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <CartProvider>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
