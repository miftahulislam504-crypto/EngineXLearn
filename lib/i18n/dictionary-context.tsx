'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary-type';
import type { Locale } from '@/lib/i18n/config';

interface DictionaryContextValue {
  dict: Dictionary;
  locale: Locale;
}

const DictionaryContext = createContext<DictionaryContextValue | undefined>(undefined);

/**
 * Provides the current locale's dictionary to every Client Component
 * beneath it. The dictionary itself is resolved server-side (see
 * app/[locale]/layout.tsx, a Server Component) and passed in as a plain
 * prop — this provider's only job is making it available via a hook
 * instead of prop-drilling `dict` through every intermediate component.
 *
 * Server Components don't use this at all; they call getDictionary(locale)
 * directly since they already receive `params.locale` from Next.js routing.
 */
export function DictionaryProvider({
  dict,
  locale,
  children,
}: {
  dict: Dictionary;
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={{ dict, locale }}>{children}</DictionaryContext.Provider>
  );
}

export function useDictionary(): Dictionary {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context.dict;
}

export function useLocale(): Locale {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useLocale must be used within a DictionaryProvider');
  }
  return context.locale;
}
