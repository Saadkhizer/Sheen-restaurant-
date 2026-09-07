import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS entirely, so it must never be imported
 * into a Client Component — the "server-only" import above turns that
 * mistake into a build error rather than a leaked key in a JS bundle.
 *
 * Used for exactly two things: writing orders (so the browser can never
 * post a row claiming its own total) and looking up a guest order by code.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
