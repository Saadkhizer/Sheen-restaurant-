# Phase 2 — Sheen first-meeting demo handoff

Completed 8 September 2026. The implementation preserves Next.js App Router, the catalogue/cart architecture, Framer Motion and the future Supabase boundary. It has not been published or deployed.

## 1. What changed

The existing site now has one intentional Sheen visual identity and a complete local ordering demonstration: homepage, searchable menu, required deal choices, customization, cart, checkout, WhatsApp preview and demo receipt. Unverified testimonials/ratings and the public theme toggle have been removed.

## 2. Architecture and components

Business facts are centralized in `restaurantData.js`. A normalized catalogue supports separate demo and production menu adapters. `cartModel.js` owns line identity, validation and authoritative catalogue pricing. Demo preparation and future production reconciliation are separate modules. Shared Dialog, FoodImage, CartLines, QuantityControl and Icon components support the page components. Supabase clients, SQL and auth proxy remain; this phase adds no accounts/admin area.

## 3. Design system

Cream #fff8ef, teal #087b73, dark teal #073f3b, ferozi #17aaa0 and strong orange #f04d17. Dark orange ink supports readable cream-background text. Semantic tokens define surfaces, controls, borders, focus, radii and shadows. Barlow Condensed supplies confident display headings; DM Sans handles reading and controls. Fonts are local build assets. One branded theme is intentional.

## 4. Homepage

A large food-first hero leads to service/order shortcuts, configured Sheen picks, distinct solo/sharing/family deals, a manually controlled Formal Sheen ingredient presentation, a brand interlude, address/listing hours, an orange order CTA and a teal footer. No invented restaurant history, ratings or customer quotes fill the layout.

## 5. Menu

All 37 local listing products remain. Search works locally; category chips filter and support URL hashes. Sides are visually grouped into sides, drinks, cookies and extras using known slugs. Deals have their own card treatment. Prices, images, descriptions, configured Sheen-pick labels, unavailable handling, empty results and image fallbacks are present.

## 6. Cart and customization

Size variants use their actual product identities/prices. Extras belong to each wrap's cart line and multiply with quantity. Distinct configurations remain distinct; identical ones merge. Solo Sheen requires its listed Formal/KF choice. Cart restoration rejects invalid quantities and products and recalculates prices. The bag includes details, quantity/removal, subtotal, delivery/minimum notes and a simple optional fries suggestion.

## 7. Demo order workflow

Checkout validates customer details, delivery address when applicable, fulfilment and minimum order. It prepares a local `DEMO-XXXXXXXX` reference, clears submitted selections and opens a receipt. Repeat submission is guarded. Receipt details survive a refresh in the same tab when sessionStorage is available. In-memory navigation works when storage is blocked. No payment or restaurant transmission is claimed.

## 8. WhatsApp behavior

The preview includes customer, fulfilment, every line's quantity/options/extras, charges, address and notes. Copy is explicit. The unknown restaurant number remains null, so there is no fake WhatsApp destination. A configured valid number enables an explicit customer-controlled WhatsApp link. Status steps on receipts are clearly simulated and manually advanced.

## 9. Advanced interaction

Existing Framer Motion powers gentle desktop mouse-reactive hero perspective, section reveals and dialog transitions. The ingredient presentation changes food framing and explanatory copy on request. Hover, press and selected states support ordering. This is lightweight 2.5D, not a real 3D model. No WebGL, Three.js or GSAP was added.

## 10. Mobile

Animated navigation drawer, fixed Menu/Deals/Find us/Bag actions, horizontal category chips, responsive cards, mobile product sheets and full-height cart drawers. Safe-area padding and 44px primary controls are used. Form/search inputs use 16px on mobile to avoid small-input zoom behavior. The 320px checkout overflow found in browser testing was corrected.

## 11. Accessibility

Native modal background inertness plus explicit Tab/Shift+Tab cycling, Escape and trigger focus restoration. Stable field names with separate error descriptions, focus-visible styling, page/selection semantics, labelled controls, descriptive image alternatives and live quantity/status updates. Reduced-motion behavior is supported. This is not a screen-reader or WCAG certification.

## 12. Performance

Five preserved original PNGs: 37,014,563 bytes. Their WebP copies: 879,326 bytes, about 97.6% smaller. The 37 cached menu WebPs total 1,345,592 bytes. The generated social JPG is 91,558 bytes. Next Image provides responsive variants, with selective hero preload. Normal menu loading needed no Foodpanda CDN requests in the browser test. Fonts are bundled locally and demo rendering does not wait for Supabase. No Lighthouse score is claimed.

## 13. SEO

Root/page metadata, metadataBase configuration, Open Graph/Twitter image, matching favicon/apple icon, robots and sitemap routes. Checkout and receipts are noindex; demo mode noindexes the site, disallows crawling and returns an empty sitemap. Restaurant structured data is gated on verified business configuration, production mode and a configured origin; none is emitted with the current unverified facts.

## 14. Bugs addressed

- Demo slug IDs can no longer fall through to production UUID writes.
- Production partial-insert/card-redirect behavior is no longer executable.
- Public service-role receipt lookup has been replaced by tab-local demo receipts.
- Corrupt cart storage, manipulated prices and invalid quantities are rejected/reconciled.
- Extras persist through cart, checkout, receipt and WhatsApp.
- Required deal choices cannot be skipped.
- Checkout quantity/removal does not open the cart or submit unintentionally.
- Revisiting an old receipt does not erase a later cart.
- Mobile navigation, dialog focus cycling/restoration and validation labels are corrected.
- Original large image delivery, Vercel favicon, inconsistent themes and stale README claims are addressed.

## 15. Packages

Added dev dependencies:
- `@fontsource/barlow-condensed@5.3.0`
- `@fontsource-variable/dm-sans@5.3.0`
- `@playwright/test@1.63.0`
- `sharp@0.35.4`

No direct project packages removed. No new animation/3D runtime was added. An isolated Node 22.23.2 runtime was installed under ignored `.tools/` for verification because the machine's default Node is 20.16.0. Use Node 22.13+ for the project.

## 16. Remaining production requirements

Atomic database transaction/RPC; persistent idempotency; server order validation and rate limiting; approved customization schema and menu synchronization; staff acceptance/fulfilment workflow; secure receipt access; verified delivery rules; privacy/retention terms; monitoring/support; payment provider/webhooks if required; RLS/grant review; real domain/deployment verification. Production ordering is deliberately disabled until this work is complete. Changing the mode variable alone does not enable real orders.

## 17. Owner confirmation needed

Menu/prices, sizes, extras, all deal contents and drink selections; Foodpanda-derived address and hours; delivery fee/minimum/area; phone and WhatsApp; exact map location; social profiles; logo and photography; ingredients/allergens. Ratings, review counts, testimonials, coordinates and delivery ETA remain unset. The local 37-item catalogue and legacy 29-item SQL seed need reconciliation.

## 18. Exact meeting routes

- `/` — homepage and signature interaction
- `/menu` — search, categories and customization
- `/menu#deals` — deal category
- `/checkout` — details, fulfilment and WhatsApp preview
- `/order/DEMO-XXXXXXXX` — use the actual reference generated in the same tab
- `/#find` — location and listing hours

A made-up receipt URL will intentionally show the missing-receipt state. Start at http://127.0.0.1:3000 while the local server is running.

## 19. Three-minute meeting sequence

| Time | Demonstration |
|---|---|
| 0:00–0:30 | Homepage hero, desktop pointer depth, quick scroll to Sheen picks and deals. |
| 0:30–1:10 | Search the menu, open Formal Sheen, select size/cheese and quantity two; show the live total. |
| 1:10–1:35 | Review the bag and extras; open checkout and switch delivery/takeaway. |
| 1:35–2:10 | Enter sample details and open the WhatsApp preview; explain that the owner supplies the verified number. |
| 2:10–2:35 | Prepare the demo receipt and advance the clearly simulated status preview. |
| 2:35–3:00 | Show the phone-sized navigation/menu and location section; ask the owner to confirm content and ordering preferences. |

## 20. Verification actually completed

- Production build: passed using Node 22.23.2 / Next 16.3.0.
- ESLint: passed with no errors or warnings.
- Cart/order unit suite: 18 passed, 0 failed.
- Contrast script: 8 implemented text/background pairs pass 4.5:1.
- Headless installed Google Chrome browser suite: 15 passed, 0 failed, 0 skipped, 0 flaky; 145 seconds.
- Complete route journeys at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px; no page overflow.
- Search/category/no-results, required deal choice, extras/quantity, persistence, focus/Escape, mobile nav, delivery/takeaway, WhatsApp copy, demo completion, status, refresh and old-receipt safety tested.
- Deliberate image-failure, malformed storage, blocked storage, missing receipt and 404 states tested.
- Normal menu image test: all images loaded; no application/console errors; no image CDN or Supabase browser requests.
- Tested checkout flow: no POST or Supabase request.
- Desktop/tablet/mobile screenshots were visually inspected. Artifacts and machine-readable results are in ignored `test-results/`.
- `git diff --check` passed. Windows line-ending notices are informational.
- Not tested: physical iOS/Android devices, Safari/Firefox, screen readers, live Supabase order writes, real payments, real WhatsApp sending, deployed-domain behavior or Lighthouse performance scoring.


## FILES CHANGED (30)

- `.gitignore`
- `README.md`
- `package-lock.json`
- `package.json`
- `src/app/actions.js`
- `src/app/checkout/CheckoutForm.jsx`
- `src/app/checkout/page.js`
- `src/app/favicon.ico`
- `src/app/globals.css`
- `src/app/icon.svg`
- `src/app/layout.js`
- `src/app/menu/page.js`
- `src/app/order/[code]/page.js`
- `src/app/page.js`
- `src/components/menu/AddToCart.jsx`
- `src/components/menu/CategoryNav.jsx`
- `src/components/menu/ItemModal.jsx`
- `src/components/menu/MenuCard.jsx`
- `src/components/motion/Reveal.jsx`
- `src/components/motion/Stagger.jsx`
- `src/components/site/CartDrawer.jsx`
- `src/components/site/SiteFooter.jsx`
- `src/components/site/SiteHeader.jsx`
- `src/lib/cart.jsx`
- `src/lib/menu.js`
- `src/lib/menuData.js`
- `src/lib/menuImages.js`
- `src/lib/menuOptions.js`
- `src/lib/money.js`
- `src/lib/payments/index.js`

## FILES CREATED (75)

- `.env.example`
- `.nvmrc`
- `playwright.config.mjs`
- `public/images/hero-formal-sheen.webp`
- `public/images/menu-af-sheen.webp`
- `public/images/menu-beef-sheen.webp`
- `public/images/menu-formal-sheen.webp`
- `public/images/menu/af-sheen.webp`
- `public/images/menu/beef-sheen.webp`
- `public/images/menu/blueberry-bliss.webp`
- `public/images/menu/cheese.webp`
- `public/images/menu/chili-mayo.webp`
- `public/images/menu/choc-chip-cookie.webp`
- `public/images/menu/coke.webp`
- `public/images/menu/death-by-chocolate.webp`
- `public/images/menu/double-choc-cookie.webp`
- `public/images/menu/double-sawari.webp`
- `public/images/menu/family-sheen.webp`
- `public/images/menu/formal-sheen.webp`
- `public/images/menu/garlic-sauce.webp`
- `public/images/menu/hummus-pita.webp`
- `public/images/menu/jalapeno.webp`
- `public/images/menu/key-lime-pie.webp`
- `public/images/menu/kf-sheen.webp`
- `public/images/menu/limo-soda.webp`
- `public/images/menu/loaded-fries.webp`
- `public/images/menu/loaded-sheen.webp`
- `public/images/menu/lotus-biscoff.webp`
- `public/images/menu/mango-velvet.webp`
- `public/images/menu/mint-choc-chip.webp`
- `public/images/menu/plain-fries.webp`
- `public/images/menu/puff-potatoes.webp`
- `public/images/menu/saucy-fries.webp`
- `public/images/menu/shash-o-panj.webp`
- `public/images/menu/small-a-af.webp`
- `public/images/menu/small-a-beef.webp`
- `public/images/menu/small-a-formal.webp`
- `public/images/menu/small-a-kf.webp`
- `public/images/menu/solo-af.webp`
- `public/images/menu/solo-beef.webp`
- `public/images/menu/solo-sheen.webp`
- `public/images/menu/sprite.webp`
- `public/images/menu/strawberry-cheesecake.webp`
- `public/images/menu/teen-batta-sheen.webp`
- `public/images/sheen-social.jpg`
- `public/images/signature-formal-sheen.webp`
- `scripts/contrast.mjs`
- `scripts/prepare-assets.mjs`
- `src/app/apple-icon.png`
- `src/app/error.js`
- `src/app/loading.js`
- `src/app/not-found.js`
- `src/app/order/[code]/DemoReceipt.jsx`
- `src/app/robots.js`
- `src/app/sitemap.js`
- `src/components/menu/DealCard.jsx`
- `src/components/menu/FoodImage.jsx`
- `src/components/menu/MenuExplorer.jsx`
- `src/components/menu/QuantityControl.jsx`
- `src/components/site/CartLines.jsx`
- `src/components/site/Dialog.jsx`
- `src/components/site/HeroVisual.jsx`
- `src/components/site/Icon.jsx`
- `src/components/site/LocationSection.jsx`
- `src/components/site/Providers.jsx`
- `src/components/site/SignatureExperience.jsx`
- `src/components/site/WhatsAppPreview.jsx`
- `src/lib/cartModel.js`
- `src/lib/catalogue.js`
- `src/lib/orders/demo.js`
- `src/lib/orders/production.js`
- `src/lib/restaurantData.js`
- `tests/browser/demo.spec.js`
- `tests/cart-order.test.mjs`
- `docs/PHASE-2-HANDOFF.md`

## FILES REMOVED (5)

- `scripts/contrast.py`
- `src/app/order/[code]/ClearCartOnMount.jsx`
- `src/components/site/Bloom.jsx`
- `src/components/site/ThemeToggle.jsx`
- `src/lib/theme.jsx`
