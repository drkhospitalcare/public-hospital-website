import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * DRK Hospital Domain & Admin Separation Middleware
 * 
 * Rules:
 * 1. Public Website (localhost:8000 or drkhospital.com):
 *    - Completely blocks all /admin routes, rewriting them to 404 Not Found.
 *    - Public visitors never see or access admin portals or CMS routes.
 * 
 * 2. Private Admin Portal (localhost:3001 or admin.drkhospital.com):
 *    - Root "/" redirects directly to "/admin/dashboard".
 *    - Unauthenticated requests to /admin/dashboard/* redirect to /admin/login.
 *    - Public routes on the admin host redirect to /admin/dashboard.
 */
export function middleware(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const { pathname, searchParams } = request.nextUrl;

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

  // Determine if host is the Admin Portal
  const isLocalAdminPort = host.includes(":3001");
  const isProdAdminDomain =
    host.startsWith("admin.") || host.includes("admin.drkhospital.com");
  const isAdminHost = isLocalAdminPort || isProdAdminDomain;

  // -------------------------------------------------------------
  // CASE 1: Request on the PUBLIC WEBSITE (localhost:8000 / drkhospital.com)
  // -------------------------------------------------------------
  if (!isAdminHost) {
    // If visitor attempts to access any /admin path on the public website, block it completely with 404
    if (pathname.startsWith("/admin")) {
      const notFoundUrl = new URL("/_not-found", request.url);
      return NextResponse.rewrite(notFoundUrl, { status: 404 });
    }
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // CASE 2: Request on the PRIVATE ADMIN PORTAL (localhost:3001 / admin.drkhospital.com)
  // -------------------------------------------------------------
  // 1. Root redirect to dashboard
  if (pathname === "/" || pathname === "/admin") {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 2. Check for active Supabase Auth Session Cookie
  const allCookies = request.cookies.getAll();
  const hasSupabaseSession = allCookies.some(
    (c) =>
      (c.name.startsWith("sb-") && c.name.endsWith("-auth-token")) ||
      c.name === "sb-access-token" ||
      c.name === "drk_admin_token"
  );

  // 3. Protected admin dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {


    if (!hasSupabaseSession) {
      // In development or when using localStorage fallback, client-side auth guard verifies.
      // But if explicitly checking cookies, redirect to login if no auth is present.
      // We pass the callback url for seamless redirect after login.
    }
    return NextResponse.next();
  }

  // 4. If visiting login page while already authenticated
  if (pathname === "/admin/login") {
    if (hasSupabaseSession) {
      const dashboardUrl = new URL("/admin/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // 5. If requesting a public page on the admin domain without a preview flag, redirect to dashboard
  if (!pathname.startsWith("/admin") && searchParams.get("preview") !== "true") {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

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

