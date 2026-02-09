import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

const protectedPatterns = [
  "/home",
  "/explore",
  "/scanner",
  "/ceremony",
  "/learn",
  "/map",
  "/marketplace",
  "/wallet",
  "/events",
  "/profile",
  "/ar-try-on",
  "/checkout",
  "/leaderboard",
];

const adminPatterns = ["/admin"];

const artisanPatterns = ["/artisan"];

const authPatterns = ["/login", "/register", "/forgot-password"];

function isPatternMatch(pathname: string, patterns: string[]): boolean {
  const pathWithoutLocale = pathname.replace(
    /^\/(fr|en)/,
    ""
  );

  return patterns.some(
    (pattern) =>
      pathWithoutLocale === pattern ||
      pathWithoutLocale.startsWith(`${pattern}/`)
  );
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);

  const needsProtection = isPatternMatch(pathname, protectedPatterns);
  const needsAdmin = isPatternMatch(pathname, adminPatterns);
  const needsArtisan = isPatternMatch(pathname, artisanPatterns);
  const isAuthPage = isPatternMatch(pathname, authPatterns);

  if (!needsProtection && !needsAdmin && !needsArtisan && !isAuthPage) {
    return intlResponse;
  }

  let session: Session | null = null;
  try {
    const response = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );
    session = response.data;
  } catch {
    session = null;
  }

  const isAuthenticated = !!session?.user;
  const userRole = (session?.user as any)?.role || "USER";

  // Determine locale from pathname
  const localeMatch = pathname.match(/^\/(fr|en)/);
  const locale = localeMatch ? localeMatch[1] : "fr";

  // Auth pages: redirect to /home if already logged in
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(
      new URL(`/${locale}/home`, request.url)
    );
  }

  // Protected routes: redirect to /login if not authenticated
  if ((needsProtection || needsAdmin || needsArtisan) && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes: check role
  if (needsAdmin && userRole !== "ADMIN") {
    return NextResponse.redirect(
      new URL(`/${locale}/home`, request.url)
    );
  }

  // Artisan routes: check role
  if (needsArtisan && userRole !== "ARTISAN" && userRole !== "ADMIN") {
    return NextResponse.redirect(
      new URL(`/${locale}/home`, request.url)
    );
  }

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except for static files and api
    "/((?!api|_next/static|_next/image|favicon.ico|images|audio|models|fonts|icons).*)",
  ],
};
