/**
 * i18n configuration — locales, defaults, and the type contract every
 * dictionary must satisfy.
 *
 * Locale is URL-based (/en/... vs /bn/...), not cookie/localStorage-based:
 * shareable links, working SEO per language, and no mismatch between what
 * a Server Component renders and what a client-side cookie says — all of
 * which matter more for this platform than the marginal convenience of an
 * invisible toggle. See middleware.ts for how a bare path (no locale
 * prefix) gets redirected to the right one.
 */

export const LOCALES = ['en', 'bn'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা',
};
