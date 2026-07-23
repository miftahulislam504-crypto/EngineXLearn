import { NextRequest, NextResponse } from 'next/server';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';

/**
 * Redirects any request without a /en or /bn prefix to the right one.
 * Preference order: an existing `NEXT_LOCALE` cookie (set by the language
 * switcher, see components/i18n/language-switcher.tsx) first, then the
 * browser's Accept-Language header, then DEFAULT_LOCALE.
 *
 * Once a locale prefix is present, this middleware does nothing — it's
 * purely the "no locale in the URL yet" redirect step, not an ongoing
 * gatekeeper.
 */

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.toLowerCase().includes('bn')) {
    return 'bn';
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  const locale = detectLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     * - api routes (they don't need locale prefixing)
     * - Next.js internals (_next/static, _next/image)
     * - files with an extension (favicon.ico, robots.txt, etc.)
     */
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
};
