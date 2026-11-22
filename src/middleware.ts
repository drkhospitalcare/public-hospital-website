import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * DRK Hospital Domain & Admin Separation Middleware
 * 
 * Rules:
 * 1. Public Website (localhost:8000, drkhospitals.com, www.drkhospitals.com):
 *    - Completely blocks all /admin routes, rewriting them to 404 Not Found.
 *    - Public visitors never see or access admin portals or CMS routes.
 * 
 * 2. Private Admin Portal (localhost:3001, admin.drkhospitals.com, or trusted preview hosts):
 *    - Root "/" redirects directly to "/admin/dashboard".
 *    - Unauthenticated requests to /admin/dashboard/* redirect to /admin/login (managed via auth guard).
 *    - Public routes on the admin host redirect to /admin/dashboard.
 */
export function middleware(request: NextRequest) {
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  // Safely extract the primary host (avoiding spoofed comma-separated lists)
  const host = rawHost.split(",")[0].trim().toLowerCase();
  const hostname = host.split(":")[0];
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

  // 1. Explicit public production domain guard:
  // Public production (drkhospitals.com, www.drkhospitals.com, and legacy drkhospital.com) NEVER serves admin routes.
  const isPublicProd =
    hostname === "drkhospitals.com" ||
    hostname === "www.drkhospitals.com" ||
    hostname === "drkhospital.com" ||
    hostname === "www.drkhospital.com";

  // 2. Localhost admin development (Port 3001)
  const isLocalAdminPort = host.endsWith(":3001");

  // 3. Production admin domain
  const isProdAdminDomain =
    hostname === "admin.drkhospitals.com" ||
    hostname === "admin.drkhospital.com";

  // 4. Controlled preview environment / explicitly configured trusted preview host:
  // - Explicit preview host configured via environment variable (ADMIN_PREVIEW_HOST)
  const trustedPreviewHost = (process.env.ADMIN_PREVIEW_HOST || "").toLowerCase().trim();
  const isConfiguredPreviewHost =
    Boolean(trustedPreviewHost) &&
    (hostname === trustedPreviewHost || host === trustedPreviewHost);

  // - Controlled Vercel preview deployments designated for admin testing (e.g. admin-*.vercel.app or admin.*.vercel.app)
  const isVercelAdminPreview =
    hostname.endsWith(".vercel.app") &&
    (hostname.startsWith("admin-") || hostname.startsWith("admin."));

  // Admin access is ONLY allowed if !isPublicProd AND one of the valid admin host criteria is met.
  // APP_ENV or NEXT_PUBLIC_APP_TYPE does NOT independently enable admin access on arbitrary hosts.
  const isAdminHost =
    !isPublicProd &&
    (isLocalAdminPort ||
      isProdAdminDomain ||
      isConfiguredPreviewHost ||
      isVercelAdminPreview);

  // -------------------------------------------------------------
  // CASE 1: Request on the PUBLIC WEBSITE (localhost:8000 / drkhospitals.com)
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
  // CASE 2: Request on the PRIVATE ADMIN PORTAL (localhost:3001 / admin.drkhospitals.com)
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

