# Sheen — ordering site

Next.js 16 (App Router, JS) + Tailwind v4 + Supabase. Cash on delivery is
live; card payment is an adapter waiting on a merchant account.

---

## Get it running (about 10 minutes)

```bash
npm install
cp .env.example .env.local     # then fill in the Supabase values
npm run dev                    # http://localhost:3000
```

### Supabase

1. Create a project at supabase.com (the free tier is fine to start).
2. SQL editor → paste **`supabase/schema.sql`** → Run.
3. SQL editor → paste **`supabase/seed.sql`** → Run. That loads all 29 menu
   items with real prices.
4. Project Settings → API → copy the URL, the anon key and the service role
   key into `.env.local`.

Then verify the policies actually grant access, rather than reading them and
assuming. The commented block at the bottom of `schema.sql` impersonates
`anon` and `authenticated` — run it. Postgres checks table privileges
*before* it evaluates a row-level policy, so a correct policy on a table with
no `GRANT` fails with `42501 permission denied`, and it fails as an error
rather than as zero rows.

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Sheen ordering site: initial build"
git branch -M main
git remote add origin https://github.com/<you>/sheen-orders.git
git push -u origin main
```

`.env.local` is already gitignored. Check `git status` before the first
commit anyway — the service role key bypasses row level security entirely,
and a leaked one means anyone can read every customer's phone number and
address.

## Deploy

Vercel is the path of least resistance: import the repo, add the same four
environment variables from `.env.local` in Project Settings → Environment
Variables, deploy. Add the production domain to Supabase → Authentication →
URL Configuration when auth gets added later.

---

## How it's put together

```
src/
  app/
    page.js                  home — hero, popular, signature block, find us
    menu/page.js             full menu, grouped by category
    checkout/                cart review, details, payment choice
    order/[code]/            confirmation, looked up by order code
    actions.js               placeOrder server action
    globals.css              ALL colour lives here
  components/
    site/                    header, footer, hero bloom
    menu/                    menu card, add-to-cart
    motion/                  Reveal, Stagger — reduced-motion aware
  lib/
    supabase/                browser, server, session, admin clients
    payments/                provider adapter
    cart.jsx                 client cart (React state + localStorage)
    money.js                 paisa → display string
    menu.js                  menu queries, timeout-wrapped
  proxy.js                   Next 16's renamed middleware
supabase/
  schema.sql                 tables, RLS policies, grants
  seed.sql                   the real menu
scripts/contrast.py          palette verification
```

### Things that will bite you if you don't know them

**`src/proxy.js`, not `middleware.js`.** Next.js 16 renamed both the file and
the exported function. The matcher is scoped to `/admin` and `/login` only —
if it matched everything, the public homepage would wait on a Supabase call
before rendering a byte, and a slow backend would take down the whole site
instead of just the admin area.

**Never `next/font/google`.** That loader downloads fonts from Google
*during compilation*, on the server. On a network that can't reach
`fonts.googleapis.com` quickly the dev server prints `✓ Ready` and then never
answers the first request, with no error — indistinguishable from a firewall
or VPN problem. The system font stack is used instead. If Sheen supplies a
brand typeface, use `next/font/local` with the file committed here.

**Turbopack.** The project was created with `--no-turbopack`, but Next 16.3
still prints Turbopack in the build banner. It works either way; just know
which one you're reading logs from.

**Money is paisa.** Every price is an integer in minor units. Convert only
at display time with `rupees()` from `lib/money.js`. Floating-point rupees
is how a rounding error gets into an order total.

**The browser never sends a price.** The cart posts item ids and quantities;
`placeOrder` re-reads prices from the database and recomputes the total. A
cart that posts its own total is one a customer can edit in devtools.

---

## Changing the look

Every colour is a CSS custom property in `src/app/globals.css`. No component
contains a hex value, so a rebrand is an edit to `:root` and nothing else.

The palette was derived from Sheen's own menu boards (`#D04129` red,
`#E0581E` orange → hue 14°), re-fitted to a near-black ground. If you change
any colour, re-run:

```bash
python3 scripts/contrast.py
```

All ten pairs currently clear WCAG AA. Two rules worth not breaking:

- **Never white on the accent** — it scores 2.9:1 and fails. Accent-filled
  buttons take `--accent-foreground` (near-black).
- **One saturated hue.** The positive/caution/critical tones are
  deliberately desaturated and reserved for order states, so the page still
  reads as single-accent.

## Adding the client's photography

Menu cards and the hero currently render labelled placeholders. Replace them
with `next/image`, and add the image host to `remotePatterns` in
`next.config.mjs` (Supabase Storage is the simplest place to put them).

- **Hero:** a cut-out (transparent PNG/WebP, background removed). It needs
  the contact shadow that's already in the markup, or it reads as clip art.
- **Menu cards:** leave images in their original frame. Cutting out every
  image flattens the page.
- Don't desaturate food to "match the palette" — the whole point of the dark
  ground is that the food is the only saturated thing on screen.

---

## Turning card payments on

`src/lib/payments/index.js` is an adapter with one unimplemented method.
Cash on delivery is complete and needs nothing.

Card is intentionally not half-built. Stripe doesn't serve Pakistani
merchants, so the realistic options are Safepay, PayFast (PK) or a bank
gateway — and each needs a merchant account, live credentials and a signed
webhook secret that only Sheen can obtain. Until `PAYMENT_PROVIDER` is set,
checkout shows card as "coming soon" rather than offering something that
can't complete.

Once the merchant account exists:

1. Implement `startCardPayment` for the provider (return `{ redirectUrl,
   reference }`).
2. Add a webhook route that verifies the provider's signature and moves
   `payment_status` to `paid` or `failed`.
3. Never mark an order paid from the browser redirect — only from the
   verified webhook. A customer who closes the tab after paying must still
   end up with a paid order, and one who fakes the return URL must not.

## Not built yet

- Admin view for the kitchen (`/admin` is already gated by the proxy).
- Order status notifications (SMS/WhatsApp is the norm locally).
- Accounts. `orders.user_id` is already nullable and pointed at
  `auth.users`, so accounts can be layered on without a migration.
- A delivery-radius check. foodpanda handles this today; taking orders
  directly means someone has to decide how far the shop will deliver.
