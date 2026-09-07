-- =====================================================================
-- Sheen — database schema
--
-- Run in the Supabase SQL editor, top to bottom, on a fresh project.
--
-- READ THIS BEFORE EDITING: Postgres checks table-level PRIVILEGES before
-- it ever evaluates a row-level security policy. A perfectly correct
-- policy on a table with no GRANT fails with 42501 permission denied --
-- an error, not just zero rows. Every table below therefore has BOTH a
-- policy and an explicit grant. Do not add a table without both.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums
create type order_status as enum (
  'pending_payment', 'confirmed', 'preparing', 'out_for_delivery',
  'completed', 'cancelled'
);

create type payment_method as enum ('cod', 'card');

create type payment_status as enum (
  'not_required',   -- cash on delivery: nothing to collect online
  'awaiting',       -- card: redirected to gateway, no callback yet
  'paid',
  'failed',
  'refunded'
);

create type fulfilment_type as enum ('delivery', 'takeaway');

-- ------------------------------------------------------------ menu data
create table public.menu_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  sort_order  int  not null default 0,
  is_active   boolean not null default true
);

create table public.menu_items (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.menu_categories(id) on delete restrict,
  slug          text not null unique,
  name          text not null,
  description   text,
  -- Money is stored in PAISA (integer minor units). Never float: 0.1 + 0.2
  -- is not 0.3 in binary floating point, and a rounding error in a price
  -- column is the kind of bug that only shows up in the accounts.
  price_paisa   int  not null check (price_paisa >= 0),
  image_url     text,
  is_popular    boolean not null default false,
  is_available  boolean not null default true,
  sort_order    int not null default 0
);

create index menu_items_category_idx on public.menu_items(category_id);

-- --------------------------------------------------------------- orders
create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  -- Short human code customers can read over the phone. Not the PK: the
  -- PK stays a uuid so codes can never be enumerated to guess order ids.
  code              text not null unique,
  -- Nullable on purpose: guest checkout is the norm here. Accounts can be
  -- layered on later without a migration by populating this column.
  user_id           uuid references auth.users(id) on delete set null,

  customer_name     text not null,
  customer_phone    text not null,
  fulfilment        fulfilment_type not null default 'delivery',
  address_line      text,
  address_notes     text,

  status            order_status   not null default 'pending_payment',
  payment_method    payment_method not null,
  payment_status    payment_status not null default 'not_required',
  payment_reference text,

  subtotal_paisa    int not null check (subtotal_paisa >= 0),
  delivery_paisa    int not null default 0 check (delivery_paisa >= 0),
  total_paisa       int not null check (total_paisa >= 0),

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Delivery orders need somewhere to deliver to.
  constraint delivery_needs_address check (
    fulfilment <> 'delivery' or address_line is not null
  )
);

create index orders_created_idx on public.orders(created_at desc);
create index orders_phone_idx   on public.orders(customer_phone);

create table public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  menu_item_id  uuid references public.menu_items(id) on delete set null,
  -- Denormalised deliberately. If the client renames an item or changes a
  -- price next month, last month's receipts must still say what was
  -- actually sold at what it actually cost.
  name_at_time  text not null,
  price_paisa   int  not null check (price_paisa >= 0),
  quantity      int  not null check (quantity > 0 and quantity <= 50)
);

create index order_items_order_idx on public.order_items(order_id);

-- ----------------------------------------------------- updated_at touch
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- ===================================================================
-- Row Level Security
-- ===================================================================
alter table public.menu_categories enable row level security;
alter table public.menu_items      enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;

-- Menu is public, read-only. Writes happen in the Supabase dashboard or
-- through the service role, never from the browser.
create policy "menu categories are public"
  on public.menu_categories for select
  to anon, authenticated
  using (is_active);

create policy "menu items are public"
  on public.menu_items for select
  to anon, authenticated
  using (is_available);

-- Orders are deliberately NOT readable by anon. There is no anon select
-- policy at all: a guest looks up their order through a server route that
-- uses the service role and checks the code, so one customer can never
-- read another's phone number and address by guessing.
create policy "signed-in users read their own orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

create policy "signed-in users read their own order items"
  on public.order_items for select
  to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = auth.uid()
  ));

-- ===================================================================
-- GRANTS -- the step that is easy to miss and fails loudly when missed.
-- ===================================================================
grant usage on schema public to anon, authenticated;

grant select on public.menu_categories to anon, authenticated;
grant select on public.menu_items      to anon, authenticated;

-- Reads only. Order INSERTs go through the server route on the service
-- role, so the browser can never write a row that claims its own total.
grant select on public.orders      to authenticated;
grant select on public.order_items to authenticated;

-- ===================================================================
-- VERIFY BY IMPERSONATION. Do not read the policies above and assume
-- they work -- run this. A policy that reads correctly and a policy that
-- actually grants access are different things.
-- ===================================================================
-- set local role anon;
-- select count(*) from public.menu_items;        -- expect a number
-- select count(*) from public.orders;            -- expect: permission denied
-- reset role;
--
-- set local role authenticated;
-- set local request.jwt.claims = '{"sub":"<a-real-user-uuid>","role":"authenticated"}';
-- select count(*) from public.orders;            -- expect 0, not an error
-- reset role;
