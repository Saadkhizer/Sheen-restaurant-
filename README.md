# Sheen — first-meeting website demo

A branded restaurant concept built on the existing Next.js App Router, React, Tailwind CSS and Framer Motion architecture. **Direct ordering and payment are not connected.** The complete demo works without Supabase credentials.

## Run locally

Use **Node 22.13 or later** (the repository's `.nvmrc` selects Node 22). The locked Supabase SDK requires Node 22.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No environment file is needed for demo mode. If a local environment file already sets `NEXT_PUBLIC_ORDER_MODE=production`, change it to `demo` for the meeting and restart/rebuild. Optional variables are documented in `.env.example`.

For a stable meeting build:

```sh
npm run build
npm start
```

Keep the server running during the presentation. Set `NEXT_PUBLIC_SITE_URL` to the eventual preview/production origin before building when absolute metadata URLs matter. Public environment values are fixed at build time.

## Meeting flow

1. `/`: hero, Sheen picks, deals and interactive Formal Sheen ingredient presentation.
2. `/menu`: search, categories and product choices; `/menu#deals` opens the deal category.
3. Customize a Formal Sheen: select size, cheese and quantity. Extras are charged per wrap.
4. Open the bag, then `/checkout`. Use sample customer details; switch delivery/takeaway and preview the WhatsApp message.
5. Prepare a demo order. The generated `/order/DEMO-XXXXXXXX` receipt contains the complete selection and clearly simulated status steps.
6. `/#find`: address, listing hours and a Google Maps address search.

The demo receipt is stored in memory/sessionStorage in the originating tab, checked for a 24-hour lifetime, and unavailable as a public order lookup. It survives a refresh within that tab when browser storage is allowed. No order or payment is sent. The cart stores product selections in localStorage; checkout customer details are kept in sessionStorage only when a demo receipt is prepared. Use sample details during presentations.

WhatsApp is a preview with an explicit copy action while the restaurant number is unknown. When a valid number is configured, an explicit “Open WhatsApp” link becomes available; the customer still decides whether to send. There is no automatic messaging.

## Architecture

- `src/lib/restaurantData.js`: single business configuration, demo/production mode, unknown phone/WhatsApp/map/reviews, and gated structured-data function.
- `src/lib/menuData.js`: 37 listing-derived demonstration products. Existing `supabase/seed.sql` contains an older 29-item catalogue; reconcile both with the owner before production.
- `src/lib/menu.js`: demo adapter returns the local catalogue immediately. Production reads Supabase with a timeout and an explicit unavailable state, never substituting demo slug IDs.
- `src/lib/catalogue.js`: normalized products and safe visual category regrouping.
- `src/lib/cartModel.js`, `cart.jsx`: versioned mode-specific persistence, validated quantities, authoritative catalogue pricing, and per-line size/extras/deal choices.
- `src/lib/orders/demo.js`: customer validation, local preparation, submission deduplication, receipt reading and human-readable WhatsApp summaries.
- `src/lib/orders/production.js`: disabled production boundary and database identity/price reconciliation helper. **This is preparation for future backend work, not a working order service.**
- `src/app/actions.js`: direct server ordering is explicitly disabled. The former partial multi-insert path and public service-role receipt lookup are removed.
- `src/lib/payments/index.js`: card payments remain unsupported; an environment variable cannot turn them on.
- `src/components/site/Dialog.jsx`: native modal semantics, background inertness, Escape, focus restoration, scroll locking and motion.
- `src/components/menu/`: local search/category explorer, food/deal cards, product customization and quantity control.
- `src/components/site/`: shared navigation, 2.5D hero, signature interaction, cart, location, footer and WhatsApp preview.
- Supabase clients, schema and the narrowly matched auth proxy remain for future work. There are no admin/login pages or account features in this phase.

Money remains integer paisa until display. Product identities and extras are regenerated against the catalogue when restoring the cart, so edited browser prices are not trusted. Browser-only demo protections are not a production security boundary.

## Visual system

One intentional cream/teal/orange theme replaces the old theme toggle. Semantic tokens live in `src/app/globals.css`. Barlow Condensed is the display face; DM Sans is the body face. Both are bundled locally through `next/font/local`; builds do not fetch Google fonts.

Framer Motion handles restrained section/modal transitions and pointer-reactive hero depth. Ingredient tabs are manually controlled. Native scrolling remains intact. Reduced-motion settings suppress movement; the hero pointer effect is desktop/mouse-only. No Three.js, WebGL or GSAP dependency was added.

## Images

The five original PNGs are preserved. Their optimized 1400px WebP copies total approximately 879 KB instead of 37 MB. All 37 existing Foodpanda menu image sources have local WebP copies, with the source manifest retained in `menuImages.js`. Components use responsive Next Image sizing, selective hero preload and image-failure placeholders.

Regenerate assets only when needed:

```sh
npm run assets
```

This uses Sharp and the repository's existing image source URLs. It needs network access for uncached menu sources and can use system curl when Node's CDN certificate validation is unavailable. It also generates the social image and matching favicon/apple icon. Originals are never deleted. Confirm final photography and its permitted public use with the owner.

## Verification

```sh
npm run lint
npm test
npm run contrast
npm run build
npm start
# In a separate terminal, with the server running:
npm run test:e2e
```

The browser suite uses an installed Google Chrome through Playwright in an isolated headless profile; it does not use the owner's personal browser session. It tests widths 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920, customer journeys, focus/Escape, search, required choices, persistence, WhatsApp preview and local images. Screenshots, traces and JSON results are written to ignored `test-results/`.

The contrast script measures eight implemented normal-text token pairs. It is a focused check, not a complete accessibility certification. Browser viewport testing is not a substitute for final iOS Safari/Android device and screen-reader checks.

## Before production

1. Obtain owner confirmation of the menu, prices, portion sizes, deal selections, extras, address, hours, delivery fee/minimum/area, phone, WhatsApp number and social profiles.
2. Confirm logo artwork, photography, allergens and other food information. Reviews, ratings, coordinates and restaurant history remain unset.
3. Reconcile the legacy SQL seed with the approved catalogue and migrate customization storage.
4. Implement atomic order creation through a database transaction/RPC, persistent idempotency, server validation and rate limiting.
5. Provide staff acceptance/fulfilment workflow and secure receipt access. Review database grants/RLS before using real customer data.
6. Integrate an approved payment provider only if required, with verified webhooks, failure handling and reconciliation.
7. Add operational delivery rules, retention/privacy terms, monitoring and support procedures.
8. Configure the real domain and verified business structured data. Demo mode deliberately uses noindex, blocks crawling and emits an empty sitemap.
9. Run device, accessibility, security and deployment checks before public launch.

Changing `NEXT_PUBLIC_ORDER_MODE` alone does not enable real ordering. This repository has not been deployed by this phase.

Full implementation details, file manifest and meeting sequence: [Phase 2 handoff](docs/PHASE-2-HANDOFF.md).

On this machine, the verified isolated runtime can start the built demo with:

```powershell
.\.tools\node_modules\node\bin\node.exe node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3000
```
