'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT_LABELS, type Locale } from '@/lib/i18n/config';
import { useLocale, useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Switches the active locale by swapping the /en or /bn prefix on the
 * current path and navigating there — so switching language from a lesson
 * page keeps you on that same lesson, just in the other language, rather
 * than bouncing back to the home page.
 *
 * Also sets the NEXT_LOCALE cookie so a later visit to a bare path (no
 * locale prefix — e.g. a bookmarked "/" or a link from outside the site)
 * respects the choice instead of re-detecting from the browser's
 * Accept-Language header every time. See middleware.ts.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const dict = useDictionary();

  const switchTo = (locale: Locale) => {
    if (locale === currentLocale) return;

    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;

    const segments = pathname.split('/');
    segments[1] = locale; // pathname always starts with "/{locale}/..." past the middleware
    router.push(segments.join('/'));
  };

  return (
    <div
      role="group"
      aria-label={dict.languageSwitcher.label}
      className={`flex items-center gap-0.5 rounded-md border border-border ${compact ? 'p-0.5' : 'p-0.5'}`}
    >
      {LOCALES.map((locale) => (
        <button
          key={locale}
          onClick={() => switchTo(locale)}
          aria-pressed={locale === currentLocale}
          className={`rounded whitespace-nowrap font-mono transition-colors ${
            compact ? 'px-1.5 py-1 text-[10px]' : 'px-2 py-1 text-xs'
          } ${
            locale === currentLocale
              ? 'bg-structural-900 text-vellum-100 dark:bg-vellum-100 dark:text-structural-900'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {compact ? LOCALE_SHORT_LABELS[locale] : LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
