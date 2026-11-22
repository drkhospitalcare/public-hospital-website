import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * DRK Hospital Unified Same-Domain Routing & Admin Security Middleware
 *
 * Architecture:
 * - Public Website: https://drkhospitals.com (and all public routes: /, /about, /services, /gallery, /contact)
 * - Admin Portal:   https://drkhospitals.com/admin/* (login, dashboard, CMS, gallery)
 *
 * Rules:
 * 1. Public Routes:
 *    - All public pages (/, /about, /services, /gallery, /contact) load normally for all visitors.
 *
 * 2. Admin Entry Route (/admin):
 *    - Unauthenticated requests to /admin redirect to /admin/login.
 *    - Authenticated requests to /admin redirect to /admin/dashboard.
 *
 * 3. Admin Authentication & Protection:
 *    - /admin/login is publicly accessible, but already-authenticated users redirect to /admin/dashboard.
 *    - Unauthenticated requests to /admin/dashboard/* redirect to /admin/login.
 *    - Authenticated requests proceed to the admin layout where secondary server-side cryptographic
 *      verification (verifyServerAdminSession) validates the Supabase JWT and admin role.
 *
 * 4. Local Development Compatibility:
 *    - Local admin development server (localhost:3001) root "/" redirects to /admin/dashboard.
 */
export function middleware(request: NextRequest) {
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const host = rawHost.split(",")[0].trim().toLowerCase();
  const { pathname } = request.nextUrl;

  // Static assets, internal Next.js paths, error components, and public assets
  if (
    pathname.startsWith("/_") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Check for active Supabase Auth Session Cookie
  const allCookies = request.cookies.getAll();
  const hasSupabaseSession = allCookies.some(
    (c) =>
      (c.name.startsWith("sb-") && c.name.endsWith("-auth-token")) ||
      c.name === "sb-access-token" ||
      c.name === "drk_admin_token"
  );

  // Dedicated local admin dev server (localhost:3001) or legacy admin subdomain:
  // Redirect root "/" directly to admin dashboard
  const isDedicatedAdminServer = host.endsWith(":3001") || host.startsWith("admin.");
  if (isDedicatedAdminServer && pathname === "/") {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 1. Admin entry route: /admin or /admin/
  if (pathname === "/admin" || pathname === "/admin/") {
    const destination = hasSupabaseSession ? "/admin/dashboard" : "/admin/login";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 2. Admin login page: /admin/login
  if (pathname === "/admin/login") {
    if (hasSupabaseSession) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 3. Protected admin dashboard routes: /admin/dashboard/*
  if (pathname.startsWith("/admin/dashboard")) {
    if (!hasSupabaseSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Other /admin/* routes
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // 5. All public pages (/, /about, /services, /gallery, /contact, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
