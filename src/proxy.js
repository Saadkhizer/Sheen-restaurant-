import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/session";

/**
 * Next.js 16 renamed the `middleware` convention to `proxy` -- the file AND
 * the exported function. Do not rename this back to middleware.js.
 *
 * The matcher is deliberately tiny. If it matched every route, the public
 * homepage and menu -- which need no auth at all -- would wait on a Supabase
 * call before rendering a single byte, and a slow backend would take the
 * whole site down rather than just the admin area.
 */
const PROTECTED = ["/admin"];
const AUTH_PAGES = ["/login"];

export async function proxy(request) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!user && PROTECTED.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && AUTH_PAGES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
