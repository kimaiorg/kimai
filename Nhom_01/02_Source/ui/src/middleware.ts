import { NextRequest, NextResponse } from "next/server";

// Define locales directly in the middleware since we can't import from client components
const locales = ["en", "vi"];
const defaultLocale = "en";

// Pages that have been fully implemented with language switching
// Add pages to this list as they are implemented with language switching
const localizedPages = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-page routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Skip Auth0 callback routes to prevent redirect loops
  if (pathname.includes("/api/auth/callback")) {
    return NextResponse.next();
  }

  // Check if the pathname already starts with a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasLocale) {
    // For paths that already have a locale, we'll let them pass through
    return NextResponse.next();
  }

  // Redirect to the same page with default locale prefix
  // e.g. /dashboard -> /en/dashboard
  const locale = defaultLocale;

  // Special case for the root path
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"]
};
